# 10. Implementation Roadmap

## 1. Mục tiêu

Tài liệu chuyển kiến trúc mục tiêu thành lộ trình triển khai theo mức ưu tiên. Nguyên tắc là **thay thế rủi ro hiện tại trước, sau đó mới mở rộng tính năng**.

Backend không cần xây toàn bộ commerce/admin ngay. Senova hiện cần ưu tiên QR trải nghiệm, nội dung sản phẩm, submission và dữ liệu kiểm chứng; account/payment chỉ triển khai khi mô hình vận hành thật sự yêu cầu.

## 2. Trạng thái hiện tại (`CURRENT`)

Backend hiện có:

- FastAPI app tại `app/main.py`.
- `GET /api/health`.
- QR resolve.
- QR experience content theo product/version/locale/batch.
- QR scan tracking.
- Submission cho 5 kind.
- Analytics event ingestion.
- Seed JSON cho QR/content/override.
- CORS từ environment.
- Sanitize text cơ bản.
- Honeypot.
- Rate limit in-memory.

Hạn chế quan trọng:

- Submission/analytics/rate limit mất khi restart.
- Nhiều worker làm dữ liệu phân mảnh.
- Chưa có PostgreSQL/ORM/Alembic.
- Chưa có catalog API.
- Chưa có test đầy đủ.
- Chưa có typed settings/structured logging/request ID.
- Public `GET /submissions/{id}` không phù hợp production nếu chỉ dựa vào ID.
- Chưa có authentication/RBAC/admin.
- Commerce frontend vẫn là mock/inquiry, chưa phải giao dịch thật.

## 3. Nguyên tắc ưu tiên

1. **Persistence trước mở rộng**: không thêm nhiều form/admin trên in-memory state.
2. **Contract trước code**: chốt schema/error trước khi frontend chuyển adapter.
3. **Security by default**: admin mutation không public.
4. **Inquiry trước transaction**: chưa tích hợp payment/order giả.
5. **Modular monolith trước microservice**.
6. **Measure before scale**: chỉ thêm Redis/search engine/worker phức tạp khi có nhu cầu, trừ capability distributed bắt buộc.
7. **Mỗi milestone deploy được** và có Definition of Done.

## 4. Tổng quan milestone

| Milestone | Mục tiêu | Ưu tiên |
| --- | --- | --- |
| M0 | Chuẩn hóa nền tảng và test hiện trạng | P0 |
| M1 | PostgreSQL persistence cho QR/submission/analytics | P0 |
| M2 | Product catalog API và frontend integration | P0/P1 |
| M3 | Admin tối thiểu cho content/QR/submission | P1 |
| M4 | Content CMS, media và analytics vận hành | P1 |
| M5 | Customer account/wishlist/cart | P2 |
| M6 | Order + inventory, vẫn có thể chưa payment online | P2 |
| M7 | Payment + fulfillment transactional | P3, chỉ khi validated |
| M8 | Scale, BI, advanced operations | P3/OPTIONAL |

## 5. M0 — Foundation hardening

### Mục tiêu

Biến code hiện tại thành nền tảng có thể mở rộng mà chưa thay đổi hành vi public lớn.

### Công việc

#### Cấu trúc

- Tách `app/main.py` thành:

```text
app/
  main.py
  api/router.py
  api/routes/
    health.py
    qr.py
    submissions.py
    analytics.py
  core/
    config.py
    errors.py
    logging.py
    request_context.py
  modules/
    qr/
    submissions/
    analytics/
```

- Không tạo file/module rỗng không dùng.

#### Config

- Thêm `pydantic-settings`.
- Typed settings.
- Validate production config.
- Cập nhật `.env.example`.

#### API

- Chuẩn hóa response/error envelope.
- Request ID middleware.
- Payload size limit.
- Event name allowlist.
- Field length/format validation.
- Loại hoặc bảo vệ public `GET /submissions/{id}`.

#### Test

- Pytest setup.
- Unit test QR normalize/status/redirect.
- API test health/QR/submission/analytics.
- Rate-limit/honeypot/error envelope.

#### Quality

- Ruff format/lint.
- Type check ở mức phù hợp.
- CI workflow.

### DoD M0

- [ ] `app/main.py` chỉ bootstrap/router.
- [ ] Existing frontend flow không vỡ.
- [ ] Test critical current endpoint pass.
- [ ] Config fail fast ở production.
- [ ] Error không lộ stack trace.
- [ ] Request ID có trong response/log.
- [ ] README chạy local cập nhật.

