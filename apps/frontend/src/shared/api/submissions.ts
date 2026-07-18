import { canUseDevFixtures, getApiBaseUrl, hasApiBaseUrl } from "@shared/api/config";

export type SubmissionKind = "feedback" | "pre-order" | "sample-interest" | "contact" | "partners";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

type SubmissionPayload = Record<string, unknown>;

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).padStart(8, "0");
}

export async function submitForm(
  kind: SubmissionKind,
  payload: SubmissionPayload,
): Promise<ApiResponse<{ id: string; receiptToken?: string }>> {
  if (payload.website) {
    return {
      success: false,
      error: {
        code: "SPAM_DETECTED",
        message: "Yêu cầu chưa thể gửi. Vui lòng thử lại sau.",
      },
    };
  }

  if (hasApiBaseUrl()) {
    try {
      const idempotencyKey = `senova-${kind}-${hashString(JSON.stringify(payload))}`;
      const response = await fetch(`${getApiBaseUrl()}/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({ kind, payload }),
      });
      const result = (await response.json()) as ApiResponse<{ id: string; receiptToken?: string }>;

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error ?? {
            code: "API_ERROR",
            message: "Thong tin chua the gui. Vui long thu lai.",
          },
        };
      }

      return result;
    } catch {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: "Khong ket noi duoc API. Vui long thu lai.",
        },
      };
    }
  }

  if (canUseDevFixtures()) {
    await new Promise((resolve) => window.setTimeout(resolve, 120));
    return { success: true, data: { id: `dev-${kind}-${Date.now()}` } };
  }

  return {
    success: false,
    error: { code: "API_NOT_CONFIGURED", message: "Dịch vụ tiếp nhận chưa được cấu hình." },
  };
}
