import { afterEach, describe, expect, it, vi } from "vitest";
import { submitForm } from "@shared/api/submissions";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("submission API adapter", () => {
  it("sends stable idempotency key and pre-order items", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://api.test");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { id: "pre-order-1", receiptToken: "receipt" } }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const payload = {
      name: "An",
      email: "an@example.com",
      phone: "0900000000",
      items: [{ productId: "classic", variantId: "daily-box", quantity: 2 }],
    };
    await submitForm("pre-order", payload);
    await submitForm("pre-order", payload);
    const first = fetchMock.mock.calls[0][1] as RequestInit;
    const second = fetchMock.mock.calls[1][1] as RequestInit;
    expect((first.headers as Record<string, string>)["Idempotency-Key"]).toBe(
      (second.headers as Record<string, string>)["Idempotency-Key"],
    );
    expect(JSON.parse(String(first.body)).payload.items[0]).toMatchObject({ productId: "classic", quantity: 2 });
  });
});
