import { motion } from "framer-motion";
import { luxuryEase } from "../../../styles/luxuryEffects";
import { cx } from "../../../utils/classNames";
import type { LandingChapter } from "../types";

type ChaptersProps = {
  chapters: LandingChapter[];
};

const chapterClass =
  "flex min-h-[96vh] items-center px-6 py-24 max-[767px]:min-h-[92vh] max-[767px]:items-end max-[767px]:px-4 max-[767px]:pb-[5.5rem]";
const chapterTextBaseClass = "w-[min(19rem,calc(100vw-2rem))] max-w-[19rem] max-[767px]:mr-0 max-[767px]:ml-0";
const chapterTextLeftClass = "mr-auto ml-[max(1rem,calc((100vw-82rem)/2+1.5rem))]";
const chapterTextRightClass = "mr-[max(1rem,calc((100vw-82rem)/2+1.5rem))] ml-auto";
const eyebrowClass = "m-0 text-[0.8rem] uppercase tracking-[0.24em] text-accent-gold";

export function Chapters({ chapters }: ChaptersProps) {
  return (
    <section className="relative z-10" aria-label="Vòng đời hoa sen">
      {chapters.map((chapter, index) => {
        const isRight = index % 2 === 1;

        return (
          <article
            key={chapter.id}
            id={chapter.id}
            className={cx(chapterClass, isRight && "justify-end max-[767px]:justify-start")}
          >
            <motion.div
              initial={{ opacity: 0, y: 14, filter: "blur(3px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.45 }}
              transition={{ duration: 1.18, ease: luxuryEase }}
              className={cx(chapterTextBaseClass, isRight ? chapterTextRightClass : chapterTextLeftClass)}
            >
              <p className={eyebrowClass}>{chapter.eyebrow}</p>
              <h2 className="mt-[0.9rem] mb-0 font-display text-[clamp(2.2rem,5vw,4.6rem)] font-[650] leading-[0.98] text-text">
                {chapter.title}
              </h2>
              <p className="mt-4 mb-0 text-[0.98rem] leading-[1.7] text-text-muted">{chapter.text}</p>
            </motion.div>
          </article>
        );
      })}
    </section>
  );
}
