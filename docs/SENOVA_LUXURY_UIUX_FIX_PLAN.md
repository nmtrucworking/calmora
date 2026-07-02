# SENOVA LUXURY UI/UX FIX PLAN

**Repository:** `nmtrucworking/calmora`  
**Project:** Calmora | Senova  
**Objective:** Chuyển website từ phong cách editorial pastel/lifestyle sang **Quiet Vietnamese Luxury** — trầm, tinh, có chiều sâu vật liệu và lấy Senova Petal Pack làm trung tâm.

---

## 1. Mục tiêu cải tiến

Website sau khi chỉnh sửa phải đạt các yêu cầu sau:

1. Thể hiện rõ định vị **accessible luxury** thay vì chỉ mang phong cách đẹp, mềm mại hoặc hiện đại.
2. Đưa **Senova Petal Pack** trở thành sản phẩm nhận diện chính trên trang chủ.
3. Giảm mật độ hiệu ứng, card, blur và điều khiển trong giao diện.
4. Tăng cảm giác cao cấp thông qua:
   - khoảng trắng;
   - nhịp bố cục;
   - chất liệu;
   - ảnh sản phẩm;
   - typography;
   - chuyển động tiết chế.
5. Duy trì yếu tố bản địa Việt Nam nhưng tránh sử dụng họa tiết văn hóa theo hướng trang trí đại trà.
6. Bảo đảm website vẫn dễ sử dụng, dễ đọc, dễ mở rộng và thân thiện trên thiết bị di động.

---

## 2. Vấn đề hiện tại cần xử lý

### 2.1. Màu sắc chưa đủ chiều sâu

Hiện tại giao diện sử dụng nhiều nền vàng nhạt, gradient hồng–xanh và accent hồng đậm. Cấu trúc này tạo cảm giác:

- nhẹ nhàng;
- lifestyle;
- organic;
- gần gũi;

nhưng chưa tạo được cảm giác:

- sang trọng;
- trầm;
- tinh;
- có chất liệu;
- có tính nghi thức.

### 2.2. Header quá nhiều điều khiển

Header hiện đồng thời hiển thị:

- logo;
- menu;
- âm thanh;
- giỏ hàng;
- đổi ngôn ngữ;
- menu mobile.

Điều này làm giảm tính tối giản và khiến website giống một ứng dụng thương mại hơn là một thương hiệu trà cao cấp.

### 2.3. Hero chưa làm nổi bật sản phẩm

Hero hiện ưu tiên không gian trình diễn và mô hình 3D. Sản phẩm Petal Pack chưa xuất hiện đủ mạnh trong vùng nhìn đầu tiên.

### 2.4. Landing page kéo dài nhưng thiếu thay đổi thị giác

Các section gần toàn màn hình và luân phiên vị trí trái–phải, nhưng chưa có đủ thay đổi về:

- nhịp;
- chất liệu;
- ảnh;
- cấu trúc nội dung;
- điểm nhấn sản phẩm.

### 2.5. Glassmorphism và bo tròn tạo cảm giác SaaS/lifestyle

Các nút, card, nền mờ, pill và shadow hiện tại chưa phù hợp với định vị luxury editorial.

### 2.6. Trải nghiệm chưa phân cấp đúng hệ sản phẩm

Petal Pack là sản phẩm chủ đạo nhưng chưa được ưu tiên rõ về:

- diện tích thị giác;
- vị trí trong trang;
- nội dung kể chuyện;
- CTA;
- ảnh sản phẩm;
- chuyển động.

### 2.7. Luxury đang được diễn đạt bằng hiệu ứng thay vì chất lượng hình ảnh

Nếu không có bộ ảnh sản phẩm đồng nhất, việc tăng màu đen, vàng hoặc hiệu ứng chỉ tạo cảm giác “giả cao cấp”.

---

## 3. Định hướng thiết kế mới

## 3.1. Tên định hướng

> **Quiet Vietnamese Luxury**

Ba nguyên tắc:

- **Tĩnh:** giảm hiệu ứng không cần thiết.
- **Trầm:** sử dụng màu sâu, ánh sáng có chủ đích.
- **Tinh:** ưu tiên chi tiết vật liệu và typography chính xác.

## 3.2. Từ khóa thị giác

- Vietnamese tea ritual
- premium lotus tea
- quiet luxury
- editorial product storytelling
- dark botanical
- aged gold
- handmade paper
- natural texture
- refined minimalism
- cultural gifting

