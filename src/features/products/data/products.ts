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
  role: string;
  href: string;
  image: string;
  status: "draft" | "active" | "archived";
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
};

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
    image: "/assets/products/classic-pack.png",
    status: "active",
    primaryAction: {
      label: "Đăng ký nhận thông tin",
      href: "/dat-truoc",
    },
    secondaryAction: {
      label: "Xem Petal Pack",
      href: "/products/petal-pack",
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
      "Hương sen được đặt trong một trải nghiệm thưởng trà chậm, không cầu kỳ",
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
    image: "/assets/products/petal-pack.png",
    status: "active",
    primaryAction: {
      label: "Bắt đầu trải nghiệm",
      href: "/trai-nghiem/petal-pack/mo-canh-sen",
    },
    secondaryAction: {
      label: "Xem hướng dẫn",
      href: "/ritual",
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
        text: "Mở nhẹ từng lớp cánh để quan sát cấu trúc Petal Pack và lấy phần trà bên trong.",
      },
      {
        title: "Cảm nhận",
        text: "Dành một khoảnh khắc để nhìn hình dáng, nhận biết chất liệu và cảm nhận hương trước khi pha.",
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
  },
  {
    id: "gift-set",
    slug: "gift-set",
    name: "Senova Gift Set",
    line: "gift-set",
    eyebrow: "TRAO / Quà tặng văn hóa",
    tagline: "Trao hương sen, gửi một lời trân trọng.",
    description:
      "Bộ quà kết hợp trà hương sen, Petal Pack, hướng dẫn pha và thẻ câu chuyện trong một hành trình trao tặng thống nhất.",
    shortDescription:
      "Bộ quà trà sen kết hợp sản phẩm, trải nghiệm và câu chuyện văn hóa trong một hành trình hoàn chỉnh.",
    role: "Trao",
    href: "/products/gift-set",
    image: "/assets/products/gift-set.png",
    status: "draft",
    primaryAction: {
      label: "Đăng ký nhận thông tin",
      href: "/dat-truoc",
    },
    secondaryAction: {
      label: "Xem Petal Pack",
      href: "/products/petal-pack",
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
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
