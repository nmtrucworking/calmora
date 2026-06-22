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
    eyebrow: "Daily ritual",
    tagline: "Giữ hương sen Việt trong từng tách trà.",
    description:
      "Dòng trà hương sen nền tảng, dễ pha và phù hợp sử dụng hằng ngày.",
    role: "Uống hằng ngày",
    href: "#classic",
    image: "/assets/products/classic-pack.png",
  },
  {
    id: "petal-pack",
    name: "Senova Petal Pack",
    eyebrow: "Signature experience",
    tagline: "Mở một cánh sen, pha một câu chuyện Việt.",
    description:
      "Phần trà một ly được bao quanh bởi cánh sen thật tạo hình búp sen sấy khô.",
    role: "Trải nghiệm",
    href: "#petal-pack",
    image: "/assets/products/petal-pack.png",
  },
  {
    id: "gift-set",
    name: "Senova Gift Set",
    eyebrow: "Cultural gifting",
    tagline: "Gói hương sen Việt, trao một câu chuyện bản địa.",
    description:
      "Bộ quà tặng di sản kết hợp trà, nghi thức thưởng thức và thẻ câu chuyện văn hóa.",
    role: "Trao tặng",
    href: "#gift-set",
    image: "/assets/products/gift-set.png",
  },
];
