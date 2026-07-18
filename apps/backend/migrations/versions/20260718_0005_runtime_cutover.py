# ruff: noqa: E501
"""Add FE-preserving QR content cutover without overwriting operational data."""

from __future__ import annotations

import json
from pathlib import Path

import sqlalchemy as sa
from alembic import op

from app.seed.cutover import CUTOVER_VERSION, build_cutover_contents, build_cutover_override
from app.seed_import import canonical_hash

revision = "20260718_0005"
down_revision = "20260716_0004"
branch_labels = None
depends_on = None

SEED_DIR = Path(__file__).resolve().parents[2] / "app" / "seed"
QR_CODES = ("PP-2601-A", "CL-2601-A", "GS-2601-A")


def _product_exists(bind, product_id: str) -> bool:
    return (
        bind.execute(sa.text("SELECT 1 FROM products WHERE id=:product"), {"product": product_id}).scalar_one_or_none()
        is not None
    )


def _insert_content(bind, content: dict) -> None:
    # A fresh database has the catalog tables but no products until the
    # separate seed-import step runs. Leave those rows to seed_import instead
    # of violating the content -> product foreign key during migration.
    if not _product_exists(bind, content["productSlug"]):
        return
    existing = bind.execute(
        sa.text(
            "SELECT data FROM qr_experience_contents WHERE product_id=:product AND version=:version AND locale=:locale"
        ),
        {"product": content["productSlug"], "version": CUTOVER_VERSION, "locale": "vi"},
    ).scalar_one_or_none()
    if existing is not None:
        if canonical_hash(existing) != canonical_hash(content):
            raise RuntimeError(f"Cutover content collision for {content['productSlug']}:{CUTOVER_VERSION}:vi")
        return
    bind.execute(
        sa.text(
            "INSERT INTO qr_experience_contents(product_id,version,locale,status,data,seed_key,seed_hash,created_at,updated_at) "
            "VALUES (:product,:version,'vi','published',CAST(:data AS jsonb),:key,:hash,now(),now())"
        ),
        {
            "product": content["productSlug"],
            "version": CUTOVER_VERSION,
            "data": json.dumps(content, ensure_ascii=False),
            "key": f"content:{content['productSlug']}:{CUTOVER_VERSION}:vi",
            "hash": canonical_hash(content),
        },
    )


def upgrade() -> None:
    bind = op.get_bind()
    contents = build_cutover_contents(SEED_DIR)
    for content in contents:
        _insert_content(bind, content)

    override = build_cutover_override(SEED_DIR)
    if _product_exists(bind, override["productSlug"]):
        existing_override = bind.execute(
            sa.text(
                "SELECT data FROM qr_batch_overrides "
                "WHERE batch_code=:batch AND product_id=:product AND content_version=:version"
            ),
            {"batch": override["batchCode"], "product": override["productSlug"], "version": CUTOVER_VERSION},
        ).scalar_one_or_none()
        if existing_override is not None and canonical_hash(existing_override) != canonical_hash(override):
            raise RuntimeError("Cutover override collision for PP-2601-A:petal-pack")
        if existing_override is None:
            bind.execute(
                sa.text(
                    "INSERT INTO qr_batch_overrides(batch_code,product_id,content_version,status,data,seed_key,seed_hash,created_at,updated_at) "
                    "VALUES (:batch,:product,:version,'active',CAST(:data AS jsonb),:key,:hash,now(),now())"
                ),
                {
                    "batch": override["batchCode"],
                    "product": override["productSlug"],
                    "version": CUTOVER_VERSION,
                    "data": json.dumps(override, ensure_ascii=False),
                    "key": f"override:PP-2601-A:petal-pack:{CUTOVER_VERSION}",
                    "hash": canonical_hash(override),
                },
            )

    old_records = json.loads((SEED_DIR / "qr_records.json").read_text(encoding="utf-8"))
    for old in (item for item in old_records if item["code"] in QR_CODES):
        migrated = {**old, "contentVersion": CUTOVER_VERSION}
        bind.execute(
            sa.text(
                "UPDATE qr_records SET data=CAST(:new_data AS jsonb),seed_hash=:new_hash,updated_at=now() "
                "WHERE code=:code AND data=CAST(:old_data AS jsonb)"
            ),
            {
                "code": old["code"],
                "old_data": json.dumps(old, ensure_ascii=False),
                "new_data": json.dumps(migrated, ensure_ascii=False),
                "new_hash": canonical_hash(migrated),
            },
        )


def downgrade() -> None:
    # Published/operational content is intentionally retained on downgrade.
    pass
