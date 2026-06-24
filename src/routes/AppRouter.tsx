import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { RouterProvider } from "../contexts/RouterContext";
import { useRouter } from "../contexts/RouterState";
import { SiteLayout } from "../layouts/SiteLayout";
import { landingPath } from "./siteRoutes";
import { AnimatePresence, motion } from "framer-motion";
import { preloadImages } from "../utils/imagePreload";
import { getProductBySlug } from "../features/products/data/products";

const loadLandingPage = () => import("../pages/SenovaLandingPage");
const loadStoryPage = () => import("../pages/StoryPage");
const loadAboutPage = () => import("../pages/AboutPage");
const loadProductsPage = () => import("../pages/ProductsPage");
const loadProductDetailPage = () => import("../pages/ProductDetailPage");
const loadSitePage = () => import("../pages/SitePage");

const SenovaLandingPage = lazy(loadLandingPage);
const StoryPage = lazy(loadStoryPage);
const AboutPage = lazy(loadAboutPage);
const ProductsPage = lazy(loadProductsPage);
const ProductDetailPage = lazy(loadProductDetailPage);
const SitePage = lazy(loadSitePage);
let didSchedulePreload = false;

const productImagePaths = [
  "/assets/products/classic-pack.jpg",
  "/assets/products/petal-pack.jpg",
  "/assets/products/gift-set.jpg",
];
const sharedImagePaths = ["/assets/brand/calmora-mark.png"];

function RouteFallback() {
  return <div style={{ minHeight: "60vh" }} />;
}

function getRouteImagePaths(pathname: string) {
  if (pathname === "/products") {
    return [...sharedImagePaths, ...productImagePaths];
  }

  if (pathname.startsWith("/products/")) {
    const productSlug = pathname.replace("/products/", "").split("/")[0];
    const product = getProductBySlug(productSlug);

    return product ? [...sharedImagePaths, product.image] : sharedImagePaths;
  }

  return sharedImagePaths;
}

function ImageReadyBoundary({ children, pathname }: { children: ReactNode; pathname: string }) {
  const imagePaths = useMemo(() => getRouteImagePaths(pathname), [pathname]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    void preloadImages(imagePaths, {
      priority: pathname === "/products" ? "high" : "auto",
      timeoutMs: pathname === "/products" ? 3200 : 1400,
    }).then(() => {
      if (isCurrent) {
        setIsReady(true);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [imagePaths, pathname]);

  if (!isReady) {
    return <RouteFallback />;
  }

  return children;
}

function preloadSecondaryRoutes() {
  if (didSchedulePreload) return;
  didSchedulePreload = true;

  const scheduleIdle = (callback: IdleRequestCallback, options: IdleRequestOptions) => {
    if ("requestIdleCallback" in window) {
      return window.requestIdleCallback(callback, options);
    }

    return globalThis.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 0 }), 1);
  };

  window.setTimeout(() => {
    scheduleIdle(
      () => {
        void preloadImages([...sharedImagePaths, ...productImagePaths], {
          priority: "low",
          timeoutMs: 3200,
        });

        void Promise.allSettled([
          loadAboutPage(),
          loadStoryPage(),
          loadProductsPage(),
          loadProductDetailPage(),
          loadSitePage(),
        ]);
      },
      { timeout: 1800 },
    );
  }, 900);
}

function AppRoutes() {
  const { pathname } = useRouter();
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const productSlug = normalizedPath.startsWith("/products/")
    ? normalizedPath.replace("/products/", "").split("/")[0]
    : "";

  useEffect(() => {
    preloadSecondaryRoutes();
  }, []);

  let pageComponent;
  if (normalizedPath === landingPath) {
    pageComponent = <SenovaLandingPage />;
  } else if (normalizedPath === "/about") {
    pageComponent = <AboutPage />;
  } else if (normalizedPath === "/story") {
    pageComponent = <StoryPage />;
  } else if (normalizedPath === "/products") {
    pageComponent = <ProductsPage />;
  } else if (productSlug) {
    pageComponent = <ProductDetailPage product={getProductBySlug(productSlug)} />;
  } else {
    pageComponent = <SitePage path={normalizedPath} />;
  }

  const routedPage = (
    <Suspense fallback={<RouteFallback />}>
      <ImageReadyBoundary key={pathname} pathname={pathname}>
        <AnimatePresence initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            style={{ minHeight: "100vh" }}
          >
            {pageComponent}
          </motion.div>
        </AnimatePresence>
      </ImageReadyBoundary>
    </Suspense>
  );

  return <SiteLayout isLanding={pathname === landingPath}>{routedPage}</SiteLayout>;
}

export default function AppRouter() {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
}

