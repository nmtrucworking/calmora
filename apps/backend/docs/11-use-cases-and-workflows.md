# 11. Use Cases and Workflows

## 1. Mục tiêu

Tài liệu mô tả toàn bộ trường hợp sử dụng backend Senova theo actor, trạng thái triển khai, luồng chính, luồng thay thế/lỗi, dữ liệu, quyền, audit và analytics.

Ký hiệu:

- `CURRENT`: API/behavior đã có ở backend hiện tại.
- `NEXT`: ưu tiên triển khai để thay seed/in-memory/mock.
- `TARGET`: thiết kế đầy đủ dài hạn.
- `OPTIONAL`: chỉ triển khai khi mô hình vận hành yêu cầu.

## 2. Actor và hệ thống ngoài

| Mã | Actor |
| --- | --- |
| A-01 | Khách truy cập ẩn danh |
| A-02 | Người quét QR |
| A-03 | Khách gửi form/lead |
| A-04 | Khách hàng có tài khoản |
| A-05 | Khách mua không tài khoản |
| A-06 | Content Editor |
| A-07 | Content Approver |
| A-08 | Catalog Manager |
| A-09 | QR Manager |
| A-10 | Lead Operator |
| A-11 | Order Operator |
| A-12 | Inventory Operator |
| A-13 | Finance Operator |
| A-14 | Analyst |
| A-15 | Administrator |
| A-16 | Background Worker/Scheduler |
| A-17 | Email Provider |
| A-18 | Payment Provider |
| A-19 | Shipping Provider |
| A-20 | Object Storage/CDN |

## 3. Danh mục use case

### Public/catalog/content

| ID | Use case | Actor | Status |
| --- | --- | --- | --- |
| UC-PUB-01 | Kiểm tra health/readiness | A-01/hạ tầng | `CURRENT/NEXT` |
| UC-PUB-02 | Xem danh sách sản phẩm | A-01 | `CURRENT` |
| UC-PUB-03 | Xem chi tiết sản phẩm | A-01 | `CURRENT` |
| UC-PUB-04 | Xem collection | A-01 | `TARGET` |
| UC-PUB-05 | Tìm kiếm sản phẩm/nội dung | A-01 | `TARGET` |
| UC-PUB-06 | Xem trang nội dung/journal/chính sách | A-01 | `TARGET` |

### QR experience

| ID | Use case | Actor | Status |
| --- | --- | --- | --- |
| UC-QR-01 | Resolve QR active | A-02 | `CURRENT` |
| UC-QR-02 | Xử lý QR không tồn tại | A-02 | `CURRENT` |
| UC-QR-03 | Xử lý QR paused/expired/revoked | A-02 | `CURRENT` |
| UC-QR-04 | Ghi nhận QR scan | A-02 | `CURRENT` |
| UC-QR-05 | Lấy nội dung trải nghiệm theo version/locale | A-02 | `CURRENT` |
| UC-QR-06 | Áp dụng nội dung riêng theo batch | A-02 | `CURRENT` |
| UC-QR-07 | Redirect QR phía server | A-02 | `OPTIONAL` |

### Submission/lead

| ID | Use case | Actor | Status |
| --- | --- | --- | --- |
| UC-SUB-01 | Gửi contact | A-03 | `CURRENT` |
| UC-SUB-02 | Gửi partner inquiry | A-03 | `CURRENT` |
| UC-SUB-03 | Đăng ký sample-interest | A-03 | `CURRENT` |
| UC-SUB-04 | Gửi feedback QR/sản phẩm | A-03 | `CURRENT` |
| UC-SUB-05 | Gửi pre-order/reorder inquiry | A-03 | `CURRENT` |
| UC-SUB-06 | Chặn spam/honeypot/rate limit | A-03 | `CURRENT/NEXT` |
| UC-SUB-07 | Nhận biên nhận/trạng thái yêu cầu an toàn | A-03 | `TARGET` |

### Analytics

| ID | Use case | Actor | Status |
| --- | --- | --- | --- |
| UC-ANA-01 | Ghi nhận event public | A-01/A-02 | `CURRENT` |
| UC-ANA-02 | Tổng hợp metric theo ngày | A-16 | `TARGET` |
| UC-ANA-03 | Xem dashboard/export aggregate | A-14 | `TARGET` |

### Authentication/account

