import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchProducts } from "@shared/api/products";

afterEach(() => vi.unstubAllGlobals());

describe("product API adapter", () => {
  it("returns camelCase product data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: [{ id: "classic", slug: "classic", shortDescription: "Tea" }] }),
      }),
    );
    const result = await fetchProducts();
    expect(result[0]).toMatchObject({ slug: "classic", shortDescription: "Tea" });
  });

  it("does not hide backend business errors with local data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ success: false, error: { code: "CATALOG_UNAVAILABLE", message: "Unavailable" } }),
      }),
    );
    await expect(fetchProducts()).rejects.toEqual(
      expect.objectContaining({ code: "CATALOG_UNAVAILABLE", message: "Unavailable", name: "CatalogApiError" }),
    );
  });
});
