import { Leaf } from "lucide-react";
import { AmbientSoundButton } from "./AmbientSoundButton";
import styles from "../SenovaLandingPage.module.css";
import type { LandingNavItem } from "../types";

type HeaderProps = {
  navItems: LandingNavItem[];
  showSound?: boolean;
};

export function Header({ navItems, showSound = false }: HeaderProps) {
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
        <nav className={styles.nav} aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
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