| ID | Use case | Actor | Status |
| --- | --- | --- | --- |
| UC-AUTH-01 | Đăng ký tài khoản | A-04 | `TARGET` |
| UC-AUTH-02 | Xác minh email | A-04 | `TARGET` |
| UC-AUTH-03 | Đăng nhập | A-04/A-06..15 | `TARGET` |
| UC-AUTH-04 | Refresh session | A-04/A-06..15 | `TARGET` |
| UC-AUTH-05 | Đăng xuất/đăng xuất mọi thiết bị | A-04/A-06..15 | `TARGET` |
| UC-AUTH-06 | Quên/đặt lại mật khẩu | A-04/A-06..15 | `TARGET` |
| UC-AUTH-07 | MFA/step-up admin | A-06..15 | `OPTIONAL/TARGET` |
| UC-ME-01 | Xem/sửa hồ sơ | A-04 | `TARGET` |
| UC-ME-02 | Quản lý địa chỉ | A-04 | `TARGET` |
| UC-ME-03 | Quản lý consent | A-04 | `TARGET` |
| UC-ME-04 | Gửi privacy request | A-04 | `TARGET` |

### Wishlist/cart/commerce

| ID | Use case | Actor | Status |
| --- | --- | --- | --- |
| UC-COM-01 | Thêm/xóa wishlist | A-04 | `TARGET` |
| UC-COM-02 | Tạo/xem cart guest | A-05 | `TARGET` |
| UC-COM-03 | Thêm/cập nhật/xóa cart item | A-04/A-05 | `TARGET` |
| UC-COM-04 | Merge guest cart vào user cart | A-04 | `TARGET` |
| UC-COM-05 | Checkout Inquiry Mode | A-03/A-05 | `CURRENT/NEXT` |
| UC-COM-06 | Tạo order Transactional Mode | A-04/A-05 | `TARGET` |
| UC-COM-07 | Xem order của mình/guest | A-04/A-05 | `TARGET` |
| UC-COM-08 | Yêu cầu hủy order | A-04/A-05 | `TARGET` |

### Payment/fulfillment

| ID | Use case | Actor | Status |
| --- | --- | --- | --- |
| UC-PAY-01 | Khởi tạo thanh toán | A-04/A-05 | `OPTIONAL/TARGET` |
| UC-PAY-02 | Xử lý payment webhook | A-18/A-16 | `OPTIONAL/TARGET` |
| UC-PAY-03 | Xử lý return URL | A-04/A-05 | `OPTIONAL/TARGET` |
| UC-PAY-04 | Refund một phần/toàn phần | A-13 | `OPTIONAL/TARGET` |
| UC-PAY-05 | Đối soát payment | A-16/A-13 | `OPTIONAL/TARGET` |
| UC-FUL-01 | Tạo shipment | A-11 | `OPTIONAL/TARGET` |
| UC-FUL-02 | Cập nhật shipment từ provider | A-19/A-16 | `OPTIONAL/TARGET` |
| UC-FUL-03 | Theo dõi giao hàng | A-04/A-05/A-11 | `OPTIONAL/TARGET` |

### Admin/back-office

| ID | Use case | Actor | Status |
| --- | --- | --- | --- |
| UC-ADM-CAT-01 | Tạo/sửa/publish/archive product | A-08 | `TARGET` |
| UC-ADM-CAT-02 | Quản lý variant/SKU/price | A-08 | `TARGET` |
| UC-ADM-CONT-01 | Tạo/sửa revision nội dung | A-06 | `TARGET` |
| UC-ADM-CONT-02 | Review/publish/unpublish nội dung | A-07 | `TARGET` |
| UC-ADM-QR-01 | Tạo/sửa QR record | A-09 | `TARGET` |
| UC-ADM-QR-02 | Activate/pause/revoke QR | A-09 | `TARGET` |
| UC-ADM-QR-03 | Quản lý QR content/batch override | A-09/A-06/A-07 | `TARGET` |
| UC-ADM-SUB-01 | Xem/filter/assign submission | A-10 | `TARGET` |
| UC-ADM-SUB-02 | Cập nhật trạng thái/note lead | A-10 | `TARGET` |
| UC-ADM-SUB-03 | Export submission | A-10/A-14 | `TARGET` |
| UC-ADM-ORD-01 | Xem/xác nhận/xử lý/hủy order | A-11 | `TARGET` |
| UC-ADM-INV-01 | Nhận/điều chỉnh/xem tồn kho | A-12 | `TARGET` |
| UC-ADM-PAY-01 | Xem payment/refund | A-13 | `OPTIONAL/TARGET` |
| UC-ADM-MED-01 | Upload/quản lý media | A-06/A-08 | `TARGET` |
| UC-ADM-IAM-01 | Quản lý user/role/permission | A-15 | `TARGET` |
| UC-ADM-AUD-01 | Xem audit log | A-15/A-14 | `TARGET` |

### System operations

| ID | Use case | Actor | Status |
| --- | --- | --- | --- |
| UC-SYS-01 | Gửi email qua outbox/job | A-16/A-17 | `TARGET` |
| UC-SYS-02 | Retry/dead-letter job | A-16 | `TARGET` |
| UC-SYS-03 | Expire token/session/cart/reservation | A-16 | `TARGET` |
| UC-SYS-04 | Retention/anonymization | A-16/A-15 | `TARGET` |
| UC-SYS-05 | Backup/restore verification | Hạ tầng/A-15 | `NEXT/TARGET` |

