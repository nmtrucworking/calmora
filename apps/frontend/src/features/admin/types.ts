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
  version?: number;
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
  updatedAt?: string;
  version?: number;
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
  assignedTo?: string;
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
  dashboard?: AdminDashboard;
};

export type AdminDashboard = {
  activeProducts: number;
  activeQrRecords: number;
  openLeads: number;
  totalScans: number;
  totalSubmissions: number;
  conversionRate: number;
  submissionsByStatus: Record<string, number>;
  series: AnalyticsPoint[];
  scansByProduct: { productSlug: string; scans: number }[];
  range: { fromDate?: string; toDate?: string; timezone: string };
};

export type AdminUser = { id: string; name: string; email: string; status: "active" | "disabled" };

export type QrExperienceStep = { label: string; title: string; text: string };
export type AdminQrContent = {
  productSlug: string;
  version: string;
  locale: "vi" | "en";
  status: "draft" | "published";
  contentViewed: string;
  eyebrow: string;
  title: string;
  lede: string;
  story: { title: string; paragraphs: string[] };
  culture: { title: string; paragraphs: string[]; sourceNotes: string[] };
  guidance: { title: string; intro: string; steps: QrExperienceStep[]; safetyNote?: string | null };
  reflectionPrompt: string;
  cta: { primary: { label: string; href: string }; secondary?: { label: string; href: string } };
  updatedAt?: string;
};

export type AdminQrOverride = {
  batchCode: string;
  productSlug: string;
  contentVersion: string;
  status: "active" | "disabled";
  guidanceOverride?: AdminQrContent["guidance"];
  notice?: string;
  updatedAt?: string;
};

export type ToastMessage = {
  id: string;
  tone: "success" | "error" | "info";
  message: string;
};
