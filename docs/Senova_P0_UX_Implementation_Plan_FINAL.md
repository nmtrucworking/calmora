# SENOVA P0 — KẾ HOẠCH TRIỂN KHAI UX WEBSITE

> **Dự án:** Calmora / Senova  
> **Phiên bản:** P0.2 — Implementation Baseline  
> **Ngày cập nhật:** 20/07/2026  
> **Trạng thái:** **Đã chốt để triển khai website**  
> **Phạm vi:** Frontend, tích hợp backend sản phẩm, luồng đặt trước, QR Experience, nội dung hướng dẫn Petal Pack  
> **Mô hình vận hành:** Concierge Pre-order  
> **Nguyên tắc:** Frontend không hard-code dữ liệu thương mại có thể thay đổi; giá, thời gian chuẩn bị, phạm vi giao hàng và chính sách theo sản phẩm phải được render từ backend.

---

# 0. Quy ước trạng thái quyết định

| Nhãn | Ý nghĩa |
|---|---|
| `LOCKED` | Đã chốt, frontend và backend phải tuân thủ |
| `BE` | Dữ liệu được quản lý và trả về từ backend |
| `ASSUMPTION` | Dữ liệu giả định để hoàn thiện cấu trúc; phải có cờ nhận diện và được cập nhật sau |
| `VERIFIED` | Đã được nhóm sản phẩm/R&D kiểm chứng |
| `DRAFT` | Chưa được phép công bố như dữ liệu chính thức |

## 0.1. Nguyên tắc hiển thị dữ liệu giả định

1. Dữ liệu giả định được dùng để:
   - Hoàn thiện schema.
   - Xây UI.
   - Seed dữ liệu phát triển.
   - Kiểm thử luồng.
2. Dữ liệu giả định không được trình bày như thông số đã kiểm nghiệm.
3. Mọi thông số kỹ thuật phải có các trường:
   - `isAssumption`
   - `verificationStatus`
   - `contentVersion`
4. Frontend phải ưu tiên dữ liệu backend.
5. Khi backend không trả dữ liệu, frontend dùng fallback copy thay vì tự tạo số liệu mới.

---

# 1. Mục tiêu P0

Sau khi hoàn thành P0, website phải đáp ứng:

1. Người dùng hiểu rõ Senova đang nhận **yêu cầu đặt trước**, chưa phải cửa hàng thương mại điện tử thanh toán trực tiếp.
2. Người dùng đi từ trang sản phẩm đến gửi yêu cầu bằng một luồng duy nhất.
3. Giá, thời gian chuẩn bị, phạm vi giao hàng và chính sách được render từ backend.
4. Người dùng được Senova xác nhận qua **email và Zalo** trong **1–2 ngày làm việc**.
5. Thanh toán được thực hiện bằng **chuyển khoản sau xác nhận**.
6. Petal Pack có một specification thống nhất:
   - Tách nhẹ cánh sen.
   - Thưởng hương.
   - Pha nguyên búp sen.
7. QR Experience vận hành theo từng bước trên mobile.
8. Phản hồi chỉ xuất hiện sau khi người dùng hoàn thành hoặc gần hoàn thành trải nghiệm.
9. Metadata kỹ thuật không xuất hiện như nội dung chính trên giao diện.
10. Các route cũ không tạo dead-end hoặc kỳ vọng thanh toán sai.

---

# 2. Quyết định mô hình bán hàng

## 2.1. Mô hình chính — `LOCKED`

```text
Khám phá sản phẩm
→ Chọn cấu hình
→ Gửi yêu cầu đặt trước
→ Senova rà soát yêu cầu
→ Xác nhận qua email và Zalo
→ Thống nhất thời gian chuẩn bị, giao hàng và số tiền
→ Khách hàng chuyển khoản
→ Senova chuẩn bị sản phẩm
→ Giao hàng
```

## 2.2. Cấu hình vận hành

| Thuộc tính | Giá trị | Nguồn |
|---|---|---|
| Mô hình | Concierge Pre-order | `LOCKED` |
| Giá | Render từ backend | `BE` |
| Nhãn giá mặc định | Giá dự kiến | `LOCKED` |
| Thời gian phản hồi | 1–2 ngày làm việc | `LOCKED` |
| Thời gian chuẩn bị | Theo sản phẩm/variant | `BE` |
| Phạm vi giao hàng | Theo từng dòng sản phẩm/variant | `BE` |
| Kênh xác nhận | Email và Zalo | `LOCKED` |
| Thanh toán | Chuyển khoản sau xác nhận | `LOCKED` |
| CTA chính | Gửi yêu cầu đặt trước | `LOCKED` |
| CTA phụ | Xem nghi thức sử dụng | `LOCKED` |
| Xác nhận giao hàng cuối cùng | Chỉ hình thành sau khi Senova xác nhận | `LOCKED` |

## 2.3. Copy bắt buộc

```text
Đây là yêu cầu đặt trước, chưa phải giao dịch thanh toán trực tiếp.
Senova sẽ liên hệ qua email và Zalo trong 1–2 ngày làm việc để xác nhận
sản phẩm, số lượng, thời gian chuẩn bị, phạm vi giao hàng và thông tin chuyển khoản.
```

## 2.4. Copy trang thành công

```text
Yêu cầu đặt trước của bạn đã được ghi nhận.

Senova sẽ liên hệ qua email và Zalo trong 1–2 ngày làm việc để xác nhận
cấu hình sản phẩm, thời gian chuẩn bị, phạm vi giao hàng và thông tin chuyển khoản.

Yêu cầu này chưa phải xác nhận giao hàng cuối cùng.
```

---

# 3. Chính sách hủy và hoàn tiền

> **Trạng thái:** Chính sách vận hành đề xuất cho P0.  
> **Lưu ý:** Đây không phải tỷ lệ bắt buộc theo pháp luật. Trước khi thương mại hóa chính thức, cần rà soát với bộ phận pháp lý/kế toán và công bố rõ trong điều khoản giao dịch.

## 3.1. Ma trận hoàn tiền đề xuất

| Thời điểm/trạng thái | Tỷ lệ hoàn tiền đề xuất |
|---|---:|
| Chưa chuyển khoản | 100% — không phát sinh khoản thu |
| Đã chuyển khoản, chưa bắt đầu chuẩn bị | 90% |
| Đang chuẩn bị sản phẩm tiêu chuẩn | 70% |
| Sản phẩm cá nhân hóa đã được duyệt | 50% |
| Đã bàn giao cho đơn vị vận chuyển | Không hỗ trợ hủy |
| Senova không thể thực hiện yêu cầu | 100% |
| Sản phẩm lỗi, sai cấu hình hoặc hư hỏng do Senova | 100% hoặc đổi sản phẩm |

## 3.2. Mức fallback

Nếu backend giai đoạn đầu chỉ hỗ trợ một tỷ lệ:

```json
{
  "defaultRefundPercentAfterConfirmation": 80
}
```

