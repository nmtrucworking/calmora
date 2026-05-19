import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import styles from "../SenovaLandingPage.module.css";
import type { LandingContent } from "../types";

type HeroProps = {
  content: LandingContent["hero"];
};

export function Hero({ content }: HeroProps) {
  return (
    <section id="top" className={`${styles.section} ${styles.hero}`}>
      <div className={styles.heroGrid}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroContent}
        >
          <div className={styles.eyebrowPill}>
            <Sparkles className={styles.eyebrowIcon} />
            {content.eyebrow}
          </div>
          <h1 className={styles.heroTitle}>{content.title}</h1>
          <p className={styles.heroDescription}>{content.description}</p>
          <div className={styles.buttonRow}>
            <a href={content.primaryHref} className={styles.buttonPrimary}>
              {content.primaryCta}
              <ArrowRight className={styles.buttonIcon} />
            </a>
            <a href={content.secondaryHref} className={styles.buttonSecondary}>
              {content.secondaryCta}
            </a>
          </div>
        </motion.div>
        <div className={styles.heroSpacer} />
      </div>
      <div className={styles.scrollHint}>{content.scrollHint}</div>
    </section>
  );
}
