import type { ProductId } from "@features/products/data/products";

export type QrStatus = "active" | "paused" | "expired" | "revoked";

export type QrRecord = {
  code: string;
  productSlug: ProductId;
  batchCode?: string;
  contentVersion: string;
  destination: string;
  status: QrStatus;
  activeFrom?: string;
  expiresAt?: string;
  campaign?: string;
  locale?: "vi" | "en";
  createdAt: string;
};

export type QrResolveResult = {
  code: string;
  productSlug?: ProductId;
  batchCode?: string;
  contentVersion?: string;
  contentViewed?: string;
  destination?: string;
  redirectUrl?: string;
  status: QrStatus | "unknown";
  message?: string;
};

export type QrBatchContentOverride = {
  batchCode: string;
  productSlug: ProductId;
  contentVersion: string;
  guidanceOverride?: {
    title: string;
    intro: string;
    steps: {
      label: string;
      title: string;
      text: string;
    }[];
    safetyNote?: string;
  };
  notice?: string;
};