## 3.3. Những điều cần tránh

- nền đen toàn bộ website;
- dùng vàng kim quá nhiều;
- họa tiết sen dày đặc;
- hiệu ứng quay liên tục;
- bo tròn mọi thành phần;
- card grid kiểu thương mại điện tử phổ thông;
- typography quá đậm;
- gradient màu hồng–xanh diện rộng;
- glassmorphism trên toàn trang;
- animation chỉ để gây chú ý.

---

## 4. Design tokens mới

## 4.1. Color system

```css
:root {
  --senova-ivory: #F3EFE5;
  --senova-ivory-muted: #E4DDCF;

  --senova-forest: #384B44;
  --senova-forest-deep: #172721;
  --senova-forest-black: #101A16;

  --senova-gold: #AF9558;
  --senova-gold-light: #C8B178;

  --senova-tea-brown: #765846;
  --senova-lotus-dust: #B88A8E;

  --senova-ink: #18211D;
  --senova-ink-muted: rgba(24, 33, 29, 0.72);
  --senova-ink-soft: rgba(24, 33, 29, 0.48);

  --senova-white: #FFFCF6;
  --senova-border: rgba(56, 75, 68, 0.16);
  --senova-border-strong: rgba(56, 75, 68, 0.34);
}
```

## 4.2. Tỷ lệ sử dụng màu

- Ivory và nền giấy: **55–60%**
- Xanh trầm: **30–35%**
- Vàng đồng: **5–8%**
- Hồng sen: chỉ dùng như điểm nhấn nhỏ hoặc xuất hiện trong ảnh

## 4.3. Surface

```css
--surface-light: #F8F4EB;
--surface-dark: #172721;
--surface-dark-soft: #1E3029;
--surface-paper: rgba(243, 239, 229, 0.92);
```

Không sử dụng nền trắng trong suốt trên mọi card. Chỉ dùng transparency khi có lý do cụ thể.

## 4.4. Border radius

```css
--radius-xs: 2px;
--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 18px;
```

Không dùng `rounded-full` cho mọi CTA. Chỉ dùng pill cho nhãn nhỏ hoặc bộ lọc.

## 4.5. Shadow

```css
--shadow-soft: 0 16px 40px rgba(16, 26, 22, 0.10);
--shadow-product: 0 30px 90px rgba(16, 26, 22, 0.16);
--shadow-dark: 0 28px 80px rgba(0, 0, 0, 0.28);
```

Shadow phải nhẹ, rộng và ít tương phản.

---

## 5. Typography system

## 5.1. Font

- Display: `Bodoni Moda` hoặc `Noto Serif Display`
- Body/UI: `Be Vietnam Pro`

Không sử dụng quá hai họ chữ trên website.

## 5.2. Typographic hierarchy

```css
--text-hero: clamp(4.5rem, 8vw, 7rem);
--text-display: clamp(3rem, 6vw, 5rem);
--text-heading: clamp(2rem, 4vw, 3.5rem);
--text-subheading: clamp(1.4rem, 2.5vw, 2rem);
--text-body-lg: 1.125rem;
--text-body: 1rem;
--text-meta: 0.78rem;
```

## 5.3. Quy tắc chữ

- Hero title: weight `400–500`
- Heading: weight `450–550`
- Body: weight `400–500`
- Eyebrow: uppercase, tracking `0.22em–0.28em`
- Line-height:
  - heading: `0.95–1.1`
  - body: `1.65–1.8`

Không dùng tiêu đề quá đậm hoặc quá nhiều chữ in hoa.

---

## 6. Kiến trúc trang chủ mới

## 6.1. Section 01 — Hero

### Mục tiêu

Ngay trong 3 giây đầu, người xem phải nhận biết:

- đây là thương hiệu trà sen;
- Petal Pack là sản phẩm chủ đạo;
- thương hiệu theo định hướng cao cấp;
- website có yếu tố văn hóa nhưng không cũ.

### Bố cục

- Ảnh/video Petal Pack chiếm toàn màn hình.
- Nội dung đặt lệch trái hoặc dưới trái.
- Logo nhỏ, không cạnh tranh với sản phẩm.
- Tối đa hai CTA.

### Copy đề xuất

```text
SENOVA PETAL PACK

Một búp sen.
Một lần pha.
Một nghi thức.

Khám phá Petal Pack
Xem nghi thức pha
```

