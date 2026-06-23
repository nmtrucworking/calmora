import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { RouterProvider } from "../contexts/RouterContext";
import { useRouter } from "../contexts/RouterState";
import { SiteLayout } from "../layouts/SiteLayout";
import { landingPath } from "./siteRoutes";
import { AnimatePresence, motion } from "framer-motion";
import { preloadImages } from "../utils/imagePreload";

const loadLandingLayout = () => import("../layouts/LandingLayout");
const loadLandingPage = () => import("../pages/SenovaLandingPage");
const loadStoryPage = () => import("../pages/StoryPage");
const loadAboutPage = () => import("../pages/AboutPage");
const loadProductsPage = () => import("../pages/ProductsPage");
const loadSitePage = () => import("../pages/SitePage");

const LandingLayout = lazy(() =>
  loadLandingLayout().then((module) => ({ default: module.LandingLayout })),
);
const SenovaLandingPage = lazy(loadLandingPage);
const StoryPage = lazy(loadStoryPage);
const AboutPage = lazy(loadAboutPage);
const ProductsPage = lazy(loadProductsPage);
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
  if (pathname === "/products") {
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
      loadSitePage(),
    ]);
  }, 900);
}

function AppRoutes() {
  const { pathname } = useRouter();

  useEffect(() => {
    preloadSecondaryRoutes();
  }, []);

  let pageComponent;
  if (pathname === landingPath) {
    pageComponent = <SenovaLandingPage />;
  } else if (pathname === "/about") {
    pageComponent = <AboutPage />;
  } else if (pathname === "/story") {
    pageComponent = <StoryPage />;
  } else if (pathname === "/products") {
    pageComponent = <ProductsPage />;
  } else {
    pageComponent = <SitePage path={pathname} />;
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

  if (pathname === landingPath) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <LandingLayout>{routedPage}</LandingLayout>
      </Suspense>
    );
  }

  return <SiteLayout>{routedPage}</SiteLayout>;
}

export default function AppRouter() {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
}

