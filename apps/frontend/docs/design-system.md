# Design System - Frontend

Senova currently uses a quiet Vietnamese luxury visual system: dark forest surfaces, ivory paper tones, restrained gold accents, editorial typography, and product-forward imagery.

## Token Source

Design tokens live in `src/shared/styles/theme.css` and are exposed to Tailwind in `src/shared/styles/global.css`.

Core tokens:

- `--senova-ivory`, `--senova-paper`, `--senova-paper-muted`
- `--senova-forest`, `--senova-forest-deep`, `--senova-forest-black`
- `--senova-gold`, `--senova-gold-light`
- `--senova-bronze`, `--senova-bronze-deep`
- `--senova-tea-brown`, `--senova-lotus-dust`
- semantic aliases such as `--page-bg`, `--surface`, `--surface-dark`, `--text`, `--text-muted`, `--text-inverse`, `--primary`, `--accent`, and `--accent-gold`

Update `theme.css` first when changing brand color or spacing behavior. Avoid hardcoding new global colors inside route components unless the value is truly local.

## Typography

- Sans: `Be Vietnam Pro`, then system sans fallbacks.
- Display: `Noto Serif Display`, `Playfair Display`, and serif fallbacks.
- Landing and product heroes use display type with restrained weight.
- Compact panels, forms, and commerce mock surfaces should use smaller, scannable type.

## Layout

- Page max width is `--page-max`.
- Editorial sections use `EditorialSection` or `DarkSection`.
- Product and commerce routes use feature-owned grid layouts plus shared class helpers where useful.
- Avoid nesting cards inside cards. Use full-width sections or unframed grids for page composition.

## Buttons

Use `src/shared/components/luxury/LuxuryButton` for luxury/editorial CTAs.

Current variants:

- `primary` - dark forest CTA for light surfaces.
- `secondary` - elevated light CTA for secondary actions.
- `dark` - gold CTA for dark surfaces.
- `light` - glass/outline CTA for dark surfaces.

Shared button class strings also exist in:

- `src/shared/styles/systemPageClasses.ts`
- `src/features/products/productDetailClasses.ts`
- `src/shared/styles/luxuryEffects.ts`

Visible preorder/reorder CTAs should link to `/reorder`.

## Product Visuals

Primary product images live under `public/assets/products`:

- `classic-pack-optimized.jpg`
- `petal-pack-optimized.jpg`
- `gift-set-optimized.jpg`

Use real product imagery where possible. Landing/product pages should show the product or state being discussed, not abstract decoration.

## Motion

- Motion constants live in `src/shared/motion/animationSystem.ts`.
- Reusable class-based effects live in `src/shared/styles/luxuryEffects.ts`.
- Respect reduced motion; global reduced-motion handling is in `theme.css`.

## Accessibility And Responsiveness

- Keep buttons at least 44px tall.
- Ensure dark-section body text uses high enough contrast. `ProductStatement` has a dark-mode override for this.
- Mobile nav is controlled by `SiteLayout`.
- Test landing/product changes at desktop and around 390px mobile width when altering layout, type, or CTA sizing.

## Current Product Roles

- Classic - daily ritual / "giu" role.
- Petal Pack - signature experience / "mo" role.
- Gift Set - cultural gifting / "trao" role.

Copy is localized through content files. Product role labels may appear with Vietnamese accents in app UI; keep route slugs ASCII.
