# SENOVA — BRAND & TEAM LUXURY IMPLEMENTATION PLAN

> **Phạm vi:** Nâng cấp trang giới thiệu thương hiệu Calmora/Senova và bổ sung trang đội ngũ cho website Senova.  
> **Repository:** `nmtrucworking/calmora`  
> **Target branch:** `main`  
> **Vị trí tài liệu:** `docs/Senova_Brand_Team_Luxury_Implementation_Plan.md`  
> **Phiên bản:** 1.0  
> **Ngày cập nhật:** 24/07/2026  
> **Trạng thái:** Ready for implementation

---

## 0. Tóm tắt quyết định

Website hiện đã có route `/about`, nhưng nội dung chủ yếu mô tả Senova như một hệ sản phẩm và hành trình **Giữ – Mở – Trao**. Trang chưa làm rõ đầy đủ:

1. Calmora là gì và giữ vai trò gì đối với Senova.
2. Lý tưởng, tầm nhìn, sứ mệnh và nguyên tắc phát triển sản phẩm.
3. Phương pháp Calmora dùng để chuyển chất liệu bản địa thành trải nghiệm hiện đại.
4. Đội ngũ hiện tại và lý do cấu trúc liên ngành của nhóm phù hợp với bài toán dự án.

Repo chưa có route `/team`. Navigation luxury hiện hành cũng không hiển thị `/about`, khiến nội dung thương hiệu khó được khám phá.

### Quyết định triển khai

- Giữ route `/about`, nhưng đổi nhãn điều hướng thành **Thương hiệu**.
- Tái cấu trúc `/about` thành trang giới thiệu **Calmora — thương hiệu khởi tạo Senova**.
- Tạo mới route `/team` với nhãn **Đội ngũ**.
- Không đặt `/team` trực tiếp trên desktop navigation để tránh làm menu quá dày; liên kết trang đội ngũ qua:
  - CTA cuối `/about`;
  - footer;
  - trang `/partners`;
  - menu mobile nếu không làm tăng tải nhận thức.
- Tiếp tục dùng public lockup:

```text
SENOVA
by Calmora
```

- Không tái sử dụng lockup `CALMORA | SENOVA` trong public UI.
- Không gọi Calmora là **công ty/doanh nghiệp** trước khi pháp nhân được xác nhận.
- Tất cả thiết kế phải tuân thủ hệ token hiện tại, không đưa mã màu rời trực tiếp vào JSX/TSX.

---

## 1. Cơ sở nội bộ

Tài liệu này được xây dựng dựa trên:

- `apps/frontend/docs/p1-brand-foundation.md`
- `apps/frontend/src/features/about/page/index.tsx`
- `apps/frontend/src/features/content/content.json`
- `apps/frontend/src/features/content/luxuryCopy.ts`
- `apps/frontend/src/app/router/AppRouter.tsx`
- `apps/frontend/src/app/router/registeredRoutes.ts`
- `Cau_chuyen_thuong_hieu_Calmora_Senova.docx`
- `Cau_chuyen_thuong_hieu_Calmora_Senova` trong bộ tài liệu dự án
- `Tom_tat_y_tuong_va_hien_trang_du_an_Senova.docx`
- `Team.txt`
- `Senova_User_Flow_Trai_Nghiem_Van_Hoa_Chi_Tiet(1).docx`
- `design system.docx`

### Nguyên tắc xử lý dữ liệu

- Dữ liệu đã xác nhận được dùng trực tiếp.
- Nội dung chưa xác nhận phải gắn trạng thái `TBD` hoặc ghi chú cần kiểm tra.
- Không bổ sung thành tựu, kinh nghiệm, giải thưởng, học hàm hoặc chức vụ khi chưa có nguồn xác nhận.
- Không biến nội dung định vị thành tuyên bố kiểm chứng kỹ thuật, pháp lý hoặc thương mại.

---

# 2. Mục tiêu triển khai

## 2.1. Mục tiêu thương hiệu

Sau khi hoàn thành, người dùng phải hiểu được trong 60–90 giây:

- **Calmora** là thương hiệu/nhóm khởi tạo.
- **Senova** là dự án và hệ sản phẩm trà hương sen đầu tiên của Calmora.
- Senova không chỉ bán trà; dự án thiết kế lại cách người dùng tiếp xúc với trà sen qua hình thức, thao tác, câu chuyện và ngữ cảnh trao tặng.
- Lý tưởng cốt lõi của Calmora là làm cho giá trị truyền thống dễ tiếp cận hơn mà không xóa đi bản sắc.
- Dự án được phát triển bởi đội ngũ liên ngành gồm công nghệ và dữ liệu, quản trị kinh doanh, dược và cố vấn văn hóa.

## 2.2. Mục tiêu UX

- `/about` trở thành điểm vào rõ ràng cho nội dung thương hiệu.
- `/team` tạo bằng chứng về năng lực và mức độ nghiêm túc của dự án.
- Nội dung không lặp lại `/story`.
- Luồng từ thương hiệu đến sản phẩm và đội ngũ phải rõ:

```text
Thương hiệu
→ Lý tưởng
→ Phương pháp phát triển
→ Senova là minh chứng đầu tiên
→ Đội ngũ
→ Sản phẩm/Hợp tác
```

## 2.3. Mục tiêu kỹ thuật

- Dùng React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion hiện có.
- Không thêm dependency UI mới.
- Tiếp tục lazy-load theo route.
- Nội dung song ngữ Việt/Anh.
- Dùng semantic design tokens.
- Đáp ứng kiểm tra:
  - lint;
  - color lint;
  - unit test;
  - build;
  - accessibility cơ bản;
  - responsive;
  - reduced motion.

---

# 3. Kiến trúc thương hiệu

## 3.1. Quan hệ Calmora – Senova

| Thành phần | Vai trò công khai | Cách gọi nên dùng |
|---|---|---|
| Calmora | Thương hiệu/nhóm khởi tạo | “Thương hiệu khởi tạo Senova”, “đơn vị phát triển Senova” |
| Senova | Thương hiệu sản phẩm chính | “Senova by Calmora” |
| Classic | Dòng dùng hằng ngày | “Nhịp Giữ” |
| Petal Pack | Sản phẩm tạo trải nghiệm khác biệt | “Nhịp Mở” |
| Gift Set | Dòng quà tặng văn hóa | “Nhịp Trao” |

## 3.2. Câu định vị chuẩn

### Tiếng Việt

> Calmora phát triển các sản phẩm lấy cảm hứng từ chất liệu bản địa, được tái thiết kế để có thể sử dụng, cảm nhận và trao tặng trong đời sống hiện đại. Senova là dự án đầu tiên của Calmora, bắt đầu từ trà hương sen Việt.

### Tiếng Anh

> Calmora develops products inspired by Vietnamese cultural materials, redesigned to be used, sensed and shared in contemporary life. Senova is Calmora’s first project, beginning with Vietnamese lotus-scented tea.