## 4. UC-PUB-01 — Health and readiness

**Actor:** hạ tầng, DevOps, developer.  
**Status:** `CURRENT/NEXT`.

Preconditions:

- Process đã khởi động.

Main flow liveness:

1. Client gọi `GET /api/health` (`CURRENT`) hoặc `GET /api/v1/health/live` (`NEXT`).
2. API trả `200` nếu process sống.
3. Không gọi provider chậm.

Main flow readiness:

1. Client gọi `GET /api/v1/health/ready`.
2. API kiểm tra database và dependency bắt buộc.
3. Trả `200 ready` hoặc `503 not_ready`.

Edge cases:

- Redis optional lỗi -> `degraded` nhưng có thể vẫn ready.
- Database lỗi -> not ready.
- Không trả connection string/secret/host nội bộ.

Acceptance:

- Response dưới ngưỡng hợp lý.
- Dùng cho orchestrator health probe.

## 5. UC-PUB-02/03 — Product list and detail

**Actor:** A-01.  
**Status:** `CURRENT` với `/api/products`; contract `/api/v1` và catalog database là `NEXT`.

Preconditions:

- Product đã được cấu hình public.

Main flow list:

1. Client gọi `GET /api/v1/products` với locale/filter.
2. Backend validate filter/sort.
3. Đọc product active/public.
4. Map response DTO.
5. Trả cache header/ETag phù hợp.

Main flow detail:

1. Client gọi `GET /products/{slug}`.
2. Normalize/validate slug.
3. Lấy product, variant, media, SEO, content public.
4. Trả response.

Alternative/error:

- Slug không tồn tại/draft -> `404 PRODUCT_NOT_FOUND`.
- Product archived -> 404 hoặc 410 theo policy.
- Locale không có -> fallback `vi` hoặc 404 theo cấu hình.
- Cache lỗi -> fallback DB.

Business rules:

- Không expose draft/admin field.
- Price do server trả; `priceLabel` không phải giá giao dịch.
- Product data không phụ thuộc hardcoded frontend sau migration.

Analytics:

- View event do frontend gửi, không bắt buộc trong GET.

## 6. UC-QR-01 — Resolve active QR

**Actor:** A-02.  
**Status:** `CURRENT`.

Preconditions:

- QR record tồn tại.
- Status effective active.
- Destination hợp lệ.
- Content version tồn tại/publish trong target architecture.

Main flow:

1. Người dùng quét mã và mở `/q/{code}` hoặc frontend route.
2. Frontend gọi `GET /api/qr/{code}`.
3. Backend `strip().upper()` code.
4. Tìm registry.
5. Tính effective status theo explicit status, `active_from`, `expires_at`.
6. Kiểm tra destination nội bộ.
7. Tạo `redirectUrl` với `batch`, `source`, `content`, `version`.
8. Trả `success=true`, `status=active`.
9. Frontend track scan fire-and-forget và điều hướng.

Security:

- Không dùng destination từ query client.
- Không redirect URL tuyệt đối ngoài allowlist.

Acceptance:

- Lowercase code resolve đúng.
- Redirect không bị analytics chặn.
- Không có open redirect.

## 7. UC-QR-02 — QR not found

Main flow:

1. Client gửi code không tồn tại.
2. Backend normalize.
3. Không tìm thấy registry.
4. Trả `404 QR_NOT_FOUND`.
5. Frontend hiển thị trang trạng thái thân thiện.

Edge cases:

- Code rỗng/quá dài/format sai -> validation hoặc 404 theo contract.
- Không tự đoán/sửa alias.
- Có thể ghi event invalid đã giảm dữ liệu, không lưu PII.

## 8. UC-QR-03 — QR paused/expired/revoked

Main flow:

1. QR tồn tại.
2. Backend tính status.
3. Trả `200 success=true` với status và message.
4. Không trả active redirect URL.
5. Frontend hiển thị trạng thái/CTA an toàn.

Rules:

- Paused/revoked không bị xóa registry.
- Expired có thể suy ra theo UTC.
- Không tự fallback sang content khác nếu chưa được cấu hình.

## 9. UC-QR-04 — Track QR scan

Main flow:

1. Frontend gọi `POST /qr/{code}/scan` bằng fire-and-forget/keepalive.
2. Backend rate limit.
3. Resolve QR/status.
4. Sanitize/allowlist metadata.
5. Ghi event bền vững hoặc queue.
6. Trả `accepted` nhanh.

Alternative/error:

- Analytics store tạm lỗi -> retry/queue; không ảnh hưởng redirect đã thực hiện.
- Rate limit -> 429 nhưng frontend không block.
- QR invalid -> behavior event/error theo contract.

Privacy:

