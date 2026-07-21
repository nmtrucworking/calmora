# SENOVA P1 — KẾ HOẠCH CHUẨN HÓA LUXURY UI, THƯƠNG HIỆU VÀ CHẤT LƯỢNG TRẢI NGHIỆM

> **Dự án:** Calmora / Senova  
> **Phạm vi:** Website frontend, design system, kiến trúc thông tin, nội dung thương hiệu, responsive, accessibility, performance và quy chuẩn hình ảnh  
> **Mức ưu tiên:** P1 — triển khai sau khi P0 đã ổn định luồng đặt trước và Guided QR Ritual  
> **Phiên bản:** 1.0  
> **Ngày cập nhật:** 20/07/2026  
> **Trạng thái:** Đề xuất triển khai  
> **Định hướng thẩm mỹ:** Quiet Vietnamese Luxury — sang trọng tiết chế, bản địa, có chiều sâu vật liệu và ưu tiên sản phẩm

---

## 1. Vai trò của P1

P0 xử lý các lỗi mang tính cấu trúc:

- Hợp nhất luồng đặt trước.
- Loại bỏ sự nhập nhằng giữa bán hàng và khảo sát.
- Chuẩn hóa nghi thức Petal Pack.
- Chuyển QR Experience thành guided flow.
- Đưa phản hồi về cuối hành trình.
- Loại bỏ metadata kỹ thuật khỏi giao diện chính.

P1 không thay thế P0. P1 chỉ bắt đầu khi các quyết định P0 đã được chốt và triển khai đủ ổn định.

Mục tiêu của P1 là đưa website từ trạng thái:

> “Có phong cách luxury và có nhiều hiệu ứng”

sang trạng thái:

> “Có một hệ luxury nhất quán, đáng tin cậy, dễ sử dụng, tải tốt và có khả năng mở rộng.”

P1 tập trung vào sáu lớp chất lượng:

1. **Tính nhất quán thương hiệu.**
2. **Tính nhất quán giao diện.**
3. **Khả năng đọc và ra quyết định.**
4. **Chất lượng hình ảnh và vật liệu số.**
5. **Hiệu năng, accessibility và responsive.**
6. **Cảm giác dịch vụ cao cấp xuyên suốt hành trình.**

---

# 2. Điều kiện đầu vào trước khi triển khai P1

P1 chỉ nên được đưa vào sprint chính thức khi các điều kiện sau đã được đáp ứng.

## 2.1. Điều kiện bắt buộc từ P0

- [ ] Route đặt trước chuẩn đã được xác định.
- [ ] Không còn hai luồng cạnh tranh giữa `reorder`, `bag` và `checkout`.
- [ ] Product detail đã truyền được sản phẩm, biến thể và số lượng vào order request.
- [ ] Guided QR Ritual đã có flow ổn định.
- [ ] Petal Pack đã dùng mô tả đúng:
  - tách nhẹ cánh sen;
  - thưởng hương;
  - pha nguyên búp.
- [ ] Form phản hồi QR đã được tinh gọn.
- [ ] Metadata kỹ thuật đã được ẩn khỏi giao diện người dùng.
- [ ] Route cũ có redirect và không gây dead-end.

## 2.2. Điều kiện nội dung

- [ ] Tên thương hiệu hiển thị chính đã được chốt: `SENOVA`.
- [ ] Quan hệ thương hiệu đã được chốt: `Senova by Calmora` hoặc cấu trúc tương đương.
- [ ] Tên ba dòng sản phẩm đã được chuẩn hóa.
- [ ] Vai trò `Giữ — Mở — Trao` đã được duyệt.
- [ ] Slogan chính thức đã được duyệt:
  - `Sen trà giao hòa, chuyện Việt ngân nga.`
- [ ] Không còn nội dung mô tả Petal Pack theo phương án cũ.
- [ ] Các tuyên bố về chất lượng, nguồn gốc và văn hóa đã được phân loại:
  - đã kiểm chứng;
  - đang kiểm chứng;
  - định hướng thiết kế.

## 2.3. Điều kiện kỹ thuật

- [ ] Build frontend ổn định.
- [ ] Không còn lỗi route chính.
- [ ] Có môi trường staging.
- [ ] Có khả năng kiểm tra trên thiết bị thật.
- [ ] Có cơ chế analytics tối thiểu.
- [ ] Có quy trình tối ưu và thay thế ảnh mà không sửa trực tiếp component.
- [ ] Có thể chạy Lighthouse hoặc công cụ tương đương trong CI hoặc QA thủ công.

---

# 3. Mục tiêu P1

Sau khi hoàn thành P1, website phải đáp ứng các mục tiêu sau.

## 3.1. Mục tiêu nhận diện

Người dùng phải nhận ra:

- Senova là thương hiệu sản phẩm chính đang được trải nghiệm.
- Calmora là đơn vị khởi tạo hoặc thương hiệu bảo chứng.
- Petal Pack là sản phẩm biểu tượng.
- Classic là nhịp dùng hằng ngày.
- Gift Set là nhịp trao tặng.
- Senova không phải một website mỹ phẩm, SaaS hoặc catalogue trà đại trà.

## 3.2. Mục tiêu UI

- Tất cả route công khai dùng cùng một design system.
- Không còn cảm giác chuyển sang “website khác” khi đi từ editorial page sang order request.
- Không còn hai loại card, ba loại radius và nhiều kiểu button không có lý do.
- Các hiệu ứng chuyển động được tiết chế.
- Không dùng hiệu ứng để che thiếu nội dung hoặc thiếu hình ảnh.
- Component có thể mở rộng mà không hard-code màu và spacing tại từng route.

## 3.3. Mục tiêu UX

- Người dùng biết nên làm gì trong 5–8 giây đầu tiên.
- Mỗi trang chỉ có một CTA chính.
- Nội dung dài được chia theo mục đích đọc.
- Thông tin sản phẩm và bằng chứng tin cậy dễ tìm.
- Mobile không bị thu nhỏ phiên bản desktop.
- Các tác vụ chức năng không bị làm chậm bởi animation.

## 3.4. Mục tiêu kỹ thuật

- Core Web Vitals đạt mức chấp nhận được.
- Hình ảnh có responsive source.
- Font không làm chậm first render quá mức.
- Hỗ trợ reduced motion.
- Có accessibility baseline.
- Có visual regression checklist.
- Có quy trình quản lý asset và alt text.

---

# 4. Nguyên tắc thiết kế P1

## 4.1. Quiet luxury, không phải decorative luxury

Luxury của Senova phải đến từ:

- Nhịp không gian.
- Tỷ lệ typography.
- Hình ảnh sản phẩm.
- Chất liệu.
- Mức độ chính xác.
- Dịch vụ rõ ràng.
- Nội dung có căn cứ.

Không nên phụ thuộc vào:

- Particle.
- Ánh kim giả dày đặc.
- Gradient vàng liên tục.
- Card bóng.
- Shadow quá sâu.
- Animation kéo dài.
- Text nhỏ để tạo cảm giác thời trang.
- Biểu tượng sen lặp lại trên mọi section.

## 4.2. Sản phẩm là trung tâm

Thứ tự ưu tiên thị giác:

```text
Sản phẩm thật
→ Thao tác sử dụng
→ Chất liệu
→ Câu chuyện
→ Yếu tố trang trí
```

Không sử dụng hình nền trừu tượng nếu trang đang nói về một sản phẩm cụ thể.

## 4.3. Văn hóa được thể hiện bằng hành động và ngữ cảnh

Văn hóa không chỉ là:

- đoạn văn;
- hình hoa sen;
- họa tiết vàng;
- câu trích dẫn.

Văn hóa phải xuất hiện trong:

- hình dáng búp sen;
- cách tách nhẹ;
- thời gian chờ;
- lời nhắn quà tặng;
- câu chuyện vùng nguyên liệu;
- cách đặt sản phẩm trong đời sống Việt.

## 4.4. Tính chính xác cao hơn tính phô diễn

Mỗi tuyên bố phải có một trạng thái:

| Trạng thái | Cách hiển thị |
|---|---|
| Đã xác nhận | Có thể dùng như thông tin chính |
| Đang kiểm chứng | Phải ghi rõ trạng thái |
| Concept | Không trình bày như sản phẩm đã thương mại |
| Giả định | Chỉ dùng nội bộ hoặc trong validation |
| Không có nguồn | Không xuất bản như sự thật |

## 4.5. Một trang — một mục tiêu chính

Ví dụ:

| Trang | Mục tiêu chính |
|---|---|
| Homepage | Hiểu định vị và chọn hướng khám phá |
| Products | Hiểu vai trò ba dòng sản phẩm |
| Product detail | Ra quyết định gửi yêu cầu đặt trước |
| Ritual | Hiểu và thực hiện nghi thức |
| Story | Hiểu hệ câu chuyện thương hiệu |
| Gifting | Bắt đầu nhu cầu quà tặng |
| Order request | Hoàn tất yêu cầu |
| QR Experience | Hoàn thành trải nghiệm sản phẩm |

---

# 5. Phạm vi công việc P1

## Epic P1.1 — Chuẩn hóa kiến trúc thương hiệu

### Mục tiêu

Loại bỏ sự cạnh tranh thị giác và ngữ nghĩa giữa `Calmora` và `Senova`.

### Vấn đề cần xử lý

Khi hai tên được trình bày ngang hàng dưới dạng:

```text
CALMORA | SENOVA
```

người dùng có thể không biết:

- Tên thương hiệu nào cần ghi nhớ.
- Tên nào là công ty.
- Tên nào là sản phẩm.
- Nên tìm kiếm hoặc giới thiệu thương hiệu bằng từ nào.

### Kiến trúc đề xuất

```text
SENOVA
by Calmora
```

Hoặc:

```text
SENOVA
A Calmora Project
```

