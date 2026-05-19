# Components — Frontend

Shared components
- `src/components/branding/BrandMark` — small brand mark used in headers and footers.
- `src/components/layout/SiteFrame` — site-level frame: header, content column, footer.
- `src/components/ui/SectionHeading` — eyebrow / title / description block used as section hero.
- `src/components/ui/InfoCard` — compact informative card used across site pages.
- `src/components/story/StoryLotusCanvas` — wrapper to reuse the 3D lotus scene for the `StoryPage` with an autoplay cycle. It accepts `restartSignal?: number` to trigger a replay when the prop increments.

Guidelines
- Avoid modifying `src/features/landing/three` unless you must change the model itself; prefer wrapping or controlling it via supplied refs.
- Keep styles in `src/styles/theme.css` for global tokens; component modules should only add layout and compositional styles.
