from datetime import UTC, datetime
from pathlib import Path

from app.admin_repository import AdminRepository
from app.seed.cutover import CUTOVER_VERSION, build_cutover_contents, build_cutover_override
from app.seed_import import SEED_DIR, load_and_validate


def test_cutover_content_preserves_visible_frontend_copy_and_metadata():
    contents = build_cutover_contents(Path(SEED_DIR))
    assert {item["productSlug"] for item in contents} == {"classic", "petal-pack", "gift-set"}
    assert {item["version"] for item in contents} == {CUTOVER_VERSION}
    petal = next(item for item in contents if item["productSlug"] == "petal-pack")
    assert petal["title"] == "Mở một cánh sen, bắt đầu một khoảng lặng."
    assert len(petal["guidance"]["steps"]) == 6
    assert petal["culture"]["title"]
    assert petal["cta"]["primary"]["href"]


def test_cutover_seed_is_idempotently_addressable():
    seed = load_and_validate()
    keys = [(item["productSlug"], item["version"], item.get("locale", "vi")) for item in seed["qr_experience_content"]]
    assert len(keys) == len(set(keys))
    assert sum(version == CUTOVER_VERSION for _, version, _ in keys) == 3
    override = build_cutover_override(Path(SEED_DIR))
    assert override["contentVersion"] == CUTOVER_VERSION


def test_admin_contract_flattens_jsonb_and_uses_camel_case():
    item = AdminRepository._resource(
        {
            "id": "classic",
            "data": {"slug": "classic", "name": "Senova Classic"},
            "version": 3,
            "updated_at": datetime(2026, 7, 18, tzinfo=UTC),
        }
    )
    assert item == {
        "id": "classic",
        "slug": "classic",
        "name": "Senova Classic",
        "version": 3,
        "updatedAt": "2026-07-18T00:00:00+00:00",
    }
    assert "data" not in item and "updated_at" not in item


def test_admin_lead_contract_hides_raw_payload_shape():
    item = AdminRepository._lead(
        {
            "id": "submission-1",
            "kind": "contact",
            "status": "new",
            "payload": {"name": "An", "email": "an@example.com", "message": "Xin chào"},
            "assigned_to": None,
            "assigned_name": None,
            "created_at": None,
            "updated_at": None,
        },
        include_activities=False,
    )
    assert item["customer"] == {"name": "An", "email": "an@example.com", "phone": None}
    assert item["message"] == "Xin chào"
    assert "payload" not in item
