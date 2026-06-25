import React, {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import { RouterContext, useRouter } from "./RouterState";

type RouterProviderProps = {
  children: ReactNode;
};

export function RouterProvider({ children }: RouterProviderProps) {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [search, setSearch] = useState(window.location.search);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      startTransition(() => {
        setPathname(window.location.pathname);
        setSearch(window.location.search);
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    const url = new URL(path, window.location.origin);

    if (window.location.pathname !== url.pathname || window.location.search !== url.search) {
      window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
      startTransition(() => {
        setPathname(url.pathname);
        setSearch(url.search);
      });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  const value = useMemo(() => ({ pathname, search, navigate }), [pathname, search, navigate]);

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

export function Link({ href, children, onClick, target, ...props }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    if (
      e.defaultPrevented ||
      !href.startsWith("/") ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      target
    ) {
      return;
    }

    e.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
