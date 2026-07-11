# Deployment - Frontend

## Vercel

- Frontend config: `apps/frontend/vercel.json`.
- Install command: `npm ci`.
- Build command: `npm run build`.
- Output directory: `dist`.
- The Vercel project should use `apps/frontend` as the project root directory.
- SPA fallback is handled by rewriting all paths to `/index.html`, so direct visits to routes such as `/q/PP-2601-A` and `/experience/petal-pack` work after deploy.
- `/q/*` responses include `X-Robots-Tag: noindex, follow` because QR resolver URLs should not be indexed.
- Built `/assets/*` files are cached for one year with immutable cache headers.

## Environment Variables

- `VITE_ENABLE_ANALYTICS`: set to `false` to disable browser-side analytics during previews or QA.
- `VITE_API_BASE_URL`: reserve for the backend API origin once the frontend switches from localStorage/static data to the FastAPI backend.

## Static Files

- `public/robots.txt` and `public/sitemap.xml` ship as-is.
- Keep sitemap paths aligned with `src/app/router/AppRouter.tsx`.
- Current preorder path is `/reorder`; `/pre-order` remains a router alias but is not the canonical sitemap path.

## Before Deploy

- Confirm the Vercel root directory is `apps/frontend`, not the repository root.
- Run `npm run lint`.
- Run `npm run build`.
- Preview locally with `npm run preview` when route, SEO, or asset changes are involved.

## Known Notes

- Vite may warn that some chunks exceed 500 kB because of Three.js and the story canvas bundle.
- Treat that warning as a performance follow-up unless the current task is bundle optimization.
