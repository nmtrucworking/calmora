import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Globe2, Mail, MapPin, Menu, X } from "lucide-react";
import { BrandLockup } from "@shared/components/branding/BrandLockup";
import type { BrandFooterGroup, BrandNavItem } from "@features/content/brand";
import { luxuryLayoutCopy } from "@features/content/luxuryCopy";
import { useLanguage } from "@app/providers/LanguageContext";
import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { cx } from "@shared/utils/classNames";
import styles from "./SiteLayout.module.css";

type SiteLayoutProps = {
  children: ReactNode;
  footerGroups?: BrandFooterGroup[];
  hasDarkHero?: boolean;
  isFullBleedContent?: boolean;
  isImmersive?: boolean;
  isLanding?: boolean;
  navItems?: BrandNavItem[];
};

const desktopNavLinkClass =
  "relative inline-flex h-9 flex-none items-center px-2 text-text-muted no-underline transition-colors duration-200 after:absolute after:inset-x-2 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:text-primary-strong hover:after:scale-x-100";
const mobileNavLinkClass =
  "min-h-11 border-l-2 border-l-transparent border-b border-border py-3 pl-3 text-[1.02rem] font-[650] text-text-muted no-underline transition-colors duration-200";

export function SiteLayout({
  children,
  footerGroups,
  hasDarkHero = false,
  isFullBleedContent = false,
  isImmersive = false,
  isLanding = false,
  navItems,
}: SiteLayoutProps) {
  const { pathname } = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const copy = luxuryLayoutCopy[language];
  const activeNavItems = navItems ?? copy.navigation;
  const activeFooterGroups = footerGroups ?? copy.footerGroups;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isLanding && (!window.location.hash || window.location.hash === "#top")) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [isLanding]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    if (!isMenuOpen) return () => {
      document.body.style.overflow = "";
    };

    const drawer = mobileNavigationRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparentHeader = (isLanding || isImmersive || hasDarkHero) && !isScrolled && !isMenuOpen;
  const desktopActiveNavClass = isTransparentHeader
    ? "!text-accent-gold after:!scale-x-100"
    : "!text-primary-strong after:!scale-x-100";
  const mobileActiveNavClass = "!border-l-accent-strong !text-primary-strong";
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
            isActive && (variant === "desktop" ? desktopActiveNavClass : mobileActiveNavClass),
          )}
          onClick={() => setIsMenuOpen(false)}
          tabIndex={variant === "mobile" && !isMenuOpen ? -1 : undefined}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <div
      className={cx(
        styles.page,
        (isLanding || isImmersive) && styles.landingPage,
        "relative min-h-screen overflow-x-clip text-text isolate",
      )}
    >
      <a className="skip-link" href="#main-content">
        {language === "vi" ? "Bỏ qua đến nội dung chính" : "Skip to main content"}
      </a>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-40 border-b transition-[background,border-color,box-shadow,color] duration-300",
          isTransparentHeader
            ? "border-transparent bg-transparent text-text-inverse"
            : "border-border bg-[var(--header-bg)] text-text shadow-[0_10px_30px_rgba(16,26,22,0.06)]",
        )}
      >
        <div
          className={cx(
            "mx-auto grid max-w-[var(--page-max)] items-center gap-4 px-6 py-2.5 max-[900px]:grid-cols-[minmax(0,1fr)_auto] max-[900px]:px-4",
            isImmersive
              ? "grid-cols-[minmax(10rem,1fr)_auto]"
              : "grid-cols-[minmax(10rem,0.62fr)_minmax(0,1.32fr)_auto]",
          )}
        >
          <Link href="/" className="inline-flex min-h-11 min-w-0 items-center no-underline" aria-label="Senova by Calmora">
            <BrandLockup inverse={isTransparentHeader} />
          </Link>

          {!isImmersive ? <nav
            className={cx(
              "flex min-w-0 items-center justify-center gap-4 border-y px-2 py-1 text-[0.73rem] font-[620] uppercase tracking-[0.13em] max-[900px]:hidden",
              isTransparentHeader
                ? "border-[rgba(243,239,229,0.18)]"
                : "border-[rgba(31,95,68,0.16)] bg-[rgba(255,253,248,0.38)]",
            )}
            aria-label={copy.navAria}
          >
            {renderNavLinks("desktop")}
          </nav> : null}

          <div className="flex items-center justify-end gap-2 max-[520px]:gap-2">
            {!isImmersive ? <Link
              href="/order-request"
              className={cx(
                "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap border px-3 text-[0.72rem] font-[650] uppercase tracking-[0.12em] no-underline transition-colors duration-200 max-[1120px]:hidden",
                isTransparentHeader
                  ? "border-accent-gold bg-accent-gold text-[var(--senova-forest-black)] shadow-brand-sm hover:border-[var(--senova-gold-400)] hover:bg-[var(--senova-gold-400)]"
                  : "border-primary bg-primary text-on-primary hover:bg-primary-strong",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {copy.preorder}
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link> : null}
            <button
              className={cx(
                "inline-flex h-9 items-center justify-center gap-1.5 border px-2.5 text-[0.7rem] font-[700] uppercase tracking-[0.1em]",
                isTransparentHeader
                  ? "border-[rgba(243,239,229,0.3)] bg-[rgba(255,250,240,0.04)] text-text-inverse hover:border-accent-gold hover:text-accent-gold"
                  : "border-border bg-transparent text-primary-strong hover:border-border-strong",
              )}
              type="button"
              aria-label={copy.languageToggle}
              onClick={toggleLanguage}
            >
              <Globe2 aria-hidden="true" className="h-3.5 w-3.5" />
              {language === "vi" ? "VI" : "EN"}
            </button>
            <button
              ref={menuButtonRef}
              className={cx(
                "hidden h-9 w-9 items-center justify-center border max-[900px]:inline-flex [&_svg]:h-[1.1rem] [&_svg]:w-[1.1rem]",
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
          ref={mobileNavigationRef}
          className={cx(
            "fixed inset-x-0 top-[4rem] hidden max-h-[calc(100svh-4rem)] -translate-y-[0.6rem] overflow-y-auto border-t border-border bg-[var(--surface-strong)] p-4 opacity-0 shadow-brand-md transition duration-200 max-[900px]:block",
            isMenuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none",
          )}
          aria-hidden={!isMenuOpen}
          id="mobile-navigation"
        >
          <nav className="grid gap-3" aria-label={copy.mobileNavAria}>
            {renderNavLinks("mobile")}
            <Link
              href="/order-request"
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] border border-primary bg-primary font-[650] !text-on-primary no-underline"
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? undefined : -1}
            >
              {copy.preorder}
            </Link>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className={
          isLanding
            ? cx("relative z-10", styles.landingContentEffects)
            : isFullBleedContent
              ? cx("relative z-10", styles.contentEffects)
            : cx(
                "relative z-10 mx-auto max-w-[var(--page-max)] px-6 pt-[5.8rem] pb-[4.5rem] max-[900px]:px-4 max-[900px]:pt-[5rem] max-[900px]:pb-14",
                styles.contentEffects,
              )
        }
      >
        {children}
      </main>

      {!isImmersive ? <footer className="relative z-10 overflow-hidden bg-[var(--footer-bg)] text-text-inverse">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(248,223,147,0.7),transparent)]" />
        <div className="mx-auto grid max-w-[var(--page-max)] grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-x-12 gap-y-10 px-6 pt-14 pb-10 max-[900px]:grid-cols-1 max-[900px]:px-4">
          <div className="grid gap-8">
            <div>
              <BrandLockup size="md" inverse />
              <p className="mt-5 mb-0 max-w-[34rem] leading-[1.78] text-text-inverse-muted">
                {copy.summary}
              </p>
              <p className="mt-3 mb-0 max-w-[34rem] text-[0.9rem] leading-[1.7] text-text-inverse-soft">
                {language === "vi"
                  ? "Senova là dự án trà văn hóa do Calmora phát triển."
                  : "Senova is a cultural tea project developed by Calmora."}
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

          <div className="col-span-full grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3 border-t border-[rgba(243,239,229,0.14)] pt-6 text-[0.82rem] text-text-inverse-soft max-[760px]:grid-cols-1">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-2">
                <Mail aria-hidden="true" className="h-3.5 w-3.5" />
                senova.calmora@gmail.com
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail aria-hidden="true" className="h-3.5 w-3.5" />
                nmtruc.work@gmail.com
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                Ho Chi Minh, Vietnam
              </span>
            </div>
            <span>© {new Date().getFullYear()} Senova by Calmora</span>
          </div>
        </div>
      </footer> : null}
    </div>
  );
}
