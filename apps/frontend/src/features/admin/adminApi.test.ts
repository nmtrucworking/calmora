import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminApiError, listAdminSubmissions } from "./adminApi";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("admin API adapter", () => {
  it("keeps server pagination metadata", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [], meta: { page: 2, pageSize: 5, total: 18 } }),
    }));
    const result = await listAdminSubmissions({ q: "an", status: "new", page: 2, pageSize: 5 });
    expect(result.meta).toEqual({ page: 2, pageSize: 5, total: 18 });
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain("q=an&status=new&page=2&pageSize=5");
  });

  it("exposes typed conflict errors", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ success: false, error: { code: "VERSION_CONFLICT", message: "Reload" } }),
    }));
    await expect(listAdminSubmissions()).rejects.toEqual(
      new AdminApiError("VERSION_CONFLICT", "Reload", 409),
    );
  });
});