## 6. M1 — Durable persistence

### Mục tiêu

Loại bỏ dữ liệu nghiệp vụ in-memory và chuẩn bị scale nhiều worker.

### Công việc

#### Database

- PostgreSQL.
- SQLAlchemy 2.x.
- Alembic.
- Session/transaction dependency.

#### Bảng P0

- `submissions`.
- `lead_activities` tối thiểu hoặc chuẩn bị schema.
- `qr_records`.
- `qr_experience_contents`.
- `qr_batch_overrides`.
- `qr_scan_events`/`analytics_events`.

#### Import/seed

- Migration/import seed JSON hiện tại.
- Seed idempotent cho:
  - `PP-2601-A`.
  - `CL-2601-A`.
  - `GS-2601-A`.
  - các mã paused/expired/revoked test nếu cần.

#### Repository/service

- QR repository.
- Submission repository.
- Analytics repository hoặc queue-ready interface.

#### Rate limit

- Redis nếu deploy nhiều instance hoặc cần giới hạn nhất quán.
- Nếu vẫn một instance, ghi rõ giới hạn tạm thời và kế hoạch chuyển.

#### Data protection

- Không log payload form.
- Index list/admin tương lai.
- Retention draft cho analytics/submission.

### Migration strategy

Trong release chuyển đổi:

1. Deploy schema.
2. Import seed.
3. Deploy code đọc DB.
4. Ghi nhận metric lỗi/not found.
5. Giữ seed fallback chỉ trong thời gian ngắn nếu cần, không duy trì hai nguồn sự thật lâu dài.

### DoD M1

- [ ] Restart không mất submission/event.
- [ ] Hai API worker thấy cùng dữ liệu.
- [ ] Migration chạy trên DB sạch.
- [ ] QR state/content/override tương thích contract hiện tại.
- [ ] Constraint unique/index cơ bản.
- [ ] Backup tự động và restore test tối thiểu.
- [ ] Integration test dùng PostgreSQL.

## 7. M2 — Product catalog API

### Mục tiêu

Chuyển dữ liệu sản phẩm từ hardcoded frontend sang API có version và khả năng quản trị sau này.

### Công việc

#### Database

- `products`.
- `product_variants`.
- `collections`.
- `collection_products`.
- `product_media` hoặc media reference tối thiểu.

#### Seed

Import ba dòng:

- Senova Classic.
- Senova Petal Pack.
- Senova Gift Set.

Dữ liệu cần map từ frontend hiện tại:

- slug/name/line.
- tagline/description/short description.
- role.
- status/availability/price label.
- highlights/experience steps.
- brewing/shipping/gift options.
- action/SEO/media.

#### API

- `GET /api/v1/products`.
- `GET /api/v1/products/{slug}`.
- Collection/search tối thiểu nếu frontend cần.

#### Frontend integration

- Tạo adapter `products.ts`.
- Loading/error/empty state.
- Có fallback được kiểm soát trong một release nếu cần.
- Theo dõi API error để quyết định gỡ hardcoded fallback.

#### Cache

- HTTP cache/ETag.
- Redis cache optional khi traffic cần.

### DoD M2

- [ ] Product list/detail từ API.
- [ ] Ba dòng sản phẩm hiển thị đúng.
- [ ] Draft/internal data không lộ.
- [ ] API response tương thích frontend type.
- [ ] Contract test.
- [ ] SEO/media URL đúng.
- [ ] Không phụ thuộc DB column trực tiếp ở frontend.

## 8. M3 — Admin tối thiểu

### Mục tiêu

Cho đội dự án quản trị QR, nội dung sản phẩm và submission mà không sửa code/DB trực tiếp.

### Phạm vi

#### Authentication

- Admin login.
- Session an toàn.
- Password reset.
- MFA khuyến nghị cho role nhạy cảm.

#### RBAC tối thiểu

- `content.write`.
- `content.publish`.
- `qr.manage`/action tách nếu cần.
- `submissions.read`.
- `submissions.write`.
- `submissions.export`.
- `audit.read`.

#### Admin QR

- List/filter.
- Create/update.
- Activate/pause/revoke.
- Validate destination/content version.
- Batch override.

#### Admin submissions

- List/filter/detail.
- Status.
- Assign/note.
- Export có permission/audit.

#### Audit

- Login admin.
- QR mutation.
- Submission status/export.
- Permission change.

### Security gate

Không triển khai admin chỉ bằng route ẩn hoặc secret query param.

