import { EditorialSection } from "../../../components/luxury/EditorialSection";
import { ImageReveal } from "../../../components/luxury/ImageReveal";
import { ProductStatement } from "../../../components/luxury/ProductStatement";
import type { LuxuryLandingCopy } from "../../../content/luxuryCopy";

type SignatureProductProps = {
  content: LuxuryLandingCopy["signature"];
};

export function SignatureProduct({ content }: SignatureProductProps) {
  return (
    <EditorialSection>
      <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] items-center gap-[clamp(2rem,6vw,5rem)] max-[900px]:grid-cols-1">
        <ImageReveal
          src="/assets/products/petal-pack-optimized.jpg"
          alt={content.imageAlt}
          className="aspect-[4/5] max-h-[44rem]"
          imageClassName="object-center"
          loading="eager"
        />
        <div>
          <ProductStatement eyebrow={content.eyebrow} title={content.title} text={content.text} />
          <div className="mt-8 grid gap-3">
            {content.steps.map((step, index) => (
              <div
                key={step}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center border-t border-border py-3"
              >
                <span className="font-display text-[1.35rem] text-accent-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[1rem] text-text-muted">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EditorialSection>
  );
}
