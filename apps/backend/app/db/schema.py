from __future__ import annotations

from sqlalchemy import (
    TIMESTAMP,
    BigInteger,
    Boolean,
    CheckConstraint,
    Column,
    Date,
    ForeignKey,
    Index,
    Integer,
    MetaData,
    String,
    Table,
    Text,
    UniqueConstraint,
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

cancellation_policies = Table(
    "cancellation_policies",
    metadata,
    Column("id", String(120), primary_key=True),
    Column("version", String(40), nullable=False),
    Column("status", String(32), nullable=False),
    Column("data", JSONB, nullable=False),
    Column("seed_key", String(160), nullable=True),
    Column("seed_hash", String(64), nullable=True),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
    CheckConstraint("status IN ('draft','active','archived')", name="cancellation_policies_status_check"),
    UniqueConstraint("id", "version", name="cancellation_policies_id_version_key"),
)
Index("idx_cancellation_policies_status", cancellation_policies.c.status)

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

trace_batches = Table(
    "trace_batches",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("batch_code", String(64), nullable=False, unique=True),
    Column("product_slug", String(120), nullable=False),
    Column("content_version", String(64)),
    Column("status", String(32), nullable=False),
    Column("production_date", Date),
    Column("packaged_at", TIMESTAMP(timezone=True)),
    Column("best_before", Date),
    Column("source_summary", JSONB, nullable=False),
    Column("public_visibility", Boolean, nullable=False, server_default="false"),
    Column("revision", Integer, nullable=False, server_default="1"),
    Column("version", Integer, nullable=False, server_default="1"),
    Column("created_by", String(36), ForeignKey("admin_users.id", use_alter=True)),
    Column("approved_by", String(36), ForeignKey("admin_users.id", use_alter=True)),
    Column("recall_reason", Text),
    Column("public_message", Text),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
    CheckConstraint(
        "status IN ('draft','processing','qa_pending','approved','distributed','recalled','closed','void')",
        name="trace_batches_status_check",
    ),
)
Index("idx_trace_batches_product_status", trace_batches.c.product_slug, trace_batches.c.status)

trace_units = Table(
    "trace_units",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("batch_id", String(36), ForeignKey("trace_batches.id"), nullable=False),
    Column("public_code", String(32), nullable=False, unique=True),
    Column("secret_digest", String(128), nullable=False, unique=True),
    Column("status", String(32), nullable=False),
    Column("risk_level", String(16), nullable=False, server_default="normal"),
    Column("risk_score", Integer, nullable=False, server_default="0"),
    Column("scan_count", Integer, nullable=False, server_default="0"),
    Column("unique_client_count", Integer, nullable=False, server_default="0"),
    Column("printed_at", TIMESTAMP(timezone=True)),
    Column("packed_at", TIMESTAMP(timezone=True)),
    Column("distributed_at", TIMESTAMP(timezone=True)),
    Column("activated_at", TIMESTAMP(timezone=True)),
    Column("first_activation_request_id", String(36)),
    Column("version", Integer, nullable=False, server_default="1"),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
    CheckConstraint(
        "status IN ('generated','printed','packed','distributed','activated','recheck',"
        "'suspicious','compromised','recalled','void')",
        name="trace_units_status_check",
    ),
    CheckConstraint("risk_level IN ('normal','watch','high','confirmed')", name="trace_units_risk_check"),
)
Index("idx_trace_units_batch_status", trace_units.c.batch_id, trace_units.c.status)
Index("idx_trace_units_risk", trace_units.c.risk_level, trace_units.c.updated_at.desc())

trace_events = Table(
    "trace_events",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("entity_type", String(16), nullable=False),
    Column("entity_id", String(36), nullable=False),
    Column("event_type", String(64), nullable=False),
    Column("status", String(16), nullable=False, server_default="draft"),
    Column("occurred_at", TIMESTAMP(timezone=True), nullable=False),
    Column("recorded_at", TIMESTAMP(timezone=True), nullable=False),
    Column("location_code", String(64)),
    Column("actor_org", String(128)),
    Column("payload_json", JSONB, nullable=False),
    Column("payload_hash", String(80), nullable=False),
    Column("supersedes_event_id", String(36), ForeignKey("trace_events.id")),
    Column("created_by", String(36), ForeignKey("admin_users.id", use_alter=True)),
    Column("approved_by", String(36), ForeignKey("admin_users.id", use_alter=True)),
    Column("approved_at", TIMESTAMP(timezone=True)),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
)
Index("idx_trace_events_entity_time", trace_events.c.entity_type, trace_events.c.entity_id, trace_events.c.occurred_at)

trace_documents = Table(
    "trace_documents",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("batch_id", String(36), ForeignKey("trace_batches.id")),
    Column("event_id", String(36), ForeignKey("trace_events.id")),
    Column("document_type", String(64), nullable=False),
    Column("storage_key", String(500), nullable=False),
    Column("sha256", String(80), nullable=False),
    Column("mime_type", String(128)),
    Column("size_bytes", BigInteger),
    Column("issued_by", String(255)),
    Column("issued_at", TIMESTAMP(timezone=True)),
    Column("visibility", String(16), nullable=False, server_default="private"),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
)

trace_scan_events = Table(
    "trace_scan_events",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("unit_id", String(36), ForeignKey("trace_units.id")),
    Column("qr_code", String(32), nullable=False),
    Column("occurred_at", TIMESTAMP(timezone=True), nullable=False),
    Column("source", String(64)),
    Column("path", String(500)),
    Column("campaign", String(100)),
    Column("referrer_origin", String(255)),
    Column("client_token_hash", String(80)),
    Column("ip_prefix_hash", String(80)),
    Column("user_agent_family", String(80)),
    Column("region_code", String(32)),
    Column("risk_delta", Integer, nullable=False, server_default="0"),
    Column("request_id", String(128)),
)

trace_activation_attempts = Table(
    "trace_activation_attempts",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("unit_id", String(36), ForeignKey("trace_units.id"), nullable=False),
    Column("result", String(32), nullable=False),
    Column("occurred_at", TIMESTAMP(timezone=True), nullable=False),
    Column("idempotency_key_hash", String(80)),
    Column("client_token_hash", String(80)),
    Column("ip_prefix_hash", String(80)),
    Column("user_agent_family", String(80)),
    Column("region_code", String(32)),
    Column("risk_delta", Integer, nullable=False, server_default="0"),
    Column("request_id", String(128), nullable=False),
)
Index(
    "idx_trace_activation_idempotency",
    trace_activation_attempts.c.unit_id,
    trace_activation_attempts.c.idempotency_key_hash,
    unique=True,
)

trace_risk_reviews = Table(
    "trace_risk_reviews",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("unit_id", String(36), ForeignKey("trace_units.id"), nullable=False),
    Column("decision", String(32), nullable=False),
    Column("reason", Text, nullable=False),
    Column("previous_risk_level", String(16)),
    Column("next_risk_level", String(16)),
    Column("reviewed_by", String(36), ForeignKey("admin_users.id", use_alter=True), nullable=False),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
)

ledger_anchors = Table(
    "ledger_anchors",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("entity_type", String(16), nullable=False),
    Column("entity_id", String(36), nullable=False),
    Column("revision", Integer, nullable=False),
    Column("schema_version", String(32), nullable=False),
    Column("root_hash", String(80), nullable=False),
    Column("previous_root_hash", String(80)),
    Column("network", String(64), nullable=False),
    Column("contract_address", String(128)),
    Column("transaction_id", String(160)),
    Column("block_number", BigInteger),
    Column("status", String(24), nullable=False),
    Column("submitted_at", TIMESTAMP(timezone=True)),
    Column("confirmed_at", TIMESTAMP(timezone=True)),
    Column("error_code", String(64)),
    Column("error_message", Text),
    Column("retry_count", Integer, nullable=False, server_default="0"),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
    UniqueConstraint("entity_type", "entity_id", "revision", "network", name="uq_ledger_anchor"),
)

ledger_outbox = Table(
    "ledger_outbox",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("aggregate_type", String(16), nullable=False),
    Column("aggregate_id", String(36), nullable=False),
    Column("revision", Integer, nullable=False),
    Column("command_json", JSONB, nullable=False),
    Column("status", String(24), nullable=False, server_default="pending"),
    Column("available_at", TIMESTAMP(timezone=True), nullable=False),
    Column("locked_at", TIMESTAMP(timezone=True)),
    Column("locked_by", String(128)),
    Column("attempts", Integer, nullable=False, server_default="0"),
    Column("last_error", Text),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
)
Index("idx_ledger_outbox_claim", ledger_outbox.c.status, ledger_outbox.c.available_at)

qr_records = Table(
    "qr_records",
    metadata,
    Column("code", String(80), primary_key=True),
    Column("product_id", String(120), ForeignKey("products.id"), nullable=True),
    Column("flow_type", String(24), nullable=False, server_default="experience"),
    Column("trace_batch_id", String(36), ForeignKey("trace_batches.id")),
    Column("trace_unit_id", String(36), ForeignKey("trace_units.id")),
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

content_items = Table(
    "content_items",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("content_key", String(160), nullable=False, unique=True),
    Column("content_type", String(80), nullable=False),
    Column("locale", String(10), nullable=False),
    Column("status", String(32), nullable=False),
    Column(
        "current_published_revision_id",
        String(36),
        ForeignKey("content_revisions.id", name="content_items_current_revision_fk", use_alter=True),
    ),
    Column("created_by", String(36), ForeignKey("admin_users.id"), nullable=False),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
    CheckConstraint("status IN ('draft','published','unpublished')", name="content_items_status_check"),
)

content_revisions = Table(
    "content_revisions",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("item_id", String(36), ForeignKey("content_items.id", ondelete="CASCADE"), nullable=False),
    Column("revision_no", Integer, nullable=False),
    Column("status", String(32), nullable=False),
    Column("data", JSONB, nullable=False),
    Column("source_note", Text),
    Column("review_note", Text),
    Column("version", Integer, nullable=False, server_default="1"),
    Column("created_by", String(36), ForeignKey("admin_users.id"), nullable=False),
    Column("reviewed_by", String(36), ForeignKey("admin_users.id")),
    Column("published_by", String(36), ForeignKey("admin_users.id")),
    Column("created_at", TIMESTAMP(timezone=True), nullable=False),
    Column("updated_at", TIMESTAMP(timezone=True), nullable=False),
    Column("published_at", TIMESTAMP(timezone=True)),
    CheckConstraint("status IN ('draft','in_review','published','superseded')", name="content_revisions_status_check"),
    UniqueConstraint("item_id", "revision_no", name="content_revisions_item_revision_key"),
)
Index("idx_content_revisions_item_status", content_revisions.c.item_id, content_revisions.c.status)
