# Backend docs: QR product cultural story

Nguồn yêu cầu frontend: `apps/frontend/docs/features/qr-product-cultural-story.md`.

Tài liệu này mô tả backend cần có để đưa chức năng QR - câu chuyện sản phẩm và văn hóa Senova từ dữ liệu tĩnh/localStorage sang API thật. Mục tiêu MVP là resolve QR nhanh, không tạo open redirect, chọn đúng nội dung theo sản phẩm/lô/phiên bản, ghi nhận analytics không chứa PII, và lưu feedback người dùng.

## 1. Phạm vi backend MVP

Trong phạm vi:

- Quản lý registry QR theo code đã phát hành.
- Resolve `/q/:code` thông qua API để frontend biết trạng thái và đích đến.
- Phân biệt QR không tồn tại, active, paused, expired, revoked.
- Hỗ trợ `contentVersion` và ghi đè hướng dẫn theo `batchCode`.
- Ghi nhận sự kiện QR/experience/feedback không chứa PII.
- Nhận feedback QR qua API submissions hiện hữu.
- Cung cấp seed JSON để triển khai nhanh trước khi có admin dashboard.

Ngoài phạm vi MVP:

- Chống hàng giả hoặc xác thực từng đơn vị sản phẩm.
- Dashboard quản trị QR hoàn chỉnh.
- Sinh hàng nghìn QR unique cho từng đơn vị sản phẩm.
- Blockchain/NFT/truy xuất nguồn gốc nếu chưa có dữ liệu kiểm chứng.

## 2. Domain model

### 2.1. QR record

```python
QrStatus = Literal["active", "paused", "expired", "revoked"]

class QrRecord(BaseModel):
    code: str
    product_slug: Literal["classic", "petal-pack", "gift-set"]
    batch_code: str | None = None
    content_version: str
    destination: str
    status: QrStatus
    active_from: datetime | None = None
    expires_at: datetime | None = None
    campaign: str | None = None
    locale: Literal["vi", "en"] = "vi"
    created_at: datetime
    updated_at: datetime
```

Quy tắc:

- `code` được chuẩn hóa bằng `strip().upper()`.
- `destination` chỉ được lấy từ registry nội bộ, không lấy từ query string.
- `status="expired"` có thể là trạng thái lưu trong DB hoặc trạng thái suy ra khi `expires_at < now`.
- QR bị thu hồi không bị xóa khỏi registry, để hệ thống còn trả trạng thái thân thiện.

### 2.2. Experience content

```python
class QrExperienceContent(BaseModel):
    product_slug: str
    version: str
    content_viewed: str
    eyebrow: str
    title: str
    lede: str
    story: dict
    culture: dict
    guidance: dict
    reflection_prompt: str
    cta: dict
```

Nội dung có thể bắt đầu bằng seed JSON, sau đó chuyển sang DB/CMS. Backend không tự suy diễn quy trình pha từ tên sản phẩm; mọi hướng dẫn phải đến từ content đã duyệt.

### 2.3. Batch override

```python
class QrBatchContentOverride(BaseModel):
    batch_code: str
    product_slug: str
    content_version: str
    guidance_override: dict | None = None
    notice: str | None = None
```

Dùng cho Petal Pack và các lô thử nghiệm có hướng dẫn khác nhau. Nếu R&D chưa xác nhận quy trình pha, backend trả `notice` hoặc dùng content version chưa publish thay vì phát hành hướng dẫn chung.

## 3. API contract

Base path: `/api`.

Tất cả response JSON dùng envelope chung:

```json
{
  "success": true,
  "data": {}
}
```

Lỗi:

```json
{
  "success": false,
  "error": {
    "code": "QR_NOT_FOUND",
    "message": "QR code is not recognized."
  }
}
```

### 3.1. Resolve QR

```http
GET /api/qr/{code}
```

Query optional:

- `source`: mặc định `qr`.
- `locale`: mặc định `vi`.

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

Response inactive vẫn nên trả `200` với `success=true` nếu QR tồn tại, để frontend hiển thị trạng thái đúng:

```json
{
  "success": true,
  "data": {
    "code": "PP-2509-X",
    "productSlug": "petal-pack",
    "batchCode": "PP-2509-X",
    "contentVersion": "v1",
    "destination": "/experience/petal-pack",
    "status": "paused",
    "message": "QR code is temporarily paused."
  }
}
```

