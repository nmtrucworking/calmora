# 02. Current Backend Implementation

## 1. Trạng thái

- Mốc triển khai: `CURRENT`.
- Runtime: FastAPI + Uvicorn.
- Persistence: PostgreSQL qua SQLAlchemy 2.x/Psycopg 3; schema được version bằng Alembic.
- API prefix mặc định: `/api`.
- Chế độ commerce: inquiry/pre-order, chưa thu tiền trực tuyến.

Phạm vi hiện thực gồm catalog sản phẩm công khai, resolve/nội dung QR, ghi nhận QR scan, tiếp nhận form, analytics event và admin có authentication/RBAC/audit. Payment, inventory và fulfillment chưa thuộc mốc này.

Frontend runtime đọc catalog, QR content/batch override và admin data qua API. Migration `20260718_0005` thêm version QR bất biến `fe-cutover-2026-07` và chỉ đổi ba QR seed khi JSONB vẫn khớp chính xác seed cũ, nhờ đó không ghi đè dữ liệu vận hành đã chỉnh sửa.

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

Deploy chạy `python -m alembic upgrade head` và `python -m app.seed_import` trước khi khởi động web process. App chỉ kiểm tra kết nối, không tự thay đổi schema.

### Supabase Postgres

Supabase dùng PostgreSQL chuẩn nên backend kết nối trực tiếp bằng Psycopg; không cần `supabase-py`, anon key hay service-role key.

1. Tạo project trong Supabase.
2. Mở **Connect** và chọn **Session pooler** (port `5432`) cho backend Render chạy lâu dài, đặc biệt khi môi trường chỉ hỗ trợ IPv4.
3. Copy connection string, thay `[YOUR-PASSWORD]`, rồi lưu toàn bộ URL vào secret `DATABASE_URL` trên Render.
4. Bật SSL và ưu tiên connection string có `sslmode=require`.
5. Chạy Alembic migration và seed import trong release step, sau đó redeploy web process.

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

`/api` là compatibility contract và vẫn trả Gift Set đang ở `draft`. `/api/v1/products` và detail v1 chỉ expose product `active`; draft trả `PRODUCT_NOT_FOUND`. Catalog response có `ETag` và `Cache-Control: public, max-age=60`; ETag đổi theo payload database.

Catalog được import idempotent từ `app/seed/products.json` vào PostgreSQL. `gift-set` có trạng thái `draft` nhưng vẫn public để giữ đúng hành vi frontend hiện tại.

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

`GET /api/submissions/{id}` chỉ trả `id`, `kind`, `status`, `createdAt`, `updatedAt`; raw payload chỉ được đọc qua admin API có permission.

### Admin

- Auth: `POST /api/v1/auth/login`, `GET /auth/me`, `POST /auth/logout`, password reset và revoke-all session.
- Product: list/detail/upsert và chuyển `draft/active/archived` với optimistic version.
- QR: list/upsert, trạng thái `active/paused/revoked`, destination bắt buộc thuộc `/experience/`.
- QR content: draft/publish theo product-version-locale; QR active bắt buộc trỏ published content, batch override chỉ thay guidance/notice.
- Lead: filter/page/detail/status/assign/note và CSV export có permission riêng, allowlist field, cap 1.000 dòng trong 365 ngày.
- Dashboard: aggregate server-side theo khoảng thời gian và IANA timezone; audit log lưu actor/action/target/request ID.
- Admin response chuẩn hóa `camelCase`, có optimistic `version`; lead list hỗ trợ search/filter/page, assignment lấy từ admin active; QR content và batch override có list/detail/draft/publish/active-disable workflow.
- Content: item/revision draft, submit/return review, publish và unpublish; public API chỉ đọc current published revision.

Session admin là opaque token lưu hash trong PostgreSQL, truyền bằng cookie HttpOnly 8 giờ. Mutation bắt buộc double-submit CSRF và permission server-side; password dùng Argon2id.

### Analytics

| Method | Endpoint | Hành vi |
| --- | --- | --- |
| `POST` | `/api/analytics/events` | Lưu event không chứa PII, rate limit 120 request/IP/phút. |

`eventName` bắt buộc có 1-100 ký tự. Client không được gửi tên, email, điện thoại hoặc nội dung form vào analytics.

## 4. Persistence schema

Alembic quản lý schema; migration hiện tại tạo/adopt các bảng:

| Table | Dữ liệu chính | Index/constraint |
| --- | --- | --- |
| `submissions` | kind, `JSONB` payload, status, `TIMESTAMPTZ` | PK `id`, unique `idempotency_key`, status check, index `(kind, created_at)` |
| `analytics_events` | event name, `JSONB` event, `TIMESTAMPTZ` | PK `id`, index `(event_name, created_at)` |
| `products`, `product_variants` | public catalog snapshot | unique slug/ID, product FK, status/index |
| `qr_records`, `qr_experience_contents`, `qr_batch_overrides` | QR registry/content/override | PK/composite PK, product FK, seed hash |
| `admin_users`, `roles`, `permissions`, `admin_sessions` | Identity, RBAC và session admin | email/token hash unique, role/permission joins, expiry/revoke |
| `audit_logs`, `password_reset_tokens`, `lead_activities` | Audit, reset password và lịch sử xử lý lead | actor/target/request ID, token expiry, submission FK |
| `content_items`, `content_revisions` | Content workflow và public revision pointer | unique key/revision, optimistic version, immutable published state |

Seed JSON vẫn được version trong source control nhưng chỉ là nguồn import; API runtime đọc PostgreSQL. Import dùng `ON CONFLICT DO NOTHING` để không overwrite dữ liệu hiện hữu. Submissions, analytics, catalog và QR dùng chung được giữa nhiều backend instance.

## 5. Security và privacy

- CORS chỉ cho phép origin khai báo trong `FRONTEND_ORIGINS`.
- Admin mutation yêu cầu permission và CSRF; cookie session là HttpOnly/SameSite Strict và bật Secure ở staging/production.
- Login/reset bị rate limit; sai mật khẩu liên tiếp khóa tài khoản tạm thời; password hash dùng Argon2id.
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
- admin auth/CSRF/RBAC deny-by-default, reset/revoke session, optimistic concurrency, QR/lead/export/dashboard và audit trên PostgreSQL.

## 7. Giới hạn và bước tiếp theo

Các phần sau chưa phải `CURRENT`:

1. Redis/distributed rate limiting.
2. Content revision/publish và media storage.
3. Notification outbox/worker và email sau khi nhận submission hoặc yêu cầu reset password.
4. Catalog CMS nâng cao, inventory, order, payment và fulfillment.
5. Metrics, tracing và alert production.

Khi triển khai production, chạy migration/bootstrap admin qua secret manager, kiểm tra backup/restore và cấu hình HTTPS trước khi mở quyền xử lý dữ liệu khách hàng.
