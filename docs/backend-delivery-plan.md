# Kế hoạch triển khai Backend Senova

> Lập ngày 2026-07-15, dựa trên bộ đặc tả trong `apps/backend/docs` và code hiện tại trong `apps/backend`.

## Theo dõi triển khai

> Quy ước: chỉ chuyển sang `DONE` sau khi code, test và tài liệu/contract liên quan đã đạt quality gate. Cập nhật gần nhất: 2026-07-16.

| Trạng thái | Task | Bằng chứng |
| --- | --- | --- |
| DONE | BE-001 | `/api` và `/api/v1` chạy song song; compatibility/deprecation note trong backend README |
| DONE | BE-002 | Receipt token HMAC opaque; lookup không token/sai token không trả trạng thái hoặc PII |
| DONE | BE-003 | Chốt `new → contacted → qualified → closed`; mapping legacy có test và không silently map giá trị lạ |
| DONE | BE-004 | Pre-order bắt buộc `items[]`; server snapshot product/variant từ catalog và bỏ qua label client |
| DONE | BE-010 | `main.py` chỉ còn app factory, middleware và router registration |
| DONE | BE-011 | Catalog, QR, submissions, analytics đã tách route → service → repository |
| DONE | BE-012 | Typed settings bằng `pydantic-settings`, fail-fast cho staging/production, `.env.example` đã cập nhật |
| DONE | BE-013 | Domain error/envelope và exception handlers dùng chung, không expose stack trace |
| DONE | BE-014 | `X-Request-ID`, JSON access log, trusted proxy handling và PII/secret redaction |
| DONE | BE-015 | Payload limit, field bounds, analytics allowlist, CORS allowlist và rate limit single-instance |
| DONE | BE-016 | Ruff, mypy, pytest và GitHub Actions quality gate; 21 API/unit tests pass |
| DONE | BE-000 | Baseline và M1 suite chạy trên PostgreSQL 16 cô lập; quality gate đạt 27 tests |
| DONE | BE-100 | SQLAlchemy 2.x engine/session/transaction factory, pool pre-ping và repository lifecycle |
| DONE | BE-101 | Alembic revision `20260716_0001`; app startup không còn bootstrap DDL |
| DONE | BE-102 | Adopt schema legacy không mất submission/analytics; idempotency/index/constraint được giữ |
| DONE | BE-103 | PostgreSQL schema cho product/variant, QR record, experience content và batch override |
| DONE | BE-104 | Seed validator/importer idempotent; lần hai ghi 0 record và không overwrite dữ liệu hiện hữu |
| DONE | BE-105 | Public catalog/QR đọc PostgreSQL qua repository; không còn seed fallback ở runtime production |
| DONE | BE-106 | Migration map status legacy sang canonical; dữ liệu `in_progress` được kiểm chứng thành `contacted` |
| DONE | BE-107 | PostgreSQL migration/repository/API tests gồm legacy adoption, seed hai lần và concurrent idempotency |
| DONE | BE-108 | Backup/restore runbook và drill PostgreSQL 16; record counts source/restore khớp |
| DONE | BE-200 | Schema `products`, `product_variants`, `collections`, join collection-product và product media reference |
| DONE | BE-201 | Ba product hiện tại được validate/import đầy đủ và idempotent vào PostgreSQL |
| DONE | BE-202 | `/api/v1/products` list/detail chỉ expose `active`; `/api` giữ draft compatibility; OpenAPI/error contract có test |
| DONE | BE-203 | ETag/Cache-Control cho list/detail; ETag thay đổi theo payload DB được kiểm chứng |
| DONE | BE-204 | Backend/FE contract tests cho camelCase, envelope, draft visibility và pre-order items |
| DONE | BE-205 | FE catalog provider gọi API thật; loading/error telemetry; không dùng local fallback khi API đã cấu hình; QR không che business error |
| DONE | BE-206 | Checkout gửi `items[]` + idempotency key ổn định; server validate và snapshot product/variant name |
| DONE | BE-300 | Argon2id login/reset; opaque 8h HttpOnly session cookie, double-submit CSRF, logout/revoke-all và login/reset rate limit |
| DONE | BE-301 | Role/permission schema và dependency deny-by-default kiểm tra quyền trên server cho mọi admin route |
| DONE | BE-302 | Audit login/permission denied/product publish/QR mutation/lead status-assign/export kèm actor và request ID |
| DONE | BE-303 | Product admin list/detail/upsert/publish/archive; trường `version` bảo vệ optimistic concurrency |
| DONE | BE-304 | QR admin list/upsert/activate/pause/revoke; chuẩn hóa code và chặn destination ngoài `/experience/` |
| DONE | BE-305 | Lead list/filter/page/detail/status/assign/note; `meta.total` lấy bằng count query độc lập |
| DONE | BE-306 | Permission export riêng; CSV chỉ gồm allowlist field, audit, giới hạn 1.000 dòng/365 ngày |
| DONE | BE-307 | Dashboard aggregate ở backend, hỗ trợ date range và IANA timezone chuẩn hóa về UTC |
| DONE | BE-308 | PostgreSQL integration test cho auth, CSRF, deny-by-default RBAC, session revoke, reset, export và audit |
| NEXT | BE-400 → BE-405 | Content revision/publish, media, outbox worker, distributed rate limit và observability |

