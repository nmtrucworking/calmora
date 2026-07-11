import { qrRecords } from "@features/qr/data/qrRecords";
import type { QrRecord, QrResolveResult, QrStatus } from "@features/qr/types/qr";

export function normalizeQrCode(code: string) {
  return code.trim().toUpperCase();
}

export function getQrRecord(code: string) {
  const normalizedCode = normalizeQrCode(code);
  return qrRecords.find((record) => record.code === normalizedCode);
}

export function resolveQrStatus(record: QrRecord, now = new Date()): QrStatus {
  if (record.status === "paused" || record.status === "revoked") {
    return record.status;
  }

  if (record.expiresAt && new Date(record.expiresAt).getTime() < now.getTime()) {
    return "expired";
  }

  if (record.activeFrom && new Date(record.activeFrom).getTime() > now.getTime()) {
    return "paused";
  }

  return "active";
}

export function buildQrContentViewed(record: Pick<QrRecord, "productSlug">) {
  return `${record.productSlug}-scan`;
}

export function buildExperienceUrl(record: QrRecord) {
  if (!record.destination.startsWith("/experience/")) {
    return "/products";
  }

  const batch = record.batchCode ?? record.code;
  const searchParams = new URLSearchParams({
    batch,
    source: "qr",
    content: buildQrContentViewed(record),
    version: record.contentVersion,
  });

  return `${record.destination}?${searchParams.toString()}`;
}

export function resolveQrCode(code: string, now = new Date()): QrResolveResult {
  const normalizedCode = normalizeQrCode(code);
  const record = getQrRecord(normalizedCode);

  if (!record) {
    return {
      code: normalizedCode,
      status: "unknown",
      message: "QR code is not recognized.",
    };
  }

  const status = resolveQrStatus(record, now);
  const contentViewed = buildQrContentViewed(record);

  return {
    code: record.code,
    productSlug: record.productSlug,
    batchCode: record.batchCode,
    contentVersion: record.contentVersion,
    contentViewed,
    destination: record.destination,
    redirectUrl: status === "active" ? buildExperienceUrl(record) : undefined,
    status,
  };
}
