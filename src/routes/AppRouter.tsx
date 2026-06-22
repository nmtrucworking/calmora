import { RouterProvider, useRouter } from "../contexts/RouterContext";
import SenovaLandingPage from "../pages/SenovaLandingPage";
import StoryPage from "../pages/StoryPage";
import AboutPage from "../pages/AboutPage";
import ProductsPage from "../pages/ProductsPage";
import SitePage from "../pages/SitePage";
import { landingPath } from "./siteRoutes";
import { AnimatePresence, motion } from "framer-motion";

function AppRoutes() {
  const { pathname } = useRouter();

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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ minHeight: "100vh" }}
      >
        {pageComponent}
      </motion.div>
    </AnimatePresence>
  );
}

export default function AppRouter() {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
}

