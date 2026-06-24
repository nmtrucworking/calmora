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
  "/assets/products/classic-pack.png",
  "/assets/products/petal-pack.png",
  "/assets/products/gift-set.png",
];
const sharedImagePaths = ["/calmora-mark-original-look.svg"];

function RouteFallback() {
  return <div style={{ minHeight: "60vh" }} />;
}

function getRouteImagePaths(pathname: string) {
  if (pathname === "/products" || pathname.startsWith("/san-pham")) {
    return [...sharedImagePaths, ...productImagePaths];
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

  window.setTimeout(() => {
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
  }, 900);
}

function AppRoutes() {
  const { pathname } = useRouter();
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const productSlug = normalizedPath.startsWith("/san-pham/")
    ? normalizedPath.replace("/san-pham/", "").split("/")[0]
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
  } else if (normalizedPath === "/products" || normalizedPath === "/san-pham") {
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