### Yêu cầu kỹ thuật

- Thay vùng trống 3D bằng ảnh/video sản phẩm thật.
- Giữ 3D chỉ khi mô hình có chất lượng cao và không làm giảm FPS.
- Không để animation chạy liên tục nếu không có tương tác.

---

## 6.2. Section 02 — Signature Product

### Mục tiêu

Khẳng định Petal Pack là biểu tượng của Senova.

### Bố cục

- 60% ảnh macro sản phẩm.
- 40% nội dung.
- Không dùng card.
- Nền ivory hoặc xanh sâu.

### Nội dung

```text
SENOVA PETAL PACK

Một phần trà định lượng cho một lần pha,
được bao quanh bởi cánh sen thật tạo hình búp sen.

Tách nhẹ.
Cảm nhận hương.
Pha cùng cánh sen.
Thưởng thức.
```

---

## 6.3. Section 03 — Tea Ritual

### Mục tiêu

Biến trải nghiệm sử dụng thành câu chuyện thị giác.

### Cấu trúc

```text
01. Tách nhẹ cánh sen
02. Chạm hương
03. Pha cùng cánh sen
04. Thưởng thức
```

### UI

- 4 khung ảnh lớn.
- Dùng crossfade hoặc scroll reveal.
- Không dùng card nhỏ.
- Không dùng carousel ngang bắt buộc trên desktop.
- Trên mobile hiển thị theo chiều dọc.

---

## 6.4. Section 04 — Senova Collection

### Sản phẩm

1. Petal Pack — Signature
2. Classic — Daily Ritual
3. Gift Set — Cultural Gifting

### Quy tắc phân cấp

- Petal Pack chiếm diện tích lớn nhất.
- Classic và Gift Set nhỏ hơn.
- Không chia đều ba cột như catalogue thông thường.
- Mỗi sản phẩm có:
  - ảnh;
  - vai trò;
  - câu mô tả ngắn;
  - CTA riêng.

---

## 6.5. Section 05 — Cultural Material

### Mục tiêu

Kết nối sản phẩm với văn hóa sen Việt bằng dữ liệu và chi tiết cụ thể.

### Nội dung nên có

- ý nghĩa của sen trong đời sống Việt;
- nghi thức thưởng trà;
- nguồn nguyên liệu dự kiến;
- kỹ thuật tạo hình cánh sen;
- lý do thiết kế Petal Pack;
- vai trò của QR trong câu chuyện sản phẩm.

### Điều cần tránh

- đoạn văn lịch sử dài;
- biểu tượng sen chung chung;
- tuyên bố văn hóa không có cơ sở;
- lặp lại các cụm “thanh khiết”, “tinh tế”, “bản địa” quá nhiều.

---

## 6.6. Section 06 — Gift Experience

### Nền

Xanh sâu hoặc xanh đen.

### Hình ảnh

- mở hộp;
- giấy;
- gỗ;
- gốm;
- thẻ câu chuyện;
- Petal Pack đặt trong set quà.

### CTA

```text
Khám phá Senova Gift Set
Trao đổi đơn quà tặng
```

---

## 6.7. Section 07 — Final CTA

### Copy đề xuất

```text
Sen trà giao hòa,
chuyện Việt ngân nga.

Khám phá bộ sưu tập
Đặt trước
```

Nền tối, ít chữ, không thêm nhiều hiệu ứng.

---

## 7. Header mới

## 7.1. Desktop structure

```text
Logo | Câu chuyện | Bộ sưu tập | Trải nghiệm | Văn hóa | Đặt trước
```

## 7.2. Quy tắc

- Header trong suốt trên hero.
- Khi scroll:
  - nền ivory hoặc forest;
  - chiều cao giảm;
  - border-bottom nhẹ.
- Ẩn nút âm thanh khỏi header.
- Giỏ hàng đổi thành biểu tượng nhỏ hoặc CTA “Đặt trước”.
- Ngôn ngữ hiển thị `VI / EN`.
- Không dùng nhiều nút tròn cạnh nhau.

---

## 8. Footer mới

### Cấu trúc

```text
CALMORA | SENOVA

Bộ sưu tập
Câu chuyện
Trải nghiệm
Liên hệ

Email
Mạng xã hội
Bản quyền
```

### Yêu cầu

