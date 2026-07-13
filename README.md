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
  Copy-Item .env.example .env
  python -m uvicorn app.main:app --reload --env-file .env
  ```
