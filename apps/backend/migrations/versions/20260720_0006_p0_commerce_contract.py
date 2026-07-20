"""Add the P0 commerce contract and safely refresh untouched catalog seeds."""

import json
from pathlib import Path

import sqlalchemy as sa
from alembic import context, op

from app.db.schema import metadata
from app.seed_import import canonical_hash

revision = "20260720_0006"
down_revision = "20260718_0005"
branch_labels = None
depends_on = None

SEED_DIR = Path(__file__).resolve().parents[2] / "app" / "seed"
PREVIOUS_PRODUCT_HASHES = {
    "classic": "229150fb6794221ff3b8dc0f56928c2b6d581fc87eaf1825c4082479677a7215",
    "petal-pack": "a3ae67fab193662064a68c4747bd633f521b925bafce6fe302bd2725628cf826",
    "gift-set": "cf478150343f326dd169c86a0758086d3da8714de091185643cb1240a10ea3e5",
}


def upgrade() -> None:
    bind = op.get_bind()
    metadata.tables["cancellation_policies"].create(bind=bind, checkfirst=not context.is_offline_mode())
    if context.is_offline_mode():
        return

    products = json.loads((SEED_DIR / "products.json").read_text(encoding="utf-8"))
    for product in products:
        current_hash = bind.execute(
            sa.text("SELECT seed_hash FROM products WHERE id=:id"), {"id": product["id"]}
        ).scalar_one_or_none()
        if current_hash != PREVIOUS_PRODUCT_HASHES[product["id"]]:
            continue
        bind.execute(
            sa.text(
                "UPDATE products SET slug=:slug,name=:name,status=:status,data=CAST(:data AS jsonb),"
                "seed_hash=:seed_hash,updated_at=now() WHERE id=:id"
            ),
            {
                "id": product["id"],
                "slug": product["slug"],
                "name": product["name"],
                "status": product["status"],
                "data": json.dumps(product, ensure_ascii=False),
                "seed_hash": canonical_hash(product),
            },
        )
        for variant in product["variants"]:
            bind.execute(
                sa.text(
                    "UPDATE product_variants SET name=:name,data=CAST(:data AS jsonb),updated_at=now() WHERE id=:id"
                ),
                {
                    "id": f"{product['id']}:{variant['id']}",
                    "name": variant["label"],
                    "data": json.dumps({**variant, "productId": product["id"]}, ensure_ascii=False),
                },
            )


def downgrade() -> None:
    metadata.tables["cancellation_policies"].drop(bind=op.get_bind(), checkfirst=not context.is_offline_mode())
