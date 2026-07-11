# Content And Data - Frontend

The current app does not load Markdown route drafts at build time. Content lives in TypeScript and JSON files under `src/features`.

## Main Content Sources

- `src/features/content/luxuryCopy.ts` - layout navigation/footer copy, landing copy, luxury product copy, and ordered product IDs.
- `src/features/products/data/products.ts` - base product model for Classic, Petal Pack, and Gift Set.
- `src/features/content/i18n.ts` - localized product, commerce, account, journal, policy, and service copy.
- `src/features/content/sitePages.ts` - SEO metadata, standard page content, thank-you messages, and QR records.
- `src/features/content/qrExperience.ts` - product-specific QR experience copy.
- `src/features/content/commerceContent.ts` - collections, service pages, policy pages, journal posts, and mock account/order data.
- `src/features/content/content.json` - legacy/static copy still used by some older pages.
- `src/features/content/brand.ts` - brand/footer typing and content helpers.

## Product Model

Products are keyed by `ProductId`:

- `classic`
- `petal-pack`
- `gift-set`

Each product includes:

- route slug and image
- role and status
- price/availability labels
- primary and secondary actions
- variants and included items
- brewing notes, gift options, and experience steps
- SEO metadata

Product links should use:

- `/products/classic`
- `/products/petal-pack`
- `/products/gift-set`
- `/reorder?product=<productId>` for reorder/preorder inquiry CTAs

## Forms And Submission Flow

Forms use `src/shared/api/submissions.ts`. The current flow is mock/validation-oriented, not real commerce.

Common form surfaces:

- `/reorder`
- `/contact`
- `/partners`
- `/feedback/:productSlug`
- `/checkout`

Thank-you behavior and copy are defined in `src/features/content/sitePages.ts` and page-level form handlers.

## QR Data

QR records are currently static in `src/features/content/sitePages.ts`.

Use `/q/:code` for QR redirect testing. The redirect page looks up the code and sends users to the product experience route with query metadata.

When adding a QR code, update:

1. `qrRecords` in `sitePages.ts`.
2. `pageSeo` if a new canonical experience path is added.
3. `docs/routes.md` if the route pattern changes.

## SEO

- Canonical base URL is `https://senova.vn`.
- Metadata is applied client-side in `AppRouter.tsx`.
- Keep `pageSeo`, commerce SEO in `i18n.ts`, and `public/sitemap.xml` aligned.

## Deprecated Source Pattern

Do not add new route Markdown drafts under `docs`. That folder is documentation only. If copy needs to ship in the app, place it in the TypeScript/JSON content files listed above.
