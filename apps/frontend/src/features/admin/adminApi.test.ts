import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminApiError, listAdminSubmissions, loginAdmin, logoutAdmin } from "./adminApi";

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

  it("hydrates the cross-origin CSRF token after login", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.test");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { name: "Admin", email: "admin@senova.test", role: "admin" } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { csrfToken: "cross-origin-token" } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { loggedOut: true } }),
      });
    vi.stubGlobal("fetch", fetchMock);

    await loginAdmin("admin@senova.test", "correct-horse-battery-staple");
    await logoutAdmin();

    expect(fetchMock.mock.calls[1][0]).toBe("https://api.test/api/v1/auth/csrf");
    expect(fetchMock.mock.calls[2][1]).toMatchObject({
      credentials: "include",
      headers: expect.objectContaining({ "X-CSRF-Token": "cross-origin-token" }),
    });
  });

  it("reports an actionable error for an empty 404 response", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => { throw new SyntaxError("Unexpected end of JSON input"); },
    }));

    await expect(listAdminSubmissions()).rejects.toEqual(
      new AdminApiError(
        "API_NOT_CONFIGURED",
        "Admin API chưa được cấu hình hoặc không đúng địa chỉ.",
        404,
      ),
    );
  });
});
