import content from "../data/content.json";

export type BrandNavItem = {
  label: string;
  href: string;
};

export type BrandFooterGroup = {
  title: string;
  links: BrandNavItem[];
};

function normalizeRoute(item: BrandNavItem): BrandNavItem {
  return item.href === "/products" ? { ...item, href: "/san-pham" } : item;
}

export const brandName = content.brand.name;
export const brandTagline = content.brand.tagline;
export const brandSummary = content.brand.summary;
export const brandNavigation: BrandNavItem[] = content.brand.navigation.map(normalizeRoute);
export const brandFooterGroups: BrandFooterGroup[] = content.brand.footerGroups.map((group) => ({
  ...group,
  links: group.links.map(normalizeRoute),
}));
export const brandPrinciples = content.brand.principles;