### DoD M3

- [ ] Admin mutation yêu cầu auth + permission.
- [ ] Editor/operator không có toàn quyền mặc định.
- [ ] Export PII có audit.
- [ ] QR active cần content publish + destination hợp lệ.
- [ ] Session revoke/logout.
- [ ] Authorization test.
- [ ] Admin action critical có audit.

## 9. M4 — Content CMS, media and operational analytics

### Mục tiêu

Quản trị nội dung văn hóa/sản phẩm có revision/publish workflow và media an toàn.

### Công việc

#### Content

- `content_items`.
- `content_revisions`.
- Locale.
- Draft/review/publish/unpublish.
- Source note nội bộ.
- SEO.

#### QR content

- Di chuyển hoàn toàn seed content vào CMS/DB.
- Version immutable sau publish.
- Batch override workflow.
- Cache invalidation.

#### Media

- Object storage.
- Presigned upload.
- Metadata/alt text.
- Public/private.
- Thumbnail/optimization.

#### Analytics

- Dashboard QR/submission.
- Aggregate daily.
- Export aggregate.
- Không đưa PII vào event.

#### Notifications

- Email lead notification/receipt nếu cần.
- Outbox/worker.
- Retry.

### DoD M4

- [ ] Published revision là nguồn public duy nhất.
- [ ] Editor không publish nếu thiếu quyền.
- [ ] Nội dung đã publish không sửa trực tiếp.
- [ ] QR content version ổn định.
- [ ] Media upload không public trước khi ready.
- [ ] Email không làm chậm/làm fail submission sau khi đã persist.
- [ ] Dashboard metric không dùng PII làm label.

## 10. M5 — Customer account, wishlist and cart

### Điều kiện bắt đầu

- Có nhu cầu account thật, không chỉ UI mock.
- Privacy notice/retention/consent được chốt.
- Có quy trình hỗ trợ người dùng.

### Công việc

#### Identity

- Register.
- Verify email.
- Login/logout/refresh.
- Password reset.
- Session management.

#### Customer

- Profile.
- Address.
- Consent.
- Privacy request cơ bản.

#### Wishlist/cart

- Wishlist.
- Guest cart.
- User cart.
- Merge cart.
- Price refresh.
- Version conflict.

### DoD M5

- [ ] Auth/session security test.
- [ ] Không horizontal access.
- [ ] Cart server tính giá.
- [ ] Guest token an toàn.
- [ ] Consent marketing tách terms.
- [ ] Privacy request workflow.
- [ ] PII không log/cache shared.

## 11. M6 — Order and inventory without mandatory online payment

### Mục tiêu

Hỗ trợ order thật ở COD/manual confirmation hoặc workflow nội bộ, trước khi tích hợp payment online.

### Điều kiện

- Sản phẩm, giá, quy cách và vận hành đã đủ ổn định.
- Có chính sách giao/đổi/hủy.
- Có người vận hành đơn.
- Có nguồn tồn kho xác định.

### Công việc

#### Order

- Create order idempotent.
- Item/price/address snapshot.
- Order state/history.
- Customer/admin view.
- Cancel flow.

#### Inventory

- Location.
- Stock.
- Reservation.
- Movement.
- Adjustment audit.
- Batch/lot nếu cần.

#### Notification

- Confirmation/status email.

#### Admin

- Order list/detail/action.
- Inventory view/adjustment.

### DoD M6

- [ ] Không tạo order lặp khi retry.
- [ ] Không oversell trong concurrent test.
- [ ] Order total do server tính.
- [ ] Snapshot giữ lịch sử.
- [ ] State transition hợp lệ.
- [ ] Inventory movement append-only.
- [ ] Hủy release reservation đúng.
- [ ] Audit adjustment/order override.

## 12. M7 — Payment and fulfillment

### Điều kiện bắt đầu bắt buộc

- Transactional commerce đã được phê duyệt.
- Có pháp nhân/quy trình tài chính phù hợp.
- Chọn payment/shipping provider.
- Có sandbox và tài liệu tích hợp.
- Có đối soát/refund/support owner.
- Security/privacy review hoàn tất.

### Payment

- Provider adapter.
- Create payment.
- Return page.
- Signed webhook.
- Idempotent event.
- Paid/failed state.
- Refund.
- Reconciliation.

### Fulfillment

- Shipment.
- Tracking.
- Shipping webhook/sync.
- Delivery/failed/return.

### Resilience

