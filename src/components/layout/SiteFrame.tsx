import type { ReactNode } from "react";
import { BrandMark } from "../branding/BrandMark";
import { brandName, brandTagline, type BrandFooterGroup, type BrandNavItem } from "../../constants/brand";
import styles from "./SiteFrame.module.css";

type SiteFrameProps = {
  navItems: BrandNavItem[];
  footerGroups: BrandFooterGroup[];
  children: ReactNode;
};

export function SiteFrame({ navItems, footerGroups, children }: SiteFrameProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="/" className={styles.brand}>
            <BrandMark />
            <span>
              <span className={styles.brandName}>{brandName}</span>
              <span className={styles.brandTagline}>{brandTagline}</span>
            </span>
          </a>
          <nav className={styles.nav} aria-label="Điều hướng chính">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a href="mailto:hello@senova.vn" className={styles.headerCta}>
            Liên hệ
          </a>
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
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}
