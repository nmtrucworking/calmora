import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "../SenovaLandingPage.module.css";
import type { LandingContent } from "../types";
import { Link } from "../../../contexts/RouterContext";

type CTAProps = {
  content: LandingContent["cta"];
};

export function CTA({ content }: CTAProps) {
  return (
    <section id="cta" className={`${styles.section} ${styles.ctaSection}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className={styles.ctaContent}
      >
        <p className={styles.centerEyebrow}>{content.eyebrow}</p>
        <h2 className={styles.ctaTitle}>{content.title}</h2>
        <p className={styles.ctaDescription}>{content.description}</p>
        <div className={styles.ctaButtonWrap}>
          <Link href={content.href} className={styles.ctaButton}>
            {content.label}
            <ArrowRight className={styles.buttonIcon} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

