import { useLayoutEffect, type ReactNode } from "react";
import { landingContent } from "../features/landing/content/landingContent";
import { Footer } from "../features/landing/sections/Footer";
import { Header } from "../features/landing/sections/Header";
import styles from "../features/landing/SenovaLandingPage.module.css";
import { ScrollModelCanvas } from "../features/landing/three/ScrollModelCanvas";

type LandingLayoutProps = {
  children: ReactNode;
};

export function LandingLayout({ children }: LandingLayoutProps) {
  useLayoutEffect(() => {
    if (!window.location.hash || window.location.hash === "#top") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  return (
    <main className={styles.page}>
      <ScrollModelCanvas />
      <div className={styles.scrim} />
      <Header navItems={landingContent.nav} showSound />
      {children}
      <Footer content={landingContent.footer} />
    </main>
  );
}