- Nền forest deep.
- Chữ ivory.
- Gold chỉ dùng cho tiêu đề nhóm.
- Loại bỏ footer dạng nhiều nhóm link dày đặc nếu chưa cần thiết.

---

## 9. Motion system

## 9.1. Cho phép

- fade;
- image reveal;
- mask reveal;
- crossfade;
- parallax nhẹ;
- scale `0.98 → 1`;
- chuyển động 700–1200 ms.

## 9.2. Không sử dụng hoặc giảm mạnh

- vật thể quay liên tục;
- orbit navigation;
- hover nâng card;
- blur lặp lại ở mọi section;
- animation quá nhanh;
- animation chạy đồng thời ở nhiều lớp;
- chuyển động không phục vụ kể chuyện.

## 9.3. Reduced motion

Bắt buộc hỗ trợ:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 10. Responsive rules

## 10.1. Desktop

- Max content width: `1280–1360px`
- Grid 12 cột
- Gutter: `24–32px`
- Section spacing: `120–180px`

## 10.2. Tablet

- Grid 8 cột
- Giảm hero title
- Chuyển một số section 2 cột thành 1 cột

## 10.3. Mobile

- Không ép mọi section thành `100vh`
- Nội dung phải theo chiều cao thực
- Hero có thể giữ `100svh`
- Các section sau:
  - padding-top/bottom `72–96px`
  - ảnh full width
  - nội dung dưới ảnh
- CTA tối thiểu cao `44px`
- Font body tối thiểu `16px`

---

## 11. Image direction

## 11.1. Bộ ảnh bắt buộc

1. Petal Pack nguyên búp.
2. Petal Pack được tách nhẹ.
3. Macro cánh sen sấy.
4. Pha trà cùng cánh sen.
5. Nước trà trong tách.
6. Senova Classic.
7. Senova Gift Set.
8. Chi tiết giấy hộp.
9. Chi tiết gỗ/gốm.
10. Thẻ câu chuyện văn hóa.
11. Ảnh bộ ba sản phẩm.
12. Ảnh trao tặng Gift Set.

## 11.2. Art direction

- Ánh sáng xiên.
- Độ bão hòa thấp.
- Nền vật liệu tự nhiên.
- Tông xanh trầm, nâu trà, ivory.
- Không dùng background quá sáng.
- Không dùng ảnh stock thiếu liên hệ với sản phẩm.

## 11.3. Tỷ lệ ảnh

- Hero: `16:9` hoặc `21:9`
- Product detail: `4:5`
- Macro: `1:1`
- Ritual step: `3:4`
- Gift set: `4:3`

---

## 12. File map cần chỉnh sửa

## 12.1. Global theme

### File

```text
src/styles/theme.css
```

### Thay đổi

- đổi toàn bộ color token;
- giảm gradient;
- cập nhật shadow;
- cập nhật radius;
- đổi body background;
- chuẩn hóa typography token.

---

## 12.2. Site layout

### File

```text
src/layouts/SiteLayout.tsx
src/layouts/SiteLayout.module.css
```

### Thay đổi

- thiết kế lại header;
- giảm số control;
- thay background chung;
- bỏ blur diện rộng;
- làm lại footer;
- kiểm soát background theo route.

---

## 12.3. Landing page

### File

```text
src/pages/SenovaLandingPage/index.tsx
```

### Thay đổi

Thay cấu trúc:

```tsx
<Hero />
<Chapters />
<CTA />
```

bằng:

```tsx
<LuxuryHero />
<SignatureProduct />
<TeaRitual />
<CollectionShowcase />
<CulturalMaterial />
<GiftExperience />
<FinalCTA />
```

---

## 12.4. Hero

### File

```text
src/features/landing/sections/Hero.tsx
```

### Thay đổi

- đổi tên thành `LuxuryHero.tsx`;
- dùng ảnh/video sản phẩm thật;
- thêm CTA;
- giảm font weight;
- bỏ vùng trống dành riêng cho 3D nếu không cần.

---

## 12.5. Chapters

### File

```text
src/features/landing/sections/Chapters.tsx
```

### Thay đổi

Không tiếp tục dùng section luân phiên trái–phải lặp lại.

Tách thành các component riêng:

```text
SignatureProduct.tsx
TeaRitual.tsx
CollectionShowcase.tsx
CulturalMaterial.tsx
GiftExperience.tsx
```

---

## 12.6. CTA

### File

```text
src/features/landing/sections/CTA.tsx
```

### Thay đổi