- Không nhận tên/email/phone.
- Referrer nên bỏ query nhạy cảm.
- IP thô không lưu dài hạn.

## 10. UC-QR-05/06 — Experience content and batch override

Main flow:

1. Client gọi `/qr/experience/{productSlug}?version=v1&batch=...&locale=vi`.
2. Backend lấy published content theo `(product, version, locale)`.
3. Nếu có batch, tìm override đúng product/version.
4. Chỉ merge field được phép, ví dụ `guidance`, `notice`.
5. Trả content + `batchNotice`.

Alternative/error:

- Content không tồn tại -> `QR_CONTENT_NOT_FOUND`.
- Version draft -> public không trả.
- Batch override không có -> content gốc.
- Override sai product/version -> không áp dụng.

Acceptance:

- Nội dung không bị trộn locale/version.
- Hướng dẫn theo lô đúng.
- Published revision immutable.

## 11. UC-SUB-01..05 — Create submissions

**Actor:** A-03.  
**Status:** `CURRENT`, persistence PostgreSQL qua Psycopg 3. Alembic migration và admin workflow là `NEXT`.

Common flow:

1. User điền form.
2. Frontend gửi `{kind, payload}`.
3. Backend kiểm tra payload size/rate limit.
4. Kiểm tra honeypot.
5. Validate schema theo kind.
6. Sanitize/normalize field.
7. Ghi submission bền vững với status `new`.
8. Ghi activity/audit nội bộ khi target.
9. Enqueue notification/receipt nếu bật.
10. Trả public reference.

Kind-specific:

### Contact

Required:

- name.
- email.
- topic.
- message.

### Partners

Required:

- name.
- email.
- organization.
- message.

### Sample-interest

Required:

- name.
- email.
- role.
- primaryProduct.
- sampleFormat.
- useCase.
- validationTopics.
- evidenceConsent.

### Feedback

Required:

- skuOrLot.
- source.
- contentViewed.
- sensoryFeedback.
- acceptablePriceRange.
- purchaseIntentPurpose.
- optInConsent.
- productSlug.

### Pre-order/reorder

Baseline:

- name.
- email.
- phone/items/notes theo flow đã chốt.

Critical rule:

- Ở Inquiry Mode, không tạo order/payment/inventory reservation.
- Success chỉ có nghĩa đã nhận yêu cầu.

Errors:

- Honeypot -> `SPAM_DETECTED`.
- Missing/invalid field -> `VALIDATION_ERROR`.
- Rate limit -> `RATE_LIMITED`.
- DB unavailable -> không trả success giả.

Privacy:

- Không log raw payload.
- Marketing consent không suy ra từ việc gửi form.

## 12. UC-SUB-06 — Anti-abuse

Flow:

1. Tính rate-limit key theo scope + IP/user.
2. Kiểm tra honeypot.
3. Kiểm tra size/length/schema.
4. Có thể tính spam score/challenge khi abuse tăng.
5. Từ chối hoặc đưa spam review theo policy.

Edge cases:

- Nhiều user cùng NAT: tránh limit quá thấp.
- Attacker đổi IP: kết hợp signal khác.
- Không dùng CAPTCHA mặc định nếu chưa cần.

## 13. UC-ANA-01 — Public analytics event

Flow:

1. Frontend gửi event allowlist.
2. Backend validate event/property.
3. Loại/từ chối PII field.
4. Rate limit.
5. Ghi queue/store.
6. Trả `202`/success nhanh.

Alternative:

- Store lỗi -> retry/degraded.
- Event invalid -> validation error.

Rule:

- Không dùng analytics làm nguồn sự thật cho order/payment.

## 14. UC-AUTH-01 — Register

Preconditions:

- Account feature enabled.

Main flow:

1. User gửi email/password/display name/terms version.
2. Backend rate limit và validate.
3. Normalize email.
4. Kiểm tra uniqueness.
5. Hash password.
6. Tạo user pending + consent/terms record.
7. Tạo verification token hash.
8. Commit DB + outbox.
9. Worker gửi email.
10. Trả response không cấp role admin.

Alternative:

- Duplicate email -> error/generic behavior theo policy.
- Password weak -> `PASSWORD_POLICY_VIOLATION`.
- Email provider lỗi -> user vẫn tồn tại, job retry.

Security:

- Không log password/token.
- Client không chọn role/status.

## 15. UC-AUTH-02 — Verify email

Main flow:

1. User mở link token.
2. Backend hash token và tìm record hợp lệ.
3. Transaction mark token used + verify user.
4. Revoke token cùng purpose nếu cần.
5. Trả success.

Alternative:

- Invalid/expired/used -> error an toàn.
- Double click/concurrent request -> một request thành công, request sau idempotent/error rõ.

## 16. UC-AUTH-03 — Login

Main flow:

