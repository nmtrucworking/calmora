# Senova - Project Base

Base scaffold for the Senova website project (frontend + backend).

Quick start

- Frontend
  ```bash
  cd apps/frontend
  npm install
  npm run dev
  ```

- Backend
  ```bash
  cd apps/backend
  python -m venv .venv
  .\\.venv\\Scripts\\activate
  pip install -r requirements.txt
  uvicorn app.main:app --reload
  ```

Docker (optional):

```bash
docker compose up --build
```
