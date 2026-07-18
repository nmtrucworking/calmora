import { resolveQrCode } from "@features/qr/services/qrRegistry";
import type { QrResolveResult } from "@features/qr/types/qr";
import type { ApiResponse } from "@shared/api/submissions";
import { canUseDevFixtures, getApiBaseUrl, hasApiBaseUrl } from "@shared/api/config";

export async function resolveQr(code: string): Promise<QrResolveResult> {
  if (canUseDevFixtures()) {
    return resolveQrCode(code);
  }
  if (!hasApiBaseUrl()) return {
    code: code.trim().toUpperCase(),
    status: "unknown",
    message: "QR service is not configured.",
  };

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/qr/${encodeURIComponent(code)}`);
    const result = (await response.json()) as ApiResponse<QrResolveResult>;

    if (!response.ok || !result.success || !result.data) {
      return {
        code: code.trim().toUpperCase(),
        status: "unknown",
        message: result.error?.message ?? "QR code is not recognized.",
      };
    }

    return result.data;
  } catch {
    return {
      code: code.trim().toUpperCase(),
      status: "unknown",
      message: "QR service is temporarily unavailable.",
    };
  }
}

export function trackQrScan(code: string, payload: Record<string, string | undefined>) {
  if (!hasApiBaseUrl()) return;

  const body = JSON.stringify(payload);
  const url = `${getApiBaseUrl()}/api/qr/${encodeURIComponent(code)}/scan`;

  try {
    if ("sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }

    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // QR scan tracking must never block redirect.
  }
}
