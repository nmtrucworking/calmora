import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { imageManifest } from "@features/content/imageManifest";
import {
  luxuryLandingCopy,
  luxuryLayoutCopy,
  productLuxuryCopy,
} from "@features/content/luxuryCopy";
import { productTrustItems } from "@features/content/trustContent";

describe("P1 public experience contracts", () => {
  it("keeps Senova as the primary brand in both locales", () => {
    for (const locale of ["vi", "en"] as const) {
      expect(luxuryLayoutCopy[locale].brand).toBe("SENOVA by Calmora");
      expect(luxuryLayoutCopy[locale].brand).not.toContain("|");
      expect(luxuryLayoutCopy[locale].navigation.map((item) => item.href)).toEqual([
        "/products",
        "/ritual",
        "/story",
        "/about",
        "/gifting",
      ]);
    }
  });

  it("defines responsive, classified media for every product", () => {
    expect(Object.keys(imageManifest)).toHaveLength(3);
    for (const asset of Object.values(imageManifest)) {
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
      expect(asset.status).toMatch(/^(concept|prototype|production)$/);
      expect(existsSync(`public${asset.fallback}`)).toBe(true);
      for (const source of asset.sources) {
        for (const candidate of source.srcSet.split(",")) {
          const path = candidate.trim().split(" ")[0];
          expect(existsSync(`public${path}`)).toBe(true);
        }
      }
    }
  });

  it("publishes trust status for every product line", () => {
    expect(new Set(productTrustItems.map((item) => item.productId))).toEqual(
      new Set(["classic", "petal-pack", "gift-set"]),
    );
  });

  it("keeps mock commerce routes out of the public sitemap", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    for (const route of ["/collections", "/search", "/wishlist", "/bag", "/checkout", "/account", "/order-status"]) {
      expect(sitemap).not.toContain(`<loc>https://senova.vn${route}`);
    }
  });

  it("keeps public navigation and campaign calls-to-action on sitemap routes", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    const sitemapPaths = new Set(
      [...sitemap.matchAll(/<loc>https:\/\/senova\.vn([^<]*)<\/loc>/g)].map((match) => match[1] || "/"),
    );

    for (const locale of ["vi", "en"] as const) {
      const landing = luxuryLandingCopy[locale];
      const links = [
        ...luxuryLayoutCopy[locale].navigation,
        ...luxuryLayoutCopy[locale].mobileNavigation,
        ...luxuryLayoutCopy[locale].footerGroups.flatMap((group) => group.links),
        landing.hero.primary,
        landing.hero.secondary,
        landing.gift.primary,
        landing.gift.secondary,
        landing.finalCta.primary,
        landing.finalCta.secondary,
        ...Object.values(productLuxuryCopy[locale]).flatMap((product) => [
          product.primaryAction,
          product.secondaryAction,
        ]),
      ];

      for (const link of links) {
        const path = new URL(link.href, "https://senova.vn").pathname;
        expect(sitemapPaths, `${locale}: ${link.href}`).toContain(path);
      }
    }
  });
});
