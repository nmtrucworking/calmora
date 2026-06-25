import { lazy, Suspense, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
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
  isProductsPage?: boolean;
  navItems?: BrandNavItem[];
};

export function SiteLayout({
  children,
  footerGroups = brandFooterGroups,
  isLanding = false,
  isProductsPage = false,
  navItems = brandNavigation,
}: SiteLayoutProps) {
  const { pathname } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useLayoutEffect(() => {
    if (isLanding && (!window.location.hash || window.location.hash === "#top")) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [isLanding]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = navItems.map((item) => {
    const isActive =
      (item.href === "/" && (pathname === "/" || pathname === "")) ||
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(`${item.href}/`));

    return (
      <Link
        key={item.href}
        href={item.href}
        className={isActive ? styles.activeNav : ""}
        onClick={() => setIsMenuOpen(false)}
      >
        {item.label}
      </Link>
    );
  });

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
            {navLinks}
          </nav>

          <div className={styles.headerActions}>
            <AmbientSoundButton />
            <Link href="/contact" className={styles.headerCta} onClick={() => setIsMenuOpen(false)}>
              Liên hệ
            </Link>
            <button
              className={styles.menuButton}
              type="button"
              aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
        <div
          className={`${styles.mobileOverlay} ${isMenuOpen ? styles.mobileOverlayOpen : ""}`}
          id="mobile-navigation"
        >
          <nav className={styles.mobileNav} aria-label="Điều hướng di động">
            {navLinks}
            <Link
              href="/pre-order"
              className={styles.mobileCta}
              onClick={() => setIsMenuOpen(false)}
            >
              Đăng ký trải nghiệm
            </Link>
          </nav>
        </div>
      </header>

      <div
        className={
          isLanding
            ? styles.landingContent
            : `${styles.content} ${isProductsPage ? styles.productsContent : ""}`
        }
      >
        {children}
      </div>

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
                  return (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className={styles.footerMeta}>
            <span>hello@senova.vn</span>
            <span>© {new Date().getFullYear()} Calmora | Senova</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
