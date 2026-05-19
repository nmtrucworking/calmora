import type { LandingContent } from "../types";

export const landingContent: LandingContent = {
  nav: [
    { label: "Trang chủ", href: "#top" },
    { label: "Sản phẩm", href: "/products" },
    { label: "Câu chuyện", href: "/story" },
    { label: "Nghi thức", href: "/ritual" },
  ],
  hero: {
    eyebrow: "Senova",
    title: "Senova",
    description: "Một búp sen mở ra trong nhịp trà, rồi dịu dàng buông cánh.",
    scrollHint: "Cuộn để hoa nở",
  },
  chapters: [
    {
      id: "bud",
      eyebrow: "01 / Búp",
      title: "Khép",
      text: "Hình hài đầu tiên giữ lại sự tĩnh lặng của sen trước bình minh.",
    },
    {
      id: "bloom",
      eyebrow: "02 / Nở",
      title: "Mở",
      text: "Từng lớp cánh tách ra, để ánh trà ấm hiện lên từ lõi hoa.",
    },
    {
      id: "wither",
      eyebrow: "03 / Tàn",
      title: "Buông",
      text: "Vẻ đẹp cuối cùng không biến mất; nó lắng xuống thành ký ức thanh nhẹ.",
    },
  ],
  cta: {
    eyebrow: "Senova Prototype",
    title: "Trà sen, nhìn bằng một vòng đời.",
    description: "Một landing page đặt hoa sen làm trung tâm trải nghiệm, để sản phẩm được cảm trước khi được giải thích.",
    label: "Liên hệ thử nghiệm",
    href: "mailto:hello@senova.vn",
  },
  footer: {
    tagline: "Senova tôn vinh vẻ đẹp của sen Việt qua trà, nghi thức và trải nghiệm thị giác.",
    groups: [
      {
        title: "Khám phá",
        links: [
          { label: "Vòng đời hoa sen", href: "#top" },
          { label: "Bộ sưu tập trà", href: "/products" },
          { label: "Câu chuyện Senova", href: "/story" },
        ],
      },
      {
        title: "Trải nghiệm",
        links: [
          { label: "Nghi thức pha trà", href: "/ritual" },
          { label: "Không gian 3D", href: "#bloom" },
          { label: "Mùa sen", href: "/seasonal" },
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
    ],
  },
};