## 3.3. Tuyên ngôn đổi mới

### Tiếng Việt

> Đổi mới không phải là thay thế giá trị cũ. Đổi mới là tạo ra một hình thức mới để giá trị ấy tiếp tục được sử dụng.

### Tiếng Anh

> Innovation does not mean replacing what came before. It means creating a new form through which that value can continue to be used.

## 3.4. Ba nguyên tắc thương hiệu

### Giữ

Giữ những giá trị còn có khả năng sống trong hiện tại. Trà hương sen vẫn là sản phẩm lõi; công nghệ, thiết kế và nội dung chỉ làm rõ trải nghiệm, không thay thế bản chất sản phẩm.

### Mở

Mở một cách tiếp cận mới bằng hình thức, thao tác và giác quan. Người dùng không chỉ đọc về văn hóa mà thực hiện một hành động có chủ đích.

### Trao

Trao sản phẩm cùng bối cảnh và câu chuyện. Giá trị của quà tặng nằm ở sự chuẩn bị, lời nhắn và khả năng để người nhận tiếp tục trải nghiệm.

---

# 4. Kiến trúc thông tin

## 4.1. Desktop navigation

Thứ tự đề xuất:

```text
Sản phẩm | Nghi thức | Câu chuyện | Thương hiệu | Quà tặng
```

Mapping:

| Nhãn VI | Nhãn EN | Route |
|---|---|---|
| Sản phẩm | Products | `/products` |
| Nghi thức | Ritual | `/ritual` |
| Câu chuyện | Story | `/story` |
| Thương hiệu | Brand | `/about` |
| Quà tặng | Gifting | `/gifting` |

### Lý do không đưa “Đội ngũ” lên desktop navigation

- Không phải hành trình giao dịch chính.
- Navigation hiện có giới hạn chiều ngang ở viewport trung bình.
- `/team` phù hợp hơn trong lớp tạo niềm tin sau khi người dùng đã hiểu thương hiệu.
- Tránh biến giao diện luxury thành menu corporate dày đặc.

## 4.2. Mobile navigation

Mobile có thể hiển thị thêm:

```text
Đội ngũ | Team → /team
```

Chỉ thêm khi menu vẫn giữ được:
- khoảng cách tối thiểu 44 px cho item;
- không vượt quá chiều cao màn hình phổ biến;
- vẫn hiển thị CTA đặt trước ở cuối.

## 4.3. Footer

### Nhóm 1 — Senova

- Bộ sưu tập
- Nghi thức
- Câu chuyện
- Mùa sen

### Nhóm 2 — Về Calmora

- Thương hiệu
- Đội ngũ
- Hợp tác
- Liên hệ

### Nhóm 3 — Dịch vụ & chính sách

- Đặt trước
- Quà tặng
- Giao hàng
- Đổi trả
- Dữ liệu cá nhân
- Điều khoản

---

# 5. Luxury Experience Direction

## 5.1. Định nghĩa “luxury” áp dụng cho Senova

Luxury không được diễn giải bằng:

- nhiều màu vàng;
- bóng kim loại giả;
- hiệu ứng lấp lánh;
- blur dày;
- chữ script khó đọc;
- viền trang trí dày;
- animation liên tục;
- card bo tròn quá mức;
- icon ở mọi section.

Luxury của Senova phải đến từ:

1. **Tiết chế:** mỗi section chỉ có một thông điệp chính.
2. **Tỷ lệ:** typography lớn, khoảng trắng rộng, số lượng yếu tố ít.
3. **Chất liệu:** ảnh sen, giấy, gỗ, trà, cánh khô và ánh sáng có kiểm soát.
4. **Nhịp:** chuyển động chậm, ít nhưng có chủ đích.
5. **Độ chính xác:** nội dung, căn lề, baseline và spacing nhất quán.
6. **Tính biên tập:** bố cục giống một editorial brand journal hơn là landing page SaaS.
7. **Sự thật:** không dùng mỹ từ thay cho dữ liệu chưa kiểm chứng.

## 5.2. Màu sắc

Dùng semantic tokens đã xác lập:

| Vai trò | Token/master |
|---|---|
| Deep forest surface | `--senova-forest-900` / `#0b1a15` |
| Primary forest | `--senova-forest-800` / `#1d3329` |
| Paper surface | `--senova-paper-100` / `#f3efe5` |
| Bronze accent | `--senova-bronze-600` / `#8a6825` |

### Quy tắc

- Không đặt HEX trực tiếp trong JSX/TSX.
- Dùng `text-text`, `text-text-muted`, `bg-surface`, `bg-primary`, `text-accent-strong` và token tương ứng.
- Bronze chỉ nên chiếm khoảng 5–10% diện tích thị giác.
- Không dùng gradient vàng nhiều lớp làm nền chính.
- Không dùng màu hồng sen làm accent cạnh tranh với bronze; màu hồng chỉ xuất hiện tự nhiên trong ảnh.

## 5.3. Typography

| Vai trò | Font |
|---|---|
| Display | Noto Serif Display |
| Fallback display | Playfair Display, Georgia |
| Body/control | Be Vietnam Pro |
| Fallback body | Inter, system sans-serif |

### Hệ tỷ lệ đề xuất

```text
Display hero: clamp(3.3rem, 7.4vw, 7.2rem)
H1 nội trang: clamp(2.8rem, 5.5vw, 5.8rem)
H2: clamp(2rem, 4vw, 3.8rem)
H3: clamp(1.35rem, 2vw, 1.9rem)
Body large: 1.125–1.25rem
Body: 1rem
Eyebrow: 0.72–0.82rem, uppercase, tracking 0.18–0.26em
```

### Quy tắc

- Heading không quá 11–13 từ mỗi dòng ở desktop.
- Body text tối đa 65–72 ký tự mỗi dòng.
- Không dùng italic cho paragraph dài.
- Không dùng script font cho nội dung chức năng.
- Không dùng quá hai họ font trên một page.

## 5.4. Bố cục

- Dùng page max hiện tại.
- Desktop: lưới 12 cột.
- Tablet: 8 cột.
- Mobile: 4 cột.
- Khoảng cách section:
  - desktop: 120–176 px;
  - tablet: 88–120 px;
  - mobile: 64–88 px.
- Không dùng một chuỗi card 3 cột giống nhau cho toàn trang.
- Ưu tiên xen kẽ:
  - full-width hero;
  - text/image split;
  - editorial quote;
  - numbered principles;
  - portrait-led team section;
  - quiet CTA.

## 5.5. Hình ảnh

### `/about`

Cần 3 nhóm ảnh:

1. **Hero material image**
   - sen, cánh sen khô, giấy, gỗ, trà;
   - ánh sáng định hướng;
   - không hiển thị quá nhiều SKU;
   - tránh ảnh catalog.

2. **Process image**
   - thao tác tay;
   - nguyên mẫu;
   - chi tiết vật liệu;
   - thể hiện “phát triển từ nguyên mẫu nhỏ”.

