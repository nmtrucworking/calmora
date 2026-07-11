# Backend Implementation Plan

Tài liệu này mô tả backend cần triển khai dựa trên cấu trúc frontend hiện tại trong `apps/frontend`. Mục tiêu là thay phần mock/localStorage của frontend bằng API thật, nhưng vẫn giữ nguyên các route và domain đang có.

## 1. Bối cảnh frontend

Frontend là Vite + React + TypeScript, chia theo feature:

- `src/app/router`: SPA router tự viết, không dùng React Router.
- `src/features/products`: dữ liệu sản phẩm và trang product/detail.
- `src/features/qr`: QR redirect, QR experience, QR feedback.
- `src/features/inquiry`: contact, partners, reorder/sample-interest, thank-you.
- `src/features/commerce`: mock collection, wishlist, bag, checkout/inquiry.
- `src/features/content`: SEO, QR records, nội dung tĩnh, i18n, commerce content.
- `src/shared/api/submissions.ts`: mock API hiện tại, lưu submission vào `localStorage`.

Backend nên giữ API contract tương thích với kiểu trả về hiện tại:

```ts
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};
```

## 2. Cấu trúc backend đề xuất

Backend hiện có FastAPI ở `apps/backend/app/main.py`. Nên mở rộng theo layout sau:

```text
apps/backend/
  app/
    main.py
    api/
      router.py
      routes/
        health.py
        products.py
        qr.py
        submissions.py
        analytics.py
    core/
      config.py
      security.py
      errors.py
    db/
      session.py
      base.py
      migrations/
    models/
      product.py
      qr_record.py
      submission.py
      analytics_event.py
    schemas/
      product.py
      qr.py
      submission.py
      analytics.py
      response.py
    services/
      products.py
      qr.py
      submissions.py
      analytics.py
    seed/
      products.json
      qr_records.json
  tests/
    test_products.py
    test_qr.py
    test_submissions.py
```

Nguyên tắc tương ứng frontend:

- Feature frontend nào có dữ liệu hoặc hành vi động thì backend có route/service riêng.
- Dữ liệu content tĩnh có thể seed từ JSON trước, sau đó chuyển sang DB/admin sau.
- Form submission phải là domain dùng chung, phân biệt bằng `kind`.
- QR cần resolve nhanh, có tracking scan và trạng thái active/expired.

## 3. Domain dữ liệu

### Products

Frontend đang dùng ba slug cố định:

- `classic`
- `petal-pack`
- `gift-set`

Backend cần trả product theo schema gần với `SenovaProduct`:

- `id`, `slug`, `name`, `line`
- `eyebrow`, `tagline`, `description`, `shortDescription`
- `role`: `Giữ`, `Mở`, `Trao`
- `href`, `image`, `status`
- `priceLabel`, `availability`
- `variants`, `includedItems`, `dimensions`
- `brewingNotes`, `shippingNote`, `giftOptions`, `badges`
- `primaryAction`, `secondaryAction`
- `batchLabel`, `heroAlt`
- `suitableFor`, `highlights`, `experienceSteps`
- `seo`

MVP có thể seed dữ liệu từ `apps/frontend/src/features/products/data/products.ts` sang `apps/backend/app/seed/products.json`.

### QR Records

Frontend hiện có các QR record:

| Code | Product | Destination | Active |
| --- | --- | --- | --- |
| `PP-2601-A` | `petal-pack` | `/experience/petal-pack` | true |
| `CL-2601-A` | `classic` | `/experience/classic` | true |
| `GS-2601-A` | `gift-set` | `/experience/gift-set` | true |
| `PP-2509-X` | `petal-pack` | `/experience/petal-pack` | false |

Schema cần có:

- `code`
- `productSlug`
- `batchCode`
- `destination`
- `active`
- `createdAt`
- `expiresAt`
- `scanCount`
- `lastScannedAt`

### Submissions

Frontend hiện có các `SubmissionKind`:

- `feedback`
- `pre-order`
- `sample-interest`
- `contact`
- `partners`

Backend nên dùng một bảng `submissions` chung:

- `id`
- `kind`
- `payload` JSON
- `source`
- `productSlug`
- `batchCode`
- `email`
- `name`
- `status`: `new`, `reviewed`, `archived`, `spam`
- `createdAt`
- `updatedAt`

Các form đều có honeypot `website`; nếu field này có giá trị thì trả lỗi `SPAM_DETECTED`.

## 4. API endpoints MVP

Base path đề xuất: `/api`.

### Health

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

### Products

```http
GET /api/products
GET /api/products/{slug}
```

Yêu cầu:

- `GET /api/products` trả danh sách product public, sắp xếp theo thứ tự frontend hiện tại.
- `GET /api/products/{slug}` trả `404 PRODUCT_NOT_FOUND` nếu slug không hợp lệ.
- Chỉ expose product có `status` phù hợp với frontend. `gift-set` hiện là `draft` nhưng vẫn cần hiển thị.

### QR

```http
GET /api/qr/{code}
POST /api/qr/{code}/scan
```

`GET /api/qr/{code}` resolve QR record:

