# P1 release checklist

Kết quả gần nhất: 2026-07-21, nhánh `codex/senova-p1-luxury-ui`.

## Automated gates

- [x] `npm run lint`
- [x] `npm run lint:colors`
- [x] `npm run test` — 6 test files, 23 tests passed.
- [x] `npm run build`
- [x] Public sitemap không chứa route commerce mock.
- [x] Product media có kích thước, WebP source, alt text và lifecycle status.
- [x] Navigation, footer và campaign CTA chỉ trỏ tới route có trong sitemap.

## Device matrix

- [x] 360 × 800: homepage và mobile drawer.
- [x] 390 × 844: product detail, sticky action và order request.
- [x] 430 × 932: QR ritual, feedback, gifting và footer.
- [x] 768 × 1024: products grid.
- [x] 1440 × 900: homepage và Story 3D.

## Keyboard and accessibility

- [x] Có skip link tới `#main-content`.
- [x] Drawer nhận focus, trap Tab/Shift+Tab, đóng bằng Escape và trả focus về menu button.
- [x] Form control có label; lỗi có text và vùng thông báo phù hợp.
- [x] Focus ring hiển thị trên light/dark surfaces.
- [x] Reduced motion có static image fallback và tắt decorative transitions.
- [x] Locale switch cập nhật `lang` của document.

## Functional regression

- [x] Product → order request truyền product, variant, quantity, intent và source.
- [x] Catalog dev fallback giữ route sản phẩm hoạt động khi API local tạm ngắt.
- [x] QR API network fallback dùng nội dung biên tập cục bộ trong development; lỗi nghiệp vụ 4xx không bị che.
- [x] QR → ritual → timer → feedback hoạt động bằng keyboard/semantic controls.
- [x] `/bag`, `/checkout`, `/reorder` và `/pre-order` redirect tới `/order-request`.
- [x] Story 3D tải hoàn tất mà không phụ thuộc environment asset bên ngoài.
- [x] Analytics là best-effort và không tạo unhandled rejection khi endpoint không khả dụng.

## Visual regression baseline

Baseline được lưu trong `docs/visual-baseline/`:

- `home-desktop-1440.png`
- `home-mobile-360.png`
- `products-tablet-768.png`
- `product-petal-mobile-390.png`
- `order-request-mobile-390.png`
- `qr-petal-mobile-430.png`
- `gifting-mobile-430.png`
- `story-desktop-1440.png`

## Performance evidence

- Initial application chunk: 136.58 kB gzip, dưới ngân sách P1 300 kB gzip.
- CSS chính: 14.32 kB gzip.
- Story 3D: 229.61 kB gzip, tách riêng theo route và không tải trong homepage/product funnel.
- Hero ưu tiên tải; ảnh dưới fold lazy-load; responsive WebP có width/height.

## Recorded exception / external validation

- `VD-3D-001`: Story 3D vẫn vượt cảnh báo mặc định 500 kB raw (854.71 kB), nhưng là optional route-level chunk, có reduced-motion fallback và không nằm trong initial funnel bundle.
- Lighthouse staging và kiểm tra thiết bị thật iOS/Android cần chạy lại sau khi có URL staging và device lab. Đây là gate vận hành bên ngoài repository, không phải lỗi code còn mở.
