# SENOVA WEBSITE IMPLEMENTATION SPECIFICATION

**Repository:** `nmtrucworking/calmora`  
**Frontend:** React + TypeScript + Vite  
**Primary language:** Vietnamese  
**Frontend URL convention:** English slugs  
**Project:** Calmora | Senova  
**Document purpose:** Đặc tả đầy đủ để triển khai toàn bộ website Senova, gồm hệ thống nội dung thương hiệu, sản phẩm, trải nghiệm QR, biểu mẫu phản hồi, đăng ký đặt trước, liên hệ và các trang hỗ trợ.

---

## 1. Mục tiêu hệ thống

Website Senova không chỉ là trang giới thiệu sản phẩm. Hệ thống phải đóng vai trò là một không gian nội dung số kết nối sản phẩm vật lý với trải nghiệm trực tuyến.

Website cần đáp ứng các mục tiêu sau:

1. Giới thiệu thương hiệu Calmora và dự án Senova.
2. Trình bày đầy đủ ba dòng sản phẩm:
   - Senova Classic.
   - Senova Petal Pack.
   - Senova Gift Set.
3. Giải thích mạch kể thương hiệu **Giữ – Mở – Trao**.
4. Hướng dẫn người dùng mở, pha và thưởng thức sản phẩm.
5. Cho phép người dùng quét QR trên bao bì để truy cập đúng nội dung sản phẩm.
6. Thu thập phản hồi sau trải nghiệm.
7. Nhận đăng ký đặt trước, yêu cầu mẫu thử và nhu cầu hợp tác.
8. Cung cấp kênh liên hệ rõ ràng cho khách hàng và đối tác.
9. Tạo dữ liệu phục vụ cải tiến sản phẩm, nội dung và kế hoạch bán hàng.
10. Đảm bảo website có thể mở rộng sang thương mại điện tử khi sản phẩm được chuẩn hóa.

---

## 2. Phạm vi triển khai

Website bao gồm các nhóm chức năng sau:

- Trang thương hiệu.
- Trang câu chuyện văn hóa.
- Trang danh mục và chi tiết sản phẩm.
- Trang nghi thức thưởng trà.
- Trang nội dung theo mùa.
- Trang trải nghiệm sau khi quét QR.
- Trang phản hồi người dùng.
- Trang đăng ký đặt trước.
- Trang liên hệ.
- Trang hợp tác.
- Trang xác nhận hoàn tất biểu mẫu.
- Trang chính sách dữ liệu.
- Trang điều khoản sử dụng.
- Cơ chế QR redirect.
- Trang 404.
- SEO metadata.
- Theo dõi hành vi người dùng.
- Responsive và accessibility.

Hệ thống hiện chưa triển khai giỏ hàng, thanh toán trực tuyến hoặc quản lý đơn hàng đầy đủ. Luồng chính trong phiên bản này là:

```text
Khám phá sản phẩm
→ Đọc câu chuyện
→ Xem hướng dẫn
→ Quét QR hoặc mở trải nghiệm
→ Gửi phản hồi
→ Đăng ký đặt trước hoặc liên hệ
```

---

## 3. Nguyên tắc URL frontend

Toàn bộ URL frontend phải sử dụng tiếng Anh, chữ thường và dấu gạch ngang.

### Quy tắc

- Không dùng tiếng Việt có dấu trong URL.
- Không dùng URL lẫn tiếng Việt và tiếng Anh.
- Không dùng khoảng trắng.
- Không dùng chữ in hoa.
- Slug phải ngắn, ổn định và mô tả đúng nội dung.
- Nội dung giao diện vẫn sử dụng tiếng Việt.

### Ví dụ

```text
Đúng:
  /products/petal-pack
  /experience/petal-pack
  /feedback/petal-pack
  /pre-order
  /contact

Không dùng:
  /san-pham/petal-pack
  /trai-nghiem/petal-pack/mo-canh-sen
  /phan-hoi/petal-pack
  /dat-truoc
  /lien-he
```

---

## 4. Sitemap chính thức

```text
/
├── /about
├── /story
├── /ritual
├── /seasonal
│
├── /products
│   ├── /products/classic
│   ├── /products/petal-pack
│   └── /products/gift-set
│
├── /experience
│   ├── /experience/classic
│   ├── /experience/petal-pack
│   └── /experience/gift-set
│
├── /feedback/:productSlug
├── /pre-order
├── /contact
├── /partners
├── /thank-you
│
├── /privacy
├── /terms
│
├── /q/:code
└── /404
```

### Product slug hợp lệ

```ts
type ProductSlug = "classic" | "petal-pack" | "gift-set";
```

---

## 5. Cấu trúc điều hướng

## 5.1. Header navigation

Header desktop:

```text
Trang chủ
Giới thiệu
Sản phẩm
Câu chuyện
Nghi thức
Mùa sen
Liên hệ
```

Ánh xạ URL:

```ts
const mainNavigation = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Câu chuyện", href: "/story" },
  { label: "Nghi thức", href: "/ritual" },
  { label: "Mùa sen", href: "/seasonal" },
  { label: "Liên hệ", href: "/contact" },
];
```

Header mobile:

- Menu dạng drawer hoặc overlay.
- Có nút đóng rõ ràng.
- Cho phép điều hướng bằng bàn phím.
- Khóa scroll nền khi menu mở.
- Tự đóng sau khi chuyển route.
- Có CTA phụ: **Đăng ký trải nghiệm** → `/pre-order`.

---

## 5.2. Footer navigation

### Nhóm Khám phá

```text
Giới thiệu Senova → /about
Bộ sản phẩm → /products
Câu chuyện văn hóa → /story
Nghi thức thưởng trà → /ritual
```

### Nhóm Trải nghiệm

```text
Senova Classic → /products/classic
Senova Petal Pack → /products/petal-pack
Senova Gift Set → /products/gift-set
Mùa sen → /seasonal
```

### Nhóm Kết nối

```text
Đăng ký đặt trước → /pre-order
Liên hệ → /contact
Hợp tác → /partners
```

### Nhóm Chính sách

