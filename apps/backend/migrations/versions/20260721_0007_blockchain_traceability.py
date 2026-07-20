"""Add Senova traceability, activation, and ledger outbox tables."""

from uuid import uuid4

import sqlalchemy as sa
from alembic import context, op

from app.db.schema import metadata

revision = "20260721_0007"
down_revision = "20260720_0006"
branch_labels = None
depends_on = None

TRACE_TABLES = (
    "trace_batches",
    "trace_units",
    "trace_events",
    "trace_documents",
    "trace_scan_events",
    "trace_activation_attempts",
    "trace_risk_reviews",
    "ledger_anchors",
    "ledger_outbox",
)
TRACE_PERMISSIONS = (
    "trace.batches.write",
    "trace.batches.approve",
    "trace.units.write",
    "trace.units.export_secrets",
    "trace.risk.review",
    "trace.recall",
    "trace.ledger.write",
)


def upgrade() -> None:
    bind = op.get_bind()
    checkfirst = not context.is_offline_mode()
    for table_name in TRACE_TABLES:
        metadata.tables[table_name].create(bind=bind, checkfirst=checkfirst)

    op.create_foreign_key("trace_batches_created_by_fk", "trace_batches", "admin_users", ["created_by"], ["id"])
    op.create_foreign_key("trace_batches_approved_by_fk", "trace_batches", "admin_users", ["approved_by"], ["id"])
    op.create_foreign_key("trace_events_created_by_fk", "trace_events", "admin_users", ["created_by"], ["id"])
    op.create_foreign_key("trace_events_approved_by_fk", "trace_events", "admin_users", ["approved_by"], ["id"])
    op.create_foreign_key(
        "trace_risk_reviews_reviewer_fk", "trace_risk_reviews", "admin_users", ["reviewed_by"], ["id"]
    )

    op.add_column(
        "qr_records", sa.Column("flow_type", sa.String(length=24), server_default="experience", nullable=False)
    )
    op.add_column("qr_records", sa.Column("trace_batch_id", sa.String(length=36), nullable=True))
    op.add_column("qr_records", sa.Column("trace_unit_id", sa.String(length=36), nullable=True))
    op.create_foreign_key("qr_records_trace_batch_fk", "qr_records", "trace_batches", ["trace_batch_id"], ["id"])
    op.create_foreign_key("qr_records_trace_unit_fk", "qr_records", "trace_units", ["trace_unit_id"], ["id"])
    if not context.is_offline_mode():
        for code in TRACE_PERMISSIONS:
            bind.execute(
                sa.text("INSERT INTO permissions(id,code) VALUES (:id,:code) ON CONFLICT(code) DO NOTHING"),
                {"id": str(uuid4()), "code": code},
            )
        bind.execute(
            sa.text(
                "INSERT INTO role_permissions(role_id,permission_id) "
                "SELECT r.id,p.id FROM roles r CROSS JOIN permissions p "
                "WHERE r.code='administrator' AND p.code LIKE 'trace.%' ON CONFLICT DO NOTHING"
            )
        )


def downgrade() -> None:
    op.drop_constraint("qr_records_trace_unit_fk", "qr_records", type_="foreignkey")
    op.drop_constraint("qr_records_trace_batch_fk", "qr_records", type_="foreignkey")
    op.drop_column("qr_records", "trace_unit_id")
    op.drop_column("qr_records", "trace_batch_id")
    op.drop_column("qr_records", "flow_type")
    bind = op.get_bind()
    checkfirst = not context.is_offline_mode()
    for table_name in reversed(TRACE_TABLES):
        metadata.tables[table_name].drop(bind=bind, checkfirst=checkfirst)
