# Chức năng QR — Câu chuyện sản phẩm và văn hóa Senova

> **Trạng thái:** Sẵn sàng triển khai MVP  
> **Phạm vi:** Frontend Senova / Calmora  
> **Đối tượng:** Product, UX/UI, Content, Frontend, QA  
> **Cập nhật:** 11/07/2026

---

## 1. Mục tiêu

Xây dựng trải nghiệm để người dùng quét mã QR được in trên bao bì hoặc thẻ văn hóa và truy cập đúng câu chuyện của sản phẩm Senova.

Chức năng không chỉ thực hiện chuyển hướng URL. Nó phải tạo một hành trình số liên tục từ sản phẩm vật lý đến nội dung văn hóa, hướng dẫn trải nghiệm và phản hồi người dùng:

```text
Sản phẩm / thẻ văn hóa
        ↓
Quét QR Senova
        ↓
Xác thực mã QR và nhận diện sản phẩm / lô
        ↓
Trang câu chuyện sản phẩm và văn hóa
        ↓
Hướng dẫn mở – cảm nhận – pha – thưởng thức
        ↓
Phản hồi trải nghiệm / đăng ký quan tâm / khám phá sản phẩm
        ↓
Dữ liệu phục vụ cải tiến nội dung và sản phẩm
```

### 1.1. Giá trị người dùng

- Truy cập nội dung mà không cần đăng nhập.
- Nhận đúng câu chuyện theo dòng sản phẩm: **Classic — Giữ**, **Petal Pack — Mở**, **Gift Set — Trao**.
- Hiểu ý nghĩa văn hóa của sản phẩm thay vì chỉ đọc thông tin bán hàng.
- Xem hướng dẫn sử dụng phù hợp với phiên bản hoặc lô sản phẩm.
- Gửi phản hồi ngắn sau khi trải nghiệm.

### 1.2. Giá trị dự án

- Kết nối sản phẩm vật lý với hệ nội dung số.
- Đo lượt quét theo sản phẩm, mã lô và chiến dịch.
- Cập nhật đích đến sau khi QR đã được in mà không phải in lại mã.
- Thu thập dữ liệu hành vi để cải tiến trải nghiệm, nội dung và nguyên mẫu.

---

## 2. Hiện trạng trong repository

Repository đã có nền tảng QR ở mức MVP:

- Router nhận đường dẫn `/q/:code` và chuyển sang `QrRedirectPage`.
- `QrRedirectPage` chuẩn hóa mã, tra cứu bản ghi QR, ghi nhận sự kiện `qr_scan` và chuyển sang trang trải nghiệm.
- Các route trải nghiệm hiện có:
  - `/experience/classic`
  - `/experience/petal-pack`
  - `/experience/gift-set`
- Nội dung QR hiện được quản lý tại `src/features/content/qrExperience.ts`.
- Trang trải nghiệm đã có các phần: hero, câu chuyện văn hóa, hướng dẫn trải nghiệm và biểu mẫu phản hồi.
- Danh sách QR hiện đang là dữ liệu tĩnh trong `src/features/content/sitePages.ts`.
- Analytics hiện lưu tối đa 100 sự kiện gần nhất trong `localStorage`.

### 2.1. Khoảng trống cần xử lý

1. `expiresAt` đã tồn tại trong kiểu dữ liệu nhưng chưa được kiểm tra khi chuyển hướng.
2. Bản ghi QR đang nằm trong `sitePages.ts`, làm trộn dữ liệu định tuyến QR với nội dung trang thông thường.
3. Nội dung hướng dẫn đang gắn trực tiếp theo dòng sản phẩm, chưa hỗ trợ khác biệt theo phiên bản hoặc mã lô.
4. Chưa có trạng thái riêng cho mã hết hạn, mã bị thu hồi hoặc nội dung đang bảo trì.
5. Chưa có sự kiện phân tích cho: chuyển hướng thành công, mã không hợp lệ, xem từng phần nội dung, bắt đầu phản hồi và gửi phản hồi.
6. Analytics chỉ lưu cục bộ nên chưa tạo được dữ liệu tổng hợp giữa nhiều người dùng.
7. Chưa có quy chuẩn kỹ thuật cho QR cách điệu có logo ở giữa.

---

## 3. Phạm vi MVP

### 3.1. Trong phạm vi