```text
Chính sách dữ liệu → /privacy
Điều khoản sử dụng → /terms
```

Footer phải hiển thị:

- Logo Calmora.
- Tên dự án Senova.
- Tagline.
- Email liên hệ.
- Copyright theo năm hiện tại.
- Liên kết mạng xã hội khi đã có kênh chính thức.

---

## 6. Trạng thái route và page component

Router phải ánh xạ route rõ ràng, không dùng một trang placeholder chung cho mọi URL không khớp.

```ts
const routes = {
  "/": "SenovaLandingPage",
  "/about": "AboutPage",
  "/story": "StoryPage",
  "/ritual": "RitualPage",
  "/seasonal": "SeasonalPage",
  "/products": "ProductsPage",
  "/products/:productSlug": "ProductDetailPage",
  "/experience/:productSlug": "ExperiencePage",
  "/feedback/:productSlug": "FeedbackPage",
  "/pre-order": "PreOrderPage",
  "/contact": "ContactPage",
  "/partners": "PartnersPage",
  "/thank-you": "ThankYouPage",
  "/privacy": "PrivacyPage",
  "/terms": "TermsPage",
  "/q/:code": "QrRedirectPage",
  "*": "NotFoundPage",
};
```

Không được để route không tồn tại hiển thị nội dung “Trang đang được chuẩn bị”.

---

# 7. Đặc tả từng trang

## 7.1. Trang chủ

**URL:** `/`  
**Component:** `SenovaLandingPage`

### Mục tiêu

- Giới thiệu Senova trong một màn hình đầu giàu nhận diện.
- Trình bày rõ ba lớp giá trị: sản phẩm, trải nghiệm và văn hóa.
- Dẫn người dùng đến sản phẩm, câu chuyện và trải nghiệm QR.

### Cấu trúc nội dung

#### Section 1 — Hero

- Eyebrow: `Calmora | Senova`
- H1: `Senova`
- Mô tả:
  > Một cánh sen mở ra trà hương sen, trải nghiệm giác quan và câu chuyện Việt trong hành trình Giữ – Mở – Trao.
- CTA chính: `Khám phá bộ sản phẩm` → `/products`
- CTA phụ: `Đọc câu chuyện Senova` → `/story`
- Scroll hint: `Cuộn để mở câu chuyện`

#### Section 2 — Ba trụ cột

```text
SẢN PHẨM
Trà hương sen là phần lõi của toàn bộ hệ Senova.

TRẢI NGHIỆM
Mỗi thao tác mở, cảm nhận, pha và thưởng thức được thiết kế có chủ đích.

VĂN HÓA
Senova đưa hình ảnh sen Việt vào sản phẩm, câu chuyện và ngữ cảnh trao tặng.
```

#### Section 3 — Giữ – Mở – Trao

```text
GIỮ
Senova Classic giữ trà hương sen trong một hình thức dễ tiếp cận và có thể sử dụng hằng ngày.

MỞ
Senova Petal Pack mở trải nghiệm bằng hình dáng búp sen, thao tác tách nhẹ cánh, cảm nhận hương và pha trà.

TRAO
Senova Gift Set kết nối trà, hướng dẫn pha và câu chuyện trong một món quà có tính trân trọng.
```

#### Section 4 — Bộ ba sản phẩm

Hiển thị ba card:

- Senova Classic.
- Senova Petal Pack.
- Senova Gift Set.

Mỗi card gồm:

- Ảnh.
- Tên.
- Vai trò.
- Tagline.
- Mô tả ngắn.
- CTA xem chi tiết.

#### Section 5 — Trải nghiệm QR

Nội dung:

> Mỗi sản phẩm Senova có thể kết nối với một trang nội dung số riêng. Người dùng quét QR để xem hướng dẫn, câu chuyện, hình ảnh và gửi phản hồi sau trải nghiệm.

CTA:

- `Mở trải nghiệm Petal Pack` → `/experience/petal-pack`
- `Tìm hiểu cách hoạt động` → `/ritual`

#### Section 6 — CTA cuối trang

- H2: `Một cánh sen không kể hết Việt Nam.`
- Mô tả:
  > Nhưng trong khoảnh khắc một người rót trà mời người khác ngồi lại, ta nhận ra một cách rất Việt để bắt đầu câu chuyện.
- CTA chính: `/story`
- CTA phụ: `/contact`

---

## 7.2. Trang giới thiệu

**URL:** `/about`  
**Component:** `AboutPage`

### Mục tiêu

- Giải thích Calmora là ai.
- Senova là gì.
- Phân biệt thương hiệu Calmora và dự án Senova.
- Trình bày sứ mệnh, định vị và mạch kể sản phẩm.

### Nội dung chính

#### Hero

- Eyebrow: `Giới thiệu`
- H1:
  > Calmora | Senova – trà sen trải nghiệm trong một câu chuyện Việt thống nhất.
- Mô tả:
  > Senova đưa trà hương sen, thiết kế trải nghiệm và nội dung văn hóa vào một hệ sản phẩm có thể sử dụng, cảm nhận và trao tặng.

#### Senova là gì?

> Senova là dự án trà sen trải nghiệm do Calmora phát triển. Dự án lấy trà hương sen làm sản phẩm lõi và tái thiết kế cách người dùng tiếp xúc với sản phẩm: từ một tách trà hằng ngày, đến thao tác mở cánh sen có chủ đích, rồi trở thành một món quà có câu chuyện.

Quote:

> Senova bắt đầu từ một hành động nhỏ: rót trà và mời một người khác ngồi lại.

#### Calmora là gì?

> Calmora là thương hiệu phát triển Senova, đại diện cho định hướng làm mới sản phẩm truyền thống bằng thiết kế, trải nghiệm và công nghệ số. Calmora không thay thế trà sen truyền thống mà tìm cách đưa sản phẩm đến gần hơn với người dùng hiện đại.

#### Ba vai trò trong cùng một hệ sản phẩm

- **Giữ:** Classic.
- **Mở:** Petal Pack.
- **Trao:** Gift Set.

#### Giá trị Senova lựa chọn kể

