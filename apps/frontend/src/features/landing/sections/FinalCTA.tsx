import { ArrowRight } from "lucide-react";
import { DarkSection } from "@shared/components/luxury/DarkSection";
import { LuxuryButton } from "@shared/components/luxury/LuxuryButton";
import { SectionEyebrow } from "@shared/components/luxury/SectionEyebrow";
import type { LuxuryLandingCopy } from "@features/content/luxuryCopy";

type FinalCTAProps = {
  content: LuxuryLandingCopy["finalCta"];
};

export function FinalCTA({ content }: FinalCTAProps) {
  return (
    <DarkSection className="bg-[var(--senova-forest-black)]" innerClassName="py-6">
      <div className="max-w-[46rem]">
        <SectionEyebrow className="text-accent-gold">{content.eyebrow}</SectionEyebrow>
        <h2 className="mt-5 mb-0 font-display text-[clamp(2.1rem,5.4vw,4.4rem)] font-[420] leading-[1.06] text-text-inverse">
          {content.title}
        </h2>
        <p className="mt-6 mb-0 max-w-[34rem] text-[1.04rem] leading-[1.8] text-text-inverse-muted">
          {content.text}
        </p>
        <div className="mt-8 flex flex-wrap gap-5">
          <LuxuryButton href={content.primary.href} variant="dark">
            {content.primary.label}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </LuxuryButton>
          <LuxuryButton href={content.secondary.href} variant="light">
            {content.secondary.label}
          </LuxuryButton>
        </div>
      </div>
    </DarkSection>
  );
}