- Quét QR bằng camera điện thoại hoặc ứng dụng quét QR.
- Truy cập URL ngắn ổn định dạng `/q/:code`.
- Tra cứu mã QR theo danh sách cho phép.
- Kiểm tra trạng thái hoạt động và thời hạn.
- Chuyển hướng đến đúng trang trải nghiệm sản phẩm.
- Hiển thị câu chuyện sản phẩm và câu chuyện văn hóa.
- Hiển thị hướng dẫn sử dụng theo nội dung đã được duyệt.
- Hiển thị mã lô khi có.
- Ghi nhận sự kiện hành vi không chứa dữ liệu cá nhân.
- Cho phép gửi phản hồi hoặc đăng ký quan tâm.
- Có trang lỗi thân thiện cho mã không tồn tại, hết hạn hoặc tạm ngừng.

### 3.2. Ngoài phạm vi MVP

- Đăng nhập để xem nội dung QR.
- Blockchain hoặc NFT cho QR.
- Chứng nhận truy xuất nguồn gốc nếu chưa có dữ liệu kiểm chứng.
- Khẳng định QR là cơ chế chống hàng giả.
- Thanh toán trực tiếp trong luồng QR.
- Dashboard quản trị QR hoàn chỉnh.
- Tự động sinh hàng nghìn mã QR duy nhất cho từng đơn vị sản phẩm.

> QR MVP là **điểm truy cập nội dung và đo lường trải nghiệm**, không được mô tả như hệ thống xác thực hàng thật nếu chưa có cơ chế định danh duy nhất, chống sao chép và backend kiểm chứng.

---

## 4. User flow

```mermaid
flowchart TD
    A[Người dùng nhìn thấy QR trên bao bì hoặc thẻ văn hóa] --> B[Quét QR]
    B --> C[/q/:code]
    C --> D{Mã có tồn tại?}
    D -- Không --> E[Trang mã không được nhận diện]
    D -- Có --> F{Mã đang hoạt động?}
    F -- Không --> G[Trang mã tạm ngừng]
    F -- Có --> H{Mã đã hết hạn?}
    H -- Có --> I[Trang mã hết hạn]
    H -- Không --> J[Ghi nhận qr_scan]
    J --> K[Chuyển hướng đến /experience/:product]
    K --> L[Hiển thị câu chuyện sản phẩm và văn hóa]
    L --> M[Hướng dẫn trải nghiệm / pha]
    M --> N{Người dùng muốn làm gì tiếp?}
    N --> O[Gửi phản hồi]
    N --> P[Khám phá sản phẩm]
    N --> Q[Đăng ký quan tâm / đặt trước]
    N --> R[Chia sẻ câu chuyện]
```

### 4.1. Luồng chuẩn

Ví dụ cho Petal Pack:

```text
https://senova.vn/q/PP-2601-A
        ↓
Tra cứu mã PP-2601-A
        ↓
Sản phẩm: petal-pack
Lô: PP-2601-A
Đích đến: /experience/petal-pack
        ↓
/experience/petal-pack
?batch=PP-2601-A
&source=qr
&content=petal-pack-scan
```

### 4.2. Nguyên tắc URL

QR in trên sản phẩm **chỉ nên chứa URL ngắn dạng `/q/:code`**, không in trực tiếp URL dài của trang trải nghiệm.

Lý do:

- Có thể thay đổi đích đến mà không in lại QR.
- Có thể tạm ngừng hoặc thay nội dung theo lô.
- Có thể đo lượt quét theo mã.
- Tránh phụ thuộc vào cấu trúc route nội bộ trong dài hạn.

Đề xuất:

```text
Production: https://senova.vn/q/PP-2601-A
Staging:    https://staging.senova.vn/q/PP-2601-A
Local:      http://localhost:5173/q/PP-2601-A
```

Không hard-code domain production trong script sinh QR. Domain phải lấy từ biến môi trường.

---

## 5. Cấu trúc nội dung trang trải nghiệm

Mỗi trang QR phải ưu tiên trải nghiệm đọc trên điện thoại. Thứ tự đề xuất:

1. **Hero sản phẩm**
   - Vai trò: Giữ / Mở / Trao.
   - Tên sản phẩm.
   - Một câu dẫn ngắn.
   - Ảnh sản phẩm.
   - Mã lô nếu có.