1. Sen — chất liệu ký ức.
2. Trà — một lời mời ngồi lại.
3. Quà — sự trân trọng có chuẩn bị.

#### CTA

- `Xem bộ sản phẩm` → `/products`
- `Liên hệ trải nghiệm` → `/contact`

---

## 7.3. Trang câu chuyện

**URL:** `/story`  
**Component:** `StoryPage`

### Mục tiêu

- Kể câu chuyện thương hiệu bằng mạch Giữ – Mở – Trao.
- Giải thích cách Senova tiếp cận văn hóa.
- Tránh diễn giải sen như một biểu tượng tuyệt đối hoặc gắn sản phẩm với nghi lễ lịch sử chưa được chứng minh.

### Cấu trúc

#### Hero

- Eyebrow: `Câu chuyện văn hóa`
- H1: `Một cánh sen mở ra một câu chuyện Việt.`
- Mô tả:
  > Từ lời mời trà đến hành trình Giữ – Mở – Trao, Senova đưa văn hóa sen và thưởng trà vào một trải nghiệm hiện đại, có thể sử dụng và trao tặng.

#### Nội dung dẫn

> Senova không cố tái tạo nguyên vẹn một nghi thức cổ, cũng không gắn mỗi sản phẩm với một địa danh chỉ để tạo cảm giác bản địa. Dự án chọn cách kết nối những giá trị có thể tiếp tục sống trong hiện tại: giữ một hương vị quen, mở ra một trải nghiệm mới và trao đi một câu chuyện có ý nghĩa.

#### Timeline

- 01 — Giữ.
- 02 — Mở.
- 03 — Trao.

#### Hoạt cảnh

Có thể giữ hoạt cảnh hoa sen 3D như yếu tố thị giác. Hoạt cảnh không được thay thế nội dung văn hóa chính thức.

#### CTA

- `Khám phá sản phẩm` → `/products`
- `Xem nghi thức thưởng trà` → `/ritual`

---

## 7.4. Trang nghi thức thưởng trà

**URL:** `/ritual`  
**Component:** `RitualPage`

### Mục tiêu

- Trình bày chuỗi thao tác trải nghiệm.
- Giải thích đây là nghi thức do Senova thiết kế, không phải nghi lễ lịch sử.
- Là trang hướng dẫn dùng chung cho cả ba dòng sản phẩm.

### Hero

- Eyebrow: `Nghi thức trải nghiệm`
- H1: `Mở – cảm nhận – pha – chờ – thưởng thức.`
- Mô tả:
  > Một chuỗi thao tác do Senova thiết kế để người dùng dành sự chú ý cho hình dáng, hương vị và khoảng thời gian thưởng trà.

### Các bước

#### 01 / Nhìn

Quan sát hình dáng sản phẩm trước khi mở.

#### 02 / Mở

Mở sản phẩm theo hướng dẫn. Với Petal Pack, chỉ tách nhẹ cánh sen để cảm nhận hình dáng và hương, không tách rời toàn bộ cánh khỏi phần trà nếu phiên bản sản phẩm được thiết kế để pha cùng cánh sen.

#### 03 / Cảm nhận

Nhận biết hình dáng, chất liệu và hương trước khi rót nước.

#### 04 / Pha

Pha theo thông số in trên bao bì của đúng phiên bản sản phẩm.

#### 05 / Chờ

Dành thời gian để hương và vị dần hiện ra.

#### 06 / Thưởng thức

Quan sát màu nước, cảm nhận hương và vị.

### Theo từng dòng sản phẩm

- Classic — Giữ.
- Petal Pack — Mở.
- Gift Set — Trao.

### CTA

- `Chọn một hình thức thưởng trà` → `/products`
- `Mở trải nghiệm Petal Pack` → `/experience/petal-pack`

---

## 7.5. Trang Mùa sen

**URL:** `/seasonal`  
**Component:** `SeasonalPage`

### Mục tiêu

- Trình bày nội dung theo thời điểm.
- Bổ sung chiều sâu cho câu chuyện thương hiệu.
- Không biến địa danh thành nhãn trang trí.

### Cấu trúc

#### Hero

- Eyebrow: `Mùa sen`
- H1: `Những thời điểm để hương, ký ức và câu chuyện gặp nhau.`
- Mô tả:
  > Không gian nội dung theo mùa của Senova, nơi bối cảnh văn hóa được giới thiệu mà không biến địa danh thành nhãn trang trí cho sản phẩm.

#### Các chương nội dung

- Mùa hoa — Mở.
- Mùa thưởng trà — Giữ.
- Mùa trao tặng — Trao.

#### Nguyên tắc biên tập

- Không gọi sản phẩm là “nguyên bản”, “cổ truyền” hoặc “di sản” khi chưa có căn cứ.
- Chỉ dùng tên vùng nguyên liệu khi có dữ liệu truy xuất.
- Phân biệt rõ nội dung lịch sử, nội dung lấy cảm hứng và thiết kế của Senova.
- Mỗi địa danh chỉ là một bối cảnh, không đại diện cho toàn bộ văn hóa Việt Nam.

#### CTA

- `Khám phá câu chuyện Senova` → `/story`
- `Liên hệ hợp tác nội dung` → `/contact`

---

## 7.6. Trang danh mục sản phẩm

**URL:** `/products`  
**Component:** `ProductsPage`

### Mục tiêu

- Trình bày ba dòng sản phẩm trong một hệ thống thống nhất.
- Nhấn mạnh Petal Pack là sản phẩm chủ đạo.
- Cho phép chuyển nhanh đến từng trang chi tiết.

### Nội dung

#### Hero

- Eyebrow: `Bộ sản phẩm`
- H1: `Ba hình hài của một câu chuyện trà sen.`
- Mô tả:
  > Một tách trà để giữ. Một cánh sen để mở. Một món quà để trao.

#### Product sections

1. Senova Petal Pack.
2. Senova Classic.
3. Senova Gift Set.

Petal Pack phải được đặt ở vị trí ưu tiên về thị giác và nội dung.

#### Product journey

```text
Classic → Giữ
Petal Pack → Mở
Gift Set → Trao
```

#### CTA cuối trang