3. **Bridge to Senova**
   - Petal Pack hoặc một hệ ảnh cho Giữ – Mở – Trao;
   - không dùng ba product card giống trang `/products`.

### `/team`

Ưu tiên ảnh chân dung thật:

- tỷ lệ 4:5 hoặc 3:4;
- nền tối trung tính hoặc paper;
- ánh sáng một nguồn, mềm;
- crop nhất quán;
- mắt nhìn camera hoặc lệch tối đa 15°;
- không dùng ảnh selfie;
- không dùng ảnh có filter làm biến đổi da quá mức;
- không dùng ảnh AI thay cho thành viên thật trong bản public.

### Asset naming

```text
public/assets/brand/about/calmora-material-hero.webp
public/assets/brand/about/calmora-process-01.webp
public/assets/brand/about/senova-bridge.webp

public/assets/team/nguyen-minh-truc.webp
public/assets/team/tran-quoc-khanh.webp
public/assets/team/nguyen-ngoc-thao-vy.webp
public/assets/team/advisor-ngan.webp
public/assets/team/advisor-vu-huyen-trang.webp
```

### Image budget

- Hero desktop: ≤ 500 KB WebP/AVIF.
- Portrait: ≤ 220 KB mỗi ảnh.
- Dùng `srcSet` và `sizes`.
- Có width/height để tránh layout shift.
- Không preload toàn bộ ảnh chân dung; chỉ preload hero.

## 5.6. Motion

Dùng `luxuryMotion` và animation system hiện có.

### Cho phép

- opacity + translateY 12–24 px;
- line reveal;
- image scale từ 1.03 về 1;
- stagger 80–140 ms;
- duration 500–900 ms;
- một transition giữa section chủ đạo.

### Không cho phép

- floating animation liên tục;
- shimmer vàng tự động nhiều vị trí;
- parallax lớn gây chóng mặt;
- background particles;
- cursor effect;
- 3D chỉ để trang trí;
- scroll-jacking.

### Reduced motion

Khi `prefers-reduced-motion: reduce`:

- bỏ translate;
- bỏ scale;
- giữ opacity hoặc render tĩnh;
- không trì hoãn nội dung.

---

# 6. Đặc tả trang `/about`

## 6.1. Vai trò trang

`/about` phải trả lời:

1. Calmora là ai?
2. Calmora nhìn thấy vấn đề gì?
3. Calmora theo đuổi lý tưởng nào?
4. Calmora phát triển sản phẩm theo phương pháp nào?
5. Senova chứng minh triết lý đó ra sao?
6. Ai đang thực hiện dự án?

Không dùng `/about` để kể lại vòng đời hoa sen hoặc toàn bộ câu chuyện văn hóa; nội dung đó thuộc `/story`.

---

## 6.2. Section A01 — Brand Hero

### Layout

- Full bleed hoặc gần full bleed.
- Desktop: text 5 cột, visual 7 cột.
- Mobile: visual dưới text.
- Nền deep forest.
- Một đường bronze mảnh làm nhịp, không dùng border box.

### Copy VI

**Eyebrow**

> Calmora · Thương hiệu khởi tạo Senova

**H1**

> Làm mới chất liệu Việt bằng ngôn ngữ sản phẩm hiện đại.

**Description**

> Calmora phát triển những sản phẩm lấy cảm hứng từ chất liệu bản địa, được thiết kế để có thể sử dụng, cảm nhận và trao tặng trong đời sống hiện đại. Senova là dự án đầu tiên của Calmora, bắt đầu từ trà hương sen Việt.

**Primary CTA**

> Khám phá lý tưởng Calmora

Anchor: `#brand-ideal`

**Secondary CTA**

> Gặp đội ngũ

Route: `/team`

### Copy EN

**Eyebrow**

> Calmora · The brand behind Senova

**H1**

> Reframing Vietnamese cultural materials through contemporary product design.

**Description**

> Calmora develops products inspired by local cultural materials, designed to be used, sensed and shared in contemporary life. Senova is Calmora’s first project, beginning with Vietnamese lotus-scented tea.

**Primary CTA**

> Discover Calmora’s principles

**Secondary CTA**

> Meet the team

---

## 6.3. Section A02 — The Starting Question

### Layout

Editorial split, paper surface.

Bên trái:
- index `01`;
- câu hỏi lớn.

Bên phải:
- 2 đoạn ngắn;
- một pull quote.

### Copy VI

**Eyebrow**

> Điểm khởi đầu

**H2**

> Làm thế nào để một giá trị truyền thống tiếp tục sống trong hiện tại?

**Body**

> Nhiều sản phẩm truyền thống vẫn còn giá trị về hương vị, ký ức và văn hóa, nhưng cách tiếp cận thường chưa phù hợp với hành vi sử dụng của người dùng hôm nay.

> Calmora không chọn sao chép nguyên trạng quá khứ, cũng không biến bản sắc thành một lớp trang trí. Chúng tôi tìm kiếm một cấu trúc mới, nơi sản phẩm, thao tác và câu chuyện cùng tồn tại trong một trải nghiệm thống nhất.

**Quote**

> “Một giá trị chỉ thật sự tiếp tục khi con người còn có thể sử dụng, cảm nhận và trao nó cho người khác.”

### Copy EN

**H2**

> How can a traditional value continue to live in the present?

**Body**

> Many traditional products still carry meaningful taste, memory and culture, yet their current forms may not fit how people live and use products today.

> Calmora does not seek to reproduce the past unchanged, nor to reduce identity to decoration. We look for a new structure in which product, gesture and story form one coherent experience.

---

## 6.4. Section A03 — Vision, Mission, Ideal

### Layout

Không dùng ba card đồng dạng. Dùng một khối lớn bên trái và hai khối hẹp xếp dọc bên phải.

### Vision

**Label:** Tầm nhìn

> Đưa chất liệu văn hóa Việt trở thành những trải nghiệm có thể sử dụng, ghi nhớ và tiếp tục được trao đi.

### Mission

**Label:** Sứ mệnh

> Calmora nghiên cứu và tái thiết kế sản phẩm bản địa từ hình thức, thao tác sử dụng, cảm giác vật liệu đến nội dung số, nhằm giúp giá trị truyền thống trở nên rõ ràng và dễ tiếp cận hơn trong đời sống hiện đại.

### Ideal

**Label:** Lý tưởng đổi mới

> Đổi mới không phải là thay thế giá trị cũ. Đổi mới là tạo ra một hình thức mới để giá trị ấy tiếp tục được sử dụng.

### Ghi chú nội dung

Không dùng các cụm từ:
- “dẫn đầu”;
- “tiên phong số một”;
- “cao cấp hàng đầu”;
- “chuẩn quốc tế”;
- “bảo tồn di sản” nếu chưa có tư cách hoặc hoạt động tương ứng.

---

## 6.5. Section A04 — Giữ, Mở, Trao

### Layout

- Horizontal timeline trên desktop.
- Vertical numbered sequence trên mobile.
- Không dùng icon.
- Mỗi principle có một ảnh crop hẹp hoặc texture riêng.

