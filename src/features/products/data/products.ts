export type SenovaProduct = {
  id: "classic" | "petal-pack" | "gift-set";
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  role: string;
  href: string;
  image: string;
};

export const products: SenovaProduct[] = [
  {
    id: "classic",
    name: "Senova Classic",
    eyebrow: "Nghi thức hằng ngày",
    tagline: "Giữ hương sen Việt trong từng tách trà.",
    description:
      "Dòng trà hương sen nền tảng, định lượng gọn, dễ pha và phù hợp với nhịp sử dụng hằng ngày.",
    role: "Dòng nền tảng",
    href: "#classic",
    image: "/assets/products/classic-pack.png",
  },
  {
    id: "petal-pack",
    name: "Senova Petal Pack",
    eyebrow: "Trải nghiệm chủ đạo",
    tagline: "Mở một cánh sen, pha một câu chuyện Việt.",
    description:
      "Phần trà cho một lần pha được bao quanh bởi cánh sen tạo hình búp, biến thao tác mở gói thành một nghi thức trực quan.",
    role: "Dòng chủ đạo",
    href: "#petal-pack",
    image: "/assets/products/petal-pack.png",
  },
  {
    id: "gift-set",
    name: "Senova Gift Set",
    eyebrow: "Quà tặng văn hóa",
    tagline: "Gói hương sen Việt, trao một câu chuyện bản địa.",
    description:
      "Bộ quà kết hợp trà, hướng dẫn thưởng thức và thẻ câu chuyện để truyền tải sự trân trọng qua một trải nghiệm đồng bộ.",
    role: "Dòng trao tặng",
    href: "#gift-set",
    image: "/assets/products/gift-set.png",
  },
];