M0-M3 đã hoàn tất theo automated quality gate, PostgreSQL 16 integration/restore drill và frontend production build. PostgreSQL + SQLAlchemy + Alembic là persistence path; FE dùng API thật cho catalog/QR/submission và admin authentication. M4 là phase kế tiếp.

## 1. Mục tiêu triển khai

Đưa backend hiện tại từ MVP public đang chạy sang một modular monolith đủ an toàn để:

1. vận hành catalog, QR, submission và analytics trên PostgreSQL có migration;
2. kết nối frontend với API thật mà không phá contract hiện tại;
3. mở admin tối thiểu có authentication, RBAC và audit;
4. chuẩn bị content workflow và vận hành production;
5. chỉ mở account/commerce/payment khi đạt stage gate tương ứng.

Kế hoạch không xây microservice và không triển khai payment ở giai đoạn đầu.

## 2. Baseline và khoảng trống

### Đã có (`CURRENT`)

- FastAPI/Uvicorn, API prefix `/api`.
- Health, product list/detail, QR resolve/content/scan.
- Năm loại submission và analytics ingestion.
- PostgreSQL/Psycopg 3 cho submission và analytics.
- Idempotency cho submission, CORS, honeypot, sanitize và rate limit in-memory.
- Seed JSON cho product, QR, QR content và batch override.
- Test cho các public flow chính.

### Khoảng trống ưu tiên

| Mức | Khoảng trống | Tác động |
| --- | --- | --- |
| P0 | `app/main.py` đang chứa route và business logic | Khó mở rộng, test và review thay đổi |
| P0 | Bootstrap DDL khi startup, chưa có SQLAlchemy/Alembic | Rủi ro migration và rollback production |
| P0 | QR/catalog/content vẫn đọc seed JSON | Chưa thể quản trị và audit dữ liệu |
| P0 | Public submission lookup chỉ dựa vào ID | Rủi ro enumeration; cần bỏ hoặc dùng receipt token |
| P0 | Chưa có request ID, structured log và PII redaction chuẩn | Khó điều tra lỗi, có rủi ro privacy |
| P0 | Chưa có auth/RBAC nhưng frontend đã có admin prototype | Không được nối admin với dữ liệu thật |
| P1 | Product/QR experience frontend còn local fallback | Có thể che lỗi nghiệp vụ từ backend |
| P1 | Rate limit nằm trong memory | Không nhất quán khi nhiều worker/instance |
| P1 | Checkout chỉ có `itemCount` | Không đủ dữ liệu xử lý pre-order |
| P1 | Submission status hiện tại lệch canonical lead status | Phải migrate trước admin |

## 3. Giả định lập kế hoạch

- Nhịp triển khai: sprint 2 tuần.
- Một squad tối thiểu: 2 backend developer; FE, QA và DevOps hỗ trợ theo milestone.
- Estimate là **ngày công backend**, dùng để xếp thứ tự và cân đối; cần hiệu chỉnh sau refinement.
- Inquiry/pre-order là chế độ commerce chính trong release đầu; chưa thu tiền online.
- PostgreSQL là source of truth. Redis chỉ bắt buộc khi chạy nhiều instance hoặc có background worker.
- Giữ `/api` tương thích trong thời gian chuyển đổi; `/api/v1` được mở theo contract mới và có deprecation plan.

