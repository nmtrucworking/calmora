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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={styles.heroContent}
        >
          <p className={styles.heroEyebrow}>{content.eyebrow}</p>
          <h1 className={styles.heroTitle}>{content.title}</h1>
          <p className={styles.heroDescription}>{content.description}</p>
        </motion.div>
        <div className={styles.heroSpacer} />
      </div>
      <div className={styles.scrollHint}>{content.scrollHint}</div>
    </section>
  );
}
