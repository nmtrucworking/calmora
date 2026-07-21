"""Refresh untouched Petal Pack brewing and QR ritual seed data."""

import json
from pathlib import Path

import sqlalchemy as sa
from alembic import context, op

from app.seed.cutover import build_cutover_contents
from app.seed_import import canonical_hash

revision = "20260722_0008"
down_revision = "20260721_0007"
branch_labels = None
depends_on = None

SEED_DIR = Path(__file__).resolve().parents[2] / "app" / "seed"
PREVIOUS_PRODUCT_HASH = "7ee80a5e5c2b71e16281d91cebec12b87e5f74d1e9dfdd92a502184a28dbbf58"
PREVIOUS_CONTENT_HASH = "291962e8fe036addc29dc5dede1130acb32a51274334d506e54bc97538bc9936"
PREVIOUS_V1_CONTENT_HASH = "c30a312411c677ea98dfa9647b778c4ab35ed438d581de58ac96094a44858a7a"


def upgrade() -> None:
    if context.is_offline_mode():
        return

    bind = op.get_bind()
    products = json.loads((SEED_DIR / "products.json").read_text(encoding="utf-8"))
    product = next(item for item in products if item["id"] == "petal-pack")
    product_hash = canonical_hash(product)
    current_product_hash = bind.execute(
        sa.text("SELECT seed_hash FROM products WHERE id='petal-pack'")
    ).scalar_one_or_none()
    if current_product_hash == PREVIOUS_PRODUCT_HASH:
        bind.execute(
            sa.text(
                "UPDATE products SET data=CAST(:data AS jsonb),seed_hash=:hash,updated_at=now() "
                "WHERE id='petal-pack'"
            ),
            {"data": json.dumps(product, ensure_ascii=False), "hash": product_hash},
        )

    content = next(
        item for item in build_cutover_contents(SEED_DIR)
        if item["productSlug"] == "petal-pack"
    )
    content_hash = canonical_hash(content)
    current_content_hash = bind.execute(
        sa.text(
            "SELECT seed_hash FROM qr_experience_contents "
            "WHERE product_id='petal-pack' AND version=:version AND locale='vi'"
        ),
        {"version": content["version"]},
    ).scalar_one_or_none()
    if current_content_hash == PREVIOUS_CONTENT_HASH:
        bind.execute(
            sa.text(
                "UPDATE qr_experience_contents SET data=CAST(:data AS jsonb),seed_hash=:hash,updated_at=now() "
                "WHERE product_id='petal-pack' AND version=:version AND locale='vi'"
            ),
            {
                "data": json.dumps(content, ensure_ascii=False),
                "hash": content_hash,
                "version": content["version"],
            },
        )

    legacy_contents = json.loads(
        (SEED_DIR / "qr_experience_content.json").read_text(encoding="utf-8")
    )
    legacy_content = next(
        item for item in legacy_contents
        if item["productSlug"] == "petal-pack" and item["version"] == "v1"
    )
    legacy_hash = canonical_hash(legacy_content)
    current_legacy_hash = bind.execute(
        sa.text(
            "SELECT seed_hash FROM qr_experience_contents "
            "WHERE product_id='petal-pack' AND version='v1' AND locale='vi'"
        )
    ).scalar_one_or_none()
    if current_legacy_hash == PREVIOUS_V1_CONTENT_HASH:
        bind.execute(
            sa.text(
                "UPDATE qr_experience_contents SET data=CAST(:data AS jsonb),seed_hash=:hash,updated_at=now() "
                "WHERE product_id='petal-pack' AND version='v1' AND locale='vi'"
            ),
            {"data": json.dumps(legacy_content, ensure_ascii=False), "hash": legacy_hash},
        )


def downgrade() -> None:
    # This content migration deliberately preserves the newer ritual contract.
    pass