Trong giao diện tiếng Việt nên ưu tiên:

```text
SENOVA
Dự án trà văn hóa của Calmora
```

### Quy tắc sử dụng

#### Header

- Hiển thị `SENOVA` là tên chính.
- `by Calmora` ở cấp thị giác phụ.
- Không dùng dấu `|` như cấu trúc thương hiệu mặc định.

#### Footer

Có thể trình bày đầy đủ hơn:

```text
Senova là dự án trà văn hóa do Calmora phát triển.
```

#### Product packaging

Tùy quyết định bao bì:

- Calmora có thể là master brand.
- Senova là product family.
- Tên dòng sản phẩm là cấp thứ ba.

Ví dụ:

```text
CALMORA
SENOVA
PETAL PACK
```

Website vẫn phải ưu tiên tên người dùng cần nhớ trong hành trình mua: `Senova`.

### Acceptance Criteria

- [ ] Header chỉ có một tên thương hiệu ở cấp thị giác chính.
- [ ] Mọi route dùng cùng một cấu trúc tên.
- [ ] Metadata SEO không trộn tên theo nhiều thứ tự.
- [ ] Logo lockup có phiên bản sáng và tối.
- [ ] Có quy định tối thiểu cho kích thước và clear space.
- [ ] Không còn `CALMORA | SENOVA` ở những vị trí gây hiểu nhầm.
- [ ] Footer giải thích được quan hệ Calmora–Senova trong một câu.

---

## Epic P1.2 — Chuẩn hóa design token

### Mục tiêu

Tạo một nguồn thiết kế duy nhất thay cho việc hard-code màu, shadow, radius và spacing trong route component.

### Nhóm token bắt buộc

```text
Color
Typography
Spacing
Radius
Border
Shadow
Motion
Z-index
Container
Breakpoints
```

### Cấu trúc đề xuất

```text
src/shared/styles/
├── tokens/
│   ├── color.css
│   ├── typography.css
│   ├── spacing.css
│   ├── elevation.css
│   ├── motion.css
│   └── layout.css
├── theme.css
├── global.css
└── componentPrimitives.ts
```

### Quy tắc màu

P1 cần phân biệt:

1. Màu thương hiệu.
2. Màu chức năng.
3. Màu vật liệu.
4. Màu trạng thái.

### Token gợi ý

```css
:root {
  --senova-forest-950: #07110f;
  --senova-forest-900: #0b1a15;
  --senova-forest-800: #1d3329;
  --senova-forest-700: #274236;

  --senova-ivory-50: #fffaf0;
  --senova-paper-100: #f3efe5;
  --senova-paper-200: #e6decc;

  --senova-gold-300: #f8df93;
  --senova-gold-500: #c9a94d;
  --senova-bronze-600: #8a6825;
  --senova-bronze-800: #5f4818;

  --senova-tea-600: #765846;
  --senova-lotus-500: #b95672;

  --success: #2f6a4d;
  --warning: #8a6825;
  --danger: #9f1f38;
  --info: #315f75;
}
```

### Lưu ý quan trọng về màu

Các tài liệu nhận diện, bao bì và source code hiện có thể dùng các mã xanh khác nhau. P1 phải tạo một phiên quyết định riêng:

```text
BRAND-COLOR-DECISION-001
```

Nội dung cần chốt:

- Màu master cho digital.
- Màu master cho in ấn.
- Màu bao bì thực tế.
- Sai lệch màn hình và vật liệu.
- Màu fallback khi không dùng metallic foil.

Không tự coi một mã HEX là tương đương hoàn toàn với ép kim hoặc mực in.

### Phân bổ màu đề xuất

```text
60–70%: Ivory / paper / khoảng trắng
20–30%: Forest / ink / khối tối
5–10%: Bronze / gold accent
≤3%: Lotus accent
```

### Quy tắc

- Gold không dùng cho body text dài.
- Pink/lotus chỉ là accent cảm xúc, không là màu CTA chính.
- Nền tối chỉ dùng ở các section có mục tiêu rõ.
- Không tạo gradient mới ngoài danh mục được duyệt.
- Không hard-code màu mới trong JSX.

### Acceptance Criteria

- [ ] Không còn màu thương hiệu hard-code phân tán.
- [ ] Tất cả component đọc token.
- [ ] Có semantic token cho light và dark surface.
- [ ] Có trạng thái focus, hover, active và disabled.
- [ ] Có bảng đối chiếu token digital–packaging.
- [ ] Có script hoặc lint rule phát hiện mã màu mới ngoài whitelist.

---

## Epic P1.3 — Chuẩn hóa typography

### Mục tiêu

Tạo hệ phân cấp đọc rõ, sang trọng nhưng không hy sinh khả năng đọc.

### Vấn đề cần tránh

- Body quá nhỏ.
- Heading quá lớn nhưng không có nhịp.
- Dùng serif cho đoạn văn dài.
- Dùng uppercase tracking rộng ở quá nhiều vị trí.
- Font weight không nhất quán.
- Toàn trang bị thu nhỏ bằng `html { font-size: 90%; }`.

### Hệ font đề xuất

#### Display

```text
Noto Serif Display
Fallback: Playfair Display, Georgia, serif
```

#### Sans

```text
Be Vietnam Pro
Fallback: Inter, system-ui, sans-serif
```

### Typographic scale đề xuất

| Token | Desktop | Mobile | Font |
|---|---:|---:|---|
| Display XL | 72–88 px | 44–56 px | Serif |
| Display L | 56–72 px | 38–46 px | Serif |
| H1 | 44–56 px | 34–42 px | Serif |
| H2 | 34–44 px | 28–34 px | Serif |
| H3 | 24–30 px | 22–26 px | Serif/Sans |
| Lead | 18–21 px | 17–19 px | Sans |
| Body | 16–18 px | 16–17 px | Sans |
| Small | 14–15 px | 14–15 px | Sans |
| Caption | 12–13 px | 12–13 px | Sans |

### Line-height

- Heading: `1.0–1.15`.
- Lead: `1.55–1.7`.
- Body: `1.65–1.8`.
- Caption: `1.45–1.6`.

### Quy tắc uppercase

Chỉ dùng cho:

- Eyebrow.
- Label ngắn.
- Navigation.
- Badge trạng thái.

Không dùng uppercase cho:

- Đoạn mô tả.
- CTA dài.
- Nội dung form.
- Câu chuyện văn hóa.

### Quy tắc chiều dài dòng

- Body tối đa khoảng `62–72ch`.
- Câu chuyện dài tối đa `60–66ch`.
- Hero description tối đa `34–42rem`.
- Không để đoạn văn full width trên màn hình lớn.

### Acceptance Criteria

- [ ] Body mobile tối thiểu 16 px.
- [ ] Không còn global font-size 90% nếu làm giảm khả năng đọc.
- [ ] Chỉ dùng tối đa hai font family chính.
- [ ] Có token typography thay vì class tùy ý.
- [ ] Heading không bị cắt hoặc tràn ở 360 px.
- [ ] Font loading không gây layout shift đáng kể.
- [ ] Có fallback hoạt động khi font web chưa tải.

---

## Epic P1.4 — Chuẩn hóa spacing, grid và composition

### Mục tiêu

Luxury được tạo bằng nhịp không gian có chủ đích, không phải bằng khoảng trắng ngẫu nhiên.

### Grid hệ thống

#### Desktop

- Container tối đa: `1280–1344 px`.
- Grid: 12 cột.
- Gutter: `24–32 px`.
- Page padding: `32–48 px`.

#### Tablet

- Grid: 8 cột.
- Gutter: `20–24 px`.
- Page padding: `24 px`.

#### Mobile

- Grid: 4 cột.
- Gutter: `16 px`.
- Page padding: `16–20 px`.

### Spacing scale

```text
4
8
12
16
20
24
32
40
48
64
80
96
120
160
```

### Section spacing

| Loại section | Desktop | Mobile |
|---|---:|---:|
| Compact utility | 48–64 px | 36–48 px |
| Editorial standard | 96–120 px | 64–80 px |
| Hero | 120–160 px | 88–112 px |
| Dark statement | 112–144 px | 72–96 px |

### Nguyên tắc composition

- Không lồng card trong card.
- Không dùng card nếu đường kẻ và khoảng trắng đủ phân nhóm.
- Một section không nên có quá ba cấp container.
- Không ép ba cột nếu mỗi card có nội dung dài.
- Không đặt hai CTA bằng mức ưu tiên cạnh nhau nếu một CTA là chính.

### Acceptance Criteria

- [ ] Mọi page dùng cùng container.
- [ ] Section spacing dùng token.
- [ ] Không còn nhiều giá trị `clamp()` tùy ý không được quản lý.
- [ ] Không có card lồng card ở public route.
- [ ] Mobile có flow tuyến tính rõ.
- [ ] Bố cục không tạo khoảng trống bất thường khi ảnh chưa được bổ sung.

---

## Epic P1.5 — Hợp nhất component editorial và commerce

### Mục tiêu

Loại cảm giác “hai website” giữa trang thương hiệu và trang chức năng.

### Component primitives bắt buộc

```text
BrandLockup
SiteHeader
SiteFooter
PageContainer
EditorialSection
DarkSection
SectionHeader
Eyebrow
DisplayHeading
BodyCopy
LuxuryButton
TextLink
ImageFrame
ProductMedia
ProductCard
ProductConfiguration
Disclosure
StatusLabel
FormField
FormSection
OrderSummary
EmptyState
ErrorState
Skeleton
```

### Quy tắc button

Chỉ giữ bốn variant:

1. `primary`
2. `secondary`
3. `dark`
4. `ghost`

Không tạo variant mới tại route.

### Button primary

Dùng cho:

- Đặt trước.
- Gửi yêu cầu.
- Bắt đầu trải nghiệm.
- Hoàn tất tác vụ.

