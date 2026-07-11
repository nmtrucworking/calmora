# Deployment - Frontend

## Vercel

- Frontend config: `apps/frontend/vercel.json`.
- Build command: `npm run build`.
- Output directory: `dist`.
- The Vercel project should use `apps/frontend` as the frontend root.

## Static Files

- `public/robots.txt` and `public/sitemap.xml` ship as-is.
- Keep sitemap paths aligned with `src/app/router/AppRouter.tsx`.
- Current preorder path is `/reorder`; `/pre-order` remains a router alias but is not the canonical sitemap path.

## Before Deploy

- Run `npm run lint`.
- Run `npm run build`.
- Preview locally with `npm run preview` when route, SEO, or asset changes are involved.

## Known Notes

- Vite may warn that some chunks exceed 500 kB because of Three.js and the story canvas bundle.
- Treat that warning as a performance follow-up unless the current task is bundle optimization.
