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
