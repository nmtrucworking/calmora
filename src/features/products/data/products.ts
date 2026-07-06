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
  variants: {
    id: string;
    label: string;
    note: string;
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
    priceLabel: "Từ 320.000 VND",
    availability: "Mở danh sách đặt trước theo lô nhỏ",
    variants: [
      { id: "daily-box", label: "Hộp 12 gói", note: "Nhịp thưởng trà hằng ngày" },
      { id: "trial-set", label: "Bộ thử 3 gói", note: "Dành cho lần chạm đầu tiên" },
    ],
    includedItems: [
      "Trà hương sen định lượng từng lần pha",
      "Thẻ hướng dẫn pha ngắn gọn",
      "Bao bì giấy mỹ thuật có niêm phong",
    ],
    dimensions: "Hộp 12 x 8 x 5 cm, phù hợp kệ trà hoặc bàn làm việc",
    brewingNotes: ["Dùng 180 ml nước nóng", "Chờ 4-5 phút", "Thưởng thức khi hương sen vừa mở"],
    shippingNote: "Dự kiến giao trong 3-5 ngày làm việc sau khi xác nhận concierge.",
    giftOptions: ["Thêm thiệp lời nhắn", "Gói giấy lụa", "Lên lịch giao theo ngày"],
    badges: ["Everyday ritual", "Single serve", "Preorder"],
    primaryAction: {
      label: "Mở trải nghiệm Classic",
      href: "/experience/classic",
    },
    secondaryAction: {
      label: "Đăng ký đặt trước",
      href: "/dat-truoc?product=classic",
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
    priceLabel: "Từ 480.000 VND",
    availability: "Lô trải nghiệm PP-2601-A đang nhận inquiry",
    variants: [
      { id: "petal-single", label: "Set 6 Petal Pack", note: "Trải nghiệm cá nhân" },
      { id: "petal-hosting", label: "Set 18 Petal Pack", note: "Cho tasting và booth" },
    ],
    includedItems: [
      "Petal Pack tạo hình búp sen",
      "Trà túi lọc một ly",
      "Thẻ QR câu chuyện và phản hồi",
      "Hướng dẫn nghi thức mở - pha",
    ],
    dimensions: "Mỗi Petal Pack được bảo quản trong khay riêng, hộp 18 x 12 x 7 cm",
    brewingNotes: ["Mở từng lớp cánh sen", "Dùng 200 ml nước nóng", "Chờ 5 phút và quét QR trong lúc đợi"],
    shippingNote: "Hàng thử nghiệm được concierge xác nhận lịch giao và điều kiện bảo quản.",
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
        text: "Mở nhẹ từng lớp cánh để quan sát cấu trúc Petal Pack và cảm nhận hình dáng trước khi pha.",
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
    status: "draft",
    priceLabel: "Báo giá theo cấu hình quà tặng",
    availability: "Nhận tư vấn corporate và seasonal gifting",
    variants: [
      { id: "gift-personal", label: "Personal Gift Set", note: "Quà tặng cá nhân cao cấp" },
      { id: "gift-corporate", label: "Corporate Edition", note: "Cấu hình cho đối tác và sự kiện" },
    ],
    includedItems: [
      "Senova Classic",
      "Senova Petal Pack",
      "Thẻ câu chuyện và hướng dẫn pha",
      "Hộp quà cứng có lời nhắn",
    ],
    dimensions: "Hộp quà 28 x 20 x 9 cm, có thể điều chỉnh theo cấu hình doanh nghiệp",
    brewingNotes: ["Bắt đầu bằng lời nhắn", "Chọn Classic hoặc Petal Pack", "Dùng QR để tiếp tục câu chuyện"],
    shippingNote: "Concierge xác nhận số lượng, ngày giao, tên người nhận và lời nhắn trước khi chốt đơn.",
    giftOptions: ["Đóng dấu logo đối tác", "Thiệp song ngữ", "Giao nhiều địa chỉ", "Phiên bản theo mùa"],
    badges: ["Gifting", "Corporate", "Custom quote"],
    primaryAction: {
      label: "Đăng ký nhận thông tin",
      href: "/dat-truoc?product=gift-set",
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