2. **Câu chuyện sản phẩm**
   - Sản phẩm là gì.
   - Vì sao hình thức này được thiết kế.
   - Điểm khác biệt trong hành trình sử dụng.

3. **Câu chuyện văn hóa**
   - Ý nghĩa của sen trong mạch kể Senova.
   - Cách Senova chuyển chất liệu văn hóa thành trải nghiệm hiện đại.
   - Không trình bày suy diễn lịch sử như sự thật nếu chưa có nguồn kiểm chứng.

4. **Hướng dẫn trải nghiệm**
   - Các bước rõ ràng, có thứ tự.
   - Thông số pha chỉ hiển thị khi đã được nhóm sản phẩm duyệt.
   - Hỗ trợ nội dung theo phiên bản hoặc lô.

5. **Điểm cần cảm nhận**
   - Hình dáng.
   - Hương.
   - Màu nước.
   - Vị trà.
   - Cảm nhận về thao tác mở và thời gian chờ.

6. **Phản hồi ngắn**
   - Mức độ ấn tượng.
   - Thành phần được nhớ nhất.
   - Mức độ dễ hiểu của câu chuyện.
   - Ý định mua / tặng / giới thiệu.
   - Góp ý mở.

7. **CTA tiếp theo**
   - Khám phá bộ sản phẩm.
   - Đăng ký quan tâm hoặc đặt trước.
   - Chia sẻ câu chuyện.

### 5.1. Ma trận nội dung theo sản phẩm

| Dòng sản phẩm | Vai trò | Trọng tâm câu chuyện | Trọng tâm hướng dẫn | CTA chính |
|---|---|---|---|---|
| Senova Classic | Giữ | Đưa hương sen vào một khoảng nghỉ có thể lặp lại mỗi ngày | Mở gói, pha, chờ, thưởng thức | Khám phá Classic / đăng ký quan tâm |
| Senova Petal Pack | Mở | Cánh sen và thao tác mở trở thành điểm chạm văn hóa trực quan | Mở cánh, cảm nhận, pha, chờ, thưởng thức | Gửi phản hồi trải nghiệm |
| Senova Gift Set | Trao | Món quà mang theo lời nhắn, thời gian chuẩn bị và câu chuyện bản địa | Đọc lời nhắn, chọn trải nghiệm, pha, tiếp tục câu chuyện | Khám phá quà tặng / liên hệ tư vấn |

---

## 6. Quy tắc nội dung và kiểm chứng

### 6.1. Không tạo tuyên bố vượt quá bằng chứng

Không sử dụng các cách diễn đạt sau nếu chưa có hồ sơ chứng minh:

- “Trà sen nguyên bản”.
- “Giữ nguyên toàn bộ dưỡng chất”.
- “Tốt cho sức khỏe”, “giảm stress”, “hỗ trợ điều trị”.
- “Di sản” hoặc “nghi lễ truyền thống” nếu nội dung đang mô tả nghi thức do Senova tự thiết kế.
- “Truy xuất nguồn gốc” nếu chưa có dữ liệu vùng nguyên liệu và lô tương ứng.
- “Chống hàng giả” nếu mã có thể bị sao chép và chưa có backend xác thực đơn vị sản phẩm.

Cách diễn đạt ưu tiên:

> “Nghi thức trải nghiệm do Senova thiết kế, lấy cảm hứng từ hình ảnh sen và nhịp thưởng trà chậm.”

### 6.2. Vấn đề nội dung cần chốt trước khi release

Hướng dẫn Petal Pack hiện có khả năng thay đổi theo nguyên mẫu. Có hai cách mô tả đang tồn tại trong tài liệu dự án:

- Lấy túi trà bên trong để pha.
- Pha toàn bộ cánh sen cùng túi trà.

Không được phát hành một hướng dẫn chung trước khi nhóm R&D xác nhận quy trình sử dụng chính thức cho từng phiên bản.

Giải pháp kỹ thuật:

- Thêm `contentVersion` và/hoặc `batchCode` vào mô hình nội dung.
- Cho phép ghi đè `guidanceSteps` theo lô.
- Không hard-code duy nhất thông số `200 ml / 5 phút` cho mọi nguyên mẫu.

---

## 7. Mô hình dữ liệu

### 7.1. QR record

Đề xuất tách sang:

```text
src/features/qr/data/qrRecords.ts
```

Kiểu dữ liệu:

```ts
export type QrStatus = "active" | "paused" | "expired" | "revoked";

export type QrRecord = {
  code: string;
  productSlug: ProductId;
  batchCode?: string;
  contentVersion: string;
  destination: string;
  status: QrStatus;
  activeFrom?: string;
  expiresAt?: string;
  campaign?: string;
  locale?: "vi" | "en";
  createdAt: string;
};
```

### 7.2. Nội dung trải nghiệm

Đề xuất mở rộng:

```ts
export type QrExperienceContent = {
  productSlug: ProductId;
  version: string;
  contentViewed: string;
  eyebrow: string;
  title: string;
  lede: string;
  story: {
    title: string;
    paragraphs: string[];
  };
  culture: {
    title: string;
    paragraphs: string[];
    sourceNotes?: string[];
  };
  guidance: {
    title: string;
    intro: string;
    steps: QrExperienceStep[];
    safetyNote?: string;
  };
  reflectionPrompt: string;
  cta: {
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
};
```

### 7.3. Ghi đè nội dung theo lô

```ts
export type QrBatchContentOverride = {
  batchCode: string;
  productSlug: ProductId;
  contentVersion: string;
  guidanceOverride?: QrExperienceContent["guidance"];
  notice?: string;
};
```

Mục đích:

- Mỗi nguyên mẫu có thể dùng quy trình pha khác nhau.
- Có thể hiển thị lưu ý bảo quản hoặc thay đổi thành phần theo lô.
- Tránh sửa nội dung toàn bộ sản phẩm khi chỉ một lô thay đổi.

---

## 8. Quy chuẩn thiết kế QR Senova

QR tham chiếu sử dụng ngôn ngữ thị giác:

- Nền trắng hoặc ngà rất sáng.
- Mô-đun bo tròn, tạo cảm giác hữu cơ.
- Chuyển sắc xanh lá đậm sang vàng olive / vàng sen.
- Ba mắt định vị được cách điệu theo hình khối mềm, có liên tưởng đến cánh hoặc lá.
- Logo Calmora đặt ở tâm.
- Tổng thể tối giản, cao cấp và đồng nhất với hệ màu thương hiệu.

### 8.1. Ràng buộc kỹ thuật bắt buộc

QR cách điệu chỉ được chấp nhận khi vẫn bảo đảm khả năng quét.

| Hạng mục | Yêu cầu |
|---|---|
| Error correction | Mức `H` |
| Quiet zone | Tối thiểu 4 mô-đun, không đặt chữ hoặc họa tiết vào vùng này |
| Tương phản | Màu mô-đun phải đủ tối so với nền; không dùng nền ảnh nhiễu |
| Logo giữa QR | Có nền trắng riêng; không che quá khoảng 15% diện tích QR |
| Kích thước in khuyến nghị | Từ 32 × 32 mm; không dưới 28 × 28 mm nếu có logo giữa |
| File in | SVG hoặc PNG độ phân giải cao, không nén mờ |
| Bo tròn mô-đun | Không làm mất các mô-đun nhỏ hoặc làm chúng dính vào nhau |
| Gradient | Phải giữ độ tối đủ trên toàn bộ vùng dữ liệu |
| URL dự phòng | In thêm đường dẫn ngắn hoặc mã QR dạng chữ ở gần QR |

### 8.2. Không được làm

- Đặt logo quá lớn.
- Dùng nền trong suốt trên bao bì có hoa văn phức tạp.
- Cắt bớt quiet zone.
- Dùng vàng nhạt ở vùng dữ liệu khiến độ tương phản thấp.
- Biến đổi mắt định vị đến mức máy quét không nhận ra cấu trúc QR.
- Chỉ kiểm tra bằng một điện thoại.

### 8.3. Ma trận kiểm thử QR vật lý

Mỗi QR release phải quét được trong các điều kiện sau:

| Thiết bị / ứng dụng | Điều kiện |
|---|---|
| iPhone Camera | Ánh sáng trong nhà, khoảng cách 20–40 cm |
| Android Camera / Google Lens | Ánh sáng trong nhà, khoảng cách 20–40 cm |
| Zalo QR | Bản in thật trên bao bì |
| Thiết bị tầm trung | QR nghiêng khoảng 30–45 độ |
| Camera trong điều kiện ánh sáng yếu | Không cần hoàn hảo nhưng phải nhận diện trong thời gian hợp lý |
| Ảnh chụp QR trên màn hình | Quét từ thiết bị thứ hai |