### Item 01 — Giữ

**Title**

> Giữ một giá trị còn sống.

**Text**

> Trà hương sen được đặt trong hình thức dễ tiếp cận để người dùng hôm nay có thể sử dụng và tìm thấy ý nghĩa. Giữ không có nghĩa là đóng băng sản phẩm trong quá khứ.

### Item 02 — Mở

**Title**

> Mở một trải nghiệm có chủ đích.

**Text**

> Hình dáng, thao tác, hương và vị cùng dẫn người dùng bước vào một khoảng thưởng trà. Văn hóa được chuyển từ nội dung để đọc thành trải nghiệm để thực hiện.

### Item 03 — Trao

**Title**

> Trao một câu chuyện có bối cảnh.

**Text**

> Một món quà có giá trị khi người trao chuẩn bị được lời nhắn, trình tự và câu chuyện để người nhận có thể tiếp tục trải nghiệm.

---

## 6.6. Section A05 — How Calmora Works

### Layout

Dark editorial process section.

Flow:

```text
Quan sát
→ Đặt giả định
→ Tạo nguyên mẫu nhỏ
→ Thử nghiệm
→ Chuẩn hóa
→ Mở rộng có kiểm soát
```

### Copy VI

**Eyebrow**

> Phương pháp phát triển

**H2**

> Bắt đầu nhỏ, kiểm chứng rõ, mở rộng có kiểm soát.

**Description**

> Calmora xem mỗi sản phẩm mới là một tập hợp giả định cần được kiểm chứng: người dùng có hiểu cách sử dụng không, trải nghiệm có tạo giá trị thật không, sản phẩm có thể ổn định và sản xuất được không, và mức giá có phù hợp với giá trị cảm nhận hay không.

### Process items

1. **Quan sát**
   - Xác định hành vi, điểm gãy và bối cảnh sử dụng.
2. **Đặt giả định**
   - Phân biệt điều đã biết với điều cần kiểm chứng.
3. **Tạo nguyên mẫu nhỏ**
   - Ưu tiên mẫu đủ để thử thay vì đầu tư tồn kho sớm.
4. **Thử nghiệm**
   - Kiểm tra cảm quan, thao tác, nội dung và ý định mua.
5. **Chuẩn hóa**
   - Hoàn thiện quy trình, tiêu chí chất lượng và dữ liệu.
6. **Mở rộng**
   - Chỉ mở rộng khi sản phẩm, vận hành và dòng tiền có cơ sở.

### Truth constraint

Không viết:
> “Quy trình Calmora đã được chứng minh.”

Nên viết:
> “Đây là phương pháp phát triển mà Calmora lựa chọn cho giai đoạn nguyên mẫu và kiểm chứng.”

---

## 6.7. Section A06 — Senova as the First Expression

### Layout

Một ảnh lớn Petal Pack + ba caption nhỏ, không lặp card sản phẩm.

### Copy VI

**Eyebrow**

> Dự án đầu tiên

**H2**

> Senova là cách Calmora bắt đầu từ một cánh sen.

**Body**

> Senova lấy trà hương sen làm sản phẩm lõi và thiết kế lại hành trình mở – pha – thưởng thức – trao tặng. Ba dòng sản phẩm không phải ba câu chuyện tách rời; chúng tạo thành ba vai trò trong cùng một hệ trải nghiệm.

### Three roles

- **Classic · Giữ**  
  Đưa trà hương sen vào nhịp dùng hằng ngày.

- **Petal Pack · Mở**  
  Biến hình dáng và thao tác pha thành điểm chạm giác quan.

- **Gift Set · Trao**  
  Đưa trà, hướng dẫn và câu chuyện vào một món quà có chuẩn bị.

### CTA

> Khám phá hệ sản phẩm → `/products`

---

## 6.8. Section A07 — Cultural Responsibility

### Mục đích

Chủ động thể hiện thái độ thận trọng đối với việc thương mại hóa văn hóa.

### Copy VI

**H2**

> Kể chuyện văn hóa cần đi cùng trách nhiệm.

**Body**

> Calmora không xem sen là một biểu tượng có thể gắn tùy ý lên mọi sản phẩm. Mỗi diễn giải cần được đối chiếu với nguồn, bối cảnh và người có chuyên môn. Website phải phân biệt rõ câu chuyện thương hiệu, dữ liệu lịch sử, diễn giải thiết kế và giả định đang được kiểm chứng.

### Principles

- Không gán ý nghĩa tuyệt đối cho biểu tượng sen.
- Không biến một địa danh thành nhãn trang trí nếu sản phẩm không có quan hệ thực tế.
- Không gọi một thao tác mới là “nghi thức truyền thống”.
- Không dùng QR để thay thế toàn bộ trải nghiệm vật lý.
- Không công bố nguồn gốc, kiểm nghiệm hoặc chất lượng khi chưa có hồ sơ.

---

## 6.9. Section A08 — Team Bridge

### Layout

- Paper surface.
- Một hàng ba portrait crop nhỏ hoặc một ảnh nhóm thật.
- Không dùng team card đầy đủ; chi tiết thuộc `/team`.

### Copy VI

**Eyebrow**

> Đội ngũ liên ngành

**H2**

> Một bài toán văn hóa – sản phẩm cần nhiều góc nhìn cùng làm việc.

**Body**

> Senova được phát triển bởi đội ngũ từ công nghệ và dữ liệu, quản trị kinh doanh và dược; đồng thời nhận định hướng từ giảng viên về phát triển bền vững, văn hóa và nghệ thuật.

### CTA

> Gặp đội ngũ Calmora → `/team`

---

## 6.10. Section A09 — Final CTA

### Copy

**Eyebrow**

> Senova by Calmora

**H2**

> Từ một cánh sen đến một trải nghiệm có thể tiếp tục.

**Body**

> Khám phá hệ sản phẩm Senova hoặc trao đổi với nhóm về nguyên liệu, thử nghiệm, hợp tác và quà tặng.

**Primary**

> Khám phá sản phẩm → `/products`

**Secondary**

> Trao đổi hợp tác → `/partners`

---

# 7. Đặc tả trang `/team`

## 7.1. Vai trò trang

Trang đội ngũ phải:

- chứng minh cấu trúc liên ngành;
- cho biết mỗi thành viên chịu trách nhiệm cho loại quyết định nào;
- tránh biến thành CV cá nhân;
- tránh phóng đại năng lực;
- không dùng chức danh doanh nghiệp chưa tồn tại;
- phân biệt thành viên thực hiện và giảng viên hướng dẫn.

---

## 7.2. Section T01 — Team Hero

### Layout

- H1 lớn, khoảng trắng rộng.
- Ảnh nhóm hoặc ba portrait xếp editorial.
- Không dùng “Our amazing team”.
- Không dùng icon chức danh.

### Copy VI

**Eyebrow**

> Đội ngũ Calmora

**H1**

