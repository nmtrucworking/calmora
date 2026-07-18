import type { ProductId } from "@features/products/data/products";
import { canUseDevFixtures, getApiBaseUrl, hasApiBaseUrl } from "@shared/api/config";

export type AnalyticsEvent = {
  eventName: string;
  path: string;
  productSlug?: ProductId;
  batchCode?: string;
  source?: string;
  contentViewed?: string;
  contentVersion?: string;
  destination?: string;
  status?: string;
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

  if (canUseDevFixtures()) {
    try {
      const previous = JSON.parse(localStorage.getItem(analyticsKey) ?? "[]") as AnalyticsEvent[];
      localStorage.setItem(analyticsKey, JSON.stringify([...previous.slice(-99), payload]));
    } catch {
      // Development analytics must never block the experience.
    }
  }

  if (hasApiBaseUrl()) {
    try {
      void fetch(`${getApiBaseUrl()}/api/analytics/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch {
      // Remote analytics must never block the experience.
    }
  }
}
