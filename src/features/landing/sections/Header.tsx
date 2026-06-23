import { useEffect, useState } from "react";
import { BrandMark } from "../../../components/branding/BrandMark";
import { AmbientSoundButton } from "./AmbientSoundButton";
import styles from "../SenovaLandingPage.module.css";
import type { LandingNavItem } from "../types";
import { Link } from "../../../contexts/RouterContext";
import { useRouter } from "../../../contexts/RouterState";

type HeaderProps = {
  navItems: LandingNavItem[];
  showSound?: boolean;
};

export function Header({ navItems, showSound = false }: HeaderProps) {
  const { pathname } = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand}>
          <BrandMark size="sm" />
          <span>
            <span className={styles.brandName}>CALMORA</span>
            <span className={styles.brandTagline}>Sen + Innovation</span>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Điều hướng chính">
          {navItems.map((item) => {
            const isActive =
              (item.href === "#top" || item.href === "/") && (pathname === "/" || pathname === "");
            
            if (item.href.startsWith("#")) {
              return (
                <a key={item.href} href={item.href} className={isActive ? styles.activeNav : ""}>
                  {item.label}
                </a>
              );
            }

            return (
              <Link key={item.href} href={item.href} className={isActive ? styles.activeNav : ""}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className={styles.headerActions}>
          {showSound ? <AmbientSoundButton /> : null}
          <a href="mailto:hello@senova.vn" className={styles.headerCta}>
            Liên hệ
          </a>
        </div>
      </div>
    </header>
  );
}
