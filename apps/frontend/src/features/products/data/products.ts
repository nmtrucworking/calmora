export type ProductId = "classic" | "petal-pack" | "gift-set";

export type SenovaProduct = {
  id: ProductId;
  slug: ProductId;
  name: string;
  line: ProductId;
  eyebrow: string;
  tagline: string;
  description: string;
  shortDescription: string;
  role: "Giữ" | "Mở" | "Trao";
  href: string;
  image: string;
  status: "draft" | "active" | "archived";
  priceLabel: string;
  availability: string;
  commerce?: {
    status: "IN_DEVELOPMENT" | "EARLY_ACCESS" | "PRE_ORDER" | "AVAILABLE" | "TEMPORARILY_UNAVAILABLE" | "SOLD_OUT" | "DISCONTINUED";
    statusLabel: string;
    priceType: "FIXED" | "ESTIMATED" | "STARTING_FROM" | "CONTACT";
    currency: "VND";
    displayPrice: boolean;
    minimumQuantity: number;
    maximumQuantity: number;
    cancellationPolicyId?: string;
  };
  brewing?: {
    waterTemperature?: { min: number; max: number; unit: "C" };
    waterVolume?: { min: number; max: number; unit: "ml" };
    steepingTime?: { min: number; max: number; unit: "minute" | "second" };
    warnings: string[];
    isAssumption: boolean;
    verificationStatus: "NOT_TESTED" | "IN_TESTING" | "VERIFIED" | "REQUIRES_RETEST";
    contentVersion: string;
  };
  variants: {
    id: string;
    label: string;
    note: string;
    price?: number;
    currency?: "VND";
    priceType?: "FIXED" | "ESTIMATED" | "STARTING_FROM" | "CONTACT";
    minimumQuantity?: number;
    maximumQuantity?: number;
    preparationTime?: { min: number; max: number; unit: "BUSINESS_DAY"; isAssumption: boolean };
    deliveryScopes?: { code: string; label: string; enabled: boolean }[];
    available?: boolean;
    cancellationPolicyId?: string;
  }[];
  includedItems: string[];
  dimensions: string;
  brewingNotes: string[];
  shippingNote: string;
  giftOptions: string[];
  badges: string[];
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  batchLabel?: string;
  heroAlt: string;
  suitableFor: string[];
  highlights: string[];
  experienceSteps: {
    title: string;
    text: string;
  }[];
  seo: {
    title: string;
    description: string;
  };
};

export const productSlugs: ProductId[] = ["classic", "petal-pack", "gift-set"];

