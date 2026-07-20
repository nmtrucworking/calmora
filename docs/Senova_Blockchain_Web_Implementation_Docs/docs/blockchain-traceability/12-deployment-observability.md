# 12. Deployment và observability

## 1. Topology triển khai

### Frontend

- Vercel;
- root `apps/frontend`;
- build `npm run build`;
- output `dist`.

### Backend

- Render hoặc hạ tầng hiện tại;
- root `apps/backend`;
- FastAPI/Uvicorn;
- migration pre-deploy;
- PostgreSQL cùng region.

### Rate limiter

- R1 pilot: in-memory có cảnh báo giới hạn.
- R2 production multi-instance: Redis.

### Object storage

Dùng cho:

- QA document;
- image evidence;
- export file tạm.

Không dùng Git repository.

### Ledger worker

Có thể chạy:

- worker process riêng;
- scheduled job;
- background service độc lập.

Không chạy anchor trực tiếp trong web request.

## 2. Environment variables

```text
TRACEABILITY_ENABLED=true
TRACE_UNIT_ACTIVATION_ENABLED=true
TRACE_PUBLIC_BASE_URL=https://<domain>
TRACE_SECRET_PEPPER=<secret>
TRACE_SECRET_PEPPER_VERSION=v1
TRACE_SCAN_RETENTION_DAYS=180
TRACE_RISK_CONFIG_JSON=...
TRACE_EXPORT_TTL_MINUTES=30

REDIS_URL=...
OBJECT_STORAGE_ENDPOINT=...
OBJECT_STORAGE_BUCKET=...
OBJECT_STORAGE_ACCESS_KEY=...
OBJECT_STORAGE_SECRET_KEY=...

LEDGER_ADAPTER=database
LEDGER_NETWORK=database-local
LEDGER_RPC_URL=...
LEDGER_CONTRACT_ADDRESS=...
LEDGER_SIGNER_KEY_REF=...
LEDGER_CONFIRMATIONS=...
```

## 3. Secret management

- `.env.example` chỉ có tên biến;
- production secret trong platform secret manager;
- không copy private key vào environment nếu có KMS key reference;
- rotate pepper cần version;
- revoke file export link;
- staging và production tách biệt.

## 4. Migration deployment

Pipeline:

```text
build
  ↓
static checks
  ↓
tests
  ↓
backup/checkpoint
  ↓
alembic upgrade head
  ↓
seed import
  ↓
deploy web
  ↓
deploy worker
  ↓
smoke test
```

Không để app tự thay schema ở mọi startup.

## 5. Health endpoints

```text
/api/v1/health/live
/api/v1/health/ready
/api/v1/health/dependencies
```

Dependencies:

- database;
- Redis;
- object storage;
- ledger worker heartbeat.

Ledger chain không nên làm `ready` fail cho public web nếu trace vẫn đọc được.

## 6. Metrics

### HTTP

- request rate;
- error rate;
- latency p50/p95/p99;
- 429 count.

### Trace

- qr resolve;
- trace view;
- activation success;
- activation invalid;
- already activated;
- scan before distribution;
- suspicious units;
- recall views.

### Ledger

- pending jobs;
- oldest pending age;
- submitted;
- confirmed;
- failed;
- retry count;
- proof mismatch;
- reconciliation errors.

### Operations

- issued/printed/packed/distributed deltas;
- export download;
- void rate;
- support queue age.

## 7. Structured logs

Fields:

```json
{
  "timestamp": "...",
  "level": "INFO",
  "service": "backend",
  "event": "trace_activation",
  "requestId": "...",
  "publicCodeHash": "...",
  "result": "activated",
  "durationMs": 120
}
```

Không log secret/raw IP/PII.

## 8. Alert

### Critical

- signer/key error;
- proof mismatch;
- mass recall;
- activation error rate >20%;
- database write failure.

### Warning

- outbox oldest >30 phút;
- 429 spike;
- invalid secret spike;
- scan before distributed;
- suspicious rate tăng;
- export file download bất thường.

## 9. Dashboard

Views:

1. public API health;
2. activation funnel;
3. anomaly/rate limit;
4. ledger;
5. operations reconciliation;
6. support.

## 10. Backup và restore

- PostgreSQL automated backup;
- restore drill;
- object storage versioning;
- export file tạm không cần backup;
- blockchain receipt có thể reconcile nhưng local metadata vẫn cần backup;
- document hash và storage object phải đối chiếu.

## 11. Feature flags

Rollout:

```text
TRACEABILITY_ENABLED
TRACE_BATCH_PUBLIC_ENABLED
TRACE_UNIT_ACTIVATION_ENABLED
TRACE_RISK_WARNING_ENABLED
LEDGER_ANCHOR_ENABLED
TRACE_ADMIN_ENABLED
```

Cho phép rollback UI mà không xóa dữ liệu.

## 12. Smoke test production

- QR experience cũ;
- batch trace;
- unit trace;
- activation test unit;
- admin login;
- issue disabled hoặc test batch;
- proof status;
- health;
- no secret log;
- mobile view.