### Button secondary

Dùng cho:

- Xem nghi thức.
- Đọc câu chuyện.
- Xem chi tiết.
- Quay lại.

### Button dark

Dùng trên nền tối khi cần CTA nổi bật.

### Ghost

Dùng cho thao tác phụ:

- Bỏ qua.
- Mở disclosure.
- Chuyển ngôn ngữ.
- Xem thông tin.

### Radius

Khuyến nghị:

```text
2 px: đường nét, image frame
4–6 px: button, input
8–12 px: panel chức năng
Không dùng pill trừ tag ngắn hoặc trạng thái
```

### Shadow

- Không dùng shadow cho mọi card.
- Chỉ dùng elevation khi có lớp nổi thật:
  - sticky summary;
  - modal;
  - menu;
  - floating control.
- Product card editorial ưu tiên border và surface.

### Acceptance Criteria

- [ ] Commerce page dùng cùng primitive với editorial page.
- [ ] Không còn button class string lặp lại ở nhiều file.
- [ ] Không còn card bo tròn quá mức ở product catalogue.
- [ ] Form không có style tách biệt khỏi website.
- [ ] Trạng thái disabled và loading nhất quán.
- [ ] Component có Storybook hoặc trang showcase nội bộ.

---

## Epic P1.6 — Tinh gọn header và navigation

### Mục tiêu

Giảm tải nhận thức và làm rõ hành trình chính.

### Header desktop đề xuất

```text
[SENOVA by Calmora]

Sản phẩm
Nghi thức
Câu chuyện
Quà tặng

[Đặt trước]
[VI/EN]
```

### Header mobile

```text
[SENOVA]
[Đặt trước] [Menu]
```

Trong drawer:

```text
Sản phẩm
Nghi thức
Câu chuyện
Quà tặng
Liên hệ
Ngôn ngữ
```

### Quy tắc

- Không đặt âm thanh ở header toàn website.
- Không đặt quá năm liên kết chính.
- Không đặt các route mock.
- Active state nhẹ, không dùng nền đậm ở mọi mục.
- Header transparent chỉ dùng khi hero bảo đảm contrast.
- Khi scroll, header chuyển sang surface ổn định.
- Không làm header cao quá 72 px trên desktop.
- Mobile drawer phải khóa scroll và quản lý focus.

### Sticky CTA mobile

Có thể dùng trên product detail:

```text
Giá dự kiến       [Đặt trước]
```

Chỉ xuất hiện sau khi người dùng đã cuộn qua hero.

### Acceptance Criteria

- [ ] Desktop có tối đa bốn mục chính và một CTA.
- [ ] Mobile menu có focus trap.
- [ ] Escape đóng menu.
- [ ] Active route đúng.
- [ ] CTA đặt trước luôn dẫn tới route P0 chuẩn.
- [ ] Header không che nội dung anchor.
- [ ] Không có layout shift khi đổi trạng thái scroll.

---

## Epic P1.7 — Thiết kế lại homepage theo intent

### Mục tiêu

Homepage không chỉ kể chuyện tuyến tính; homepage phải giúp người dùng chọn bối cảnh phù hợp.

### Cấu trúc đề xuất

```text
01. Hero Petal Pack
02. Chọn ý định
03. Signature Product
04. Bằng chứng sản phẩm
05. Preview nghi thức
06. Hệ ba dòng sản phẩm
07. Chất liệu văn hóa
08. Quà tặng
09. Validation / trạng thái dự án
10. Final CTA
```

## Section 01 — Hero

### Nội dung

Eyebrow:

```text
Senova Petal Pack
```

Heading:

```text
Một búp sen.
Một lần pha.
Một nghi thức.
```

Description:

```text
Phần trà cho một lần pha, được đặt trong túi lọc,
bao quanh bởi cánh sen thật tạo hình búp và sấy khô.
```

CTA chính:

```text
Khám phá Petal Pack
```

CTA phụ:

```text
Xem nghi thức pha
```

### Yêu cầu

- Không dùng quá hai CTA.
- Không dùng ảnh abstract.
- Ảnh phải cho thấy sản phẩm hoặc thao tác.
- Có fallback layout đẹp khi ảnh cuối chưa được bổ sung.
- Không đặt đoạn văn dài.

## Section 02 — Chọn ý định

Heading:

```text
Bạn đang tìm một nhịp trà nào?
```

Ba lựa chọn:

```text
Dùng hằng ngày
→ Senova Classic

Trải nghiệm khác biệt
→ Senova Petal Pack

Trao một món quà
→ Senova Gift Set
```

Mỗi lựa chọn:

- Không dùng card thương mại giống nhau hoàn toàn.
- Petal Pack có trọng số thị giác lớn hơn.
- Có một câu giải thích.
- Có link rõ.

## Section 03 — Signature Product

Nội dung:

- Cấu trúc búp sen.
- Túi lọc định lượng.
- Gạo sen được giữ trong túi.
- Sấy bơm nhiệt.
- Nghi thức tách nhẹ, thưởng hương, pha nguyên búp.

Không hiển thị thông số chưa kiểm chứng như cam kết thương mại.

## Section 04 — Bằng chứng sản phẩm

Hiển thị dưới dạng `What is confirmed / What is being validated`.

Ví dụ:

```text
Đã xác lập
- Cấu trúc một búp cho một lần pha.
- Định lượng nguyên mẫu.
- Phương pháp sấy bơm nhiệt.

Đang kiểm chứng
- Độ ẩm.
- Vi sinh.
- Hạn sử dụng.
- Độ ổn định hương.
```

Điều này làm tăng độ tin cậy hơn việc chỉ dùng từ “premium”.

## Section 05 — Preview nghi thức

Bốn nhịp:

```text
01. Quan sát
02. Tách nhẹ
03. Thưởng hương
04. Pha nguyên búp
```

CTA:

```text
Bắt đầu trải nghiệm hướng dẫn
```

## Section 06 — Hệ sản phẩm

Cấu trúc:

```text
Petal Pack — Mở
Classic — Giữ
Gift Set — Trao
```

Petal Pack chiếm không gian lớn hơn.

## Section 07 — Chất liệu văn hóa

Không viết một bài dài.

Dùng ba điểm:

- Sen trong đời sống.
- Khoảng chậm của việc thưởng trà.
- Câu chuyện được chuyển thành hành động.

## Section 08 — Quà tặng

Nội dung:

- Người trao.
- Người nhận.
- Dịp tặng.
- Lời nhắn.
- Cấu hình.

CTA:

```text
Trao đổi về bộ quà tặng
```

## Section 09 — Trạng thái dự án

Phải minh bạch:

```text
Senova đang ở giai đoạn hoàn thiện nguyên mẫu và kiểm chứng.
```

Có thể hiển thị:

- Đã có prototype.
- Đang thử nghiệm.
- Chưa mở bán đại trà.
- Nhận yêu cầu đặt trước hoặc đăng ký trải nghiệm.

## Section 10 — Final CTA

Heading:

```text
Sen trà giao hòa, chuyện Việt ngân nga.
```

CTA chính:

```text
Gửi yêu cầu đặt trước
```

CTA phụ:

```text
Khám phá câu chuyện
```

### Acceptance Criteria

- [ ] Người dùng chọn được ý định trong phần đầu trang.
- [ ] Petal Pack rõ là signature.
- [ ] Không trình bày ba sản phẩm như ba card ngang hàng hoàn toàn.
- [ ] Có section minh bạch trạng thái kiểm chứng.
- [ ] Không có quá hai CTA trong một section.
- [ ] Homepage không phụ thuộc vào ảnh cuối để giữ cấu trúc.

---

## Epic P1.8 — Nâng cấp Products Page

### Mục tiêu

Products Page phải giải thích vai trò sản phẩm trước khi đóng vai trò catalogue.

### Cấu trúc

```text
Hero hệ sản phẩm
→ Signature Petal Pack
→ So sánh ba vai trò
→ Chọn theo nhu cầu
→ CTA đặt trước
```

### Ma trận vai trò

| Dòng | Vai trò | Bối cảnh | Điểm khác biệt | CTA |
|---|---|---|---|---|
| Classic | Giữ | Hằng ngày | Gọn, ổn định | Xem Classic |
| Petal Pack | Mở | Trải nghiệm | Búp sen, nghi thức | Khám phá Petal Pack |
| Gift Set | Trao | Quà tặng | Cấu hình và lời nhắn | Xem Gift Set |

### Quy tắc card

- Petal Pack dùng layout lớn.
- Classic và Gift Set dùng layout phụ.
- Không dùng heart/wishlist trong P1 nếu chức năng chưa thật.
- Không dùng badge dày đặc.
- Không dùng ảnh nền radial giả khi đã có ảnh sản phẩm.

### Acceptance Criteria

- [ ] Vai trò ba dòng hiểu được trong 10 giây.
- [ ] Petal Pack có trọng số chính.
- [ ] Không có wishlist giả.
- [ ] Không có account giả.
- [ ] Card dùng cùng token.
- [ ] CTA không dẫn tới route mock.

---

## Epic P1.9 — Nâng cấp Product Detail

### Mục tiêu

Tăng chất lượng ra quyết định và cảm giác dịch vụ cao cấp sau khi P0 đã ổn định chức năng đặt trước.

### Cấu trúc P1

```text
01. Hero và cấu hình
02. Giá trị khác biệt
03. Thành phần và cấu trúc
04. Nghi thức sử dụng
05. Trạng thái kiểm chứng
06. Chất liệu và bao bì
07. Câu chuyện văn hóa
08. Dịch vụ đặt trước
09. Sản phẩm liên quan
```

### Hero

- Ảnh chính.
- Tên.
- Vai trò.
- Tagline.
- Giá dự kiến.
- Trạng thái.
- Variant.
- Quantity.
- CTA đặt trước.
- CTA xem nghi thức.