QR không tồn tại trả `404 QR_NOT_FOUND`.

### 3.2. Track scan

```http
POST /api/qr/{code}/scan
```

Request:

```json
{
  "source": "qr",
  "path": "/q/PP-2601-A",
  "referrer": "https://senova.vn/products/petal-pack",
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

Endpoint này không được làm chậm redirect. Frontend có thể gọi bằng `navigator.sendBeacon()` hoặc fire-and-forget `fetch(..., { keepalive: true })`.

### 3.3. Get experience content

```http
GET /api/qr/experience/{productSlug}
```

Query:

- `version`: required sau MVP, default `v1` trong MVP.
- `batch`: optional.
- `locale`: default `vi`.

Response:

```json
{
  "success": true,
  "data": {
    "productSlug": "petal-pack",
    "version": "v1",
    "contentViewed": "petal-pack-scan",
    "title": "Mở một cánh sen, bắt đầu một khoảng lặng.",
    "story": {
      "title": "Ý nghĩa của trải nghiệm",
      "paragraphs": []
    },
    "culture": {
      "title": "Câu chuyện văn hóa",
      "paragraphs": [],
      "sourceNotes": []
    },
    "guidance": {
      "title": "Mở - cảm nhận - pha",
      "intro": "Hãy để thao tác mở cánh trở thành bước đầu tiên của tách trà.",
      "steps": [],
      "safetyNote": null
    },
    "batchNotice": null
  }
}
```

### 3.4. QR feedback

Dùng endpoint submissions chung:

```http
POST /api/submissions
```

Request:

```json
{
  "kind": "feedback",
  "payload": {
    "name": "Nguyen Van A",
    "email": "a@example.com",
    "skuOrLot": "PP-2601-A",
    "source": "qr",
    "contentViewed": "petal-pack-scan",
    "contentVersion": "v1",
    "sensoryFeedback": "Huong sen ro, thao tac mo de nho.",
    "acceptablePriceRange": "300k-500k",
    "purchaseIntentPurpose": "personal-gift",
    "optInConsent": "anonymous-follow-up",
    "productSlug": "petal-pack",
    "batchCode": "PP-2601-A",
    "website": ""
  }
}
```

Validation bắt buộc cho `kind="feedback"`:

- `skuOrLot`
- `source`
- `contentViewed`
- `sensoryFeedback`
- `acceptablePriceRange`
- `purchaseIntentPurpose`
- `optInConsent`
- `productSlug`

Nếu honeypot `website` có giá trị, trả `400 SPAM_DETECTED`.

### 3.5. Analytics events

```http
POST /api/analytics/events
```

Request:

```json
{
  "eventName": "qr_scan",
  "productSlug": "petal-pack",
  "batchCode": "PP-2601-A",
  "contentVersion": "v1",
  "source": "qr",
  "contentViewed": "petal-pack-scan",
  "path": "/q/PP-2601-A"
}
```

Allowed event names MVP:

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

Analytics không được yêu cầu tên, email hoặc số điện thoại.

## 4. Service rules

### 4.1. Normalize code

```python
def normalize_qr_code(code: str) -> str:
    return code.strip().upper()
```

Không tự sửa dấu, khoảng trắng giữa code, hoặc alias ngoài registry. Nếu cần alias, thêm record rõ ràng.

### 4.2. Resolve status

```python
def resolve_qr_status(record: QrRecord, now: datetime) -> QrStatus:
    if record.status in ("paused", "revoked"):
        return record.status
    if record.expires_at and record.expires_at < now:
        return "expired"
    if record.active_from and record.active_from > now:
        return "paused"
    return "active"
```

### 4.3. Build redirect URL

```python
def build_redirect_url(record: QrRecord) -> str:
    params = {
        "batch": record.batch_code or record.code,
        "source": "qr",
        "content": f"{record.product_slug}-scan",
        "version": record.content_version,
    }
    return f"{record.destination}?{urlencode(params)}"
```

Chỉ cho phép `destination` bắt đầu bằng `/experience/`. Không cho phép URL tuyệt đối hoặc protocol-relative URL.

## 5. Data storage MVP

Seed files đề xuất:

```text
apps/backend/app/seed/
  qr_records.json
  qr_experience_content.json
  qr_batch_overrides.json
