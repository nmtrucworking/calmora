from __future__ import annotations

import os
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime
from uuid import uuid4

import psycopg
import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import text

from app.admin_repository import AdminRepository
from app.core.config import Settings
from app.database import initialize_database
from app.db.session import clear_engine_cache
from app.main import create_app
from app.modules.admin import CSRF_COOKIE, hasher
from app.repository import SqlAlchemyRepository
from app.seed_import import import_seeds

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "")
pytestmark = pytest.mark.skipif(not TEST_DATABASE_URL, reason="TEST_DATABASE_URL is not configured")


def _psycopg_url() -> str:
    return TEST_DATABASE_URL.replace("postgresql+psycopg://", "postgresql://", 1)


@pytest.fixture(scope="module", autouse=True)
def migrated_database():
    assert _psycopg_url().rsplit("/", 1)[-1].split("?", 1)[0].endswith("_test")
    previous_database_url = os.environ.get("DATABASE_URL")
    os.environ["DATABASE_URL"] = _psycopg_url()
    with psycopg.connect(_psycopg_url(), autocommit=True) as connection:
        connection.execute("DROP SCHEMA public CASCADE")
        connection.execute("CREATE SCHEMA public")

    # Rehearse adoption of the unversioned production baseline and preserve a legacy row.
    initialize_database()
    with psycopg.connect(_psycopg_url()) as connection:
        connection.execute(
            """
            INSERT INTO submissions (id, kind, payload, status, created_at, updated_at)
            VALUES ('legacy-contact', 'contact', '{}', 'in_progress', now(), now())
            """
        )

    alembic = Config("alembic.ini")
    command.upgrade(alembic, "20260716_0003")
    clear_engine_cache()
    AdminRepository(SqlAlchemyRepository()).bootstrap_admin(
        "admin@senova.test", "Admin", hasher.hash("Very-Secure-Password-2026")
    )
    command.upgrade(alembic, "head")
    clear_engine_cache()
    yield
    clear_engine_cache()
    if previous_database_url is None:
        os.environ.pop("DATABASE_URL", None)
    else:
        os.environ["DATABASE_URL"] = previous_database_url


def test_legacy_data_is_preserved_and_status_is_migrated():
    with psycopg.connect(_psycopg_url()) as connection:
        row = connection.execute("SELECT kind, status FROM submissions WHERE id = 'legacy-contact'").fetchone()
    assert row == ("contact", "contacted")


def test_seed_is_idempotent_and_api_reads_database():
    first = import_seeds()
    second = import_seeds()
    assert first == {"products": 3, "variants": 6, "policies": 1, "qrRecords": 6, "contents": 6, "overrides": 3}
    assert second == {"products": 0, "variants": 0, "policies": 0, "qrRecords": 0, "contents": 0, "overrides": 0}

    settings = Settings(app_env="test", database_url=_psycopg_url(), receipt_secret="integration-secret")
    app = create_app(settings, SqlAlchemyRepository())
    with TestClient(app) as client:
        assert client.get("/api/products/petal-pack").json()["data"]["name"] == "Senova Petal Pack"
        assert {item["slug"] for item in client.get("/api/v1/products").json()["data"]} == {
            "classic",
            "petal-pack",
            "gift-set",
        }
        assert client.get("/api/v1/products/gift-set").status_code == 200
        assert client.get("/api/v1/cancellation-policies/senova-preorder-v1").status_code == 200
        assert client.get("/api/qr/PP-2601-A").json()["data"]["status"] == "active"

        payload = {
            "kind": "contact",
            "payload": {"name": "An", "email": "an@example.com", "topic": "product", "message": "Hello"},
        }
        first_submit = client.post("/api/submissions", json=payload, headers={"Idempotency-Key": "pg-contact-001"})
        second_submit = client.post("/api/submissions", json=payload, headers={"Idempotency-Key": "pg-contact-001"})
        assert first_submit.status_code == 200
        assert first_submit.json()["data"] == second_submit.json()["data"]

    with psycopg.connect(_psycopg_url()) as connection:
        catalog_tables = connection.execute(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public' "
            "AND tablename IN ('collections', 'collection_products', 'product_media') ORDER BY tablename"
        ).fetchall()
    assert [row[0] for row in catalog_tables] == ["collection_products", "collections", "product_media"]


