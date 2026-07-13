import { describe, expect, it } from "vitest";
import { adminReducer } from "./AdminStore";
import { initialAdminState } from "./data";
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
    const product = { ...initialAdminState.products[0], id: "new-product", slug: "new-product", name: "New Product" };
    const state = adminReducer(initialAdminState, { type: "product/save", product });
    expect(state.products).toHaveLength(initialAdminState.products.length + 1);
    expect(state.products[0].slug).toBe("new-product");
  });

  it("đổi trạng thái QR", () => {
    const state = adminReducer(initialAdminState, { type: "qr/status", id: "qr-1", status: "paused" });
    expect(state.qrRecords.find((record) => record.id === "qr-1")?.status).toBe("paused");
  });

  it("phân công và thêm hoạt động vào submission", () => {
    const assigned = adminReducer(initialAdminState, { type: "submission/update", id: "sub-1", status: "contacted", assignee: "Thu Hà" });
    const withActivity = adminReducer(assigned, { type: "submission/activity", id: "sub-1", content: "Đã gọi điện", author: "Thu Hà" });
    const submission = withActivity.submissions.find((item) => item.id === "sub-1");
    expect(submission?.assignee).toBe("Thu Hà");
    expect(submission?.activities[0].content).toBe("Đã gọi điện");
  });
});

describe("filter và validation", () => {
  it("lọc sản phẩm theo từ khóa và trạng thái", () => {
    expect(filterProducts(initialAdminState.products, "petal", "active").map((item) => item.slug)).toEqual(["petal-pack"]);
    expect(filterProducts(initialAdminState.products, "", "draft")).toHaveLength(1);
  });

  it("bắt slug trùng và mô tả quá ngắn", () => {
    const invalid = { ...initialAdminState.products[0], id: "another", shortDescription: "Ngắn" };
    const errors = validateProduct(invalid, initialAdminState.products, invalid.id);
    expect(errors.slug).toBe("Slug này đã được sử dụng.");
    expect(errors.shortDescription).toBeTruthy();
  });
});