1. User gửi credential.
2. Backend rate limit theo IP + account key.
3. Verify password timing-safe.
4. Kiểm tra account status/MFA.
5. Tạo session/access+refresh.
6. Set cookie/header an toàn.
7. Ghi security/audit event.
8. Trả user summary.

Alternative:

- Sai email/password -> `INVALID_CREDENTIALS` chung.
- Locked/disabled/unverified -> error theo policy.
- MFA required -> challenge flow.

## 17. UC-AUTH-04/05 — Refresh and logout

Refresh:

1. Nhận refresh/session credential.
2. Verify hash/status/expiry.
3. Rotate token nếu dùng refresh model.
4. Revoke token cũ.
5. Trả access mới.

Reuse:

- Token cũ sau rotation -> revoke session family + security event.

Logout:

1. Revoke session server-side.
2. Clear cookie/client credential.
3. `logout-all` revoke mọi session theo policy.

## 18. UC-AUTH-06 — Password reset

Request:

1. User nhập email.
2. Backend rate limit.
3. Trả generic accepted dù email có/không tồn tại.
4. Nếu có user active, tạo token hash + outbox email.

Confirm:

1. Verify token single-use/expiry.
2. Validate/hash password mới.
3. Transaction update password + mark token used + revoke session.
4. Gửi security notification.

## 19. UC-ME-01/02 — Profile and address

Profile:

- Chỉ current user.
- Field allowlist.
- Không sửa role/status/verified fields.

Address:

1. List/create/update/delete soft.
2. Validate required location/contact fields.
3. Set default atomically.
4. Order dùng address snapshot; sửa address không đổi order cũ.

Errors:

- Address ngoài ownership -> 404/403.
- Concurrent default update -> database constraint + retry.

## 20. UC-ME-03/04 — Consent and privacy request

Consent:

- Grant/withdraw theo purpose.
- Lưu policy version/source/time.
- Withdrawal chặn processing tương lai theo purpose.

Privacy request:

1. User chọn access/export/correction/deletion.
2. Backend tạo request.
3. Xác minh danh tính nếu cần.
4. Operator review.
5. Fulfill/reject có lý do.
6. Audit.

Deletion:

- Không hard-delete order/payment/audit bắt buộc.
- Anonymize khi phù hợp.

## 21. UC-COM-01 — Wishlist

Main flow:

1. Authenticated user thêm variant.
2. Backend kiểm tra variant public/valid.
3. Upsert item idempotently.
4. Trả wishlist.

Remove:

- Xóa item thuộc user.
- Item không có có thể trả idempotent success.

## 22. UC-COM-02/03 — Guest/user cart

Main flow add item:

1. Resolve cart từ session user hoặc guest token.
2. Validate variant/status/quantity.
3. Lấy giá hiện tại từ server.
4. Add/merge item theo rule.
5. Tăng cart version.
6. Tính total server-side.
7. Trả cart.

Alternative:

- Variant unavailable.
- Quantity out of range.
- Cart version conflict.
- Guest token invalid/expired.
- Giá đổi -> response giá mới.

Security:

- Guest token opaque, scoped, không log.

## 23. UC-COM-04 — Merge guest cart

Preconditions:

- User vừa login.
- Guest cart token hợp lệ.

Flow:

1. Load guest cart và user cart.
2. Merge item theo SKU/variant.
3. Áp quantity max.
4. Revalidate product/price.
5. Mark guest cart converted.
6. Commit transaction.
7. Trả user cart.

Alternative:

- Item unavailable -> loại/đánh dấu và thông báo.
- Conflict -> deterministic rule, không nhân đôi ngoài ý muốn.

## 24. UC-COM-05 — Checkout Inquiry Mode

Status: `CURRENT/NEXT`.

Flow:

1. User chọn sản phẩm/ghi chú.
2. Frontend gửi `pre-order` submission.
3. Backend validate/persist.
4. Lead operator liên hệ xác nhận ngoài hệ thống hoặc qua workflow.
5. Không tạo payment/shipment/reservation.

Acceptance:

- UI/message không mô tả là đã thanh toán/đặt hàng chắc chắn nếu chưa xác nhận.

## 25. UC-COM-06 — Create transactional order

Preconditions:

- Transactional mode enabled.
- Cart không rỗng.
- Product/variant/price/inventory hợp lệ.
- Idempotency key.

Main flow:

1. Resolve actor/cart.
2. Validate shipping/contact.
3. Re-read variants/prices server-side.
4. Tính subtotal/discount/shipping/tax/total.
5. Atomic reserve inventory.
6. Tạo order + item/address snapshot + status history.
7. Tạo outbox.
8. Commit.
9. Nếu online payment, tạo payment ngoài transaction qua orchestration.
10. Trả order/payment next action.

Alternative:

