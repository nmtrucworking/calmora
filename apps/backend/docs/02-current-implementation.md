# 02. Current Backend Implementation

## 1. Trạng thái

- Mốc triển khai: `CURRENT`.
- Runtime: FastAPI + Uvicorn.
- Persistence: SQLite dùng thư viện chuẩn `sqlite3`, bật WAL và foreign keys.
- API prefix mặc định: `/api`.
- Chế độ commerce: inquiry/pre-order, chưa thu tiền trực tuyến.

Phạm vi hiện thực gồm catalog sản phẩm công khai, resolve/nội dung QR, ghi nhận QR scan, tiếp nhận form và analytics event. Authentication, admin, payment, inventory và fulfillment chưa thuộc mốc này.

## 2. Chạy ứng dụng

```powershell
cd apps/backend
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn app.main:app --reload --port 8000
```

Các biến môi trường:

| Biến | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `APP_ENV` | `local` | Tên môi trường triển khai. |
| `API_PREFIX` | `/api` | Prefix route, được đọc lúc process khởi động. |
| `DATABASE_URL` | `sqlite:///./data/senova.db` | File SQLite; đường dẫn tương đối tính từ `apps/backend`. |
| `FRONTEND_ORIGINS` | Các port Vite local | Danh sách origin CORS, phân tách bằng dấu phẩy. |
| `SUBMISSION_RATE_LIMIT_PER_MINUTE` | `10` | Số form tối đa mỗi IP trong 60 giây. |

Không commit file trong `apps/backend/data/`; thư mục này chứa dữ liệu runtime.

## 3. API contract

Mọi response nghiệp vụ dùng envelope:

```json
{"success": true, "data": {}}
```

Lỗi dùng dạng:

```json
{"success": false, "error": {"code": "ERROR_CODE", "message": "Human-readable message"}}
```

### System và catalog

| Method | Endpoint | Hành vi |
| --- | --- | --- |
| `GET` | `/` | Metadata service và version. |
| `GET` | `/api/health` | Liveness check. |
| `GET` | `/api/products` | Trả ba sản phẩm theo thứ tự Classic, Petal Pack, Gift Set. |
| `GET` | `/api/products/{slug}` | Chi tiết product hoặc `PRODUCT_NOT_FOUND`. |

Catalog được seed từ `app/seed/products.json`. `gift-set` có trạng thái `draft` nhưng vẫn public để giữ đúng hành vi frontend hiện tại.

### QR

| Method | Endpoint | Hành vi |
| --- | --- | --- |
| `GET` | `/api/qr/{code}` | Chuẩn hóa mã, resolve trạng thái và tạo internal redirect an toàn. |
| `GET` | `/api/qr/experience/{productSlug}` | Nội dung theo `version`, `locale`, `batch`; áp dụng batch override nếu có. |
| `POST` | `/api/qr/{code}/scan` | Lưu scan, trạng thái QR, campaign, referrer và user-agent. |

Destination QR chỉ hợp lệ khi bắt đầu bằng `/experience/`, nhờ đó không tạo open redirect. QR có thể ở trạng thái `active`, `paused`, `expired` hoặc `revoked`.

### Submissions

```http
POST /api/submissions
Content-Type: application/json
Idempotency-Key: contact-20260713-0001
```

```json
{
  "kind": "contact",
  "payload": {
    "name": "Nguyen Van A",
    "email": "a@example.com",
    "topic": "product",
    "message": "Toi muon tim hieu Petal Pack.",
    "website": ""
  }
}
```

Các kind được hỗ trợ: `feedback`, `pre-order`, `sample-interest`, `contact`, `partners`. Backend:

- kiểm tra field bắt buộc theo kind và định dạng email;
- loại ký tự `<`/`>` khỏi text, trim và giới hạn text 5.000 ký tự;
- từ chối honeypot `website` có giá trị;
- giới hạn toàn payload ở 64 KiB;
- rate limit theo IP;
- hỗ trợ `Idempotency-Key` 8-128 ký tự an toàn, được scope theo kind;
- lưu payload vào SQLite nhưng không trả payload/PII qua status lookup công khai.

`GET /api/submissions/{id}` chỉ trả `id`, `kind`, `status`, `createdAt`, `updatedAt`. Endpoint quản trị đọc payload chưa được triển khai vì chưa có authentication/RBAC.

### Analytics

| Method | Endpoint | Hành vi |
| --- | --- | --- |
| `POST` | `/api/analytics/events` | Lưu event không chứa PII, rate limit 120 request/IP/phút. |

`eventName` bắt buộc có 1-100 ký tự. Client không được gửi tên, email, điện thoại hoặc nội dung form vào analytics.

## 4. Persistence schema

Database tự tạo khi ứng dụng khởi động:

| Table | Dữ liệu chính | Index/constraint |
| --- | --- | --- |
| `submissions` | kind, JSON payload, status, timestamps | PK `id`, unique `idempotency_key`, index `(kind, created_at)` |
| `analytics_events` | event name, JSON event, created time | PK `id`, index `(event_name, created_at)` |

QR, QR experience và catalog vẫn là seed JSON có version trong source control. Submissions và analytics tồn tại qua restart. SQLite phù hợp một instance/MVP; khi chạy nhiều instance cần chuyển repository sang PostgreSQL và migration có version.

## 5. Security và privacy

- CORS chỉ cho phép origin khai báo trong `FRONTEND_ORIGINS`.
- Không có endpoint public liệt kê submissions hoặc đọc raw payload.
- Không dùng destination do client cung cấp để redirect QR.
- Không log raw payload trong code ứng dụng.
- Rate limiter hiện nằm trong memory nên chỉ chính xác trong từng process.
- SQLite không thay thế cơ chế encryption/secret management; quyền truy cập file database phải được giới hạn ở hạ tầng.

## 6. Kiểm thử

Chạy:

```powershell
python -m pytest -q
```

Test hiện bao phủ:

- health response;
- thứ tự catalog, product detail và not-found;
- QR resolve và experience content;
- submission validation, sanitization, persistence, status privacy và idempotency;
- analytics persistence.

## 7. Giới hạn và bước tiếp theo

Các phần sau chưa phải `CURRENT`:

1. PostgreSQL + Alembic migration cho production/multi-instance.
2. Redis/distributed rate limiting.
3. Authentication, RBAC và admin API xử lý lead.
4. Notification worker/email sau khi nhận submission.
5. Catalog CMS, inventory, order, payment và fulfillment.
6. Observability production: structured log, metrics, tracing và alert.

Khi triển khai production, ưu tiên PostgreSQL/migration, admin authentication và backup/restore trước khi mở quyền xử lý dữ liệu khách hàng.
