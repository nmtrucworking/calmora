# 02. Current Backend Implementation

## 1. Trạng thái

- Mốc triển khai: `CURRENT`.
- Runtime: FastAPI + Uvicorn.
- Persistence: PostgreSQL qua Psycopg 3, dùng transaction và kiểu `JSONB`/`TIMESTAMPTZ`.
- API prefix mặc định: `/api`.
- Chế độ commerce: inquiry/pre-order, chưa thu tiền trực tuyến.

Phạm vi hiện thực gồm catalog sản phẩm công khai, resolve/nội dung QR, ghi nhận QR scan, tiếp nhận form và analytics event. Authentication, admin, payment, inventory và fulfillment chưa thuộc mốc này.

## 2. Chạy ứng dụng

```powershell
cd apps/backend
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn app.main:app --reload --port 8000 --env-file .env
```

Các biến môi trường:

| Biến | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `APP_ENV` | `local` | Tên môi trường triển khai. |
| `API_PREFIX` | `/api` | Prefix route, được đọc lúc process khởi động. |
| `DATABASE_URL` | Bắt buộc | PostgreSQL URL dạng `postgresql://user:password@host:5432/database`. |
| `FRONTEND_ORIGINS` | Các port Vite local | Danh sách origin CORS, phân tách bằng dấu phẩy. |
| `SUBMISSION_RATE_LIMIT_PER_MINUTE` | `10` | Số form tối đa mỗi IP trong 60 giây. |

Backend từ chối khởi động nếu thiếu `DATABASE_URL` hoặc URL không dùng PostgreSQL.

### Render

1. Tạo Render Postgres cùng region với backend.
2. Gán **Internal Database URL** của database vào biến `DATABASE_URL` của Web Service.
3. Không gắn persistent disk cho database; PostgreSQL là datastore độc lập.
4. Deploy backend với start command:

```text
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Backend tự bootstrap bảng/index khi process khởi động. Sau deploy, kiểm tra `/api/health`, tạo thử một submission và xác nhận record trong PostgreSQL.

### Supabase Postgres

Supabase dùng PostgreSQL chuẩn nên backend kết nối trực tiếp bằng Psycopg; không cần `supabase-py`, anon key hay service-role key.

1. Tạo project trong Supabase.
2. Mở **Connect** và chọn **Session pooler** (port `5432`) cho backend Render chạy lâu dài, đặc biệt khi môi trường chỉ hỗ trợ IPv4.
3. Copy connection string, thay `[YOUR-PASSWORD]`, rồi lưu toàn bộ URL vào secret `DATABASE_URL` trên Render.
4. Bật SSL và ưu tiên connection string có `sslmode=require`.
5. Redeploy backend; process khởi động sẽ tạo `submissions`, `analytics_events` và các index nếu chưa có.

Không đưa database password, connection string, anon key hoặc service-role key vào frontend hay source control. Nếu sau này expose các bảng qua Supabase Data API, phải bật RLS và thiết kế policy riêng; backend hiện tại truy cập database từ trusted server bằng credential bí mật.

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
- lưu payload dạng `JSONB` trong PostgreSQL nhưng không trả payload/PII qua status lookup công khai.

`GET /api/submissions/{id}` chỉ trả `id`, `kind`, `status`, `createdAt`, `updatedAt`. Endpoint quản trị đọc payload chưa được triển khai vì chưa có authentication/RBAC.

### Analytics

| Method | Endpoint | Hành vi |
| --- | --- | --- |
| `POST` | `/api/analytics/events` | Lưu event không chứa PII, rate limit 120 request/IP/phút. |

`eventName` bắt buộc có 1-100 ký tự. Client không được gửi tên, email, điện thoại hoặc nội dung form vào analytics.

## 4. Persistence schema

Các bảng/index được bootstrap idempotently khi ứng dụng khởi động:

| Table | Dữ liệu chính | Index/constraint |
| --- | --- | --- |
| `submissions` | kind, `JSONB` payload, status, `TIMESTAMPTZ` | PK `id`, unique `idempotency_key`, status check, index `(kind, created_at)` |
| `analytics_events` | event name, `JSONB` event, `TIMESTAMPTZ` | PK `id`, index `(event_name, created_at)` |

QR, QR experience và catalog vẫn là seed JSON có version trong source control. Submissions và analytics nằm trong PostgreSQL, tồn tại qua restart và dùng chung được giữa nhiều backend instance. Bước tiếp theo cho thay đổi schema là bổ sung Alembic migration có version.

## 5. Security và privacy

- CORS chỉ cho phép origin khai báo trong `FRONTEND_ORIGINS`.
- Không có endpoint public liệt kê submissions hoặc đọc raw payload.
- Không dùng destination do client cung cấp để redirect QR.
- Không log raw payload trong code ứng dụng.
- Rate limiter hiện nằm trong memory nên chỉ chính xác trong từng process.
- Credential PostgreSQL chỉ đặt trong secret/environment của hạ tầng, không commit vào repository.

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

1. Alembic migration cho các thay đổi schema production.
2. Redis/distributed rate limiting.
3. Authentication, RBAC và admin API xử lý lead.
4. Notification worker/email sau khi nhận submission.
5. Catalog CMS, inventory, order, payment và fulfillment.
6. Observability production: structured log, metrics, tracing và alert.

Khi triển khai production, ưu tiên PostgreSQL/migration, admin authentication và backup/restore trước khi mở quyền xử lý dữ liệu khách hàng.