```json
{
  "success": true,
  "data": {
    "code": "PP-2601-A",
    "productSlug": "petal-pack",
    "batchCode": "PP-2601-A",
    "destination": "/experience/petal-pack",
    "active": true
  }
}
```

Lỗi cần có:

- `QR_NOT_FOUND`
- `QR_INACTIVE`
- `QR_EXPIRED`

`POST /api/qr/{code}/scan` ghi nhận scan event, user agent, referrer, campaign/source nếu có. Endpoint này không được làm chậm redirect.

### Submissions

```http
POST /api/submissions
GET /api/submissions/{id}
```

Request chung:

```json
{
  "kind": "feedback",
  "payload": {
    "name": "Nguyen Van A",
    "email": "a@example.com",
    "skuOrLot": "PP-2601-A",
    "source": "qr",
    "contentViewed": "petal-pack-scan",
    "sensoryFeedback": "...",
    "acceptablePriceRange": "300k-500k",
    "purchaseIntentPurpose": "personal-gift",
    "optInConsent": "anonymous-follow-up",
    "productSlug": "petal-pack",
    "batchCode": "PP-2601-A"
  }
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "feedback-20260711-000001"
  }
}
```

Validation theo kind:

| Kind | Required fields |
| --- | --- |
| `feedback` | `skuOrLot`, `source`, `contentViewed`, `sensoryFeedback`, `acceptablePriceRange`, `purchaseIntentPurpose`, `optInConsent`, `productSlug` |
| `sample-interest` | `name`, `email`, `role`, `primaryProduct`, `sampleFormat`, `useCase`, `validationTopics`, `evidenceConsent` |
| `contact` | `name`, `email`, `topic`, `message` |
| `partners` | `name`, `email`, `organization`, `message` |
| `pre-order` | `name`, `email`, `phone`, `items` hoặc `notes` tùy checkout flow |

Các field optional vẫn nên lưu nguyên trong `payload` để không mất dữ liệu validation.

### Analytics

```http
POST /api/analytics/events
```

Dùng để thay dần `src/shared/analytics/analytics.ts`.

Request:

```json
{
  "eventName": "feedback_submit",
  "productSlug": "petal-pack",
  "batchCode": "PP-2601-A",
  "source": "qr",
  "contentViewed": "petal-pack-scan",
  "path": "/experience/petal-pack"
}
```

MVP có thể trả `204` hoặc `ApiResponse<{ id: string }>`; ưu tiên không block UI nếu analytics lỗi.

## 5. Tích hợp frontend

Thay `src/shared/api/submissions.ts` từ localStorage sang fetch API:

- `POST /api/submissions`
- Map `submitForm(kind, payload)` thành `{ kind, payload }`.
- Giữ nguyên `ApiResponse<T>` để ít đổi component.
- Nếu API lỗi network, trả `success: false` với `NETWORK_ERROR`.

Sau đó tách thêm:

- `src/shared/api/products.ts`
- `src/shared/api/qr.ts`
- `src/shared/api/analytics.ts`

Frontend router hiện vẫn render route tĩnh, nên backend chưa cần server-side routing.

## 6. CORS, config và bảo mật

Biến môi trường đề xuất:

```text
APP_ENV=local
API_PREFIX=/api
DATABASE_URL=sqlite:///./senova.db
FRONTEND_ORIGINS=http://localhost:5173,http://localhost:5175
SUBMISSION_RATE_LIMIT_PER_MINUTE=10
```

Yêu cầu:

- CORS chỉ mở theo `FRONTEND_ORIGINS`, không để `allow_origins=["*"]` khi deploy.
- Validate email bằng Pydantic.
- Sanitize text input tối thiểu như frontend đang làm: bỏ `<` và `>`, trim whitespace.
- Có rate limit cho `/api/submissions` và `/api/qr/{code}/scan`.
- Không log raw payload chứa thông tin cá nhân ở production.

## 7. Thứ tự triển khai

1. Chuẩn hóa FastAPI app: config, CORS, `/api/health`, test cơ bản.
2. Thêm schema `ApiResponse` dùng chung.
3. Seed products và QR records từ frontend sang JSON.
4. Triển khai `GET /api/products`, `GET /api/products/{slug}`.
5. Triển khai `GET /api/qr/{code}` và `POST /api/qr/{code}/scan`.
6. Thiết kế DB cho submissions, thêm SQLAlchemy/Alembic nếu cần migrate lâu dài.
7. Triển khai `POST /api/submissions` với validation theo `kind`.
8. Đổi frontend `submitForm` sang gọi API thật.
9. Thêm analytics event endpoint khi cần đo QR scan/form conversion.
10. Bổ sung admin/export submissions sau MVP.

## 8. Definition of Done cho MVP

- Frontend gửi được contact, partners, sample-interest, feedback, checkout/pre-order qua API thật.
- QR code active resolve đúng destination; QR inactive/expired trả lỗi rõ ràng.
- Product API trả đủ dữ liệu để frontend có thể chuyển dần khỏi hardcoded data.
- Backend có test cho health, products, QR, submissions validation.
- `.env.example` có đủ biến môi trường cần chạy local.
- README backend có lệnh chạy local: `uvicorn app.main:app --reload`.
