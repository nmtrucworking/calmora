import { ArrowRight } from "lucide-react";
import { LuxuryButton } from "@shared/components/luxury/LuxuryButton";
import { SectionEyebrow } from "@shared/components/luxury/SectionEyebrow";
import type { LuxuryLandingCopy } from "@features/content/luxuryCopy";

type LuxuryHeroProps = {
  content: LuxuryLandingCopy["hero"];
};

export function LuxuryHero({ content }: LuxuryHeroProps) {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] overflow-hidden bg-[var(--senova-forest-black)] px-6 pt-28 pb-10 text-text-inverse max-[760px]:px-4 max-[760px]:pt-24"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,26,22,0.92)_0%,rgba(16,26,22,0.72)_42%,rgba(16,26,22,0.18)_100%)]" />
      <img
        src="/assets/products/petal-pack-optimized.jpg"
        alt={content.imageAlt}
        className="absolute inset-y-0 right-0 h-full w-[62%] object-cover object-center opacity-80 saturate-[0.72] max-[900px]:w-full max-[900px]:opacity-42"
        decoding="async"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,26,22,0.26)_0%,rgba(16,26,22,0.04)_42%,rgba(16,26,22,0.72)_100%)]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-9.5rem)] max-w-[var(--page-max)] items-end pb-10">
        <div className="max-w-[44rem]">
          <SectionEyebrow>{content.eyebrow}</SectionEyebrow>
          <h1 className="mt-5 mb-0 font-display text-[clamp(3.5rem,8vw,7rem)] font-[420] leading-[0.98] text-text-inverse">
            {content.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 mb-0 max-w-[34rem] text-[1.05rem] leading-[1.8] text-[rgba(243,239,229,0.78)]">
            {content.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <LuxuryButton href={content.primary.href} variant="dark">
              {content.primary.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </LuxuryButton>
            <LuxuryButton href={content.secondary.href} variant="light">
              {content.secondary.label}
            </LuxuryButton>
          </div>
        </div>

        <p className="absolute right-0 bottom-0 m-0 text-[0.68rem] uppercase tracking-[0.24em] text-[rgba(243,239,229,0.5)] max-[760px]:hidden">
          {content.scrollHint}
        </p>
      </div>
    </section>
  );
}