## 4. Lộ trình đề xuất

| Giai đoạn | Thời lượng gợi ý | Kết quả deploy được | Phụ thuộc |
| --- | --- | --- | --- |
| P0 — Baseline | 2-3 ngày | Baseline test/contract và backlog chốt | Không |
| M0 — Foundation | 1 sprint | App modular, config/log/error/test/CI chuẩn | P0 |
| M1 — Persistence | 1-2 sprint | Alembic + repository; QR/content/event trên PostgreSQL | M0 |
| M2 — Catalog & FE cutover | 1 sprint | Catalog DB/API; FE chuyển sang API thật | M1 |
| M3 — Secure admin | 2 sprint | Admin auth/RBAC, QR/product/lead, audit | M1, M2 |
| M4 — Content & operations | 1-2 sprint | Revision/publish, jobs/media tối thiểu, dashboard/ops | M3 |

Tổng release nền tảng đến hết M3: khoảng 5-6 sprint, tương đương 10-12 tuần với squad giả định. M4 có thể tách thành release kế tiếp.

## 5. Backlog triển khai

### P0 — Baseline và quyết định contract (2-3 ngày công)

| ID | Công việc | Đầu ra/acceptance |
| --- | --- | --- |
| BE-000 | Chạy và ghi baseline test hiện tại | Test public flow pass với PostgreSQL test; lưu command trong README |
| BE-001 | Chốt versioning `/api` và `/api/v1` | Có compatibility/deprecation note; không đổi route đang dùng đột ngột |
| BE-002 | Chốt submission receipt | Bỏ public lookup hoặc thêm opaque receipt token; không lộ payload/PII |
| BE-003 | Chốt canonical lead status | `new -> contacted -> qualified -> closed`; có mapping dữ liệu cũ |
| BE-004 | Chốt pre-order payload | Bắt buộc `items[]`; server không tin price/label từ client |

**Exit gate:** contract, migration mapping và acceptance test đã được BE/FE/QA thống nhất.

### M0 — Foundation hardening (12-16 ngày công)

| ID | Công việc | Đầu ra/acceptance |
| --- | --- | --- |
| BE-010 | Tách app bootstrap và router | `main.py` chỉ tạo app/middleware/router; route tách public/system |
| BE-011 | Tạo module QR, submissions, analytics, catalog | Route → service → repository; schema API không phụ thuộc DB model |
| BE-012 | Typed settings bằng `pydantic-settings` | Fail fast khi production config thiếu/sai; `.env.example` cập nhật |
| BE-013 | Chuẩn hóa domain error/envelope | Error code/status thống nhất; không trả stack trace |
| BE-014 | Request context và logging | `X-Request-ID`, JSON log, redaction PII/secrets |
| BE-015 | API hardening | Payload limit, field length, analytics allowlist, trusted proxy/CORS rõ ràng |
| BE-016 | Test và quality gate | Unit/API tests, Ruff, type check phù hợp, CI chạy test/lint |

**Exit gate M0:** public contract không vỡ; critical tests pass; log truy vết được và không chứa raw PII.

### M1 — Durable persistence và migration (18-24 ngày công)

| ID | Công việc | Đầu ra/acceptance |
| --- | --- | --- |
| BE-100 | SQLAlchemy 2.x session/transaction | Connection lifecycle và transaction dependency rõ ràng |
| BE-101 | Khởi tạo Alembic | Upgrade được DB sạch; không còn bootstrap DDL là cơ chế production |
| BE-102 | Migration submissions/analytics | Giữ idempotency, constraint/index và dữ liệu hiện tại |
| BE-103 | Migration QR schema | `qr_records`, content, batch override, scan events và FK/index |
| BE-104 | Import seed idempotent | Validate/report record lỗi; không overwrite dữ liệu admin về sau |
| BE-105 | Repository/service cutover | API đọc DB; fallback seed chỉ dùng tạm qua feature flag |
| BE-106 | Lead status data migration | Map status legacy; có backfill verification và rollback/forward-fix |
| BE-107 | PostgreSQL integration/migration tests | DB sạch, upgrade version trước, seed hai lần, concurrency/idempotency |
| BE-108 | Backup/restore drill | Có backup policy, restore test và evidence tối thiểu |

