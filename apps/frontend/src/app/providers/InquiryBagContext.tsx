/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProductId } from "@features/products/data/products";

export type InquiryBagItem = {
  productId: ProductId;
  quantity: number;
  variantId?: string;
  giftMessage?: string;
  deliveryPreference?: string;
};

export type CheckoutInquiryPayload = {
  name: string;
  email: string;
  phone: string;
  intent: string;
  deliveryPreference: string;
  giftMessage: string;
  notes: string;
};

type InquiryBagContextType = {
  items: InquiryBagItem[];
  itemCount: number;
  addItem: (item: Omit<InquiryBagItem, "quantity"> & { quantity?: number }) => void;
  updateItem: (productId: ProductId, updates: Partial<InquiryBagItem>) => void;
  removeItem: (productId: ProductId) => void;
  clearBag: () => void;
};

const storageKey = "senova.inquiryBag";
const InquiryBagContext = createContext<InquiryBagContextType | undefined>(undefined);

function readStoredBag() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "[]") as InquiryBagItem[];
  } catch {
    return [];
  }
}

export function InquiryBagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InquiryBagItem[]>(() => readStoredBag());

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback<InquiryBagContextType["addItem"]>((item) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.productId === item.productId);
      if (existing) {
        return current.map((entry) =>
          entry.productId === item.productId
            ? {
                ...entry,
                quantity: Math.max(1, entry.quantity + (item.quantity ?? 1)),
                variantId: item.variantId ?? entry.variantId,
              }
            : entry,
        );
      }

      return [...current, { ...item, quantity: Math.max(1, item.quantity ?? 1) }];
    });
  }, []);

  const updateItem = useCallback<InquiryBagContextType["updateItem"]>((productId, updates) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, ...updates, quantity: Math.max(1, updates.quantity ?? item.quantity) }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: ProductId) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearBag = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem,
      updateItem,
      removeItem,
      clearBag,
    }),
    [addItem, clearBag, items, removeItem, updateItem],
  );

  return <InquiryBagContext.Provider value={value}>{children}</InquiryBagContext.Provider>;
}

export function useInquiryBag() {
  const context = useContext(InquiryBagContext);
  if (!context) {
    throw new Error("useInquiryBag must be used within InquiryBagProvider");
  }

  return context;
}