Tiêu chí đạt:

- Ít nhất 95% lượt thử quét thành công trong 3 giây.
- Không có thiết bị chính nào thất bại lặp lại.
- URL mở đúng mã và không mất tham số.

---

## 9. Yêu cầu chức năng

### FR-01 — Nhận diện mã QR

Hệ thống phải nhận mã từ route `/q/:code`.

- Chuẩn hóa bằng `trim()` và `toUpperCase()`.
- Chỉ tra cứu trong danh sách QR được cấp.
- Không sử dụng giá trị `destination` do người dùng truyền qua query string.

### FR-02 — Kiểm tra trạng thái

Hệ thống phải phân biệt:

- Không tồn tại.
- Đang hoạt động.
- Tạm ngừng.
- Hết hạn.
- Bị thu hồi.

### FR-03 — Chuyển hướng

Khi mã hợp lệ:

- Ghi nhận `qr_scan`.
- Gắn `batch`, `source=qr`, `content` vào URL đích.
- Chuyển hướng tự động.
- Không tạo độ trễ nhân tạo quá 500 ms nếu không có lý do UX rõ ràng.

### FR-04 — Hiển thị đúng nội dung

Trang trải nghiệm phải dùng:

- `productSlug` để chọn nội dung cơ sở.
- `contentVersion` để chọn phiên bản nội dung.
- `batchCode` để áp dụng nội dung ghi đè nếu có.

### FR-05 — Phản hồi

Biểu mẫu phản hồi phải tự điền ngầm:

- Sản phẩm.
- Mã lô.
- Nguồn truy cập.
- Nội dung đã xem.
- Phiên bản nội dung.

### FR-06 — Trạng thái lỗi thân thiện

Mỗi trạng thái phải có:

- Tiêu đề dễ hiểu.
- Mô tả ngắn.
- CTA “Xem bộ sản phẩm”.
- CTA “Liên hệ hỗ trợ”.
- Không hiển thị stack trace hoặc dữ liệu nội bộ.

### FR-07 — Chia sẻ

Trang trải nghiệm nên hỗ trợ:

- Web Share API trên thiết bị tương thích.
- Sao chép liên kết khi Web Share API không khả dụng.
- Liên kết chia sẻ phải là URL nội dung sản phẩm, không bắt buộc chứa mã lô nếu mã lô là dữ liệu nội bộ.

---

## 10. Analytics

### 10.1. Sự kiện MVP

| Event | Khi nào ghi nhận | Thuộc tính |
|---|---|---|
| `qr_scan` | Mã hợp lệ được mở | `productSlug`, `batchCode`, `contentViewed`, `source` |
| `qr_invalid` | Mã không tồn tại | `codeHash` hoặc mã đã làm mờ, `source` |
| `qr_inactive` | Mã tạm ngừng / thu hồi / hết hạn | `status`, `productSlug?`, `batchCode?` |
| `qr_redirect_success` | Điều hướng đến trang trải nghiệm | `productSlug`, `batchCode`, `destination` |
| `experience_start` | Trang trải nghiệm hiển thị | `productSlug`, `batchCode`, `contentVersion` |
| `story_section_view` | Người dùng xem phần câu chuyện | `productSlug`, `sectionId` |
| `brew_guidance_view` | Người dùng xem hướng dẫn | `productSlug`, `contentVersion` |
| `feedback_start` | Bắt đầu tương tác biểu mẫu | `productSlug`, `batchCode` |
| `feedback_submit` | Gửi phản hồi thành công | `productSlug`, `batchCode`, `contentVersion` |
| `reorder_click` | Nhấn đăng ký quan tâm / đặt trước | `productSlug`, `batchCode` |
| `share_click` | Chia sẻ hoặc sao chép liên kết | `productSlug`, `method` |

### 10.2. Nguyên tắc dữ liệu

- Không thu email, số điện thoại hoặc tên trong sự kiện quét QR.
- Không đặt thông tin cá nhân trong URL.
- `batchCode` là dữ liệu sản phẩm, không phải dữ liệu cá nhân.
- Analytics không được chặn việc tải nội dung.
- Nếu dùng nền tảng analytics bên thứ ba, phải cập nhật chính sách dữ liệu và cơ chế đồng ý phù hợp.

