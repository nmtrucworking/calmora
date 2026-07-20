# 04. Thiết kế database và kế hoạch migration

## 1. Nguyên tắc

- PostgreSQL là nguồn dữ liệu vận hành.
- Tên cột snake_case; API camelCase.
- Thời gian dùng `TIMESTAMPTZ`.
- ID nội bộ dùng UUID.
- Code public là chuỗi ngẫu nhiên, không dùng ID tăng dần.
- Event append-only.
- JSONB chỉ dùng cho payload thay đổi; trường truy vấn thường xuyên phải tách cột.
- Migration không ghi đè seed vận hành.
- Dữ liệu secret chỉ lưu digest.

## 2. Bảng đề xuất

### 2.1. `trace_batches`

```sql
CREATE TABLE trace_batches (
    id uuid PRIMARY KEY,
    batch_code varchar(64) NOT NULL,
    product_slug varchar(64) NOT NULL,
    content_version varchar(64),
    status varchar(32) NOT NULL,
    production_date date,
    packaged_at timestamptz,
    best_before date,
    source_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
    public_visibility boolean NOT NULL DEFAULT false,
    revision integer NOT NULL DEFAULT 1,
    version integer NOT NULL DEFAULT 1,
    created_by uuid,
    approved_by uuid,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL,
    CONSTRAINT uq_trace_batch_code UNIQUE (batch_code)
);
```

Index:

```sql
CREATE INDEX ix_trace_batches_product_status
ON trace_batches(product_slug, status);

CREATE INDEX ix_trace_batches_packaged_at
ON trace_batches(packaged_at DESC);
```

### 2.2. `trace_units`

```sql
CREATE TABLE trace_units (
    id uuid PRIMARY KEY,
    batch_id uuid NOT NULL REFERENCES trace_batches(id),
    public_code varchar(32) NOT NULL,
    secret_digest varchar(128) NOT NULL,
    status varchar(32) NOT NULL,
    risk_level varchar(16) NOT NULL DEFAULT 'normal',
    risk_score integer NOT NULL DEFAULT 0,
    scan_count integer NOT NULL DEFAULT 0,
    unique_client_count integer NOT NULL DEFAULT 0,
    printed_at timestamptz,
    packed_at timestamptz,
    distributed_at timestamptz,
    activated_at timestamptz,
    first_activation_request_id uuid,
    version integer NOT NULL DEFAULT 1,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL,
    CONSTRAINT uq_trace_unit_public_code UNIQUE (public_code),
    CONSTRAINT uq_trace_unit_secret_digest UNIQUE (secret_digest)
);
```

Index:

```sql
CREATE INDEX ix_trace_units_batch_status
ON trace_units(batch_id, status);

CREATE INDEX ix_trace_units_risk
ON trace_units(risk_level, updated_at DESC);
```

### 2.3. `trace_events`

```sql
CREATE TABLE trace_events (
    id uuid PRIMARY KEY,
    entity_type varchar(16) NOT NULL,
    entity_id uuid NOT NULL,
    event_type varchar(64) NOT NULL,
    status varchar(16) NOT NULL DEFAULT 'draft',
    occurred_at timestamptz NOT NULL,
    recorded_at timestamptz NOT NULL,
    location_code varchar(64),
    actor_org varchar(128),
    payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    payload_hash varchar(80) NOT NULL,
    supersedes_event_id uuid REFERENCES trace_events(id),
    created_by uuid,
    approved_by uuid,
    approved_at timestamptz,
    created_at timestamptz NOT NULL
);
```

Index:

```sql
CREATE INDEX ix_trace_events_entity_time
ON trace_events(entity_type, entity_id, occurred_at);

CREATE INDEX ix_trace_events_type_time
ON trace_events(event_type, occurred_at DESC);
```

### 2.4. `trace_documents`

```sql
CREATE TABLE trace_documents (
    id uuid PRIMARY KEY,
    batch_id uuid REFERENCES trace_batches(id),
    event_id uuid REFERENCES trace_events(id),
    document_type varchar(64) NOT NULL,
    storage_key varchar(500) NOT NULL,
    sha256 varchar(80) NOT NULL,
    mime_type varchar(128),
    size_bytes bigint,
    issued_by varchar(255),
    issued_at timestamptz,
    visibility varchar(16) NOT NULL DEFAULT 'private',
    created_at timestamptz NOT NULL
);
```

Không public `storage_key` trực tiếp. API trả signed URL có thời hạn hoặc chỉ trả metadata.

### 2.5. `trace_scan_events`

```sql
CREATE TABLE trace_scan_events (
    id uuid PRIMARY KEY,
    unit_id uuid REFERENCES trace_units(id),
    qr_code varchar(32) NOT NULL,
    occurred_at timestamptz NOT NULL,
    source varchar(64),
    path varchar(500),
    campaign varchar(100),
    referrer_origin varchar(255),
    client_token_hash varchar(80),
    ip_prefix_hash varchar(80),
    user_agent_family varchar(80),
    region_code varchar(32),
    risk_delta integer NOT NULL DEFAULT 0,
    request_id uuid
);
```

Partition theo tháng chỉ cần khi volume đủ lớn. Không triển khai sớm nếu pilot nhỏ.

### 2.6. `trace_activation_attempts`

