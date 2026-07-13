# 04. API Contracts

## 1. Trạng thái tài liệu

Tài liệu định nghĩa contract mục tiêu cho backend Senova và phân biệt:

- `CURRENT`: đã có trong `app/main.py`.
- `NEXT`: ưu tiên triển khai để thay seed/in-memory/mock.
- `TARGET`: API đầy đủ khi có account, admin và commerce.
- `OPTIONAL`: chỉ bật khi có provider hoặc nhu cầu tương ứng.

Contract trong tài liệu là nguồn tham chiếu cho frontend, backend và QA; database có thể thay đổi mà không làm thay đổi contract nếu không có version mới.

## 2. Base URL và versioning

### 2.1. Hiện tại

```text
/api
```

### 2.2. Mục tiêu production

```text
/api/v1
```

Trong giai đoạn chuyển tiếp:

- Giữ route `/api/*` tương thích; hoặc
- Cập nhật frontend và backend cùng release để dùng `/api/v1`.

Không tạo version theo từng endpoint. Version tăng khi có thay đổi phá vỡ contract.

## 3. Content type và encoding

- Request/response JSON: `application/json; charset=utf-8`.
- Upload file: dùng presigned upload hoặc `multipart/form-data` cho file nhỏ.
- CSV export: `text/csv; charset=utf-8` hoặc job bất đồng bộ.
- Mọi text dùng UTF-8.

## 4. Response envelope

### 4.1. Thành công

```json
{
  "success": true,
  "data": {
    "id": "example"
  }
}
```

### 4.2. Thành công có metadata

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 125,
    "totalPages": 7,
    "requestId": "req_01J..."
  }
}
```

### 4.3. Lỗi

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu chưa hợp lệ.",
    "details": [
      {
        "field": "email",
        "reason": "invalid_format"
      }
    ]
  },
  "meta": {
    "requestId": "req_01J..."
  }
}
```

Quy tắc:

- `code` ổn định để frontend xử lý.
- `message` có thể localized, không dùng để branch logic.
- `details` không chứa stack trace, SQL hoặc secret.
- Production không trả internal exception.

## 5. HTTP status mapping

| HTTP | Trường hợp |
| --- | --- |
| `200` | GET/PUT/PATCH thành công; resource tồn tại nhưng có trạng thái nghiệp vụ inactive khi contract yêu cầu |
| `201` | Tạo resource thành công |
| `202` | Đã nhận job/event bất đồng bộ |
| `204` | Thành công không cần body |
| `400` | Request sai cú pháp/nghiệp vụ chung, spam, invalid state không thuộc conflict |
| `401` | Chưa xác thực hoặc token không hợp lệ |
| `403` | Đã xác thực nhưng thiếu quyền |
| `404` | Resource không tồn tại hoặc không được phép lộ sự tồn tại |
| `409` | Trùng dữ liệu, version conflict, state conflict, idempotency conflict |
| `410` | Resource public đã bị gỡ vĩnh viễn khi cần phân biệt |
| `413` | Payload/file quá lớn |
| `415` | Content type không hỗ trợ |
| `422` | Validation field/schema |
| `429` | Rate limited |
| `500` | Lỗi nội bộ không dự kiến |
| `502/503/504` | Provider/upstream hoặc hệ thống tạm không sẵn sàng |

## 6. Header chuẩn

### Request

| Header | Mục đích | Bắt buộc |
| --- | --- | --- |
| `Authorization: Bearer <token>` | Xác thực account/admin | Với protected API |
| `X-Request-ID` | Correlation từ client; server sinh nếu thiếu | Không |
| `Idempotency-Key` | Chống tạo lặp order/payment/export | Theo endpoint |
| `If-Match` | Optimistic concurrency bằng ETag/version | Khi cập nhật resource nhạy cảm |
| `Accept-Language` | `vi`, `en` | Không |

### Response

| Header | Mục đích |
| --- | --- |
| `X-Request-ID` | Tra cứu log/trace |
| `ETag` | Version của resource nếu hỗ trợ |
| `Retry-After` | Rate limit hoặc temporary unavailable |
| `Cache-Control` | Chính sách cache public/private |

## 7. Pagination, filter và sort

### 7.1. Page-based

Dùng cho admin table và danh sách nhỏ:

```http
GET /api/v1/admin/submissions?page=1&pageSize=20&sort=-createdAt
```