### 10.3. Giới hạn hiện tại

`localStorage` chỉ phù hợp cho kiểm thử cục bộ. Nó không thể tổng hợp dữ liệu giữa người dùng hoặc thiết bị.

Lộ trình:

- MVP nội bộ: giữ adapter hiện tại.
- Pilot: gửi event về endpoint hoặc nền tảng analytics đã chọn.
- Production: có consent, retention policy, lọc bot và dashboard theo sản phẩm / lô / chiến dịch.

---

## 11. Yêu cầu phi chức năng

### 11.1. Hiệu năng

- Trang QR ưu tiên mobile-first.
- Nội dung chính phải đọc được ngay cả khi ảnh tải chậm.
- LCP mục tiêu ≤ 2,5 giây trên mạng 4G phổ thông.
- Ảnh hero dùng WebP/AVIF tối ưu và kích thước phù hợp màn hình.
- Không tải Three.js hoặc tài nguyên 3D cho trang QR nếu không tạo giá trị trực tiếp.

### 11.2. Khả dụng

- Không yêu cầu đăng nhập.
- Có liên kết dự phòng dạng chữ bên cạnh QR vật lý.
- Có nút quay về bộ sản phẩm.
- Hỗ trợ reload và mở trực tiếp URL trải nghiệm.

### 11.3. Accessibility

- Tương phản màu đạt WCAG AA cho văn bản.
- Logo và ảnh có `alt` phù hợp.
- Thứ tự heading hợp lệ.
- Không dùng màu là tín hiệu duy nhất cho trạng thái.
- Nút và liên kết có vùng chạm tối thiểu khoảng 44 × 44 px.
- Tôn trọng `prefers-reduced-motion`.

### 11.4. SEO

- `/experience/:product` có title, description và Open Graph riêng.
- `/q/:code` nên dùng `noindex,follow` để tránh tạo hàng loạt trang mã trong chỉ mục tìm kiếm.
- Canonical của trang trải nghiệm không chứa `batch` và tham số tracking.

### 11.5. Bảo mật

- Chỉ chuyển hướng đến destination trong registry nội bộ.
- Không tạo open redirect từ query string.
- Escape toàn bộ nội dung lấy từ API trước khi render.
- Rate-limit endpoint analytics trong giai đoạn có backend.
- Không công khai dữ liệu vận hành nhạy cảm trong mã QR.

---

## 12. Kiến trúc đề xuất

```text
src/
├── app/
│   └── router/
│       └── AppRouter.tsx
├── features/
│   ├── content/
│   │   └── qrExperience.ts
│   └── qr/
│       ├── components/
│       │   ├── QrStatusCard/
│       │   ├── StoryHero/
│       │   ├── CulturalStorySection/
│       │   ├── ExperienceGuide/
│       │   ├── ReflectionPrompt/
│       │   └── QrFeedbackForm/
│       ├── data/
│       │   ├── qrRecords.ts
│       │   └── qrBatchOverrides.ts
│       ├── pages/
│       │   ├── QrRedirectPage/
│       │   ├── ExperiencePage/
│       │   └── FeedbackPage/
│       ├── services/
│       │   └── qrRegistry.ts
│       └── types/
│           └── qr.ts
├── shared/
│   └── analytics/
│       └── analytics.ts
└── scripts/
    └── generate-qr.ts         # Giai đoạn sau
```

### 12.1. Nguyên tắc tổ chức

- `qrRecords` thuộc feature QR, không thuộc `sitePages`.
- `qrExperience.ts` chỉ chứa nội dung đã được duyệt.
- Logic trạng thái và thời hạn nằm trong service, không phân tán trong UI.
- UI không tự suy luận quy trình pha từ tên sản phẩm.
- Nội dung theo lô được chọn trước khi render trang.

---

## 13. Pseudocode xử lý QR

