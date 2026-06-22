import type { ReactNode } from "react";
import { BrandMark } from "../branding/BrandMark";
import { brandName, brandTagline, type BrandFooterGroup, type BrandNavItem } from "../../constants/brand";
import styles from "./SiteFrame.module.css";
import { Link } from "../../contexts/RouterContext";

import { AmbientSoundButton } from "../../features/landing/sections/AmbientSoundButton";

type SiteFrameProps = {
  navItems: BrandNavItem[];
  footerGroups: BrandFooterGroup[];
  children: ReactNode;
};

export function SiteFrame({ navItems, footerGroups, children }: SiteFrameProps) {
  const pathname = window.location.pathname;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <BrandMark size="sm" />
            <span>
              <span className={styles.brandName}>{brandName}</span>
              <span className={styles.brandTagline}>{brandTagline}</span>
            </span>
          </Link>
          <nav className={styles.nav} aria-label="Điều hướng chính">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
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

      <div className={styles.content}>{children}</div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <BrandMark size="sm" />
            <div>
              <p className={styles.footerName}>{brandName}</p>
              <p className={styles.footerTagline}>
                Một ngôn ngữ thương hiệu thống nhất cho những trang đang mở rộng dần.
              </p>
            </div>
          </div>
          <nav className={styles.footerNav} aria-label="Điều hướng chân trang">
            {footerGroups.map((group) => (
              <div key={group.title} className={styles.footerGroup}>
                <h2 className={styles.footerGroupTitle}>{group.title}</h2>
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}

