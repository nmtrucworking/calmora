from __future__ import annotations

from sqlalchemy import (
    TIMESTAMP,
    Boolean,
    CheckConstraint,
    Column,
    ForeignKey,
    Index,
    Integer,
    MetaData,
    String,
    Table,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB

metadata = MetaData()

products = Table(
    "products",
    metadata,
    Column("id", String(120), primary_key=True),
    Column("slug", String(120), nullable=False, unique=True),
    Column("name", String(255), nullable=False),
    Column("status", String(32), nullable=False),
    Column("data", JSONB, nullable=False),
    Column("seed_key", String(120), nullable=True),
    Column("seed_hash", String(64), nullable=True),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
    CheckConstraint("status IN ('draft','active','archived')", name="products_status_check"),
)
Index("idx_products_status_slug", products.c.status, products.c.slug)

product_variants = Table(
    "product_variants",
    metadata,
    Column("id", String(120), primary_key=True),
    Column("product_id", String(120), ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
    Column("name", String(255), nullable=False),
    Column("data", JSONB, nullable=False),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
)
Index("idx_product_variants_product", product_variants.c.product_id)

collections = Table(
    "collections",
    metadata,
    Column("id", String(120), primary_key=True),
    Column("slug", String(120), nullable=False, unique=True),
    Column("name", String(255), nullable=False),
    Column("status", String(32), nullable=False),
    Column("data", JSONB, nullable=False),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
    CheckConstraint("status IN ('draft','active','archived')", name="collections_status_check"),
)

collection_products = Table(
    "collection_products",
    metadata,
    Column("collection_id", String(120), ForeignKey("collections.id", ondelete="CASCADE"), primary_key=True),
    Column("product_id", String(120), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True),
    Column("sort_order", Integer, nullable=False, server_default="0"),
)
Index("idx_collection_products_product", collection_products.c.product_id)

product_media = Table(
    "product_media",
    metadata,
    Column("id", String(160), primary_key=True),
    Column("product_id", String(120), ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
    Column("url", Text, nullable=False),
    Column("alt_text", Text, nullable=False),
    Column("kind", String(32), nullable=False),
    Column("sort_order", Integer, nullable=False, server_default="0"),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
)
Index("idx_product_media_product", product_media.c.product_id, product_media.c.sort_order)

qr_records = Table(
    "qr_records",
    metadata,
    Column("code", String(80), primary_key=True),
    Column("product_id", String(120), ForeignKey("products.id"), nullable=True),
    Column("data", JSONB, nullable=False),
    Column("seed_key", String(120), nullable=True),
    Column("seed_hash", String(64), nullable=True),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
)

qr_experience_contents = Table(
    "qr_experience_contents",
    metadata,
    Column("product_id", String(120), ForeignKey("products.id"), primary_key=True),
    Column("version", String(80), primary_key=True),
    Column("locale", String(10), primary_key=True),
    Column("status", String(32), nullable=False),
    Column("data", JSONB, nullable=False),
    Column("seed_key", String(240), nullable=True),
    Column("seed_hash", String(64), nullable=True),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
)

qr_batch_overrides = Table(
    "qr_batch_overrides",
    metadata,
    Column("batch_code", String(80), primary_key=True),
    Column("product_id", String(120), ForeignKey("products.id"), primary_key=True),
    Column("content_version", String(80), primary_key=True),
    Column("status", String(32), nullable=False),
    Column("data", JSONB, nullable=False),
    Column("seed_key", String(280), nullable=True),
    Column("seed_hash", String(64), nullable=True),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
)

submissions = Table(
    "submissions",
    metadata,
    Column("id", Text, primary_key=True),
    Column("kind", Text, nullable=False),
    Column("payload", JSONB, nullable=False),
    Column("status", Text, nullable=False),
    Column("idempotency_key", Text, unique=True),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
    CheckConstraint("status IN ('new','contacted','qualified','closed')", name="submissions_status_check"),
)
Index("idx_submissions_kind_created_at", submissions.c.kind, submissions.c.created_at.desc())

analytics_events = Table(
    "analytics_events",
    metadata,
    Column("id", Text, primary_key=True),
    Column("event_name", Text, nullable=False),
    Column("data", JSONB, nullable=False),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
)
Index("idx_analytics_event_created_at", analytics_events.c.event_name, analytics_events.c.created_at.desc())

admin_users = Table(
    "admin_users",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("email", String(320), nullable=False, unique=True),
    Column("name", String(255), nullable=False),
    Column("password_hash", Text, nullable=False),
    Column("status", String(32), nullable=False),
    Column("failed_login_count", Integer, nullable=False, server_default="0"),
    Column("locked_until", TIMESTAMP(timezone=True)),
    Column("last_login_at", TIMESTAMP(timezone=True)),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
    CheckConstraint("status IN ('active','disabled')", name="admin_users_status_check"),
)

roles = Table(
    "roles",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("code", String(80), unique=True, nullable=False),
    Column("name", String(120), nullable=False),
    Column("is_system", Boolean, nullable=False, server_default="false"),
)
permissions = Table(
    "permissions",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("code", String(120), unique=True, nullable=False),
)
role_permissions = Table(
    "role_permissions",
    metadata,
    Column("role_id", String(36), ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    Column("permission_id", String(36), ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True),
)
admin_user_roles = Table(
    "admin_user_roles",
    metadata,
    Column("user_id", String(36), ForeignKey("admin_users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", String(36), ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    Column("granted_at", TIMESTAMP(timezone=True), nullable=False),
)
admin_sessions = Table(
    "admin_sessions",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("user_id", String(36), ForeignKey("admin_users.id", ondelete="CASCADE"), nullable=False),
    Column("token_hash", String(64), unique=True, nullable=False),
    Column("csrf_hash", String(64), nullable=False),
    Column("expires_at", TIMESTAMP(timezone=True), nullable=False),
    Column("revoked_at", TIMESTAMP(timezone=True)),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
)
Index(
    "idx_admin_sessions_user_active", admin_sessions.c.user_id, admin_sessions.c.revoked_at, admin_sessions.c.expires_at
)

password_reset_tokens = Table(
    "password_reset_tokens",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("user_id", String(36), ForeignKey("admin_users.id", ondelete="CASCADE"), nullable=False),
    Column("token_hash", String(64), unique=True, nullable=False),
    Column("expires_at", TIMESTAMP(timezone=True), nullable=False),
    Column("used_at", TIMESTAMP(timezone=True)),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
)

audit_logs = Table(
    "audit_logs",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("actor_id", String(36)),
    Column("action", String(120), nullable=False),
    Column("target_type", String(80), nullable=False),
    Column("target_id", String(160)),
    Column("summary", JSONB, nullable=False),
    Column("request_id", String(128)),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
)
Index("idx_audit_target_created", audit_logs.c.target_type, audit_logs.c.target_id, audit_logs.c.created_at.desc())

lead_activities = Table(
    "lead_activities",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("submission_id", Text, ForeignKey("submissions.id", ondelete="CASCADE"), nullable=False),
    Column("actor_id", String(36), ForeignKey("admin_users.id"), nullable=False),
    Column("activity_type", String(40), nullable=False),
    Column("from_status", String(32)),
    Column("to_status", String(32)),
    Column("note", Text),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
)
Index("idx_lead_activity_submission", lead_activities.c.submission_id, lead_activities.c.created_at.desc())