- đổi thành `FinalCTA.tsx`;
- nền forest deep;
- giảm chữ;
- dùng CTA đặt trước;
- bỏ pill button quá tròn.

---

## 12.7. Products page

### File

```text
src/pages/ProductsPage/index.tsx
src/styles/productsPageClasses.ts
src/features/products/components/*
```

### Thay đổi

- bỏ cảm giác catalogue;
- chuyển thành collection editorial;
- Petal Pack nổi bật;
- giảm hiệu ứng orbit;
- ưu tiên ảnh lớn và nội dung ngắn.

---

## 12.8. Product detail

### File

```text
src/pages/ProductDetailPage/index.tsx
```

### Cấu trúc đề xuất

```text
Hero product
Product statement
Materials
Ritual
Details
Cultural story
Related products
Pre-order CTA
```

---

## 13. Component system mới

Tạo thư mục:

```text
src/components/luxury/
```

Các component:

```text
LuxuryButton.tsx
EditorialSection.tsx
SectionEyebrow.tsx
ProductStatement.tsx
ImageReveal.tsx
MaterialDetail.tsx
RitualStep.tsx
LuxuryDivider.tsx
DarkSection.tsx
```

---

## 14. Button specification

## 14.1. Primary

```css
background: var(--senova-forest);
color: var(--senova-ivory);
border-radius: 4px;
padding: 14px 22px;
```

## 14.2. Secondary

```css
background: transparent;
color: var(--senova-forest);
border-bottom: 1px solid currentColor;
border-radius: 0;
```

## 14.3. Dark variant

```css
background: var(--senova-gold);
color: var(--senova-forest-black);
```

---

## 15. Content rules

## 15.1. Mỗi section chỉ có một thông điệp

Không gộp đồng thời:

- lịch sử;
- sản phẩm;
- thành phần;
- văn hóa;
- CTA;

trong một khối nội dung.

## 15.2. Giới hạn độ dài

- Hero description: 20–35 từ
- Section introduction: 40–70 từ
- Product card: 20–40 từ
- Product detail paragraph: 80–120 từ

## 15.3. Từ ngữ cần hạn chế

- tinh tế;
- thanh khiết;
- đẳng cấp;
- hoàn hảo;
- độc đáo;
- cao cấp;
- bản địa;

Không loại bỏ hoàn toàn, nhưng phải thay bằng mô tả cụ thể.

Ví dụ:

**Không nên:**

> Một sản phẩm trà sen tinh tế, cao cấp và đậm bản sắc Việt.

**Nên:**

> Một phần trà cho một lần pha, được bao quanh bởi cánh sen sấy tạo hình búp sen.

---

## 16. Accessibility

Bắt buộc:

- contrast đạt WCAG AA;
- focus state rõ;
- semantic heading đúng thứ tự;
- alt text cho ảnh sản phẩm;
- keyboard navigation;
- hỗ trợ reduced motion;
- không đặt nội dung quan trọng chỉ trong animation;
- touch target tối thiểu `44px`.

---

## 17. Performance

## 17.1. Hero asset

- Desktop:
  - ưu tiên WebP/AVIF;
  - dung lượng mục tiêu dưới `500 KB`;
  - video dưới `3 MB` nếu cần.
- Mobile:
  - dùng ảnh riêng;
  - không tải video nếu không cần.

## 17.2. 3D

Chỉ giữ Three.js nếu:

- FPS ổn định;
- asset được lazy load;
- không cản trở LCP;
- có fallback ảnh;
- không xuất hiện trên mobile cấu hình thấp.

## 17.3. Metrics mục tiêu

- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- Lighthouse Performance ≥ 85
- Accessibility ≥ 90

---

## 18. Kế hoạch triển khai

## Phase 1 — Foundation

### Công việc

- cập nhật theme;
- typography;
- button;
- spacing;
- header;
- footer.

### Files

```text
src/styles/theme.css
src/layouts/SiteLayout.tsx
src/layouts/SiteLayout.module.css
```

### Kết quả

Website có nền tảng visual luxury nhất quán.

---

## Phase 2 — Landing page

### Công việc

- làm lại hero;
- signature product;
- ritual;
- collection;
- culture;
- gift;
- final CTA.

### Kết quả

Trang chủ thể hiện rõ định vị mới.

---

## Phase 3 — Products

### Công việc

- làm lại products page;
- product detail;
- related products;
- CTA đặt trước.

