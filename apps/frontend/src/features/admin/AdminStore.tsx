/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useReducer, useState, type ReactNode } from "react";
import { initialAdminState } from "./data";
import {
  addAdminSubmissionNote,
  AdminApiError,
  assignAdminSubmission,
  getAdminDashboard,
  getAdminProduct,
  getAdminQr,
  getAdminSubmission,
  listAdminProducts,
  listAdminQr,
  listAdminQrContents,
  listAdminQrOverrides,
  listAdminSubmissions,
  listAdminUsers,
  saveAdminProduct,
  saveAdminQr,
  setAdminProductStatus,
  setAdminQrStatus,
  setAdminSubmissionStatus,
} from "./adminApi";
import type {
  AdminProduct,
  AdminQrContent,
  AdminQrOverride,
  AdminState,
  AdminUser,
  ProductStatus,
  QrRecord,
  QrStatus,
  Submission,
  SubmissionStatus,
  ToastMessage,
} from "./types";

type AdminAction =
  | { type: "products/set"; products: AdminProduct[] }
  | { type: "product/save"; product: AdminProduct }
  | { type: "qr/set"; records: QrRecord[] }
  | { type: "qr/save"; record: QrRecord }
  | { type: "submissions/set"; submissions: Submission[] }
  | { type: "submission/save"; submission: Submission }
  | { type: "dashboard/set"; dashboard: NonNullable<AdminState["dashboard"]> };

export function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "products/set": return { ...state, products: action.products };
    case "product/save": return {
      ...state,
      products: state.products.some((item) => item.id === action.product.id)
        ? state.products.map((item) => item.id === action.product.id ? action.product : item)
        : [action.product, ...state.products],
    };
    case "qr/set": return { ...state, qrRecords: action.records };
    case "qr/save": return {
      ...state,
      qrRecords: state.qrRecords.some((item) => item.code === action.record.code)
        ? state.qrRecords.map((item) => item.code === action.record.code ? action.record : item)
        : [action.record, ...state.qrRecords],
    };
    case "submissions/set": return { ...state, submissions: action.submissions };
    case "submission/save": return {
      ...state,
      submissions: state.submissions.some((item) => item.id === action.submission.id)
        ? state.submissions.map((item) => item.id === action.submission.id ? action.submission : item)
        : [action.submission, ...state.submissions],
    };
    case "dashboard/set": return { ...state, dashboard: action.dashboard, analytics: action.dashboard.series };
    default: return state;
  }
}

