"""Adopt the unversioned baseline and add M1 catalog and QR persistence."""

from alembic import context, op
from sqlalchemy import inspect

from app.db.schema import metadata

revision = "20260716_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    existing = set() if context.is_offline_mode() else set(inspect(bind).get_table_names())
    for name in (
        "products",
        "product_variants",
        "qr_records",
        "qr_experience_contents",
        "qr_batch_overrides",
        "submissions",
        "analytics_events",
    ):
        metadata.tables[name].create(bind=bind, checkfirst=not context.is_offline_mode())
    if "submissions" in existing:
        op.execute("ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_status_check")
        op.execute(
            """
            UPDATE submissions SET status = CASE
              WHEN status IN ('in_progress', 'reviewed') THEN 'contacted'
              WHEN status = 'qualified' THEN 'qualified'
              WHEN status IN ('resolved', 'archived', 'rejected', 'spam') THEN 'closed'
              ELSE 'new' END
            """
        )
        op.execute(
            "ALTER TABLE submissions ADD CONSTRAINT submissions_status_check "
            "CHECK (status IN ('new','contacted','qualified','closed'))"
        )


def downgrade() -> None:
    bind = op.get_bind()
    for name in ("qr_batch_overrides", "qr_experience_contents", "qr_records", "product_variants", "products"):
        table = metadata.tables[name]
        table.drop(bind=bind, checkfirst=True)
    op.execute("ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_status_check")
    op.execute(
        """
        UPDATE submissions SET status = CASE
          WHEN status IN ('contacted', 'qualified') THEN 'in_progress'
          WHEN status = 'closed' THEN 'resolved'
          ELSE 'new' END
        """
    )
    op.execute(
        "ALTER TABLE submissions ADD CONSTRAINT submissions_status_check "
        "CHECK (status IN ('new','in_progress','resolved','rejected'))"
    )