- `Đăng ký trải nghiệm` → `/pre-order`
- `Liên hệ tư vấn` → `/contact`

---

## 7.7. Trang Senova Classic

**URL:** `/products/classic`  
**Component:** `ProductDetailPage`

### Nội dung

- Eyebrow: `GIỮ / Nghi thức hằng ngày`
- H1: `Senova Classic`
- Tagline: `Giữ hương sen trong nhịp sống mỗi ngày.`

### Mô tả

> Dòng trà hương sen nền tảng, được trình bày trong hình thức thuận tiện để người dùng có thể pha và thưởng thức thường xuyên.

### Điểm nổi bật

- Một phần trà được định lượng cho một lần pha.
- Thao tác sử dụng gọn.
- Phù hợp dùng hằng ngày.
- Là điểm vào dễ tiếp cận của Senova.

### Phù hợp cho

- Sử dụng hằng ngày.
- Người làm việc văn phòng.
- Người mới tiếp cận trà hương sen.
- Người muốn duy trì một khoảng nghỉ đơn giản.

### Hành trình sử dụng

1. Mở gói.
2. Pha trà.
3. Chờ.
4. Thưởng thức.

### CTA

- `Đăng ký nhận thông tin` → `/pre-order?product=classic`
- `Mở trải nghiệm Classic` → `/experience/classic`

---

## 7.8. Trang Senova Petal Pack

**URL:** `/products/petal-pack`  
**Component:** `ProductDetailPage`

### Nội dung

- Eyebrow: `MỞ / Trải nghiệm chủ đạo`
- H1: `Senova Petal Pack`
- Tagline: `Mở một cánh sen, bắt đầu một khoảng lặng.`

### Mô tả

> Phần trà cho một lần pha, đặt trong túi lọc và được bao quanh bởi cánh sen sấy tạo hình búp sen.

### Lưu ý nội dung sản phẩm

Petal Pack cần được mô tả thống nhất:

- Bên trong là phần trà định lượng cho một lần pha.
- Bên ngoài là cánh sen tạo hình búp sen.
- Người dùng tách nhẹ cánh để quan sát và cảm nhận hương.
- Khi pha, thực hiện theo hướng dẫn của phiên bản sản phẩm.
- Không mô tả người dùng phải bỏ cánh sen nếu sản phẩm được thiết kế để pha cùng cánh.

### Điểm nổi bật

- Một phần trà tương ứng với một lần pha.
- Hình dáng búp sen tạo điểm chạm trực quan.
- Trải nghiệm mở – cảm nhận – pha – chờ – thưởng thức.
- Có nội dung QR tiếp nối trải nghiệm.
- Phù hợp booth, dùng thử và quà tặng nhỏ.

### CTA

- `Bắt đầu trải nghiệm` → `/experience/petal-pack`
- `Gửi phản hồi` → `/feedback/petal-pack`
- `Đăng ký đặt trước` → `/pre-order?product=petal-pack`

---

## 7.9. Trang Senova Gift Set

**URL:** `/products/gift-set`  
**Component:** `ProductDetailPage`

### Trạng thái

Gift Set được hiển thị với trạng thái:

```text
Đang hoàn thiện
```

Không công bố cấu phần chưa được chốt như thành phần bắt buộc.

### Nội dung

- Eyebrow: `TRAO / Quà tặng văn hóa`
- H1: `Senova Gift Set`
- Tagline: `Trao hương sen, gửi một lời trân trọng.`

### Mô tả

> Bộ quà kết hợp trà hương sen, Petal Pack, hướng dẫn pha và thẻ câu chuyện trong một hành trình trao tặng thống nhất.

### Điểm nổi bật

- Kết hợp sản phẩm, trải nghiệm và nội dung văn hóa.
- Có thể điều chỉnh lời nhắn theo dịp.
- Phù hợp quà tri ân, quà lưu niệm và quà đối tác.
- Có thể tiếp nối câu chuyện bằng QR.

### CTA

- `Đăng ký nhận thông tin` → `/pre-order?product=gift-set`
- `Liên hệ quà tặng` → `/contact?topic=gift-set`

---

## 7.10. Trang trải nghiệm Classic

**URL:** `/experience/classic`  
**Component:** `ExperiencePage`

### Mục tiêu

- Hỗ trợ người dùng sau khi quét QR.
- Trình bày cách pha, câu chuyện ngắn và biểu mẫu phản hồi.

### Nội dung

- Tên sản phẩm.
- Lô sản phẩm nếu có.
- Hướng dẫn pha.
- Hình ảnh minh họa.
- Câu chuyện ngắn.
- CTA phản hồi.
- CTA đặt trước.

### CTA

- `/feedback/classic`
- `/pre-order?product=classic`

---

## 7.11. Trang trải nghiệm Petal Pack

**URL:** `/experience/petal-pack`  
**Component:** `ExperiencePage`

### Hero

- H1: `Mở một cánh sen, bắt đầu một khoảng lặng.`

### Nội dung mở đầu

> Bạn đang cầm Senova Petal Pack — phần trà cho một lần pha, đặt trong túi lọc và được bao quanh bởi cánh sen sấy tạo hình búp sen.

### Các bước

1. Mở nhẹ.
2. Quan sát.
3. Cảm nhận hương.
4. Pha theo hướng dẫn.
5. Chờ.
6. Thưởng thức.
7. Gửi phản hồi.

### Câu chuyện ngắn

> Văn hóa không chỉ được hiểu bằng thông tin. Nó còn được ghi nhớ qua hình dáng, mùi hương, thao tác và cảm giác.

### CTA

- `Gửi phản hồi trải nghiệm` → `/feedback/petal-pack`
- `Xem câu chuyện Senova` → `/story`
- `Đăng ký đặt trước` → `/pre-order?product=petal-pack`

---

## 7.12. Trang trải nghiệm Gift Set

**URL:** `/experience/gift-set`  
**Component:** `ExperiencePage`

### Mục tiêu

- Hướng dẫn người nhận mở bộ quà.
- Trình bày lời nhắn.
- Giới thiệu từng thành phần.
- Dẫn đến trải nghiệm Classic hoặc Petal Pack.

