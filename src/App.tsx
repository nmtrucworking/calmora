import SenovaLandingPage from "./pages/SenovaLandingPage";
import SitePage from "./pages/SitePage";

export default function App() {
  const path = window.location.pathname;

  if (path !== "/") {
    return <SitePage path={path} />;
  }

  return <SenovaLandingPage />;
}