export const products: SenovaProduct[] = [
  {
    id: "classic",
    slug: "classic",
    name: "Senova Classic",
    line: "classic",
    eyebrow: "GIỮ / Nghi thức hằng ngày",
    tagline: "Giữ hương sen trong nhịp sống mỗi ngày.",
    description:
      "Dòng trà hương sen nền tảng, được trình bày trong hình thức thuận tiện để người dùng có thể pha và thưởng thức thường xuyên.",
    shortDescription: "Dành cho những khoảng lặng có thể lặp lại mỗi ngày.",
    role: "Giữ",
    href: "/products/classic",
    image: "/assets/products/classic-pack-optimized.jpg",
    status: "active",
    priceLabel: "Liên hệ để nhận giá dự kiến",
    availability: "Đang nhận yêu cầu đặt trước",
    commerce: {
      status: "PRE_ORDER", statusLabel: "Đang nhận yêu cầu đặt trước", priceType: "CONTACT",
      currency: "VND", displayPrice: false, minimumQuantity: 1, maximumQuantity: 20,
      cancellationPolicyId: "senova-preorder-v1",
    },
    brewing: {
      waterTemperature: { min: 80, max: 85, unit: "C" },
      waterVolume: { min: 180, max: 220, unit: "ml" },
      steepingTime: { min: 3, max: 4, unit: "minute" },
      warnings: ["Thông số pha đang trong giai đoạn kiểm chứng."],
      isAssumption: true, verificationStatus: "IN_TESTING", contentVersion: "p0.2",
    },
    variants: [
      {
        id: "daily-box", label: "Hộp 10 túi lọc", note: "Nhịp thưởng trà hằng ngày",
        preparationTime: { min: 3, max: 5, unit: "BUSINESS_DAY", isAssumption: true },
        deliveryScopes: [{ code: "VN", label: "Toàn quốc", enabled: true }], available: true,
        cancellationPolicyId: "senova-preorder-v1",
      },
      {
        id: "trial-set", label: "Bộ thử 3 túi", note: "Dành cho lần chạm đầu tiên",
        preparationTime: { min: 3, max: 5, unit: "BUSINESS_DAY", isAssumption: true },
        deliveryScopes: [{ code: "VN", label: "Toàn quốc", enabled: true }], available: true,
        cancellationPolicyId: "senova-preorder-v1",
      },
    ],
    includedItems: [
      "Trà hương sen định lượng từng lần pha",
      "Thẻ hướng dẫn pha ngắn gọn",
      "Bao bì giấy mỹ thuật có niêm phong",
    ],
    dimensions: "Hộp 12 x 8 x 5 cm, phù hợp kệ trà hoặc bàn làm việc",
    brewingNotes: ["Dùng 180 ml nước nóng", "Chờ 4-5 phút", "Thưởng thức khi hương sen vừa mở"],
    shippingNote: "Senova sẽ xác nhận thời gian chuẩn bị và phạm vi giao hàng sau khi nhận yêu cầu.",
    giftOptions: ["Thêm thiệp lời nhắn", "Gói giấy lụa", "Lên lịch giao theo ngày"],
    badges: ["Everyday ritual", "Single serve", "Preorder"],
    primaryAction: {
      label: "Mở trải nghiệm Classic",
      href: "/experience/classic",
    },
    secondaryAction: {
      label: "Đăng ký đặt trước",
      href: "/order-request?product=classic",
    },
    heroAlt: "Hộp trà hương sen Senova Classic",
    suitableFor: [
      "Sử dụng hằng ngày",
      "Khoảng nghỉ tại nhà hoặc nơi làm việc",
      "Người mới bắt đầu tiếp cận trà hương sen",
      "Người muốn duy trì một nhịp thưởng trà đơn giản",
    ],
    highlights: [
      "Phần trà được định lượng cho một lần pha",
      "Thao tác sử dụng gọn và dễ hình thành thói quen",
      "Hương sen được đặt trong trải nghiệm thưởng trà chậm, không cầu kỳ",
      "Là điểm vào phù hợp cho người mới tiếp cận Senova",
    ],
    experienceSteps: [
      {
        title: "Mở gói",
        text: "Lấy một phần trà đã được định lượng, giữ thao tác gọn và sạch.",
      },
      {
        title: "Pha trà",
        text: "Đặt phần trà vào cốc và thực hiện theo hướng dẫn in trên bao bì của phiên bản sản phẩm.",
      },
      {
        title: "Giữ một khoảng chậm",
        text: "Dành thời gian để hương sen và vị trà dần hiện ra trước khi thưởng thức.",
      },
    ],
    seo: {
      title: "Senova Classic | Calmora",
      description:
        "Senova Classic giữ trà hương sen trong một hình thức dễ tiếp cận cho nhịp thưởng trà hằng ngày.",
    },
  },
  {
    id: "petal-pack",
    slug: "petal-pack",
    name: "Senova Petal Pack",
    line: "petal-pack",
    eyebrow: "MỞ / Trải nghiệm chủ đạo",
    tagline: "Mở một cánh sen, bắt đầu một khoảng lặng.",
    description:
      "Phần trà cho một lần pha, đặt trong túi lọc và được bao quanh bởi cánh sen sấy tạo hình búp sen.",
    shortDescription:
      "Phần trà một ly trong hình dáng búp sen, biến thao tác pha trà thành trải nghiệm giác quan.",
    role: "Mở",
    href: "/products/petal-pack",
    image: "/assets/products/petal-pack-optimized.jpg",
    status: "active",
    priceLabel: "Liên hệ để nhận giá dự kiến",
    availability: "Đang nhận yêu cầu đặt trước",
    commerce: {
      status: "PRE_ORDER", statusLabel: "Đang nhận yêu cầu đặt trước", priceType: "CONTACT",
      currency: "VND", displayPrice: false, minimumQuantity: 1, maximumQuantity: 10,
      cancellationPolicyId: "senova-preorder-v1",
    },
    brewing: {
      waterTemperature: { min: 80, max: 85, unit: "C" },
      waterVolume: { min: 220, max: 250, unit: "ml" },
      steepingTime: { min: 5, max: 7, unit: "minute" },
      warnings: ["Thông số pha đang trong giai đoạn kiểm chứng."],
      isAssumption: true, verificationStatus: "IN_TESTING", contentVersion: "p0.2",
    },
    variants: [
      {
        id: "petal-single", label: "Hộp 3 búp", note: "Trải nghiệm cá nhân",
        preparationTime: { min: 5, max: 7, unit: "BUSINESS_DAY", isAssumption: true },
        deliveryScopes: [{ code: "HCM", label: "TP. Hồ Chí Minh", enabled: true }], available: true,
        cancellationPolicyId: "senova-preorder-v1",
      },
      {
        id: "petal-hosting", label: "Hộp 9 búp", note: "Cho tasting và sự kiện nhỏ",
        preparationTime: { min: 5, max: 7, unit: "BUSINESS_DAY", isAssumption: true },
        deliveryScopes: [{ code: "HCM", label: "TP. Hồ Chí Minh", enabled: true }], available: true,
        cancellationPolicyId: "senova-preorder-v1",
      },
    ],
    includedItems: [
      "Petal Pack tạo hình búp sen",
      "Trà túi lọc một ly",
      "Thẻ QR câu chuyện và phản hồi",
      "Hướng dẫn nghi thức mở - pha",
    ],
    dimensions: "Mỗi Petal Pack được bảo quản trong khay riêng, hộp 18 x 12 x 7 cm",
    brewingNotes: ["Tách nhẹ cánh sen để thưởng hương", "Pha nguyên búp sen theo thông số hiển thị", "Chờ trà chiết xuất rồi thưởng thức"],
    shippingNote: "Senova sẽ xác nhận thời gian chuẩn bị và phạm vi giao hàng sau khi nhận yêu cầu.",
    giftOptions: ["Thiệp cá nhân hóa", "QR lời nhắn", "Gói riêng từng khách mời"],
    badges: ["Signature experience", "QR story", "Limited batch"],
    primaryAction: {
      label: "Bắt đầu trải nghiệm",
      href: "/experience/petal-pack",
    },
    secondaryAction: {
      label: "Gửi phản hồi",
      href: "/feedback/petal-pack",
    },
    batchLabel: "Lô thử nghiệm PP-2601-A",
    heroAlt: "Senova Petal Pack tạo hình búp sen với phần trà bên trong",
    suitableFor: [
      "Người muốn trải nghiệm một hình thức thưởng trà mới",
      "Hoạt động giới thiệu sản phẩm tại booth hoặc sự kiện",
      "Người quan tâm thiết kế, chất liệu và câu chuyện văn hóa",
      "Quà tặng nhỏ có tính trải nghiệm",
    ],
    highlights: [
      "Một phần trà tương ứng với một lần pha",
      "Cánh sen tạo hình búp trở thành điểm chạm trực quan của sản phẩm",
      "Thao tác mở gói được thiết kế như bước đầu của trải nghiệm",
      "Nội dung QR tiếp nối câu chuyện sau khi người dùng cầm sản phẩm",
      "Phù hợp cho hoạt động dùng thử, booth trải nghiệm và quà tặng nhỏ",
    ],
    experienceSteps: [
      {
        title: "Mở cánh sen",
        text: "Tách nhẹ phần cánh bên ngoài để thưởng hương, không mở rời toàn bộ búp.",
      },
      {
        title: "Cảm nhận",
        text: "Dành một khoảnh khắc để nhìn hình dáng, nhận biết chất liệu và cảm nhận hương trước khi rót nước.",
      },
      {
        title: "Pha trà",
        text: "Đặt phần trà vào cốc và thực hiện theo hướng dẫn in trên bao bì của phiên bản sản phẩm.",
      },
      {
        title: "Chờ",
        text: "Để hương và vị dần hiện ra. Trang QR có thể cung cấp câu chuyện ngắn trong khoảng thời gian này.",
      },
      {
        title: "Thưởng thức",
        text: "Quan sát màu nước, cảm nhận hương và vị, rồi ghi lại phản hồi về trải nghiệm.",
      },
    ],
    seo: {
      title: "Senova Petal Pack | Calmora",
      description:
        "Senova Petal Pack mở trải nghiệm trà hương sen bằng hình dáng búp sen, thao tác cảm nhận và nội dung QR.",
    },
  },
  {
    id: "gift-set",
    slug: "gift-set",
    name: "Senova Gift Set",
    line: "gift-set",
    eyebrow: "TRAO / Quà tặng văn hóa",
    tagline: "Trao hương sen, gửi một lời trân trọng.",
    description:
      "Bộ quà dự kiến kết hợp trà hương sen, Petal Pack, hướng dẫn pha và thẻ câu chuyện trong một hành trình trao tặng thống nhất.",
    shortDescription:
      "Bộ quà trà sen kết hợp sản phẩm, trải nghiệm và câu chuyện văn hóa trong một hành trình hoàn chỉnh.",
    role: "Trao",
    href: "/products/gift-set",
    image: "/assets/products/gift-set-optimized.jpg",
    status: "active",
    priceLabel: "Liên hệ để nhận giá dự kiến",
    availability: "Đang nhận yêu cầu tư vấn cấu hình",
    commerce: {
      status: "PRE_ORDER", statusLabel: "Đang nhận yêu cầu tư vấn cấu hình", priceType: "CONTACT",
      currency: "VND", displayPrice: false, minimumQuantity: 1, maximumQuantity: 100,
      cancellationPolicyId: "senova-preorder-v1",
    },
    variants: [
      {
        id: "gift-personal", label: "Gift Set cá nhân", note: "Quà tặng cá nhân",
        minimumQuantity: 1, maximumQuantity: 10,
        preparationTime: { min: 7, max: 10, unit: "BUSINESS_DAY", isAssumption: true },
        deliveryScopes: [{ code: "HCM", label: "TP. Hồ Chí Minh", enabled: true }], available: true,
        cancellationPolicyId: "senova-preorder-v1",
      },
      {
        id: "gift-corporate", label: "Gift Set doanh nghiệp", note: "Cấu hình cho đối tác và sự kiện",
        minimumQuantity: 10, maximumQuantity: 100,
        preparationTime: { min: 7, max: 10, unit: "BUSINESS_DAY", isAssumption: true },
        deliveryScopes: [{ code: "HCM", label: "TP. Hồ Chí Minh", enabled: true }], available: true,
        cancellationPolicyId: "senova-preorder-v1",
      },
    ],
    includedItems: [
      "Senova Classic",
      "Senova Petal Pack",
      "Thẻ câu chuyện và hướng dẫn pha",
      "Hộp quà cứng có lời nhắn",
    ],
    dimensions: "Hộp quà 28 x 20 x 9 cm, có thể điều chỉnh theo cấu hình doanh nghiệp",
    brewingNotes: ["Bắt đầu bằng lời nhắn", "Chọn Classic hoặc Petal Pack", "Dùng QR để tiếp tục câu chuyện"],
    shippingNote: "Senova sẽ xác nhận thời gian chuẩn bị và phạm vi giao hàng sau khi nhận yêu cầu.",
    giftOptions: ["Đóng dấu logo đối tác", "Thiệp song ngữ", "Giao nhiều địa chỉ", "Phiên bản theo mùa"],
    badges: ["Gifting", "Corporate", "Custom quote"],
    primaryAction: {
      label: "Đăng ký nhận thông tin",
      href: "/order-request?product=gift-set",
    },
    secondaryAction: {
      label: "Liên hệ tư vấn",
      href: "/contact?topic=gift-set",
    },
    heroAlt: "Bộ quà trà sen Senova Gift Set",
    suitableFor: ["Quà tri ân", "Quà lưu niệm", "Quà đối tác", "Phiên bản theo mùa"],
    highlights: [
      "Kết hợp sản phẩm, trải nghiệm và nội dung văn hóa trong một chỉnh thể",
      "Có thể điều chỉnh lời nhắn và nội dung QR theo dịp trao tặng",
      "Phù hợp với quà tri ân, quà lưu niệm, quà đối tác và phiên bản theo mùa",
      "Người nhận có thể tiếp tục chia sẻ câu chuyện sau khi thưởng thức",
    ],
    experienceSteps: [
      {
        title: "Mở hộp",
        text: "Tiếp cận từng thành phần theo một trình tự rõ ràng, không để phần trang trí lấn át sản phẩm.",
      },
      {
        title: "Đọc lời nhắn",
        text: "Nhận biết dụng ý của người trao và câu chuyện Giữ - Mở - Trao.",
      },
      {
        title: "Chọn trải nghiệm",
        text: "Bắt đầu với Classic cho một tách trà hằng ngày hoặc Petal Pack cho trải nghiệm mở cánh.",
      },
      {
        title: "Tiếp tục câu chuyện",
        text: "Dùng thẻ hoặc QR để đọc thêm và chia sẻ lại ý nghĩa của món quà.",
      },
    ],
    seo: {
      title: "Senova Gift Set | Calmora",
      description:
        "Senova Gift Set là phiên bản quà tặng đang hoàn thiện, kết nối trà hương sen, lời nhắn và câu chuyện văn hóa.",
    },
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function isProductSlug(slug: string): slug is ProductId {
  return productSlugs.includes(slug as ProductId);
}
