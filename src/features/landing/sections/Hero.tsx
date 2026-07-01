import { motion } from "framer-motion";
import type { LandingContent } from "../types";
import { luxuryEase } from "../../../styles/luxuryEffects";

type HeroProps = {
  content: LandingContent["hero"];
};

const eyebrowClass = "m-0 text-[0.8rem] uppercase tracking-[0.24em] text-accent-gold";

export function Hero({ content }: HeroProps) {
  return (
    <section id="top" className="relative z-10 min-h-screen px-6 py-28 pt-36 max-[767px]:px-4 max-[767px]:pt-40">
      <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[82rem] items-center gap-8 min-[900px]:grid-cols-[0.68fr_1.32fr] max-[767px]:min-h-[calc(100vh-10rem)] max-[767px]:items-start">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.18, ease: luxuryEase }}
          className="max-w-[31rem] max-[767px]:max-w-[22rem]"
        >
          <p className={eyebrowClass}>{content.eyebrow}</p>
          <h1 className="mt-[1.1rem] mb-0 max-w-[10ch] font-display text-[clamp(3.6rem,8vw,6.8rem)] font-[650] leading-[0.96] text-text max-[767px]:max-w-[9ch]">
            {content.title}
          </h1>
          <p className="mt-[1.4rem] mb-0 max-w-[28rem] text-[clamp(1rem,2vw,1.16rem)] leading-[1.75] text-text-muted">
            {content.description}
          </p>
        </motion.div>
        <div className="hidden min-[900px]:block min-[900px]:min-h-[34rem]" />
      </div>
      <div className="absolute bottom-[2.2rem] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-center text-[0.7rem] uppercase tracking-[0.24em] text-text-soft">
        {content.scrollHint}
      </div>
    </section>
  );
}