> Ba chuyên môn, một bài toán chung.

**Description**

> Senova được phát triển bởi đội ngũ liên ngành từ công nghệ và dữ liệu, quản trị kinh doanh và dược. Mỗi chuyên môn phụ trách một nhóm giả định và rủi ro khác nhau của dự án.

### Copy EN

**Eyebrow**

> The Calmora team

**H1**

> Three disciplines, one shared problem.

**Description**

> Senova is developed by an interdisciplinary team spanning technology and data, business administration and pharmacy. Each discipline addresses a different group of assumptions and risks within the project.

---

## 7.3. Section T02 — Team Members

### Data đã xác nhận

#### Nguyễn Minh Trúc

**Role VI**

> Trưởng nhóm · Công nghệ, dữ liệu và trải nghiệm số

**Role EN**

> Team Lead · Technology, Data & Digital Experience

**Short bio VI**

> Phụ trách định hướng sản phẩm số, kiến trúc website, hệ thống QR, phân tích dữ liệu khảo sát và quản trị tài liệu triển khai.

**Responsibilities**

- Product direction
- Website and QR experience
- Survey/data analysis
- Traceability architecture
- Documentation and coordination

#### Trần Quốc Khánh

**Role VI**

> Mô hình kinh doanh và vận hành

**Role EN**

> Business Model & Operations

**Short bio VI**

> Phụ trách mô hình kinh doanh, chiến lược doanh thu, chi phí, kênh triển khai và phương án vận hành theo từng giai đoạn.

**Responsibilities**

- Business model
- Pricing and revenue logic
- Cost and cash-flow assumptions
- Distribution and partnerships
- Pilot operations

#### Nguyễn Ngọc Thảo Vy

**Role VI**

> Sản phẩm, dược và kiểm soát chất lượng

**Role EN**

> Product, Pharmacy & Quality Control

**Short bio VI**

> Phụ trách góc nhìn nguyên liệu, bảo quản, rủi ro chất lượng và các yêu cầu cần kiểm chứng trước khi sản phẩm được mở rộng.

**Responsibilities**

- Material review
- Storage and stability questions
- Quality risks
- Sensory-test support
- Safety and compliance checklist

### Quy tắc team card

- Card là media + text, không dùng glass card dày.
- Tên dùng heading serif.
- Role dùng sans uppercase nhỏ.
- Bio tối đa 45–60 từ.
- Responsibilities 3–5 dòng.
- Không thêm social link khi thành viên chưa cung cấp.
- Không hiển thị số điện thoại/MSSV trên website public.
- Email chỉ dùng email dự án, không công khai email cá nhân nếu chưa đồng ý.

---

## 7.4. Section T03 — Interdisciplinary Logic

### H2

> Vì sao Senova cần một đội ngũ liên ngành?

| Năng lực | Nhóm quyết định/rủi ro |
|---|---|
| Công nghệ và dữ liệu | Website, QR, dữ liệu phản hồi, truy xuất, đo lường |
| Quản trị kinh doanh | Khách hàng, giá, dòng tiền, tồn kho, kênh bán |
| Dược và sản phẩm | Nguyên liệu, độ ổn định, bảo quản, chất lượng |
| Văn hóa và nghệ thuật | Diễn giải biểu tượng, bối cảnh, ngôn ngữ kể chuyện |
| Phát triển bền vững | Chuỗi giá trị, tác động và tính khả thi dài hạn |

### Visual direction

Dùng bảng editorial hoặc các hàng ngang, không dùng năm icon màu sắc khác nhau.

---

## 7.5. Section T04 — Advisors

### Title

> Giảng viên hướng dẫn

### Dữ liệu hiện có

1. **Cô Ngân**
   - Viện Ứng dụng Phát triển bền vững.
   - Học hàm, học vị và chức vụ: `TBD — cần xác nhận trước khi public`.

2. **TS. Vũ Huyền Trang**
   - Khoa Ngoại ngữ.
   - Chuyên môn nghệ thuật/văn hóa theo hồ sơ nội bộ.
   - Chức vụ đầy đủ: `TBD — cần xác nhận trước khi public`.

### Rule

- Không hiển thị ảnh nếu chưa có sự đồng ý.
- Không tự suy đoán học hàm.
- Không viết lời chứng thực giả định.
- Không gắn chức danh “mentor” nếu vai trò chính thức là GVHD.

---

## 7.6. Section T05 — Working Principles

### H2

> Cách đội ngũ ra quyết định

1. **Phân biệt dữ liệu và giả định**
   - Nội dung chưa kiểm chứng phải được đánh dấu.
2. **Ưu tiên nguyên mẫu nhỏ**
   - Không tạo gánh nặng tồn kho trước khi có tín hiệu.
3. **Kiểm tra trải nghiệm vật lý trước**
   - QR chỉ mở rộng câu chuyện.
4. **Không đánh đổi tính chính xác để lấy hiệu ứng truyền thông**
   - Tránh tuyên bố vượt dữ liệu.
5. **Ghi nhận phản hồi thành quyết định**
   - Mỗi vòng thử phải tạo ra thay đổi cụ thể.

---

## 7.7. Section T06 — CTA

**H2**

> Cùng hoàn thiện một trải nghiệm trà sen có cơ sở.

**Primary**

> Đề xuất hợp tác → `/partners`

**Secondary**

> Liên hệ nhóm → `/contact`

---

# 8. Content Model

## 8.1. Không hard-code nội dung dài trong component

Tạo mô hình dữ liệu riêng:

```text
apps/frontend/src/features/about/data/aboutContent.ts
apps/frontend/src/features/team/data/teamContent.ts
```

Hoặc hợp nhất vào hệ i18n hiện có nếu repo đang ưu tiên `content.json` + localized modules.

## 8.2. TypeScript schema đề xuất

```ts
import type { Language } from "@app/providers/LanguageContext";

export type LocalizedText = Record<Language, string>;

export type BrandPrinciple = {
  id: "keep" | "open" | "share";
  index: string;
  label: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  image?: string;
  imageAlt?: LocalizedText;
};

export type TeamMember = {
  id: "nguyen-minh-truc" | "tran-quoc-khanh" | "nguyen-ngoc-thao-vy";
  name: string;
  role: LocalizedText;
  shortBio: LocalizedText;
  responsibilities: Record<Language, string[]>;
  portrait: string;
  portraitAlt: LocalizedText;
  links?: {
    label: string;
    href: string;
  }[];
};

export type Advisor = {
  id: string;
  name: string;
  degree?: string;
  unit: LocalizedText;
  role: LocalizedText;
  portrait?: string;
  isPublicConfirmed: boolean;
};
```

## 8.3. Content truth flags

Có thể thêm:

```ts
type VerificationStatus = "confirmed" | "internal" | "tbd";

type VerifiedField<T> = {
  value: T;
  status: VerificationStatus;
  source?: string;
};
```

Không nhất thiết render status ra public; dùng để kiểm soát dữ liệu trong code review.