- Outbox/worker.
- Provider timeout/retry.
- Duplicate/out-of-order event.
- Dead-letter/manual review.

### DoD M7

- [ ] Không lưu card/CVV.
- [ ] Không đánh dấu paid từ client return.
- [ ] Webhook signature/replay test.
- [ ] Double charge/refund được ngăn.
- [ ] Payment/order/inventory invariant.
- [ ] Refund permission + step-up nếu cần + audit.
- [ ] Daily reconciliation.
- [ ] Incident/disable payment runbook.

## 13. M8 — Scale and advanced operations

Chỉ triển khai theo metric/nhu cầu:

- Redis cache/queue mở rộng.
- Multiple API/worker instances.
- Advanced search.
- BI export/data warehouse.
- CDN/media transformation.
- Fine-grained delegated admin.
- Passkey/WebAuthn.
- Advanced anti-abuse.
- Canary deployment.
- SLO/burn-rate alert.
- Partition analytics/event tables.

Không mặc định tách microservice.

## 14. Priority backlog chi tiết

### P0 — Phải làm trước production data

- [ ] Tách cấu trúc code.
- [ ] Test QR/submission/analytics.
- [ ] Typed config.
- [ ] Standard error/request ID.
- [ ] PostgreSQL/Alembic.
- [ ] Persistence submission/QR/event.
- [ ] CORS/secret/log hardening.
- [ ] Backup/restore.
- [ ] CI.

### P1 — Cần cho vận hành dự án

- [ ] Catalog API.
- [ ] Frontend product adapter.
- [ ] Admin auth/RBAC.
- [ ] QR management.
- [ ] Submission/lead management.
- [ ] Audit.
- [ ] Content revision/publish.
- [ ] Media storage.
- [ ] Email jobs.
- [ ] Dashboard aggregate.

### P2 — Khi có account/đơn thật

- [ ] Customer auth/profile/address.
- [ ] Consent/privacy request.
- [ ] Wishlist/cart.
- [ ] Order.
- [ ] Inventory/reservation/movement.
- [ ] Order admin/notification.

### P3 — Khi thương mại hóa transactional

- [ ] Payment provider.
- [ ] Signed webhook.
- [ ] Refund/reconciliation.
- [ ] Shipping integration.
- [ ] Advanced monitoring/scale.

## 15. Technical debt cần xử lý

### `app/main.py` monolith

Rủi ro:

- Khó test.
- Business logic lẫn route/storage.
- Tăng xung đột code.

Xử lý ở M0.

### In-memory storage

Rủi ro:

- Mất dữ liệu.
- Không scale.

Xử lý ở M1, không trì hoãn nếu thu dữ liệu thật.

### In-memory rate limit

Rủi ro:

- Không nhất quán nhiều worker.

Xử lý cùng M1 hoặc trước scale-out.

### Seed như nguồn runtime

Rủi ro:

- Cần deploy code để đổi content.
- Không có revision/audit.

Chấp nhận ở prototype, chuyển M4.

### Generic JSON submission payload

Ưu điểm:

- Linh hoạt MVP.

Rủi ro:

- Query/report khó.
- Schema drift.

Hướng xử lý:

- Giữ raw `payload_json`.
- Tách field cần tìm kiếm/report.
- Version schema theo kind khi form thay đổi.

### Public read submission

Rủi ro:

- Enumeration/PII leakage.

Xử lý M0:

- Remove production route hoặc thêm opaque receipt token/auth.

## 16. Định hướng cấu trúc code theo milestone

### Sau M0

```text
app/
  main.py
  api/
  core/
  modules/
    qr/
    submissions/
    analytics/
  seed/
tests/
```

### Sau M2–M4

```text
app/
  api/
    routes/public/
    routes/admin/
  core/
  db/
  modules/
    auth/
    catalog/
    content/
    qr/
    submissions/
    analytics/
    media/
    audit/
  workers/
tests/
```

### Sau M6–M7

Thêm:

```text
modules/
  users/
  commerce/
  inventory/
  payments/
  fulfillment/
  notifications/
```

## 17. Migration frontend theo adapter

Thứ tự đề xuất:

1. Submission -> API thật. `CURRENT`, cần persistence.
2. QR resolve/content/analytics -> API thật. `CURRENT`, cần persistence/hardening.
3. Products -> API.
4. Public content -> API/CMS.
5. Admin app -> protected API.
6. Account/wishlist/cart -> API khi backend sẵn sàng.
7. Checkout inquiry -> submission vẫn giữ.
8. Checkout transaction -> order/payment chỉ sau M6/M7.