Giới hạn:

- `page >= 1`.
- `1 <= pageSize <= 100`.
- Sort chỉ nhận allowlist.

### 7.2. Cursor-based

Dùng cho event/log hoặc danh sách lớn:

```http
GET /api/v1/admin/audit-logs?limit=50&cursor=eyJ...
```

Cursor là opaque; client không tự phân tích.

### 7.3. Filter

- Dùng query param rõ nghĩa.
- Không cho client truyền tên cột SQL tùy ý.
- Search text có độ dài tối thiểu/tối đa.
- Date range dùng ISO 8601 và có giới hạn cửa sổ nếu endpoint nặng.

## 8. Error code catalog nền tảng

| Code | HTTP | Ý nghĩa |
| --- | --- | --- |
| `VALIDATION_ERROR` | 422 | Một hoặc nhiều field không hợp lệ |
| `AUTHENTICATION_REQUIRED` | 401 | Chưa đăng nhập |
| `TOKEN_INVALID` | 401 | Token sai/hết hạn |
| `PERMISSION_DENIED` | 403 | Thiếu quyền |
| `RESOURCE_NOT_FOUND` | 404 | Không tìm thấy resource |
| `RESOURCE_CONFLICT` | 409 | Xung đột trạng thái/version |
| `DUPLICATE_RESOURCE` | 409 | Vi phạm unique rule |
| `RATE_LIMITED` | 429 | Vượt giới hạn |
| `IDEMPOTENCY_CONFLICT` | 409 | Cùng key nhưng payload khác |
| `PAYLOAD_TOO_LARGE` | 413 | Payload/file vượt mức |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Loại dữ liệu không hỗ trợ |
| `DEPENDENCY_UNAVAILABLE` | 503 | Provider/DB/cache tạm lỗi |
| `INTERNAL_ERROR` | 500 | Lỗi nội bộ đã che chi tiết |

Feature-specific code nằm ở từng phần dưới.

## 9. Health and readiness

### 9.1. Liveness — `CURRENT`

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

### 9.2. Readiness — `NEXT`

```http
GET /api/v1/health/ready
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "status": "ready",
    "checks": {
      "database": "ok",
      "redis": "degraded"
    }
  }
}
```

Quy tắc:

- Không trả credential/hostname nội bộ.
- Redis optional có thể `degraded` nhưng app vẫn ready nếu feature không phụ thuộc.

## 10. Public catalog API

### 10.1. List products — `NEXT`

```http
GET /api/v1/products?collection=featured&status=available&locale=vi
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "9d4e...",
      "slug": "petal-pack",
      "name": "Senova Petal Pack",
      "line": "Petal Pack",
      "tagline": "Mở một cánh sen, pha một câu chuyện Việt",
      "shortDescription": "Phần trà một ly trong hình thức búp sen.",
      "role": "Mở",
      "status": "active",
      "availability": "coming-soon",
      "price": null,
      "priceLabel": "Đang hoàn thiện",
      "primaryImage": {
        "url": "https://cdn.example/...",
        "alt": "Senova Petal Pack"
      },
      "href": "/products/petal-pack"
    }
  ]
}
```

Business rules:

- Chỉ trả product public đủ điều kiện.
- `price` là dữ liệu server; `priceLabel` chỉ để hiển thị.
- Gift Set draft có thể hiển thị nếu business định nghĩa `visibility=preview/coming-soon`, không nên lạm dụng `draft` như public state.

### 10.2. Product detail — `NEXT`

```http
GET /api/v1/products/{slug}?locale=vi
```

Lỗi:

- `404 PRODUCT_NOT_FOUND`.
- `410 PRODUCT_UNAVAILABLE` nếu cần phân biệt đã gỡ.

Response rút gọn:

```json
{
  "success": true,
  "data": {
    "id": "9d4e...",
    "slug": "petal-pack",
    "name": "Senova Petal Pack",
    "tagline": "Mở một cánh sen, pha một câu chuyện Việt",
    "description": "...",
    "highlights": [],
    "experienceSteps": [],
    "brewingNotes": [],
    "variants": [],
    "includedItems": [],
    "giftOptions": [],
    "badges": [],
    "primaryAction": {},
    "secondaryAction": {},
    "seo": {}
  }
}
```

### 10.3. Collections — `TARGET`

