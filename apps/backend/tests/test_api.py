from __future__ import annotations

from copy import deepcopy

import pytest
from fastapi.testclient import TestClient

import app.main as main


@pytest.fixture()
def storage(monkeypatch):
    submissions: dict[str, dict] = {}
    idempotency_keys: dict[str, str] = {}
    analytics_events: list[dict] = []

    def insert_submission(entry, idempotency_key):
        if idempotency_key and idempotency_key in idempotency_keys:
            return deepcopy(submissions[idempotency_keys[idempotency_key]]), False
        submissions[entry["id"]] = deepcopy(entry)
        if idempotency_key:
            idempotency_keys[idempotency_key] = entry["id"]
        return deepcopy(entry), True

    monkeypatch.setattr(main, "initialize_database", lambda: None)
    monkeypatch.setattr(main, "insert_submission", insert_submission)
    monkeypatch.setattr(main, "find_stored_submission", lambda submission_id: deepcopy(submissions.get(submission_id)))
    monkeypatch.setattr(main, "insert_analytics_event", lambda entry: analytics_events.append(deepcopy(entry)))
    return submissions, analytics_events


@pytest.fixture()
def client(storage):
    main.rate_limits.clear()
    with TestClient(main.app) as test_client:
        yield test_client


def test_health(client: TestClient):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"success": True, "data": {"status": "ok"}}


def test_product_catalog_and_detail(client: TestClient):
    catalog = client.get("/api/products")
    assert catalog.status_code == 200
    assert [item["slug"] for item in catalog.json()["data"]] == ["classic", "petal-pack", "gift-set"]

    detail = client.get("/api/products/petal-pack")
    assert detail.status_code == 200
    assert detail.json()["data"]["name"] == "Senova Petal Pack"

    missing = client.get("/api/products/unknown")
    assert missing.status_code == 404
    assert missing.json()["error"]["code"] == "PRODUCT_NOT_FOUND"


def test_qr_resolve_and_experience(client: TestClient):
    resolved = client.get("/api/qr/pp-2601-a")
    assert resolved.status_code == 200
    assert resolved.json()["data"]["status"] == "active"
    assert resolved.json()["data"]["redirectUrl"].startswith("/experience/petal-pack?")

    experience = client.get("/api/qr/experience/petal-pack?batch=PP-2601-A")
    assert experience.status_code == 200
    assert experience.json()["data"]["productSlug"] == "petal-pack"


def test_submission_validation_persistence_and_public_status(client: TestClient, storage):
    invalid = client.post("/api/submissions", json={"kind": "contact", "payload": {"name": "An"}})
    assert invalid.status_code == 422
    assert invalid.json()["error"]["code"] == "VALIDATION_ERROR"

    payload = {
        "kind": "contact",
        "payload": {
            "name": "<An>",
            "email": "an@example.com",
            "topic": "Tư vấn",
            "message": "Tôi muốn tìm hiểu Calmora.",
            "website": "",
        },
    }
    first = client.post("/api/submissions", json=payload, headers={"Idempotency-Key": "contact-test-001"})
    second = client.post("/api/submissions", json=payload, headers={"Idempotency-Key": "contact-test-001"})
    assert first.status_code == second.status_code == 200
    assert first.json()["data"]["id"] == second.json()["data"]["id"]

    submission_id = first.json()["data"]["id"]
    status = client.get(f"/api/submissions/{submission_id}")
    assert status.status_code == 200
    assert status.json()["data"]["status"] == "new"
    assert "payload" not in status.json()["data"]
    assert storage[0][submission_id]["payload"]["name"] == "An"


def test_analytics_event_is_persisted(client: TestClient, storage):
    response = client.post(
        "/api/analytics/events",
        json={"eventName": "product_view", "productSlug": "classic", "path": "/products/classic"},
    )
    assert response.status_code == 200
    assert len(storage[1]) == 1
