from __future__ import annotations

import os
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime

import psycopg
import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.database import initialize_database
from app.db.session import clear_engine_cache
from app.main import create_app
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
    assert first == {"products": 3, "variants": 6, "qrRecords": 6, "contents": 3, "overrides": 2}
    assert second == {"products": 0, "variants": 0, "qrRecords": 0, "contents": 0, "overrides": 0}

    settings = Settings(app_env="test", database_url=_psycopg_url(), receipt_secret="integration-secret")
    app = create_app(settings, SqlAlchemyRepository())
    with TestClient(app) as client:
        assert client.get("/api/products/petal-pack").json()["data"]["name"] == "Senova Petal Pack"
        assert client.get("/api/qr/PP-2601-A").json()["data"]["status"] == "active"

        payload = {
            "kind": "contact",
            "payload": {"name": "An", "email": "an@example.com", "topic": "product", "message": "Hello"},
        }
        first_submit = client.post("/api/submissions", json=payload, headers={"Idempotency-Key": "pg-contact-001"})
        second_submit = client.post("/api/submissions", json=payload, headers={"Idempotency-Key": "pg-contact-001"})
        assert first_submit.json()["data"] == second_submit.json()["data"]


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