### Product media

Tối thiểu hỗ trợ:

- Ảnh hero.
- Ảnh hộp.
- Ảnh sản phẩm bên trong.
- Ảnh thao tác.
- Ảnh tỷ lệ/kích thước.
- Video ngắn.

Trong giai đoạn chưa có đủ ảnh:

- Dùng placeholder có tỷ lệ cố định.
- Không dùng cùng một ảnh lặp lại bốn lần.
- Không kéo giãn mockup.
- Không dùng ảnh AI như bằng chứng sản phẩm thực tế mà không ghi chú.

### Information architecture

Thông tin cần có disclosure:

- Thành phần.
- Cách dùng.
- Bảo quản.
- Giao hàng.
- Trạng thái sản phẩm.
- Câu hỏi thường gặp.

### Luxury service pattern

Dùng ngôn ngữ rõ:

```text
Senova sẽ xác nhận cấu hình, thời gian chuẩn bị và phương thức giao trước khi chốt yêu cầu.
```

Không dùng:

```text
Exclusive experience
Premium choice
Luxury tea
```

nếu không có thông tin cụ thể đi kèm.

### Acceptance Criteria

- [ ] Hero có một CTA chính.
- [ ] Người dùng tìm được thành phần trong tối đa hai thao tác.
- [ ] Người dùng tìm được trạng thái sản phẩm trong hero.
- [ ] Có thông tin giao hàng và chuẩn bị.
- [ ] Không dùng claim chưa kiểm chứng.
- [ ] Không dùng ảnh concept như ảnh thương mại mà không ghi chú.
- [ ] Sticky order summary hoạt động tốt trên desktop.
- [ ] Sticky CTA mobile không che nội dung.

---

## Epic P1.10 — Art direction và quy chuẩn hình ảnh

### Mục tiêu

Chuẩn bị hệ thống để hình ảnh được bổ sung sau mà không phá bố cục hoặc làm giảm chất lượng.

### Nhóm hình ảnh cần xây dựng

## A. Product Cutout

- Nền trung tính.
- Thể hiện đúng hình dáng.
- Không có vật thể dư.
- Dùng cho product list và summary.

## B. Editorial Product

- Bề mặt gỗ, giấy, lụa hoặc vật liệu tự nhiên.
- Ánh sáng mềm.
- Màu trà và cánh sen trung thực.
- Dùng cho hero và story.

## C. Ritual

- Tay người dùng.
- Tách nhẹ cánh.
- Thưởng hương.
- Pha nguyên búp.
- Quan sát trong nước.

## D. Material Detail

- Cánh sen.
- Túi lọc.
- Gạo sen.
- Giấy hộp.
- Dây túi lọc.
- Lớp lót Gift Set.

## E. Cultural Context

- Ao sen hoặc vùng nguyên liệu có nguồn rõ.
- Không dùng hình ảnh chung chung như biểu tượng văn hóa tuyệt đối.
- Không tạo ngữ cảnh lịch sử giả.

## F. Gifting

- Người trao và người nhận.
- Lời nhắn.
- Mở hộp.
- Dịp trang trọng.
- Bối cảnh doanh nghiệp.

### Quy cách kỹ thuật

| Loại | Tỷ lệ | Kích thước nguồn tối thiểu |
|---|---|---:|
| Hero desktop | 16:9 hoặc 3:2 | 2400 px cạnh dài |
| Hero mobile | 4:5 | 1600 px cạnh dài |
| Product editorial | 4:5 | 1800 px |
| Product card | 4:3 | 1400 px |
| Ritual step | 3:4 hoặc 4:5 | 1400 px |
| Thumbnail | 1:1 | 800 px |
| Material macro | 1:1 hoặc 3:2 | 1200 px |

### Format

- AVIF ưu tiên.
- WebP fallback.
- JPEG cho ảnh không hỗ trợ AVIF pipeline.
- PNG chỉ dùng khi cần transparency.
- Không dùng ảnh gốc nhiều MB trực tiếp.

### Naming

```text
petal-pack_hero_dark_desktop_v01.avif
petal-pack_hero_dark_mobile_v01.avif
petal-pack_ritual_open-petals_01.avif
classic_pack_front_v01.webp
gift-set_unboxing_note_v01.avif
```

### Metadata asset

```ts
type ImageAsset = {
  id: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: string;
  altVi: string;
  altEn: string;
  type: "product" | "ritual" | "material" | "culture" | "gifting";
  status: "concept" | "prototype" | "production";
  credit?: string;
};
```

### Alt text

Alt text phải mô tả:

- Sản phẩm gì.
- Trạng thái hoặc thao tác.
- Chi tiết có ý nghĩa.

Không dùng:

```text
Ảnh đẹp sản phẩm Senova cao cấp
```

Dùng:

```text
Búp Senova Petal Pack đã sấy, phần cánh ngoài được tách nhẹ trước khi pha nguyên búp.
```

### Ảnh AI và mockup

Phải có quy ước nội bộ:

- `concept`: minh họa định hướng.
- `prototype`: ảnh mẫu vật lý.
- `production`: ảnh sản phẩm đã chốt.

Không dùng ảnh concept để chứng minh:

- kích thước;
- màu thật;
- số lượng trong hộp;
- cấu trúc vật liệu;
- chất lượng thành phẩm.

### Acceptance Criteria

- [ ] Có manifest asset.
- [ ] Có desktop/mobile variant.
- [ ] Có alt text song ngữ.
- [ ] Ảnh có trạng thái concept/prototype/production.
- [ ] Không hard-code đường dẫn ảnh trong nhiều component.
- [ ] Không có ảnh vượt ngân sách dung lượng.
- [ ] Layout không bị vỡ khi thay ảnh.

---

## Epic P1.11 — Tinh chỉnh motion và interaction

### Mục tiêu

Chuyển motion từ yếu tố trang trí sang công cụ định hướng.

### Hiệu ứng được giữ

- Hero reveal nhẹ.
- Image reveal khi vào viewport.
- Step transition trong ritual.
- Progress transition.
- Button hover.
- Disclosure open/close.
- Menu transition.
- Product media switch.

### Hiệu ứng cần loại bỏ hoặc giảm

- Particle trail.
- Sparkle cursor.
- Blur toàn bộ section.
- Scale tất cả card khi hover.
- Hover animation trên form.
- Animation kéo dài hơn 800 ms ở tác vụ chức năng.
- Parallax mạnh.
- Auto-play video có âm thanh.
- Scroll-jacking.

### Motion token

```css
:root {
  --motion-fast: 160ms;
  --motion-standard: 280ms;
  --motion-slow: 480ms;

  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);
}
```

### Quy tắc

- Button: `160–280 ms`.
- Menu: `200–320 ms`.
- Section reveal: `400–600 ms`.
- Guided ritual: `280–480 ms`.
- Không blur form.
- Reduced motion: loại translate, scale và autoplay.

### Custom cursor

Khuyến nghị P1:

```text
Loại bỏ khỏi production.
```

Phương án thay thế nếu cần giữ:

- Chỉ dùng dot/ring.
- Không particle.
- Không thay native cursor trên input.
- Không áp dụng cho accessibility mode.
- Không chạy trên màn hình dưới 1024 px.

### Ambient sound

- Chỉ dùng trong `/ritual` hoặc `/experience`.
- Mặc định tắt.
- Luôn có trạng thái rõ.
- Không tự phát.
- Ghi nhớ preference trong phiên.
- Có transcript hoặc không phụ thuộc âm thanh để hiểu nội dung.

### Acceptance Criteria

- [ ] Không còn particle cursor ở production.
- [ ] Form không blur hoặc float khi hover.
- [ ] Reduced motion hoạt động.
- [ ] Motion không chặn click.
- [ ] Không có animation gây layout shift.
- [ ] Không có âm thanh autoplay.

---

## Epic P1.12 — Mobile responsive refinement

### Mục tiêu

Thiết kế mobile theo hành vi riêng, không chỉ xếp chồng desktop.

### Các breakpoint kiểm thử

```text
360
390
430
768
1024
1280
1440
```

### Mobile homepage

- Hero không vượt quá chiều cao hữu dụng.
- Heading không che sản phẩm.
- CTA full width hoặc hai nút rõ.
- Intent selector dạng stack.
- Petal Pack vẫn giữ trọng số.
- Không dùng grid ba cột thu nhỏ.

### Mobile product detail

- Media ở trên.
- Tên và giá dễ thấy.
- Variant dùng radio card hoặc select rõ.
- Sticky CTA ở dưới sau khi cuộn.
- Disclosure thay bảng rộng.
- Không dùng sticky sidebar.

### Mobile order request

- Một cột.
- Input đúng keyboard type.
- Summary thu gọn.
- Giữ dữ liệu khi quay lại.
- Error nằm gần field.

### Mobile QR

- Một step một màn hình.
- Thumb reach tốt.
- Progress không chiếm nhiều chiều cao.
- Timer dễ đọc.
- Nút next ở vùng dưới.
- Không yêu cầu pinch zoom.

### Mobile header

- Không có quá ba control.
- Drawer full-height.
- Focus rõ.
- CTA đặt trước không bị trùng với sticky CTA.

### Acceptance Criteria

- [ ] Không có horizontal scroll.
- [ ] Không có text nhỏ hơn 14 px.
- [ ] Body tối thiểu 16 px.
- [ ] Touch target tối thiểu 44 px.
- [ ] Form dùng autocomplete phù hợp.
- [ ] Sticky CTA không che footer hoặc input.
- [ ] Test bằng thiết bị thật ít nhất một iOS và một Android.

---

## Epic P1.13 — Accessibility baseline

### Mục tiêu

Đạt baseline tương đương WCAG 2.2 AA cho các luồng chính ở mức thực tiễn của dự án.