### Nội dung

1. Mở hộp.
2. Đọc lời nhắn.
3. Xem cấu phần.
4. Chọn sản phẩm.
5. Đọc câu chuyện.
6. Gửi phản hồi.

### CTA

- `/feedback/gift-set`
- `/contact?topic=gift-set`
- `/products/gift-set`

---

## 7.13. Trang phản hồi

**URL:** `/feedback/:productSlug`  
**Component:** `FeedbackPage`

### Mục tiêu

Thu thập dữ liệu phục vụ:

- Đánh giá cảm quan.
- Đánh giá trải nghiệm bao bì.
- Đánh giá mức độ dễ sử dụng.
- Ý định mua.
- Ý định giới thiệu.
- Cải tiến sản phẩm.

### Form fields

```ts
type ProductFeedback = {
  productSlug: ProductSlug;
  batchCode?: string;
  overallRating: number;
  appearanceRating: number;
  aromaRating: number;
  tasteRating: number;
  easeOfUseRating: number;
  culturalStoryRating: number;
  purchaseIntent: "yes" | "maybe" | "no";
  expectedPrice?: string;
  mostMemorable?: string;
  improvementSuggestion?: string;
  email?: string;
  consent: boolean;
  submittedAt: string;
};
```

### Câu hỏi hiển thị

1. Bạn đang trải nghiệm sản phẩm nào?
2. Mã lô sản phẩm là gì?
3. Mức độ hài lòng tổng thể.
4. Mức độ ấn tượng với hình thức sản phẩm.
5. Mức độ dễ nhận biết hương.
6. Mức độ hài lòng với vị trà.
7. Mức độ dễ thao tác.
8. Câu chuyện văn hóa có giúp bạn hiểu sản phẩm hơn không?
9. Bạn có cân nhắc mua sản phẩm không?
10. Mức giá bạn dự kiến chấp nhận.
11. Điều khiến bạn nhớ nhất.
12. Điều cần cải tiến.
13. Email nếu muốn nhận thông tin.
14. Đồng ý cho Senova sử dụng dữ liệu phản hồi ở dạng tổng hợp.

### Validation

- Rating bắt buộc.
- Consent bắt buộc.
- Email phải đúng định dạng nếu được nhập.
- Không cho gửi lặp liên tục.
- Hiển thị trạng thái loading và lỗi.
- Thành công chuyển đến:

```text
/thank-you?type=feedback&product=petal-pack
```

---

## 7.14. Trang đăng ký đặt trước

**URL:** `/pre-order`  
**Component:** `PreOrderPage`

### Mục tiêu

- Nhận nhu cầu dùng thử.
- Nhận nhu cầu đặt trước.
- Đo lường quan tâm theo từng sản phẩm.
- Không thể hiện như một đơn hàng đã xác nhận thanh toán.

### Form fields

```ts
type PreOrderRequest = {
  fullName: string;
  email: string;
  phone?: string;
  productSlug: ProductSlug;
  quantity?: number;
  requestType: "information" | "sample" | "pre-order" | "gift-consultation";
  customerType: "individual" | "organization";
  note?: string;
  consent: boolean;
  submittedAt: string;
};
```

### Nội dung lưu ý

> Đây là biểu mẫu đăng ký nhận thông tin và đặt trước. Việc gửi biểu mẫu chưa tạo thành giao dịch thanh toán hoặc cam kết giao hàng.

### Thành công

```text
/thank-you?type=pre-order&product=petal-pack
```

---

## 7.15. Trang liên hệ

**URL:** `/contact`  
**Component:** `ContactPage`

### Mục tiêu

- Cung cấp một điểm liên hệ chính thức.
- Phân loại nhu cầu khách hàng.
- Hỗ trợ khách hàng cá nhân, đối tác và tổ chức.
- Thay thế việc chỉ dùng liên kết `mailto:`.

### Hero

- Eyebrow: `Liên hệ`
- H1: `Bắt đầu một cuộc trao đổi với Senova.`
- Mô tả:
  > Gửi yêu cầu về sản phẩm, mẫu thử, quà tặng, hợp tác hoặc nội dung văn hóa. Nhóm Senova sẽ phản hồi qua thông tin bạn cung cấp.

### Khối thông tin liên hệ

Hiển thị:

```text
Email: hello@senova.vn
Thương hiệu: Calmora
Dự án: Senova
Khu vực triển khai: TP. Hồ Chí Minh
Thời gian phản hồi dự kiến: 1–3 ngày làm việc
```

Chỉ hiển thị số điện thoại hoặc địa chỉ cụ thể khi nhóm xác nhận đó là thông tin công khai chính thức.

### Nhóm nhu cầu

```ts
type ContactTopic =
  | "product-information"
  | "sample-request"
  | "gift-set"
  | "partnership"
  | "event"
  | "cultural-content"
  | "technical-support"
  | "other";
```

### Form fields

```ts
type ContactRequest = {
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  topic: ContactTopic;
  productSlug?: ProductSlug;
  subject: string;
  message: string;
  preferredContactMethod: "email" | "phone";
  consent: boolean;
  submittedAt: string;
};
```

### Label giao diện

```text
Họ và tên
Email
Số điện thoại
Tổ chức
Nội dung cần trao đổi
Sản phẩm liên quan
Tiêu đề
Thông tin chi tiết
Phương thức phản hồi ưu tiên
Đồng ý với chính sách dữ liệu
```

### Topic hiển thị

```text
Thông tin sản phẩm
Yêu cầu mẫu thử
Tư vấn Gift Set
Hợp tác
Sự kiện và booth trải nghiệm
Nội dung văn hóa
Hỗ trợ kỹ thuật website/QR
Nội dung khác
```

### Validation

- Họ tên bắt buộc.
- Email bắt buộc và đúng định dạng.
- Topic bắt buộc.
- Subject tối thiểu 5 ký tự.
- Message tối thiểu 20 ký tự.
- Consent bắt buộc.
- Phone chỉ bắt buộc khi chọn phản hồi qua điện thoại.

### Trạng thái form

