import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@app/providers/LanguageContext";
import { RouterContext } from "@app/router/RouterState";
import { products, type SenovaProduct } from "@features/products/data/products";
import ProductDetailPage from ".";

function renderProduct(product: SenovaProduct) {
  return renderToStaticMarkup(
    <LanguageProvider>
      <RouterContext.Provider value={{ pathname: `/products/${product.slug}`, search: "", navigate: () => undefined }}>
        <ProductDetailPage product={product} />
      </RouterContext.Provider>
    </LanguageProvider>,
  );
}

describe("ProductDetailPage", () => {
  it.each(products)("renders /products/$slug using the stable slug when the catalog id differs", (product) => {
    const apiProduct = { ...product, id: `catalog-record-${product.slug}` };
    const markup = renderProduct(apiProduct);

    expect(markup).toContain(product.name);
    expect(markup).toContain(`/order-request?product=${product.slug}`);
    expect(markup).toContain(`/experience/${product.slug}`);
    expect(markup).not.toContain("This product page is being prepared.");
  });
});
