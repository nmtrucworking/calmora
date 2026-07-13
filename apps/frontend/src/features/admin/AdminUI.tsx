/* eslint-disable react-refresh/only-export-components */
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Inbox, X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useAdminStore } from "./AdminStore";
import type { AnalyticsPoint, ProductStatus, QrStatus, SubmissionStatus } from "./types";

type Status = ProductStatus | QrStatus | SubmissionStatus;

const statusLabels: Record<Status, string> = {
  draft: "Bản nháp",
  active: "Đang hoạt động",
  archived: "Đã lưu trữ",
  paused: "Tạm dừng",
  expired: "Hết hạn",
  revoked: "Đã thu hồi",
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  closed: "Hoàn tất",
};

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`adminBadge adminBadge--${status}`}>{statusLabels[status]}</span>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="adminPageHeader">
      <div>
        <span className="adminEyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="adminPageHeader__action">{action}</div> : null}
    </div>
  );
}

export function EmptyState({ title = "Không có dữ liệu", description }: { title?: string; description: string }) {
  return (
    <div className="adminEmpty">
      <span><Inbox size={22} /></span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export function Pagination({
  page,
  pageCount,
  total,
  onPage,
}: {
  page: number;
  pageCount: number;
  total: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className="adminPagination" aria-label="Phân trang">
      <span>{total} kết quả</span>
      <div>
        <button type="button" aria-label="Trang trước" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={17} />
        </button>
        <span>Trang {page}/{Math.max(pageCount, 1)}</span>
        <button type="button" aria-label="Trang sau" disabled={page >= pageCount} onClick={() => onPage(page + 1)}>
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Xác nhận",
  danger = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel, open]);

  if (!open) return null;
  return (
    <div className="adminModalBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <div className="adminModal" role="alertdialog" aria-modal="true" aria-labelledby="admin-dialog-title">
        <button className="adminModal__close" type="button" aria-label="Đóng" onClick={onCancel}><X size={19} /></button>
        <span className={`adminModal__icon ${danger ? "is-danger" : ""}`}><AlertCircle size={24} /></span>
        <h2 id="admin-dialog-title">{title}</h2>
        <p>{description}</p>
        <div className="adminModal__actions">
          <button type="button" className="adminButton adminButton--ghost" onClick={onCancel}>Hủy</button>
          <button type="button" autoFocus className={`adminButton ${danger ? "adminButton--danger" : "adminButton--primary"}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export function ToastRegion() {
  const { toasts, dismissToast } = useAdminStore();
  return (
    <div className="adminToasts" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div className={`adminToast adminToast--${toast.tone}`} key={toast.id} role="status">
          {toast.tone === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
          <button type="button" aria-label="Đóng thông báo" onClick={() => dismissToast(toast.id)}><X size={16} /></button>
        </div>
      ))}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  icon,
  tone = "green",
}: {
  label: string;
  value: string;
  delta: string;
  icon: ReactNode;
  tone?: "green" | "gold" | "pink" | "blue";
}) {
  return (
    <article className="adminKpi">
      <span className={`adminKpi__icon adminKpi__icon--${tone}`}>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{delta}</small>
      </div>
    </article>
  );
}

export function LineChart({ data, mode = "scans" }: { data: AnalyticsPoint[]; mode?: "scans" | "submissions" }) {
  const values = data.map((point) => point[mode]);
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
    const y = 88 - (value / max) * 72;
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = `0,92 ${points} 100,92`;

  return (
    <div className="adminChart" aria-label={`Biểu đồ ${mode === "scans" ? "lượt quét" : "yêu cầu"}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img">
        <defs>
          <linearGradient id={`admin-gradient-${mode}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mode === "scans" ? "#1f724a" : "#a87b28"} stopOpacity=".26" />
            <stop offset="1" stopColor={mode === "scans" ? "#1f724a" : "#a87b28"} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} className="adminChart__grid" />)}
        <polygon points={areaPoints} fill={`url(#admin-gradient-${mode})`} />
        <polyline points={points} className={`adminChart__line adminChart__line--${mode}`} />
      </svg>
      <div className="adminChart__labels">
        {data.map((point) => <span key={point.label}>{point.label}</span>)}
      </div>
    </div>
  );
}

export function formatDate(value: string, includeTime = false) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}