Frontend không được hard-code tỷ lệ này. Đây chỉ là fallback cấu hình backend.

## 3.3. Nguyên tắc tính trạng thái

Tỷ lệ hoàn tiền được xác định theo trạng thái của yêu cầu tại **thời điểm khách hàng gửi yêu cầu hủy**, không phải thời điểm nhân viên xử lý.

## 3.4. Copy chính sách

```text
Khách hàng có thể yêu cầu hủy sau khi Senova xác nhận.
Mức hoàn tiền phụ thuộc vào trạng thái chuẩn bị sản phẩm.

- Hoàn 90% nếu sản phẩm chưa được chuẩn bị.
- Hoàn 70% nếu sản phẩm tiêu chuẩn đã bước vào giai đoạn chuẩn bị.
- Hoàn 50% đối với sản phẩm cá nhân hóa đã được duyệt.
- Yêu cầu đã bàn giao cho đơn vị vận chuyển không thuộc phạm vi hủy.

Trường hợp Senova không thể thực hiện yêu cầu, giao sai sản phẩm hoặc sản phẩm
bị lỗi do Senova, khách hàng được đổi sản phẩm hoặc hoàn 100%.
```

## 3.5. Cấu trúc backend

```ts
type CancellationPolicy = {
  id: string;
  version: string;
  currency: "VND";
  stages: {
    beforePayment: RefundRule;
    paidBeforePreparation: RefundRule;
    preparingStandardProduct: RefundRule;
    customizedProduct: RefundRule;
    handedToCarrier: RefundRule;
    sellerUnableToFulfill: RefundRule;
    defectiveOrIncorrectProduct: RefundRule;
  };
};

type RefundRule = {
  refundPercent: number;
  allowCancellation: boolean;
  allowReplacement?: boolean;
  description: string;
};
```

```json
{
  "id": "senova-preorder-v1",
  "version": "1.0",
  "currency": "VND",
  "stages": {
    "beforePayment": {
      "refundPercent": 100,
      "allowCancellation": true,
      "description": "Chưa phát sinh thanh toán"
    },
    "paidBeforePreparation": {
      "refundPercent": 90,
      "allowCancellation": true,
      "description": "Đã thanh toán, chưa bắt đầu chuẩn bị"
    },
    "preparingStandardProduct": {
      "refundPercent": 70,
      "allowCancellation": true,
      "description": "Đang chuẩn bị sản phẩm tiêu chuẩn"
    },
    "customizedProduct": {
      "refundPercent": 50,
      "allowCancellation": true,
      "description": "Sản phẩm cá nhân hóa đã được duyệt"
    },
    "handedToCarrier": {
      "refundPercent": 0,
      "allowCancellation": false,
      "description": "Đã bàn giao đơn vị vận chuyển"
    },
    "sellerUnableToFulfill": {
      "refundPercent": 100,
      "allowCancellation": true,
      "description": "Senova không thể thực hiện yêu cầu"
    },
    "defectiveOrIncorrectProduct": {
      "refundPercent": 100,
      "allowCancellation": true,
      "allowReplacement": true,
      "description": "Sản phẩm lỗi hoặc sai cấu hình do Senova"
    }
  }
}
```

---

# 4. Chuẩn hóa thuật ngữ

| Không dùng | Dùng chính thức |
|---|---|
| Inquiry Bag | Danh sách đặt trước |
| Add to inquiry bag | Chọn cấu hình |
| Checkout | Gửi yêu cầu đặt trước |
| Order | Yêu cầu đặt trước |
| Order history | Lịch sử yêu cầu |
| Availability | Tình trạng chuẩn bị |
| Price | Giá dự kiến |
| Concierge checkout | Xác nhận yêu cầu |
| Pre-order / Reorder | Đặt trước |
| Order confirmed | Yêu cầu đã được Senova xác nhận |
| Payment completed | Đã ghi nhận chuyển khoản |

## 4.1. CTA

```text
CTA chính: Gửi yêu cầu đặt trước
CTA phụ: Xem nghi thức sử dụng
CTA hỗ trợ: Liên hệ Senova
```

## 4.2. Nội dung bị cấm trong public UI

```text
Inquiry Bag
Add to inquiry bag
Checkout
Thanh toán ngay
Đặt hàng thành công
Mở từng lớp cánh sen
Lấy túi trà ra
Pha phần trà bên trong
```

---

# 5. Route và navigation

## 5.1. Route đặt trước chuẩn — `LOCKED`

```text
/order-request
```

## 5.2. Alias

```text
/reorder
/pre-order
/checkout
```

Các route trên phải redirect tới `/order-request` và bảo toàn query parameters hợp lệ.

## 5.3. Xử lý `/bag`

Phương án P0:

```text
/bag → redirect /order-request
```

Không duy trì giỏ hàng như một tính năng thương mại điện tử trong P0.

## 5.4. URL cấu hình

```text
/order-request
?product=petal-pack
&variant=box-3
&quantity=1
&intent=personal
&source=product-detail
```

## 5.5. Route public

```text
/
/products
/products/classic
/products/petal-pack
/products/gift-set
/ritual
/story
/gifting
/order-request
/order-request/success
/experience/classic
/experience/petal-pack
/experience/gift-set
/q/:code
/contact
/privacy
/terms
```

## 5.6. Header

```text
Sản phẩm
Nghi thức
Câu chuyện
Quà tặng
[Đặt trước]
```

## 5.7. Route cần ẩn nếu chưa có backend thật

```text
/wishlist
/account
/order-status
```

---

# 6. Cấu trúc dữ liệu sản phẩm

## 6.1. Product type

```ts
type ProductLine = "CLASSIC" | "PETAL_PACK" | "GIFT_SET";

type ProductCommerceStatus =
  | "IN_DEVELOPMENT"
  | "EARLY_ACCESS"
  | "PRE_ORDER"
  | "AVAILABLE"
  | "TEMPORARILY_UNAVAILABLE"
  | "SOLD_OUT"
  | "DISCONTINUED";

type PriceType =
  | "FIXED"
  | "ESTIMATED"
  | "STARTING_FROM"
  | "CONTACT";

type VerificationStatus =
  | "NOT_TESTED"
  | "IN_TESTING"
  | "VERIFIED"
  | "REQUIRES_RETEST";

type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortName: string;
  productLine: ProductLine;
  role: "Giữ" | "Mở" | "Trao";
  tagline: string;
  shortDescription: string;
  fullDescription: string;

  commerce: ProductCommerce;
  specification: ProductSpecification;
  brewing: BrewingSpecification;
  storage: StorageSpecification;
  safety: SafetySpecification;
  fulfillment: FulfillmentSpecification;

  variants: ProductVariant[];
  experience: ProductExperience;
  media: ProductMedia;
  seo: ProductSeo;
  metadata: ProductMetadata;
};
```

## 6.2. Commerce