```ts
const code = normalizeQrCode(routeCode);
const record = getQrRecord(code);

if (!record) {
  track("qr_invalid");
  return <QrUnknownState />;
}

const status = resolveQrStatus(record, now);

if (status !== "active") {
  track("qr_inactive", { status });
  return <QrUnavailableState status={status} />;
}

track("qr_scan", {
  productSlug: record.productSlug,
  batchCode: record.batchCode,
  contentVersion: record.contentVersion,
});

navigate(
  buildExperienceUrl({
    destination: record.destination,
    batch: record.batchCode,
    source: "qr",
    content: `${record.productSlug}-scan`,
    version: record.contentVersion,
  }),
);
```

---

## 14. Kế hoạch triển khai

### Giai đoạn 1 — Chuẩn hóa nền QR

- [ ] Tách `QrRecord` và `qrRecords` khỏi `sitePages.ts`.
- [ ] Thêm `status` và `contentVersion`.
- [ ] Viết `resolveQrStatus()` để xử lý `activeFrom`, `expiresAt`, `paused`, `revoked`.
- [ ] Bổ sung trang trạng thái hết hạn.
- [ ] Thêm `noindex` cho `/q/:code`.
- [ ] Chuẩn hóa utility tạo URL trải nghiệm.

### Giai đoạn 2 — Hoàn thiện trang câu chuyện

- [ ] Tách các section thành component độc lập.
- [ ] Thêm phần câu chuyện sản phẩm.
- [ ] Thêm phần câu chuyện văn hóa.
- [ ] Thêm prompt cảm nhận.
- [ ] Bổ sung CTA chia sẻ.
- [ ] Cho phép nội dung theo `contentVersion`.
- [ ] Cho phép ghi đè hướng dẫn theo `batchCode`.

### Giai đoạn 3 — Analytics và phản hồi

- [ ] Bổ sung event theo bảng analytics.
- [ ] Truyền `contentVersion` vào biểu mẫu phản hồi.
- [ ] Không ghi PII vào event QR.
- [ ] Chuẩn bị adapter để chuyển từ `localStorage` sang backend analytics.

### Giai đoạn 4 — Sinh và kiểm thử QR

- [ ] Xác nhận domain production.
- [ ] Sinh QR mức sửa lỗi `H`.
- [ ] Áp dụng phong cách xanh — vàng, mô-đun bo tròn và logo giữa.
- [ ] Xuất SVG dùng cho in và PNG dùng cho digital.
- [ ] In thử đúng kích thước bao bì.
- [ ] Kiểm thử theo ma trận thiết bị.
- [ ] Lưu biên bản kiểm thử trước khi in số lượng lớn.

---

## 15. Test cases tối thiểu

### TC-QR-001 — Mã hợp lệ Petal Pack

**Given** mã `PP-2601-A` đang hoạt động  
**When** mở `/q/PP-2601-A`  
**Then** ghi nhận `qr_scan` và chuyển đến `/experience/petal-pack` với đúng mã lô.

### TC-QR-002 — Không phân biệt chữ hoa / thường

**Given** mã `PP-2601-A` tồn tại  
**When** mở `/q/pp-2601-a`  
**Then** hệ thống chuẩn hóa và xử lý như mã hợp lệ.

### TC-QR-003 — Mã không tồn tại

**When** mở `/q/UNKNOWN-CODE`  
**Then** hiển thị trạng thái không nhận diện, không chuyển hướng và có CTA về trang sản phẩm.

### TC-QR-004 — Mã tạm ngừng

**Given** mã có trạng thái `paused`  
**When** mở mã  
**Then** hiển thị thông báo tạm ngừng và không mở nội dung cũ.

### TC-QR-005 — Mã hết hạn

**Given** `expiresAt < now`  
**When** mở mã  
**Then** hiển thị trạng thái hết hạn và ghi nhận `qr_inactive` với `status=expired`.

### TC-QR-006 — Ghi đè theo lô

**Given** Petal Pack lô A và lô B có hướng dẫn khác nhau  
**When** mở từng QR  
**Then** mỗi trang hiển thị đúng hướng dẫn theo lô.

### TC-QR-007 — Không tạo open redirect

**When** mở `/q/PP-2601-A?destination=https://example.com`  
**Then** hệ thống bỏ qua destination từ query và chỉ dùng destination trong registry nội bộ.

### TC-QR-008 — Canonical không chứa tracking

**When** mở `/experience/petal-pack?batch=PP-2601-A&source=qr`  
**Then** canonical vẫn là `/experience/petal-pack`.

### TC-QR-009 — Nội dung dùng được khi ảnh lỗi