```http
GET /api/v1/collections
GET /api/v1/collections/{slug}
```

### 10.4. Search — `TARGET`

```http
GET /api/v1/search?q=sen&types=product,journal&limit=20
```

Quy tắc:

- `q` 2–100 ký tự.
- Kết quả chỉ gồm content public.
- Không expose admin draft.

## 11. Public content API

### 11.1. Get page by type/slug — `TARGET`

```http
GET /api/v1/content/pages/{slug}?locale=vi
GET /api/v1/content/policies/{slug}?locale=vi
GET /api/v1/content/services/{slug}?locale=vi
```

### 11.2. Journal — `TARGET`

```http
GET /api/v1/journal?page=1&pageSize=12&tag=van-hoa-sen
GET /api/v1/journal/{slug}?locale=vi
```

Public response chỉ trả published revision.

## 12. QR API

### 12.1. Resolve QR — `CURRENT`

```http
GET /api/qr/{code}
```

Mục tiêu versioned:

```http
GET /api/v1/qr/{code}
```

Response active:

```json
{
  "success": true,
  "data": {
    "code": "PP-2601-A",
    "productSlug": "petal-pack",
    "batchCode": "PP-2601-A",
    "contentVersion": "v1",
    "contentViewed": "petal-pack-scan",
    "destination": "/experience/petal-pack",
    "status": "active",
    "redirectUrl": "/experience/petal-pack?batch=PP-2601-A&source=qr&content=petal-pack-scan&version=v1"
  }
}
```

QR tồn tại nhưng inactive:

```json
{
  "success": true,
  "data": {
    "code": "PP-2509-X",
    "productSlug": "petal-pack",
    "status": "paused",
    "message": "QR code is paused."
  }
}
```

Lỗi:

- `404 QR_NOT_FOUND`.
- `500 QR_DESTINATION_INVALID` nếu registry sai; đây là lỗi cấu hình cần alert.

Security:

- Query `destination` từ client bị bỏ qua.
- Redirect chỉ xây từ registry nội bộ.

### 12.2. Track QR scan — `CURRENT`

```http
POST /api/v1/qr/{code}/scan
```

Request:

```json
{
  "source": "qr",
  "path": "/q/PP-2601-A",
  "referrer": "https://senova.example/products/petal-pack",
  "campaign": "pilot-2026"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accepted": true
  }
}
```

Quy tắc:

- Rate limit.
- Không nhận PII.
- Có thể trả `202` ở kiến trúc queue.
- Không làm chậm redirect.

### 12.3. Get experience content — `CURRENT`

```http
GET /api/v1/qr/experience/{productSlug}?version=v1&batch=PP-2601-A&locale=vi
```

Lỗi:

- `404 QR_CONTENT_NOT_FOUND`.
- `409 QR_CONTENT_NOT_PUBLISHED` chỉ dùng cho preview/admin; public nên 404 để không lộ draft.

### 12.4. Server-side public redirect — `OPTIONAL`

```http
GET /q/{code}
```

Hành vi:

- Resolve registry.
- Track fire-and-forget.
- `302/307` đến path nội bộ hoặc frontend absolute origin allowlist.
- Inactive -> landing status page, không open redirect.

## 13. Submission API

### 13.1. Create submission — `CURRENT`

```http
POST /api/v1/submissions
```

Request:

```json
{
  "kind": "contact",
  "payload": {
    "name": "Nguyễn Văn A",
    "email": "a@example.com",
    "topic": "Hợp tác",
    "message": "Tôi muốn trao đổi...",
    "website": ""
  }
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "contact-20260713-a1b2c3d4"
  }
}
```

Production nên trả `publicReference`, không expose DB UUID nếu không cần:

```json
{
  "success": true,
  "data": {
    "reference": "CNT-20260713-X7K9P2"
  }
}
```

Validation theo kind:

| Kind | Required fields tối thiểu |
| --- | --- |
| `feedback` | `skuOrLot`, `source`, `contentViewed`, `sensoryFeedback`, `acceptablePriceRange`, `purchaseIntentPurpose`, `optInConsent`, `productSlug` |
| `sample-interest` | `name`, `email`, `role`, `primaryProduct`, `sampleFormat`, `useCase`, `validationTopics`, `evidenceConsent` |
| `contact` | `name`, `email`, `topic`, `message` |
| `partners` | `name`, `email`, `organization`, `message` |
| `pre-order` | `name`, `email`; thêm phone/item theo flow đã chốt |

