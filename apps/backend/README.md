# Calmora / Senova Backend

FastAPI backend cho website Calmora và trải nghiệm sản phẩm Senova. Phiên bản hiện tại cung cấp catalog, QR experience, form submission và analytics ingestion; dữ liệu vận hành được lưu bằng PostgreSQL.

## Chạy local

```powershell
cd apps/backend
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn app.main:app --reload --port 8000 --env-file .env
```

Trước khi khởi động, tạo database PostgreSQL và cập nhật `DATABASE_URL` trong `.env`. Có thể dùng PostgreSQL local, Render Postgres hoặc Supabase Postgres; backend kết nối trực tiếp bằng Psycopg và không cần SDK Supabase.

Khởi tạo hoặc nâng cấp schema và import seed idempotent trước khi chạy app:

```powershell
python -m alembic upgrade head
python -m app.seed_import
```

Tạo admin đầu tiên bằng CLI sau khi migration (không commit mật khẩu):

```powershell
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_NAME="Administrator"
$env:ADMIN_PASSWORD="use-a-secret-with-at-least-12-characters"
python -m app.bootstrap_admin
Remove-Item Env:ADMIN_PASSWORD
```

Admin API dùng session cookie HttpOnly 8 giờ. Frontend phải gửi `credentials: include`; các mutation đồng thời gửi giá trị cookie `senova_admin_csrf` trong header `X-CSRF-Token`. Chạy bootstrap lại với cùng email không ghi đè tài khoản hiện hữu.

Content workflow nằm dưới `/api/v1/admin/content-*`; public read dùng `GET /api/v1/content/{contentKey}` và chỉ trả revision đang publish. Revision đã publish không thể sửa trực tiếp; cần tạo revision draft mới.

Ứng dụng chỉ kiểm tra kết nối lúc startup; không tự tạo hoặc thay đổi schema. Migration production phải chạy như một bước deploy riêng.

API mặc định ở `http://localhost:8000`, Swagger UI ở `http://localhost:8000/docs`.

## Kiểm thử

```powershell
cd apps/backend
python -m pytest -q
```

Quality gate đầy đủ:

```powershell
python -m ruff format --check app migrations tests
python -m ruff check app migrations tests
python -m mypy app
python -m pytest -q
```

## Versioning và submission receipt

- Các route public hiện tại vẫn hoạt động dưới `/api` trong giai đoạn chuyển đổi.
- Contract versioned được expose song song dưới `/api/v1`. Chưa có ngày sunset cho `/api`; mọi deprecation phải được thông báo ít nhất một release trước.
- `POST /api/submissions` trả cả `id` và `receiptToken`. Tra cứu public bắt buộc gọi `GET /api/submissions/{id}?receiptToken=...`; response không chứa payload/PII.
- `pre-order` bắt buộc có `phone` và `items[]`. Backend chỉ nhận `productId`, `variantId`, `quantity` rồi tự snapshot tên product/variant từ catalog; label/price từ client bị bỏ qua.
- Lead status canonical là `new → contacted → qualified → closed`. Mapping legacy được khóa trong `app/modules/lead_status.py`; migration dữ liệu được thực hiện ở BE-106 và phải báo lỗi với giá trị lạ.

Xem contract và ghi chú vận hành tại [`docs/02-current-implementation.md`](./docs/02-current-implementation.md).