### Hạng mục

## Keyboard

- Tất cả interactive element truy cập được.
- Focus order đúng.
- Focus visible.
- Không trap focus ngoài modal/drawer.
- Escape đóng modal/drawer.
- Skip link tới main content.

## Screen reader

- Heading hierarchy đúng.
- Landmark:
  - header;
  - nav;
  - main;
  - footer.
- Form có label.
- Error có `aria-describedby`.
- Status submit có `aria-live`.
- Icon decorative có `aria-hidden`.

## Contrast

- Body text đạt tối thiểu 4.5:1.
- Large text đạt tối thiểu 3:1.
- Focus indicator đủ tương phản.
- Gold trên ivory phải được kiểm tra, không giả định là đạt.

## Motion

- Hỗ trợ `prefers-reduced-motion`.
- Không có flashing.
- Không có animation bắt buộc để hiểu.

## Language

- `lang="vi"` hoặc `lang="en"` đúng.
- Khi đổi ngôn ngữ, metadata và aria label đổi theo.

## Form

- Input có autocomplete.
- Không dùng placeholder thay label.
- Error không chỉ dựa vào màu.
- Required state rõ.
- Success state rõ.

### Acceptance Criteria

- [ ] Có skip link.
- [ ] Không có lỗi nghiêm trọng trong axe hoặc công cụ tương đương.
- [ ] Hoàn thành order request chỉ bằng keyboard.
- [ ] Hoàn thành QR ritual chỉ bằng keyboard.
- [ ] Focus không bị mất sau route transition.
- [ ] Mọi ảnh quan trọng có alt.
- [ ] Ảnh trang trí có alt rỗng.

---

## Epic P1.14 — Performance và Core Web Vitals

### Mục tiêu

Luxury không được đánh đổi bằng thời gian tải dài hoặc tương tác chậm.

### Ngân sách hiệu năng đề xuất

| Hạng mục | Ngân sách |
|---|---:|
| Initial JS gzip | ≤ 180–220 KB |
| CSS gzip | ≤ 45 KB |
| Hero image mobile | ≤ 250 KB |
| Hero image desktop | ≤ 450 KB |
| Product card image | ≤ 120 KB |
| Font files initial | ≤ 180 KB |
| LCP mobile | ≤ 2.5–3.0 s |
| CLS | ≤ 0.1 |
| INP | ≤ 200–250 ms |

Các ngưỡng phải đo trên staging và thiết bị thực, không chỉ máy phát triển.

### Công việc

- Route-level code splitting.
- Lazy load Three.js hoặc loại khỏi route không cần.
- Không tải Story canvas ở homepage.
- Preload đúng hero image.
- Responsive `srcset`.
- `width` và `height` cho ảnh.
- Font subset tiếng Việt.
- `font-display: swap`.
- Không preload quá nhiều.
- Defer analytics không thiết yếu.
- Giảm DOM.
- Không animate layout property.
- Cache asset.
- Compression.
- Remove unused icon imports.

### Story 3D

StoryLotusCanvas chỉ nên tải khi:

- Người dùng vào Story Page.
- Thiết bị đủ khả năng.
- Không bật reduced motion.
- Không bật data saver nếu có thể nhận biết.

Phải có ảnh fallback đầy đủ.

### Acceptance Criteria

- [ ] LCP element được xác định.
- [ ] Hero không lazy load.
- [ ] Ảnh dưới fold được lazy load.
- [ ] Không có ảnh thiếu kích thước.
- [ ] Three.js không nằm trong initial bundle của mọi route.
- [ ] Lighthouse mobile đạt baseline đã thống nhất.
- [ ] Không có long task lớn do cursor/particle.

---

## Epic P1.15 — Trust layer và bằng chứng sản phẩm

### Mục tiêu

Tăng cảm giác cao cấp bằng độ tin cậy, không chỉ bằng hình ảnh.

### Trust layer gồm

- Trạng thái sản phẩm.
- Thành phần.
- Quy trình nguyên mẫu.
- Nguồn nguyên liệu.
- Thông tin kiểm nghiệm.
- Điều kiện bảo quản.
- Dịch vụ.
- Chính sách.
- Truy xuất.
- Minh bạch giới hạn.

### Mô hình hiển thị

```text
Đã xác lập
Đang kiểm chứng
Sẽ bổ sung trước thương mại
```

### Product proof block

Ví dụ Petal Pack:

```text
Cấu trúc nguyên mẫu
- Một búp sen chứa túi lọc trà.
- Định lượng cho một lần pha.
- Sấy bơm nhiệt ở thông số thử nghiệm hiện tại.

Đang kiểm chứng
- Độ ẩm sau sấy.
- Hoạt độ nước.
- Chỉ tiêu vi sinh.
- Hạn sử dụng.
- Độ ổn định hương.
```

### Nguồn gốc

Không hiển thị bản đồ, blockchain hoặc chứng nhận nếu dữ liệu chưa đủ.

QR/truy xuất trong P1 chỉ nên trình bày:

- Mã sản phẩm.
- Lô.
- Nguồn dữ liệu đã có.
- Tài liệu kiểm chứng đã có.
- Câu chuyện vùng nguyên liệu.

Không ghi:

```text
100% xác thực
Chống hàng giả tuyệt đối
Blockchain bảo đảm chất lượng
```

### Acceptance Criteria

- [ ] Có trust block trên product detail.
- [ ] Claim có trạng thái.
- [ ] Không dùng badge chứng nhận không tồn tại.
- [ ] Không tuyên bố blockchain thay kiểm nghiệm.
- [ ] Có link tới chính sách và hỗ trợ.
- [ ] Người dùng biết sản phẩm là prototype hay thương mại.

---

## Epic P1.16 — Chuẩn hóa nội dung văn hóa

### Mục tiêu

Xây một content system có chiều sâu nhưng không lặp và không phóng đại.

### Ba tầng nội dung

## Tầng 1 — Microcopy

- 5–20 từ.
- Gắn với thao tác.
- Xuất hiện trên packaging, button, step.

Ví dụ:

```text
Tách nhẹ cánh ngoài. Giữ nguyên búp sen.
```

## Tầng 2 — Short story

- 60–150 từ.
- Gắn với một sản phẩm hoặc thời điểm.
- Dùng trên product detail, QR timer, Gift Set card.

## Tầng 3 — Long-form editorial

- 500–1200 từ.
- Có nguồn, tác giả hoặc quy trình duyệt.
- Dùng trên Story/Journal.
- Không chặn luồng mua hàng.

### Taxonomy nội dung

```text
Brand
Product
Ritual
Material
Region
Gifting
Season
People
Validation
```

### Data model

```ts
type CulturalContent = {
  id: string;
  type:
    | "brand"
    | "product"
    | "ritual"
    | "material"
    | "region"
    | "gifting"
    | "season"
    | "people";
  title: string;
  summary: string;
  body?: string[];
  productIds?: ProductId[];
  sources?: {
    label: string;
    url?: string;
    note?: string;
  }[];
  reviewStatus: "draft" | "reviewed" | "approved";
  reviewedBy?: string;
  updatedAt: string;
};
```

### Quy tắc factuality

- Không khẳng định “sen đại diện duy nhất cho…” nếu không có nguồn.
- Không mô tả nghi thức Senova như nghi lễ lịch sử.
- Phải phân biệt:
  - truyền thống;
  - cảm hứng;
  - nghi thức do Senova thiết kế.
- Không dùng từ “di sản” như chứng nhận pháp lý hoặc UNESCO nếu không có cơ sở.
- Không gán tác dụng sức khỏe chưa được chứng minh.

### Acceptance Criteria

- [ ] Nội dung có review status.
- [ ] Nội dung dài không hard-code trong component.
- [ ] Có phiên bản song ngữ.
- [ ] Không lặp cùng một đoạn trên nhiều route.
- [ ] Không có claim lịch sử không nguồn.
- [ ] QR dùng short story đúng thời điểm.

---

## Epic P1.17 — Nâng cấp trải nghiệm quà tặng

### Mục tiêu

Gift Set phải được thiết kế như dịch vụ trao tặng, không chỉ là hộp sản phẩm lớn hơn.

### Flow

```text
Chọn dịp
→ Chọn người nhận
→ Chọn cấu hình
→ Viết lời nhắn
→ Chọn thời gian
→ Gửi yêu cầu
```

### Use case

- Quà cá nhân.
- Quà tri ân.
- Quà doanh nghiệp.
- Sự kiện.
- Quà văn hóa.
- Tasting.

### Gifting Page

Cấu trúc:

```text
Hero
→ Chọn dịp
→ Cấu hình Gift Set
→ Trình tự mở hộp
→ Lời nhắn
→ Dịch vụ doanh nghiệp
→ FAQ
→ CTA tư vấn
```

### Gift configuration data

```ts
type GiftConfiguration = {
  occasion: string;
  recipientType: string;
  quantityRange: string;
  productMix: ProductId[];
  message?: string;
  brandingOption?: string;
  desiredDate?: string;
};
```

### Acceptance Criteria

- [ ] Gift Set không chỉ dẫn tới product detail chung.
- [ ] Người dùng chọn được dịp và số lượng.
- [ ] Lời nhắn là một phần cấu hình.
- [ ] Có thời gian chuẩn bị.
- [ ] Không hứa cá nhân hóa chưa có năng lực vận hành.
- [ ] Form doanh nghiệp không trộn với form mua cá nhân.

---

## Epic P1.18 — Footer và policy layer

### Mục tiêu

Footer phải tăng độ tin cậy, không chỉ là vùng trang trí.

### Cấu trúc footer

