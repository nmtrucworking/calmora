import { describe, expect, it } from "vitest";
import {
  buildExperiencePath,
  buildFeedbackPath,
  buildProductPath,
  getRegisteredWebsiteRoutes,
  isRegisteredWebsiteRoute,
} from "./registeredRoutes";

const products = [{ slug: "petal-pack", name: "Senova Petal Pack" }];

describe("website QR route registry", () => {
  it("cung cấp các trang tĩnh và route theo sản phẩm", () => {
    const paths = getRegisteredWebsiteRoutes(products).map((route) => route.path);

    expect(paths).toContain("/");
    expect(paths).toContain("/contact");
    expect(paths).toContain("/about");
    expect(paths).toContain("/team");
    expect(paths).toContain("/order-request/success");
    expect(paths).toContain("/products/petal-pack");
    expect(paths).toContain("/experience/petal-pack");
    expect(paths).toContain("/feedback/petal-pack");
  });

  it("không chấp nhận route quản trị hoặc route tùy ý", () => {
    expect(isRegisteredWebsiteRoute("/admin", products)).toBe(false);
    expect(isRegisteredWebsiteRoute("/not-registered", products)).toBe(false);
    expect(isRegisteredWebsiteRoute("/products/petal-pack/", products)).toBe(true);
  });

  it("mã hóa slug khi dựng route động", () => {
    expect(buildProductPath("lotus tea")).toBe("/products/lotus%20tea");
    expect(buildExperiencePath("lotus tea")).toBe("/experience/lotus%20tea");
    expect(buildFeedbackPath("lotus tea")).toBe("/feedback/lotus%20tea");
  });
});