- Idle.
- Validating.
- Submitting.
- Success.
- Error.

### Thành công

Chuyển đến:

```text
/thank-you?type=contact
```

### CTA phụ

- `Xem bộ sản phẩm` → `/products`
- `Đăng ký đặt trước` → `/pre-order`
- `Tìm hiểu hợp tác` → `/partners`

---

## 7.16. Trang hợp tác

**URL:** `/partners`  
**Component:** `PartnersPage`

### Đối tượng

- Đơn vị cung cấp nguyên liệu.
- Đơn vị gia công.
- Cửa hàng quà tặng.
- Đơn vị tổ chức sự kiện.
- Trường học.
- Không gian văn hóa.
- Đối tác phân phối.
- Đối tác nghiên cứu và kiểm nghiệm.

### Nội dung

- Các nhóm hợp tác.
- Nguyên tắc hợp tác.
- Yêu cầu truy xuất.
- Quy trình trao đổi.
- CTA đến `/contact?topic=partnership`.

---

## 7.17. Trang cảm ơn

**URL:** `/thank-you`  
**Component:** `ThankYouPage`

### Query hợp lệ

```text
?type=feedback
?type=pre-order
?type=contact
?type=partnership
```

### Nội dung động

#### Feedback

> Phản hồi của bạn đã được ghi nhận. Dữ liệu sẽ được sử dụng để cải tiến sản phẩm và trải nghiệm Senova.

#### Pre-order

> Yêu cầu của bạn đã được ghi nhận. Nhóm Senova sẽ liên hệ khi có thông tin phù hợp với sản phẩm đã chọn.

#### Contact

> Nội dung liên hệ đã được gửi. Nhóm Senova dự kiến phản hồi trong 1–3 ngày làm việc.

### CTA

- `/`
- `/products`
- `/story`

---

## 7.18. Trang chính sách dữ liệu

**URL:** `/privacy`  
**Component:** `PrivacyPage`

### Nội dung tối thiểu

- Loại dữ liệu được thu thập.
- Mục đích sử dụng.
- Thời gian lưu trữ.
- Quyền yêu cầu cập nhật hoặc xóa dữ liệu.
- Không bán dữ liệu cá nhân.
- Dữ liệu khảo sát có thể được dùng ở dạng tổng hợp.
- Email liên hệ về dữ liệu.

Không đưa ra cam kết pháp lý vượt quá khả năng vận hành thực tế.

---

## 7.19. Trang điều khoản sử dụng

**URL:** `/terms`  
**Component:** `TermsPage`

### Nội dung tối thiểu

- Website phục vụ giới thiệu và thử nghiệm.
- Nội dung sản phẩm có thể được cập nhật.
- Hình ảnh mockup không mặc nhiên đại diện cho sản phẩm thương mại cuối cùng.
- Thông tin đặt trước chưa phải giao dịch thanh toán.
- Không sao chép tài sản thương hiệu trái phép.
- Giới hạn trách nhiệm đối với nội dung bên thứ ba.

---

## 7.20. QR redirect

**URL:** `/q/:code`  
**Component:** `QrRedirectPage`

### Mục tiêu

- Mã QR trên bao bì không trỏ trực tiếp đến URL dài.
- Cho phép thay đổi trang đích mà không cần in lại QR.
- Theo dõi lượt quét theo sản phẩm và lô.

### Ví dụ mã

```text
/q/PP-2601-A
/q/CL-2601-A
/q/GS-2601-A
```

### Data model

```ts
type QrRecord = {
  code: string;
  productSlug: ProductSlug;
  batchCode?: string;
  destination: string;
  active: boolean;
  createdAt: string;
  expiresAt?: string;
};
```

### Hành vi

1. Nhận `code`.
2. Chuẩn hóa mã.
3. Tra cứu dữ liệu.
4. Nếu hợp lệ:
   - Ghi nhận sự kiện scan.
   - Chuyển đến `/experience/:productSlug`.
   - Truyền `batchCode` bằng query param.
5. Nếu không hợp lệ:
   - Hiển thị lỗi QR.
   - Cho phép về `/products`.
6. Nếu mã bị vô hiệu hóa:
   - Hiển thị thông báo rõ ràng.
   - Không chuyển hướng âm thầm.

### Ví dụ

```text
/q/PP-2601-A
→ /experience/petal-pack?batch=PP-2601-A
```

---

## 7.21. Trang 404

**URL:** `*`  
**Component:** `NotFoundPage`

### Nội dung

- H1: `Không tìm thấy trang.`
- Mô tả:
  > Đường dẫn có thể đã thay đổi hoặc không tồn tại.
- CTA:
  - `Về trang chủ`
  - `Xem bộ sản phẩm`
  - `Liên hệ hỗ trợ`

Router không được chuyển route sai đến `SitePage`.

---

# 8. Luồng dữ liệu chính

## 8.1. Luồng khám phá

```text
Trang chủ
→ Danh mục sản phẩm
→ Chi tiết sản phẩm
→ Nghi thức hoặc trải nghiệm
→ Phản hồi
→ Đặt trước
```

## 8.2. Luồng QR

```text
QR trên sản phẩm
→ /q/:code
→ xác định SKU và batch
→ /experience/:productSlug
→ /feedback/:productSlug
→ /thank-you
```

## 8.3. Luồng liên hệ

```text
/contact
→ chọn topic
→ gửi form
→ lưu dữ liệu
→ gửi thông báo cho nhóm
→ /thank-you?type=contact
```

## 8.4. Luồng Gift Set

```text
/products/gift-set
→ /contact?topic=gift-set
hoặc
→ /pre-order?product=gift-set
```

---

# 9. Kiến trúc nội dung

Hiện nội dung không nên tiếp tục phân tán giữa:

- `content.json`.
- `products.ts`.
- Markdown.
- Copy hardcode trong component.

## 9.1. Đề xuất cấu trúc