Lỗi:

- `400 SPAM_DETECTED`.
- `422 VALIDATION_ERROR`.
- `429 RATE_LIMITED`.

Quy tắc:

- Không log raw payload.
- `pre-order` ở Inquiry Mode không tạo order/payment.
- Không có public `GET /submissions/{id}` trong production nếu chỉ dựa vào ID.

### 13.2. Submission receipt — `TARGET`

Nếu cần cho người dùng theo dõi yêu cầu:

```http
GET /api/v1/submission-receipts/{reference}?token=<opaque-token>
```

Token phải đủ entropy, có scope và thời hạn. Không dùng ID đoán được.

## 14. Analytics API

### 14.1. Create event — `CURRENT`

```http
POST /api/v1/analytics/events
```

Request:

```json
{
  "eventName": "feedback_submit",
  "productSlug": "petal-pack",
  "batchCode": "PP-2601-A",
  "contentVersion": "v1",
  "source": "qr",
  "contentViewed": "petal-pack-scan",
  "path": "/experience/petal-pack",
  "timestamp": "2026-07-13T14:00:00Z"
}
```

Response:

- `202 Accepted` ưu tiên khi queue.
- Hoặc envelope chứa event ID.

Event allowlist MVP:

- `qr_scan`
- `qr_invalid`
- `qr_inactive`
- `qr_redirect_success`
- `experience_start`
- `story_section_view`
- `brew_guidance_view`
- `feedback_start`
- `feedback_submit`
- `reorder_click`
- `share_click`

Lỗi analytics không được block luồng chính của frontend.

## 15. Authentication API — `TARGET`

### 15.1. Register

```http
POST /api/v1/auth/register
```

Request:

```json
{
  "email": "user@example.com",
  "password": "<client-input>",
  "displayName": "Nguyễn Văn A",
  "acceptTerms": true,
  "termsVersion": "2026-01"
}
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "status": "pending_verification"
    }
  }
}
```

Không trả password rule chi tiết hơn mức cần thiết để tránh lộ logic nội bộ; vẫn cung cấp UX rule ở frontend.

Errors:

- `EMAIL_ALREADY_REGISTERED`.
- `PASSWORD_POLICY_VIOLATION`.
- `TERMS_NOT_ACCEPTED`.

### 15.2. Login

```http
POST /api/v1/auth/login
```

Response có thể:

- Access token ngắn hạn trong body + refresh token HttpOnly cookie; hoặc
- Session cookie HttpOnly hoàn toàn.

Contract phải chốt theo threat model và môi trường deploy.

Errors:

- `INVALID_CREDENTIALS` dùng chung, không phân biệt email tồn tại.
- `ACCOUNT_LOCKED`.
- `EMAIL_NOT_VERIFIED` nếu policy yêu cầu.

### 15.3. Refresh/logout

```http
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/logout-all
```

### 15.4. Email verification/password reset

```http
POST /api/v1/auth/email-verification/request
POST /api/v1/auth/email-verification/confirm
POST /api/v1/auth/password-reset/request
POST /api/v1/auth/password-reset/confirm
```

Password reset request luôn trả response trung tính để chống account enumeration.

## 16. My account API — `TARGET`

### 16.1. Profile

```http
GET /api/v1/me
PATCH /api/v1/me
```

`PATCH` dùng field allowlist; không cho sửa role/status.

### 16.2. Addresses

```http
GET    /api/v1/me/addresses
POST   /api/v1/me/addresses
PATCH  /api/v1/me/addresses/{id}
DELETE /api/v1/me/addresses/{id}
POST   /api/v1/me/addresses/{id}/set-default
```

### 16.3. Consent/privacy

```http
GET  /api/v1/me/consents
POST /api/v1/me/consents
POST /api/v1/me/consents/{purpose}/withdraw
POST /api/v1/me/privacy-requests
GET  /api/v1/me/privacy-requests/{id}
```

Privacy request type:

- `access`
- `export`
- `correction`
- `deletion`

Không tự động hard-delete ngay khi nhận request.

## 17. Wishlist and cart API — `TARGET`

### 17.1. Wishlist

```http
GET    /api/v1/me/wishlist
POST   /api/v1/me/wishlist/items
DELETE /api/v1/me/wishlist/items/{variantId}
```

