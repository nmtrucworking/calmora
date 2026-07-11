# Routes - Frontend

The app uses the in-house SPA router in `src/app/router/AppRouter.tsx`. This file is the source of truth for rendered pages.

## Primary Editorial Routes

| Path | Page |
| --- | --- |
| `/` | Landing page |
| `/about` | About page |
| `/story` | Story page |
| `/products` | Products index |
| `/products/classic` | Product detail |
| `/products/petal-pack` | Product detail |
| `/products/gift-set` | Product detail |
| `/ritual` | Standard ritual page |
| `/seasonal` | Standard seasonal page |
| `/contact` | Contact form |
| `/partners` | Partners form |
| `/thank-you` | Inquiry thank-you page |
| `/privacy` | Standard privacy page |
| `/terms` | Standard terms page |

## Reorder Route

| Path | Status |
| --- | --- |
| `/reorder` | Canonical reorder/preorder inquiry route |
| `/pre-order` | Backward-compatible alias |

All visible CTAs should use `/reorder`. Keep `/pre-order` only as a compatibility route unless product requirements change.

## Product Experience And Feedback

| Pattern | Page |
| --- | --- |
| `/experience/:productSlug` | QR/product experience page |
| `/feedback/:productSlug` | Product feedback form |
| `/q/:qrCode` | QR redirect lookup |

Valid product slugs are `classic`, `petal-pack`, and `gift-set`.

Current QR records live in `src/features/content/sitePages.ts`:

- `PP-2601-A` -> `/experience/petal-pack`
- `CL-2601-A` -> `/experience/classic`
- `GS-2601-A` -> `/experience/gift-set`

## Commerce Mock Routes

These routes are mock concierge/commerce surfaces. They do not perform real payment.

| Path | Page |
| --- | --- |
| `/collections` | Collections page |
| `/collections/signature` | Collection detail |
| `/collections/gifting` | Collection detail |
| `/collections/daily-ritual` | Collection detail |
| `/search` | Product search |
| `/wishlist` | Mock wishlist |
| `/bag` | Inquiry bag |
| `/checkout` | Concierge checkout/inquiry form |
| `/checkout/thank-you` | Checkout thank-you page |
| `/account` | Mock account overview |
| `/account/orders` | Mock inquiry history |
| `/account/wishlist` | Mock account wishlist |
| `/order-status` | Mock inquiry status |

## Service, Policy, And Journal Routes

Service and policy pages are keyed by content objects rather than explicit route branches.

Service routes from `src/features/content/commerceContent.ts`:

- `/gifting`
- `/corporate-gifting`
- `/concierge`
- `/private-tasting`

Policy routes from `src/features/content/commerceContent.ts`:

- `/shipping`
- `/returns`
- `/faq`
- `/care`

Journal routes:

- `/journal`
- `/journal/gift-language`
- `/journal/petal-ritual`
- `/journal/seasonal-lotus`

## SEO And Sitemap

- SEO metadata is in `src/features/content/sitePages.ts` and `src/features/content/i18n.ts`.
- Public sitemap is `public/sitemap.xml`.
- Canonical preorder path is `/reorder`.
