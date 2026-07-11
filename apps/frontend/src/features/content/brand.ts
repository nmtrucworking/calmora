import content from "@features/content/content.json";

export type BrandNavItem = {
  label: string;
  href: string;
};

export type BrandFooterGroup = {
  title: string;
  links: BrandNavItem[];
};

function normalizeRoute(item: BrandNavItem): BrandNavItem {
  return item.href === "/products" ? { ...item, href: "/products" } : item;
}

export const brandName = content.brand.name;
export const brandTagline = content.brand.tagline;
export const brandSummary = content.brand.summary;
export const brandNavigation: BrandNavItem[] = [
  { label: "Trang chu", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "San pham", href: "/products" },
  { label: "Gifting", href: "/gifting" },
  { label: "Concierge", href: "/concierge" },
  { label: "Journal", href: "/journal" },
  { label: "Client Care", href: "/faq" },
].map(normalizeRoute);
export const brandFooterGroups: BrandFooterGroup[] = [
  {
    title: "Commerce",
    links: [
      { label: "Collections", href: "/collections" },
      { label: "Signature edit", href: "/collections/signature" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Inquiry bag", href: "/bag" },
    ],
  },
  {
    title: "Luxury services",
    links: [
      { label: "Gifting", href: "/gifting" },
      { label: "Corporate gifting", href: "/corporate-gifting" },
      { label: "Concierge", href: "/concierge" },
      { label: "Private tasting", href: "/private-tasting" },
    ],
  },
  {
    title: "Client care",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Product care", href: "/care" },
    ],
  },
  {
    title: "Senova",
    links: [
      { label: "Cau chuyen", href: "/story" },
      { label: "Nghi thuc", href: "/ritual" },
      { label: "Journal", href: "/journal" },
      { label: "Chinh sach du lieu", href: "/privacy" },
    ],
  },
].map((group) => ({
  ...group,
  links: group.links.map(normalizeRoute),
}));
export const brandPrinciples = content.brand.principles;
