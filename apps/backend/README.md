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

API mặc định ở `http://localhost:8000`, Swagger UI ở `http://localhost:8000/docs`.

## Kiểm thử

```powershell
cd apps/backend
python -m pytest -q
```

Xem contract và ghi chú vận hành tại [`docs/02-current-implementation.md`](./docs/02-current-implementation.md).
