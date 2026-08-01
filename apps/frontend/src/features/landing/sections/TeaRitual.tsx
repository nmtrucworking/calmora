import { EditorialSection } from "@shared/components/luxury/EditorialSection";
import { ImageReveal } from "@shared/components/luxury/ImageReveal";
import { ProductStatement } from "@shared/components/luxury/ProductStatement";
import { RitualStep } from "@shared/components/luxury/RitualStep";
import { StaggerContainer, StaggerItem } from "@shared/components/ui/ZenMotion";
import type { LuxuryLandingCopy } from "@features/content/luxuryCopy";
import { productLuxuryCopy } from "@features/content/luxuryCopy";
import type { Language } from "@app/providers/LanguageContext";

type TeaRitualProps = {
  content: LuxuryLandingCopy["ritual"];
  language: Language;
};

export function TeaRitual({ content, language }: TeaRitualProps) {
  return (
    <EditorialSection className="bg-[var(--surface)]">
      <div className="grid gap-12">
        <ProductStatement eyebrow={content.eyebrow} title={content.title} text={content.text} />
        <StaggerContainer
          className="grid grid-cols-4 gap-6 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1"
          staggerDelay={0.1}
        >
          {content.steps.map((step) => (
            <StaggerItem key={step.number} className="grid gap-5">
              <ImageReveal
                src={step.image ?? productLuxuryCopy[language][step.productId].image}
                alt={`${step.title} - ${productLuxuryCopy[language][step.productId].heroAlt}`}
                className="aspect-[3/4]"
              />
              <RitualStep number={step.number} title={step.title} text={step.text} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </EditorialSection>
  );
}
