# Frontend Docs - Senova

These docs describe the current frontend app in `apps/frontend`.

## Current Docs

- `architecture.md` - app structure, runtime architecture, aliases, and ownership boundaries.
- `routes.md` - active SPA routes, aliases, QR paths, and route ownership.
- `content-and-data.md` - source-of-truth files for copy, products, SEO, QR records, commerce mock data, and forms.
- `components.md` - shared component inventory and usage rules.
- `design-system.md` - current visual system, tokens, and interaction guidance.
- `development.md` - install, run, build, lint, and local preview.
- `deployment.md` - Vercel deployment notes.

## Cleanup Note

Historical specs, fix plans, and old route drafts were removed from this folder because they no longer match the app. The source of truth is now the code under `src/features/content`, `src/features/products`, `src/app/router`, and the concise docs listed above.
