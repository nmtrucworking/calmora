# 12. Frontend-to-Backend Contract

## 1. Mục đích và mức ưu tiên

Tài liệu này là cầu nối triển khai giữa source frontend hiện tại và backend. Nó trả lời bốn câu hỏi thực dụng:

1. Màn hình FE nào cần dữ liệu hoặc hành vi từ BE?
2. Payload, trạng thái và quy tắc nào phải được giữ tương thích?
3. Phần nào đang là mock, không được hiểu nhầm là nghiệp vụ production?
4. FE và BE phải thay đổi gì để hoàn tất từng luồng end-to-end?

Khi có khác biệt, dùng thứ tự ưu tiên sau:

1. Contract `CURRENT` trong `app/main.py` và source FE đang gọi API.
2. Quyết định tương thích được ghi trong tài liệu này.
3. Contract mục tiêu trong `04-api-contracts.md`.
4. Mô hình dài hạn trong các tài liệu domain/database còn lại.

Ký hiệu:

- `CURRENT`: đã chạy end-to-end hoặc đã có endpoint.
- `WIRED-PARTIAL`: BE có API nhưng FE vẫn có fallback/dữ liệu local.
- `NEXT`: cần làm để thay mock của FE.
- `TARGET`: chỉ triển khai khi sản phẩm chuyển sang commerce/account đầy đủ.

## 2. Ma trận FE -> BE

| Bề mặt FE | Source chính | Dữ liệu/hành vi | API | Trạng thái |
| --- | --- | --- | --- | --- |
| Product list/detail | `features/products/data/products.ts` | Catalog ba sản phẩm | `GET /api/products`, `GET /api/products/{slug}` | `WIRED-PARTIAL`: BE có, FE còn đọc local |
| QR redirect `/q/:code` | `shared/api/qr.ts` | Resolve và ghi scan | `GET /api/qr/{code}`, `POST /api/qr/{code}/scan` | `CURRENT`, có local fallback |
| QR experience | `features/content/qrExperience.ts` | Nội dung theo product/version/locale/batch | `GET /api/qr/experience/{productSlug}` | `WIRED-PARTIAL`: FE còn đọc local |
| Feedback QR | `QrFeedbackForm.tsx` | Tạo submission `feedback` | `POST /api/submissions` | `CURRENT` khi có `VITE_API_BASE_URL` |
| Contact | `ContactPage` | Tạo submission `contact` | `POST /api/submissions` | `CURRENT` khi có API URL |
| Partners | `PartnersPage` | Tạo submission `partners` | `POST /api/submissions` | `CURRENT` khi có API URL |
| Reorder/sample interest | `PreOrderPage` | Tạo submission `sample-interest` | `POST /api/submissions` | `CURRENT` khi có API URL |
| Checkout inquiry | `commerce/pages/index.tsx` | Tạo submission `pre-order` | `POST /api/submissions` | `PARTIAL`: thiếu line items |
| Page/QR/form analytics | `shared/analytics/analytics.ts` | Event không chứa PII | `POST /api/analytics/events` | `CURRENT`, localStorage chỉ là debug fallback |
| Admin login | `features/admin/AdminApp.tsx` | Session demo | Auth API mục tiêu | `NEXT`; tuyệt đối không dùng credential demo ở production |
| Admin products/QR/leads/analytics | `features/admin/*` | CRUD, workflow, dashboard | `/api/v1/admin/*` | `NEXT`; toàn bộ store hiện là memory |
| Wishlist/account/order status | `commerce/pages/index.tsx` | UI mô phỏng | Account/commerce API | `TARGET`, không thuộc MVP inquiry |

## 3. Quy ước contract bắt buộc

### 3.1. Envelope và casing

Public API hiện tại giữ envelope và `camelCase`:

```json
{
  "success": true,
  "data": {}
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu chưa hợp lệ."
  }
}
```

- JSON API dùng `camelCase`; database dùng `snake_case`.
- `error.code` là mã ổn định để FE branch logic; không branch theo `message`.
- Timestamp là ISO 8601 UTC có timezone.
- ID là opaque string; FE không suy ra loại/thời gian từ ID.
- Public route hiện tại là `/api/*`. Nếu thêm `/api/v1`, phải giữ `/api/*` tương thích cho đến khi FE được migrate cùng release.