- Empty cart -> `CART_EMPTY`.
- Price changed -> `PRICE_CHANGED` + updated cart.
- Insufficient stock -> rollback + `INSUFFICIENT_STOCK`.
- Retry cùng idempotency key/payload -> replay response.
- Cùng key/payload khác -> `IDEMPOTENCY_CONFLICT`.
- Provider timeout -> order pending, retry an toàn; không tạo order mới.

Invariants:

- Total đúng.
- Reservation không vượt available.
- Order snapshot không đổi theo catalog sau này.

## 26. UC-COM-07 — View order

Authenticated:

1. User gọi `/me/orders/{id}`.
2. Backend kiểm tra ownership.
3. Trả order/payment/fulfillment summary an toàn.

Guest:

1. User dùng order number + opaque guest token hoặc OTP/email verification.
2. Backend verify token scope/expiry.
3. Trả order.

Security:

- Không đọc order chỉ bằng ID/order number.
- Resource ngoài scope -> 404/403 theo policy.

## 27. UC-COM-08 — Cancel order

Flow:

1. User gửi reason.
2. Backend load order/ownership.
3. Kiểm tra state.
4. Nếu chưa paid/fulfilled: cancel + release reservation.
5. Nếu paid: tạo cancellation/refund workflow.
6. Nếu shipped: từ chối hoặc tạo return request.
7. Ghi history/audit/outbox.

Alternative:

- Duplicate request -> idempotent.
- Invalid state -> `ORDER_STATE_CONFLICT`.

## 28. UC-PAY-01 — Create payment

Preconditions:

- Order eligible.
- Amount/currency từ server.
- Idempotency key.

Flow:

1. Tạo payment local `created/pending`.
2. Commit local state/outbox hoặc gọi provider theo orchestration an toàn.
3. Provider trả payment reference/redirect.
4. Lưu metadata đã lọc.
5. Trả redirect URL.

Alternative:

- Provider timeout -> query/retry với idempotency, không double charge.
- Order cancelled/paid -> conflict/idempotent result.

## 29. UC-PAY-02 — Payment webhook

Actor: A-18.

Flow:

1. Provider POST raw body + signature.
2. Backend verify signature/timestamp.
3. Deduplicate provider event ID.
4. Persist event nhanh.
5. Worker xử lý idempotently.
6. Lock/load payment/order.
7. Validate amount/currency/reference.
8. Transition payment/order.
9. Consume reservation/create fulfillment outbox.
10. Mark event processed.

Alternative:

- Signature invalid -> reject, metric/alert.
- Duplicate -> return success without reapplying effect.
- Out-of-order -> state machine/idempotent handling.
- Amount mismatch -> manual review, không mark paid.

## 30. UC-PAY-03 — Return URL

Flow:

1. Browser quay lại từ provider.
2. Frontend/backend hiển thị trạng thái tạm.
3. Backend đọc payment state local hoặc verify provider server-side.
4. Nếu webhook chưa đến, hiển thị pending và poll có giới hạn.

Rule:

- Query return URL không đủ để mark paid.

## 31. UC-PAY-04 — Refund

Actor: A-13.

Preconditions:

- Permission `payments.refund`.
- MFA/step-up nếu policy.
- Payment captured.
- Amount còn refundable.
- Idempotency key.

Flow:

1. Finance nhập amount/reason.
2. Backend validate order/payment/refund history.
3. Tạo refund pending.
4. Gọi provider idempotently.
5. Cập nhật refund/payment/order state.
6. Ghi audit/outbox notification.

Alternative:

- Amount vượt -> validation.
- Provider timeout -> reconcile/query, không gửi request mới mù quáng.
- Duplicate -> replay result.

## 32. UC-FUL-01/02/03 — Fulfillment

Create shipment:

1. Operator chọn order eligible.
2. Validate address/items/status.
3. Tạo shipment local/provider.
4. Lưu tracking.
5. Chuyển order/fulfillment state.
6. Notify user.

Provider update:

1. Verify webhook/auth.
2. Deduplicate event.
3. Map provider status.
4. Update shipment idempotently.
5. Update order summary nếu phù hợp.

Track:

- Customer chỉ thấy shipment của order mình.
- Guest cần token.

## 33. UC-ADM-CAT-01/02 — Catalog administration

Actor: A-08.

Create/edit:

1. Auth + `catalog.write`.
2. Validate slug/content/media.
3. Create/update draft with version control.
4. Audit.

Publish:

1. Auth + `catalog.publish`.
2. Validate required fields/default variant/media/SEO.
3. Set active/published.
4. Invalidate cache.
5. Audit.

Archive:

- Không xóa order history.
- Variant/SKU đã dùng chỉ archive.

Price:

- `pricing.write` nếu tách quyền.
- Amount server validated, audit before/after.

## 34. UC-ADM-CONT-01/02 — Content workflow

Editor flow:

1. Tạo item/revision draft.
2. Sửa block content/source note/SEO.
3. Submit review.

