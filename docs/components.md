# Components - Frontend

Shared components
- `src/shared/components/branding/BrandMark` - small brand mark used in headers and footers.
- `src/app/layout/SiteLayout` - site-level frame with header, content area, footer, and ambient sound control.
- `src/shared/components/ui/SectionHeading` - eyebrow, title, and description block used as a section heading.
- `src/shared/components/ui/InfoCard` - compact informative card used across route pages.
- `src/shared/components/luxury` - reusable editorial, button, image reveal, divider, and statement primitives for the luxury visual system.
- `src/shared/components/story/StoryLotusCanvas` - wrapper that reuses the landing 3D lotus scene for the story page.

Guidelines
- Put reusable UI in `src/shared/components`; put route-specific UI next to its feature under `src/features/<feature>`.
- Avoid modifying `src/features/landing/three` unless the model itself must change.
- Keep global tokens and reusable motion/style helpers in `src/shared/styles`.
- Component CSS modules should stay beside their component and only handle local layout or composition.
