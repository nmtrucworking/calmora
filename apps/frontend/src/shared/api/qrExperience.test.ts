import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_QR_CONTENT_VERSION, fetchQrExperience } from "./qrExperience";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("QR experience API adapter", () => {
  it("requests the selected version, locale and batch and returns nested content", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.test");
    const content = {
      productSlug: "petal-pack",
      version: DEFAULT_QR_CONTENT_VERSION,
      locale: "vi",
      contentViewed: "petal-pack-scan",
      eyebrow: "QR",
      title: "Mở một cánh sen",
      lede: "Intro",
      story: { title: "Story", paragraphs: ["One"] },
      culture: { title: "Culture", paragraphs: [], sourceNotes: [] },
      guidance: { title: "Guide", intro: "Start", steps: [] },
      reflectionPrompt: "Prompt",
      cta: { primary: { label: "View", href: "/products/petal-pack" } },
      batchNotice: "Batch notice",
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: content }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchQrExperience("petal-pack", {
      version: DEFAULT_QR_CONTENT_VERSION,
      batch: "PP-2601-A",
      locale: "vi",
    });

    expect(String(fetchMock.mock.calls[0][0])).toContain(
      `version=${DEFAULT_QR_CONTENT_VERSION}&locale=vi&batch=PP-2601-A`,
    );
    expect(result.guidance.title).toBe("Guide");
    expect(result.batchNotice).toBe("Batch notice");
  });

  it("does not hide backend business errors with fixture data", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ success: false, error: { code: "QR_CONTENT_NOT_FOUND", message: "Missing" } }),
    }));
    await expect(fetchQrExperience("classic")).rejects.toEqual(
      expect.objectContaining({ code: "QR_CONTENT_NOT_FOUND", status: 404, message: "Missing" }),
    );
  });
});