```text
SENOVA by Calmora
Mô tả ngắn

Khám phá
- Sản phẩm
- Nghi thức
- Câu chuyện
- Quà tặng

Dịch vụ
- Đặt trước
- Hợp tác
- Liên hệ

Thông tin
- Giao hàng
- Đổi sản phẩm lỗi
- Bảo mật
- Điều khoản

Liên hệ
- Email
- Zalo
- Thời gian phản hồi
```

### Yêu cầu

- Không hiển thị route mock.
- Không hiển thị “account” nếu không có account thật.
- Không dùng địa chỉ hoặc pháp nhân chưa chốt.
- Không dùng mạng xã hội chưa vận hành.
- Có copyright và trạng thái dự án.

### Acceptance Criteria

- [ ] Footer có chính sách tối thiểu.
- [ ] Contact thật và hoạt động.
- [ ] Không có link chết.
- [ ] Nội dung song ngữ nhất quán.
- [ ] Không lặp quá nhiều slogan.

---

## Epic P1.19 — SEO và metadata

### Mục tiêu

Metadata phản ánh đúng nội dung và trạng thái dự án.

### Title format

```text
Senova Petal Pack — Trà sen trải nghiệm | Senova
```

Không dùng:

```text
Luxury Premium Best Lotus Tea Vietnam
```

### Metadata cần có

- Title.
- Description.
- Canonical.
- Open Graph.
- Twitter card nếu dùng.
- Product structured data chỉ khi dữ liệu phù hợp.
- Organization/brand data.
- Breadcrumb.
- Sitemap.
- Robots.

### Product schema

Không khai báo:

- `InStock`;
- giá chính thức;
- review rating;
- aggregate rating;

nếu dữ liệu chưa thật.

Có thể dùng:

- Brand.
- Name.
- Description.
- Image.
- URL.
- Offer trạng thái pre-order chỉ khi đúng schema và đúng vận hành.

### Acceptance Criteria

- [ ] Mỗi route có title riêng.
- [ ] Không duplicate description.
- [ ] Canonical đúng.
- [ ] OG image đúng tỷ lệ.
- [ ] Không khai báo rating giả.
- [ ] Sitemap không chứa route mock/private.

---

## Epic P1.20 — Design QA và visual regression

### Mục tiêu

Biến “đẹp” thành tiêu chí có thể kiểm tra.

### Screenshot matrix

| Route | 390 px | 768 px | 1440 px |
|---|---:|---:|---:|
| Homepage | ✓ | ✓ | ✓ |
| Products | ✓ | ✓ | ✓ |
| Petal Pack | ✓ | ✓ | ✓ |
| Classic | ✓ | ✓ | ✓ |
| Gift Set | ✓ | ✓ | ✓ |
| Ritual | ✓ | ✓ | ✓ |
| QR Experience | ✓ | ✓ | ✓ |
| Order Request | ✓ | ✓ | ✓ |
| Gifting | ✓ | ✓ | ✓ |
| Story | ✓ | ✓ | ✓ |

### Kiểm tra

- Header.
- Hero.
- Text wrapping.
- Image crop.
- Button alignment.
- Section spacing.
- Form.
- Error.
- Loading.
- Empty.
- Footer.
- Language switch.
- Reduced motion.
- Dark surface.

### Visual debt register

Tạo file:

```text
docs/design/visual-debt.md
```

Mỗi vấn đề:

```md
## VD-001 — Product card radius không nhất quán

- Route:
- Component:
- Mức độ:
- Ảnh:
- Token liên quan:
- Cách sửa:
- Trạng thái:
```

### Acceptance Criteria

- [ ] Có screenshot baseline.
- [ ] Có visual debt register.
- [ ] Có checklist review trước merge.
- [ ] Không merge UI lớn nếu chưa test 390 và 1440 px.
- [ ] Có người phê duyệt nội dung và người phê duyệt UI.

---

# 6. Kiến trúc thông tin P1

## 6.1. Sitemap công khai đề xuất

```text
/
├── products
│   ├── classic
│   ├── petal-pack
│   └── gift-set
├── ritual
├── story
│   ├── brand
│   ├── petal-pack
│   ├── classic
│   └── gift-set
├── gifting
├── order-request
├── order-request/success
├── experience/:product
├── q/:code
├── contact
├── partners
├── shipping
├── returns
├── privacy
└── terms
```

## 6.2. Route không ưu tiên hoặc cần ẩn

```text
/collections
/search
/wishlist
/bag
/checkout
/account
/account/orders
/order-status
```

Chỉ giữ nếu có yêu cầu sản phẩm thật và backend tương ứng.

## 6.3. Navigation mapping

| Nav | Route | Mục tiêu |
|---|---|---|
| Sản phẩm | `/products` | Hiểu hệ sản phẩm |
| Nghi thức | `/ritual` | Học cách trải nghiệm |
| Câu chuyện | `/story` | Hiểu thương hiệu và văn hóa |
| Quà tặng | `/gifting` | Khởi tạo nhu cầu quà |
| Đặt trước | `/order-request` | Gửi yêu cầu |

---

# 7. Component architecture đề xuất

## 7.1. Branding

```text
shared/components/branding/
├── BrandLockup.tsx
├── BrandMark.tsx
├── BrandWordmark.tsx
└── BrandEndorsement.tsx
```

## 7.2. Layout

```text
shared/components/layout/
├── SiteHeader.tsx
├── MobileNavigation.tsx
├── SiteFooter.tsx
├── PageContainer.tsx
├── EditorialSection.tsx
├── DarkSection.tsx
└── StickyActionBar.tsx
```

## 7.3. Typography

```text
shared/components/typography/
├── DisplayHeading.tsx
├── SectionHeading.tsx
├── Eyebrow.tsx
├── LeadText.tsx
├── BodyText.tsx
└── Caption.tsx
```

## 7.4. Media

```text
shared/components/media/
├── ResponsiveImage.tsx
├── ProductMedia.tsx
├── ImageFrame.tsx
├── MediaGallery.tsx
├── VideoPreview.tsx
└── ImageStatusLabel.tsx
```

## 7.5. Commerce / Pre-order

```text
features/order-request/components/
├── ProductConfiguration.tsx
├── QuantitySelector.tsx
├── IntentSelector.tsx
├── GiftOptions.tsx
├── OrderSummary.tsx
└── ServicePromise.tsx
```

## 7.6. Content

```text
features/content/
├── brandContent.ts
├── productContent.ts
├── productUsage.ts
├── culturalContent.ts
├── serviceContent.ts
├── trustContent.ts
└── imageManifest.ts
```

---

# 8. Content schema đề xuất

## 8.1. Product content

```ts
type ProductContent = {
  id: ProductId;
  name: string;
  role: "Giữ" | "Mở" | "Trao";
  tagline: string;
  description: string;
  shortDescription: string;

  status: {
    code: "concept" | "prototype" | "validation" | "preorder" | "available";
    label: string;
    note: string;
  };

  commerce: {
    priceType: "estimated" | "fixed" | "contact";
    priceLabel: string;
    preparationTime?: string;
    deliveryScope?: string;
  };

  composition: {
    ingredients: string[];
    quantity?: string;
    includedItems: string[];
  };

  usageSpecId: string;
  culturalContentIds: string[];
  imageAssetIds: string[];
};
```

## 8.2. Trust content

```ts
type TrustItem = {
  id: string;
  productId: ProductId;
  label: string;
  value: string;
  status: "confirmed" | "validating" | "planned";
  evidence?: string;
  updatedAt: string;
};
```

## 8.3. Service promise

```ts
type ServicePromise = {
  responseTime: string;
  preparationTime: string;
  confirmationChannels: string[];
  paymentMethod: string;
  cancellationNote: string;
  deliveryScope: string;
};
```

---

# 9. Quy chuẩn microcopy P1

## 9.1. Nguyên tắc

- Cụ thể.
- Không phóng đại.
- Không áp đặt cảm xúc.
- Không dùng quá nhiều từ Hán Việt nếu làm khó hiểu.
- Không dùng tiếng Anh khi có từ Việt rõ.
- Không dùng “premium”, “signature”, “exclusive” như bằng chứng.

## 9.2. CTA

### Nên dùng

```text
Khám phá Petal Pack
Xem nghi thức pha
Gửi yêu cầu đặt trước
Trao đổi về bộ quà
Đọc câu chuyện
Xem thông tin sản phẩm
```

### Không nên dùng

```text
Trải nghiệm ngay
Sở hữu ngay
Mua ngay
Unlock the story
Discover luxury
```

nếu luồng thực tế chưa tương ứng.

## 9.3. Trạng thái

```text
Đang hoàn thiện nguyên mẫu
Đang nhận đăng ký trải nghiệm
Đang nhận yêu cầu đặt trước
Tạm chưa nhận yêu cầu
```

## 9.4. Service

```text
Senova phản hồi trong 1–2 ngày làm việc.
Thời gian chuẩn bị được xác nhận theo từng cấu hình.
Thanh toán được thực hiện sau khi Senova xác nhận yêu cầu.
```

## 9.5. Trust

```text
Thông số này đang được kiểm chứng trên nguyên mẫu.
Kết quả kiểm nghiệm sẽ được bổ sung trước khi thương mại hóa.
Hình ảnh hiện tại là bản mô phỏng định hướng bao bì.
```

---

# 10. Kế hoạch thay đổi theo file trong repository

> Đường dẫn có thể thay đổi theo refactor. Danh sách này dùng để xác định vùng ảnh hưởng.

## 10.1. Theme và global style

```text
apps/frontend/src/shared/styles/theme.css
apps/frontend/src/shared/styles/global.css
```

Công việc:

- Tách token.
- Bỏ font-size 90% nếu đang áp dụng.
- Thêm semantic token.
- Chuẩn hóa reduced motion.
- Chuẩn hóa focus ring.
- Chuẩn hóa container và spacing.

## 10.2. Layout

