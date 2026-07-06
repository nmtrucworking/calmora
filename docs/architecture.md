# Architecture - Frontend

Overview
- Vite + React + TypeScript application.
- The app uses a lightweight in-house SPA router, not React Router.
- Source code is organized feature-first with a small app shell and shared layer.

Important folders
- `src/app` - app entry, layout, providers, and router.
- `src/features` - route pages and domain modules such as landing, products, commerce, QR experience, inquiry flows, and shared content.
- `src/shared` - reusable UI components, styles, utilities, analytics, and API helpers.
- `src/assets` - assets imported through Vite. Public static assets remain under `public/`.

Import aliases
- `@app/*` maps to `src/app/*`.
- `@features/*` maps to `src/features/*`.
- `@shared/*` maps to `src/shared/*`.
- `@assets/*` maps to `src/assets/*`.

Design notes
- The 3D lotus model lives in `src/features/landing/three` and is implemented with `three`, `@react-three/fiber`, and `@react-three/drei`.
- `StoryLotusCanvas` lives in `src/shared/components/story` so the story feature can reuse the landing 3D scene without owning the model implementation.
- Keep cross-feature imports through aliases. Relative imports should stay local to a nearby file or folder.
