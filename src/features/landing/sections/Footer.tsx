import { Leaf } from "lucide-react";
import styles from "../SenovaLandingPage.module.css";
import type { LandingContent } from "../types";

type FooterProps = {
  content: LandingContent["footer"];
};

export function Footer({ content }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <span className={styles.footerMark} aria-hidden="true">
            <Leaf className={styles.brandIcon} />
          </span>
          <div>
            <p className={styles.footerName}>SENOVA</p>
            <p className={styles.footerTagline}>{content.tagline}</p>
          </div>
        </div>
        <nav className={styles.footerNav} aria-label="Điều hướng chân trang">
          {content.groups.map((group) => (
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
  );
}
