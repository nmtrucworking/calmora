import styles from "../SenovaLandingPage.module.css";
import type { LandingContent } from "../types";

type ImpactProps = {
  content: LandingContent["impact"];
};

export function Impact({ content }: ImpactProps) {
  return (
    <section id="impact" className={styles.section}>
      <div className={styles.impactPanel}>
        <div className={styles.impactGrid}>
          <div>
            <p className={styles.sectionEyebrow}>{content.eyebrow}</p>
            <h2 className={styles.sectionTitle}>{content.title}</h2>
          </div>
          <p className={styles.impactDescription}>{content.description}</p>
        </div>
        <div className={styles.impactCards}>
          {content.cards.map((card) => (
            <div key={card.number} className={styles.impactCard}>
              <p className={styles.impactNumber}>{card.number}</p>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardText}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
