import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { LuxuryButton } from "@shared/components/luxury/LuxuryButton";
import { SectionEyebrow } from "@shared/components/luxury/SectionEyebrow";
import { heroImageVariants, revealVariants, staggerVariants } from "@shared/motion/animationSystem";
import type { LuxuryLandingCopy } from "@features/content/luxuryCopy";

type LuxuryHeroProps = {
  content: LuxuryLandingCopy["hero"];
};

export function LuxuryHero({ content }: LuxuryHeroProps) {
  return (
    <motion.section
      id="top"
      initial="hidden"
      animate="visible"
      variants={staggerVariants(0.14, 0.12)}
      className="relative min-h-[100svh] overflow-hidden bg-[var(--senova-forest-black)] px-6 pt-24 pb-9 text-text-inverse max-[760px]:px-4 max-[760px]:pt-20"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,26,22,0.92)_0%,rgba(16,26,22,0.72)_42%,rgba(16,26,22,0.18)_100%)]" />
      <motion.img
        src="/assets/products/petal-pack-optimized.jpg"
        alt={content.imageAlt}
        variants={heroImageVariants}
        className="absolute inset-y-0 right-0 h-full w-[62%] [--hero-image-opacity:0.8] object-cover object-center saturate-[0.72] max-[900px]:w-full max-[900px]:[--hero-image-opacity:0.42]"
        decoding="async"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,26,22,0.26)_0%,rgba(16,26,22,0.04)_42%,rgba(16,26,22,0.72)_100%)]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-8.6rem)] max-w-[var(--page-max)] items-end pb-9">
        <div className="max-w-[44rem]">
          <motion.div variants={revealVariants}>
            <SectionEyebrow className="text-accent-gold">{content.eyebrow}</SectionEyebrow>
          </motion.div>
          <motion.h1
            variants={revealVariants}
            className="mt-5 mb-0 font-display text-[clamp(2.7rem,6vw,4.9rem)] font-[420] leading-[1.02] text-text-inverse"
          >
            {content.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h1>
          <motion.p
            variants={revealVariants}
            className="mt-6 mb-0 max-w-[34rem] text-[1.05rem] leading-[1.8] text-text-inverse-muted"
          >
            {content.description}
          </motion.p>
          <motion.div variants={revealVariants} className="mt-8 flex flex-wrap items-center gap-5">
            <LuxuryButton href={content.primary.href} variant="dark">
              {content.primary.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </LuxuryButton>
            <LuxuryButton href={content.secondary.href} variant="light">
              {content.secondary.label}
            </LuxuryButton>
          </motion.div>
        </div>

        <motion.p
          variants={revealVariants}
          className="absolute right-0 bottom-0 m-0 text-[0.68rem] uppercase tracking-[0.24em] text-text-inverse-soft max-[760px]:hidden"
        >
          {content.scrollHint}
        </motion.p>
      </div>
    </motion.section>
  );
}
