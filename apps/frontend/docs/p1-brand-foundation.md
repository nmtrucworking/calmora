# P1 brand foundation

## Brand architecture

The public website uses one lockup:

```text
SENOVA
by Calmora
```

Senova is the primary product brand. Calmora is the endorsing organization. The former `CALMORA | SENOVA` lockup must not be reintroduced in public UI or SEO metadata.

Minimum digital size is 128 px wide for the complete lockup. Clear space is at least the width of the Calmora mark on every side. The mark may be used alone only where the surrounding context already names Senova, such as a favicon.

## BRAND-COLOR-DECISION-001

- Digital master forest: `--senova-forest-800` (`#1d3329`).
- Deep digital surface: `--senova-forest-900` (`#0b1a15`).
- Paper master: `--senova-paper-100` (`#f3efe5`).
- Digital bronze accent: `--senova-bronze-600` (`#8a6825`).
- Screen gold is a digital approximation only; it is not evidence of metallic foil or print equivalence.
- Print and packaging values remain subject to physical proofing. Do not derive them directly from HEX values.

Public UI colors must use semantic tokens. Run `npm run lint:colors` before release. The 3D lotus scene and admin workspace are explicitly separate color scopes.

## Typography and spacing

- Display: Noto Serif Display with Playfair Display/Georgia fallback.
- Body and controls: Be Vietnam Pro with Inter/system fallback.
- Root font size remains 100%; mobile body copy is never below 16 px.
- Containers, gutters, spacing, radii, shadows, motion and z-index values are sourced from `src/shared/styles/tokens`.