POST idempotent: thêm item đã có vẫn trả trạng thái thành công.

### 17.2. Cart

```http
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/{itemId}
DELETE /api/v1/cart/items/{itemId}
POST   /api/v1/cart/merge
```

Request thêm item:

```json
{
  "variantId": "...",
  "quantity": 2
}
```

Response phải trả server-calculated totals và `version`:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "version": 4,
    "currency": "VND",
    "items": [],
    "subtotalAmount": 350000,
    "totalAmount": 350000
  }
}
```

Errors:

- `VARIANT_NOT_AVAILABLE`.
- `QUANTITY_OUT_OF_RANGE`.
- `INSUFFICIENT_STOCK` nếu check sớm.
- `CART_VERSION_CONFLICT`.

## 18. Checkout and order API

### 18.1. Inquiry Mode — `CURRENT/NEXT`

Checkout frontend gọi submission:

```http
POST /api/v1/submissions
```

với `kind=pre-order`.

Không gọi endpoint order/payment giả.

### 18.2. Create order — `TARGET`

```http
POST /api/v1/orders
Idempotency-Key: 3fe2...
```

Request:

```json
{
  "cartId": "...",
  "shippingAddress": {
    "recipientName": "Nguyễn Văn A",
    "phone": "0900000000",
    "addressLine1": "...",
    "ward": "...",
    "district": "...",
    "province": "TP. Hồ Chí Minh",
    "countryCode": "VN"
  },
  "paymentMethod": "online"
}
```

Server phải đọc lại cart, giá và inventory; không nhận `totalAmount` làm nguồn sự thật.

Response `201`:

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "...",
      "orderNumber": "SNV-20260713-X7K9",
      "status": "awaiting_payment",
      "totalAmount": 350000,
      "currency": "VND"
    },
    "payment": {
      "status": "pending",
      "redirectUrl": "https://provider.example/..."
    }
  }
}
```

Errors:

- `CART_EMPTY`.
- `PRICE_CHANGED` có thể trả cart mới để user xác nhận.
- `ITEM_UNAVAILABLE`.
- `INSUFFICIENT_STOCK`.
- `IDEMPOTENCY_CONFLICT`.

### 18.3. Order list/detail

```http
GET /api/v1/me/orders?page=1&pageSize=20
GET /api/v1/me/orders/{orderId}
GET /api/v1/orders/by-number/{orderNumber}?token=<guest-token>
```

Không cho người dùng đọc order của người khác bằng ID.

### 18.4. Cancel request

```http
POST /api/v1/me/orders/{orderId}/cancel
```

Request:

```json
{
  "reasonCode": "changed_mind",
  "note": ""
}
```

State machine quyết định có thể hủy trực tiếp, tạo request hoặc từ chối.

## 19. Payment API and webhook — `OPTIONAL/TARGET`

### 19.1. Create/retry payment

```http
POST /api/v1/orders/{orderId}/payments
Idempotency-Key: ...
```

### 19.2. Public return URL

```http
GET /payment/return/{provider}
```

Return page chỉ hiển thị trạng thái tạm; không tự đánh dấu order paid chỉ từ query client.

### 19.3. Webhook

```http
POST /api/v1/webhooks/payments/{provider}
```

Quy tắc:

- Verify signature trên raw body.
- Lưu provider event ID.
- Idempotent.
- Trả nhanh sau khi ghi nhận; xử lý nặng qua worker.
- Không trả chi tiết lỗi nội bộ cho provider ngoài mức cần thiết.

## 20. Shipment API and webhook — `OPTIONAL/TARGET`

```http
GET  /api/v1/me/orders/{orderId}/shipment
POST /api/v1/webhooks/shipping/{provider}
```

Mapping trạng thái provider sang internal status nằm ở adapter.

## 21. Admin API conventions

Base:

```text
/api/v1/admin
```

Mọi endpoint:

- Yêu cầu authentication.
- Yêu cầu permission cụ thể.
- Có audit cho mutation quan trọng.
- List hỗ trợ pagination/filter/sort.
- Không trả PII dư thừa.

## 22. Admin catalog API — `TARGET`

