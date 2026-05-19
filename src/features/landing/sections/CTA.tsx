import { ArrowRight } from "lucide-react";
import styles from "../SenovaLandingPage.module.css";
import type { LandingContent } from "../types";

type CTAProps = {
  content: LandingContent["cta"];
};

export function CTA({ content }: CTAProps) {
  return (
    <section id="cta" className={`${styles.section} ${styles.ctaSection}`}>
      <div className={styles.ctaContent}>
        <p className={styles.centerEyebrow}>{content.eyebrow}</p>
        <h2 className={styles.ctaTitle}>{content.title}</h2>
        <p className={styles.ctaDescription}>{content.description}</p>
        <div className={styles.ctaButtonWrap}>
          <a href={content.href} className={styles.ctaButton}>
            {content.label}
            <ArrowRight className={styles.buttonIcon} />
          </a>
        </div>
      </div>
    </section>
  );
}
