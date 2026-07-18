import { getApiBaseUrl } from "@shared/api/config";
import type { ApiResponse } from "@shared/api/submissions";
import type {
  AdminDashboard,
  AdminProduct,
  AdminQrContent,
  AdminQrOverride,
  AdminSession,
  AdminUser,
  ProductStatus,
  QrRecord,
  QrStatus,
  Submission,
  SubmissionKind,
  SubmissionStatus,
} from "./types";

type ApiMeta = { page: number; pageSize: number; total: number };

export class AdminApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "AdminApiError";
  }
}

function csrfToken() {
  const entry = document.cookie.split("; ").find((value) => value.startsWith("senova_admin_csrf="));
  return entry ? decodeURIComponent(entry.split("=").slice(1).join("=")) : "";
}

async function requestEnvelope<T>(path: string, init?: RequestInit): Promise<{ data: T; meta?: ApiMeta }> {
  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/api/v1${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.method && init.method !== "GET" ? { "X-CSRF-Token": csrfToken() } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new AdminApiError("NETWORK_ERROR", "Không kết nối được máy chủ.", 0);
  }
  let result: ApiResponse<T> & { meta?: ApiMeta };
  try {
    result = (await response.json()) as ApiResponse<T> & { meta?: ApiMeta };
  } catch {
    throw new AdminApiError(
      response.status === 404 ? "API_NOT_CONFIGURED" : "INVALID_API_RESPONSE",
      response.status === 404
        ? "Admin API chưa được cấu hình hoặc không đúng địa chỉ."
        : "Máy chủ trả về phản hồi không hợp lệ.",
      response.status,
    );
  }
  if (!response.ok || !result.success || result.data === undefined) {
    const error = new AdminApiError(
      result.error?.code ?? "ADMIN_API_ERROR",
      result.error?.message ?? "Admin API request failed.",
      response.status,
    );
    if (response.status === 401) window.dispatchEvent(new Event("senova:admin-unauthorized"));
    throw error;
  }
  return { data: result.data, meta: result.meta };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  return (await requestEnvelope<T>(path, init)).data;
}

function resourceData(value: Record<string, unknown>) {
  const data = { ...value };
  delete data.id;
  delete data.version;
  delete data.updatedAt;
  return data;
}

export function loginAdmin(email: string, password: string) {
  return request<AdminSession>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}
export function getAdminSession() { return request<AdminSession>("/auth/me"); }
export function logoutAdmin() { return request<{ loggedOut: boolean }>("/auth/logout", { method: "POST", body: "{}" }); }

export function listAdminProducts() { return request<AdminProduct[]>("/admin/products"); }
export function getAdminProduct(id: string) { return request<AdminProduct>(`/admin/products/${encodeURIComponent(id)}`); }
export function saveAdminProduct(product: AdminProduct) {
  return request<AdminProduct>(`/admin/products/${encodeURIComponent(product.id)}`, {
    method: "PUT",
    body: JSON.stringify({ data: resourceData(product), expectedVersion: product.version }),
  });
}
export function setAdminProductStatus(id: string, status: ProductStatus, expectedVersion: number) {
  return request<AdminProduct>(`/admin/products/${encodeURIComponent(id)}/status`, {
    method: "POST", body: JSON.stringify({ status, expectedVersion }),
  });
}

export function listAdminQr() { return request<QrRecord[]>("/admin/qr"); }
export function getAdminQr(code: string) { return request<QrRecord>(`/admin/qr/${encodeURIComponent(code)}`); }
export function saveAdminQr(record: QrRecord) {
  return request<QrRecord>(`/admin/qr/${encodeURIComponent(record.code)}`, {
    method: "PUT",
    body: JSON.stringify({ data: resourceData(record), expectedVersion: record.version }),
  });
}
export function setAdminQrStatus(code: string, status: QrStatus, expectedVersion: number) {
  return request<QrRecord>(`/admin/qr/${encodeURIComponent(code)}/status`, {
    method: "POST", body: JSON.stringify({ status, expectedVersion }),
  });
}

export async function listAdminSubmissions(params: {
  status?: SubmissionStatus; kind?: SubmissionKind; q?: string; page?: number; pageSize?: number;
} = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== "") query.set(key, String(value)); });
  return requestEnvelope<Submission[]>(`/admin/submissions?${query}`);
}
export function getAdminSubmission(id: string) { return request<Submission>(`/admin/submissions/${encodeURIComponent(id)}`); }
export function setAdminSubmissionStatus(id: string, status: SubmissionStatus) {
  return request<{ status: SubmissionStatus }>(`/admin/submissions/${encodeURIComponent(id)}/status`, {
    method: "PATCH", body: JSON.stringify({ status }),
  });
}
export function assignAdminSubmission(id: string, assigneeId?: string) {
  return request<{ assignedTo?: string }>(`/admin/submissions/${encodeURIComponent(id)}/assign`, {
    method: "POST", body: JSON.stringify({ assigneeId: assigneeId || null }),
  });
}
export function addAdminSubmissionNote(id: string, note: string) {
  return request<{ created: boolean }>(`/admin/submissions/${encodeURIComponent(id)}/activities`, {
    method: "POST", body: JSON.stringify({ note }),
  });
}
export function listAdminUsers() { return request<AdminUser[]>("/admin/users?status=active"); }

export function getAdminDashboard(params: { fromDate?: string; toDate?: string; timezone?: string; productSlug?: string; source?: string } = {}) {
  const query = new URLSearchParams({ timezone: params.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone });
  Object.entries(params).forEach(([key, value]) => { if (value) query.set(key, value); });
  return request<AdminDashboard>(`/admin/dashboard?${query}`);
}

export function listAdminQrContents() { return request<AdminQrContent[]>("/admin/qr-contents"); }
export function getAdminQrContent(product: string, version: string, locale: string) {
  return request<AdminQrContent>(`/admin/qr-contents/${encodeURIComponent(product)}/${encodeURIComponent(version)}/${encodeURIComponent(locale)}`);
}
export function saveAdminQrContent(content: AdminQrContent) {
  return request<AdminQrContent>(`/admin/qr-contents/${encodeURIComponent(content.productSlug)}/${encodeURIComponent(content.version)}/${content.locale}`, {
    method: "PUT", body: JSON.stringify({ data: resourceData(content) }),
  });
}
export function publishAdminQrContent(product: string, version: string, locale: string) {
  return request<AdminQrContent>(`/admin/qr-contents/${encodeURIComponent(product)}/${encodeURIComponent(version)}/${encodeURIComponent(locale)}/publish`, { method: "POST", body: "{}" });
}
export function listAdminQrOverrides() { return request<AdminQrOverride[]>("/admin/qr-overrides"); }
export function saveAdminQrOverride(override: AdminQrOverride) {
  return request<AdminQrOverride>(`/admin/qr-overrides/${encodeURIComponent(override.batchCode)}/${encodeURIComponent(override.productSlug)}/${encodeURIComponent(override.contentVersion)}`, {
    method: "PUT", body: JSON.stringify({ guidanceOverride: override.guidanceOverride, notice: override.notice }),
  });
}
export function setAdminQrOverrideStatus(override: AdminQrOverride, status: "active" | "disabled") {
  return request<AdminQrOverride>(`/admin/qr-overrides/${encodeURIComponent(override.batchCode)}/${encodeURIComponent(override.productSlug)}/${encodeURIComponent(override.contentVersion)}/status`, {
    method: "PATCH", body: JSON.stringify({ status }),
  });
}
