# 11. Testing và quality gate

## 1. Test pyramid

```text
E2E
Integration
Service/domain
Unit
Static checks
```

## 2. Backend unit tests

### Code generation

- entropy profile;
- allowed alphabet;
- length;
- normalization;
- collision retry;
- secret digest;
- pepper version.

### State machine

- valid transitions;
- invalid transitions;
- recall priority;
- void terminal;
- activation only distributed;
- correction revision.

### Risk engine

- same client refresh = 0;
- pre-distribution = high;
- repeated invalid secret;
- many clients;
- threshold mapping;
- config-driven rules.

### Hashing

- deterministic canonical JSON;
- key order independent;
- timezone normalization;
- decimal string;
- null handling;
- event sort;
- changed payload changes root.

## 3. Backend integration tests

Dùng PostgreSQL test database.

- create batch;
- add/approve event;
- issue units;
- resolve QR;
- activation success;
- activation race;
- idempotency;
- wrong secret;
- rate limit;
- recall;
- proof;
- outbox claim;
- anchor retry;
- admin RBAC;
- audit persistence.

## 4. Frontend tests

### Component

- status mapping;
- activation form validation;
- secret cleared;
- proof panel;
- recall notice;
- accessibility labels.

### Route

- `/q/:code` experience;
- `/q/:code` unit trace;
- `/trace/:code`;
- unknown;
- offline.

### Analytics

Assert payload không có:

- secret;
- email;
- phone;
- raw support text.

## 5. End-to-end scenarios

### E2E-01: Pack hợp lệ

1. QR resolve.
2. Trace page.
3. Timeline.
4. Secret đúng.
5. Activated.
6. Continue experience.

### E2E-02: Quét lại cùng thiết bị

1. Scan lần một.
2. Refresh.
3. Scan lần hai.
4. State vẫn activated.
5. Không suspicious.

### E2E-03: Secret sai

1. 4 attempts.
2. Error generic.
3. Risk tăng.
4. Không lộ secret.

### E2E-04: Scan trước xuất kho

1. Unit packed.
2. QR scan.
3. not-distributed.
4. internal alert.
5. không activation.

### E2E-05: Recall

1. Recall batch.
2. toàn bộ trace page có recall.
3. activation disabled.
4. anchor revision mới.

### E2E-06: Chain outage

1. ledger unavailable.
2. approve batch thành công.
3. anchor pending.
4. trace page hoạt động.
5. worker retry xác nhận sau.

### E2E-07: Concurrent activation

Gửi 20 request đồng thời:

- một activation;
- còn lại already activated/idempotent;
- không duplicate outbox.

### E2E-08: Scan bombing

- rate limit;
- service ổn định;
- không mass change state sang compromised tự động.

## 6. Security tests

- OWASP API auth;
- CSRF;
- CORS;
- open redirect;
- code enumeration;
- brute force;
- timing comparison;
- log inspection;
- secret in error stack;
- malicious JSON;
- oversized payload;
- admin permission matrix.

## 7. Migration tests

- upgrade database trống;
- upgrade snapshot hiện tại;
- seed import idempotent;
- no overwrite;
- unique constraints;
- foreign keys;
- rollback pre-production;
- query plan index.

## 8. Performance tests

### QR resolve

- 50 concurrent users;
- p95 < 600 ms;
- error < 1%.

### Trace view

- p95 API < 800 ms;
- no chain query per request.

### Activation

- p95 < 1.2 s without chain;
- concurrency safe.

### Admin issue

- 10.000 unit generation job;
- không block web process;
- export async nếu >1.000.

## 9. Quality commands

Frontend:

```bash
cd apps/frontend
npm run lint
npm run build
npm test
```

Backend:

```bash
cd apps/backend
python -m ruff format --check app migrations tests
python -m ruff check app migrations tests
python -m mypy app
python -m pytest -q
```

## 10. Release gate

Không deploy nếu:

- migration chưa chạy staging;
- secret xuất hiện trong log test;
- activation race fail;
- proof mismatch không được phát hiện;
- recall không ưu tiên UI;
- permission test fail;
- QR cũ bị break;
- p95 vượt ngưỡng nghiêm trọng;
- worker không idempotent;
- không có rollback/kill switch.

## 11. Pilot validation

Ngoài test kỹ thuật:

- quét thật bằng iOS/Android;
- QR in trên vật liệu thật;
- ánh sáng thấp;
- tem trầy;
- mạng yếu;
- người dùng nhập secret;
- support hiểu copy;
- đối soát pack–code thực tế.