---

# 9. Component Architecture

## 9.1. About

```text
features/about/
├─ data/
│  └─ aboutContent.ts
├─ components/
│  ├─ AboutHero.tsx
│  ├─ StartingQuestion.tsx
│  ├─ BrandVision.tsx
│  ├─ BrandPrinciples.tsx
│  ├─ DevelopmentMethod.tsx
│  ├─ SenovaBridge.tsx
│  ├─ CulturalResponsibility.tsx
│  └─ TeamBridge.tsx
├─ page/
│  ├─ index.tsx
│  └─ AboutPage.test.tsx
└─ index.ts
```

## 9.2. Team

```text
features/team/
├─ data/
│  └─ teamContent.ts
├─ components/
│  ├─ TeamHero.tsx
│  ├─ TeamMemberProfile.tsx
│  ├─ InterdisciplinaryMatrix.tsx
│  ├─ AdvisorList.tsx
│  └─ WorkingPrinciples.tsx
├─ page/
│  ├─ index.tsx
│  └─ TeamPage.test.tsx
└─ index.ts
```

## 9.3. Shared components

Chỉ tách shared khi thật sự tái sử dụng:

```text
shared/components/editorial/
├─ EditorialHero.tsx
├─ NumberedStatement.tsx
├─ QuietCta.tsx
└─ EditorialImage.tsx
```

Không tạo một hệ abstraction quá sớm. Nếu component chỉ dùng một lần, giữ trong feature.

---

# 10. Routing & Navigation Changes

## 10.1. `registeredRoutes.ts`

Thêm route:

```ts
export const publicRoutePaths = {
  home: "/",
  about: "/about",
  team: "/team",
  story: "/story",
  products: "/products",
  // ...
} as const;
```

Thêm route registry:

```ts
{ id: "team", path: publicRoutePaths.team, label: "Đội ngũ", group: "Trang chính" }
```

## 10.2. `AppRouter.tsx`

```ts
const loadTeamPage = () => import("@features/team/page");
const TeamPage = lazy(loadTeamPage);
```

Trong `PublicRoutes`:

```tsx
} else if (normalizedPath === publicRoutePaths.team) {
  pageComponent = <TeamPage />;
```

## 10.3. Page layout behavior

- `/about`: `hasDarkHero = true`, `isFullBleedContent = true`.
- `/team`: có thể dùng `hasDarkHero = true`; không cần `isImmersive`.
- Header transparency chỉ áp dụng khi hero có background đủ tương phản.
- Khi scroll > 24 px, dùng header surface hiện hành.

---

# 11. File-by-file Implementation Plan

## 11.1. P0 — Content and truth lock

### `docs/Senova_Brand_Team_Content_Approval.md` — tùy chọn

Chốt:

- tên chính thức từng thành viên;
- vai trò hiển thị;
- ảnh chân dung;
- GVHD và đơn vị;
- email dự án;
- liệu có public thông tin CLB NJEC hay không.

### Blocking decisions

- [ ] Xác nhận Calmora được gọi là “thương hiệu”, “nhóm” hay “studio”.
- [ ] Xác nhận chức danh public của Nguyễn Minh Trúc.
- [ ] Xác nhận học hàm/chức vụ đầy đủ của Cô Ngân.
- [ ] Xác nhận chức danh đầy đủ của TS. Vũ Huyền Trang.
- [ ] Xác nhận ảnh và quyền sử dụng ảnh.
- [ ] Xác nhận email dự án.

---

## 11.2. P1 — Data and routes

### Tạo

```text
apps/frontend/src/features/team/data/teamContent.ts
apps/frontend/src/features/team/page/index.tsx
```

### Chỉnh

```text
apps/frontend/src/app/router/registeredRoutes.ts
apps/frontend/src/app/router/AppRouter.tsx
apps/frontend/src/features/content/luxuryCopy.ts
apps/frontend/src/features/content/sitePages.ts
apps/frontend/src/features/content/publicI18n.ts
```

### Acceptance

- `/team` render được trực tiếp.
- refresh `/team` không 404 ở môi trường deploy.
- canonical đúng.
- VI/EN không thiếu key.
- mobile nav đóng sau khi click.

---

## 11.3. P2 — Refactor `/about`

### Chỉnh

```text
apps/frontend/src/features/about/page/index.tsx
```

### Tạo

```text
apps/frontend/src/features/about/data/aboutContent.ts
apps/frontend/src/features/about/components/*
```

### Loại bỏ/di chuyển

- Các block “một bộ sản phẩm” dài nếu lặp `/products`.
- Các icon card không còn phù hợp với editorial direction.
- Nội dung công nghệ nếu làm người dùng hiểu Calmora là công ty công nghệ.
- Copy quá chung như “giàu trải nghiệm”, “có chiều sâu” nếu không có nội dung cụ thể theo sau.

### Acceptance

- H1 nói về Calmora, không chỉ nói về Senova.
- Có vision, mission, ideal.
- Có Giữ – Mở – Trao.
- Có phương pháp phát triển.
- Có bridge sang `/team`.
- Không lặp story page.

---

## 11.4. P3 — Team UI

### Tạo

```text
apps/frontend/src/features/team/components/*
```

### Acceptance

- Desktop không dùng một hàng card SaaS đồng dạng.
- Mỗi thành viên có role và trách nhiệm.
- Advisor tách khỏi thành viên.
- Không có MSSV/số điện thoại cá nhân.
- Ảnh có alt text.
- Mobile không crop mất mặt.
- Không có ảnh placeholder trong production.

---

## 11.5. P4 — Luxury polish

### Công việc

- chỉnh hierarchy;
- căn baseline;
- image crop;
- motion;
- hover;
- focus states;
- section rhythm;
- footer;
- active nav state.

### Acceptance

- Không có raw HEX trong component.
- Không có animation loop.
- Không có gradient vàng dày.
- Không có text dưới 16 px ở body mobile.
- Không có paragraph > 72 ký tự/dòng desktop.
- Bronze không chiếm tỷ trọng thị giác lớn.

---

## 11.6. P5 — SEO, analytics, tests

### SEO

`/about`:

```text
Title VI: Thương hiệu Calmora | Senova
Description VI: Calmora là thương hiệu khởi tạo Senova, phát triển trà hương sen Việt qua sản phẩm, trải nghiệm và câu chuyện được thiết kế cho đời sống hiện đại.
```

`/team`:

```text
Title VI: Đội ngũ Calmora | Senova
Description VI: Đội ngũ liên ngành phát triển Senova với năng lực công nghệ và dữ liệu, quản trị kinh doanh, dược, văn hóa và phát triển bền vững.
```

### Structured data

