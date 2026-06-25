import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { RouterProvider } from "../contexts/RouterContext";
import { useRouter } from "../contexts/RouterState";
import { SiteLayout } from "../layouts/SiteLayout";
import { AnimatePresence, motion } from "framer-motion";
import { preloadImages } from "../utils/imagePreload";
import { getProductBySlug } from "../features/products/data/products";
import landingBackgroundUrl from "../assets/landing-optimized.jpg";
import productsBackgroundUrl from "../assets/products-background-optimized.jpg";
import { canonicalBaseUrl, pageSeo, standardPages, type SeoContent } from "../content/sitePages";
import { trackEvent } from "../features/analytics/analytics";

const landingPath = "/";

const loadLandingPage = () => import("../pages/SenovaLandingPage");
const loadStoryPage = () => import("../pages/StoryPage");
const loadAboutPage = () => import("../pages/AboutPage");
const loadProductsPage = () => import("../pages/ProductsPage");
const loadProductDetailPage = () => import("../pages/ProductDetailPage");
const loadStandardPage = () => import("../pages/SystemPages/StandardPage");
const loadExperiencePage = () => import("../pages/ExperiencePage");
const loadFeedbackPage = () => import("../pages/FeedbackPage");
const loadPreOrderPage = () => import("../pages/PreOrderPage");
const loadContactPage = () => import("../pages/ContactPage");
const loadPartnersPage = () => import("../pages/PartnersPage");
const loadThankYouPage = () => import("../pages/ThankYouPage");
const loadQrRedirectPage = () => import("../pages/QrRedirectPage");
const loadNotFoundPage = () => import("../pages/NotFoundPage");

const SenovaLandingPage = lazy(loadLandingPage);
const StoryPage = lazy(loadStoryPage);
const AboutPage = lazy(loadAboutPage);
const ProductsPage = lazy(loadProductsPage);
const ProductDetailPage = lazy(loadProductDetailPage);
const StandardPage = lazy(loadStandardPage);
const ExperiencePage = lazy(loadExperiencePage);
const FeedbackPage = lazy(loadFeedbackPage);
const PreOrderPage = lazy(loadPreOrderPage);
const ContactPage = lazy(loadContactPage);
const PartnersPage = lazy(loadPartnersPage);
const ThankYouPage = lazy(loadThankYouPage);
const QrRedirectPage = lazy(loadQrRedirectPage);
const NotFoundPage = lazy(loadNotFoundPage);
let didSchedulePreload = false;

const productImagePaths = [
  "/assets/products/classic-pack.jpg",
  "/assets/products/petal-pack.jpg",
  "/assets/products/gift-set.jpg",
];
const sharedImagePaths = ["/assets/brand/calmora-mark.png"];
const pageFocusSectionClass = "pageFocusSection";
const pageFocusActiveClass = "pageFocusActive";

function RouteFallback() {
  return <div style={{ minHeight: "60vh" }} />;
}

function FocusSections({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    let intersectionObserver: IntersectionObserver | null = null;
    let collectFrame = 0;
    let sections: HTMLElement[] = [];
    const ratios = new Map<HTMLElement, number>();

    const cleanupSections = () => {
      intersectionObserver?.disconnect();
      intersectionObserver = null;
      sections.forEach((section) => {
        section.classList.remove(pageFocusSectionClass, pageFocusActiveClass);
      });
      sections = [];
      ratios.clear();
    };

    const updateActiveSection = () => {
      const activeSection = sections.reduce<HTMLElement | null>((current, section) => {
        if (!current) return section;
        return (ratios.get(section) ?? 0) > (ratios.get(current) ?? 0) ? section : current;
      }, null);

      if (!activeSection || (ratios.get(activeSection) ?? 0) < 0.12) return;

      sections.forEach((section) => {
        section.classList.toggle(pageFocusActiveClass, section === activeSection);
      });
    };

    const collectSections = () => {
      cleanupSections();

      const nextSections = Array.from(root.querySelectorAll("section")).filter(
        (section): section is HTMLElement => section instanceof HTMLElement,
      );

      if (nextSections.length < 2) return;

      sections = nextSections;
      sections.forEach((section) => section.classList.add(pageFocusSectionClass));
      sections[0]?.classList.add(pageFocusActiveClass);

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            ratios.set(entry.target as HTMLElement, entry.intersectionRatio);
          });
          updateActiveSection();
        },
        {
          root: null,
          rootMargin: "-16% 0px -30% 0px",
          threshold: [0.12, 0.24, 0.36, 0.5, 0.66, 0.82],
        },
      );

      sections.forEach((section) => intersectionObserver?.observe(section));
    };

    const scheduleCollect = () => {
      window.cancelAnimationFrame(collectFrame);
      collectFrame = window.requestAnimationFrame(collectSections);
    };

    const mutationObserver = new MutationObserver(scheduleCollect);
    mutationObserver.observe(root, { childList: true, subtree: true });
    scheduleCollect();

    return () => {
      window.cancelAnimationFrame(collectFrame);
      mutationObserver.disconnect();
      cleanupSections();
    };
  }, [enabled, children]);

  return (
    <div ref={rootRef} style={{ display: "contents" }}>
      {children}
    </div>
  );
}

