import { BrandMark } from "../../../components/branding/BrandMark";
import styles from "../SenovaLandingPage.module.css";
import type { LandingContent } from "../types";
import { Link } from "../../../contexts/RouterContext";

type FooterProps = {
  content: LandingContent["footer"];
};

export function Footer({ content }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <BrandMark size="sm" />
          <div>
            <p className={styles.footerName}>CALMORA</p>
            <p className={styles.footerTagline}>{content.tagline}</p>
          </div>
        </div>
        <nav className={styles.footerNav} aria-label="Điều hướng chân trang">
          {content.groups.map((group) => (
            <div key={group.title} className={styles.footerGroup}>
              <h2 className={styles.footerGroupTitle}>{group.title}</h2>
              {group.links.map((link) => {
                const isMailto = link.href.startsWith("mailto:");
                if (isMailto) {
                  return (
                    <a key={link.href} href={link.href}>
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}