**Quyết định rate limit:** giữ single-instance limit trong M1 nếu chỉ chạy một instance; thêm Redis trước scale-out hoặc trước M4 worker.

**Exit gate M1:** restart không mất dữ liệu; hai worker thấy cùng state nghiệp vụ; migration và restore đã được kiểm chứng.

### M2 — Catalog API và frontend cutover (12-16 ngày công BE)

| ID | Công việc | Đầu ra/acceptance |
| --- | --- | --- |
| BE-200 | Schema catalog | Product, variant, collection/media reference; slug/SKU unique |
| BE-201 | Import ba product hiện tại | Mapping đủ field public, SEO/media; import idempotent |
| BE-202 | Public catalog `/api/v1` | List/detail, publish visibility, error và OpenAPI đúng contract |
| BE-203 | HTTP caching | ETag/Cache-Control; invalidation strategy cho admin publish |
| BE-204 | Contract tests với FE types | Casing camelCase, nullability, media URL và draft compatibility |
| BE-205 | Hỗ trợ FE cutover | Loading/error/fallback telemetry; gỡ fallback sau một release ổn định |
| BE-206 | Sửa pre-order contract | Validate `items[]`, snapshot product/variant name, idempotent submit |

**Exit gate M2:** product và QR experience lấy từ API; business error không bị local fallback che; checkout inquiry gửi đủ item.

### M3 — Admin tối thiểu có bảo mật (28-36 ngày công)

| ID | Công việc | Đầu ra/acceptance |
| --- | --- | --- |
| BE-300 | Admin identity/session | Login/logout/me, reset password, revoke session; cookie/token an toàn |
| BE-301 | RBAC | Role/permission và dependency kiểm tra quyền server-side |
| BE-302 | Audit log | Login, permission, publish, QR mutation, lead status/assign/export |
| BE-303 | Product admin | List/detail/create/update/publish/archive; optimistic concurrency |
| BE-304 | QR admin | Create/update/activate/pause/revoke; validate destination/content |
| BE-305 | Lead admin | List/filter/page/detail/status/assign/note; `meta.total` ổn định |
| BE-306 | PII export control | Permission riêng, audit, giới hạn field và retention |
| BE-307 | Dashboard aggregate tối thiểu | Date range/timezone thống nhất; không aggregate raw data ở FE |
| BE-308 | Authorization/security tests | Deny-by-default, horizontal access, session revoke, export/audit |

**Exit gate M3 / Gate B:** không thể truy cập admin bằng sessionStorage giả; mọi mutation yêu cầu permission và tạo audit khi cần.

### M4 — Content, media và vận hành (20-28 ngày công)

| ID | Công việc | Đầu ra/acceptance |
| --- | --- | --- |
| BE-400 | Content revision workflow | Draft/review/publish/unpublish; published revision immutable |
| BE-401 | QR content publish | Version/locale/batch override; activation kiểm tra content tồn tại |
| BE-402 | Media storage tối thiểu | Presigned upload, metadata, allowlist type/size, private-before-ready |
| BE-403 | Outbox + worker | Notification sau commit, retry/idempotency, dead-letter/manual review |
| BE-404 | Distributed rate limit | Redis/shared store nếu chạy nhiều instance |
| BE-405 | Observability | Readiness, metrics, dashboard, alert cho API/DB/QR/submission/jobs |
| BE-406 | Production runbooks | Deploy/migration/rollback, DB outage, QR lỗi, submission lỗi, secret leak |

**Exit gate M4:** published content là source public duy nhất; side effect không làm fail transaction chính; có monitor và runbook vận hành.

## 6. Stage gate cho các giai đoạn sau

### Gate C — Account/order thật

Chỉ bắt đầu M5-M6 khi có nhu cầu business đã xác nhận, privacy/consent/retention được chốt, có owner vận hành đơn và quy trình inventory. Backend phải tự tính giá, snapshot order, idempotent create và chống oversell.

### Gate D — Payment/fulfillment