### Kết quả

Hệ sản phẩm được phân cấp đúng.

---

## Phase 4 — Motion and responsive

### Công việc

- chuẩn hóa animation;
- reduced motion;
- responsive;
- performance.

### Kết quả

Website mượt, ổn định và ít hiệu ứng thừa.

---

## Phase 5 — QA

### Công việc

- visual regression;
- mobile test;
- accessibility;
- Lighthouse;
- copy review;
- link and route test.

---

## 19. Acceptance criteria

Website chỉ được xem là hoàn thành khi đạt đủ các điều kiện sau:

### Visual

- Petal Pack xuất hiện trong vùng nhìn đầu tiên.
- Không còn accent hồng chiếm diện tích lớn.
- Gold không vượt quá 8% tổng diện tích thị giác.
- Header không chứa quá nhiều control.
- Không còn card grid kiểu SaaS ở trang chủ.
- Không còn blur/glassmorphism diện rộng.
- Typography chỉ dùng tối đa hai font family.
- Các section có nhịp và hình ảnh khác nhau.

### UX

- CTA chính rõ ràng.
- Mobile không bị section quá cao.
- Người dùng có thể đi từ:
  - hero;
  - sản phẩm;
  - nghi thức;
  - collection;
  - đặt trước;
  một cách liền mạch.
- Menu dễ sử dụng.
- Product hierarchy rõ.

### Technical

- Không có TypeScript error.
- Không có ESLint error nghiêm trọng.
- Không có horizontal overflow.
- Reduced motion hoạt động.
- Lighthouse đạt mục tiêu tối thiểu.
- Ảnh có alt text.
- Layout ổn định ở:
  - 375px;
  - 768px;
  - 1024px;
  - 1440px.

---

## 20. Definition of done

Một hạng mục chỉ được xem là hoàn tất khi:

1. Code đã được triển khai.
2. Responsive đã được kiểm tra.
3. Accessibility đã được kiểm tra.
4. Không gây regression các route khác.
5. Nội dung đã được rà soát.
6. Ảnh đã được tối ưu.
7. Animation có reduced-motion fallback.
8. Build production thành công.
9. Đã chụp ảnh before/after.
10. Đã xác nhận đúng định hướng Quiet Vietnamese Luxury.

---

## 21. Thứ tự ưu tiên

### P0 — Bắt buộc

- Theme mới
- Header mới
- Hero mới
- Petal Pack là trọng tâm
- Mobile layout
- Giảm glassmorphism
- Giảm card/pill
- Typography mới

### P1 — Quan trọng

- Tea Ritual
- Collection Showcase
- Gift Experience
- Product Detail
- Motion system

### P2 — Sau khi ổn định

- 3D nâng cao
- Ambient audio
- Video cinematic
- Advanced parallax
- Personalization

---

## 22. Checklist thực thi nhanh

```text
[ ] Cập nhật theme.css
[ ] Thay accent hồng bằng aged gold
[ ] Giảm gradient
[ ] Thiết kế lại header
[ ] Di chuyển ambient sound khỏi header
[ ] Thay bag CTA bằng pre-order CTA
[ ] Làm lại hero bằng ảnh Petal Pack
[ ] Tạo SignatureProduct
[ ] Tạo TeaRitual
[ ] Tạo CollectionShowcase
[ ] Tạo CulturalMaterial
[ ] Tạo GiftExperience
[ ] Tạo FinalCTA
[ ] Bỏ Chapters luân phiên trái/phải
[ ] Giảm radius
[ ] Giảm blur
[ ] Chuẩn hóa typography
[ ] Responsive mobile
[ ] Reduced motion
[ ] Optimize assets
[ ] Lighthouse test
[ ] Accessibility test
```

---

## 23. Kết luận

Mục tiêu của quá trình chỉnh sửa không phải biến website thành một giao diện tối màu và dùng vàng kim nhiều hơn. Trọng tâm là xây dựng một hệ trải nghiệm có:

- nhịp chậm;
- hình ảnh sản phẩm rõ;
- khoảng trắng;
- chất liệu;
- typography chính xác;
- chuyển động tiết chế;
- cấu trúc nội dung có phân cấp.

Senova cần được nhận diện là một thương hiệu trà sen Việt hiện đại, có khả năng tiếp cận người dùng mới nhưng vẫn giữ độ trầm, tính nghi thức và giá trị văn hóa của sản phẩm.
