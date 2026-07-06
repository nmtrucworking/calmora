import { createContext, useContext } from "react";

export type RouterContextType = {
  pathname: string;
  search: string;
  navigate: (path: string) => void;
};

export const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}