Không bật UI transactional trước khi backend/provider/operations đạt DoD.

## 18. Data migration plan từ seed

### QR

- Parse/validate mọi seed.
- Upsert theo `code`.
- Kiểm tra destination.
- Kiểm tra content version.
- Giữ status/time/campaign/locale.
- Report record lỗi, không silent skip.

### QR content

- Upsert theo `(product, version, locale)`.
- Đánh dấu publish state rõ.
- Lưu source note nếu có.

### Product

- Import từ frontend data.
- Tạo mapping media.
- Tách field public/commerce.
- Không coi price label là price transactional.

## 19. Rollout strategy từng capability

Mỗi capability theo mẫu:

```text
Document -> Implement behind flag -> Integration test -> Staging -> Shadow/dual-read if needed -> Enable -> Monitor -> Remove fallback
```

Dual-write chỉ dùng ngắn hạn và có reconciliation; tránh duy trì hai nguồn sự thật.

## 20. Metrics theo milestone

### M0–M1

- API error/latency.
- QR resolve status.
- Submission created/rejected.
- DB error.
- Rate limit.

### M2–M4

- Product/content cache hit.
- Content publish.
- QR content not found.
- Lead backlog.
- Email job success.
- Admin auth failure.

### M5–M7

- Register/login/session.
- Cart conversion.
- Order create failure.
- Inventory reservation failure.
- Payment success/failure/webhook lag.
- Refund/shipment.

## 21. Team workflow

Mỗi feature ticket cần:

- Use case ID.
- Actor/permission.
- API contract.
- Business rule.
- Data/migration.
- Security/privacy.
- Test cases.
- Observability.
- Rollout/rollback.

PR cần:

- Code.
- Test.
- Docs.
- Migration.
- Screenshot/OpenAPI/example nếu liên quan.

## 22. Risk register kỹ thuật

| Risk | Khả năng | Tác động | Giảm thiểu |
| --- | --- | --- | --- |
| Mất submission do memory | cao nếu deploy hiện tại | cao | M1 persistence |
| QR content sai version | trung bình | cao về trải nghiệm/uy tín | publish workflow + activation validation |
| PII lộ qua log/export | trung bình | cao | redaction + permission + audit |
| Overbuild commerce sớm | cao | trung bình-cao | inquiry mode, stage gate |
| Payment state sai | thấp trước khi bật, cao impact | rất cao | M7 gate, webhook/idempotency/reconciliation |
| Oversell | chỉ khi order thật | cao | atomic reservation/concurrency test |
| Admin privilege quá rộng | trung bình | cao | RBAC/separation/audit/MFA |
| Migration gây downtime | tăng theo dữ liệu | cao | expand/contract + staging + backup |
| Provider outage | trung bình | trung bình-cao | queue/retry/degraded mode |
| Tài liệu lệch code | trung bình | trung bình | docs in PR + status marker + contract test |

## 23. Stage gates

### Gate A — Thu dữ liệu người dùng thật

Yêu cầu:

- Persistence.
- Privacy notice/purpose.
- No raw PII logs.
- Rate limit.
- Backup.
- Access control cho data.

### Gate B — Mở admin

Yêu cầu:

- Authentication.
- RBAC.
- Audit.
- Secure session.
- Export control.
- Security tests.

### Gate C — Nhận đơn thật

Yêu cầu:

- Server price calculation.
- Order snapshot/state.
- Inventory/capacity process.
- Cancellation/support policy.
- Idempotency.
- Operations owner.

### Gate D — Thu tiền online

Yêu cầu:

- Provider/legal/finance readiness.
- Signed webhook.
- No card storage.
- Refund/reconciliation.
- Incident runbook.
- Security review.

## 24. Tiêu chí hoàn thành toàn bộ backend mục tiêu

- Public content/catalog/QR ổn định.
- Submission/lead lưu bền vững và vận hành được.
- Admin auth/RBAC/audit đầy đủ.
- Content/QR có revision/publish/version.
- Media an toàn.
- Account/privacy nếu bật.
- Cart/order/inventory nhất quán nếu bật.
- Payment/fulfillment an toàn và đối soát nếu bật.
- CI/CD, migration, observability, backup/restore, runbook.
- Test critical journey, security, concurrency và contract.
- Tài liệu phản ánh đúng trạng thái `CURRENT/NEXT/TARGET/OPTIONAL`.