```ts
type ProductCommerce = {
  status: ProductCommerceStatus;
  statusLabel: string;
  priceType: PriceType;
  currency: "VND";
  displayPrice: boolean;
  minimumQuantity: number;
  maximumQuantity: number;

  responseTime: {
    min: 1;
    max: 2;
    unit: "BUSINESS_DAY";
  };

  cancellationPolicyId: string;
};
```

## 6.3. Product specification

```ts
type Ingredient = {
  name: string;
  quantity?: number;
  unit?: string;
  origin?: string;
  verified: boolean;
};

type ProductSpecification = {
  ingredients: Ingredient[];

  netWeight?: {
    value: number;
    unit: "g" | "kg";
  };

  servings?: number;
  unitsPerPackage?: number;
  unitDescription?: string;

  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: "cm";
  };

  origin: string[];
  manufacturingMethod?: string;
  packagingMaterials: string[];
  isPrototype: boolean;
  isAssumption: boolean;
  verificationStatus: VerificationStatus;
};
```

## 6.4. Brewing specification

```ts
type BrewingSpecification = {
  waterTemperature?: {
    min: number;
    max: number;
    unit: "C";
  };

  waterVolume?: {
    min: number;
    max: number;
    unit: "ml";
  };

  steepingTime?: {
    min: number;
    max: number;
    unit: "minute" | "second";
  };

  maximumInfusions?: number;
  steps: BrewingStep[];
  warnings: string[];

  isAssumption: boolean;
  verificationStatus: VerificationStatus;
};

type BrewingStep = {
  id: string;
  order: number;
  title: string;
  description: string;
  mediaUrl?: string;
};
```

## 6.5. Storage and safety

```ts
type StorageSpecification = {
  shelfLifeMonths?: number;
  storageInstructions: string[];
  afterOpeningInstructions?: string;
  isAssumption: boolean;
  verificationStatus: VerificationStatus;
};

type SafetySpecification = {
  allergenInformation: string[];
  usageWarnings: string[];
  foodSafetyStatus: VerificationStatus;
  microbiologyTested: boolean;
  moistureTested: boolean;
};
```

## 6.6. Fulfillment

```ts
type DeliveryScope = {
  code: string;
  label: string;
  enabled: boolean;
  estimatedDeliveryDays?: {
    min: number;
    max: number;
  };
};

type FulfillmentSpecification = {
  deliveryScopes: DeliveryScope[];
  pickupAvailable: boolean;
  shippingFeeType: "FIXED" | "CALCULATED" | "CONFIRMED_LATER";
  fragile: boolean;
  requiresSpecialPackaging: boolean;
  deliveryNotes?: string;
};
```

## 6.7. Variant

```ts
type ProductVariant = {
  id: string;
  sku: string;
  name: string;
  description?: string;

  price?: number;
  currency: "VND";
  priceType: PriceType;

  unitsPerPackage: number;
  minimumQuantity: number;
  maximumQuantity: number;

  preparationTime: {
    min: number;
    max: number;
    unit: "BUSINESS_DAY";
    isAssumption: boolean;
  };

  deliveryScopes: DeliveryScope[];
  available: boolean;
  cancellationPolicyId: string;
};
```

## 6.8. Experience

```ts
type ProductExperience = {
  ritualAvailable: boolean;
  ritualSlug?: string;
  steps: BrewingStep[];

  story: {
    summary: string;
    fullContentUrl: string;
  };

  qrEnabled: boolean;
};
```

## 6.9. Media, SEO and metadata

```ts
type ProductMedia = {
  thumbnail?: string;
  heroImage?: string;
  gallery: string[];
  instructionImages: string[];
  instructionVideo?: string;
  altText: string;
};

type ProductSeo = {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
};

type ProductMetadata = {
  contentVersion: string;
  publishedAt?: string;
  updatedAt?: string;
  createdBy?: string;
  approvedBy?: string;
};
```

---

# 7. Dữ liệu giả định cho ba dòng sản phẩm

> Các giá trị trong phần này là seed data phục vụ phát triển.  
> Backend phải có thể thay thế toàn bộ mà không cần sửa frontend.

## 7.1. Senova Classic

| Trường | Giá trị giả định |
|---|---|
| Product line | `CLASSIC` |
| Vai trò | Giữ |
| SKU | `SEN-CLS-10` |
| Trạng thái | `PRE_ORDER` |
| Quy cách | Hộp 10 túi lọc |
| Định lượng | 2 g/túi |
| Khối lượng tịnh | 20 g |
| Thành phần | Trà xanh Thái Nguyên ướp hương sen |
| Số phần | 10 |
| Nhiệt độ nước | 80–85°C |
| Dung tích nước | 180–220 ml |
| Thời gian pha | 3–4 phút |
| Số lần pha | 1–2 |
| Thời gian chuẩn bị | 3–5 ngày làm việc |
| Phạm vi giao hàng | Toàn quốc |
| Hạn sử dụng | 9 tháng |
| Verification | `IN_TESTING` |
| isAssumption | `true` |

### Nghi thức

```text
Mở gói
→ Đặt túi trà vào dụng cụ pha
→ Rót nước
→ Chờ
→ Thưởng thức
```

## 7.2. Senova Petal Pack

| Trường | Giá trị giả định |
|---|---|
| Product line | `PETAL_PACK` |
| Vai trò | Mở |
| SKU | `SEN-PET-03` |
| Trạng thái | `EARLY_ACCESS` hoặc `PRE_ORDER` |
| Quy cách | Hộp 3 búp sen |
| Định lượng mỗi búp | 2 g trà + 1 búp sen tạo hình |
| Kích thước búp | Cao khoảng 5,5 cm |
| Nền trà | Trà xanh Thái Nguyên |
| Nguyên liệu sen | Cập nhật từ backend |
| Số phần | 3 |
| Nhiệt độ nước | 80–85°C |
| Dung tích nước | 220–250 ml |
| Thời gian pha | 5–7 phút |
| Số lần pha | 1–2 |
| Thời gian chuẩn bị | 5–7 ngày làm việc |
| Phạm vi giao hàng | TP.HCM và khu vực backend cho phép |
| Hạn sử dụng | 6 tháng |
| Verification | `IN_TESTING` |
| isAssumption | `true` |

### Nghi thức bắt buộc

```text
01. Quan sát búp sen
02. Tách nhẹ cánh sen để thưởng hương
03. Đặt nguyên búp sen vào dụng cụ pha
04. Rót nước theo thông số được hiển thị
05. Chờ trà chiết xuất
06. Thưởng thức
```

### Nội dung bị cấm

```text
Mở từng lớp cánh sen
Lấy túi trà ra
Pha phần trà bên trong
```

## 7.3. Senova Gift Set

