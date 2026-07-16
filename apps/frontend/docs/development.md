# Development - Frontend

## Prerequisites

- Node 18+.
- npm.

## Install

```bash
cd apps/frontend
npm install
```

## Run Dev Server

```bash
cd apps/frontend
npm run dev
```

Default Vite URL: `http://localhost:5173/`.

## Build Production

```bash
cd apps/frontend
npm run build
```

The build runs TypeScript project references first via `tsc -b`, then Vite.

## Preview Production Build

```bash
cd apps/frontend
npm run preview
```

## Lint

```bash
cd apps/frontend
npm run lint
```

## Useful Checks

```bash
rg "/reorder" src public docs
rg "/pre-order" src public docs
```

Use route checks after path migrations so docs, sitemap, content, and router stay aligned.

## Notes

- The project uses TypeScript project references; `tsc -b` is part of the build pipeline.
- Admin authentication uses the backend `/api/v1/auth/login`, `/auth/me`, and `/auth/logout` endpoints. It no longer accepts demo credentials or a session stored in `sessionStorage`.
- Admin API requests include cookies. Mutations copy the `senova_admin_csrf` cookie into the `X-CSRF-Token` header.
- The 3D/story bundle is large. This is currently expected; address it with route-level code splitting only when performance work is in scope.
- Vite may warn about large chunks because Three.js and story canvas are part of the app.