```http
GET    /api/v1/admin/products
POST   /api/v1/admin/products
GET    /api/v1/admin/products/{id}
PATCH  /api/v1/admin/products/{id}
POST   /api/v1/admin/products/{id}/publish
POST   /api/v1/admin/products/{id}/archive

POST   /api/v1/admin/products/{id}/variants
PATCH  /api/v1/admin/variants/{id}
POST   /api/v1/admin/variants/{id}/archive

GET    /api/v1/admin/collections
POST   /api/v1/admin/collections
PATCH  /api/v1/admin/collections/{id}
```

Publish validation trả `422 PUBLISH_REQUIREMENTS_NOT_MET` với danh sách field thiếu.

## 23. Admin content API — `TARGET`

```http
GET    /api/v1/admin/content-items
POST   /api/v1/admin/content-items
GET    /api/v1/admin/content-items/{id}
POST   /api/v1/admin/content-items/{id}/revisions
PATCH  /api/v1/admin/content-revisions/{revisionId}
POST   /api/v1/admin/content-revisions/{revisionId}/submit-review
POST   /api/v1/admin/content-revisions/{revisionId}/publish
POST   /api/v1/admin/content-items/{id}/unpublish
```

Concurrency:

- Dùng `If-Match`/version khi nhiều editor.

## 24. Admin QR API — `TARGET`

```http
GET    /api/v1/admin/qr-records
POST   /api/v1/admin/qr-records
GET    /api/v1/admin/qr-records/{id}
PATCH  /api/v1/admin/qr-records/{id}
POST   /api/v1/admin/qr-records/{id}/activate
POST   /api/v1/admin/qr-records/{id}/pause
POST   /api/v1/admin/qr-records/{id}/revoke

GET    /api/v1/admin/qr-experience-contents
POST   /api/v1/admin/qr-experience-contents
PATCH  /api/v1/admin/qr-experience-contents/{id}
POST   /api/v1/admin/qr-experience-contents/{id}/publish

POST   /api/v1/admin/qr-batch-overrides
PATCH  /api/v1/admin/qr-batch-overrides/{id}
```

Activation preconditions:

- Product tồn tại.
- Destination allowlist.
- Content version/locale đã publish.
- Code unique.

Errors:

- `QR_CODE_EXISTS`.
- `QR_CONTENT_NOT_PUBLISHED`.
- `QR_INVALID_DESTINATION`.
- `QR_STATE_CONFLICT`.

## 25. Admin submission/lead API — `TARGET`

```http
GET   /api/v1/admin/submissions
GET   /api/v1/admin/submissions/{id}
PATCH /api/v1/admin/submissions/{id}/status
POST  /api/v1/admin/submissions/{id}/assign
POST  /api/v1/admin/submissions/{id}/activities
POST  /api/v1/admin/submissions/export
```

Filter:

```text
kind
status
assignedTo
productSlug
source
createdFrom
createdTo
q
```

Export:

- Permission riêng `submissions.export`.
- Audit actor/filter/số record.
- Export lớn dùng job, link tải có hạn.

## 26. Admin order API — `TARGET`

```http
GET   /api/v1/admin/orders
GET   /api/v1/admin/orders/{id}
POST  /api/v1/admin/orders/{id}/confirm
POST  /api/v1/admin/orders/{id}/cancel
POST  /api/v1/admin/orders/{id}/mark-processing
POST  /api/v1/admin/orders/{id}/shipments
POST  /api/v1/admin/orders/{id}/refunds
```

Mọi action kiểm tra state machine và permission.

Refund yêu cầu:

- `payments.refund`.
- Amount > 0 và không vượt số còn có thể refund.
- Reason code.
- Idempotency key.
- Audit.

## 27. Admin inventory API — `TARGET`

```http
GET  /api/v1/admin/inventory
GET  /api/v1/admin/inventory/{variantId}
POST /api/v1/admin/inventory/adjustments
GET  /api/v1/admin/inventory/movements
```

Adjustment request:

```json
{
  "variantId": "...",
  "locationId": "...",
  "quantityDelta": -2,
  "reasonCode": "damaged",
  "note": "Bao bì hỏng khi vận chuyển nội bộ"
}
```

Không cho sửa trực tiếp `on_hand` bằng generic PATCH.

## 28. Admin user/RBAC API — `TARGET`

