# Senova Frontend

Frontend app for the Senova brand experience, built with React, TypeScript, Vite, Framer Motion, and Three.js. The app contains the landing experience, brand pages, story page, and products page for the Calmora/Senova visual system.

## Tech Stack

- React 19 with TypeScript
- Vite for local development and production builds
- Framer Motion for page and section transitions
- Three.js, `@react-three/fiber`, and `@react-three/drei` for interactive 3D scenes
- CSS Modules and global theme tokens
- ESLint for code quality checks

## Getting Started

Install dependencies from the frontend app folder:

```bash
cd apps/frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Project Structure

```text
apps/frontend
+-- public/                 Static assets served by Vite
|   +-- assets/products/    Product imagery
+-- src/
|   +-- app/                App entry, providers, layout, and lightweight router
|   +-- assets/             Imported Vite assets
|   +-- features/           Feature-scoped pages, sections, content, and domain data
|   +-- shared/             Shared UI, utilities, styles, analytics, and API helpers
+-- docs/                   Frontend documentation
+-- vite.config.ts          Vite configuration
+-- vercel.json             Vercel deployment configuration
```

## Routes

The app uses a lightweight client-side router instead of React Router. Main routes are defined through `src/app/router/AppRouter.tsx`, and shared route/content metadata lives in `src/features/content`.

- `/` - landing experience
- `/about` - about page
- `/story` - brand story page
- `/products` - product showcase
- Other configured navigation paths render through the generic site page

## Content And Branding

Most brand copy, navigation data, SEO metadata, commerce copy, and localized content lives in `src/features/content`. Shared brand exports are centralized in `src/features/content/brand.ts`, so update content data first when changing brand name, tagline, navigation, or footer links.

Static brand assets and product images live under `public/`. Imported Vite assets live in `src/assets`. Product data for product-facing features lives in `src/features/products/data/products.ts`.

## Deployment

This app is configured for Vercel from `apps/frontend/vercel.json`.

- Build command: `npm run build`
- Output directory: `dist`
- Recommended project root on Vercel: `apps/frontend`

For more detail, see:

- `docs/development.md`
- `docs/architecture.md`
- `docs/components.md`
- `docs/deployment.md`
