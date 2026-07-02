import { ArrowRight } from "lucide-react";
import { DarkSection } from "../../../components/luxury/DarkSection";
import { ImageReveal } from "../../../components/luxury/ImageReveal";
import { LuxuryButton } from "../../../components/luxury/LuxuryButton";
import { ProductStatement } from "../../../components/luxury/ProductStatement";
import type { LuxuryLandingCopy } from "../../../content/luxuryCopy";

type GiftExperienceProps = {
  content: LuxuryLandingCopy["gift"];
};

export function GiftExperience({ content }: GiftExperienceProps) {
  return (
    <DarkSection className="bg-[var(--surface-dark-soft)]">
      <div className="grid grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)] items-center gap-[clamp(2rem,6vw,5rem)] max-[900px]:grid-cols-1">
        <div>
          <ProductStatement eyebrow={content.eyebrow} title={content.title} text={content.text} dark />
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
        <ImageReveal
          src="/assets/products/gift-set-optimized.jpg"
          alt="Senova Gift Set with tea, Petal Pack and story card"
          className="aspect-[4/3] border-[rgba(243,239,229,0.16)]"
        />
      </div>
    </DarkSection>
  );
}
