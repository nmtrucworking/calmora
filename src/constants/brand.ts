export type BrandNavItem = {
  label: string;
  href: string;
};

export type BrandFooterGroup = {
  title: string;
  links: BrandNavItem[];
};

export const brandName = "SENOVA";
export const brandTagline = "Sen + Innovation";
export const brandSummary =
  "Một hệ website tối giản, cân bằng giữa cảm giác thủ công, chất liệu sen và tinh thần thử nghiệm hiện đại.";

export const brandNavigation: BrandNavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Câu chuyện", href: "/story" },
  { label: "Nghi thức", href: "/ritual" },
  { label: "Mùa sen", href: "/seasonal" },
];

export const brandFooterGroups: BrandFooterGroup[] = [
  {
    title: "Khám phá",
    links: [
      { label: "Vòng đời hoa sen", href: "/" },
      { label: "Bộ sưu tập trà", href: "/products" },
      { label: "Câu chuyện Senova", href: "/story" },
    ],
  },
  {
    title: "Trải nghiệm",
    links: [
      { label: "Nghi thức pha trà", href: "/ritual" },
      { label: "Mùa sen", href: "/seasonal" },
      { label: "Đối tác", href: "/partners" },
    ],
  },
  {
    title: "Kết nối",
    links: [
      { label: "Liên hệ", href: "mailto:hello@senova.vn" },
      { label: "Đặt mẫu thử", href: "/contact" },
      { label: "Hợp tác", href: "/partners" },
    ],
  },
];

export const brandPrinciples = [
  {
    label: "Tông màu",
    title: "Lá non, sen trầm, nền tối",
    text: "Sắc độ giữ chất tĩnh và ấm để mọi trang cùng đi chung một nhịp thị giác.",
  },
  {
    label: "Nhịp điệu",
    title: "Khoảng thở lớn, chữ gọn",
    text: "Bố cục nhấn vào khoảng trống và thứ bậc để brand đọc được ngay từ lướt nhìn đầu tiên.",
  },
  {
    label: "Giọng điệu",
    title: "Tinh tế, chậm, rõ",
    text: "Lời thoại ngắn gọn nhưng không lạnh, đủ hiện đại để mở rộng sang các trang sau.",
  },
];
