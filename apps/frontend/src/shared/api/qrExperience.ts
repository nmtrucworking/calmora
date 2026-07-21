import type { ProductId } from "@features/products/data/products";
import type { ApiResponse } from "@shared/api/submissions";
import { canUseDevFixtures, getApiBaseUrl, hasApiBaseUrl } from "@shared/api/config";

export const DEFAULT_QR_CONTENT_VERSION = "fe-cutover-2026-07";

export type QrExperienceStep = { label: string; title: string; text: string };
export type QrExperienceContent = {
  productSlug: ProductId;
  version: string;
  locale: "vi" | "en";
  contentViewed: string;
  eyebrow: string;
  title: string;
  lede: string;
  story: { title: string; paragraphs: string[] };
  culture: { title: string; paragraphs: string[]; sourceNotes: string[] };
  guidance: { title: string; intro: string; steps: QrExperienceStep[]; safetyNote?: string | null };
  reflectionPrompt: string;
  cta: {
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
  batchNotice?: string | null;
};

export class QrExperienceApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(
    code: string,
    message: string,
    status = 0,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "QrExperienceApiError";
  }
}

async function developmentFixture(productSlug: ProductId): Promise<QrExperienceContent> {
  const { getQrExperienceContent } = await import("@features/content/qrExperience");
  const fixture = getQrExperienceContent(productSlug);
  return {
    productSlug,
    version: DEFAULT_QR_CONTENT_VERSION,
    locale: "vi",
    contentViewed: fixture.contentViewed,
    eyebrow: fixture.eyebrow,
    title: fixture.title,
    lede: fixture.lede,
    story: { title: fixture.storyTitle, paragraphs: fixture.storyParagraphs },
    culture: { title: "", paragraphs: [], sourceNotes: [] },
    guidance: {
      title: fixture.guidanceTitle,
      intro: fixture.guidanceIntro,
      steps: fixture.guidanceSteps,
    },
    reflectionPrompt: fixture.prompt,
    cta: { primary: { label: "Xem sản phẩm", href: `/products/${productSlug}` } },
  };
}

export async function fetchQrExperience(
  productSlug: ProductId,
  options: { version?: string; batch?: string; locale?: "vi" | "en" } = {},
  signal?: AbortSignal,
): Promise<QrExperienceContent> {
  if (canUseDevFixtures()) return developmentFixture(productSlug);
  if (!hasApiBaseUrl()) {
    throw new QrExperienceApiError("API_NOT_CONFIGURED", "QR service is not configured.");
  }
  const query = new URLSearchParams({
    version: options.version ?? DEFAULT_QR_CONTENT_VERSION,
    locale: options.locale ?? "vi",
  });
  if (options.batch) query.set("batch", options.batch);
  let response: Response;
  try {
    response = await fetch(
      `${getApiBaseUrl()}/api/qr/experience/${encodeURIComponent(productSlug)}?${query}`,
      { signal },
    );
  } catch (reason) {
    if (reason instanceof DOMException && reason.name === "AbortError") throw reason;
    if (import.meta.env.DEV) return developmentFixture(productSlug);
    throw new QrExperienceApiError("NETWORK_ERROR", "QR experience is unavailable.");
  }
  const result = (await response.json()) as ApiResponse<QrExperienceContent>;
  if (!response.ok || !result.success || !result.data) {
    throw new QrExperienceApiError(
      result.error?.code ?? "QR_CONTENT_API_ERROR",
      result.error?.message ?? "QR experience is unavailable.",
      response.status,
    );
  }
  return result.data;
}