| Trường | Giá trị giả định |
|---|---|
| Product line | `GIFT_SET` |
| Vai trò | Trao |
| SKU | `SEN-GFT-01` |
| Trạng thái | `PRE_ORDER` |
| Quy cách | Một bộ quà tặng |
| Thành phần bộ | 1 hộp Classic, 3 Petal Pack, thẻ câu chuyện, thẻ hướng dẫn, hộp quà |
| Tùy chọn | Lời nhắn quà tặng |
| Cá nhân hóa | Tên người nhận hoặc thiệp |
| Thời gian chuẩn bị | 7–10 ngày làm việc |
| Phạm vi giao hàng | TP.HCM và các khu vực backend cho phép |
| Hạn sử dụng | Theo sản phẩm có hạn ngắn nhất trong bộ |
| Chính sách hủy | Theo policy cá nhân hóa nếu đã duyệt |
| Verification | `IN_TESTING` |
| isAssumption | `true` |

Không mặc định đưa ấm hoặc tách trà vào Gift Set nếu backend không trả về cấu hình này.

---

# 8. Seed JSON tham khảo

```json
{
  "id": "petal-pack",
  "slug": "petal-pack",
  "sku": "SEN-PET-03",
  "name": "Senova Petal Pack",
  "shortName": "Petal Pack",
  "productLine": "PETAL_PACK",
  "role": "Mở",
  "tagline": "Mở cánh sen, chạm hương Việt",
  "shortDescription": "Một phần trà cho một lần pha, tạo hình thành búp sen.",
  "fullDescription": "Senova Petal Pack kết hợp trà hương sen định lượng với cánh sen tạo hình búp, giúp thao tác pha trà trở thành một nghi thức trực quan.",

  "commerce": {
    "status": "PRE_ORDER",
    "statusLabel": "Đang nhận yêu cầu đặt trước",
    "priceType": "ESTIMATED",
    "currency": "VND",
    "displayPrice": true,
    "minimumQuantity": 1,
    "maximumQuantity": 10,
    "responseTime": {
      "min": 1,
      "max": 2,
      "unit": "BUSINESS_DAY"
    },
    "cancellationPolicyId": "senova-preorder-v1"
  },

  "specification": {
    "ingredients": [
      {
        "name": "Trà xanh Thái Nguyên",
        "quantity": 2,
        "unit": "g",
        "origin": "Thái Nguyên",
        "verified": false
      },
      {
        "name": "Cánh sen tạo hình búp",
        "verified": false
      }
    ],
    "netWeight": {
      "value": 0,
      "unit": "g"
    },
    "servings": 3,
    "unitsPerPackage": 3,
    "unitDescription": "3 búp sen cho 3 lần pha",
    "dimensions": {
      "height": 5.5,
      "unit": "cm"
    },
    "origin": [
      "Thái Nguyên",
      "Nguồn sen cập nhật từ backend"
    ],
    "manufacturingMethod": "Trà được định lượng trong túi lọc, đặt trong búp sen tạo hình và sấy lạnh.",
    "packagingMaterials": [],
    "isPrototype": true,
    "isAssumption": true,
    "verificationStatus": "IN_TESTING"
  },

  "brewing": {
    "waterTemperature": {
      "min": 80,
      "max": 85,
      "unit": "C"
    },
    "waterVolume": {
      "min": 220,
      "max": 250,
      "unit": "ml"
    },
    "steepingTime": {
      "min": 5,
      "max": 7,
      "unit": "minute"
    },
    "maximumInfusions": 2,
    "steps": [
      {
        "id": "observe",
        "order": 1,
        "title": "Quan sát búp sen",
        "description": "Quan sát hình dáng và cấu trúc búp sen trước khi pha."
      },
      {
        "id": "open-lightly",
        "order": 2,
        "title": "Tách nhẹ cánh sen",
        "description": "Tách nhẹ phần cánh bên ngoài để thưởng hương, không mở rời toàn bộ búp."
      },
      {
        "id": "brew-whole-bud",
        "order": 3,
        "title": "Pha nguyên búp sen",
        "description": "Đặt nguyên búp sen vào dụng cụ pha và rót nước theo thông số hiển thị."
      },
      {
        "id": "wait",
        "order": 4,
        "title": "Chờ trà chiết xuất",
        "description": "Chờ theo thời gian hướng dẫn trước khi thưởng thức."
      }
    ],
    "warnings": [
      "Thông số pha đang trong giai đoạn kiểm chứng.",
      "Không sử dụng nếu bao bì hoặc sản phẩm có dấu hiệu hư hỏng."
    ],
    "isAssumption": true,
    "verificationStatus": "IN_TESTING"
  },

  "storage": {
    "shelfLifeMonths": 6,
    "storageInstructions": [
      "Bảo quản nơi khô ráo, thoáng mát.",
      "Tránh ánh nắng trực tiếp.",
      "Giữ sản phẩm trong bao bì kín."
    ],
    "afterOpeningInstructions": "Sử dụng ngay sau khi mở bao bì đơn vị.",
    "isAssumption": true,
    "verificationStatus": "IN_TESTING"
  },

  "safety": {
    "allergenInformation": [],
    "usageWarnings": [
      "Không sử dụng sản phẩm có dấu hiệu ẩm mốc hoặc mùi bất thường."
    ],
    "foodSafetyStatus": "IN_TESTING",
    "microbiologyTested": false,
    "moistureTested": false
  },

  "fulfillment": {
    "deliveryScopes": [
      {
        "code": "HCM",
        "label": "TP. Hồ Chí Minh",
        "enabled": true,
        "estimatedDeliveryDays": {
          "min": 1,
          "max": 3
        }
      }
    ],
    "pickupAvailable": false,
    "shippingFeeType": "CONFIRMED_LATER",
    "fragile": true,
    "requiresSpecialPackaging": true,
    "deliveryNotes": "Phạm vi giao hàng được xác nhận theo từng yêu cầu."
  },

  "variants": [
    {
      "id": "petal-box-3",
      "sku": "SEN-PET-03",
      "name": "Hộp 3 búp",
      "price": 0,
      "currency": "VND",
      "priceType": "ESTIMATED",
      "unitsPerPackage": 3,
      "minimumQuantity": 1,
      "maximumQuantity": 10,
      "preparationTime": {
        "min": 5,
        "max": 7,
        "unit": "BUSINESS_DAY",
        "isAssumption": true
      },
      "deliveryScopes": [
        {
          "code": "HCM",
          "label": "TP. Hồ Chí Minh",
          "enabled": true
        }
      ],
      "available": true,
      "cancellationPolicyId": "senova-preorder-v1"
    }
  ],

  "experience": {
    "ritualAvailable": true,
    "ritualSlug": "petal-pack",
    "steps": [],
    "story": {
      "summary": "Petal Pack biến một lần pha trà thành nghi thức mở, cảm nhận và thưởng thức.",
      "fullContentUrl": "/story/petal-pack"
    },
    "qrEnabled": true
  },

  "media": {
    "thumbnail": "",
    "heroImage": "",
    "gallery": [],
    "instructionImages": [],
    "instructionVideo": "",
    "altText": "Senova Petal Pack tạo hình búp sen"
  },

  "seo": {
    "title": "Senova Petal Pack",
    "description": "Trà hương sen trải nghiệm trong hình thức búp sen cho một lần pha.",
    "keywords": [
      "Senova",
      "Petal Pack",
      "trà hương sen",
      "trà văn hóa Việt"
    ],
    "canonicalUrl": "/products/petal-pack"
  },

  "metadata": {
    "contentVersion": "1.0",
    "publishedAt": null,
    "updatedAt": null,
    "createdBy": "",
    "approvedBy": ""
  }
}
```

