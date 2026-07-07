import { DarkSection } from "@shared/components/luxury/DarkSection";
import { ProductStatement } from "@shared/components/luxury/ProductStatement";
import { StaggerContainer, StaggerItem } from "@shared/components/ui/ZenMotion";
import type { LuxuryLandingCopy } from "@features/content/luxuryCopy";

type CulturalMaterialProps = {
  content: LuxuryLandingCopy["culture"];
};

export function CulturalMaterial({ content }: CulturalMaterialProps) {
  return (
    <DarkSection>
      <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] gap-[clamp(2rem,6vw,5rem)] max-[900px]:grid-cols-1">
        <ProductStatement eyebrow={content.eyebrow} title={content.title} text={content.text} dark />
        <StaggerContainer className="grid gap-5" staggerDelay={0.1}>
          {content.points.map((point) => (
            <StaggerItem key={point.title} className="border-t border-[rgba(243,239,229,0.16)] py-6">
              <h3 className="m-0 font-display text-[clamp(1.35rem,2.8vw,2rem)] font-[430] text-text-inverse">
                {point.title}
              </h3>
              <p className="mt-3 mb-0 leading-[1.75] text-text-inverse-muted">{point.text}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </DarkSection>
  );
}
