import content from "../data/content.json";

export type BrandNavItem = {
  label: string;
  href: string;
};

export type BrandFooterGroup = {
  title: string;
  links: BrandNavItem[];
};

export const brandName = content.brand.name;
export const brandTagline = content.brand.tagline;
export const brandSummary = content.brand.summary;
export const brandNavigation: BrandNavItem[] = content.brand.navigation;
export const brandFooterGroups: BrandFooterGroup[] = content.brand.footerGroups;
export const brandPrinciples = content.brand.principles;
