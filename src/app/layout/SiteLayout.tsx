import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@shared/components/branding/BrandMark";
import type { BrandFooterGroup, BrandNavItem } from "@features/content/brand";
import { luxuryLayoutCopy } from "@features/content/luxuryCopy";
import { useLanguage } from "@app/providers/LanguageContext";
import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { cx } from "@shared/utils/classNames";
import styles from "./SiteLayout.module.css";
import { AmbientSoundButton } from "@features/landing/sections/AmbientSoundButton";

type SiteLayoutProps = {
  children: ReactNode;
  footerGroups?: BrandFooterGroup[];
  isLanding?: boolean;
  isProductsPage?: boolean;
  navItems?: BrandNavItem[];
};

const desktopNavLinkClass =
  "inline-flex min-h-11 flex-none items-center text-text-muted no-underline transition-colors duration-200 hover:text-primary-strong";
const mobileNavLinkClass =
  "min-h-11 border-b border-border py-3 text-[1.05rem] font-[650] text-text-muted no-underline transition-colors duration-200";

export function SiteLayout({
  children,
  footerGroups,
  isLanding = false,
  isProductsPage = false,
  navItems,
}: SiteLayoutProps) {
  const { pathname } = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const copy = luxuryLayoutCopy[language];
  const activeNavItems = navItems ?? copy.navigation;
  const activeFooterGroups = footerGroups ?? copy.footerGroups;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparentHeader = isLanding && !isScrolled && !isMenuOpen;
  const activeNavClass = isTransparentHeader ? "!text-accent-gold" : "!text-primary-strong";

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
          tabIndex={variant === "mobile" && !isMenuOpen ? -1 : undefined}
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
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-40 border-b transition-[background,border-color,box-shadow,color] duration-300",
          isTransparentHeader
            ? "border-transparent bg-transparent text-text-inverse"
            : "border-border bg-[var(--header-bg)] text-text shadow-[0_10px_30px_rgba(16,26,22,0.06)]",
        )}
      >
        <div className="mx-auto grid max-w-[var(--page-max)] grid-cols-[minmax(12rem,0.72fr)_minmax(0,1fr)_auto] items-center gap-6 px-6 py-4 max-[900px]:grid-cols-[minmax(0,1fr)_auto] max-[900px]:px-4">
          <Link href="/" className="inline-flex min-h-11 min-w-0 items-center gap-[0.75rem] no-underline">
            <BrandMark size="md" />
            <span className="text-[0.72rem] font-[650] uppercase tracking-[0.24em] max-[520px]:text-[0.68rem]">
              {copy.brand}
            </span>
          </Link>

          <nav
            className="flex min-w-0 items-center justify-center gap-5 text-[0.78rem] font-[600] uppercase tracking-[0.14em] max-[900px]:hidden"
            aria-label={copy.navAria}
          >
            {renderNavLinks("desktop")}
          </nav>

          <div className="flex items-center justify-end gap-3 max-[520px]:gap-2">
            <Link
              href="/dat-truoc"
              className={cx(
                "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] px-4 py-2 text-[0.78rem] font-[650] uppercase tracking-[0.12em] no-underline transition-colors duration-200 max-[520px]:hidden",
                isTransparentHeader
                  ? "border border-[rgba(243,239,229,0.42)] text-text-inverse hover:border-accent-gold hover:text-accent-gold"
                  : "border border-primary bg-primary text-on-primary hover:bg-primary-strong",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {copy.preorder}
            </Link>
            <AmbientSoundButton />
            <button
              className={cx(
                "inline-flex h-11 min-w-16 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-[0.74rem] font-[700] uppercase tracking-[0.12em]",
                isTransparentHeader
                  ? "border-[rgba(243,239,229,0.34)] bg-transparent text-text-inverse"
                  : "border-border-strong bg-transparent text-primary-strong",
              )}
              type="button"
              aria-label={copy.languageToggle}
              onClick={toggleLanguage}
            >
              {language === "vi" ? "VI / EN" : "EN / VI"}
            </button>
            <button
              className={cx(
                "hidden h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border max-[900px]:inline-flex [&_svg]:h-[1.2rem] [&_svg]:w-[1.2rem]",
                isTransparentHeader
                  ? "border-[rgba(243,239,229,0.34)] text-text-inverse"
                  : "border-border-strong text-primary-strong",
              )}
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
            "fixed inset-x-0 top-[4.75rem] hidden max-h-[calc(100svh-4.75rem)] -translate-y-[0.6rem] overflow-y-auto border-t border-border bg-[var(--surface)] p-4 opacity-0 shadow-brand-md transition duration-200 max-[900px]:block",
            isMenuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none",
          )}
          aria-hidden={!isMenuOpen}
          id="mobile-navigation"
        >
          <nav className="grid gap-3" aria-label={copy.mobileNavAria}>
            {renderNavLinks("mobile")}
            <Link
              href="/dat-truoc"
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] border border-primary bg-primary font-[650] !text-on-primary no-underline"
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? undefined : -1}
            >
              {copy.preorder}
            </Link>
          </nav>
        </div>
      </header>

      <div
        className={
          isLanding
            ? cx("relative z-10", styles.landingContentEffects)
            : cx(
                "relative z-10 mx-auto max-w-[var(--page-max)] px-6 pt-[6.75rem] pb-20 max-[900px]:px-4 max-[900px]:pt-[5.8rem] max-[900px]:pb-16",
                styles.contentEffects,
                isProductsPage && "max-w-none p-0 max-[900px]:p-0",
              )
        }
      >
        {children}
      </div>

      <footer className="relative z-10 bg-[var(--footer-bg)] text-text-inverse">
        <div className="mx-auto grid max-w-[var(--page-max)] grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] gap-10 px-6 pt-12 pb-10 max-[900px]:grid-cols-1 max-[900px]:px-4">
          <div className="flex items-start gap-[0.9rem]">
            <BrandMark size="sm" />
            <div>
              <p className="m-0 text-[0.82rem] font-[650] uppercase tracking-[0.24em] text-accent-gold">
                {copy.brand}
              </p>
              <p className="mt-4 mb-0 max-w-[31rem] leading-[1.75] text-text-inverse-muted">
                {copy.summary}
              </p>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-8 max-[560px]:grid-cols-1" aria-label="Footer">
            {activeFooterGroups.map((group) => (
              <div key={group.title} className="grid content-start gap-[0.55rem]">
                <h2 className="m-0 text-[0.74rem] font-[650] uppercase tracking-[0.22em] text-accent-gold">
                  {group.title}
                </h2>
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-text-inverse-muted no-underline hover:text-text-inverse"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <div className="col-span-full flex flex-wrap justify-between gap-x-5 gap-y-3 border-t border-[rgba(243,239,229,0.14)] pt-6 text-[0.82rem] text-text-inverse-soft">
            <span>hello@senova.vn</span>
            <span>© {new Date().getFullYear()} Calmora | Senova</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
