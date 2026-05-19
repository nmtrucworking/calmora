export type SitePageContent = {
  eyebrow: string;
  title: string;
  text: string;
};

export type SiteRoute = SitePageContent & {
  href: string;
  label: string;
};

export const landingPath = "/";

export const siteRoutes: SiteRoute[] = [
  {
    href: "/products",
    label: "Sản phẩm",
    eyebrow: "Bộ sưu tập",
    title: "Trà sen trong hình hài mới.",
    text: "Không gian này sẽ giới thiệu các dòng trà, hộp quà và phiên bản mùa sen của Senova.",
  },
  {
    href: "/story",
    label: "Câu chuyện",
    eyebrow: "Câu chuyện",
    title: "Từ hồ sen đến nghi thức trà.",
    text: "Trang câu chuyện dành cho nguồn cảm hứng, chất liệu bản địa và tinh thần thiết kế của Senova.",
  },
  {
    href: "/ritual",
    label: "Nghi thức",
    eyebrow: "Nghi thức",
    title: "Pha trà bằng nhịp chậm của sen.",
    text: "Trang nghi thức sẽ mô tả cách nhìn, mở, pha và chia sẻ trà sen như một trải nghiệm cảm quan.",
  },
  {
    href: "/seasonal",
    label: "Mùa sen",
    eyebrow: "Mùa sen",
    title: "Những phiên bản theo mùa.",
    text: "Nơi lưu giữ các concept giới hạn theo mùa nở, mùa thu hoạch và mùa quà tặng.",
  },
  {
    href: "/contact",
    label: "Liên hệ",
    eyebrow: "Liên hệ",
    title: "Bắt đầu một thử nghiệm với Senova.",
    text: "Gửi yêu cầu mẫu thử, đặt lịch trao đổi hoặc đề xuất hợp tác phát triển sản phẩm.",
  },
  {
    href: "/partners",
    label: "Hợp tác",
    eyebrow: "Hợp tác",
    title: "Cùng mở rộng giá trị của sen Việt.",
    text: "Trang dành cho đối tác nguyên liệu, sản xuất, phân phối và trải nghiệm thương hiệu.",
  },
];

export const defaultSitePageContent: SitePageContent = {
  eyebrow: "Senova",
  title: "Trang đang được chuẩn bị.",
  text: "Quay lại trang chủ để xem vòng đời hoa sen và trải nghiệm prototype hiện tại.",
};

export function getSitePageContent(pathname: string): SitePageContent {
  return siteRoutes.find((route) => route.href === pathname) ?? defaultSitePageContent;
}