`/about`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Calmora",
  "brand": {
    "@type": "Brand",
    "name": "Senova"
  }
}
```

`/team`:

- Không cần đưa toàn bộ Person schema nếu thiếu dữ liệu.
- Có thể dùng `member` với name + role.
- Không public email/phone cá nhân.
- Không khai báo founder khi chưa chốt.

### Analytics events

```text
brand_about_view
brand_principle_view
brand_method_view
about_to_team_click
about_to_products_click
team_page_view
team_member_view
team_to_partners_click
team_to_contact_click
```

Dùng `trackEvent` hiện có. Tránh gửi tên cá nhân vào analytics nếu không cần.

---

# 12. Detailed UI States

## 12.1. Loading

- Dùng route fallback hiện có.
- Không skeleton cho text tĩnh.
- Ảnh dùng background paper/forest trước khi load.
- Không làm layout shift.

## 12.2. Missing portrait

Development:
- render placeholder trung tính có initials.

Production:
- CI/content check phải báo lỗi.
- Không deploy placeholder nếu trang team public.

## 12.3. Language fallback

- Không trộn tiếng Anh vào trang tiếng Việt.
- Nếu translation thiếu, test phải fail thay vì fallback im lặng sang VI.

## 12.4. No JavaScript

- SEO metadata phải có cấu hình pre-render/deployment phù hợp nếu repo hiện hỗ trợ.
- Nội dung chính vẫn dùng semantic HTML.

---

# 13. Accessibility Requirements

## 13.1. Semantic hierarchy

- Mỗi page chỉ có một `h1`.
- Section có `aria-labelledby`.
- Không bỏ cấp heading vô lý.
- `blockquote` dùng đúng semantic cho quote.

## 13.2. Contrast

- Text paper trên forest đáp ứng WCAG AA.
- Bronze không dùng cho body copy nhỏ trên paper nếu contrast không đạt.
- Active nav không chỉ phân biệt bằng màu; có underline/indicator.

## 13.3. Keyboard

- Tất cả CTA focus được.
- Focus ring không bị xóa.
- Mobile menu trap focus như hiện tại.
- Anchor scroll không đưa heading vào sau fixed header.

## 13.4. Images

- Portrait alt: tên + vai trò, không mô tả ngoại hình.
- Decorative texture có `alt=""`.
- Không đặt text quan trọng trong ảnh.

## 13.5. Motion

- Tuân thủ `prefers-reduced-motion`.
- Không dùng motion là cách duy nhất để truyền trạng thái.

---

# 14. Performance Budget

## Page budget mục tiêu

| Chỉ số | Mục tiêu |
|---|---|
| LCP production | < 2.5 s ở kết nối di động tốt |
| CLS | < 0.1 |
| INP | < 200 ms |
| Hero image | ≤ 500 KB |
| Team portraits total initial load | ≤ 500 KB |
| Additional JS for `/team` | Không thêm dependency; route chunk riêng |
| Fonts | Dùng font đã có, tránh thêm biến thể không cần thiết |

### Implementation notes

- `loading="lazy"` cho portrait dưới fold.
- `decoding="async"`.
- `fetchpriority="high"` chỉ cho hero.
- Không import toàn bộ icon set.
- Không thêm carousel dependency.
- Không autoplay video ở `/team`.

---

# 15. Testing Plan

## 15.1. Unit tests

### Route tests

- `/about` render AboutPage.
- `/team` render TeamPage.
- route không phân biệt trailing slash.
- metadata title/description đúng theo language.

### Content tests

- Có đúng ba thành viên hiện tại.
- Không còn tên đội ngũ cũ trong public content:
  - Lê Tiêu Tấn Đạt;
  - Đào Nguyệt Ánh;
  - Nguyễn Hoàng Thiên Phú;
  - Bảo Nguyệt Anh.
- Không có từ “công ty Calmora” trong public copy.
- Không có claim “đã kiểm chứng”, “chuẩn quốc tế”, “an toàn tuyệt đối”.

### Navigation tests

- Desktop nav có `/about`.
- Footer có `/team`.
- Mobile menu đóng sau điều hướng.
- Active route đúng ở `/about` và `/team`.

## 15.2. Visual QA

Viewport:

```text
375 × 812
390 × 844
768 × 1024
1024 × 768
1280 × 800
1440 × 900
1920 × 1080
```

Kiểm tra:

- heading wrap;
- portrait crop;
- spacing;
- header contrast;
- footer;
- VI/EN;
- 200% zoom;
- reduced motion.

## 15.3. Commands

```bash
cd apps/frontend
npm run lint
npm run lint:colors
npm run test
npm run build
```

Hoặc:

```bash
npm run check
```

---

# 16. Acceptance Criteria

## 16.1. Content

- [ ] Calmora được giới thiệu rõ là thương hiệu/nhóm khởi tạo Senova.
- [ ] Senova được giới thiệu là dự án đầu tiên của Calmora.
- [ ] Có tầm nhìn, sứ mệnh và lý tưởng.
- [ ] Có ba nguyên tắc Giữ – Mở – Trao.
- [ ] Có phương pháp phát triển từ nguyên mẫu nhỏ.
- [ ] Có trách nhiệm văn hóa.
- [ ] Có đúng ba thành viên hiện tại.
- [ ] Có section GVHD với dữ liệu đã xác nhận.
- [ ] Không còn dữ liệu đội ngũ cũ.
- [ ] Không có claim vượt dữ liệu.

## 16.2. UX

- [ ] `/about` có thể truy cập từ desktop navigation.
- [ ] `/team` có thể truy cập từ `/about` và footer.
- [ ] Hành trình về sản phẩm/hợp tác rõ.
- [ ] Không lặp nội dung `/story`.
- [ ] Không có quá nhiều card đồng dạng.
- [ ] Mobile có thứ tự nội dung hợp lý.
- [ ] CTA không cạnh tranh lẫn nhau.

## 16.3. Luxury design

- [ ] Typography editorial rõ.
- [ ] Khoảng trắng đủ lớn.
- [ ] Bronze dùng tiết chế.
- [ ] Ảnh thật, ánh sáng và crop nhất quán.
- [ ] Không dùng hiệu ứng lấp lánh.
- [ ] Motion chậm, ít, có mục đích.
- [ ] Không dùng icon để thay cho nội dung.
- [ ] Không dùng glassmorphism dày.
- [ ] Không có raw color ngoài token.

## 16.4. Technical

- [ ] Route lazy-load.
- [ ] Build pass.
- [ ] Test pass.
- [ ] Color lint pass.
- [ ] Metadata song ngữ.
- [ ] Canonical đúng.
- [ ] Structured data hợp lệ.
- [ ] Accessibility cơ bản đạt.
- [ ] Không có layout shift từ ảnh.

---

# 17. Task Breakdown

## Epic BT-01 — Brand content foundation

| ID | Task | Priority | Dependency |
|---|---|---:|---|
| BT-001 | Chốt cách gọi Calmora | P0 | None |
| BT-002 | Chốt copy VI `/about` | P0 | BT-001 |
| BT-003 | Dịch và review copy EN | P1 | BT-002 |
| BT-004 | Xác nhận dữ liệu team/GVHD | P0 | None |
| BT-005 | Chuẩn bị ảnh | P1 | BT-004 |

## Epic BT-02 — Routing and content model

| ID | Task | Priority | Dependency |
|---|---|---:|---|
| BT-101 | Thêm `publicRoutePaths.team` | P0 | None |
| BT-102 | Lazy load TeamPage | P0 | BT-101 |
| BT-103 | Tạo `aboutContent.ts` | P0 | BT-002 |
| BT-104 | Tạo `teamContent.ts` | P0 | BT-004 |
| BT-105 | Cập nhật navigation/footer | P0 | BT-101 |

## Epic BT-03 — About page

| ID | Task | Priority | Dependency |
|---|---|---:|---|
| BT-201 | Brand hero | P0 | BT-103 |
| BT-202 | Starting question | P0 | BT-103 |
| BT-203 | Vision/mission/ideal | P0 | BT-103 |
| BT-204 | Giữ–Mở–Trao | P0 | BT-103 |
| BT-205 | Development method | P1 | BT-103 |
| BT-206 | Senova bridge | P1 | BT-103 |
| BT-207 | Cultural responsibility | P1 | BT-103 |
| BT-208 | Team bridge + CTA | P0 | BT-102 |

## Epic BT-04 — Team page

| ID | Task | Priority | Dependency |
|---|---|---:|---|
| BT-301 | Team hero | P0 | BT-104 |
| BT-302 | Member profiles | P0 | BT-104, BT-005 |
| BT-303 | Interdisciplinary matrix | P1 | BT-104 |
| BT-304 | Advisor section | P1 | BT-004 |
| BT-305 | Working principles | P1 | BT-104 |
| BT-306 | CTA | P1 | None |

## Epic BT-05 — QA

| ID | Task | Priority | Dependency |
|---|---|---:|---|
| BT-401 | Route tests | P0 | BT-102 |
| BT-402 | Content truth tests | P0 | BT-103, BT-104 |
| BT-403 | Responsive QA | P0 | BT-208, BT-306 |
| BT-404 | Accessibility QA | P0 | BT-403 |
| BT-405 | SEO/schema | P1 | BT-102 |
| BT-406 | Performance check | P1 | BT-403 |
| BT-407 | Remove old team references | P0 | BT-004 |

---

# 18. Rollout Strategy

## Phase 1 — Content-safe release

- route `/team`;
- navigation `/about`;
- content đúng;
- ảnh tạm nội bộ nhưng không public nếu không đạt;
- SEO;
- tests.

## Phase 2 — Luxury visual release

- ảnh thật;
- editorial layout;
- motion;
- section transitions;
- visual QA.

## Phase 3 — Trust and partnership

- thêm liên kết từ `/partners`;
- email dự án;
- advisor info đã xác nhận;
- analytics;
- structured data hoàn chỉnh.

---

# 19. Rủi ro và kiểm soát

| Rủi ro | Mức độ | Kiểm soát |
|---|---:|---|
| Calmora/Senova gây nhầm lẫn | Cao | Dùng lockup `Senova by Calmora`, giải thích kiến trúc thương hiệu |
| Trang about lặp story | Cao | Tách “lý tưởng/phương pháp” khỏi “câu chuyện văn hóa” |
| Team page giống CV | Trung bình | Tập trung trách nhiệm dự án, không liệt kê dài |
| Dùng thành viên cũ | Cao | Content test và search toàn repo |
| Claim quá mức | Cao | Truth constraints + code review |
| Luxury thành trang trí | Cao | Quy tắc tiết chế, token, motion budget |
| Ảnh không đồng nhất | Trung bình | Photo brief và crop chuẩn |
| Menu quá dày | Trung bình | Không đưa `/team` lên desktop nav |
| Performance giảm | Trung bình | WebP/AVIF, lazy load, no new dependency |
| Thông tin GVHD sai | Cao | `TBD` cho đến khi xác nhận |

---

# 20. Definition of Done

Một pull request chỉ được xem là hoàn tất khi:

1. `/about` và `/team` hoạt động ở production build.
2. Nội dung VI/EN đầy đủ.
3. Navigation/footer cập nhật.
4. Đúng ba thành viên hiện tại.
5. Dữ liệu GVHD đã xác nhận hoặc được ẩn.
6. Không còn tên đội cũ trong public content.
7. Không có claim không được hỗ trợ.
8. Không có raw color vi phạm.
9. `npm run check` pass.
10. QA ở mobile/tablet/desktop pass.
11. Reduced motion pass.
12. SEO/canonical pass.
13. Ảnh production có quyền sử dụng.
14. `/about` và `/team` thể hiện cùng một luxury design language với landing, products và story.

---

# 21. Checklist trước khi giao cho AI coding agent

```text
[ ] Đọc apps/frontend/docs/p1-brand-foundation.md
[ ] Đọc luxuryCopy.ts và content.json
[ ] Không thay đổi lockup public
[ ] Không thêm dependency
[ ] Không hard-code HEX
[ ] Không gọi Calmora là công ty
[ ] Không thêm thông tin cá nhân chưa xác nhận
[ ] Không dùng thành viên cũ
[ ] Không lặp nội dung story
[ ] Không tạo layout card SaaS
[ ] Dùng lazy route
[ ] Dùng semantic HTML
[ ] Hỗ trợ VI/EN
[ ] Hỗ trợ reduced motion
[ ] Chạy npm run check
```

---

# 22. Prompt triển khai gợi ý cho coding agent

```text
Repo: nmtrucworking/calmora

