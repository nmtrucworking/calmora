from __future__ import annotations

import sqlite3

import pytest
from fastapi.testclient import TestClient

from app.main import app, rate_limits


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{tmp_path / 'test.db'}")
    rate_limits.clear()
    with TestClient(app) as test_client:
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


def test_submission_validation_persistence_and_public_status(client: TestClient, tmp_path, monkeypatch):
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

    db_path = tmp_path / "test.db"
    with sqlite3.connect(db_path) as db:
        row = db.execute("SELECT payload_json FROM submissions WHERE id = ?", (submission_id,)).fetchone()
    assert row is not None
    assert '"name": "An"' in row[0]


def test_analytics_event_is_persisted(client: TestClient, tmp_path):
    response = client.post(
        "/api/analytics/events",
        json={"eventName": "product_view", "productSlug": "classic", "path": "/products/classic"},
    )
    assert response.status_code == 200

    with sqlite3.connect(tmp_path / "test.db") as db:
        count = db.execute("SELECT COUNT(*) FROM analytics_events").fetchone()[0]
    assert count == 1