function getRouteImagePaths(pathname: string) {
  if (pathname === landingPath) {
    return [landingBackgroundUrl, ...sharedImagePaths];
  }

  if (pathname === "/products") {
    return [productsBackgroundUrl, ...sharedImagePaths, ...productImagePaths];
  }

  if (
    pathname.startsWith("/products/") ||
    pathname.startsWith("/experience/") ||
    pathname.startsWith("/feedback/")
  ) {
    const productSlug = pathname.split("/")[2] ?? "";
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
          loadStandardPage(),
          loadExperiencePage(),
          loadFeedbackPage(),
          loadPreOrderPage(),
          loadContactPage(),
          loadPartnersPage(),
          loadThankYouPage(),
          loadQrRedirectPage(),
          loadNotFoundPage(),
        ]);
      },
      { timeout: 1800 },
    );
  }, 900);
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function updateMetadata(pathname: string) {
  const productSlug = pathname.split("/")[2] ?? "";
  const product =
    pathname.startsWith("/products/") ||
    pathname.startsWith("/experience/") ||
    pathname.startsWith("/feedback/")
      ? getProductBySlug(productSlug)
      : undefined;
  const seo: SeoContent = product?.seo ?? pageSeo[pathname] ?? pageSeo["/404"];
  const canonicalPath = pageSeo[pathname] || product ? pathname : "/404";
  const canonical = `${canonicalBaseUrl}${canonicalPath === "/" ? "" : canonicalPath}`;
  const image = seo.image ?? `${canonicalBaseUrl}/assets/brand/calmora-mark.png`;

  document.title = seo.title;
  upsertMeta('meta[name="description"]', { name: "description", content: seo.description });
  upsertMeta('meta[name="robots"]', { name: "robots", content: seo.robots ?? "index,follow" });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: seo.title });
  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: seo.description,
  });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });

  let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonical;
}

function AppRoutes() {
  const { pathname, search } = useRouter();
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const productSlug = normalizedPath.split("/")[2] ?? "";
  const product = getProductBySlug(productSlug);
  const qrCode = normalizedPath.startsWith("/q/") ? normalizedPath.replace("/q/", "") : "";

  useEffect(() => {
    preloadSecondaryRoutes();
  }, []);

  useEffect(() => {
    updateMetadata(normalizedPath);
    trackEvent({ eventName: "page_view", path: `${normalizedPath}${search}` });
  }, [normalizedPath, search]);

  let pageComponent;
  if (normalizedPath === landingPath) {
    pageComponent = <SenovaLandingPage />;
  } else if (normalizedPath === "/about") {
    pageComponent = <AboutPage />;
  } else if (normalizedPath === "/story") {
    pageComponent = <StoryPage />;
  } else if (normalizedPath === "/products") {
    pageComponent = <ProductsPage />;
  } else if (normalizedPath.startsWith("/products/")) {
    pageComponent = product ? <ProductDetailPage product={product} /> : <NotFoundPage />;
  } else if (normalizedPath.startsWith("/experience/")) {
    pageComponent = product ? <ExperiencePage product={product} /> : <NotFoundPage />;
  } else if (normalizedPath.startsWith("/feedback/")) {
    pageComponent = product ? <FeedbackPage product={product} /> : <NotFoundPage />;
  } else if (normalizedPath === "/pre-order") {
    pageComponent = <PreOrderPage />;
  } else if (normalizedPath === "/contact") {
    pageComponent = <ContactPage />;
  } else if (normalizedPath === "/partners") {
    pageComponent = <PartnersPage />;
  } else if (normalizedPath === "/thank-you") {
    pageComponent = <ThankYouPage />;
  } else if (normalizedPath === "/ritual") {
    pageComponent = <StandardPage content={standardPages["/ritual"]} showProducts />;
  } else if (normalizedPath === "/seasonal") {
    pageComponent = <StandardPage content={standardPages["/seasonal"]} showProducts />;
  } else if (normalizedPath === "/privacy") {
    pageComponent = <StandardPage content={standardPages["/privacy"]} />;
  } else if (normalizedPath === "/terms") {
    pageComponent = <StandardPage content={standardPages["/terms"]} />;
  } else if (qrCode) {
    pageComponent = <QrRedirectPage code={qrCode} />;
  } else {
    pageComponent = <NotFoundPage />;
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
            <FocusSections enabled={normalizedPath !== "/products"}>{pageComponent}</FocusSections>
          </motion.div>
        </AnimatePresence>
      </ImageReadyBoundary>
    </Suspense>
  );

  return (
    <SiteLayout isLanding={pathname === landingPath} isProductsPage={normalizedPath === "/products"}>
      {routedPage}
    </SiteLayout>
  );
}

export default function AppRouter() {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
}

