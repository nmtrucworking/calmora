"""Add catalog collections and product media references."""

from alembic import context, op

from app.db.schema import metadata

revision = "20260716_0002"
down_revision = "20260716_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    for name in ("collections", "collection_products", "product_media"):
        metadata.tables[name].create(bind=bind, checkfirst=not context.is_offline_mode())


def downgrade() -> None:
    bind = op.get_bind()
    for name in ("product_media", "collection_products", "collections"):
        metadata.tables[name].drop(bind=bind, checkfirst=not context.is_offline_mode())
