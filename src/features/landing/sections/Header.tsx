import { Leaf } from "lucide-react";
import styles from "../SenovaLandingPage.module.css";
import type { LandingNavItem } from "../types";

type HeaderProps = {
  navItems: LandingNavItem[];
};

export function Header({ navItems }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a href="#top" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            <Leaf className={styles.brandIcon} />
          </span>
          <span>
            <span className={styles.brandName}>SENOVA</span>
            <span className={styles.brandTagline}>Sen + Innovation</span>
          </span>
        </a>
        <nav className={styles.nav} aria-label="Landing page">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#cta" className={styles.headerCta}>
          Khám phá sản phẩm
        </a>
      </div>
    </header>
  );
}
