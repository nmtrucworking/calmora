import { lazy, Suspense, useLayoutEffect, type ReactNode } from "react";
import { BrandMark } from "../components/branding/BrandMark";
import {
  brandFooterGroups,
  brandName,
  brandNavigation,
  brandSummary,
  type BrandFooterGroup,
  type BrandNavItem,
} from "../constants/brand";
import { Link } from "../contexts/RouterContext";
import { useRouter } from "../contexts/RouterState";
import { AmbientSoundButton } from "../features/landing/sections/AmbientSoundButton";
import styles from "./SiteLayout.module.css";

const ScrollModelCanvas = lazy(() =>
  import("../features/landing/three/ScrollModelCanvas").then((module) => ({
    default: module.ScrollModelCanvas,
  })),
);

type SiteLayoutProps = {
  children: ReactNode;
  footerGroups?: BrandFooterGroup[];
  isLanding?: boolean;
  navItems?: BrandNavItem[];
};

export function SiteLayout({
  children,
  footerGroups = brandFooterGroups,
  isLanding = false,
  navItems = brandNavigation,
}: SiteLayoutProps) {
  const { pathname } = useRouter();

  useLayoutEffect(() => {
    if (isLanding && (!window.location.hash || window.location.hash === "#top")) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [isLanding]);

  return (
    <main className={`${styles.page} ${isLanding ? styles.landingPage : ""}`}>
      {isLanding ? (
        <>
          <Suspense fallback={null}>
            <ScrollModelCanvas />
          </Suspense>
          <div className={styles.landingScrim} />
        </>
      ) : null}

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <BrandMark size="md" />
            <span className={styles.brandName}>{brandName}</span>
          </Link>

          <nav className={styles.nav} aria-label="Điều hướng chính">
            {navItems.map((item) => {
              const isActive =
                (item.href === "/" && (pathname === "/" || pathname === "")) ||
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              return (
                <Link key={item.href} href={item.href} className={isActive ? styles.activeNav : ""}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.headerActions}>
            <AmbientSoundButton />
            <a href="mailto:hello@senova.vn" className={styles.headerCta}>
              Liên hệ
            </a>
          </div>
        </div>
      </header>

      <div className={isLanding ? styles.landingContent : styles.content}>{children}</div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <BrandMark size="sm" />
            <div>
              <p className={styles.footerName}>{brandName}</p>
              <p className={styles.footerTagline}>{brandSummary}</p>
            </div>
          </div>

          <nav className={styles.footerNav} aria-label="Điều hướng chân trang">
            {footerGroups.map((group) => (
              <div key={group.title} className={styles.footerGroup}>
                <h2 className={styles.footerGroupTitle}>{group.title}</h2>
                {group.links.map((link) => {
                  if (link.href.startsWith("mailto:")) {
                    return (
                      <a key={link.href} href={link.href}>
                        {link.label}
                      </a>
                    );
                  }

                  return (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}
