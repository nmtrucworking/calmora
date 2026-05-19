import { motion } from "framer-motion";
import styles from "../SenovaLandingPage.module.css";
import type { LandingContent } from "../types";

type ExperienceTimelineProps = {
  content: LandingContent["experience"];
};

export function ExperienceTimeline({ content }: ExperienceTimelineProps) {
  return (
    <section id="experience" className={styles.section}>
      <div className={styles.centered}>
        <p className={styles.centerEyebrow}>{content.eyebrow}</p>
        <h2 className={styles.centerTitle}>{content.title}</h2>
        <div className={styles.timelineList}>
          {content.steps.map((step) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={styles.timelineItem}
            >
              <span className={styles.timelineNumber}>{step.number}</span>
              <h3 className={styles.timelineTitle}>{step.title}</h3>
              <p className={styles.timelineText}>{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