---

# 9. Fallback frontend

| Trường backend thiếu | Nội dung hiển thị |
|---|---|
| Giá | `Liên hệ để nhận giá dự kiến` |
| Thời gian chuẩn bị | `Senova sẽ xác nhận sau khi nhận yêu cầu` |
| Phạm vi giao hàng | `Phạm vi giao hàng được xác nhận theo sản phẩm` |
| Phí giao hàng | `Phí giao hàng được xác nhận sau` |
| Hạn sử dụng | Ẩn trường |
| Thành phần | `Thông tin thành phần đang được cập nhật` |
| Thông số pha | `Thông số pha đang được hoàn thiện` |
| Tình trạng kiểm chứng | Hiển thị nhãn phù hợp với trạng thái |
| Sản phẩm tạm ngừng | Disable CTA và hiển thị `Tạm ngừng nhận đặt trước` |
| Chính sách hủy | Dùng policy mặc định do backend trả về |
| Ảnh | Dùng placeholder có alt text, không để layout vỡ |

## 9.1. Quy tắc bắt buộc

Frontend không được hard-code:

- Giá.
- Thời gian chuẩn bị.
- Phạm vi giao hàng.
- Phí giao hàng.
- Hạn sử dụng.
- Tỷ lệ hoàn tiền.
- Trạng thái tồn kho.
- Số lượng tối đa.
- Cấu hình cá nhân hóa.

---

# 10. Luồng đặt trước

## 10.1. Flow

```text
Trang sản phẩm
→ Chọn variant
→ Chọn số lượng
→ Chọn mục đích
→ Xem giá dự kiến
→ Gửi yêu cầu đặt trước
→ Nhập thông tin liên hệ
→ Xác nhận nội dung
→ Submit
→ Trang thành công
```

## 10.2. Product Detail transaction block

Bắt buộc có:

- Tên sản phẩm.
- Variant.
- Số lượng.
- Mục đích:
  - Dùng cá nhân.
  - Quà tặng.
  - Doanh nghiệp/sự kiện.
- Giá dự kiến.
- Thời gian chuẩn bị.
- Phạm vi giao hàng.
- CTA đặt trước.
- CTA nghi thức.
- Copy giải thích mô hình.

## 10.3. Order Request form

### Bắt buộc

- Họ tên.
- Số điện thoại.
- Email.
- Số Zalo hoặc xác nhận số điện thoại có dùng Zalo.
- Sản phẩm.
- Variant.
- Số lượng.
- Mục đích.
- Đồng ý để Senova liên hệ.
- Đồng ý chính sách đặt trước và hủy.

### Không bắt buộc

- Thời gian mong muốn nhận hàng.
- Ghi chú.
- Lời nhắn quà tặng.
- Tên người nhận.
- Yêu cầu cá nhân hóa.

### Không được đưa vào form

- Câu hỏi nghiên cứu dài.
- Đánh giá concept.
- SKU do người dùng nhập.
- Mã lô do người dùng nhập.
- Content version.
- Nguồn truy cập.

## 10.4. Payload

```json
{
  "productId": "petal-pack",
  "variantId": "petal-box-3",
  "quantity": 1,
  "intent": "personal",
  "desiredDate": "2026-08-15",

  "customer": {
    "name": "Nguyễn Văn A",
    "phone": "09xxxxxxxx",
    "email": "user@example.com",
    "zaloPhone": "09xxxxxxxx"
  },

  "gift": {
    "isGift": false,
    "recipientName": "",
    "message": "",
    "personalization": ""
  },

  "notes": "",

  "consent": {
    "allowContact": true,
    "acceptPreorderTerms": true,
    "acceptCancellationPolicy": true
  },

  "source": {
    "entry": "product-detail",
    "qrCode": null,
    "batchCode": null,
    "utmSource": null,
    "utmCampaign": null
  }
}
```

## 10.5. Response

```json
{
  "success": true,
  "requestCode": "SNV-2026-000123",
  "status": "REQUESTED",
  "expectedResponse": {
    "min": 1,
    "max": 2,
    "unit": "BUSINESS_DAY"
  },
  "confirmationChannels": [
    "EMAIL",
    "ZALO"
  ],
  "paymentMethod": "BANK_TRANSFER_AFTER_CONFIRMATION"
}
```

---

# 11. Trạng thái yêu cầu

```text
REQUESTED
→ REVIEWING
→ CONFIRMED
→ AWAITING_PAYMENT
→ PAID
→ PREPARING
→ READY_TO_SHIP
→ SHIPPED
→ COMPLETED
```

## 11.1. Nhánh hủy

```text
CANCELLATION_REQUESTED
→ CANCELLED
→ REFUND_PENDING
→ PARTIALLY_REFUNDED
hoặc
→ FULLY_REFUNDED
```

## 11.2. Nhãn tiếng Việt

| Status | Label |
|---|---|
| `REQUESTED` | Đã nhận yêu cầu |
| `REVIEWING` | Đang rà soát |
| `CONFIRMED` | Đã xác nhận |
| `AWAITING_PAYMENT` | Chờ chuyển khoản |
| `PAID` | Đã ghi nhận chuyển khoản |
| `PREPARING` | Đang chuẩn bị |
| `READY_TO_SHIP` | Sẵn sàng giao |
| `SHIPPED` | Đang giao |
| `COMPLETED` | Hoàn tất |
| `CANCELLATION_REQUESTED` | Đã yêu cầu hủy |
| `CANCELLED` | Đã hủy |
| `REFUND_PENDING` | Đang xử lý hoàn tiền |
| `PARTIALLY_REFUNDED` | Đã hoàn một phần |
| `FULLY_REFUNDED` | Đã hoàn toàn bộ |

---

# 12. Product Detail

## 12.1. Section 1 — Hero

- Tên sản phẩm.
- Vai trò:
  - Classic — Giữ.
  - Petal Pack — Mở.
  - Gift Set — Trao.
- Tagline.
- Ảnh sản phẩm.
- Giá dự kiến từ backend.
- Trạng thái.
- CTA đặt trước.
- CTA xem nghi thức.

## 12.2. Section 2 — Sản phẩm là gì

- Thành phần chính.
- Cấu trúc.
- Số phần/số lần sử dụng.
- Đối tượng phù hợp.
- Điểm khác biệt.

## 12.3. Section 3 — Cấu hình

