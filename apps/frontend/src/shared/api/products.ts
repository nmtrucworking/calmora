import type { SenovaProduct } from "@features/products/data/products";
import { getApiBaseUrl } from "@shared/api/config";
import type { ApiResponse } from "@shared/api/submissions";

export class CatalogApiError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "CatalogApiError";
  }
}

export type RefundRule = {
  refundPercent: number;
  allowCancellation: boolean;
  allowReplacement?: boolean;
  description: string;
};

export type CancellationPolicy = {
  id: string;
  version: string;
  currency: "VND";
  status: "draft" | "active" | "archived";
  reviewStatus?: string;
  stages: {
    beforePayment: RefundRule;
    paidBeforePreparation: RefundRule;
    preparingStandardProduct: RefundRule;
    customizedProduct: RefundRule;
    handedToCarrier: RefundRule;
    sellerUnableToFulfill: RefundRule;
    defectiveOrIncorrectProduct: RefundRule;
  };
};

export async function fetchProducts(signal?: AbortSignal): Promise<SenovaProduct[]> {
  const response = await fetch(`${getApiBaseUrl()}/api/products`, { signal });
  const result = (await response.json()) as ApiResponse<SenovaProduct[]>;
  if (!response.ok || !result.success || !result.data) {
    throw new CatalogApiError(
      result.error?.code ?? "CATALOG_API_ERROR",
      result.error?.message ?? "Product catalog is unavailable.",
    );
  }
  return result.data;
}

export async function fetchCancellationPolicy(
  policyId: string,
  signal?: AbortSignal,
): Promise<CancellationPolicy> {
  const response = await fetch(`${getApiBaseUrl()}/api/cancellation-policies/${encodeURIComponent(policyId)}`, {
    signal,
  });
  const result = (await response.json()) as ApiResponse<CancellationPolicy>;
  if (!response.ok || !result.success || !result.data) {
    throw new CatalogApiError(
      result.error?.code ?? "POLICY_API_ERROR",
      result.error?.message ?? "Cancellation policy is unavailable.",
    );
  }
  return result.data;
}
