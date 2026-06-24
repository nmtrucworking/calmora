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
    eyebrow: "Nghi thức hằng ngày",
    tagline: "Giữ hương sen Việt trong từng tách trà.",
    description:
      "Dòng trà hương sen nền tảng, định lượng gọn, dễ pha và phù hợp với nhịp sử dụng hằng ngày.",
    shortDescription:
      "Một lựa chọn ổn định cho người muốn giữ nghi thức trà sen trong lịch sinh hoạt thường nhật.",
    role: "Dòng nền tảng",
    href: "/san-pham/classic",
    image: "/assets/products/classic-pack.png",
    status: "active",
    primaryAction: {
      label: "Đăng ký nhận thông tin",
      href: "/dat-truoc",
    },
    secondaryAction: {
      label: "Xem Petal Pack",
      href: "/san-pham/petal-pack",
    },
    heroAlt: "Hộp trà Senova Classic",
    suitableFor: ["Dùng hằng ngày", "Văn phòng", "Người mới bắt đầu uống trà sen"],
    highlights: [
      "Định lượng rõ cho một lần pha",
      "Bao bì gọn để bảo quản và mang theo",
      "Hương sen nhẹ, dễ tiếp cận",
    ],
    experienceSteps: [
      {
        title: "Mở gói",
        text: "Lấy một phần trà đã được định lượng sẵn, giữ thao tác nhanh và sạch.",
      },
      {
        title: "Pha trà",
        text: "Đặt túi trà vào cốc, rót nước theo hướng dẫn của phiên bản sản phẩm.",
      },
      {
        title: "Giữ một khoảng chậm",
        text: "Dành vài phút để hương sen mở ra trước khi thưởng thức.",
      },
    ],
  },
  {
    id: "petal-pack",
    slug: "petal-pack",
    name: "Senova Petal Pack",
    line: "petal-pack",
    eyebrow: "Trải nghiệm chủ đạo",
    tagline: "Mở một cánh sen, pha một câu chuyện Việt.",
    description:
      "Phần trà cho một lần pha được bao quanh bởi cánh sen tạo hình búp, biến thao tác mở gói thành một nghi thức trực quan.",
    shortDescription:
      "Sản phẩm ưu tiên cho hành trình QR: mở pack, pha trà, đọc câu chuyện văn hóa và gửi phản hồi.",
    role: "Dòng chủ đạo",
    href: "/san-pham/petal-pack",
    image: "/assets/products/petal-pack.png",
    status: "active",
    primaryAction: {
      label: "Bắt đầu trải nghiệm mẫu",
      href: "/trai-nghiem/petal-pack/mo-canh-sen",
    },
    secondaryAction: {
      label: "Xem hướng dẫn nhanh",
      href: "/huong-dan-pha",
    },
    batchLabel: "Lô thử nghiệm PP-2601-A",
    heroAlt: "Senova Petal Pack tạo hình búp sen",
    suitableFor: ["Quét QR tại booth", "Trải nghiệm văn hóa", "Mua thử hoặc tặng nhỏ"],
    highlights: [
      "CTA trải nghiệm xuất hiện ngay ở đầu trang",
      "Có thể mở rộng sang nhiều câu chuyện theo QR động",
      "Tập trung vào mở - pha - thưởng thức trước hoạt động bán hàng",
    ],
    experienceSteps: [
      {
        title: "Mở cánh sen",
        text: "Mở nhẹ từng lớp cánh để quan sát cấu trúc Petal Pack và lấy phần trà bên trong.",
      },
      {
        title: "Chuẩn bị trà",
        text: "Đặt túi trà vào cốc sạch, dùng lượng nước phù hợp với hướng dẫn của phiên bản sản phẩm.",
      },
      {
        title: "Pha và chờ",
        text: "Rót nước, bật bộ đếm thời gian nếu cần và nghe hoặc đọc câu chuyện ngắn trong lúc chờ.",
      },
      {
        title: "Thưởng thức",
        text: "Quan sát màu nước, cảm nhận hương và vị trước khi gửi phản hồi trải nghiệm.",
      },
    ],
  },
  {
    id: "gift-set",
    slug: "gift-set",
    name: "Senova Gift Set",
    line: "gift-set",
    eyebrow: "Quà tặng văn hóa",
    tagline: "Gói hương sen Việt, trao một câu chuyện bản địa.",
    description:
      "Bộ quà kết hợp trà, hướng dẫn thưởng thức và thẻ câu chuyện để truyền tải sự trân trọng qua một trải nghiệm đồng bộ.",
    shortDescription:
      "Dòng mở rộng cho quà tặng cá nhân, doanh nghiệp và các dịp cần một câu chuyện bản địa chỉn chu.",
    role: "Dòng trao tặng",
    href: "/san-pham/gift-set",
    image: "/assets/products/gift-set.png",
    status: "draft",
    primaryAction: {
      label: "Đăng ký nhận thông tin",
      href: "/dat-truoc",
    },
    secondaryAction: {
      label: "Xem Petal Pack",
      href: "/san-pham/petal-pack",
    },
    heroAlt: "Bộ quà Senova Gift Set",
    suitableFor: ["Quà tặng đối tác", "Quà lưu niệm bản địa", "Phiên bản theo mùa"],
    highlights: [
      "Kết hợp trà, hướng dẫn và thẻ câu chuyện",
      "Có thể cá nhân hóa nội dung QR theo dịp tặng",
      "Chuẩn bị cho mở rộng sau MVP",
    ],
    experienceSteps: [
      {
        title: "Mở hộp",
        text: "Giới thiệu sản phẩm bằng lớp bao bì chỉn chu, hạn chế trang trí dày đặc.",
      },
      {
        title: "Chọn câu chuyện",
        text: "Dùng thẻ hoặc QR để dẫn người nhận đến một nội dung văn hóa phù hợp.",
      },
      {
        title: "Thưởng trà",
        text: "Kết nối nghi thức pha trà với thông điệp quà tặng thay vì chỉ trao một hộp sản phẩm.",
      },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