def test_submission_idempotency_is_safe_under_concurrency():
    repository = SqlAlchemyRepository()
    now = datetime.now(UTC).isoformat()

    def insert_once(index: int):
        entry = {
            "id": f"concurrent-{index}",
            "kind": "contact",
            "payload": {"name": "An"},
            "status": "new",
            "createdAt": now,
            "updatedAt": now,
        }
        return repository.insert_submission(entry, "contact:concurrent-test-001")[0]["id"]

    with ThreadPoolExecutor(max_workers=8) as executor:
        stored_ids = list(executor.map(insert_once, range(8)))
    assert len(set(stored_ids)) == 1


def test_admin_auth_csrf_rbac_audit_and_session_revoke():
    repository = SqlAlchemyRepository()
    admin_repository = AdminRepository(repository)
    admin_repository.bootstrap_admin("admin@senova.test", "Admin", hasher.hash("Very-Secure-Password-2026"))
    settings = Settings(app_env="test", database_url=_psycopg_url(), receipt_secret="integration-secret")
    app = create_app(settings, repository)

    with TestClient(app) as client:
        export_contact = client.post(
            "/api/submissions",
            json={
                "kind": "contact",
                "payload": {
                    "name": "Export Test",
                    "email": "admin-export@example.com",
                    "topic": "product",
                    "message": "Export regression coverage",
                },
            },
            headers={"Idempotency-Key": "admin-export-contact-001"},
        )
        assert export_contact.status_code == 200
        assert client.get("/api/v1/admin/products").status_code == 401
        assert (
            client.post(
                "/api/v1/auth/login", json={"email": "admin@senova.test", "password": "wrong-password"}
            ).status_code
            == 401
        )
        login = client.post(
            "/api/v1/auth/login", json={"email": "admin@senova.test", "password": "Very-Secure-Password-2026"}
        )
        assert login.status_code == 200
        admin_id = login.json()["data"]["id"]
        assert "catalog.publish" in login.json()["data"]["permissions"]
        assert client.get("/api/v1/auth/me").status_code == 200

        products = client.get("/api/v1/admin/products").json()["data"]
        classic = next(item for item in products if item["id"] == "classic")
        assert client.get("/api/v1/admin/products/classic").json()["data"]["slug"] == "classic"
        no_csrf = client.post(
            "/api/v1/admin/products/classic/status",
            json={"status": "active", "expectedVersion": classic["version"]},
        )
        assert no_csrf.status_code == 403
        csrf = client.cookies.get(CSRF_COOKIE)
        changed = client.post(
            "/api/v1/admin/products/classic/status",
            json={"status": "active", "expectedVersion": classic["version"]},
            headers={"X-CSRF-Token": csrf},
        )
        assert changed.status_code == 200
        conflict = client.post(
            "/api/v1/admin/products/classic/status",
            json={"status": "active", "expectedVersion": classic["version"]},
            headers={"X-CSRF-Token": csrf},
        )
        assert conflict.status_code == 409
        dashboard = client.get("/api/v1/admin/dashboard?fromDate=2026-01-01T00:00:00&timezone=Asia%2FSaigon")
        assert dashboard.status_code == 200
        assert dashboard.json()["data"]["range"]["timezone"] == "Asia/Saigon"
        assert client.get("/api/v1/admin/dashboard?timezone=Invalid%2FZone").status_code == 422
        qr_items = client.get("/api/v1/admin/qr").json()["data"]
        qr_item = next(item for item in qr_items if item["code"] == "PP-2601-A")
        qr_data = {key: value for key, value in qr_item.items() if key not in {"id", "version", "updatedAt", "scans"}}
        qr_saved = client.put(
            "/api/v1/admin/qr/PP-2601-A",
            json={"data": qr_data, "expectedVersion": qr_item["version"]},
            headers={"X-CSRF-Token": csrf},
        )
        assert qr_saved.status_code == 200
        qr_item = next(item for item in client.get("/api/v1/admin/qr").json()["data"] if item["code"] == "PP-2601-A")
        qr_data = {key: value for key, value in qr_item.items() if key not in {"id", "version", "updatedAt", "scans"}}
        v2_record = {**qr_data, "contentVersion": "v2", "status": "active"}
        blocked_activation = client.put(
            "/api/v1/admin/qr/PP-2601-A",
            json={"data": v2_record, "expectedVersion": qr_item["version"]},
            headers={"X-CSRF-Token": csrf},
        )
        assert blocked_activation.status_code == 409
        assert (
            client.put(
                "/api/v1/admin/qr-contents/petal-pack/v2/vi",
                json={"data": {"title": "Petal Pack version 2", "guidance": {"title": "Pha trà"}}},
                headers={"X-CSRF-Token": csrf},
            ).status_code
            == 200
        )
        assert client.get("/api/v1/qr/experience/petal-pack?version=v2").status_code == 404
        assert (
            client.post(
                "/api/v1/admin/qr-contents/petal-pack/v2/vi/publish", headers={"X-CSRF-Token": csrf}
            ).status_code
            == 200
        )
        assert client.get("/api/v1/qr/experience/petal-pack?version=v2").status_code == 200
        assert (
            client.put(
                "/api/v1/admin/qr-contents/petal-pack/v2/vi",
                json={"data": {"title": "Mutated"}},
                headers={"X-CSRF-Token": csrf},
            ).status_code
            == 409
        )
        assert (
            client.put(
                "/api/v1/admin/qr/PP-2601-A",
                json={"data": v2_record, "expectedVersion": qr_item["version"]},
                headers={"X-CSRF-Token": csrf},
            ).status_code
            == 200
        )
        assert (
            client.put(
                "/api/v1/admin/qr-overrides/PP-V2-BATCH/petal-pack/v2",
                json={"notice": "Phiên bản theo lô", "guidanceOverride": {"title": "Pha nhẹ"}},
                headers={"X-CSRF-Token": csrf},
            ).status_code
            == 200
        )
        assert (
            client.get("/api/v1/qr/experience/petal-pack?version=v2&batch=PP-V2-BATCH").json()["data"]["batchNotice"]
            == "Phiên bản theo lô"
        )

        lead_page = client.get("/api/v1/admin/submissions?page=1&pageSize=2").json()
        assert lead_page["meta"]["total"] >= 1
        lead_id = lead_page["data"][0]["id"]
        assert (
            client.patch(
                f"/api/v1/admin/submissions/{lead_id}/status",
                json={"status": "contacted"},
                headers={"X-CSRF-Token": csrf},
            ).status_code
            == 200
        )
        assert (
            client.post(
                f"/api/v1/admin/submissions/{lead_id}/activities",
                json={"note": "Called customer"},
                headers={"X-CSRF-Token": csrf},
            ).status_code
            == 200
        )
        assert (
            client.post(
                f"/api/v1/admin/submissions/{lead_id}/assign",
                json={"assigneeId": admin_id},
                headers={"X-CSRF-Token": csrf},
            ).status_code
            == 200
        )
        exported = client.post("/api/v1/admin/submissions/export", headers={"X-CSRF-Token": csrf})
        assert exported.status_code == 200
        assert "admin-export@example.com" in exported.text
        assert any(item["action"] == "catalog.active" for item in client.get("/api/v1/admin/audit-logs").json()["data"])
        assert any(
            item["action"] == "submission.export" for item in client.get("/api/v1/admin/audit-logs").json()["data"]
        )
        assert any(
            item["action"] == "submission.assign" for item in client.get("/api/v1/admin/audit-logs").json()["data"]
        )

        logout = client.post("/api/v1/auth/logout", headers={"X-CSRF-Token": csrf})
        assert logout.status_code == 200
        assert client.get("/api/v1/auth/me").status_code == 401