type AdminStoreValue = AdminState & {
  qrContents: AdminQrContent[];
  qrOverrides: AdminQrOverride[];
  adminUsers: AdminUser[];
  isLoading: boolean;
  toasts: ToastMessage[];
  loadDashboard: (params?: Parameters<typeof getAdminDashboard>[0]) => Promise<void>;
  loadProducts: () => Promise<void>;
  loadProduct: (id: string) => Promise<void>;
  loadQr: () => Promise<void>;
  loadQrRecord: (code: string) => Promise<void>;
  loadSubmissions: (params?: Parameters<typeof listAdminSubmissions>[0]) => Promise<number>;
  loadSubmission: (id: string) => Promise<void>;
  loadQrContentData: () => Promise<void>;
  loadAdminUsers: () => Promise<void>;
  saveProduct: (product: AdminProduct) => Promise<AdminProduct>;
  setProductStatus: (id: string, status: ProductStatus) => Promise<void>;
  saveQrRecord: (record: QrRecord) => Promise<QrRecord>;
  setQrStatus: (code: string, status: QrStatus) => Promise<void>;
  updateSubmission: (id: string, status: SubmissionStatus, assigneeId: string) => Promise<void>;
  addSubmissionActivity: (id: string, content: string, author: string) => Promise<void>;
  notify: (message: string, tone?: ToastMessage["tone"]) => void;
  dismissToast: (id: string) => void;
};

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialAdminState);
  const [qrContents, setQrContents] = useState<AdminQrContent[]>([]);
  const [qrOverrides, setQrOverrides] = useState<AdminQrOverride[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [pending, setPending] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const notify = useCallback((message: string, tone: ToastMessage["tone"] = "success") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, tone }]);
    window.setTimeout(() => dismissToast(id), 3500);
  }, [dismissToast]);
  const run = useCallback(async <T,>(work: () => Promise<T>) => {
    setPending((value) => value + 1);
    try { return await work(); } catch (reason) {
      notify(
        reason instanceof AdminApiError && reason.code === "VERSION_CONFLICT"
          ? "Dữ liệu đã được người khác cập nhật. Form của bạn vẫn được giữ; hãy tải lại bản mới trước khi lưu lại."
          : reason instanceof Error ? reason.message : "Không thể tải dữ liệu.",
        "error",
      );
      throw reason;
    } finally { setPending((value) => value - 1); }
  }, [notify]);

  const value = useMemo<AdminStoreValue>(() => ({
    ...state,
    qrContents,
    qrOverrides,
    adminUsers,
    isLoading: pending > 0,
    toasts,
    notify,
    dismissToast,
    loadDashboard: (params) => run(async () => dispatch({ type: "dashboard/set", dashboard: await getAdminDashboard(params) })),
    loadProducts: () => run(async () => dispatch({ type: "products/set", products: await listAdminProducts() })),
    loadProduct: (id) => run(async () => dispatch({ type: "product/save", product: await getAdminProduct(id) })),
    loadQr: () => run(async () => dispatch({ type: "qr/set", records: await listAdminQr() })),
    loadQrRecord: (code) => run(async () => dispatch({ type: "qr/save", record: await getAdminQr(code) })),
    loadSubmissions: (params) => run(async () => {
      const result = await listAdminSubmissions(params);
      dispatch({ type: "submissions/set", submissions: result.data });
      return result.meta?.total ?? result.data.length;
    }),
    loadSubmission: (id) => run(async () => dispatch({ type: "submission/save", submission: await getAdminSubmission(id) })),
    loadQrContentData: () => run(async () => {
      const [contents, overrides] = await Promise.all([listAdminQrContents(), listAdminQrOverrides()]);
      setQrContents(contents); setQrOverrides(overrides);
    }),
    loadAdminUsers: () => run(async () => setAdminUsers(await listAdminUsers())),
    saveProduct: (product) => run(async () => {
      const saved = await saveAdminProduct(product); dispatch({ type: "product/save", product: saved }); return saved;
    }),
    setProductStatus: (id, status) => run(async () => {
      const current = state.products.find((item) => item.id === id);
      if (!current?.version) throw new Error("Thiếu version sản phẩm; vui lòng tải lại.");
      dispatch({ type: "product/save", product: await setAdminProductStatus(id, status, current.version) });
    }),
    saveQrRecord: (record) => run(async () => {
      const saved = await saveAdminQr(record); dispatch({ type: "qr/save", record: saved }); return saved;
    }),
    setQrStatus: (code, status) => run(async () => {
      const current = state.qrRecords.find((item) => item.code === code);
      if (!current?.version) throw new Error("Thiếu version QR; vui lòng tải lại.");
      dispatch({ type: "qr/save", record: await setAdminQrStatus(code, status, current.version) });
    }),
    updateSubmission: (id, status, assigneeId) => run(async () => {
      const current = state.submissions.find((item) => item.id === id);
      if (!current) throw new Error("Không tìm thấy yêu cầu.");
      if (current.status !== status) await setAdminSubmissionStatus(id, status);
      if ((current.assignedTo ?? "") !== assigneeId) await assignAdminSubmission(id, assigneeId || undefined);
      dispatch({ type: "submission/save", submission: await getAdminSubmission(id) });
    }),
    addSubmissionActivity: (id, content) => run(async () => {
      await addAdminSubmissionNote(id, content);
      dispatch({ type: "submission/save", submission: await getAdminSubmission(id) });
    }),
  }), [adminUsers, dismissToast, notify, pending, qrContents, qrOverrides, run, state, toasts]);

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore() {
  const context = useContext(AdminStoreContext);
  if (!context) throw new Error("useAdminStore must be used within AdminStoreProvider");
  return context;
}
