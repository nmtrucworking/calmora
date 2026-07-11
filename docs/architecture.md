# Architecture - Frontend

## Stack

- Vite + React + TypeScript.
- Tailwind CSS v4 with CSS custom properties in `src/shared/styles/theme.css`.
- Framer Motion for page and section motion.
- Three.js, `@react-three/fiber`, and `@react-three/drei` for lotus scenes.
- A lightweight in-house SPA router, not React Router.

## App Shell

- `src/app/main.tsx` mounts the app.
- `src/app/App.tsx` wires providers and the router.
- `src/app/router` owns path state, `Link`, and route rendering.
- `src/app/layout/SiteLayout.tsx` owns the fixed header, mobile menu, footer, language toggle, reorder CTA, and ambient sound control.
- `src/app/providers` owns language state and inquiry bag state.

## Feature Folders

- `src/features/landing` - homepage sections and 3D lotus implementation.
- `src/features/products` - product listing, product detail pages, product model data, and product layout classes.
- `src/features/commerce` - mock commerce and concierge inquiry surfaces: collections, bag, checkout, account, policies, services, and journal.
- `src/features/inquiry` - reorder, contact, partners, and thank-you forms.
- `src/features/qr` - QR redirect, product experience pages, and feedback pages.
- `src/features/story`, `src/features/about`, and `src/features/system` - editorial and standard pages.
- `src/features/content` - layout copy, landing/product luxury copy, SEO metadata, QR records, commerce content, and i18n data.

## Shared Layer

- `src/shared/components` - reusable UI, luxury primitives, branding, cursor, and story canvas.
- `src/shared/styles` - design tokens, global CSS, reusable class strings, and motion helpers.
- `src/shared/api/submissions.ts` - mock submission helper used by forms.
- `src/shared/analytics/analytics.ts` - lightweight event tracking wrapper.
- `src/shared/utils` - class name helper and image preloading.

## Assets

- `src/assets` contains Vite-imported assets.
- `public/assets` contains URL-addressable product and brand images.
- Product pages and landing sections currently use optimized product images under `public/assets/products`.

## Import Aliases

- `@app/*` -> `src/app/*`
- `@features/*` -> `src/features/*`
- `@shared/*` -> `src/shared/*`
- `@assets/*` -> `src/assets/*`

## Ownership Rules

- Put route-specific UI beside its feature.
- Put reusable editorial or luxury UI in `src/shared/components`.
- Put reusable class strings in `src/shared/styles` only when they are shared across multiple pages.
- Keep content changes in `src/features/content` or `src/features/products/data/products.ts`; do not reintroduce Markdown route drafts as a parallel source of truth.
