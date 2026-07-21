import type { Language } from "@app/providers/LanguageContext";
import type { ProductId } from "@features/products/data/products";

export type TrustStatus = "confirmed" | "validating" | "planned";

export type TrustItem = {
  id: string;
  productId: ProductId;
  label: Record<Language, string>;
  value: Record<Language, string>;
  status: TrustStatus;
  updatedAt: string;
};

export const productTrustItems: TrustItem[] = [
  {
    id: "portion-format",
    productId: "petal-pack",
    label: { vi: "Cấu hình sử dụng", en: "Usage format" },
    value: { vi: "Một phần trà cho một lần pha", en: "One tea portion per brew" },
    status: "confirmed",
    updatedAt: "2026-07-20",
  },
  {
    id: "petal-material",
    productId: "petal-pack",
    label: { vi: "Chất liệu cánh sen", en: "Lotus petal material" },
    value: { vi: "Đang kiểm chứng trên nguyên mẫu", en: "Being validated on prototypes" },
    status: "validating",
    updatedAt: "2026-07-20",
  },
  {
    id: "classic-format",
    productId: "classic",
    label: { vi: "Vai trò sản phẩm", en: "Product role" },
    value: { vi: "Cấu hình trà dùng hằng ngày", en: "Daily tea configuration" },
    status: "confirmed",
    updatedAt: "2026-07-20",
  },
  {
    id: "gift-personalisation",
    productId: "gift-set",
    label: { vi: "Cá nhân hóa", en: "Personalisation" },
    value: { vi: "Thiệp và QR lời nhắn đang hoàn thiện", en: "Card and QR message are in development" },
    status: "planned",
    updatedAt: "2026-07-20",
  },
];

export const servicePromise = {
  responseTime: { vi: "Phản hồi trong 1–2 ngày làm việc", en: "Response within 1–2 business days" },
  preparationTime: { vi: "Thời gian chuẩn bị xác nhận theo cấu hình", en: "Preparation time confirmed per configuration" },
  paymentMethod: { vi: "Thanh toán sau khi yêu cầu được xác nhận", en: "Payment after request confirmation" },
  deliveryScope: { vi: "Phạm vi giao được xác nhận trước khi chốt", en: "Delivery scope confirmed before finalising" },
} as const;

export const trustStatusLabel: Record<Language, Record<TrustStatus, string>> = {
  vi: { confirmed: "Đã xác nhận", validating: "Đang kiểm chứng", planned: "Đang hoàn thiện" },
  en: { confirmed: "Confirmed", validating: "Validating", planned: "In development" },
};
