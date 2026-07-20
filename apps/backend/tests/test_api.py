from __future__ import annotations

from copy import deepcopy

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app


class MemoryRepository:
    def __init__(self):
        self.submissions: dict[str, dict] = {}
        self.idempotency_keys: dict[str, str] = {}
        self.analytics_events: list[dict] = []
        self.initialized = False

    def initialize(self):
        self.initialized = True

    def insert_submission(self, entry, idempotency_key):
        if idempotency_key and idempotency_key in self.idempotency_keys:
            return deepcopy(self.submissions[self.idempotency_keys[idempotency_key]]), False
        self.submissions[entry["id"]] = deepcopy(entry)
        if idempotency_key:
            self.idempotency_keys[idempotency_key] = entry["id"]
        return deepcopy(entry), True

    def get_submission(self, submission_id):
        return deepcopy(self.submissions.get(submission_id))

    def insert_analytics_event(self, entry):
        self.analytics_events.append(deepcopy(entry))


@pytest.fixture()
def storage():
    return MemoryRepository()


@pytest.fixture()
def client(storage):
    settings = Settings(app_env="test", database_url="", receipt_secret="test-receipt-secret")
    app = create_app(settings=settings, repository=storage)
    with TestClient(app) as test_client:
        yield test_client


def test_health_version_compatibility_and_request_id(client: TestClient, storage):
    response = client.get("/api/health", headers={"X-Request-ID": "request-test-001"})
    assert response.status_code == 200
    assert response.headers["x-request-id"] == "request-test-001"
    assert response.json() == {"success": True, "data": {"status": "ok"}}
    assert client.get("/api/v1/health").status_code == 200
    assert storage.initialized


def test_startup_bootstraps_configured_admin(monkeypatch, storage):
    created = {}

    class BootstrapRepository:
        def __init__(self, repository):
            assert repository is storage

        def bootstrap_admin(self, email, name, password_hash):
            created.update(email=email, name=name, password_hash=password_hash)

    class FakeHasher:
        @staticmethod
        def hash(password):
            return f"hashed:{password}"

    monkeypatch.setattr("app.main.AdminRepository", BootstrapRepository)
    monkeypatch.setattr("app.main.admin.hasher", FakeHasher())
    settings = Settings(
        app_env="test",
        database_url="",
        receipt_secret="test-receipt-secret",
        admin_email="Admin@Senova.vn",
        admin_name="Administrator",
        admin_password="a-secure-admin-password",
    )

    with TestClient(create_app(settings=settings, repository=storage)):
        pass

    assert created == {
        "email": "admin@senova.vn",
        "name": "Administrator",
        "password_hash": "hashed:a-secure-admin-password",
    }


def test_product_catalog_detail_and_http_cache(client: TestClient):
    catalog = client.get("/api/products")
    assert catalog.status_code == 200
    assert [item["slug"] for item in catalog.json()["data"]] == ["classic", "petal-pack", "gift-set"]
    assert catalog.headers["cache-control"] == "public, max-age=60"
    assert client.get("/api/products", headers={"If-None-Match": catalog.headers["etag"]}).status_code == 304
    assert client.get("/api/v1/products/petal-pack").json()["data"]["name"] == "Senova Petal Pack"
    assert [item["slug"] for item in client.get("/api/v1/products").json()["data"]] == [
        "classic",
        "petal-pack",
        "gift-set",
    ]
    assert client.get("/api/products/gift-set").status_code == 200
    assert client.get("/api/v1/products/gift-set").status_code == 200
    policy = client.get("/api/v1/cancellation-policies/senova-preorder-v1")
    assert policy.status_code == 200
    assert policy.json()["data"]["stages"]["paidBeforePreparation"]["refundPercent"] == 90
    assert client.get("/api/v1/cancellation-policies/unknown").status_code == 404
    missing = client.get("/api/products/unknown")
    assert missing.status_code == 404
    assert missing.json()["error"]["code"] == "PRODUCT_NOT_FOUND"


def test_catalog_etag_changes_when_published_data_changes(client: TestClient):
    first = client.get("/api/v1/products")
    repository = client.app.state.services.catalog.repository
    repository._products[0]["name"] = "Senova Classic Updated"
    second = client.get("/api/v1/products")
    assert first.headers["etag"] != second.headers["etag"]


def test_product_contract_exposes_assumption_and_fulfillment_data(client: TestClient):
    product = client.get("/api/v1/products/petal-pack").json()["data"]
    assert product["commerce"]["priceType"] == "CONTACT"
    assert product["specification"]["isAssumption"] is True
    assert product["specification"]["verificationStatus"] == "IN_TESTING"
    assert product["specification"]["contentVersion"] == "p0.2"
    assert product["variants"][0]["preparationTime"]["isAssumption"] is True
    assert product["fulfillment"]["deliveryScopes"][0]["code"] == "HCM"