### 3.2. HTTP và retry

- GET không tạo side effect.
- Create trả `201` ở contract mới; endpoint `CURRENT` đang trả `200` được giữ tương thích.
- FE có thể retry form khi mất mạng, vì vậy `POST /submissions` phải nhận `Idempotency-Key`.
- Cùng idempotency key và cùng payload trả cùng kết quả; cùng key nhưng khác payload phải trả `409 IDEMPOTENCY_CONFLICT`.
- `POST /analytics/events` và QR scan là best-effort, không được chặn điều hướng/trải nghiệm.

## 4. Catalog

### 4.1. Product public read model

Public response phải đủ cho type `SenovaProduct`, gồm:

```text
id, slug, name, line, eyebrow, tagline, description, shortDescription,
role, href, image, status, priceLabel, availability, variants,
includedItems, dimensions, brewingNotes, shippingNote, giftOptions,
badges, primaryAction, secondaryAction?, batchLabel?, heroAlt,
suitableFor, highlights, experienceSteps, seo
```

Enum tương thích:

- `slug/line`: hiện có `classic | petal-pack | gift-set`; BE không hard-code enum này cho dài hạn, nhưng seed và route hiện tại phải hỗ trợ đủ ba giá trị.
- `status`: `draft | active | archived`.
- `role`: hiện là `Giữ | Mở | Trao`.

Quyết định MVP: `gift-set` dù là `draft` vẫn được public vì FE hiện render sản phẩm này. Khi có CMS thật, thêm cờ `isPublic`/`publishedAt`; không suy luận public chỉ từ `status` trong giai đoạn chuyển tiếp.

### 4.2. Admin product write model

Form admin hiện chỉ sửa một tập con:

```text
name, slug, line, role, tagline, shortDescription, image,
priceLabel, availability, variants[{id,label,note}], status
```

Vì public product có nhiều field hơn, admin phải dùng `PATCH`, không dùng `PUT`. Server merge field được gửi và giữ nguyên `description`, SEO, highlights, CTA, brewing notes... chưa có trong form.

Validation tối thiểu khớp FE:

- `name`, `tagline` không rỗng.
- `slug` khớp `^[a-z0-9]+(?:-[a-z0-9]+)*$` và unique không phân biệt hoa/thường.
- `shortDescription` tối thiểu 20 ký tự.
- Không cho publish nếu thiếu dữ liệu bắt buộc của public read model.
- Archive không xóa record; product đang được QR active tham chiếu phải trả conflict hoặc yêu cầu pause QR trước.

## 5. QR registry và nội dung trải nghiệm

### 5.1. QR entity

Read/write model phục vụ admin:

```text
id, code, productSlug, batchCode, contentVersion, destination,
campaign, locale, status, activeFrom?, expiresAt?, scans, createdAt, updatedAt
```

Enum `status`: `active | paused | expired | revoked`.

Quy tắc:

- Normalize `code = trim().toUpperCase()`; unique trên giá trị normalize.
- Mã mới ở `paused`.
- `expired` là trạng thái hiệu lực được suy ra khi `expiresAt < now`; không cần ghi đè status gốc.
- `revoked` là terminal trong workflow production; không activate lại bằng endpoint thông thường.
- `destination` không nhận tự do từ client. Server suy ra `/experience/{productSlug}` hoặc kiểm tra allowlist nội bộ.
- Chỉ activate khi product tồn tại, content version/locale đã publish và destination hợp lệ.

### 5.2. Resolve contract

