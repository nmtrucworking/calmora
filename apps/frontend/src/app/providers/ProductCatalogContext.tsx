/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products as localProducts, type SenovaProduct } from "@features/products/data/products";
import { canUseDevFixtures, hasApiBaseUrl } from "@shared/api/config";
import { CatalogApiError, fetchProducts } from "@shared/api/products";
import { trackEvent } from "@shared/analytics/analytics";

type ProductCatalogContextValue = {
  products: SenovaProduct[];
  isLoading: boolean;
  error?: CatalogApiError;
  getProductBySlug: (slug: string) => SenovaProduct | undefined;
};

const ProductCatalogContext = createContext<ProductCatalogContextValue | undefined>(undefined);

export function ProductCatalogProvider({ children }: { children: ReactNode }) {
  const usesRemoteApi = hasApiBaseUrl();
  const usesFixtures = canUseDevFixtures();
  const [products, setProducts] = useState<SenovaProduct[]>(localProducts);
  const [isLoading, setIsLoading] = useState(usesRemoteApi);
  const [error, setError] = useState<CatalogApiError | undefined>(
    !usesRemoteApi && !usesFixtures
      ? new CatalogApiError("API_NOT_CONFIGURED", "Product catalog API is not configured.")
      : undefined,
  );

  useEffect(() => {
    if (usesFixtures) {
      trackEvent({ eventName: "catalog_local_fallback", source: "api_not_configured" });
      return;
    }
    if (!usesRemoteApi) return;
    const controller = new AbortController();
    void fetchProducts(controller.signal)
      .then((catalog) => {
        if (Array.isArray(catalog) && catalog.length > 0) {
          setProducts(catalog);
        }
        setError(undefined);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        const catalogError =
          reason instanceof CatalogApiError
            ? reason
            : new CatalogApiError("NETWORK_ERROR", "Product catalog is unavailable.");
        setProducts((current) => (current.length > 0 ? current : localProducts));
        setError(catalogError);
        trackEvent({
          eventName: "catalog_local_fallback",
          source: catalogError.code,
        });
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [usesFixtures, usesRemoteApi]);

  const value = useMemo<ProductCatalogContextValue>(
    () => ({
      products,
      isLoading,
      error,
      getProductBySlug: (slug) =>
        products.find((product) => product.slug === slug) ??
        localProducts.find((product) => product.slug === slug),
    }),
    [error, isLoading, products],
  );
  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>;
}

export function useProductCatalog() {
  const context = useContext(ProductCatalogContext);
  if (!context) throw new Error("useProductCatalog must be used within ProductCatalogProvider");
  return context;
}