Chỉ bắt đầu M7 khi pháp lý/tài chính/provider/sandbox/reconciliation/support đã sẵn sàng. Không lưu card/CVV; paid state chỉ đến từ webhook đã verify; refund và reconciliation phải có audit/runbook.

M8 (scale/BI/search nâng cao) chỉ triển khai theo metric thực tế. Không mặc định tách microservice.

## 7. Chiến lược release và migration

Mỗi capability theo chuỗi:

```text
Contract -> Migration -> Implement sau feature flag -> Integration test
-> Staging -> Enable có giám sát -> Gỡ fallback -> Cập nhật tài liệu
```

Với seed-to-database:

1. deploy schema;
2. chạy import idempotent và đối soát số lượng/hash/record lỗi;
3. deploy code dual-read có metric trong thời gian ngắn nếu cần;
4. chuyển DB thành source of truth;
5. gỡ seed fallback sau khi ổn định.

Không duy trì dual-write dài hạn. Migration destructive dùng expand/contract; backup và forward-fix plan phải có trước deploy.

## 8. Test và quality gate bắt buộc

Mỗi PR backend phải có code, test, contract/docs và migration khi liên quan. Pipeline tối thiểu:

1. Ruff format/lint và type check;
2. unit/schema tests;
3. API integration tests;
4. PostgreSQL repository/migration tests;
5. OpenAPI/FE adapter contract tests;
6. security tests theo milestone;
7. smoke test sau deploy.

Critical journeys bắt buộc: QR active/paused/expired/revoked, năm submission kind, idempotent retry, không PII trong analytics/log, auth deny-by-default, publish/audit và migration từ version trước.

## 9. Phụ thuộc phối hợp

| Nhóm | Việc cần phối hợp |
| --- | --- |
| Frontend | `items[]`, idempotency key ổn định, API adapters, bỏ fallback đúng thời điểm, admin auth thật |
| QA | Contract matrix, negative/security/migration tests, acceptance theo stage gate |
| DevOps | PostgreSQL test/staging, secret, CI/CD, backup/restore, Redis khi scale, metrics/alerts |
| Product/Ops | Lead status/SLA, role/permission, privacy/retention, content publish owner, order/payment gates |

## 10. Rủi ro và kiểm soát

| Rủi ro | Kiểm soát |
| --- | --- |
| Contract `/api` và `/api/v1` lệch nhau | Contract test, compatibility adapter, deprecation window |
| Migration làm mất dữ liệu | Alembic, staging rehearsal, backup/restore, reconciliation |
| Seed và DB thành hai nguồn sự thật | Feature flag ngắn hạn, metric dual-read, deadline gỡ fallback |
| PII lộ qua log/admin/export | Redaction, RBAC, audit, field allowlist, retention |
| QR trỏ sai/open redirect | Internal destination allowlist, publish/activation validation |
| Admin privilege quá rộng | Deny-by-default, permission matrix, authorization tests |
| Scope commerce phình sớm | Giữ inquiry mode; áp dụng Gate C/D |

## 11. Definition of Done cho release nền tảng (M0-M3)

- Public API hiện tại không bị breaking change ngoài deprecation đã công bố.
- PostgreSQL + SQLAlchemy + Alembic là persistence path production.
- Catalog, QR/content, submission và analytics có repository/integration test.
- FE dùng API cho product, QR, submission; fallback đã được kiểm soát hoặc gỡ.
- Pre-order chứa `items[]` và server snapshot dữ liệu cần cho vận hành.
- Admin có auth, RBAC, session revoke và audit; PII/export được kiểm soát.
- Structured log/request ID/metric không chứa raw PII.
- CI, migration rehearsal, backup/restore và smoke test đạt.
- Tài liệu `CURRENT/NEXT/TARGET/OPTIONAL` được cập nhật cùng release.

## 12. Bước khởi động ngay

1. Refinement BE-000 đến BE-004 với FE/QA/Product.
2. Tạo branch M0 và tách app theo vertical slice, bắt đầu từ health + QR.
3. Thiết lập CI/test gate trước khi refactor các route còn lại.
4. Chuẩn bị PostgreSQL test container/database cho M1.
5. Chốt owner và ngày review Gate A/B trước khi mở dữ liệu thật cho admin.
