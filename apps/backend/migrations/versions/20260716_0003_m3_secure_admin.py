"""Add secure admin identity, RBAC, audit, and lead workflow."""

import sqlalchemy as sa
from alembic import context, op

from app.db.schema import metadata

revision = "20260716_0003"
down_revision = "20260716_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    for name in (
        "admin_users",
        "roles",
        "permissions",
        "role_permissions",
        "admin_user_roles",
        "admin_sessions",
        "password_reset_tokens",
        "audit_logs",
        "lead_activities",
    ):
        metadata.tables[name].create(bind=bind, checkfirst=not context.is_offline_mode())
    op.add_column("products", sa.Column("version", sa.Integer(), nullable=False, server_default="1"))
    op.add_column("qr_records", sa.Column("version", sa.Integer(), nullable=False, server_default="1"))
    op.add_column("submissions", sa.Column("assigned_to", sa.String(length=36), nullable=True))
    op.create_foreign_key("submissions_assigned_to_fk", "submissions", "admin_users", ["assigned_to"], ["id"])
    op.create_index("idx_submissions_assigned_status", "submissions", ["assigned_to", "status"])


def downgrade() -> None:
    op.drop_index("idx_submissions_assigned_status", table_name="submissions")
    op.drop_constraint("submissions_assigned_to_fk", "submissions", type_="foreignkey")
    op.drop_column("submissions", "assigned_to")
    op.drop_column("qr_records", "version")
    op.drop_column("products", "version")
    bind = op.get_bind()
    for name in (
        "lead_activities",
        "audit_logs",
        "password_reset_tokens",
        "admin_sessions",
        "admin_user_roles",
        "role_permissions",
        "permissions",
        "roles",
        "admin_users",
    ):
        metadata.tables[name].drop(bind=bind, checkfirst=not context.is_offline_mode())
