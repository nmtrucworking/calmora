"""Add immutable content revision workflow."""

from uuid import uuid4

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "20260716_0004"
down_revision = "20260716_0003"
branch_labels = None
depends_on = None

CONTENT_PERMISSIONS = (
    "content.read",
    "content.write",
    "content.review",
    "content.publish",
    "content.unpublish",
)


def upgrade() -> None:
    op.create_table(
        "content_items",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("content_key", sa.String(160), nullable=False, unique=True),
        sa.Column("content_type", sa.String(80), nullable=False),
        sa.Column("locale", sa.String(10), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("current_published_revision_id", sa.String(36)),
        sa.Column("created_by", sa.String(36), sa.ForeignKey("admin_users.id"), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.CheckConstraint("status IN ('draft','published','unpublished')", name="content_items_status_check"),
    )
    op.create_table(
        "content_revisions",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("item_id", sa.String(36), sa.ForeignKey("content_items.id", ondelete="CASCADE"), nullable=False),
        sa.Column("revision_no", sa.Integer, nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("data", postgresql.JSONB, nullable=False),
        sa.Column("source_note", sa.Text),
        sa.Column("review_note", sa.Text),
        sa.Column("version", sa.Integer, nullable=False, server_default="1"),
        sa.Column("created_by", sa.String(36), sa.ForeignKey("admin_users.id"), nullable=False),
        sa.Column("reviewed_by", sa.String(36), sa.ForeignKey("admin_users.id")),
        sa.Column("published_by", sa.String(36), sa.ForeignKey("admin_users.id")),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("published_at", sa.TIMESTAMP(timezone=True)),
        sa.CheckConstraint(
            "status IN ('draft','in_review','published','superseded')", name="content_revisions_status_check"
        ),
        sa.UniqueConstraint("item_id", "revision_no", name="content_revisions_item_revision_key"),
    )
    op.create_index("idx_content_revisions_item_status", "content_revisions", ["item_id", "status"])
    op.create_foreign_key(
        "content_items_current_revision_fk",
        "content_items",
        "content_revisions",
        ["current_published_revision_id"],
        ["id"],
    )

    bind = op.get_bind()
    for code in CONTENT_PERMISSIONS:
        bind.execute(
            sa.text("INSERT INTO permissions(id,code) VALUES (:id,:code) ON CONFLICT(code) DO NOTHING"),
            {"id": str(uuid4()), "code": code},
        )
    bind.execute(
        sa.text(
            "INSERT INTO role_permissions(role_id,permission_id) "
            "SELECT r.id,p.id FROM roles r CROSS JOIN permissions p "
            "WHERE r.code='administrator' AND p.code = ANY(:codes) ON CONFLICT DO NOTHING"
        ),
        {"codes": list(CONTENT_PERMISSIONS)},
    )


def downgrade() -> None:
    op.drop_constraint("content_items_current_revision_fk", "content_items", type_="foreignkey")
    op.drop_index("idx_content_revisions_item_status", table_name="content_revisions")
    op.drop_table("content_revisions")
    op.drop_table("content_items")
    bind = op.get_bind()
    bind.execute(sa.text("DELETE FROM permissions WHERE code = ANY(:codes)"), {"codes": list(CONTENT_PERMISSIONS)})
