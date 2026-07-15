from app.db.schema import metadata
from app.db.session import sqlalchemy_url
from app.seed_import import canonical_hash, load_and_validate


def test_sqlalchemy_url_uses_psycopg_driver():
    assert sqlalchemy_url("postgresql://user:pass@localhost/senova") == (
        "postgresql+psycopg://user:pass@localhost/senova"
    )


def test_m1_metadata_contains_durable_public_tables():
    assert {
        "products",
        "product_variants",
        "qr_records",
        "qr_experience_contents",
        "qr_batch_overrides",
        "submissions",
        "analytics_events",
    } <= set(metadata.tables)


def test_seed_is_valid_and_hash_is_stable():
    seed = load_and_validate()
    assert [product["slug"] for product in seed["products"]] == ["classic", "petal-pack", "gift-set"]
    assert canonical_hash({"b": 2, "a": 1}) == canonical_hash({"a": 1, "b": 2})
