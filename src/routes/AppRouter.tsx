import SenovaLandingPage from "../pages/SenovaLandingPage";
import StoryPage from "../pages/StoryPage";
import SitePage from "../pages/SitePage";
import { landingPath } from "./siteRoutes";

export default function AppRouter() {
  const pathname = window.location.pathname;

  if (pathname === landingPath) {
    return <SenovaLandingPage />;
  }

  if (pathname === "/story") {
    return <StoryPage />;
  }

  return <SitePage path={pathname} />;
}
