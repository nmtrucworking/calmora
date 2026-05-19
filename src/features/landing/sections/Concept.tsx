import { motion } from "framer-motion";
import styles from "../SenovaLandingPage.module.css";
import type { LandingContent } from "../types";

type ConceptProps = {
  content: LandingContent["concept"];
};

export function Concept({ content }: ConceptProps) {
  return (
    <section id="concept" className={styles.section}>
      <div className={styles.conceptGrid}>
        <div className={styles.featurePanel}>
          <p className={styles.sectionEyebrow}>{content.eyebrow}</p>
          <h2 className={styles.sectionTitle}>{content.title}</h2>
          <p className={styles.sectionDescription}>{content.description}</p>
        </div>
        <div className={styles.pillarGrid}>
          {content.pillars.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55 }}
                className={styles.pillarCard}
              >
                <div className={styles.cardIconWrap}>
                  <Icon className={styles.cardIcon} />
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
