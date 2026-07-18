import { describe, expect, it } from "vitest";
import { adminReducer } from "./AdminStore";
import { legacyAdminFixture } from "./data";
import { filterProducts, getAdminRedirect, validateProduct } from "./adminLogic";
import type { AdminSession } from "./types";

const session: AdminSession = { name: "Admin", email: "admin@senova.vn", role: "Administrator" };

describe("admin route guard", () => {
  it("đưa người chưa đăng nhập về trang login", () => {
    expect(getAdminRedirect(null, "/admin/products")).toBe("/admin/login");
  });

  it("đưa người đã đăng nhập khỏi trang login", () => {
    expect(getAdminRedirect(session, "/admin/login")).toBe("/admin");
    expect(getAdminRedirect(session, "/admin/products")).toBeNull();
  });
});

describe("admin reducer", () => {
  it("tạo sản phẩm và cập nhật KPI nguồn", () => {
    const product = { ...legacyAdminFixture.products[0], id: "new-product", slug: "new-product", name: "New Product" };
    const state = adminReducer(legacyAdminFixture, { type: "product/save", product });
    expect(state.products).toHaveLength(legacyAdminFixture.products.length + 1);
    expect(state.products[0].slug).toBe("new-product");
  });

  it("đổi trạng thái QR", () => {
    const record = { ...legacyAdminFixture.qrRecords[0], status: "paused" as const };
    const state = adminReducer(legacyAdminFixture, { type: "qr/save", record });
    expect(state.qrRecords.find((record) => record.id === "qr-1")?.status).toBe("paused");
  });

  it("phân công và thêm hoạt động vào submission", () => {
    const source = legacyAdminFixture.submissions[0];
    const assigned = adminReducer(legacyAdminFixture, { type: "submission/save", submission: { ...source, status: "contacted", assignee: "Thu Hà" } });
    const withActivity = adminReducer(assigned, { type: "submission/save", submission: { ...source, assignee: "Thu Hà", activities: [{ id: "a", content: "Đã gọi điện", author: "Thu Hà", createdAt: new Date().toISOString() }] } });
    const submission = withActivity.submissions.find((item) => item.id === "sub-1");
    expect(submission?.assignee).toBe("Thu Hà");
    expect(submission?.activities[0].content).toBe("Đã gọi điện");
  });
});

describe("filter và validation", () => {
  it("lọc sản phẩm theo từ khóa và trạng thái", () => {
    expect(filterProducts(legacyAdminFixture.products, "petal", "active").map((item) => item.slug)).toEqual(["petal-pack"]);
    expect(filterProducts(legacyAdminFixture.products, "", "draft")).toHaveLength(1);
  });

  it("bắt slug trùng và mô tả quá ngắn", () => {
    const invalid = { ...legacyAdminFixture.products[0], id: "another", shortDescription: "Ngắn" };
    const errors = validateProduct(invalid, legacyAdminFixture.products, invalid.id);
    expect(errors.slug).toBe("Slug này đã được sử dụng.");
    expect(errors.shortDescription).toBeTruthy();
  });
});