Approver flow:

1. Mở revision in-review.
2. Duyệt hoặc trả về draft có note.
3. Publish.
4. Backend đánh dấu revision published và current.
5. Invalidate cache.
6. Audit actor/time.

Rules:

- Revision published immutable.
- Editor thiếu `content.publish` không tự publish.
- Unpublish có permission/audit.

## 35. UC-ADM-QR-01/02/03 — QR administration

Create QR:

1. Auth + `qr.write`.
2. Nhập code/product/batch/version/destination/status draft/paused.
3. Normalize code.
4. Validate unique/destination.
5. Save + audit.

Activate:

1. Auth + `qr.activate`.
2. Validate product, destination, content version/locale published, date window.
3. Set active.
4. Invalidate cache.
5. Audit.

Pause/revoke:

- State action riêng.
- Reason/note nếu cần.
- Revoke không xóa record.

Batch override:

- Chỉ field allowlist.
- Phù hợp product/version.
- Có review/publish nếu hướng dẫn ảnh hưởng sử dụng/an toàn.

## 36. UC-ADM-SUB-01/02 — Lead operations

List/detail:

1. Auth + `submissions.read`.
2. Filter kind/status/source/product/date/assigned.
3. Backend pagination/sort allowlist.
4. Trả PII tối thiểu cần thiết.

Assign/status/note:

1. Auth + permission.
2. Kiểm tra transition.
3. Ghi lead activity.
4. Update assignment/status.
5. Audit action quan trọng.

Rules:

- Không sửa raw submission để che lịch sử; note/activity riêng.
- Spam/archive/reject có reason nếu cần.

## 37. UC-ADM-SUB-03 — Export submissions

Preconditions:

- `submissions.export`.
- Step-up nếu policy/volume lớn.

Flow:

1. Admin chọn filter/field.
2. Backend validate scope và limit.
3. Tạo export job + audit request.
4. Worker tạo file private.
5. Trả signed URL có hạn hoặc notification.
6. Audit download nếu có thể.
7. Cleanup file theo retention.

Security:

- Không public URL.
- Không email attachment PII tùy tiện.
- Không export field ngoài permission.

## 38. UC-ADM-ORD-01 — Order operations

Flow:

1. Operator list/filter order.
2. Xem detail/history/payment/fulfillment summary.
3. Thực hiện action hợp lệ: confirm, processing, cancel, shipment.
4. Service kiểm tra state/permission.
5. Transaction update + history + audit + outbox.

Alternative:

- State đã đổi bởi webhook/operator khác -> conflict/refresh.
- Manual override cần permission/reason/audit riêng.

## 39. UC-ADM-INV-01 — Inventory operations

Receive:

1. Operator chọn variant/location/batch/quantity.
2. Validate quantity/batch.
3. Atomic update stock + append movement.
4. Audit.

Adjust:

1. Nhập signed delta + reason + note.
2. Permission `inventory.adjust`.
3. Không cho available âm nếu backorder tắt.
4. Update + movement + audit.

View:

- Stock, reserved, available, movement.

Rule:

- Không generic PATCH trực tiếp `on_hand` không movement.

## 40. UC-ADM-MED-01 — Media upload

Flow:

1. Admin auth + media permission.
2. Gửi filename/MIME/size/checksum.
3. Backend validate/quota/type.
4. Tạo media pending + presigned URL.
5. Client upload storage.
6. Complete/storage event.
7. Worker verify/scan/thumbnail.
8. Set ready.
9. Admin gắn vào product/content.

Alternative:

- Size/type sai -> reject.
- Upload không hoàn tất -> expire/cleanup.
- Scan fail -> quarantine.
- Media đang referenced -> không hard delete.

## 41. UC-ADM-IAM-01 — User/role/permission

Flow:

1. Admin auth + `roles.manage`/`users.manage`.
2. Xem user/role.
3. Grant/revoke role.
4. Validate actor delegated scope và system invariants.
5. Commit assignment.
6. Invalidate permission cache/session version.
7. Audit.

Invariants:

- Không để hệ thống mất administrator cuối cùng.
- Không tự cấp quyền vượt phạm vi nếu delegated admin.
- Không sửa role qua profile endpoint.

## 42. UC-ADM-AUD-01 — View audit logs

Flow:

1. Auth + `audit.read`.
2. Filter actor/action/target/date.
3. Backend cursor pagination.
4. Trả summary đã redaction.

Rules:

- Không mutation/delete qua API thông thường.
- Xem/export audit cũng được ghi nhận khi cần.

## 43. UC-SYS-01 — Email via outbox

Flow:

1. Business transaction ghi outbox event.
2. Worker claim pending event.
3. Render template version/locale với escape.
4. Gọi email provider timeout/retry.
5. Ghi delivery result.
6. Mark outbox complete.

