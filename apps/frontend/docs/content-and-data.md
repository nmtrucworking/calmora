# Content And Data - Frontend

The current app does not load Markdown route drafts at build time. Content lives in TypeScript and JSON files under `src/features`.

## Main Content Sources

- `src/features/content/luxuryCopy.ts` - layout navigation/footer copy, landing copy, luxury product copy, and ordered product IDs.
- `src/features/products/data/products.ts` - development fallback and TypeScript product contract for Classic, Petal Pack, and Gift Set.
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

Forms use `src/shared/api/submissions.ts`. Khi `VITE_API_BASE_URL` được cấu hình, form gọi backend thật với idempotency key ổn định; checkout gửi `items[]` gồm product, variant và quantity. Local persistence chỉ dùng khi chưa cấu hình API.

Common form surfaces:

- `/reorder`
- `/contact`
- `/partners`
- `/feedback/:productSlug`
- `/checkout`

Thank-you behavior and copy are defined in `src/features/content/sitePages.ts` and page-level form handlers.

## QR Data

PostgreSQL/API là nguồn runtime cho QR resolve, experience content và batch override. Version mặc định sau cutover là `fe-cutover-2026-07`. Fixture TypeScript chỉ được dùng bởi Vite local development khi không có `VITE_API_BASE_URL`; production/staging không fallback khi thiếu cấu hình hoặc backend trả lỗi.

Trang `/admin/qr-content` quản lý draft/publish cho locale `vi` và `en`, clone version đã publish và batch override. Published content là bất biến.

## Runtime Catalog

`ProductCatalogProvider` tải `/api/products` để giữ compatibility với Gift Set draft hiện tại. Loading và API error không bị che bằng dữ liệu local; fallback chỉ bật trong Vite local development khi không có `VITE_API_BASE_URL`. `/api/v1/products` là contract publish-only cho cutover sau khi Gift Set được publish.

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