- Variant.
- Số lượng.
- Mục đích.
- Bao bì.
- Tùy chọn quà tặng.
- Tùy chọn cá nhân hóa.

## 12.4. Section 4 — Thông tin giảm rủi ro

- Thành phần.
- Khối lượng.
- Kích thước.
- Điều kiện bảo quản.
- Hạn sử dụng.
- Nhiệt độ nước.
- Dung tích nước.
- Thời gian pha.
- Cảnh báo sử dụng.
- Trạng thái thử nghiệm/thương mại.

Dữ liệu có `isAssumption = true` phải được xử lý theo rule hiển thị của môi trường:

| Môi trường | Hành vi |
|---|---|
| Development | Hiển thị badge `Assumption` |
| Staging | Hiển thị badge nội bộ hoặc debug panel |
| Production | Không công bố như dữ liệu VERIFIED; dùng copy trung tính |

## 12.5. Section 5 — Nghi thức

Petal Pack:

```text
01. Quan sát búp sen
02. Tách nhẹ cánh sen để thưởng hương
03. Pha nguyên búp sen
04. Chờ và thưởng thức
```

## 12.6. Section 6 — Câu chuyện văn hóa

- 120–180 từ.
- CTA dẫn tới `/story` hoặc `/experience/:slug`.
- Không che lấp thông tin sản phẩm và dịch vụ.

## 12.7. Section 7 — Dịch vụ

- Thời gian phản hồi.
- Thời gian chuẩn bị.
- Phạm vi giao hàng.
- Kênh xác nhận.
- Phương thức thanh toán.
- Chính sách hủy.
- Chính sách sản phẩm lỗi.

---

# 13. Source of Truth cho Product Usage

```text
src/features/content/productUsage.ts
```

Hoặc dữ liệu được lấy hoàn toàn từ backend/CMS.

```ts
type ProductUsageSpec = {
  productId: string;
  version: string;
  approvedAt?: string;
  status: "DRAFT" | "APPROVED";

  steps: {
    id: string;
    order: number;
    title: string;
    text: string;
    media?: string;
  }[];

  brewing: {
    waterVolumeMl?: {
      min: number;
      max: number;
    };
    temperatureC?: {
      min: number;
      max: number;
    };
    steepingSeconds?: {
      min: number;
      max: number;
    };
    brews?: number;
  };

  warnings: string[];
  isAssumption: boolean;
  verificationStatus: VerificationStatus;
};
```

Mọi nơi phải đọc cùng nguồn:

- Product detail.
- Landing ritual.
- `/ritual`.
- `/experience/petal-pack`.
- QR content.
- Admin preview.
- Nội dung in bao bì.

---

# 14. Guided QR Ritual

## 14.1. Flow

```text
QR Scan
→ Intro
→ Chuẩn bị
→ Quan sát
→ Tách nhẹ cánh sen
→ Thưởng hương
→ Pha nguyên búp sen
→ Chờ
→ Thưởng thức
→ Phản hồi nhanh
→ CTA tiếp theo
```

## 14.2. Nguyên tắc

- Mobile-first.
- Không yêu cầu đăng nhập.
- Mỗi màn hình có một nhiệm vụ chính.
- Có progress.
- Có thể bỏ qua.
- Có resume state.
- Metadata không xuất hiện trong hero.
- Feedback ở cuối.

## 14.3. Intro

```text
SENOVA PETAL PACK

Mở một cánh sen, bắt đầu một khoảng lặng.

Một búp sen.
Một lần pha.
Một nghi thức.
```

CTA:

```text
Bắt đầu trải nghiệm
Chỉ đọc câu chuyện
```

## 14.4. Chuẩn bị

Hiển thị dữ liệu backend:

- Dụng cụ.
- Lượng nước.
- Nhiệt độ.
- Thời gian.
- Cảnh báo.

Nếu dữ liệu chưa verified:

```text
Thông số pha đang được Senova tiếp tục kiểm chứng.
Vui lòng sử dụng hướng dẫn của phiên bản sản phẩm bạn đang có.
```

## 14.5. Tách nhẹ

```text
Tách nhẹ phần cánh bên ngoài.
Không mở rời toàn bộ búp sen.
```

## 14.6. Thưởng hương

```text
Đưa búp sen lại gần.
Dành một nhịp để cảm nhận hương trước khi pha.
```

## 14.7. Pha nguyên búp

```text
Đặt nguyên búp sen vào dụng cụ pha.
Rót nước theo thông số của phiên bản sản phẩm.
```

## 14.8. Timer

- Giá trị lấy từ backend.
- Cho phép bỏ qua.
- Không khóa thao tác.
- Hiển thị nội dung văn hóa ngắn.

## 14.9. Phản hồi nhanh

### Câu 1

```text
Điều khiến bạn nhớ nhất là gì?
```

- Hình dáng búp sen.
- Hương.
- Thao tác tách nhẹ.
- Màu nước.
- Vị trà.
- Câu chuyện.

### Câu 2

```text
Trải nghiệm có dễ hiểu không?
```

Thang 1–5.

### Câu 3 — không bắt buộc

```text
Bạn muốn chia sẻ thêm điều gì?
```

## 14.10. CTA cuối

1. Đặt trước Petal Pack.
2. Khám phá bộ sản phẩm.
3. Chia sẻ câu chuyện.
4. Xem nguồn gốc sản phẩm, nếu có.

---

# 15. Quick Feedback payload

```json
{
  "productId": "petal-pack",
  "qrCode": "PP-2601-A",
  "batchCode": "PP-2601-A",
  "contentVersion": "v2",
  "completedStep": "complete",
  "mostMemorable": "aroma",
  "clarityScore": 5,
  "comment": "",
  "locale": "vi",
  "timestamp": "2026-07-20T13:00:00Z"
}
```

Không đưa dữ liệu cá nhân vào analytics event.

---

# 16. Analytics

## 16.1. Funnel đặt trước

```text
product_view
configuration_select
order_request_start
order_request_submit
order_request_success
```

## 16.2. Funnel QR

```text
qr_scan
experience_intro_view
ritual_start
ritual_step_complete
ritual_complete
quick_feedback_submit
order_request_click
```

## 16.3. Thuộc tính

- Product.
- Variant.
- Quantity.
- Intent.
- Entry source.
- Locale.
- Device category.
- QR code.
- Batch.
- Content version.
- Step id.
- Time spent.
- Exit step.

Không gửi:

- Họ tên.
- Email.
- Số điện thoại.
- Nội dung Zalo.

---

# 17. Kiến trúc component

## 17.1. Order Request

```text
features/order-request/
├── pages/
│   ├── OrderRequestPage.tsx
│   └── OrderRequestSuccessPage.tsx
├── components/
│   ├── OrderSummary.tsx
│   ├── ProductConfiguration.tsx
│   ├── ContactFields.tsx
│   ├── GiftFields.tsx
│   ├── ConsentField.tsx
│   ├── CancellationPolicyDisclosure.tsx
│   └── OrderRequestStatus.tsx
├── services/
│   └── submitOrderRequest.ts
├── schema/
│   └── orderRequestSchema.ts
└── types.ts
```