def test_rbac_is_deny_by_default_for_read_only_role():
    repository = SqlAlchemyRepository()
    viewer_id, role_id = str(uuid4()), str(uuid4())
    with repository.engine.begin() as db:
        db.execute(
            text("INSERT INTO roles(id,code,name,is_system) VALUES (:id,'viewer','Viewer',false)"), {"id": role_id}
        )
        db.execute(
            text(
                "INSERT INTO admin_users(id,email,name,password_hash,status,created_at,updated_at) "
                "VALUES (:id,'viewer@senova.test','Viewer',:password,'active',now(),now())"
            ),
            {"id": viewer_id, "password": hasher.hash("Viewer-Secure-Password-2026")},
        )
        db.execute(
            text("INSERT INTO admin_user_roles(user_id,role_id,granted_at) VALUES (:user,:role,now())"),
            {"user": viewer_id, "role": role_id},
        )
        db.execute(
            text(
                "INSERT INTO role_permissions(role_id,permission_id) "
                "SELECT :role,id FROM permissions WHERE code='catalog.read'"
            ),
            {"role": role_id},
        )
    app = create_app(
        Settings(app_env="test", database_url=_psycopg_url(), receipt_secret="integration-secret"), repository
    )
    with TestClient(app) as client:
        assert (
            client.post(
                "/api/v1/auth/login", json={"email": "viewer@senova.test", "password": "Viewer-Secure-Password-2026"}
            ).status_code
            == 200
        )
        assert client.get("/api/v1/admin/products").status_code == 200
        csrf = client.cookies.get(CSRF_COOKIE)
        denied = client.post(
            "/api/v1/admin/products/classic/status",
            json={"status": "active", "expectedVersion": 2},
            headers={"X-CSRF-Token": csrf},
        )
        assert denied.status_code == 403
        assert denied.json()["error"]["code"] == "PERMISSION_DENIED"