```

Khi chuyển sang DB:

```text
qr_records
  id
  code unique
  product_slug
  batch_code
  content_version
  destination
  status
  active_from
  expires_at
  campaign
  locale
  created_at
  updated_at

qr_scan_events
  id
  qr_code
  product_slug
  batch_code
  content_version
  source
  campaign
  path
  referrer
  user_agent_hash
  ip_hash
  created_at

qr_experience_contents
  id
  product_slug
  version
  locale
  content_json
  publish_status
  created_at
  updated_at

qr_batch_overrides
  id
  batch_code
  product_slug
  content_version
  override_json
  created_at
  updated_at
```

## 6. Security and privacy

- Không log raw feedback payload ở production.
- Không lưu IP thô trong analytics; nếu cần chống spam, hash với salt xoay vòng.
- Rate limit `/api/qr/{code}/scan`, `/api/analytics/events`, `/api/submissions`.
- CORS chỉ mở cho domain frontend đã cấu hình.
- Escape/sanitize mọi text content trước khi render nếu content đến từ CMS/API.
- Không mô tả QR như cơ chế chống hàng giả khi chưa có mã unique và backend xác thực từng đơn vị.

## 7. Frontend integration

Giai đoạn 1 giữ frontend hiện tại chạy bằng dữ liệu tĩnh, backend song song expose API.

Giai đoạn 2 chuyển từng adapter:

- `getQrRecord()` -> `GET /api/qr/{code}`.
- `trackEvent()` -> `POST /api/analytics/events`, fallback localStorage khi network lỗi.
- `QrFeedbackForm` -> `POST /api/submissions`.
- `getQrExperienceContent()` -> `GET /api/qr/experience/{productSlug}?version=...&batch=...`.

Frontend vẫn tự điều hướng SPA; backend chỉ trả `redirectUrl`, không cần HTTP 302 trong MVP. Nếu sau này cần redirect server-side, endpoint public `/q/{code}` phải có cùng logic và vẫn chống open redirect.

## 8. Test cases backend

- `GET /api/qr/pp-2601-a` chuẩn hóa thành `PP-2601-A`.
- QR active trả `redirectUrl` có `batch`, `source=qr`, `content`, `version`.
- QR không tồn tại trả `404 QR_NOT_FOUND`.
- QR paused trả status `paused`, không trả `redirectUrl` active.
- QR revoked trả status `revoked`.
- QR hết hạn theo `expires_at` trả status `expired`.
- Query `?destination=https://example.com` bị bỏ qua.
- Destination tuyệt đối trong seed bị reject khi load hoặc validate.
- `POST /api/qr/{code}/scan` không nhận PII và vẫn trả nhanh.
- `POST /api/submissions` feedback thiếu required field trả validation error.
- Honeypot `website` có giá trị trả `SPAM_DETECTED`.
- Experience content theo `batch` áp dụng đúng `guidance_override`.

## 9. Rollout checklist

- [ ] Tạo seed QR cho `CL-2601-A`, `PP-2601-A`, `GS-2601-A`, `PP-2509-X`.
- [ ] Thêm `contentVersion` vào mọi QR record.
- [ ] Chốt quy trình pha Petal Pack theo từng batch trước khi publish.
- [ ] Thêm endpoint resolve QR và test trạng thái.
- [ ] Thêm endpoint analytics với rate limit.
- [ ] Mở submissions feedback qua API thật.
- [ ] Cấu hình CORS production.
- [ ] Kiểm thử QR in thật trên iPhone Camera, Android Camera/Google Lens và Zalo.

## 10. Definition of Done

- QR active resolve đúng nội dung và không có open redirect.
- QR invalid/paused/expired/revoked có response rõ ràng để frontend hiển thị trạng thái thân thiện.
- Feedback QR lưu được `productSlug`, `batchCode`, `contentViewed`, `contentVersion`.
- Analytics không chứa PII và không block trải nghiệm.
- Có test tự động cho normalize code, status, redirect URL và validation feedback.
- Tài liệu API được cập nhật trước khi frontend chuyển khỏi dữ liệu tĩnh.