```text
apps/frontend/src/app/layout/SiteLayout.tsx
apps/frontend/src/app/layout/SiteLayout.module.css
```

Công việc:

- Chuyển sang BrandLockup mới.
- Giảm nav.
- Gỡ ambient sound khỏi header.
- Chuẩn hóa mobile drawer.
- Cập nhật footer.
- Bổ sung skip link.
- Quản lý focus.

## 10.3. Button

```text
apps/frontend/src/shared/components/luxury/LuxuryButton.tsx
```

Công việc:

- Giảm gradient và sheen.
- Chuẩn hóa variant.
- Thêm loading.
- Thêm disabled.
- Không phụ thuộc pseudo-element quá phức tạp.
- Test contrast.

## 10.4. Motion

```text
apps/frontend/src/shared/motion/animationSystem.ts
apps/frontend/src/shared/styles/luxuryEffects.ts
apps/frontend/src/shared/components/ui/CustomCursor.tsx
```

Công việc:

- Loại particle.
- Giảm duration.
- Không áp animation global lên form.
- Route-level import.
- Reduced motion fallback.

## 10.5. Landing

```text
apps/frontend/src/features/landing/pages/SenovaLandingPage.tsx
apps/frontend/src/features/landing/sections/*
apps/frontend/src/features/content/luxuryCopy.ts
```

Công việc:

- Thêm intent section.
- Thêm proof/trust section.
- Sắp lại section.
- Chuẩn hóa Petal Pack ritual.
- Dùng image manifest.
- Giảm copy lặp.

## 10.6. Products

```text
apps/frontend/src/features/products/pages/ProductsPage.tsx
apps/frontend/src/features/products/pages/ProductDetailPage.tsx
```

Công việc:

- Hợp nhất component.
- Loại commerce mock style.
- Thêm trust layer.
- Thêm responsive media.
- Thêm service promise.
- Đồng bộ CTA P0.

## 10.7. Commerce mock

```text
apps/frontend/src/features/commerce/pages/index.tsx
```

Công việc:

- Tách các route còn dùng.
- Ẩn wishlist/account/search nếu chưa thật.
- Loại style pill và card phổ thông.
- Redirect chức năng trùng P0.
- Xóa code không còn dùng sau migration.

## 10.8. Story

```text
apps/frontend/src/features/story/pages/StoryPage.tsx
apps/frontend/src/shared/components/story/StoryLotusCanvas.tsx
```

Công việc:

- Lazy load thực sự.
- Không tải 3D toàn app.
- Thêm fallback.
- Giảm sticky phức tạp trên mobile.
- Tách long-form content khỏi component.

## 10.9. QR

```text
apps/frontend/src/features/qr/pages/ExperiencePage/*
apps/frontend/src/features/qr/components/*
```

Công việc P1:

- Áp dụng design token.
- Tinh chỉnh motion.
- Bổ sung media asset chuẩn.
- Accessibility.
- Performance.
- Không thay đổi logic P0 nếu không có bug.

## 10.10. Image assets

```text
apps/frontend/public/assets/products/
apps/frontend/src/features/content/imageManifest.ts
```

Công việc:

- Chuẩn hóa tên.
- Tạo AVIF/WebP.
- Ghi width/height.
- Tạo mobile crop.
- Loại file trùng.
- Gắn trạng thái concept/prototype/production.

---

# 11. Kế hoạch triển khai theo sprint

## Sprint P1-A — Brand foundation

### Công việc

- [ ] Chốt brand architecture.
- [ ] Chốt color decision.
- [ ] Tách design token.
- [ ] Chuẩn hóa typography.
- [ ] Chuẩn hóa spacing.
- [ ] Xây component showcase.
- [ ] Loại hard-code chính.

### Đầu ra

- Brand lockup.
- Token package.
- Typography scale.
- Grid specification.
- Component primitives.
- Migration guide.

## Sprint P1-B — Global layout

### Công việc

- [ ] Refactor header.
- [ ] Refactor mobile menu.
- [ ] Refactor footer.
- [ ] Bổ sung policy layer.
- [ ] Bổ sung accessibility baseline.
- [ ] Loại ambient sound khỏi header.
- [ ] Loại custom particle cursor.

### Đầu ra

- Layout thống nhất.
- Navigation mới.
- Footer tin cậy.
- Keyboard navigation cơ bản.

## Sprint P1-C — Homepage và Products

### Công việc

- [ ] Thiết kế homepage theo intent.
- [ ] Thêm trust section.
- [ ] Refactor products page.
- [ ] Refactor product cards.
- [ ] Thiết lập image placeholders.
- [ ] Chuẩn hóa Petal Pack emphasis.

### Đầu ra

- Homepage P1.
- Products Page P1.
- Component media system.

## Sprint P1-D — Product Detail và Gifting

### Công việc

- [ ] Refactor product detail.
- [ ] Thêm trust layer.
- [ ] Thêm service promise.
- [ ] Thêm disclosure.
- [ ] Thiết kế gifting flow.
- [ ] Tối ưu sticky action.

### Đầu ra

- Ba product detail đồng nhất.
- Gifting page.
- Mobile conversion flow.

## Sprint P1-E — Media, performance và accessibility

### Công việc

- [ ] Tích hợp asset pipeline.
- [ ] Tạo responsive image.
- [ ] Lazy load đúng.
- [ ] Tối ưu font.
- [ ] Tách bundle.
- [ ] Accessibility audit.
- [ ] Performance audit.

### Đầu ra

- Asset manifest.
- Performance baseline.
- Accessibility baseline.
- Lighthouse report.

## Sprint P1-F — QA và soft launch

### Công việc

- [ ] Visual regression.
- [ ] Device testing.
- [ ] Copy audit.
- [ ] SEO audit.
- [ ] Link audit.
- [ ] Analytics review.
- [ ] Soft launch.
- [ ] Thu thập hành vi.

### Đầu ra

- Release candidate.
- Visual debt register.
- QA evidence.
- P2 discovery list.

---

# 12. Backlog chi tiết

| ID | Hạng mục | Mức độ | Phụ thuộc |
|---|---|---:|---|
| P1-001 | Chốt brand architecture | Critical | P0 hoàn thành |
| P1-002 | Chốt digital color master | Critical | Brand review |
| P1-003 | Tách color token | Critical | P1-002 |
| P1-004 | Tách typography token | High | Không |
| P1-005 | Bỏ global font-size 90% | High | Typography QA |
| P1-006 | Chuẩn hóa spacing/grid | High | Không |
| P1-007 | Xây BrandLockup | High | P1-001 |
| P1-008 | Refactor header | Critical | P1-007 |
| P1-009 | Refactor mobile menu | Critical | P1-008 |
| P1-010 | Refactor footer | High | Policy content |
| P1-011 | Loại particle cursor | High | Không |
| P1-012 | Giảm global reveal motion | High | Motion token |
| P1-013 | Chuẩn hóa LuxuryButton | Critical | Token |
| P1-014 | Xây ResponsiveImage | Critical | Asset spec |
| P1-015 | Tạo image manifest | Critical | Asset inventory |
| P1-016 | Homepage intent selector | High | Content |
| P1-017 | Homepage proof section | High | Product data |
| P1-018 | Refactor Products Page | Critical | Component primitives |
| P1-019 | Refactor Product Card | Critical | P1-014 |
| P1-020 | Refactor Product Detail | Critical | P0 order flow |
| P1-021 | Product trust layer | Critical | Product evidence |
| P1-022 | Service promise block | High | Operational decision |
| P1-023 | Gifting page | High | Gift scope |
| P1-024 | Cultural content model | High | Content review |
| P1-025 | Lazy load Story 3D | High | Technical |
| P1-026 | Accessibility audit | Critical | Global layout |
| P1-027 | Performance audit | Critical | Media integration |
| P1-028 | SEO metadata audit | High | Route stabilization |
| P1-029 | Visual regression baseline | Critical | Main pages complete |
| P1-030 | Remove mock public routes | High | Product decision |
| P1-031 | Device QA | Critical | Release candidate |
| P1-032 | Soft launch | Critical | QA pass |

---

# 13. Ma trận kiểm thử P1

## 13.1. Brand consistency

| Case | Kỳ vọng |
|---|---|
| Header homepage | SENOVA là cấp chính |
| Header product page | Cùng lockup |
| Footer | Giải thích Calmora |
| OG image | Dùng đúng tên |
| EN locale | Brand order không đổi |
| Packaging mockup | Không mâu thuẫn kiến trúc |

## 13.2. Design token

| Case | Kỳ vọng |
|---|---|
| Button primary | Cùng màu ở mọi route |
| Dark section | Text đạt contrast |
| Focus | Hiển thị rõ |
| Error | Không chỉ dùng màu |
| Radius | Không có biến thể tùy ý |
| New component | Không hard-code HEX |

## 13.3. Responsive

| Case | Kỳ vọng |
|---|---|
| 360 px hero | Không tràn |
| 390 px product detail | CTA rõ |
| 430 px QR | Step vừa viewport |
| 768 px products | Không ép ba cột |
| 1024 px header | Không đè nav |
| 1440 px body | Không kéo dòng quá dài |

## 13.4. Performance

| Case | Kỳ vọng |
|---|---|
| Homepage first load | Không tải Story 3D |
| Hero | Eager/high priority |
| Below fold | Lazy |
| Image | Có width/height |
| Font | Swap |
| Cursor | Không tạo long task |
| Route transition | Không block main thread |

## 13.5. Accessibility

| Case | Kỳ vọng |
|---|---|
| Tab navigation | Thứ tự đúng |
| Skip link | Hoạt động |
| Mobile drawer | Focus trap |
| Escape | Đóng drawer |
| Form error | Screen reader nhận |
| Image decorative | Alt rỗng |
| Locale | Lang đúng |

## 13.6. Content trust