## 17.2. QR Ritual

```text
features/qr/
├── pages/
│   ├── ExperiencePage/
│   └── QrRedirectPage/
├── components/
│   ├── RitualShell.tsx
│   ├── RitualProgress.tsx
│   ├── RitualIntro.tsx
│   ├── RitualPreparation.tsx
│   ├── RitualStep.tsx
│   ├── RitualTimer.tsx
│   ├── SensoryPrompt.tsx
│   ├── QuickFeedback.tsx
│   └── ProductInfoDisclosure.tsx
├── services/
│   ├── useQrExperience.ts
│   ├── useRitualProgress.ts
│   └── submitQuickFeedback.ts
└── types.ts
```

## 17.3. Product

```text
features/products/
├── api/
│   ├── getProduct.ts
│   ├── getProductVariant.ts
│   └── getCancellationPolicy.ts
├── components/
│   ├── ProductHero.tsx
│   ├── ProductConfigurator.tsx
│   ├── ProductServiceInfo.tsx
│   ├── ProductSpecification.tsx
│   ├── ProductAssumptionBadge.tsx
│   └── ProductRitualPreview.tsx
├── schema/
│   └── productSchema.ts
└── types.ts
```

---

# 18. Các file cần chỉnh sửa

## Router

```text
apps/frontend/src/app/router/AppRouter.tsx
```

- Thêm `/order-request`.
- Thêm `/order-request/success`.
- Redirect route cũ.
- Ẩn route mock.

## Product Detail

```text
apps/frontend/src/features/products/pages/ProductDetailPage/index.tsx
```

- Loại Inquiry Bag khỏi CTA chính.
- Lấy giá từ backend.
- Lấy preparation time từ backend.
- Lấy delivery scope từ backend.
- Thêm variant, quantity, intent.
- Điều hướng trực tiếp tới `/order-request`.
- Đồng bộ usage specification.

## Inquiry Bag

```text
apps/frontend/src/app/providers/InquiryBagContext.tsx
```

P0: loại khỏi public flow.

## Pre-order Page

```text
apps/frontend/src/features/inquiry/pages/PreOrderPage/index.tsx
```

- Chuyển logic sang `features/order-request`.
- Tách khảo sát validation.
- Dùng dữ liệu query/backend.
- Đổi copy.
- Thêm policy disclosure.

## Experience Page

```text
apps/frontend/src/features/qr/pages/ExperiencePage/index.tsx
```

- Chuyển sang state machine/step flow.
- Thêm progress.
- Thêm timer.
- Thêm resume state.
- Thêm quick feedback.
- Ẩn metadata.

## QR Feedback

```text
apps/frontend/src/features/qr/components/QrFeedbackForm.tsx
```

- Thay bằng QuickFeedback.
- Auto-populate metadata.
- Không yêu cầu SKU, email hoặc source.
- Không redirect khỏi flow.

## QR Content

```text
apps/frontend/src/features/content/qrExperience.ts
```

- Tách nhẹ cánh sen.
- Thưởng hương.
- Pha nguyên búp sen.
- Không lấy túi trà ra.

## Landing Ritual

```text
apps/frontend/src/features/content/luxuryCopy.ts
apps/frontend/src/features/landing/sections/TeaRitual.tsx
```

- Đồng bộ với source of truth.
- Không dùng “mở từng lớp”.
- Không dùng ảnh sai thao tác.

## Header

```text
apps/frontend/src/app/layout/SiteLayout.tsx
```

- Giảm navigation.
- CTA tới `/order-request`.
- Âm thanh chỉ trong ritual context.

---

# 19. UI requirements

## 19.1. Breakpoints kiểm thử

- 360 × 800.
- 390 × 844.
- 430 × 932.
- 768 × 1024.
- 1440 × 900.

## 19.2. Typography

- Body mobile tối thiểu 16 px.
- Line-height 1.6–1.8.
- Label kỹ thuật tối thiểu 12 px.
- Không dùng tracking lớn cho đoạn dài.

## 19.3. Touch target

- Nút tối thiểu 44 × 44 px.
- Khoảng cách CTA tối thiểu 8 px.
- Không phụ thuộc swipe.

## 19.4. Motion

- Hỗ trợ reduced motion.
- Không particle cursor trong QR flow.
- Timer không phụ thuộc animation.
- Motion chỉ biểu thị progress, step hoặc thao tác.

## 19.5. Contrast

- Gold chỉ làm accent.
- Không dùng gold cho body text dài.
- Text muted phải đủ tương phản.

---

# 20. Error states

## 20.1. QR

- Mã không tồn tại.
- Mã tạm ngừng.
- Mã hết hạn.
- Nội dung đang bảo trì.
- Không có kết nối.
- Backend lỗi.

Mỗi trạng thái có:

- Tiêu đề dễ hiểu.
- Mô tả không kỹ thuật.
- Thử lại.
- Về trang sản phẩm.
- Liên hệ hỗ trợ.

## 20.2. Order request

- Lỗi tại field.
- Giữ dữ liệu đã nhập.
- Retry.
- Không reset form.
- Có phương án liên hệ trực tiếp.

---

# 21. Sprint triển khai

## Sprint P0-A — Data contract và nội dung

- [x] Chốt mô hình Concierge Pre-order.
- [x] Chốt kênh xác nhận email và Zalo.
- [x] Chốt chuyển khoản sau xác nhận.
- [x] Chốt thời gian phản hồi 1–2 ngày làm việc.
- [x] Chốt policy hoàn tiền đề xuất.
- [x] Chốt route chuẩn.
- [x] Chốt terminology.
- [x] Chốt quy trình Petal Pack.
- [ ] Tạo schema backend.
- [ ] Seed dữ liệu giả định.
- [ ] Tạo source of truth.
- [ ] Sửa copy mâu thuẫn.

## Sprint P0-B — Order Request

- [ ] Xây `/order-request`.
- [ ] Tích hợp product/variant API.
- [ ] Render giá từ backend.
- [ ] Render preparation time từ backend.
- [ ] Render delivery scopes từ backend.
- [ ] Thêm email và Zalo.
- [ ] Thêm policy disclosure.
- [ ] Xây success screen.
- [ ] Redirect route cũ.
- [ ] Thêm error handling.
- [ ] Thêm analytics.

## Sprint P0-C — Product Detail

- [ ] Chuẩn hóa ba product detail.
- [ ] Tích hợp schema đầy đủ.
- [ ] Thêm fallback.
- [ ] Thêm badge trạng thái.
- [ ] Thêm service information.
- [ ] Thêm ritual preview.
- [ ] Không hard-code dữ liệu thương mại.

## Sprint P0-D — Guided QR Ritual

