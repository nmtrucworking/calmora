import { getApiBaseUrl } from "@shared/api/config";
import type { ApiResponse } from "@shared/api/submissions";
import type { ActivationResult, UnitTrace } from "@features/trace/types";

export class TraceApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "TraceApiError";
  }
}

function clientToken() {
  const key = "senova_trace_client";
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const token = crypto.randomUUID();
  window.sessionStorage.setItem(key, token);
  return token;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/api/v1${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new TraceApiError("NETWORK_ERROR", "Không thể kết nối máy chủ truy xuất.", 0);
  }
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.success || result.data === undefined) {
    throw new TraceApiError(
      result.error?.code ?? "TRACE_API_ERROR",
      result.error?.message ?? "Không thể kiểm tra mã vào lúc này.",
      response.status,
    );
  }
  return result.data;
}

export function getUnitTrace(publicCode: string) {
  return request<UnitTrace>(`/trace/units/${encodeURIComponent(publicCode)}`);
}

export function recordUnitScan(publicCode: string) {
  return request<{ accepted: boolean; riskLevel: string }>(
    `/trace/units/${encodeURIComponent(publicCode)}/scan`,
    {
      method: "POST",
      body: JSON.stringify({
        source: "qr",
        path: `/trace/${publicCode}`,
        clientToken: clientToken(),
        referrer: document.referrer || undefined,
      }),
    },
  );
}

export function activateUnit(publicCode: string, secretCode: string) {
  return request<ActivationResult>(`/trace/units/${encodeURIComponent(publicCode)}/activate`, {
    method: "POST",
    headers: { "Idempotency-Key": `activate-${crypto.randomUUID()}` },
    body: JSON.stringify({
      secretCode,
      clientToken: clientToken(),
      consent: { coarseRegion: false },
    }),
  });
}
