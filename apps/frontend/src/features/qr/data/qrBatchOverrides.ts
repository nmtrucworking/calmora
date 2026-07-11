import type { QrBatchContentOverride } from "@features/qr/types/qr";

export const qrBatchContentOverrides: QrBatchContentOverride[] = [
  {
    batchCode: "PP-2601-A",
    productSlug: "petal-pack",
    contentVersion: "v1",
    notice:
      "Huong dan Petal Pack dang dung cho lo PP-2601-A. Neu bao bi co thong so khac, uu tien thong so in tren bao bi.",
  },
  {
    batchCode: "PP-2509-X",
    productSlug: "petal-pack",
    contentVersion: "prototype-2025-09",
    notice:
      "Lo thu nghiem PP-2509-X da tam ngung. Noi dung chi dung cho doi chieu noi bo, khong phat hanh cho khach hang.",
    guidanceOverride: {
      title: "Lo thu nghiem dang tam ngung",
      intro: "Khong tiep tuc dung huong dan nay cho san pham phat hanh moi.",
      steps: [
        {
          label: "01",
          title: "Khong pha theo ban mau cu",
          text: "Lo nay dung cau truc mau thu nghiem va khong dai dien cho Petal Pack phat hanh tiep theo.",
        },
        {
          label: "02",
          title: "Lien he Senova",
          text: "Neu ban dang cam san pham co ma nay, vui long lien he Senova de duoc doi chieu thong tin.",
        },
      ],
    },
  },
];

export function getQrBatchContentOverride(batchCode: string, contentVersion?: string) {
  const normalizedBatchCode = batchCode.trim().toUpperCase();

  return qrBatchContentOverrides.find(
    (override) =>
      override.batchCode === normalizedBatchCode &&
      (!contentVersion || override.contentVersion === contentVersion),
  );
}
