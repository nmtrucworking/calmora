import type { AdminProduct, AdminSession, ProductStatus } from "./types";

export function getAdminRedirect(session: AdminSession | null, pathname: string) {
  if (!session && pathname !== "/admin/login") return "/admin/login";
  if (session && pathname === "/admin/login") return "/admin";
  return null;
}

export function filterProducts(products: AdminProduct[], query: string, status: "all" | ProductStatus) {
  const normalizedQuery = query.trim().toLowerCase();
  return products.filter((product) => {
    const haystack = `${product.name} ${product.slug} ${product.line}`.toLowerCase();
    return haystack.includes(normalizedQuery) && (status === "all" || product.status === status);
  });
}

export type ProductValidationErrors = Partial<Record<"name" | "slug" | "tagline" | "shortDescription", string>>;

export function validateProduct(product: AdminProduct, products: AdminProduct[], currentId?: string): ProductValidationErrors {
  const errors: ProductValidationErrors = {};
  if (!product.name.trim()) errors.name = "Vui lòng nhập tên sản phẩm.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) errors.slug = "Slug chỉ gồm chữ thường, số và dấu gạch ngang.";
  if (products.some((item) => item.slug === product.slug && item.id !== currentId)) errors.slug = "Slug này đã được sử dụng.";
  if (!product.tagline.trim()) errors.tagline = "Vui lòng nhập tagline.";
  if (product.shortDescription.trim().length < 20) errors.shortDescription = "Mô tả cần ít nhất 20 ký tự.";
  return errors;
}