`GET /api/qr/{code}` trả `200` cho record tồn tại ở mọi trạng thái để FE hiển thị đúng màn hình:

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
    "redirectUrl": "/experience/petal-pack?batch=PP-2601-A&source=qr&content=petal-pack-scan&version=v1",
    "status": "active"
  }
}
```

- Unknown: `404 QR_NOT_FOUND`.
- Paused/expired/revoked: `200`, không có `redirectUrl`, có `status` và `message`.
- Không trả HTTP redirect trong contract SPA hiện tại.
- `redirectUrl` chỉ là relative internal path; ngăn open redirect.

FE hiện fallback sang registry local khi API trả lỗi, kể cả `QR_NOT_FOUND`. Trước go-live phải chỉ fallback khi chưa cấu hình API; không fallback khi server đã trả response nghiệp vụ, nếu không record bị revoke trên BE có thể vẫn hoạt động từ bundle cũ.

### 5.3. Experience content

`GET /api/qr/experience/{productSlug}?version=v1&batch=PP-2601-A&locale=vi` trả nội dung tương thích:

```text
productSlug, version, contentViewed, eyebrow, title, lede,
story { title, paragraphs[] }, culture { title, paragraphs[], sourceNotes[] },
guidance { title, intro, steps[{label,title,text}], safetyNote? },
reflectionPrompt, cta { primary, secondary }, batchNotice?
```

FE local type đang phẳng hơn response hiện tại. Khi wire API, adapter FE phải map ít nhất:

```text
story.title -> storyTitle
story.paragraphs -> storyParagraphs
guidance.title -> guidanceTitle
guidance.intro -> guidanceIntro
guidance.steps -> guidanceSteps
reflectionPrompt -> prompt
```

Không bỏ mất `culture`, `safetyNote`, `cta` và `batchNotice`; bổ sung chúng vào view model khi UI hỗ trợ.

## 6. Submission và validation theo form

Tất cả form dùng:

```json
{
  "kind": "contact",
  "payload": {}
}
```

### 6.1. Ma trận field

| Kind | Required | Optional / metadata | Enum/giới hạn lấy từ FE |
| --- | --- | --- | --- |
| `contact` | `name`, `email`, `topic`, `message` | `website` | `topic`: `product`, `gift-set`, `event`, `distribution`, `other` |
| `partners` | `name`, `email`, `organization`, `message` | `partnerType`, `website` | `partnerType`: `material`, `production`, `distribution`, `experience`, `content` |
| `sample-interest` | `name`, `email`, `role`, `primaryProduct`, `sampleFormat`, `useCase`, `validationTopics`, `evidenceConsent` | `phone`, `expectedQuantity`, `timeline`, `giftBudget`, `petalPackQuestion`, `giftSetQuestion`, `message`, `campaign`, `reportReferenceDate`, `website` | `validationTopics` hiện là chuỗi nối bằng dấu phẩy; nên chuyển thành `string[]` ở contract v1 |
| `feedback` | `skuOrLot`, `source`, `contentViewed`, `sensoryFeedback`, `acceptablePriceRange`, `purchaseIntentPurpose`, `optInConsent`, `productSlug` | `name`, `email`, `contentVersion`, `batchCode`, `website` | price: `under-150k`, `150k-300k`, `300k-500k`, `500k-800k`, `over-800k`, `not-sure`; purpose: `daily-use`, `personal-gift`, `corporate-event-gift`, `tourism-cultural`, `undecided` |
| `pre-order` | `name`, `email`, `phone`, `items` | `intent`, `notes`, `website` | `items[].quantity >= 1`; xem mục 6.2 |

Enum của `sample-interest` lấy từ FE:

- `primaryProduct`: `petal-pack | gift-set`.
- `role`: `consumer | gift-buyer | event-corporate | retail-partner`.
- `sampleFormat`: `sample-at-event | home-sample | interview | concept-review`.
- `useCase`: `daily-ritual | small-gift | corporate-gift | event-souvenir | tourism-cultural`.
- `timeline` optional: `july-2026 | q3-2026 | q4-2026 | later`.
- `giftBudget` optional: `under-150k | 150k-300k | 300k-500k | over-500k`.
- `evidenceConsent`: hiện là `anonymous-report-use`; BE phải xác minh đúng giá trị này thay vì chỉ kiểm tra truthy.

Quy tắc chung:

- Validate lại ở BE, không tin HTML `required`.
- Email normalize bằng trim/lowercase để tìm kiếm, nhưng giữ bản hiển thị nếu cần.
- `website` có giá trị => `SPAM_DETECTED`; không lưu giá trị honeypot.
- Không tự strip HTML rồi coi dữ liệu là an toàn ở mọi output context; lưu text chuẩn hóa và escape khi render/export.
- Payload tối đa 64 KiB; giới hạn từng text theo field.
- Consent phải lưu `consentType`, `acceptedAt`, `policyVersion`, không chỉ chuỗi checkbox, ở schema mục tiêu.
- Analytics không được nhận name/email/phone/message/sensory feedback.

### 6.2. Contract checkout bắt buộc sửa

FE hiện chỉ gửi `itemCount`, làm BE không biết khách chọn sản phẩm/variant nào. Không triển khai production theo payload đó. Contract đúng:

```json
{
  "kind": "pre-order",
  "payload": {
    "name": "Nguyen Van A",
    "email": "a@example.com",
    "phone": "0900000000",
    "intent": "preorder",
    "notes": "Giao buổi sáng",
    "items": [
      {
        "productId": "petal-pack",
        "variantId": "petal-single",
        "quantity": 2,
        "giftMessage": "Chúc mừng",
        "deliveryPreference": "concierge"
      }
    ]
  }
}
```

BE phải snapshot tên product/variant tại thời điểm nhận inquiry nếu dữ liệu này cần xuất cho vận hành. Giá label không được tin từ FE. FE chỉ `clearBag()` sau response thành công.

### 6.3. Vòng đời lead

Để khớp admin UI đầu tiên, canonical status cho milestone admin là:

```text
new -> contacted -> qualified -> closed
```

- Có thể đóng từ bất kỳ trạng thái với `closeReason`.
- Mỗi lần đổi status/assignee hoặc thêm note tạo `lead_activities` và audit log.
- DB `CURRENT` đang allow `new | in_progress | resolved | rejected`; cần migration trước khi nối admin. Mapping dữ liệu cũ: `in_progress -> contacted`, `resolved -> closed`, `rejected -> closed` kèm `closeReason=rejected_legacy`.
- Không dùng hai enum khác nhau giữa public receipt, DB và admin.

## 7. Admin API tối thiểu để thay mock

Tất cả endpoint dưới `/api/v1/admin` yêu cầu authentication, permission và audit. List dùng `page`, `pageSize`, filter allowlist và `sort`.

| Màn hình | Endpoint tối thiểu | Permission |
| --- | --- | --- |
| Login/logout/me | `POST /api/v1/auth/login`, `POST /auth/logout`, `GET /auth/me` | public/session |
| Dashboard | `GET /api/v1/admin/dashboard?fromDate&toDate&timezone` | `analytics.read` |
| Products | `GET /admin/products[/{id}]`, `PUT /admin/products/{id}`, `POST .../status` | `catalog.read/write/publish` |
| QR | `GET /admin/qr`, `PUT /admin/qr/{code}` | `qr.read/manage` |
| Leads | `GET /admin/submissions[/{id}]`, `PATCH .../status`, `POST .../assign`, `POST .../activities` | `submissions.read/write/assign` |
| Export/audit | `POST /admin/submissions/export`, `GET /admin/audit-logs` | `submissions.export`, `audit.read` |

Contract list admin phải trả `meta.total` vì UI có phân trang. Dashboard/analytics phải aggregate ở BE theo timezone được khai báo; FE không cộng toàn bộ raw events.

Admin frontend hiện dùng session backend và không còn credential demo/sessionStorage. Các ràng buộc bắt buộc là:

- ship credential mẫu trong bundle;
- coi object trong sessionStorage là bằng chứng xác thực;
- cho FE tự gán role;
- trả raw submission PII cho role không có `leads.read`.

## 8. Persistence tối thiểu theo nhu cầu FE

### MVP hiện tại

- `submissions`: bền vững trong PostgreSQL, payload JSONB và idempotency key.
- `analytics_events`: bền vững trong PostgreSQL, không chứa PII.
- `products`, `qr_records`, `qr_experience_contents`, `qr_batch_overrides`: seed version-control.

### Milestone admin

Tối thiểu cần migrate sang bảng quan hệ:

```text
products -> product_variants
products -> qr_records -> qr_scan_events
qr_experience_contents -> qr_batch_overrides
submissions -> lead_activities
admin_users -> roles/permissions
admin_users -> audit_logs
```

Các invariant quan trọng:

- Unique normalized product slug, QR code và variant SKU khi có SKU.
- FK QR -> product và content version đã tồn tại.
- Scan event append-only; `scans` trong admin là aggregate/cache, không phải counter client được phép sửa.
- Submission payload PII không nằm trong analytics table.
- Update admin dùng optimistic concurrency (`version` hoặc `If-Match`) để tránh ghi đè.

## 9. Luồng xử lý chuẩn

### 9.1. QR scan

1. FE normalize code và gọi resolve.
2. BE tìm record, tính effective status tại thời điểm request.
3. Active: trả internal `redirectUrl`; inactive: trả status/message; unknown: 404.
4. FE gửi scan best-effort rồi điều hướng nếu active.
5. BE ghi event độc lập; lỗi analytics không đổi kết quả resolve.
6. Experience page lấy content đúng version/locale/batch và gửi `experience_start`.

### 9.2. Form submission

1. FE validate UX và gửi idempotency key.
2. BE rate-limit, honeypot, schema/enum/size validation.
3. BE normalize, ghi transaction submission + consent/activity khởi tạo.
4. Commit xong mới trả receipt ID.
5. Notification chạy qua outbox/job, không làm request thất bại sau khi submission đã commit.
6. FE điều hướng thank-you và chỉ xóa bag sau thành công.

### 9.3. Publish product/QR

1. Admin lưu draft bằng PATCH.
2. BE validate field và version conflict.
3. Action publish/activate kiểm tra toàn bộ invariant server-side.
4. Transaction cập nhật trạng thái và audit log.
5. Cache public được invalidate sau commit.

## 10. Các khoảng trống cần đóng trước go-live

| Ưu tiên | Khoảng trống | Owner |
| --- | --- | --- |
| P0 | Checkout gửi `items[]`, không chỉ `itemCount` | FE + BE |
| P0 | Thống nhất/migrate submission status sang enum admin | BE |
| P0 | Bỏ QR local fallback khi API trả kết quả nghiệp vụ | FE |
| P0 | Auth/RBAC thật trước khi nối admin với PII | FE + BE |
| P1 | FE đọc product và QR experience từ API; có loading/error rõ | FE |
| P1 | Thêm idempotency key ổn định cho form client | FE + BE |
| P1 | Alembic migration thay bootstrap DDL khi vận hành production | BE |
| P1 | Distributed rate limit nếu chạy nhiều worker/instance | BE/Infra |
| P2 | Chuẩn hóa `validationTopics` thành array | FE + BE |
| P2 | Dashboard aggregate theo date range/product/source | BE |

## 11. Acceptance contract theo milestone

### Public MVP

- Các endpoint `CURRENT` qua integration test với PostgreSQL.
- Ba product và bốn trạng thái QR có contract test.
- Năm submission kind có positive/negative test theo field matrix.
- Retry cùng idempotency key không tạo bản ghi kép.
- Không có PII trong analytics/log response.
- QR revoked/paused/expired không redirect dù bundle FE còn cache.

### Admin milestone

- Route `/admin/*` không truy cập được chỉ bằng sessionStorage giả.
- List/filter/page khớp UI; response có total ổn định.
- Product PATCH không xóa field public mà form admin không hiển thị.
- Transition product/QR/lead được kiểm tra ở BE và có audit.
- Note lead lưu author từ session, không nhận author tùy ý từ client.
- Dashboard cùng bộ lọc cho kết quả thống nhất với query detail.

## 12. Source traceability

Khi FE thay đổi các file sau, contract này phải được review cùng PR:

- `src/app/router/AppRouter.tsx` — bề mặt route.
- `src/features/products/data/products.ts` — public product model.
- `src/features/qr/types/qr.ts`, `shared/api/qr.ts` — QR contract/fallback.
- `src/features/content/qrExperience.ts` — content model.
- `src/shared/api/submissions.ts` và bốn form inquiry/feedback — submission contract.
- `src/app/providers/InquiryBagContext.tsx`, `features/commerce/pages/index.tsx` — checkout payload.
- `src/shared/analytics/analytics.ts` — event schema.
- `src/features/admin/types.ts`, `AdminStore.tsx`, `AdminApp.tsx` — admin read/write model và workflow.

Mọi thay đổi field/status/endpoint phá tương thích phải cập nhật đồng thời: type FE, OpenAPI/BE schema, contract test và tài liệu này.
