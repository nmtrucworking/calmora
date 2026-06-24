---
document: "repo-content-map"
visibility: "internal-only"
repository: "nmtrucworking/calmora"
defaultBranch: "main"
version: "1.0"
updated: "2026-06-24"
---

# Bản đồ tích hợp nội dung vào repository `calmora`

## 1. Kiến trúc hiện tại

Repository là ứng dụng React + TypeScript + Vite. Nội dung hiện được phân tán ở ba lớp:

1. `src/data/content.json`: thương hiệu, landing, route metadata, story và about.
2. `src/features/products/data/products.ts`: dữ liệu ba sản phẩm và trang chi tiết.
3. Các component trong `src/features/products/components/`: nhiều đoạn copy đang hardcode.

Markdown trong bộ này chưa được ứng dụng tự động đọc. Cần đồng bộ thủ công hoặc bổ sung content loader.

## 2. Ánh xạ route

| Route | Markdown nguồn | Vị trí hiện tại trong repo |
|---|---|---|
| `/` | `routes/home.md` | `src/data/content.json > landing`; `SenovaLandingPage` |
| `/about` | `routes/about.md` | `src/data/content.json > aboutPage`; `AboutPage` |
| `/story` | `routes/story.md` | `src/data/content.json > storyPage`; `StoryPage` |
| `/products` | `routes/products/index.md` | `ProductsPage` và sáu component sản phẩm |
| `/products/classic` | `routes/products/classic.md` | `products.ts`; `ProductDetailPage` |
| `/products/petal-pack` | `routes/products/petal-pack.md` | `products.ts`; `ProductDetailPage` |
| `/products/gift-set` | `routes/products/gift-set.md` | `products.ts`; `ProductDetailPage` |
| `/ritual` | `routes/ritual.md` | `content.json > routes["/ritual"]`; hiện dùng `SitePage` |
| `/seasonal` | `routes/seasonal.md` | `content.json > routes["/seasonal"]`; hiện dùng `SitePage` |
| QR Classic | `routes/qr/classic.md` | Chưa có page riêng |
| QR Petal Pack | `routes/qr/petal-pack.md` | CTA đã trỏ đến `/trai-nghiem/petal-pack/mo-canh-sen` |
| QR Gift Set | `routes/qr/gift-set.md` | Chưa có page riêng |

## 3. Ánh xạ `content.json`

### `brand`

Dùng `brand/core.md` cho:

- `brand.name`
- `brand.tagline`
- `brand.summary`
- `brand.footerTagline`
- navigation label và footer copy.

Đề xuất thay:

```text
brand.tagline = "Mở một cánh sen. Giữ một khoảng lặng. Trao một câu chuyện Việt."
brand.summary = "Senova là dự án trà sen trải nghiệm do Calmora phát triển."
```

### `landing`

Dùng các trường frontmatter và section trong `routes/home.md`:

- `hero.eyebrow`
- `hero.title`
- `hero.description`
- `chapters`: đổi nội dung từ Búp — Nở — Tàn sang Giữ — Mở — Trao, hoặc giữ hoạt cảnh vòng đời sen nhưng tách nó khỏi trục nội dung thương hiệu.
- `cta`: dùng khối “Câu chuyện không kết thúc khi tách trà cạn”.

### `storyPage`

Trang hiện tại kể chủ yếu về hoạt cảnh búp — nở — tàn. Thay phần copy bằng `routes/story.md`. Hoạt cảnh 3D có thể giữ như yếu tố thị giác, nhưng không được xem là nội dung văn hóa chính thức.

### `aboutPage`

Thay nội dung công nghệ chưa có căn cứ bằng `routes/about.md`. Có thể giữ cấu trúc hero, mission, cards, ritual và CTA, nhưng đổi cards thành:

1. **Giữ:** trà hương sen trong đời sống.
2. **Mở:** trải nghiệm bằng giác quan.
3. **Trao:** món quà có câu chuyện.

## 4. Ánh xạ `products.ts`

Frontmatter của mỗi file sản phẩm khớp với các trường:

- `id`
- `slug`
- `name`
- `role`
- `eyebrow`
- `tagline`
- `description`
- `shortDescription`
- `image`
- `status`
- `primaryCta`
- `secondaryCta`
- `heroAlt`

Các mục “Điểm nổi bật”, “Phù hợp cho” và “Hành trình sử dụng” ánh xạ vào:

- `highlights`
- `suitableFor`
- `experienceSteps`

Gift Set tiếp tục giữ `status: "draft"` cho đến khi sản phẩm và cấu phần thực tế được chốt.

## 5. Các component có copy hardcode

| Component | Nội dung nguồn thay thế |
|---|---|
| `ProductHeroStage.tsx` | Hero trong `routes/products/index.md` |
| `LotusOrbitNav.tsx` | Dữ liệu ngắn của ba file sản phẩm |
| `PetalPackReveal.tsx` | Section 03 và `routes/products/petal-pack.md` |
| `ClassicRitualScene.tsx` | Section 04 và `routes/products/classic.md` |
| `GiftSetExplodedView.tsx` | Section 05 và `routes/products/gift-set.md` |
| `ProductJourney.tsx` | Section 06 trong `routes/products/index.md` |
| `ProductDetailPage.tsx` | Dữ liệu trong từng file sản phẩm |
| `SitePage.tsx` | Chỉ phù hợp cho placeholder; cần page riêng cho Ritual, Seasonal và QR |

## 6. Đề xuất schema nội dung

Khi chuyển sang Markdown-driven, mỗi route nên có:

```yaml
route: "/products/petal-pack"
slug: "petal-pack"
status: "active"
title: "Senova Petal Pack"
metaTitle: "..."
metaDescription: "..."
primaryCta:
  label: "..."
  href: "..."
```

Phần body dùng heading ổn định:

```text
H1
H2 Vai trò
H2 Điểm nổi bật
H2 Phù hợp cho
H2 Hành trình sử dụng
H2 Câu chuyện ngắn
```

## 7. Thứ tự triển khai đề xuất

1. Cập nhật `content.json` cho brand, landing, about và story.
2. Cập nhật `products.ts` từ ba file sản phẩm.
3. Loại bỏ copy hardcode không có căn cứ trong năm component sản phẩm.
4. Tạo page riêng cho `/ritual`.
5. Tạo ba page QR và cơ chế `/q/[code]` chuyển hướng đúng SKU.
6. Bổ sung metadata và structured data.
7. Chạy kiểm tra responsive, link, mobile QR và accessibility.
