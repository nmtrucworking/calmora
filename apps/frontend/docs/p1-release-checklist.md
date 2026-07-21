# P1 release checklist

## Automated gates

- `npm run lint`
- `npm run lint:colors`
- `npm run test`
- `npm run build`
- Public sitemap contains no mock commerce routes.
- Product media has dimensions, WebP sources, alt text and lifecycle status.

## Device matrix

- 360 × 800: homepage, product detail, order request.
- 390 × 844: product detail sticky action, QR ritual and feedback.
- 430 × 932: mobile drawer, gifting and footer.
- 768 × 1024: products grid and order request.
- 1440 × 900: homepage, products, product detail and story.

## Keyboard and accessibility

- Skip link moves focus to `#main-content`.
- Drawer receives focus, traps Tab/Shift+Tab, closes on Escape and restores focus to the menu button.
- Every form control has a visible label; errors include text and are announced.
- Focus ring is visible on light and dark surfaces.
- Reduced motion removes decorative transforms and long transitions.
- Locale switch updates the document `lang` attribute.

## Functional regression

- Product → order request carries product, variant, quantity, intent and source.
- `/bag`, `/checkout`, `/reorder` and `/pre-order` redirect to `/order-request`.
- QR → ritual → feedback remains unchanged.
- Feedback and successful order requests end on their canonical confirmation route.

## Known visual debt

- `VD-3D-001`: Story 3D is an optional, route-level enhancement. Its raw chunk exceeds the generic 500 kB warning, but it is not loaded by the homepage or product funnel. Preserve the static/reduced-motion fallback and reassess compression when the production 3D asset is frozen.
- Final device screenshots and Lighthouse evidence must be captured again in staging when the in-app browser or physical-device lab is available.
