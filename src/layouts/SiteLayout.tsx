import { lazy, Suspense, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { BrandMark } from "../components/branding/BrandMark";
import {
  brandName,
  type BrandFooterGroup,
  type BrandNavItem,
} from "../constants/brand";
import { brandText } from "../content/i18n";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "../contexts/RouterContext";
import { useRouter } from "../contexts/RouterState";
import { AmbientSoundButton } from "../features/landing/sections/AmbientSoundButton";
import { useInquiryBag } from "../contexts/InquiryBagContext";
import { cx } from "../utils/classNames";
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

const desktopNavLinkClass =
  "flex-none text-text-muted no-underline transition-colors duration-150 hover:text-primary";
const mobileNavLinkClass =
  "min-h-11 border-b border-border text-text-muted font-[750] no-underline transition-colors duration-150";
const activeNavClass = "!text-accent-gold font-[750]";

export function SiteLayout({
  children,
  footerGroups,
  isLanding = false,
  isProductsPage = false,
  navItems,
}: SiteLayoutProps) {
  const { pathname } = useRouter();
  const { itemCount } = useInquiryBag();
  const { language, toggleLanguage } = useLanguage();
  const copy = brandText[language];
  const activeNavItems = navItems ?? copy.navigation;
  const activeFooterGroups = footerGroups ?? copy.footerGroups;
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

  const renderNavLinks = (variant: "desktop" | "mobile") =>
    activeNavItems.map((item) => {
      const isActive =
        (item.href === "/" && (pathname === "/" || pathname === "")) ||
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(`${item.href}/`));

      return (
        <Link
          key={`${variant}-${item.href}`}
          href={item.href}
          className={cx(
            variant === "desktop" ? desktopNavLinkClass : mobileNavLinkClass,
            isActive && activeNavClass,
          )}
          onClick={() => setIsMenuOpen(false)}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <main
      className={cx(
        styles.page,
        isLanding && styles.landingPage,
        "relative min-h-screen overflow-x-hidden text-text isolate",
      )}
    >
      {isLanding ? (
        <>
          <Suspense fallback={null}>
            <ScrollModelCanvas />
          </Suspense>
          <div className={styles.landingScrim} />
        </>
      ) : null}

      <header className="fixed inset-x-0 top-0 z-40 border-0 bg-[var(--header-bg)] shadow-[0_10px_30px_rgba(37,31,21,0.05)] [backdrop-filter:blur(26px)_saturate(1.18)] [-webkit-backdrop-filter:blur(26px)_saturate(1.18)]">
        <div className="mx-auto grid max-w-[var(--page-max)] grid-cols-[minmax(11rem,0.5fr)_minmax(0,1.4fr)_auto] items-center gap-5 px-6 py-[0.7rem] max-[900px]:grid-cols-[minmax(0,1fr)_auto] max-[900px]:gap-x-4 max-[900px]:gap-y-3 max-[900px]:px-4 max-[900px]:pt-3 max-[900px]:pb-[0.65rem]">
          <Link href="/" className="inline-flex min-w-0 items-center gap-[0.8rem] text-text no-underline">
            <BrandMark size="md" />
            <span className="text-[0.85rem] font-[750] tracking-[0.24em] max-[520px]:text-[0.8rem]">
              {brandName}
            </span>
          </Link>

          <nav
            className="flex min-w-0 items-center justify-center gap-4 text-[0.78rem] max-[900px]:hidden"
            aria-label={copy.navAria}
          >
            {renderNavLinks("desktop")}
          </nav>

          <div className="flex items-center justify-end gap-[0.65rem] max-[520px]:gap-2">
            <AmbientSoundButton />
            <Link
              href="/bag"
              className="inline-flex min-h-[2.1rem] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-primary bg-primary px-[0.95rem] py-[0.48rem] text-[0.78rem] font-[750] text-on-primary no-underline transition duration-150 hover:-translate-y-px hover:bg-primary-strong"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag aria-hidden="true" className="h-4 w-4" />
              {copy.bagLabel} {itemCount ? `(${itemCount})` : ""}
            </Link>
            <button
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-border-strong bg-[#fffdf8bd] px-3 text-[0.74rem] font-extrabold text-primary-strong"
              type="button"
              aria-label={copy.languageToggle}
              onClick={toggleLanguage}
            >
              {language === "vi" ? "EN" : "VI"}
            </button>
            <button
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-[#fffdf8bd] text-primary-strong max-[900px]:inline-flex [&_svg]:h-[1.2rem] [&_svg]:w-[1.2rem]"
              type="button"
              aria-label={isMenuOpen ? copy.menuClose : copy.menuOpen}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
        <div
          className={cx(
            "pointer-events-none fixed inset-x-0 top-[4.15rem] hidden max-h-[calc(100svh-4.15rem)] -translate-y-[0.6rem] overflow-y-auto bg-[#fffdf8c7] p-4 opacity-0 shadow-brand-md transition duration-150 [backdrop-filter:blur(24px)_saturate(1.14)] [-webkit-backdrop-filter:blur(24px)_saturate(1.14)] max-[900px]:block",
            isMenuOpen && "pointer-events-auto translate-y-0 opacity-100",
          )}
          id="mobile-navigation"
        >
          <nav className="grid gap-3" aria-label={copy.mobileNavAria}>
            {renderNavLinks("mobile")}
            <Link
              href="/checkout"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary bg-primary font-[750] !text-on-primary no-underline"
              onClick={() => setIsMenuOpen(false)}
            >
              {copy.inquiryCta}
            </Link>
          </nav>
        </div>
      </header>

      <div
        className={
          isLanding
            ? cx("relative z-10", styles.landingContentEffects)
            : cx(
                "relative z-10 mx-auto max-w-[var(--page-max)] px-6 pt-12 pb-20 max-[900px]:px-4 max-[900px]:pt-[5.4rem] max-[900px]:pb-16",
                styles.contentEffects,
                isProductsPage && "max-w-none p-0 max-[900px]:p-0",
              )
        }
      >
        {children}
      </div>

      <footer className="relative z-10 bg-[var(--footer-bg)] [backdrop-filter:blur(24px)_saturate(1.12)] [-webkit-backdrop-filter:blur(24px)_saturate(1.12)]">
        <div className="mx-auto grid max-w-[var(--page-max)] grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] gap-8 px-6 pt-8 pb-10 max-[900px]:grid-cols-1">
          <div className="flex items-start gap-[0.9rem]">
            <BrandMark size="sm" />
            <div>
              <p className="m-0 text-[0.95rem] font-[750] tracking-[0.2em] text-primary">{brandName}</p>
              <p className="mt-[0.45rem] mb-0 max-w-[28rem] leading-[1.7] text-text-muted">
                {copy.summary}
              </p>
            </div>
          </div>

          <nav
            className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-1"
            aria-label={copy.footerAria}
          >
            {activeFooterGroups.map((group) => (
              <div key={group.title} className="grid content-start gap-[0.55rem]">
                <h2 className="m-0 text-[0.8rem] font-[750] uppercase tracking-[0.22em] text-accent-gold">
                  {group.title}
                </h2>
                {group.links.map((link) => {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-text-muted no-underline hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="col-span-full flex flex-wrap justify-between gap-x-5 gap-y-3 pt-4 text-[0.82rem] text-text-soft">
            <span>hello@senova.vn</span>
            <span>© {new Date().getFullYear()} Calmora | Senova</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
