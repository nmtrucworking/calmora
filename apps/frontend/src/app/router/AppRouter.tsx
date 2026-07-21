import { lazy, Suspense, useEffect } from "react";
import { RouterProvider } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { SiteLayout } from "@app/layout/SiteLayout";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { pageTransitionVariants } from "@shared/motion/animationSystem";
import { getProductBySlug as getSeedProductBySlug } from "@features/products/data/products";
import { useProductCatalog } from "@app/providers/ProductCatalogContext";
import { commerceText, getLocalizedProduct, getLocalizedSeo } from "@features/content/i18n";
import { useLanguage, type Language } from "@app/providers/LanguageContext";
import { canonicalBaseUrl, pageSeo, standardPages, type SeoContent } from "@features/content/sitePages";
import { trackEvent } from "@shared/analytics/analytics";
import { publicRoutePaths } from "@app/router/registeredRoutes";

const landingPath = publicRoutePaths.home;

const loadLandingPage = () => import("@features/landing/page");
const loadStoryPage = () => import("@features/story/page");
const loadAboutPage = () => import("@features/about/page");
const loadProductsPage = () => import("@features/products/pages/ProductsPage");
const loadProductDetailPage = () => import("@features/products/pages/ProductDetailPage");
const loadStandardPage = () => import("@features/system/pages/SystemPages/StandardPage");
const loadExperiencePage = () => import("@features/qr/pages/ExperiencePage");
const loadFeedbackPage = () => import("@features/qr/pages/FeedbackPage");
const loadContactPage = () => import("@features/inquiry/pages/ContactPage");
const loadPartnersPage = () => import("@features/inquiry/pages/PartnersPage");
const loadThankYouPage = () => import("@features/inquiry/pages/ThankYouPage");
const loadQrRedirectPage = () => import("@features/qr/pages/QrRedirectPage");
const loadTracePage = () => import("@features/trace/pages/TracePage");
const loadNotFoundPage = () => import("@features/system/pages/NotFoundPage");
const loadCommercePages = () => import("@features/commerce/pages");
const loadAdminApp = () => import("@features/admin/AdminApp");

const SenovaLandingPage = lazy(loadLandingPage);
const StoryPage = lazy(loadStoryPage);
const AboutPage = lazy(loadAboutPage);
const ProductsPage = lazy(loadProductsPage);
const ProductDetailPage = lazy(loadProductDetailPage);
const StandardPage = lazy(loadStandardPage);
const ExperiencePage = lazy(loadExperiencePage);
const FeedbackPage = lazy(loadFeedbackPage);
const ContactPage = lazy(loadContactPage);
const PartnersPage = lazy(loadPartnersPage);
const ThankYouPage = lazy(loadThankYouPage);
const QrRedirectPage = lazy(loadQrRedirectPage);
const TracePage = lazy(loadTracePage);
const NotFoundPage = lazy(loadNotFoundPage);
const CheckoutPage = lazy(() => loadCommercePages().then((module) => ({ default: module.CheckoutPage })));
const CheckoutThankYouPage = lazy(() =>
  loadCommercePages().then((module) => ({ default: module.CheckoutThankYouPage })),
);
const ServicePage = lazy(() => loadCommercePages().then((module) => ({ default: module.ServicePage })));
const PolicyPage = lazy(() => loadCommercePages().then((module) => ({ default: module.PolicyPage })));
const AdminApp = lazy(loadAdminApp);
const hiddenPublicPaths = new Set([
  "/collections",
  "/search",
  "/wishlist",
  "/account",
  "/account/orders",
  "/account/wishlist",
  "/order-status",
  "/journal",
]);

function RouteFallback() {
  return (
    <div
      className="grid min-h-[60vh] place-items-center bg-[var(--surface)] text-primary-strong"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3" aria-hidden="true">
        <span className="font-display text-[1.35rem] tracking-[0.22em]">SENOVA</span>
        <span className="h-px w-16 origin-left animate-pulse bg-accent-strong" />
      </div>
      <span className="sr-only">Đang tải nội dung</span>
    </div>
  );
}