```sql
CREATE TABLE trace_activation_attempts (
    id uuid PRIMARY KEY,
    unit_id uuid NOT NULL REFERENCES trace_units(id),
    result varchar(32) NOT NULL,
    occurred_at timestamptz NOT NULL,
    idempotency_key_hash varchar(80),
    client_token_hash varchar(80),
    ip_prefix_hash varchar(80),
    user_agent_family varchar(80),
    region_code varchar(32),
    risk_delta integer NOT NULL DEFAULT 0,
    request_id uuid NOT NULL
);
```

### 2.7. `trace_risk_reviews`

```sql
CREATE TABLE trace_risk_reviews (
    id uuid PRIMARY KEY,
    unit_id uuid NOT NULL REFERENCES trace_units(id),
    decision varchar(32) NOT NULL,
    reason text NOT NULL,
    previous_risk_level varchar(16),
    next_risk_level varchar(16),
    reviewed_by uuid NOT NULL,
    created_at timestamptz NOT NULL
);
```

### 2.8. `ledger_anchors`

```sql
CREATE TABLE ledger_anchors (
    id uuid PRIMARY KEY,
    entity_type varchar(16) NOT NULL,
    entity_id uuid NOT NULL,
    revision integer NOT NULL,
    schema_version varchar(32) NOT NULL,
    root_hash varchar(80) NOT NULL,
    previous_root_hash varchar(80),
    network varchar(64) NOT NULL,
    contract_address varchar(128),
    transaction_id varchar(160),
    block_number bigint,
    status varchar(24) NOT NULL,
    submitted_at timestamptz,
    confirmed_at timestamptz,
    error_code varchar(64),
    error_message text,
    retry_count integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL,
    CONSTRAINT uq_ledger_anchor UNIQUE
      (entity_type, entity_id, revision, network)
);
```

### 2.9. `ledger_outbox`

```sql
CREATE TABLE ledger_outbox (
    id uuid PRIMARY KEY,
    aggregate_type varchar(16) NOT NULL,
    aggregate_id uuid NOT NULL,
    revision integer NOT NULL,
    command_json jsonb NOT NULL,
    status varchar(24) NOT NULL DEFAULT 'pending',
    available_at timestamptz NOT NULL,
    locked_at timestamptz,
    locked_by varchar(128),
    attempts integer NOT NULL DEFAULT 0,
    last_error text,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);
```

Index:

```sql
CREATE INDEX ix_ledger_outbox_claim
ON ledger_outbox(status, available_at);
```

## 3. Mở rộng `qr_records`

Thêm field:

```sql
ALTER TABLE qr_records
ADD COLUMN flow_type varchar(24) NOT NULL DEFAULT 'experience',
ADD COLUMN trace_batch_id uuid REFERENCES trace_batches(id),
ADD COLUMN trace_unit_id uuid REFERENCES trace_units(id);
```

Constraint nghiệp vụ được kiểm tra ở service:

- `unit-trace` phải có `trace_unit_id`;
- `batch-trace` phải có `trace_batch_id`;
- `experience` không bắt buộc reference.

## 4. Migration sequence

### Migration A — Batch và event

- tạo `trace_batches`;
- tạo `trace_events`;
- tạo `trace_documents`;
- seed một batch pilot;
- chưa thay QR runtime.

### Migration B — Unit và activation

- tạo `trace_units`;
- scan/activation/risk tables;
- mở rộng `qr_records`;
- backfill QR pilot.

### Migration C — Ledger

- tạo `ledger_anchors`;
- tạo `ledger_outbox`;
- seed network `database-local`.

### Migration D — Hardening

- thêm partial index;
- thêm constraint;
- thêm retention job metadata;
- verify backfill;
- cập nhật seed importer.

## 5. Backfill

Không tự chuyển QR cũ thành unit trace.

Backfill rõ ràng:

```text
PP-2601-A → batch-trace
CL-2601-A → batch-trace
GS-2601-A → batch-trace
```

Unit pilot được sinh mới.

## 6. Transaction boundary

### Activation transaction

Trong một transaction:

1. select unit for update;
2. insert activation attempt;
3. cập nhật state/risk;
4. insert audit log;
5. insert outbox;
6. commit.

Không gọi blockchain trước commit.

### Approve batch transaction

1. validate required events;
2. increment revision;
3. mark approved;
4. build hash metadata;
5. insert outbox;
6. commit.

## 7. Retention

| Dữ liệu | Thời hạn đề xuất |
|---|---:|
| Trace batch/event | Theo vòng đời sản phẩm + chính sách pháp lý |
| Document hash | Không xóa khi batch còn hiệu lực |
| Scan event chi tiết | 180 ngày pilot, sau đó đánh giá |
| Aggregate scan | Có thể giữ lâu hơn |
| Activation attempt | 24 tháng hoặc theo chính sách |
| Admin audit | Tối thiểu 24 tháng |
| Blockchain receipt | Không xóa |
| Secret digest | Đến khi unit hết vòng đời + thời hạn hỗ trợ |

## 8. Migration verification

- count unit bằng số code sinh;
- không public code trùng;
- không secret digest trùng;
- mọi QR unit có reference hợp lệ;
- mọi unit có batch;
- scan event không chứa raw IP;
- `alembic upgrade head` chạy trên database trống và database hiện hữu;
- rollback strategy được ghi cho migration chưa có dữ liệu production.
