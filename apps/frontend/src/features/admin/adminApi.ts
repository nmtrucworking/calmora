import { getApiBaseUrl } from "@shared/api/config";
import type { ApiResponse } from "@shared/api/submissions";
import type { AdminSession } from "./types";

function csrfToken() {
  const entry = document.cookie.split("; ").find((value) => value.startsWith("senova_admin_csrf="));
  return entry ? decodeURIComponent(entry.split("=").slice(1).join("=")) : "";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.method && init.method !== "GET" ? { "X-CSRF-Token": csrfToken() } : {}),
      ...init?.headers,
    },
  });
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error?.message ?? "Admin API request failed.");
  }
  return result.data;
}

export function loginAdmin(email: string, password: string) {
  return request<AdminSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getAdminSession() {
  return request<AdminSession>("/auth/me");
}

export function logoutAdmin() {
  return request<{ loggedOut: boolean }>("/auth/logout", { method: "POST", body: "{}" });
}