Hãy triển khai tài liệu:
docs/Senova_Brand_Team_Luxury_Implementation_Plan.md

Mục tiêu:
1. Refactor /about thành trang thương hiệu Calmora theo hướng editorial luxury.
2. Tạo route /team và trang đội ngũ.
3. Cập nhật navigation, footer, SEO, i18n và tests.
4. Giữ kiến trúc public “SENOVA by Calmora”.
5. Không thêm dependency và không dùng raw HEX trong TSX.
6. Không thêm dữ liệu thành viên, học hàm, thành tựu hoặc claim chưa có trong tài liệu.
7. Không làm thay đổi các route sản phẩm, QR, trace hoặc checkout.

Trước khi code:
- rà soát các component/token/motion hiện có;
- xác định component nào tái sử dụng được;
- liệt kê file sẽ thay đổi;
- kiểm tra toàn repo để loại bỏ tên đội ngũ cũ trong public UI.

Sau khi code:
- chạy npm run check;
- báo cáo route, file, tests, responsive và các quyết định còn TBD.
```

---

## Kết luận

Việc bổ sung thương hiệu và đội ngũ không nên được xử lý như hai trang thông tin phụ. Đây là lớp giải thích **vì sao Senova tồn tại**, **Calmora làm việc theo nguyên tắc nào** và **ai chịu trách nhiệm cho các giả định quan trọng của dự án**.

Luxury của hai trang phải đến từ sự tiết chế, tính chính xác, chất liệu, nhịp trình bày và mức độ tin cậy — không đến từ việc tăng hiệu ứng trang trí.