```text
src/
├── content/
│   ├── brand.ts
│   ├── navigation.ts
│   ├── pages/
│   │   ├── home.ts
│   │   ├── about.ts
│   │   ├── story.ts
│   │   ├── ritual.ts
│   │   ├── seasonal.ts
│   │   ├── contact.ts
│   │   ├── partners.ts
│   │   ├── privacy.ts
│   │   └── terms.ts
│   ├── products/
│   │   ├── classic.ts
│   │   ├── petal-pack.ts
│   │   └── gift-set.ts
│   └── experience/
│       ├── classic.ts
│       ├── petal-pack.ts
│       └── gift-set.ts
│
├── pages/
│   ├── SenovaLandingPage/
│   ├── AboutPage/
│   ├── StoryPage/
│   ├── RitualPage/
│   ├── SeasonalPage/
│   ├── ProductsPage/
│   ├── ProductDetailPage/
│   ├── ExperiencePage/
│   ├── FeedbackPage/
│   ├── PreOrderPage/
│   ├── ContactPage/
│   ├── PartnersPage/
│   ├── ThankYouPage/
│   ├── PrivacyPage/
│   ├── TermsPage/
│   ├── QrRedirectPage/
│   └── NotFoundPage/
│
├── features/
│   ├── products/
│   ├── feedback/
│   ├── contact/
│   ├── preorder/
│   ├── qr/
│   └── analytics/
│
└── routes/
    ├── AppRouter.tsx
    └── routeConfig.ts
```

## 9.2. Yêu cầu

- Mỗi nội dung chỉ có một nguồn chính.
- Component không chứa đoạn văn dài hardcode.
- Product data phải dùng chung giữa danh mục, detail và experience.
- Navigation và footer lấy từ cùng một config.
- Metadata lấy từ page content.
- Không lặp lại slug bằng chuỗi rời rạc ở nhiều file.

---

# 10. Schema sản phẩm

```ts
type SenovaProduct = {
  id: ProductSlug;
  slug: ProductSlug;
  name: string;
  role: "Giữ" | "Mở" | "Trao";
  eyebrow: string;
  tagline: string;
  description: string;
  shortDescription: string;
  status: "active" | "draft" | "archived";
  image: string;
  heroAlt: string;
  suitableFor: string[];
  highlights: string[];
  experienceSteps: {
    title: string;
    text: string;
  }[];
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  seo: {
    title: string;
    description: string;
  };
};
```

---

# 11. Form submission layer

Frontend không nên gọi trực tiếp một email cá nhân bằng `mailto:` để xử lý form.

Có thể triển khai một trong các phương án:

- Supabase.
- Firebase.
- Formspree.
- Resend kết hợp serverless function.
- API backend riêng.
- Vercel Functions.

## 11.1. Endpoint đề xuất

```text
POST /api/feedback
POST /api/pre-orders
POST /api/contact
GET  /api/qr/:code
POST /api/analytics/events
```

## 11.2. Response chuẩn

```ts
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};
```

## 11.3. Chống lỗi và spam

- Honeypot field.
- Rate limit.
- Validation phía client và server.
- Không lưu HTML thô từ người dùng.
- Sanitize input.
- Không hiển thị chi tiết lỗi hệ thống ra giao diện.
- Ghi log lỗi có mã tham chiếu.
- Có retry hợp lý.
- Disable nút gửi khi đang submitting.

---

# 12. Analytics

## 12.1. Sự kiện cần theo dõi

```text
page_view
product_view
product_cta_click
qr_scan
experience_start
experience_step_view
feedback_start
feedback_submit
preorder_start
preorder_submit
contact_start
contact_submit
partner_inquiry
outbound_link_click
```

## 12.2. Thuộc tính sự kiện

```ts
type AnalyticsEvent = {
  eventName: string;
  path: string;
  productSlug?: ProductSlug;
  batchCode?: string;
  source?: string;
  timestamp: string;
};
```

## 12.3. Nguyên tắc

- Không thu dữ liệu cá nhân không cần thiết.
- Không lưu email trong analytics event.
- Phân biệt dữ liệu hành vi và dữ liệu biểu mẫu.
- Cho phép vô hiệu hóa analytics khi chưa có cơ chế consent phù hợp.

---

# 13. SEO

Mỗi trang phải có:

- `title`.
- `meta description`.
- Canonical URL.
- Open Graph title.
- Open Graph description.
- Open Graph image.
- Twitter card.
- `robots` phù hợp.
- Structured data khi có căn cứ.

## 13.1. URL canonical

```text
https://<domain>/
https://<domain>/about
https://<domain>/products/petal-pack
```

## 13.2. Structured data đề xuất

- `Organization` cho Calmora.
- `Brand` cho Senova.
- `Product` cho từng sản phẩm khi thông tin thương mại đủ rõ.
- `BreadcrumbList`.
- Không khai báo giá, tình trạng kho hoặc review nếu chưa có dữ liệu thật.

---

# 14. Accessibility

Yêu cầu tối thiểu:

- Có `alt` cho ảnh.
- Form có `label`.
- Error liên kết với field bằng `aria-describedby`.
- Có focus state.
- Modal và menu điều khiển được bằng bàn phím.
- Không dùng màu làm tín hiệu duy nhất.
- Tương phản chữ đạt mức đọc được.
- Tôn trọng `prefers-reduced-motion`.
- Hoạt cảnh 3D phải có fallback.
- CTA dùng `button` hoặc `a` đúng ngữ nghĩa.
- Heading theo đúng thứ tự H1 → H2 → H3.
- Không có nhiều hơn một H1 trên một page.

---

# 15. Responsive

Các breakpoint gợi ý:

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

Yêu cầu:

- Mobile-first.
- Form một cột trên mobile.
- Product card không bị crop nội dung quan trọng.
- QR page ưu tiên tốc độ tải.
- Ảnh responsive bằng `srcset` hoặc định dạng tối ưu.
- Hoạt cảnh nặng phải giảm hoặc tắt trên thiết bị yếu.
- Không bắt người dùng zoom để đọc.
- CTA chính luôn dễ chạm trên mobile.

---

# 16. Performance

- Lazy load route.
- Lazy load ảnh dưới fold.
- Preload ảnh hero cần thiết.
- Nén ảnh WebP/AVIF.
- Không tải Three.js cho trang không sử dụng.
- Code split theo route.
- Cache static asset.
- Không preload toàn bộ ảnh sản phẩm khi chưa cần.
- Theo dõi Core Web Vitals.
- QR experience phải ưu tiên tải nhanh hơn hiệu ứng.