Alternative:

- Provider 429/5xx -> retry backoff+jitter.
- Permanent validation error -> dead-letter/manual review.
- Duplicate job -> provider/idempotency/local check ngăn gửi lặp ngoài policy.

Privacy:

- Không log full body/token/recipient.

## 44. UC-SYS-02 — Retry and dead-letter

Flow:

1. Worker nhận job.
2. Nếu lỗi retryable, tăng attempt và đặt `available_at`.
3. Sau max attempt, chuyển failed/dead-letter.
4. Alert nếu critical.
5. Operator có thể retry thủ công với audit.

Rule:

- Job phải idempotent.
- Không retry validation/business error vô hạn.

## 45. UC-SYS-03 — Expiry jobs

Các job:

- Verification/reset token.
- Session.
- Guest token.
- Cart.
- Inventory reservation.
- Export signed file metadata.

Flow:

1. Scheduler chọn record hết hạn theo batch.
2. Atomic transition/delete theo policy.
3. Release resource liên quan, ví dụ reservation.
4. Ghi metric/audit nếu cần.
5. Job resumable/idempotent.

Concurrency:

- Payment success và reservation expiry cạnh tranh phải dùng lock/state check.

## 46. UC-SYS-04 — Retention/anonymization

Flow:

1. Chọn record đủ điều kiện theo policy version.
2. Loại record đang legal/operational hold.
3. Anonymize/delete theo domain.
4. Ghi summary/audit, không ghi PII đã xóa.
5. Xử lý object storage/export liên quan.
6. Report count/error.

Rules:

- Không hard-delete order/payment/audit một cách mù quáng.
- Backup lifecycle được tài liệu hóa.

## 47. UC-SYS-05 — Backup/restore verification

Backup:

- Managed schedule.
- Encryption/access/retention.
- Monitor success.

Restore test:

1. Tạo môi trường cô lập.
2. Restore backup.
3. Chạy migration tương thích.
4. Verify table count/invariant.
5. Smoke API.
6. Ghi RTO thực tế và vấn đề.

## 48. Ma trận lỗi và trường hợp biên xuyên use case

| Nhóm | Trường hợp | Expected |
| --- | --- | --- |
| Validation | thiếu field, sai type, quá dài | 422 code ổn định |
| Authentication | thiếu/sai/hết hạn credential | 401 |
| Authorization | thiếu quyền | 403 |
| Ownership | resource người khác | 404/403 theo policy |
| Not found | ID/slug/code không tồn tại | 404 |
| Duplicate | slug/SKU/code/email trùng | 409 |
| State | action không hợp lệ ở trạng thái hiện tại | 409/422 |
| Concurrency | version/stock/state đổi đồng thời | conflict/retry an toàn |
| Rate limit | vượt limit | 429 + Retry-After |
| Idempotency | retry cùng key/payload | replay result |
| Idempotency conflict | cùng key, payload khác | 409 |
| Dependency | DB/provider/cache lỗi | 5xx/degraded, không success giả |
| Timeout | provider timeout | retry/query/reconcile, không double side effect |
| Duplicate webhook | cùng event ID | no-op success |
| Out-of-order webhook | event cũ đến sau | state machine không rollback sai |
| Payload abuse | quá lớn/deep/unsupported | 413/415/422 |
| Security | injection/open redirect/path traversal | reject/sanitize/allowlist |
| Privacy | PII vào analytics/log/export trái quyền | reject/redact/deny |

## 49. Traceability mẫu

| Use case | API | Data | Permission | Audit/Metric | Test |
| --- | --- | --- | --- | --- | --- |
| UC-QR-01 | `GET /qr/{code}` | `qr_records` | public | `qr_resolve_total` | active/not found/inactive/open redirect |
| UC-SUB-04 | `POST /submissions` | `submissions` | public + rate limit | submission metric | validation/spam/persistence |
| UC-ADM-CONT-02 | publish revision | content/revision/audit | `content.publish` | audit + cache invalidation | editor denied/publish/version |
| UC-COM-06 | `POST /orders` | order/item/reservation/outbox | customer/guest token | order metric | idempotency/stock/concurrency |
| UC-PAY-02 | payment webhook | payment/event/order/outbox | provider signature | webhook metric | signature/replay/amount/out-of-order |
| UC-ADM-SUB-03 | export | export job/media/audit | `submissions.export` | audit | permission/private URL/retention |

## 50. Acceptance standard cho mọi use case

Mỗi use case khi chuyển sang `CURRENT` phải có:

- Actor và permission đã triển khai.
- Preconditions/postconditions.
- Main/alternative/error flow.
- API contract/OpenAPI.
- Business rule.
- Database constraint/transaction khi phù hợp.
- Security/privacy control.
- Audit/analytics/metric.
- Automated test.
- Rollout/migration note.
- Known limitation được ghi rõ.