def test_admin_password_reset_revokes_existing_session():
    repository = SqlAlchemyRepository()
    settings = Settings(app_env="test", database_url=_psycopg_url(), receipt_secret="integration-secret")
    app = create_app(settings, repository)
    with TestClient(app) as client:
        login = client.post(
            "/api/v1/auth/login", json={"email": "admin@senova.test", "password": "Very-Secure-Password-2026"}
        )
        assert login.status_code == 200
        reset = client.post("/api/v1/auth/password-reset/request", json={"email": "admin@senova.test"})
        token = reset.json()["data"]["resetToken"]
        confirmed = client.post(
            "/api/v1/auth/password-reset/confirm",
            json={"token": token, "password": "New-Very-Secure-Password-2026"},
        )
        assert confirmed.status_code == 200
        assert client.get("/api/v1/auth/me").status_code == 401
        assert (
            client.post(
                "/api/v1/auth/login", json={"email": "admin@senova.test", "password": "New-Very-Secure-Password-2026"}
            ).status_code
            == 200
        )


def test_content_revision_workflow_keeps_published_revision_immutable():
    repository = SqlAlchemyRepository()
    with repository.engine.begin() as db:
        db.execute(
            text("UPDATE admin_users SET password_hash=:password WHERE email='admin@senova.test'"),
            {"password": hasher.hash("Very-Secure-Password-2026")},
        )
    settings = Settings(app_env="test", database_url=_psycopg_url(), receipt_secret="integration-secret")
    app = create_app(settings, repository)
    with TestClient(app) as client:
        login = client.post(
            "/api/v1/auth/login", json={"email": "admin@senova.test", "password": "Very-Secure-Password-2026"}
        )
        assert login.status_code == 200
        csrf = client.cookies.get(CSRF_COOKIE)
        headers = {"X-CSRF-Token": csrf}
        created = client.post(
            "/api/v1/admin/content-items",
            json={
                "key": "journal/lotus-origin.vi",
                "contentType": "journal",
                "locale": "vi",
                "data": {"title": "Nguồn gốc sen"},
                "sourceNote": "Editorial source A",
            },
            headers=headers,
        )
        assert created.status_code == 201
        item_id, revision_id = created.json()["data"].values()
        assert client.get("/api/v1/content/journal/lotus-origin.vi").status_code == 404

        updated = client.patch(
            f"/api/v1/admin/content-revisions/{revision_id}",
            json={"data": {"title": "Nguồn gốc hoa sen"}, "sourceNote": "Source A", "expectedVersion": 1},
            headers=headers,
        )
        assert updated.status_code == 200
        assert (
            client.post(
                f"/api/v1/admin/content-revisions/{revision_id}/submit-review",
                json={"expectedVersion": 2},
                headers=headers,
            ).status_code
            == 200
        )
        assert (
            client.post(
                f"/api/v1/admin/content-revisions/{revision_id}/publish",
                json={"expectedVersion": 3},
                headers=headers,
            ).status_code
            == 200
        )
        public = client.get("/api/v1/content/journal/lotus-origin.vi")
        assert public.status_code == 200
        assert public.json()["data"]["data"]["title"] == "Nguồn gốc hoa sen"
        immutable = client.patch(
            f"/api/v1/admin/content-revisions/{revision_id}",
            json={"data": {"title": "Mutated"}, "expectedVersion": 4},
            headers=headers,
        )
        assert immutable.status_code == 409

        next_revision = client.post(f"/api/v1/admin/content-items/{item_id}/revisions", headers=headers).json()["data"][
            "revisionId"
        ]
        assert (
            client.post(
                f"/api/v1/admin/content-revisions/{next_revision}/submit-review",
                json={"expectedVersion": 1},
                headers=headers,
            ).status_code
            == 200
        )
        assert (
            client.post(
                f"/api/v1/admin/content-revisions/{next_revision}/return-draft",
                json={"expectedVersion": 2, "note": "Cần bổ sung nguồn"},
                headers=headers,
            ).status_code
            == 200
        )
        assert client.post(f"/api/v1/admin/content-items/{item_id}/unpublish", headers=headers).status_code == 200
        assert client.get("/api/v1/content/journal/lotus-origin.vi").status_code == 404


