export type ProductStatus = "draft" | "active" | "archived";
export type QrStatus = "active" | "paused" | "expired" | "revoked";
export type SubmissionStatus = "new" | "contacted" | "qualified" | "closed";
export type SubmissionKind = "feedback" | "pre-order" | "sample-interest" | "contact" | "partners";

export type ProductVariant = {
  id: string;
  label: string;
  note: string;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  line: string;
  role: string;
  tagline: string;
  shortDescription: string;
  image: string;
  priceLabel: string;
  availability: string;
  status: ProductStatus;
  variants: ProductVariant[];
  updatedAt: string;
};

export type QrRecord = {
  id: string;
  code: string;
  productSlug: string;
  batchCode: string;
  contentVersion: string;
  destination: string;
  campaign: string;
  locale: "vi" | "en";
  status: QrStatus;
  expiresAt?: string;
  scans: number;
  createdAt: string;
};

export type SubmissionActivity = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type Submission = {
  id: string;
  reference: string;
  kind: SubmissionKind;
  status: SubmissionStatus;
  assignee: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  productSlug?: string;
  message: string;
  source: string;
  createdAt: string;
  activities: SubmissionActivity[];
};

export type AnalyticsPoint = {
  label: string;
  scans: number;
  submissions: number;
};

export type AdminSession = {
  id?: string;
  name: string;
  email: string;
  role: string;
  permissions?: string[];
};

export type AdminState = {
  products: AdminProduct[];
  qrRecords: QrRecord[];
  submissions: Submission[];
  analytics: AnalyticsPoint[];
};

export type ToastMessage = {
  id: string;
  tone: "success" | "error" | "info";
  message: string;
};
