# 01. Hiện trạng codebase và phân tích khoảng trống

## 1. Baseline hiện tại

Repository hiện có hai ứng dụng:

```text
apps/frontend  React + TypeScript + Vite
apps/backend   FastAPI + PostgreSQL + Alembic
```

Frontend đã có:

- route `/q/:code`;
- `QrRedirectPage`;
- các route `/experience/classic`, `/experience/petal-pack`, `/experience/gift-set`;
- API helper `resolveQr()` và `trackQrScan()`;
- analytics frontend;
- content theo sản phẩm và lô.

Backend đã có:

- `GET /api/qr/{code}`;
- `POST /api/qr/{code}/scan`;
- `GET /api/qr/experience/{productSlug}`;
- `qr_records`, `qr_experience_contents`, `qr_batch_overrides`;
- PostgreSQL, Alembic, admin auth/RBAC/audit;
- API envelope thống nhất;
- rate limit cơ bản;
- submissions và analytics.

## 2. Những gì có thể tái sử dụng

| Thành phần hiện tại | Cách tái sử dụng |
|---|---|
| `/q/:code` | Giữ làm entry point duy nhất trên bao bì |
| `QrRedirectPage` | Mở rộng để xử lý `flowType` thay vì luôn redirect |
| `qr_records` | Thêm tham chiếu batch/unit và loại QR |
| QR scan API | Chuyển sang lưu event chuẩn hóa, vẫn giữ compatibility |
| Experience content | Hiển thị sau phần xác minh và timeline |
| Admin session/RBAC | Thêm permission traceability |
| Audit log admin | Ghi nhận mutation lô, unit và anchor |
| PostgreSQL/Alembic | Nguồn dữ liệu vận hành |
| Analytics endpoint | Giữ cho event không chứa PII |
| Vercel + Render | Giữ mô hình deploy hiện tại |

## 3. Khoảng trống chức năng

### 3.1. Định danh

Hiện QR chủ yếu định danh content hoặc batch. Chưa có:

- public code riêng từng unit;
- secret code;
- lifecycle `generated → printed → packed → distributed`;
- mapping unit–batch;
- void code;
- recall unit hoặc batch;
- đối soát số lượng mã.

### 3.2. Truy xuất

Chưa có domain chuẩn cho:

- raw material lot;
- production batch;
- trace event;
- document hash;
- QA approval;
- parent-child relationship;
- correction event.

### 3.3. Xác thực

Chưa có:

- activation endpoint;
- activation attempt;
- scan fingerprint ở mức tối thiểu;
- risk score;
- trạng thái `recheck`, `suspicious`, `compromised`;
- support case.

### 3.4. Blockchain

Chưa có:

- canonical serialization;
- Merkle root hoặc bundle hash;
- ledger adapter;
- outbox;
- transaction receipt;
- retry/reconciliation;
- proof endpoint.

### 3.5. Vận hành

Chưa có:

- batch/trace dashboard;
- mass code generation;
- print export;
- scan anomaly dashboard;
- recall workflow;
- incident runbook.

## 4. Thay đổi đề xuất theo file

### 4.1. Frontend

```text
apps/frontend/src/
  app/router/AppRouter.tsx
  features/qr/pages/QrRedirectPage/index.tsx
  shared/api/qr.ts

  features/trace/
    pages/TracePage/index.tsx
    pages/TraceSupportPage/index.tsx
    components/TraceStatusCard/
    components/ProvenanceTimeline/
    components/ActivationPanel/
    components/ProofPanel/
    components/BatchSummary/
    hooks/useTraceUnit.ts
    services/traceStatus.ts
    types/trace.ts

  shared/api/trace.ts
  shared/analytics/analytics.ts
```

### 4.2. Backend

Đề xuất không tiếp tục đặt toàn bộ logic mới trong `app/modules/qr.py`. Tạo module riêng:

```text
apps/backend/app/modules/traceability/
  router_public.py
  router_admin.py
  schemas.py
  models.py
  repository.py
  service.py
  hashing.py
  risk.py
  permissions.py
  ledger/
    port.py
    database_adapter.py
    evm_adapter.py
    fabric_adapter.py
    outbox_worker.py
```

Các migration:

```text
migrations/versions/
  *_trace_batches_and_events.py
  *_trace_units_and_activation.py
  *_trace_ledger_outbox.py
  *_trace_indexes_and_constraints.py
```

### 4.3. Admin frontend

Nếu admin UI nằm trong frontend hiện tại, thêm:

```text
features/admin/traceability/
  BatchListPage
  BatchDetailPage
  UnitRegistryPage
  TraceEventEditor
  RiskReviewQueue
  AnchorMonitor
```

## 5. Chiến lược tương thích ngược

1. `GET /api/qr/{code}` tiếp tục trả schema cũ, bổ sung field optional:
   - `flowType`;
   - `tracePublicCode`;
   - `traceStatus`;
   - `traceUrl`.
2. QR cũ không có `flowType` được hiểu là `experience`.
3. QR unit trả `flowType="unit-trace"` và frontend chuyển sang `/trace/:code`.
4. QR batch trả `flowType="batch-trace"`.
5. Route `/experience/*` không thay đổi.
6. Event `qr_scan` tiếp tục được ghi; trace module ghi thêm event chi tiết.
7. Không đổi public API hiện tại trong cùng release nếu chưa có deprecation notice.

## 6. Rủi ro tích hợp với codebase

| Rủi ro | Nguyên nhân | Kiểm soát |
|---|---|---|
| Logic QR bị phân tán | QR content và trace cùng sửa route | Dùng `flowType` và một resolver |
| Double analytics | Frontend gọi hai endpoint | Chỉ định endpoint nào là nguồn chuẩn |
| State không nhất quán | QR active nhưng unit void | Unit state có ưu tiên cao hơn QR state |
| Migration quá lớn | Nhiều bảng và constraint cùng lúc | Chia 3–4 migration |
| Admin permission thiếu | Dùng permission chung quá rộng | Permission riêng theo action |
| Secret code lộ log | Log request body | Redact field và không log payload |
| Chain outage ảnh hưởng UX | Gọi chain đồng bộ | Proof đọc từ DB, anchor async |

## 7. Definition of Ready cho implementation

- Route và schema compatibility đã được duyệt.
- Migration naming và module placement đã chốt.
- Có seed batch/unit pilot.
- Có content copy cho sáu trạng thái người dùng.
- Có secret pepper trong secret manager của staging.
- Có mock ledger adapter để frontend/backend phát triển độc lập.
- Có test fixture mô phỏng scan lần một, scan lại và scan bombing.