```http
GET   /api/v1/admin/users
GET   /api/v1/admin/users/{id}
POST  /api/v1/admin/users/{id}/lock
POST  /api/v1/admin/users/{id}/unlock
POST  /api/v1/admin/users/{id}/disable

GET   /api/v1/admin/roles
POST  /api/v1/admin/roles
PATCH /api/v1/admin/roles/{id}
POST  /api/v1/admin/users/{id}/roles
DELETE /api/v1/admin/users/{id}/roles/{roleId}
```

Không cho user tự cấp quyền cao hơn qua `/me`.

## 29. Admin media API — `TARGET`

```http
POST   /api/v1/admin/media/upload-intents
POST   /api/v1/admin/media/{id}/complete
GET    /api/v1/admin/media
PATCH  /api/v1/admin/media/{id}
DELETE /api/v1/admin/media/{id}
```

Upload intent response:

```json
{
  "success": true,
  "data": {
    "mediaId": "...",
    "uploadUrl": "https://storage.example/presigned...",
    "headers": {
      "Content-Type": "image/webp"
    },
    "expiresAt": "2026-07-13T15:00:00Z"
  }
}
```

## 30. Admin analytics and audit API — `TARGET`

```http
GET  /api/v1/admin/analytics/overview
GET  /api/v1/admin/analytics/qr
GET  /api/v1/admin/analytics/submissions
POST /api/v1/admin/analytics/exports

GET  /api/v1/admin/audit-logs
GET  /api/v1/admin/audit-logs/{id}
```

Không cho sửa/xóa audit log qua API nghiệp vụ.

## 31. Idempotency contract

Áp dụng cho:

- Create order.
- Create payment/refund.
- Export job.
- Provider webhook.
- Các mutation có side effect khó đảo ngược.

Request:

```http
Idempotency-Key: 7b99f4f2-...
```

Behavior:

1. Cùng actor + endpoint scope + key + cùng payload -> trả lại kết quả cũ.
2. Cùng key nhưng payload khác -> `409 IDEMPOTENCY_CONFLICT`.
3. Key có TTL phù hợp, order/payment thường giữ lâu hơn request thông thường.
4. Server lưu hash payload, status và response reference.

## 32. Optimistic concurrency contract

Response:

```http
ETag: "product-7"
```

Update:

```http
PATCH /api/v1/admin/products/{id}
If-Match: "product-7"
```

Version sai:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_VERSION_CONFLICT",
    "message": "Dữ liệu đã được thay đổi bởi một thao tác khác."
  }
}
```

HTTP `409` hoặc `412`; chọn một quy ước và dùng nhất quán. Khuyến nghị `412 Precondition Failed` khi dùng chuẩn `If-Match`.

## 33. Cache contract

Public GET có thể trả:

```http
Cache-Control: public, max-age=60, stale-while-revalidate=300
ETag: "..."
```

Private endpoint:

```http
Cache-Control: no-store
```

Không cache response chứa PII ở shared cache.

## 34. Deprecation

Khi bỏ endpoint/field:

- Thông báo trong changelog.
- Giữ tương thích trong cửa sổ đã định.
- Có header nếu cần:

```http
Deprecation: true
Sunset: Wed, 31 Dec 2026 23:59:59 GMT
Link: </api/v1/new-endpoint>; rel="successor-version"
```

Không xóa field đang được frontend dùng mà không kiểm tra usage.

## 35. OpenAPI requirements

- FastAPI tự sinh OpenAPI nhưng phải bổ sung description, tag, example và response code.
- Production có thể giới hạn Swagger UI; OpenAPI artifact vẫn được lưu trong CI.
- CI kiểm tra breaking change bằng OpenAPI diff khi API ổn định.
- Mỗi endpoint có operation ID ổn định.

## 36. Contract test checklist

Mỗi endpoint phải có tối thiểu:

- Happy path.
- Required field missing.
- Invalid type/format.
- Resource not found.
- Permission denied nếu protected.
- Rate limit nếu public mutation.
- Idempotency/concurrency nếu áp dụng.
- Không rò PII/secret trong error.
- Response đúng envelope/schema.
- OpenAPI khớp behavior thật.

## 37. Definition of Done cho API

- Có route, schema, service và test.
- Có permission/rate limit phù hợp.
- Có error code ổn định.
- Có OpenAPI example.
- Có audit/analytics khi cần.
- Có idempotency hoặc concurrency control khi cần.
- Có migration/rollout note nếu thay đổi data model.
- Frontend adapter không phụ thuộc chi tiết database.