| Case | Kỳ vọng |
|---|---|
| Prototype image | Có ghi chú |
| Unverified data | Có trạng thái |
| Blockchain | Không claim tuyệt đối |
| Cultural claim | Có review |
| Health claim | Không xuất hiện nếu chưa duyệt |
| Price | Ghi rõ dự kiến hay cố định |

---

# 14. Definition of Done

P1 chỉ được xem là hoàn thành khi:

- [ ] Brand architecture được áp dụng trên toàn website.
- [ ] Design token là nguồn duy nhất cho màu, typography, spacing và motion.
- [ ] Header và footer đã được chuẩn hóa.
- [ ] Không còn particle cursor trong production.
- [ ] Không còn global blur/reveal trên form.
- [ ] Homepage có intent-based navigation.
- [ ] Petal Pack được nhấn mạnh đúng vai trò signature.
- [ ] Products Page và Product Detail dùng cùng hệ component.
- [ ] Có trust layer cho sản phẩm.
- [ ] Có image manifest và responsive image.
- [ ] Ảnh concept/prototype/production được phân loại.
- [ ] Mobile QA pass ở 360–430 px.
- [ ] Keyboard navigation pass.
- [ ] Reduced motion pass.
- [ ] Performance đạt ngân sách đã thống nhất hoặc có exception được ghi nhận.
- [ ] SEO không chứa route mock và dữ liệu giả.
- [ ] Visual regression baseline đã được lưu.
- [ ] Không có claim văn hóa, sức khỏe hoặc kỹ thuật chưa được kiểm soát.
- [ ] Không có link chết ở navigation và footer.
- [ ] P0 funnel không bị phá sau refactor.

---

# 15. Các quyết định cần chốt

## D-01 — Brand chính trên website

```text
SENOVA
by Calmora
```

Trạng thái: Chưa phê duyệt cuối.

## D-02 — Màu xanh master

Cần đối chiếu:

- source code;
- logo;
- bao bì;
- in ấn;
- màn hình.

Trạng thái: Chưa freeze.

## D-03 — Custom cursor

Khuyến nghị:

```text
Loại khỏi production.
```

## D-04 — Ambient sound

Khuyến nghị:

```text
Chỉ dùng trong ritual/experience, mặc định tắt.
```

## D-05 — Story 3D

Khuyến nghị:

```text
Giữ như enhancement trên Story Page, không là nội dung bắt buộc.
```

## D-06 — Route commerce mock

Khuyến nghị:

```text
Ẩn hoặc loại khỏi public sitemap cho đến khi có backend thật.
```

## D-07 — Ảnh AI

Khuyến nghị:

```text
Được dùng như concept, không dùng như bằng chứng sản phẩm thương mại.
```

## D-08 — Language

Khuyến nghị:

- Tiếng Việt là mặc định.
- Tiếng Anh là bản dịch đầy đủ, không dịch một phần.
- Không dùng thuật ngữ Anh xen kẽ nếu không có lý do.

---

# 16. Rủi ro P1

## 16.1. Làm lại UI trước khi P0 ổn định

Hệ quả:

- Refactor hai lần.
- Route thay đổi.
- CTA mâu thuẫn.
- Tốn thời gian.

Kiểm soát:

- P0 release gate.
- Không thay logic order trong sprint visual.

## 16.2. Đồng nhất quá mức làm mất tính đặc trưng

Hệ quả:

- Website trông như template.
- Mọi section giống nhau.

Kiểm soát:

- Component thống nhất, composition linh hoạt.
- Art direction khác theo mục tiêu.
- Petal Pack có signature composition riêng.

## 16.3. Luxury làm giảm khả năng đọc

Hệ quả:

- Font nhỏ.
- Contrast thấp.
- Tracking rộng.
- Form khó dùng.

Kiểm soát:

- Accessibility gate.
- Body ≥16 px.
- Contrast test.
- Device QA.

## 16.4. Ảnh đẹp nhưng sai sản phẩm

Hệ quả:

- Kỳ vọng sai.
- Mất tin cậy.
- Mâu thuẫn nguyên mẫu.

Kiểm soát:

- Asset status.
- Product owner approval.
- Concept label.

## 16.5. Tối ưu hình ảnh không đúng

Hệ quả:

- Ảnh mờ.
- Crop sai.
- Màu sai.
- LCP cao.

Kiểm soát:

- Desktop/mobile crop.
- QA art direction.
- Dùng source đủ lớn.
- Đo trên thiết bị.

## 16.6. Content luxury trở nên sáo rỗng

Hệ quả:

- Nhiều từ “tinh tế”, “cao cấp”, “truyền thống”.
- Ít thông tin thực.

Kiểm soát:

- Claim phải gắn với bằng chứng hoặc hành động.
- Copy review.
- Trust layer.

---

# 17. KPI sau P1

## 17.1. UX

- Tỷ lệ click đúng CTA chính.
- Tỷ lệ người dùng chọn intent trên homepage.
- Tỷ lệ product detail → order request.
- Thời gian tìm thấy thành phần.
- Thời gian tìm thấy hướng dẫn.
- Tỷ lệ thoát ở header/mobile menu.

## 17.2. Brand

- Tỷ lệ người dùng nhớ tên `Senova`.
- Tỷ lệ phân biệt được ba dòng sản phẩm.
- Tỷ lệ hiểu Petal Pack là sản phẩm chính.
- Tỷ lệ hiểu Calmora là đơn vị phát triển.

## 17.3. Performance

- LCP.
- CLS.
- INP.
- JS bundle.
- Hero image weight.
- Font load time.
- Error rate.

## 17.4. Accessibility

- Số lỗi nghiêm trọng.
- Tỷ lệ hoàn thành bằng keyboard.
- Tỷ lệ field có label.
- Tỷ lệ ảnh có alt đúng.
- Tỷ lệ route có heading structure đúng.

## 17.5. Baseline đề xuất

Các ngưỡng sau là mục tiêu khởi đầu, cần điều chỉnh bằng dữ liệu thật:

- Homepage intent interaction: ≥20%.
- Product detail → order request start: tăng tối thiểu 20% so với baseline P0.
- Order request completion: không giảm sau refactor.
- Mobile bounce: giảm tối thiểu 10% tương đối.
- LCP mobile: ≤3 giây trên staging thực tế.
- CLS: ≤0.1.
- Accessibility critical issue: 0.
- Broken public link: 0.

---

# 18. P1 không bao gồm

Các hạng mục sau không thuộc P1, trừ khi có quyết định riêng:

- Thanh toán trực tuyến.
- Account thật.
- Loyalty.
- Wishlist thật.
- Recommendation engine.
- Dashboard admin đầy đủ.
- Blockchain production.
- QR chống hàng giả tuyệt đối.
- Multilingual CMS hoàn chỉnh.
- AR/VR.
- Gamification.
- Native mobile app.
- Marketing automation.
- Personalization theo người dùng.
- A/B testing platform đầy đủ.

Các hạng mục này có thể nằm ở P2 hoặc roadmap thương mại.

---

# 19. Checklist review trước khi phát hành

## Brand

- [ ] SENOVA là tên chính.
- [ ] Calmora ở cấp bảo chứng.
- [ ] Logo đúng biến thể.
- [ ] Không kéo giãn logo.
- [ ] Không dùng nhiều tagline cạnh nhau.

## UI

- [ ] Token đúng.
- [ ] Radius đúng.
- [ ] Button đúng variant.
- [ ] Không card lồng card.
- [ ] Không shadow thừa.
- [ ] Không gradient ngoài hệ thống.

## Content

- [ ] Petal Pack dùng hướng dẫn đúng.
- [ ] Không claim quá mức.
- [ ] Trạng thái prototype rõ.
- [ ] Giá ghi rõ loại.
- [ ] Nội dung song ngữ đủ.

## Images

- [ ] Đúng tỷ lệ.
- [ ] Không méo.
- [ ] Có mobile crop.
- [ ] Có alt.
- [ ] Có status.
- [ ] Dung lượng đạt ngân sách.

## Responsive

- [ ] 360 px.
- [ ] 390 px.
- [ ] 430 px.
- [ ] 768 px.
- [ ] 1440 px.

## Accessibility

- [ ] Keyboard.
- [ ] Focus.
- [ ] Contrast.
- [ ] Label.
- [ ] Error.
- [ ] Reduced motion.

## Performance

- [ ] LCP.
- [ ] CLS.
- [ ] INP.
- [ ] Bundle.
- [ ] Fonts.
- [ ] Images.

## Functional regression

- [ ] Product → Order Request.
- [ ] QR → Ritual.
- [ ] Ritual → Feedback.
- [ ] Feedback → Order Request.
- [ ] Redirect route cũ.
- [ ] Language switch.

---

# 20. Kết luận

P1 không nhằm làm website “nhiều hiệu ứng hơn”. P1 nhằm thiết lập một hệ thống trong đó cảm giác sang trọng được tạo ra bởi:

```text
Nhận diện rõ
+ sản phẩm đúng
+ typography có nhịp
+ hình ảnh có kiểm soát
+ thông tin đáng tin
+ dịch vụ minh bạch
+ tương tác tiết chế
+ hiệu năng ổn định
```

Cấu trúc ưu tiên của P1:

```text
Một kiến trúc thương hiệu
Một design system
Một hệ component
Một quy chuẩn hình ảnh
Một lớp bằng chứng
Một tiêu chuẩn responsive
Một tiêu chuẩn accessibility
Một quy trình QA
```

Sau P1, website Senova phải đủ nhất quán để bổ sung hình ảnh, nội dung và chức năng mới mà không cần thiết kế lại từ đầu. Hình ảnh được bổ sung sau sẽ đóng vai trò nâng chất lượng art direction, không còn phải bù đắp cho một cấu trúc UI/UX thiếu thống nhất.
