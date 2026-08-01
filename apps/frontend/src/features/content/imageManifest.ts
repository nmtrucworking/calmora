export type ImageAssetStatus = "concept" | "prototype" | "production";

export type ImageAsset = {
  id: string;
  fallback: string;
  width: number;
  height: number;
  sources: { type: "image/webp"; srcSet: string }[];
  status: ImageAssetStatus;
  statusLabel: { vi: string; en: string };
};

export const imageManifest: Record<string, ImageAsset> = {
  "product-classic": {
    id: "product-classic",
    fallback: "/assets/products/classic-pack-optimized.jpg",
    width: 1440,
    height: 810,
    sources: [
      {
        type: "image/webp",
        srcSet: "/assets/products/classic-pack-720.webp 720w, /assets/products/classic-pack-1440.webp 1440w",
      },
    ],
    status: "prototype",
    statusLabel: { vi: "Hình ảnh nguyên mẫu", en: "Prototype imagery" },
  },
  "product-petal-pack": {
    id: "product-petal-pack",
    fallback: "/assets/products/petal-pack-optimized.jpg",
    width: 1440,
    height: 958,
    sources: [
      {
        type: "image/webp",
        srcSet: "/assets/products/petal-pack-720.webp 720w, /assets/products/petal-pack-1440.webp 1440w",
      },
    ],
    status: "prototype",
    statusLabel: { vi: "Hình ảnh nguyên mẫu", en: "Prototype imagery" },
  },
  "product-gift-set": {
    id: "product-gift-set",
    fallback: "/assets/products/gift-set-optimized.jpg",
    width: 1440,
    height: 958,
    sources: [
      {
        type: "image/webp",
        srcSet: "/assets/products/gift-set-720.webp 720w, /assets/products/gift-set-1440.webp 1440w",
      },
    ],
    status: "prototype",
    statusLabel: { vi: "Hình ảnh nguyên mẫu", en: "Prototype imagery" },
  },
  "tea-ritual-step-1": {
    id: "tea-ritual-step-1",
    fallback: "/assets/tea-ritual/step-1.png",
    width: 1080,
    height: 1440,
    sources: [],
    status: "production",
    statusLabel: { vi: "Hình ảnh thực tế", en: "Production imagery" },
  },
  "tea-ritual-step-2": {
    id: "tea-ritual-step-2",
    fallback: "/assets/tea-ritual/step-2.png",
    width: 1080,
    height: 1440,
    sources: [],
    status: "production",
    statusLabel: { vi: "Hình ảnh thực tế", en: "Production imagery" },
  },
  "tea-ritual-step-3": {
    id: "tea-ritual-step-3",
    fallback: "/assets/tea-ritual/step-3.png",
    width: 1080,
    height: 1440,
    sources: [],
    status: "production",
    statusLabel: { vi: "Hình ảnh thực tế", en: "Production imagery" },
  },
  "tea-ritual-step-4": {
    id: "tea-ritual-step-4",
    fallback: "/assets/tea-ritual/step-4.png",
    width: 1080,
    height: 1440,
    sources: [],
    status: "production",
    statusLabel: { vi: "Hình ảnh thực tế", en: "Production imagery" },
  },
};

export function getImageAssetByPath(path: string) {
  return Object.values(imageManifest).find((asset) => asset.fallback === path);
}