Mục tiêu gợi ý:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

---

# 17. Trạng thái sản phẩm và nội dung

## Classic

```text
status: active
```

## Petal Pack

```text
status: active
```

## Gift Set

```text
status: draft
```

Khi `status = draft`:

- Hiển thị nhãn `Đang hoàn thiện`.
- Không hiển thị nút “Mua ngay”.
- Không công bố cấu phần như thông tin cố định.
- Dùng CTA `Đăng ký nhận thông tin` hoặc `Liên hệ tư vấn`.

---

# 18. Quy tắc nội dung

Không sử dụng các tuyên bố sau nếu chưa có chứng cứ:

- “100% tự nhiên”.
- “An toàn tuyệt đối”.
- “Tốt cho sức khỏe”.
- “Giảm căng thẳng”.
- “Giúp ngủ ngon”.
- “Di sản”.
- “Nguyên bản”.
- “Cổ truyền”.
- “Sản phẩm hữu cơ”.
- “Bảo quản X tháng” khi chưa kiểm nghiệm.

Có thể sử dụng:

- “Lấy cảm hứng từ”.
- “Được thiết kế theo hướng”.
- “Dự kiến”.
- “Phiên bản thử nghiệm”.
- “Trải nghiệm do Senova thiết kế”.
- “Nội dung văn hóa được biên tập”.
- “Cấu phần có thể thay đổi theo phiên bản”.

---

# 19. Acceptance criteria toàn hệ thống

Website được xem là hoàn thành khi:

1. Tất cả URL trong sitemap hoạt động.
2. Không còn route tiếng Việt.
3. Không còn route sai hiển thị placeholder.
4. Header và footer không có link chết.
5. Ba trang sản phẩm hiển thị đúng dữ liệu.
6. Gift Set hiển thị đúng trạng thái draft.
7. Ritual có page riêng.
8. Seasonal có page riêng.
9. Ba experience page hoạt động.
10. QR redirect hoạt động với mã hợp lệ và không hợp lệ.
11. Feedback form gửi được dữ liệu.
12. Pre-order form gửi được dữ liệu.
13. Contact form gửi được dữ liệu.
14. Thank-you page hiển thị nội dung đúng theo query.
15. Privacy và Terms có thể truy cập từ footer.
16. Có 404 thực.
17. Metadata thay đổi theo route.
18. Mobile navigation hoạt động.
19. Form validation hoạt động.
20. Có loading, success và error state.
21. Hỗ trợ bàn phím.
22. Tôn trọng reduced motion.
23. Không có lỗi console nghiêm trọng.
24. Build production thành công.
25. Tất cả ảnh có alt.
26. Không có nội dung sản phẩm mâu thuẫn giữa các trang.
27. URL QR tương thích trên mobile.
28. Dữ liệu phản hồi lưu đúng product và batch.
29. Không công khai dữ liệu cá nhân trên frontend.
30. Toàn bộ CTA quan trọng đều có đích đến thực.

---

# 20. Checklist triển khai

## Router

- [ ] Tạo route config chính thức.
- [ ] Thêm `/contact`.
- [ ] Thêm `/ritual`.
- [ ] Thêm `/seasonal`.
- [ ] Thêm `/experience/:productSlug`.
- [ ] Thêm `/feedback/:productSlug`.
- [ ] Thêm `/pre-order`.
- [ ] Thêm `/partners`.
- [ ] Thêm `/thank-you`.
- [ ] Thêm `/privacy`.
- [ ] Thêm `/terms`.
- [ ] Thêm `/q/:code`.
- [ ] Thêm 404.
- [ ] Loại bỏ fallback placeholder cho route sai.

## Nội dung

- [ ] Chuẩn hóa Giữ – Mở – Trao.
- [ ] Chuẩn hóa mô tả Petal Pack.
- [ ] Chuẩn hóa trạng thái Gift Set.
- [ ] Tách copy khỏi component.
- [ ] Tạo nguồn dữ liệu duy nhất cho sản phẩm.
- [ ] Đồng bộ navigation và footer.

## Form

- [ ] Feedback form.
- [ ] Pre-order form.
- [ ] Contact form.
- [ ] Validation.
- [ ] Consent.
- [ ] Error handling.
- [ ] Success redirect.
- [ ] Rate limit.
- [ ] Spam protection.

## QR

- [ ] QR record model.
- [ ] QR redirect page.
- [ ] Batch tracking.
- [ ] Invalid code state.
- [ ] Disabled code state.
- [ ] Scan analytics.

## SEO và kỹ thuật

- [ ] Metadata theo route.
- [ ] Canonical.
- [ ] Open Graph.
- [ ] Sitemap XML.
- [ ] Robots.txt.
- [ ] Structured data.
- [ ] Responsive.
- [ ] Accessibility.
- [ ] Performance.
- [ ] Analytics.
- [ ] Production build.
- [ ] Link testing.

---

# 21. Kết luận triển khai

Website Senova phải được triển khai như một hệ thống trải nghiệm số hoàn chỉnh, không chỉ là landing page giới thiệu.

Cấu trúc cuối cùng cần kết nối năm lớp:

```text
Thương hiệu
→ Sản phẩm
→ Nghi thức
→ Nội dung QR
→ Phản hồi và liên hệ
```

Trong đó:

- `Classic` đại diện cho **Giữ**.
- `Petal Pack` đại diện cho **Mở**.
- `Gift Set` đại diện cho **Trao**.
- `/experience/*` kết nối sản phẩm vật lý với nội dung số.
- `/feedback/*` tạo dữ liệu cải tiến.
- `/pre-order` đo lường nhu cầu.
- `/contact` là điểm tiếp nhận yêu cầu chính thức.
- `/q/:code` là lớp điều phối QR theo sản phẩm và lô.

Toàn bộ URL frontend phải dùng tiếng Anh; nội dung giao diện tiếp tục sử dụng tiếng Việt.
