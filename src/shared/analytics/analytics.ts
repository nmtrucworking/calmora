import type { ProductId } from "@features/products/data/products";

export type AnalyticsEvent = {
  eventName: string;
  path: string;
  productSlug?: ProductId;
  batchCode?: string;
  source?: string;
  contentViewed?: string;
  timestamp: string;
};

const analyticsKey = "senova.analytics.events";

function isAnalyticsEnabled() {
  return import.meta.env.VITE_ENABLE_ANALYTICS !== "false";
}

export function trackEvent(event: Omit<AnalyticsEvent, "timestamp" | "path"> & { path?: string }) {
  if (!isAnalyticsEnabled()) return;

  const payload: AnalyticsEvent = {
    path: event.path ?? window.location.pathname,
    timestamp: new Date().toISOString(),
    ...event,
  };

  try {
    const previous = JSON.parse(localStorage.getItem(analyticsKey) ?? "[]") as AnalyticsEvent[];
    localStorage.setItem(analyticsKey, JSON.stringify([...previous.slice(-99), payload]));
  } catch {
    // Analytics must never block the experience.
  }
}