function Redirect({ to }: { to: string }) {
  const { navigate } = useRouter();

  useEffect(() => {
    navigate(to);
  }, [navigate, to]);

  return <RouteFallback />;
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

function updateMetadata(pathname: string, language: Language) {
  const metadataPath = hiddenPublicPaths.has(pathname) || pathname.startsWith("/collections/") || pathname.startsWith("/journal/")
    ? "/404"
    : pathname;
  const productSlug = metadataPath.split("/")[2] ?? "";
  const baseProduct =
    metadataPath.startsWith("/products/") ||
    metadataPath.startsWith("/experience/") ||
    metadataPath.startsWith("/feedback/")
      ? getSeedProductBySlug(productSlug)
      : undefined;
  const product = baseProduct ? getLocalizedProduct(baseProduct, language) : undefined;
  const qrSeo: SeoContent | undefined = metadataPath.startsWith("/q/")
    ? {
        title: "QR Senova | Calmora",
        description: "Trang xu ly ma QR Senova va dieu huong den trai nghiem san pham phu hop.",
        robots: "noindex,follow",
      }
    : undefined;
  const traceSeo: SeoContent | undefined = metadataPath.startsWith("/trace/")
    ? {
        title: "Truy xuất sản phẩm Senova | Calmora",
        description: "Kiểm tra nguồn gốc lô, trạng thái kích hoạt và bằng chứng dữ liệu của sản phẩm Senova.",
        robots: "noindex,follow",
      }
    : undefined;
  const fallbackSeo: SeoContent = traceSeo ?? qrSeo ?? pageSeo[metadataPath] ?? product?.seo ?? pageSeo["/404"];
  const seo = getLocalizedSeo(metadataPath, fallbackSeo, language);
  const canonicalPath = traceSeo || qrSeo || pageSeo[metadataPath] || commerceText[language].seo[metadataPath] || product ? metadataPath : "/404";
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
  upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: language === "vi" ? "vi_VN" : "en_US" });

  let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonical;

  let structuredData = document.head.querySelector<HTMLScriptElement>('#senova-structured-data');
  if (!structuredData) {
    structuredData = document.createElement("script");
    structuredData.id = "senova-structured-data";
    structuredData.type = "application/ld+json";
    document.head.appendChild(structuredData);
  }
  structuredData.textContent = JSON.stringify(
    product
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: `${canonicalBaseUrl}${product.image}`,
          brand: { "@type": "Brand", name: "Senova" },
          manufacturer: { "@type": "Organization", name: "Calmora" },
        }
      : {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Senova",
          url: canonicalBaseUrl,
          parentOrganization: { "@type": "Organization", name: "Calmora" },
        },
  );
}