def test_qr_resolve_inactive_states_and_experience(client: TestClient):
    resolved = client.get("/api/qr/pp-2601-a")
    assert resolved.json()["data"]["redirectUrl"].startswith("/experience/petal-pack?")
    assert resolved.json()["data"]["contentVersion"] == "fe-cutover-2026-07"
    assert client.get("/api/qr/PP-2509-X").json()["data"]["status"] == "paused"
    assert client.get("/api/qr/CL-2501-Z").json()["data"]["status"] == "expired"
    assert client.get("/api/qr/GS-2508-R").json()["data"]["status"] == "revoked"
    experience = client.get("/api/qr/experience/petal-pack?batch=PP-2601-A")
    assert experience.json()["data"]["productSlug"] == "petal-pack"
    cutover = client.get("/api/qr/experience/petal-pack?version=fe-cutover-2026-07&batch=PP-2601-A")
    assert cutover.json()["data"]["title"] == "Mở một cánh sen, bắt đầu một khoảng lặng."
    assert cutover.json()["data"]["batchNotice"]


def test_submission_receipt_idempotency_and_no_public_enumeration(client: TestClient, storage):
    payload = {
        "kind": "contact",
        "payload": {"name": "<An>", "email": "an@example.com", "topic": "Tu van", "message": "Xin chao", "website": ""},
    }
    first = client.post("/api/submissions", json=payload, headers={"Idempotency-Key": "contact-test-001"})
    second = client.post("/api/submissions", json=payload, headers={"Idempotency-Key": "contact-test-001"})
    assert first.json()["data"] == second.json()["data"]
    receipt = first.json()["data"]
    assert client.get(f"/api/submissions/{receipt['id']}").status_code == 422
    assert client.get(f"/api/submissions/{receipt['id']}?receiptToken=invalid-token-value-12345").status_code == 404
    status = client.get(f"/api/submissions/{receipt['id']}?receiptToken={receipt['receiptToken']}")
    assert status.json()["data"]["status"] == "new"
    assert "payload" not in status.json()["data"]
    assert storage.submissions[receipt["id"]]["payload"]["name"] == "An"


def test_preorder_requires_items_and_snapshots_server_catalog(client: TestClient, storage):
    base = {
        "name": "An",
        "email": "an@example.com",
        "phone": "0900000000",
        "zalo": "0900000000",
        "policyConsent": True,
    }
    invalid = client.post("/api/submissions", json={"kind": "pre-order", "payload": {**base, "itemCount": 1}})
    assert invalid.status_code == 422
    response = client.post(
        "/api/submissions",
        json={
            "kind": "pre-order",
            "payload": {
                **base,
                "items": [
                    {"productId": "petal-pack", "variantId": "petal-single", "quantity": 2, "productName": "forged"}
                ],
            },
        },
    )
    assert response.status_code == 200
    stored = storage.submissions[response.json()["data"]["id"]]["payload"]["items"][0]
    assert stored["productName"] == "Senova Petal Pack"
    assert stored["variantName"] != "forged"


def test_preorder_requires_zalo_and_policy_consent(client: TestClient):
    payload = {
        "name": "An",
        "email": "an@example.com",
        "phone": "0900000000",
        "items": [{"productId": "classic", "quantity": 1}],
    }
    missing_zalo = client.post("/api/submissions", json={"kind": "pre-order", "payload": payload})
    assert missing_zalo.status_code == 422
    assert "zalo" in missing_zalo.json()["error"]["message"]

    missing_policy = client.post(
        "/api/submissions",
        json={"kind": "pre-order", "payload": {**payload, "zalo": "0900000000"}},
    )
    assert missing_policy.status_code == 422
    assert "policyConsent" in missing_policy.json()["error"]["message"]


def test_analytics_allowlist_and_persistence(client: TestClient, storage):
    accepted = client.post("/api/analytics/events", json={"eventName": "product_view", "productSlug": "classic"})
    assert accepted.status_code == 200
    assert len(storage.analytics_events) == 1
    rejected = client.post("/api/analytics/events", json={"eventName": "arbitrary_pii_dump"})
    assert rejected.status_code == 422


def test_payload_limit(client: TestClient):
    response = client.post("/api/submissions", content=b"x" * 70_000, headers={"Content-Type": "application/json"})
    assert response.status_code == 413
    assert response.json()["error"]["code"] == "PAYLOAD_TOO_LARGE"
