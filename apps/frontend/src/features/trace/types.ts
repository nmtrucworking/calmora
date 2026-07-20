export type VerificationStatus =
  | "not-distributed"
  | "valid-unactivated"
  | "activated"
  | "recheck"
  | "suspicious"
  | "compromised"
  | "recalled"
  | "invalid";

export type TraceTimelineItem = {
  type: string;
  occurredAt: string;
  title: string;
  locationLabel?: string | null;
};

export type UnitTrace = {
  publicCode: string;
  product: { slug: string; name: string; role: string };
  batch: { batchCode: string; packagedAt?: string | null; bestBefore?: string | null };
  verification: {
    status: VerificationStatus;
    activatedAt?: string | null;
    messageCode: string;
    publicMessage?: string | null;
  };
  trace: { sourceSummary: Record<string, unknown>; timeline: TraceTimelineItem[] };
  proof: {
    status: "pending" | "confirmed" | "failed";
    network: string;
    rootHash?: string | null;
    transactionId?: string | null;
    match: boolean;
  };
  content: { experiencePath: string; contentVersion: string };
};

export type ActivationResult = {
  result: "activated" | "already-activated";
  verificationStatus: VerificationStatus;
  activatedAt: string;
  messageCode: string;
};