**Given** ảnh sản phẩm không tải được  
**Then** tiêu đề, câu chuyện và hướng dẫn vẫn đọc được.

### TC-QR-010 — QR vật lý

**Given** QR được in ở kích thước phát hành  
**When** quét bằng iPhone Camera, Android Camera/Google Lens và Zalo  
**Then** ít nhất 95% lượt thử mở đúng URL trong 3 giây.

---

## 16. Acceptance criteria

Chức năng được xem là hoàn tất khi:

- [ ] Ba QR mẫu Classic, Petal Pack và Gift Set mở đúng nội dung.
- [ ] Mã không tồn tại, tạm ngừng, hết hạn và thu hồi có trạng thái riêng.
- [ ] Không có open redirect.
- [ ] Nội dung được chọn theo sản phẩm và phiên bản.
- [ ] Có cơ chế ghi đè hướng dẫn theo lô.
- [ ] Petal Pack chỉ hiển thị quy trình pha đã được R&D xác nhận.
- [ ] Trang QR đọc tốt trên màn hình 360 px.
- [ ] Các CTA chính hoạt động.
- [ ] Sự kiện QR không chứa PII.
- [ ] Canonical và metadata đúng.
- [ ] QR cách điệu đã vượt qua kiểm thử vật lý đa thiết bị.
- [ ] Có URL dự phòng dạng chữ trên bao bì hoặc thẻ.

---

## 17. Definition of Done

- Code đã được lint và build thành công.
- Có unit test cho chuẩn hóa mã và trạng thái QR.
- Có integration test cho điều hướng `/q/:code`.
- Có review nội dung bởi nhóm Senova.
- Có xác nhận kỹ thuật từ nhóm R&D cho hướng dẫn pha theo từng phiên bản.
- Có kiểm tra accessibility cơ bản.
- Có kiểm thử trên thiết bị thật.
- Có ảnh hoặc biên bản chứng minh QR bản in quét ổn định.
- Tài liệu route, dữ liệu QR và quy trình cấp mã được cập nhật.

---

## 18. Quy ước cấp mã đề xuất

```text
{PRODUCT}-{YY}{BATCH}-{REVISION}
```

Ví dụ:

```text
CL-2601-A  → Classic, lô 01 năm 2026, revision A
PP-2601-A  → Petal Pack, lô 01 năm 2026, revision A
GS-2601-A  → Gift Set, lô 01 năm 2026, revision A
```

Quy tắc:

- Không tái sử dụng mã đã phát hành cho lô khác.
- Không đổi ý nghĩa của một mã sau khi đã in.
- Nếu nội dung thay đổi lớn, tăng `contentVersion` hoặc cấp revision mới.
- Mã thu hồi vẫn giữ trong registry để hiển thị trạng thái phù hợp, không xóa hoàn toàn.

---

## 19. Quyết định cần chốt trước khi code release

1. Domain chính thức của QR: `senova.vn`, domain Calmora hay domain Vercel.
2. Quy trình pha Petal Pack chính thức theo từng nguyên mẫu.
3. Cánh sen được pha cùng trà hay chỉ đóng vai trò bao ngoài ở từng phiên bản.
4. Thông số nước, nhiệt độ và thời gian đã được thử nghiệm đến mức nào.
5. Nội dung văn hóa nào có nguồn kiểm chứng và nội dung nào là diễn giải sáng tạo của thương hiệu.
6. Analytics production sử dụng backend riêng hay nền tảng bên thứ ba.
7. QR theo lô hay QR duy nhất theo từng đơn vị sản phẩm.
8. Có cần hỗ trợ tiếng Anh cho Gift Set hay không.

---

## 20. Kết luận triển khai

Repository hiện đã có phần lớn khung kỹ thuật của luồng QR. Hướng triển khai phù hợp là **mở rộng và chuẩn hóa feature `src/features/qr` hiện có**, không tạo một hệ QR song song.

Ưu tiên release:

1. Hoàn thiện trạng thái và versioning của QR.
2. Chốt nội dung và hướng dẫn Petal Pack theo nguyên mẫu.
3. Hoàn thiện trang câu chuyện mobile-first.
4. Bổ sung analytics có kiểm soát.
5. Kiểm thử QR cách điệu trên bản in thật trước khi sản xuất bao bì.
