/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useReducer, useState, type ReactNode } from "react";
import { initialAdminState } from "./data";
import type {
  AdminProduct,
  AdminState,
  ProductStatus,
  QrRecord,
  QrStatus,
  SubmissionStatus,
  ToastMessage,
} from "./types";

type AdminAction =
  | { type: "product/save"; product: AdminProduct }
  | { type: "product/status"; id: string; status: ProductStatus }
  | { type: "qr/save"; record: QrRecord }
  | { type: "qr/status"; id: string; status: QrStatus }
  | { type: "submission/update"; id: string; status: SubmissionStatus; assignee: string }
  | { type: "submission/activity"; id: string; content: string; author: string };

export function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "product/save": {
      const exists = state.products.some((product) => product.id === action.product.id);
      return {
        ...state,
        products: exists
          ? state.products.map((product) => (product.id === action.product.id ? action.product : product))
          : [action.product, ...state.products],
      };
    }
    case "product/status":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.id
            ? { ...product, status: action.status, updatedAt: new Date().toISOString() }
            : product,
        ),
      };
    case "qr/save": {
      const exists = state.qrRecords.some((record) => record.id === action.record.id);
      return {
        ...state,
        qrRecords: exists
          ? state.qrRecords.map((record) => (record.id === action.record.id ? action.record : record))
          : [action.record, ...state.qrRecords],
      };
    }
    case "qr/status":
      return {
        ...state,
        qrRecords: state.qrRecords.map((record) =>
          record.id === action.id ? { ...record, status: action.status } : record,
        ),
      };
    case "submission/update":
      return {
        ...state,
        submissions: state.submissions.map((submission) =>
          submission.id === action.id
            ? { ...submission, status: action.status, assignee: action.assignee }
            : submission,
        ),
      };
    case "submission/activity":
      return {
        ...state,
        submissions: state.submissions.map((submission) =>
          submission.id === action.id
            ? {
                ...submission,
                activities: [
                  {
                    id: `act-${Date.now()}`,
                    author: action.author,
                    content: action.content,
                    createdAt: new Date().toISOString(),
                  },
                  ...submission.activities,
                ],
              }
            : submission,
        ),
      };
    default:
      return state;
  }
}

type AdminStoreValue = AdminState & {
  toasts: ToastMessage[];
  saveProduct: (product: AdminProduct) => Promise<void>;
  setProductStatus: (id: string, status: ProductStatus) => Promise<void>;
  saveQrRecord: (record: QrRecord) => Promise<void>;
  setQrStatus: (id: string, status: QrStatus) => Promise<void>;
  updateSubmission: (id: string, status: SubmissionStatus, assignee: string) => Promise<void>;
  addSubmissionActivity: (id: string, content: string, author: string) => Promise<void>;
  notify: (message: string, tone?: ToastMessage["tone"]) => void;
  dismissToast: (id: string) => void;
};

const AdminStoreContext = createContext<AdminStoreValue | null>(null);
const waitForMock = () => new Promise<void>((resolve) => window.setTimeout(resolve, 160));

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialAdminState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastMessage["tone"] = "success") => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((current) => [...current, { id, message, tone }]);
      window.setTimeout(() => dismissToast(id), 3500);
    },
    [dismissToast],
  );

  const value = useMemo<AdminStoreValue>(
    () => ({
      ...state,
      toasts,
      notify,
      dismissToast,
      saveProduct: async (product) => {
        await waitForMock();
        dispatch({ type: "product/save", product });
      },
      setProductStatus: async (id, status) => {
        await waitForMock();
        dispatch({ type: "product/status", id, status });
      },
      saveQrRecord: async (record) => {
        await waitForMock();
        dispatch({ type: "qr/save", record });
      },
      setQrStatus: async (id, status) => {
        await waitForMock();
        dispatch({ type: "qr/status", id, status });
      },
      updateSubmission: async (id, status, assignee) => {
        await waitForMock();
        dispatch({ type: "submission/update", id, status, assignee });
      },
      addSubmissionActivity: async (id, content, author) => {
        await waitForMock();
        dispatch({ type: "submission/activity", id, content, author });
      },
    }),
    [dismissToast, notify, state, toasts],
  );

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore() {
  const context = useContext(AdminStoreContext);
  if (!context) throw new Error("useAdminStore must be used within AdminStoreProvider");
  return context;
}