- [ ] Xây RitualShell.
- [ ] Xây progress.
- [ ] Xây step content.
- [ ] Xây timer.
- [ ] Xây resume state.
- [ ] Xây quick feedback.
- [ ] Ẩn metadata.
- [ ] Thêm QR error states.

## Sprint P0-E — QA và soft launch

- [ ] Mobile QA.
- [ ] Accessibility QA.
- [ ] Copy QA.
- [ ] Route QA.
- [ ] API fallback QA.
- [ ] Analytics QA.
- [ ] Error-state QA.
- [ ] Performance QA.
- [ ] Soft launch.

---

# 22. Ma trận kiểm thử

## 22.1. Product API

| Case | Kỳ vọng |
|---|---|
| Có giá | Hiển thị giá backend |
| Không có giá | Hiển thị fallback |
| Có preparation time | Hiển thị theo variant |
| Thiếu preparation time | Hiển thị copy xác nhận sau |
| Có delivery scope | Hiển thị danh sách |
| Không có delivery scope | Hiển thị xác nhận theo sản phẩm |
| `isAssumption = true` | Không trình bày như VERIFIED |
| Product unavailable | Disable CTA |

## 22.2. Order Request

| Case | Kỳ vọng |
|---|---|
| Mở từ Petal Pack | Prefill product |
| Variant khác | Summary cập nhật |
| Quantity = 0 | Báo lỗi |
| Thiếu phone | Báo lỗi |
| Thiếu email | Báo lỗi |
| Thiếu Zalo | Báo lỗi hoặc cho dùng phone làm Zalo |
| Chưa đồng ý policy | Không submit |
| Submit lỗi | Giữ dữ liệu |
| Submit thành công | Có request code |
| `/checkout` cũ | Redirect |
| `/reorder` cũ | Redirect |

## 22.3. QR

| Case | Kỳ vọng |
|---|---|
| QR hợp lệ | Vào intro |
| QR không tồn tại | Error page riêng |
| Reload bước 5 | Khôi phục |
| Reduced motion | Không animation dư |
| Timer | Có thể bỏ qua |
| Feedback | Không rời flow |
| CTA đặt trước | Prefill product và source QR |

## 22.4. Copy audit

Tìm toàn repo:

```text
mở từng lớp
lấy túi trà
pha phần trà bên trong
inquiry bag
checkout
đặt hàng thành công
```

Kỳ vọng: không còn trong public Vietnamese UI.

---

# 23. Definition of Done

P0 hoàn thành khi:

- [ ] Một route đặt trước công khai.
- [ ] Không có UI giả lập thanh toán trực tiếp.
- [ ] Giá render từ backend.
- [ ] Preparation time render từ backend.
- [ ] Delivery scope render từ backend.
- [ ] Email và Zalo là kênh xác nhận.
- [ ] Copy 1–2 ngày làm việc xuất hiện đúng chỗ.
- [ ] Chuyển khoản sau xác nhận được giải thích rõ.
- [ ] Chính sách hủy được hiển thị trước submit.
- [ ] Petal Pack dùng quy trình tách nhẹ – thưởng hương – pha nguyên búp.
- [ ] QR chạy theo step flow.
- [ ] Feedback ở cuối.
- [ ] Metadata kỹ thuật không nằm trong hero.
- [ ] Route cũ redirect.
- [ ] Form lỗi không mất dữ liệu.
- [ ] Có analytics.
- [ ] Pass mobile QA.
- [ ] Pass accessibility QA.
- [ ] Pass copy audit.
- [ ] Dữ liệu giả định có cờ và không bị công bố như VERIFIED.

---

# 24. Backlog P0

| ID | Công việc | Ưu tiên | Phụ thuộc |
|---|---|---:|---|
| P0-01 | Tạo Product schema | Critical | Quyết định đã chốt |
| P0-02 | Tạo Variant schema | Critical | P0-01 |
| P0-03 | Tạo Cancellation Policy schema | Critical | Quyết định đã chốt |
| P0-04 | Seed ba dòng sản phẩm | Critical | P0-01, P0-02 |
| P0-05 | Tạo API product detail | Critical | P0-04 |
| P0-06 | Hợp nhất route đặt trước | Critical | Router |
| P0-07 | Xây Order Request Page | Critical | P0-05, P0-06 |
| P0-08 | Xây Success Page | Critical | P0-07 |
| P0-09 | Sửa Product Detail CTA | Critical | P0-07 |
| P0-10 | Tích hợp giá backend | Critical | P0-05 |
| P0-11 | Tích hợp preparation time | Critical | P0-05 |
| P0-12 | Tích hợp delivery scope | Critical | P0-05 |
| P0-13 | Redirect route cũ | High | P0-06 |
| P0-14 | Tạo source of truth usage | Critical | Product spec |
| P0-15 | Xây Guided QR Ritual | Critical | P0-14 |
| P0-16 | Xây Quick Feedback | High | P0-15 |
| P0-17 | Thêm QR error states | High | P0-15 |
| P0-18 | Thêm analytics | High | P0-07, P0-15 |
| P0-19 | Copy audit | Critical | Toàn bộ |
| P0-20 | Mobile QA | Critical | Toàn bộ |
| P0-21 | Accessibility QA | High | Toàn bộ |
| P0-22 | Soft launch | Critical | QA pass |

---

# 25. Các điểm chưa được xem là đã xác minh

- Công thức chính thức từng sản phẩm.
- Khối lượng thực tế sau sấy.
- Nhiệt độ nước tối ưu.
- Dung tích nước tối ưu.
- Thời gian pha tối ưu.
- Số lần pha.
- Hạn sử dụng.
- Kiểm nghiệm độ ẩm.
- Kiểm nghiệm vi sinh.
- Chứng nhận an toàn thực phẩm.
- Phạm vi giao hàng thực tế từng variant.
- Giá bán.
- Phí giao hàng.
- Thời gian chuẩn bị thực tế.
- Thành phần chính xác của Gift Set.
- Cấu hình cá nhân hóa.
- Tỷ lệ hoàn tiền cuối cùng sau rà soát pháp lý/kế toán.

Các mục này phải được quản lý từ backend hoặc CMS và cập nhật sau khi được kiểm chứng.

---

# 26. Kết luận triển khai

P0 được khóa theo sáu nguyên tắc:

```text
Một mô hình giao dịch
Một route đặt trước
Một schema sản phẩm
Một nguồn hướng dẫn sử dụng
Một trình tự nghi thức
Một hệ phản hồi ngắn
```

Frontend chịu trách nhiệm trình bày đúng trạng thái dữ liệu.

Backend chịu trách nhiệm cung cấp:

- Giá.
- Variant.
- Thời gian chuẩn bị.
- Phạm vi giao hàng.
- Trạng thái sản phẩm.
- Chính sách hủy.
- Specification.
- Trạng thái kiểm chứng.

Dữ liệu giả định chỉ phục vụ phát triển và không được tự động xem là dữ liệu thương mại chính thức.
