/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import type { ProductId } from "@features/products/data/products";
import {
  fetchQrExperience,
  type QrExperienceContent,
  QrExperienceApiError,
} from "@shared/api/qrExperience";

export function useQrExperience(
  productSlug: ProductId | undefined,
  options: { version: string; batch: string; locale: "vi" | "en" },
) {
  const { version, batch, locale } = options;
  const [content, setContent] = useState<QrExperienceContent>();
  const [error, setError] = useState<QrExperienceApiError>();
  const [isLoading, setIsLoading] = useState(Boolean(productSlug));
  const [request, setRequest] = useState(0);
  const retry = useCallback(() => setRequest((value) => value + 1), []);

  useEffect(() => {
    if (!productSlug) {
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    setIsLoading(true);
    setError(undefined);
    void fetchQrExperience(productSlug, { version, batch, locale }, controller.signal)
      .then(setContent)
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setContent(undefined);
        setError(
          reason instanceof QrExperienceApiError
            ? reason
            : new QrExperienceApiError("NETWORK_ERROR", "QR experience is unavailable."),
        );
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [batch, locale, productSlug, request, version]);

  return { content, error, isLoading, retry };
}