def test_traceability_activation_and_database_ledger_proof():
    repository = SqlAlchemyRepository()
    AdminRepository(repository).bootstrap_admin(
        "trace-admin@senova.test", "Trace Admin", hasher.hash("Trace-Secure-Password-2026")
    )
    settings = Settings(
        app_env="test",
        database_url=_psycopg_url(),
        receipt_secret="integration-secret",
        trace_secret_pepper="trace-integration-pepper",
    )
    app = create_app(settings, repository)

    with TestClient(app) as client:
        login = client.post(
            "/api/v1/auth/login",
            json={"email": "trace-admin@senova.test", "password": "Trace-Secure-Password-2026"},
        )
        assert login.status_code == 200
        csrf = client.cookies.get(CSRF_COOKIE)
        headers = {"X-CSRF-Token": csrf}

        created = client.post(
            "/api/v1/admin/trace/batches",
            json={
                "batchCode": "PP-TRACE-INTEGRATION",
                "productSlug": "petal-pack",
                "contentVersion": "v2",
                "productionDate": "2026-07-21",
                "sourceSummary": {"lotusRegion": "Đồng Tháp"},
            },
            headers=headers,
        )
        assert created.status_code == 200
        batch_id = created.json()["data"]["id"]
        event = client.post(
            f"/api/v1/admin/trace/batches/{batch_id}/events",
            json={
                "eventType": "lotus_received",
                "occurredAt": "2026-07-20T02:30:00Z",
                "locationCode": "VN-DT",
                "payload": {"supplier": "pilot"},
            },
            headers=headers,
        )
        assert event.status_code == 200
        approved = client.post(f"/api/v1/admin/trace/batches/{batch_id}/approve", headers=headers)
        assert approved.status_code == 200

        issue = client.post(
            f"/api/v1/admin/trace/batches/{batch_id}/units/issue",
            json={"quantity": 1, "codeProfile": "petal-pack-v1", "exportFormat": "csv"},
            headers=headers,
        )
        assert issue.status_code == 200
        issued = issue.json()["data"]["units"][0]
        assert issued["secretCode"] not in issue.request.headers.values()

        unit_id, version = issued["unitId"], 1
        for action in ("mark-printed", "mark-packed", "mark-distributed"):
            transitioned = client.post(
                f"/api/v1/admin/trace/units/{unit_id}/transition",
                json={"action": action, "expectedVersion": version},
                headers=headers,
            )
            assert transitioned.status_code == 200
            version = transitioned.json()["data"]["version"]

        public_code = issued["publicCode"]
        resolved = client.get(f"/api/v1/qr/{public_code}").json()["data"]
        assert resolved["flowType"] == "unit-trace"
        assert resolved["traceUrl"] == f"/trace/{public_code}"
        assert (
            client.get(f"/api/v1/trace/units/{public_code}").json()["data"]["verification"]["status"]
            == "valid-unactivated"
        )

        activated = client.post(
            f"/api/v1/trace/units/{public_code}/activate",
            json={"secretCode": issued["secretCode"], "clientToken": "integration-browser"},
            headers={"Idempotency-Key": "activate-integration-001"},
        )
        assert activated.status_code == 200
        assert activated.json()["data"]["result"] == "activated"
        replay = client.post(
            f"/api/v1/trace/units/{public_code}/activate",
            json={"secretCode": issued["secretCode"], "clientToken": "integration-browser"},
            headers={"Idempotency-Key": "activate-integration-001"},
        )
        assert replay.status_code == 200

        processed = client.post("/api/v1/admin/trace/anchors/process", headers=headers)
        assert processed.status_code == 200
        proof = client.get(f"/api/v1/trace/units/{public_code}/proof").json()["data"]
        assert proof["anchorStatus"] == "confirmed"
        assert proof["match"] is True
        assert proof["transactionId"].startswith("db:")
