# Senova QR Experience Actions

## Requirement Summary

- Add product-specific scan landing pages for Senova Classic, Senova Petal Pack and Senova Gift Set.
- Each scan page must include the right cultural story, brew or use guidance and a lightweight QR follow-up form.
- QR follow-up must capture SKU or lot, source, content viewed, sensory feedback, acceptable price range, purchase intent or purpose and opt-in consent.
- Keep the experience consistent with the existing Calmora/Senova visual system and prioritize mobile usability.
- Use existing repository content as the source of truth because `Calmora_Senova-thuyet_minh_vong_2.pdf` was not available in the workspace.

## Implemented Routes

- `/q/CL-2601-A` resolves to `/experience/classic?batch=CL-2601-A&source=qr&content=classic-scan`.
- `/q/PP-2601-A` resolves to `/experience/petal-pack?batch=PP-2601-A&source=qr&content=petal-pack-scan`.
- `/q/GS-2601-A` resolves to `/experience/gift-set?batch=GS-2601-A&source=qr&content=gift-set-scan`.
- `/experience/classic`, `/experience/petal-pack` and `/experience/gift-set` now act as scan landing pages.
- `/feedback/:productSlug` uses the same QR follow-up form as the inline scan pages.

## Content And UX Actions

- Added `apps/frontend/src/content/qrExperience.ts` as the reusable content layer keyed by product slug.
- Used existing Senova content themes:
  - Classic: "Giữ một khoảng lặng mỗi ngày."
  - Petal Pack: "Mở một cánh sen, bắt đầu một khoảng lặng."
  - Gift Set: "Một món quà có câu chuyện."
- Rebuilt the scan page structure around product hero, SKU/source badges, cultural story, guidance steps, inline feedback and product highlights.
- Kept layout mobile-first with single-column sections that expand into existing Calmora/Senova panel grids on larger screens.

## Follow-Up Fields Captured

- `skuOrLot`
- `source`
- `contentViewed`
- `sensoryFeedback`
- `acceptablePriceRange`
- `purchaseIntentPurpose`
- `optInConsent`
- Optional `name` and `email`
- Compatibility fields `productSlug` and `batchCode`

## Technical Actions

- Added reusable `QrFeedbackForm` in `apps/frontend/src/features/forms/QrFeedbackForm.tsx`.
- Updated `/q/:code` redirect behavior to include `batch`, `source` and `content` query params.
- Updated QR, experience and feedback analytics events to include `source` and `contentViewed`.
- Added SEO entries for the three scan landing pages.
- Kept storage behavior in the existing frontend-local `submitForm("feedback", payload)` flow; no backend API was added.

## Verification

- Completed build command: `npm run build` from `apps/frontend`.
- Build result: passed.
- Browser smoke test results:
  - `/q/CL-2601-A` redirects to Classic scan page with `batch=CL-2601-A`, `source=qr`, `content=classic-scan` and the required form fields.
  - `/q/PP-2601-A` redirects to Petal Pack scan page with `batch=PP-2601-A`, `source=qr`, `content=petal-pack-scan` and the required form fields.
  - `/q/GS-2601-A` redirects to Gift Set scan page with `batch=GS-2601-A`, `source=qr`, `content=gift-set-scan` and the required form fields.
  - `/q/PP-2509-X` shows the inactive QR fallback.
  - `/q/UNKNOWN` shows the unknown QR fallback.
  - Mobile viewport check at 390 px showed no horizontal overflow on tested routes.
- Manual routes worth rechecking during visual QA:
  - `/q/CL-2601-A`
  - `/q/PP-2601-A`
  - `/q/GS-2601-A`
  - `/q/PP-2509-X`
  - `/q/UNKNOWN`
- Form validation should block empty required QR follow-up fields and store the full payload in `localStorage` under `senova.form.submissions` after submit.