function PublicRoutes() {
  const { pathname, search } = useRouter();
  const { language } = useLanguage();
  const { getProductBySlug, isLoading: isCatalogLoading } = useProductCatalog();
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const productSlug = normalizedPath.split("/")[2] ?? "";
  const product = getProductBySlug(productSlug);
  const qrCode = normalizedPath.startsWith("/q/") ? normalizedPath.replace("/q/", "") : "";
  const traceCode = normalizedPath.startsWith("/trace/") ? normalizedPath.replace("/trace/", "") : "";
  const serviceContent = commerceText[language].services[normalizedPath];
  const policyContent = commerceText[language].policies[normalizedPath];

  useEffect(() => {
    updateMetadata(normalizedPath, language);
    trackEvent({ eventName: "page_view", path: `${normalizedPath}${search}` });
  }, [language, normalizedPath, search]);

  let pageComponent;
  if (
    isCatalogLoading &&
    (normalizedPath.startsWith("/products/") ||
      normalizedPath.startsWith("/experience/") ||
      normalizedPath.startsWith("/feedback/"))
  ) {
    pageComponent = <RouteFallback />;
  } else if (normalizedPath === landingPath) {
    pageComponent = <SenovaLandingPage />;
  } else if (normalizedPath === publicRoutePaths.about) {
    pageComponent = <AboutPage />;
  } else if (normalizedPath === publicRoutePaths.story) {
    pageComponent = <StoryPage />;
  } else if (normalizedPath === publicRoutePaths.products) {
    pageComponent = <ProductsPage />;
  } else if (normalizedPath.startsWith("/products/")) {
    pageComponent = product ? <ProductDetailPage product={product} /> : <NotFoundPage />;
  } else if (normalizedPath === "/collections" || normalizedPath.startsWith("/collections/")) {
    pageComponent = <Redirect to="/products" />;
  } else if (normalizedPath === publicRoutePaths.orderRequest) {
    pageComponent = <CheckoutPage />;
  } else if (normalizedPath === publicRoutePaths.orderRequestSuccess) {
    pageComponent = <CheckoutThankYouPage />;
  } else if (["/bag", "/checkout", "/reorder", "/pre-order"].includes(normalizedPath)) {
    pageComponent = <Redirect to={`/order-request${search}`} />;
  } else if (normalizedPath === "/checkout/thank-you") {
    pageComponent = <Redirect to={`/order-request/success${search}`} />;
  } else if (serviceContent) {
    pageComponent = <ServicePage content={serviceContent} />;
  } else if (policyContent) {
    pageComponent = <PolicyPage content={policyContent} />;
  } else if (hiddenPublicPaths.has(normalizedPath) || normalizedPath.startsWith("/journal/")) {
    pageComponent = <NotFoundPage />;
  } else if (normalizedPath.startsWith("/experience/")) {
    pageComponent = product ? <ExperiencePage product={product} /> : <NotFoundPage />;
  } else if (normalizedPath.startsWith("/feedback/")) {
    pageComponent = product ? <FeedbackPage product={product} /> : <NotFoundPage />;
  } else if (normalizedPath === publicRoutePaths.contact) {
    pageComponent = <ContactPage />;
  } else if (normalizedPath === publicRoutePaths.partners) {
    pageComponent = <PartnersPage />;
  } else if (normalizedPath === publicRoutePaths.thankYou) {
    pageComponent = <ThankYouPage />;
  } else if (normalizedPath === publicRoutePaths.ritual) {
    pageComponent = <StandardPage content={standardPages["/ritual"]} showProducts />;
  } else if (normalizedPath === publicRoutePaths.seasonal) {
    pageComponent = <StandardPage content={standardPages["/seasonal"]} showProducts />;
  } else if (normalizedPath === publicRoutePaths.privacy) {
    pageComponent = <StandardPage content={standardPages["/privacy"]} />;
  } else if (normalizedPath === publicRoutePaths.terms) {
    pageComponent = <StandardPage content={standardPages["/terms"]} />;
  } else if (qrCode) {
    pageComponent = <QrRedirectPage code={qrCode} />;
  } else if (traceCode) {
    pageComponent = <TracePage publicCode={traceCode} />;
  } else {
    pageComponent = <NotFoundPage />;
  }

  const routedPage = (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence initial={false}>
        <motion.div
          key={pathname}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={pageTransitionVariants}
          style={{ minHeight: "100vh" }}
        >
          {pageComponent}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );

  const isFullBleedContent =
    normalizedPath === "/products" || (normalizedPath.startsWith("/products/") && Boolean(product));

  return (
    <SiteLayout isLanding={pathname === landingPath} isFullBleedContent={isFullBleedContent}>
      {routedPage}
    </SiteLayout>
  );
}

function AppRoutes() {
  const { pathname } = useRouter();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <AdminApp />
      </Suspense>
    );
  }

  return <PublicRoutes />;
}

export default function AppRouter() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider>
        <AppRoutes />
      </RouterProvider>
    </MotionConfig>
  );
}

