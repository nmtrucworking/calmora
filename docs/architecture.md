# Architecture — Frontend

Overview
- Vite + React + TypeScript application.
- `src/features/landing/three` contains the 3D lotus model implemented with `three` + `@react-three/fiber` + `@react-three/drei`.
- The site uses a minimal routing abstraction in `src/routes` (not a router library) for SPA behaviour.

Important folders
- `src/components` — shared UI components (branding, layout, UI primitives).
- `src/features` — feature-scoped code; landing and the 3D model live here.
- `src/pages` — page entry points for non-landing pages (`SenovaLandingPage`, `SitePage`, `StoryPage`).
- `src/styles` — global theme tokens (`theme.css`).

Design notes
- The 3D lotus is expensive to render; it is mounted in `ScrollModelCanvas` and controlled via a `ScrollBinder` that maps a progress value into the scene. For `StoryPage` we use a `StoryLotusCanvas` wrapper to autoplay a fixed cycle.
- Keep `features/landing/three` untouched when changing layout; reuse via the wrapper when needed.
