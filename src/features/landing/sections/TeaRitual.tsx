import { EditorialSection } from "../../../components/luxury/EditorialSection";
import { ImageReveal } from "../../../components/luxury/ImageReveal";
import { ProductStatement } from "../../../components/luxury/ProductStatement";
import { RitualStep } from "../../../components/luxury/RitualStep";
import type { LuxuryLandingCopy } from "../../../content/luxuryCopy";
import { productLuxuryCopy } from "../../../content/luxuryCopy";
import type { Language } from "../../../contexts/LanguageContext";

type TeaRitualProps = {
  content: LuxuryLandingCopy["ritual"];
  language: Language;
};

export function TeaRitual({ content, language }: TeaRitualProps) {
  return (
    <EditorialSection className="bg-[var(--surface)]">
      <div className="grid gap-12">
        <ProductStatement eyebrow={content.eyebrow} title={content.title} text={content.text} />
        <div className="grid grid-cols-4 gap-6 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1">
          {content.steps.map((step) => (
            <div key={step.number} className="grid gap-5">
              <ImageReveal
                src={productLuxuryCopy[language][step.productId].image}
                alt={productLuxuryCopy[language][step.productId].heroAlt}
                className="aspect-[3/4]"
              />
              <RitualStep number={step.number} title={step.title} text={step.text} />
            </div>
          ))}
        </div>
      </div>
    </EditorialSection>
  );
}
