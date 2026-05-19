# Deployment — Frontend

Vercel
- This project is configured for a monorepo. The Vercel config for the frontend is located at `apps/frontend/vercel.json`.
- Build command: `npm run build` (this runs `tsc -b && vite build`).
- Output directory: `dist`.

Notes for deployment
- Keep the `apps/frontend/vercel.json` at the app root so Vercel's project path can point directly at `apps/frontend`.
- The 3D model increases bundle size. Consider code-splitting or dynamic importing heavy modules if cold-start build size or runtime performance becomes an issue.
- To preview production on local machine use `npm run preview` after `npm run build`.
