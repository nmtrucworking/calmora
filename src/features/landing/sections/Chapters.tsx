import { motion } from "framer-motion";
import styles from "../SenovaLandingPage.module.css";
import type { LandingChapter } from "../types";

type ChaptersProps = {
  chapters: LandingChapter[];
};

export function Chapters({ chapters }: ChaptersProps) {
  return (
    <section className={styles.chapterTrack} aria-label="Vòng đời hoa sen">
      {chapters.map((chapter, index) => (
        <article
          key={chapter.id}
          id={chapter.id}
          className={`${styles.chapter} ${index % 2 === 1 ? styles.chapterRight : ""}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.45 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className={styles.chapterText}
          >
            <p className={styles.chapterEyebrow}>{chapter.eyebrow}</p>
            <h2 className={styles.chapterTitle}>{chapter.title}</h2>
            <p className={styles.chapterCopy}>{chapter.text}</p>
          </motion.div>
        </article>
      ))}
    </section>
  );
}
