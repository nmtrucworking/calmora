# Components - Frontend

## Shared Components

- `src/app/layout/SiteLayout` - site frame, header, mobile nav, footer, language toggle, reorder CTA, and ambient sound button.
- `src/shared/components/branding/BrandMark` - Calmora/Senova mark used by layout.
- `src/shared/components/luxury/LuxuryButton` - primary CTA primitive for luxury editorial surfaces.
- `src/shared/components/luxury/ProductStatement` - eyebrow/title/body block used by landing and dark editorial sections.
- `src/shared/components/luxury/DarkSection` and `EditorialSection` - section wrappers for constrained editorial layouts.
- `src/shared/components/luxury/ImageReveal` - image wrapper with reveal treatment.
- `src/shared/components/luxury/RitualStep`, `LuxuryDivider`, and `SectionEyebrow` - small editorial primitives.
- `src/shared/components/ui/SectionHeading` and `InfoCard` - compact primitives for standard pages.
- `src/shared/components/story/StoryLotusCanvas` - story-page wrapper around the landing lotus scene.
- `src/shared/components/ui/CustomCursor` - optional cursor enhancement.
- `src/features/landing/sections/AmbientSoundButton` - layout-mounted sound toggle.

## Route-Specific Components

- Landing sections live under `src/features/landing/sections`.
- Product page components live under `src/features/products/pages`.
- Commerce mock surfaces are exported from `src/features/commerce/pages/index.tsx`.
- Inquiry pages live under `src/features/inquiry/pages`.
- QR pages and feedback form live under `src/features/qr`.

## Guidelines

- Keep reusable UI in `src/shared/components`; keep page composition inside `src/features/<feature>`.
- Prefer `LuxuryButton` for visible editorial CTAs on landing/product flows.
- For dense commerce mock UI, use local classes or shared class strings where already established.
- Avoid editing `src/features/landing/three` unless changing the 3D model or scene behavior.
- Component CSS modules should stay local to the component; app-wide tokens belong in `src/shared/styles/theme.css`.
