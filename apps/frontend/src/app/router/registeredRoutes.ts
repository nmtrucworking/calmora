export type WebsiteRouteGroup = "Trang chính" | "Sản phẩm" | "Trải nghiệm" | "Dịch vụ" | "Hỗ trợ" | "Hệ thống";

export type RegisteredWebsiteRoute = {
  id: string;
  path: string;
  label: string;
  group: WebsiteRouteGroup;
};

export type RouteProduct = {
  slug: string;
  name: string;
};

export const publicRoutePaths = {
  home: "/",
  about: "/about",
  story: "/story",
  products: "/products",
  orderRequest: "/order-request",
  orderRequestSuccess: "/order-request/success",
  contact: "/contact",
  partners: "/partners",
  thankYou: "/thank-you",
  ritual: "/ritual",
  seasonal: "/seasonal",
  privacy: "/privacy",
  terms: "/terms",
} as const;

const staticWebsiteRoutes: RegisteredWebsiteRoute[] = [
  { id: "home", path: publicRoutePaths.home, label: "Trang chủ", group: "Trang chính" },
  { id: "about", path: publicRoutePaths.about, label: "Giới thiệu", group: "Trang chính" },
  { id: "story", path: publicRoutePaths.story, label: "Câu chuyện Senova", group: "Trang chính" },
  { id: "products", path: publicRoutePaths.products, label: "Danh sách sản phẩm", group: "Sản phẩm" },
  { id: "ritual", path: publicRoutePaths.ritual, label: "Nghi thức thưởng trà", group: "Trải nghiệm" },
  { id: "seasonal", path: publicRoutePaths.seasonal, label: "Mùa sen", group: "Trải nghiệm" },
  { id: "order-request", path: publicRoutePaths.orderRequest, label: "Yêu cầu đặt trước", group: "Dịch vụ" },
  { id: "contact", path: publicRoutePaths.contact, label: "Liên hệ", group: "Dịch vụ" },
  { id: "partners", path: publicRoutePaths.partners, label: "Hợp tác", group: "Dịch vụ" },
  { id: "gifting", path: "/gifting", label: "Quà tặng", group: "Dịch vụ" },
  { id: "corporate-gifting", path: "/corporate-gifting", label: "Quà tặng doanh nghiệp", group: "Dịch vụ" },
  { id: "concierge", path: "/concierge", label: "Concierge", group: "Dịch vụ" },
  { id: "private-tasting", path: "/private-tasting", label: "Private tasting", group: "Dịch vụ" },
  { id: "shipping", path: "/shipping", label: "Giao hàng", group: "Hỗ trợ" },
  { id: "returns", path: "/returns", label: "Đổi trả", group: "Hỗ trợ" },
  { id: "faq", path: "/faq", label: "Câu hỏi thường gặp", group: "Hỗ trợ" },
  { id: "care", path: "/care", label: "Chăm sóc sản phẩm", group: "Hỗ trợ" },
  { id: "privacy", path: publicRoutePaths.privacy, label: "Chính sách dữ liệu", group: "Hỗ trợ" },
  { id: "terms", path: publicRoutePaths.terms, label: "Điều khoản sử dụng", group: "Hỗ trợ" },
  { id: "order-request-success", path: publicRoutePaths.orderRequestSuccess, label: "Xác nhận yêu cầu đặt trước", group: "Hệ thống" },
  { id: "thank-you", path: publicRoutePaths.thankYou, label: "Trang cảm ơn", group: "Hệ thống" },
];

export function buildProductPath(slug: string) {
  return `/products/${encodeURIComponent(slug)}`;
}

export function buildExperiencePath(slug: string) {
  return `/experience/${encodeURIComponent(slug)}`;
}

export function buildFeedbackPath(slug: string) {
  return `/feedback/${encodeURIComponent(slug)}`;
}

/**
 * Concrete public pages that are safe QR destinations. Token routes such as
 * /q/:code and /trace/:code stay in their dedicated admin workflows because
 * they require a persisted QR/trace record rather than a free-form route.
 */
export function getRegisteredWebsiteRoutes(products: RouteProduct[] = []): RegisteredWebsiteRoute[] {
  const productRoutes = products.flatMap<RegisteredWebsiteRoute>((product) => [
    {
      id: `product-${product.slug}`,
      path: buildProductPath(product.slug),
      label: product.name,
      group: "Sản phẩm",
    },
    {
      id: `experience-${product.slug}`,
      path: buildExperiencePath(product.slug),
      label: `Trải nghiệm · ${product.name}`,
      group: "Trải nghiệm",
    },
    {
      id: `feedback-${product.slug}`,
      path: buildFeedbackPath(product.slug),
      label: `Phản hồi · ${product.name}`,
      group: "Trải nghiệm",
    },
  ]);

  return [...staticWebsiteRoutes, ...productRoutes];
}

export function isRegisteredWebsiteRoute(path: string, products: RouteProduct[] = []) {
  const normalizedPath = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return getRegisteredWebsiteRoutes(products).some((route) => route.path === normalizedPath);
}
