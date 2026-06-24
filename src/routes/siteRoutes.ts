import content from "../data/content.json";

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

// Dynamically construct route configurations from the brand navigation and routes properties in JSON
export const siteRoutes: SiteRoute[] = content.brand.navigation
  .filter((nav) => nav.href !== "/")
  .map((nav) => {
    const routeKey = nav.href as keyof typeof content.routes;
    const routeData = content.routes[routeKey] || { eyebrow: nav.label, title: nav.label, text: "" };
    return {
      href: nav.href,
      label: nav.label,
      eyebrow: routeData.eyebrow,
      title: routeData.title,
      text: routeData.text,
    };
  });

export const defaultSitePageContent: SitePageContent = {
  eyebrow: "Calmora | Senova",
  title: "Trang đang được chuẩn bị.",
  text: "Nội dung trang này đang được biên tập để bám cùng mạch Giữ - Mở - Trao của Senova.",
};

export function getSitePageContent(pathname: string): SitePageContent {
  return siteRoutes.find((route) => route.href === pathname) ?? defaultSitePageContent;
}
