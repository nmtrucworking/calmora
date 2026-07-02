import { ArrowRight } from "lucide-react";
import { EditorialSection } from "../../../components/luxury/EditorialSection";
import { LuxuryButton } from "../../../components/luxury/LuxuryButton";
import { ProductStatement } from "../../../components/luxury/ProductStatement";
import { productLuxuryCopy, orderedLuxuryProducts, type LuxuryLandingCopy } from "../../../content/luxuryCopy";
import type { Language } from "../../../contexts/LanguageContext";
import { Link } from "../../../contexts/RouterContext";

type CollectionShowcaseProps = {
  content: LuxuryLandingCopy["collection"];
  language: Language;
};

export function CollectionShowcase({ content, language }: CollectionShowcaseProps) {
  return (
    <EditorialSection>
      <div className="grid gap-12">
        <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] gap-10 max-[900px]:grid-cols-1">
          <ProductStatement eyebrow={content.eyebrow} title={content.title} text={content.text} />
          <div className="self-end justify-self-end max-[900px]:justify-self-start">
            <LuxuryButton href="/products" variant="secondary">
              {language === "vi" ? "Xem toàn bộ bộ sưu tập" : "View full collection"}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </LuxuryButton>
          </div>
        </div>

        <div className="grid grid-cols-[1.35fr_0.82fr_0.82fr] gap-5 max-[960px]:grid-cols-1">
          {orderedLuxuryProducts.map((productId) => {
            const product = productLuxuryCopy[language][productId];
            const isSignature = productId === "petal-pack";

            return (
              <Link
                key={productId}
                href={`/products/${productId}`}
                className="group grid min-h-[30rem] overflow-hidden border border-border bg-[var(--surface-paper)] text-text no-underline shadow-[var(--shadow-luxury-sm)]"
              >
                <div className={isSignature ? "aspect-[16/11]" : "aspect-[4/3]"}>
                  <img
                    src={product.image}
                    alt={product.heroAlt}
                    className="h-full w-full object-cover saturate-[0.86] transition duration-[900ms] ease-[var(--ease-luxury)] group-hover:scale-[1.015]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="grid content-between gap-8 p-6">
                  <div>
                    <span className="text-[0.72rem] font-[650] uppercase tracking-[0.22em] text-accent-gold">
                      {product.role}
                    </span>
                    <h3 className="mt-3 mb-0 font-display text-[clamp(1.7rem,3vw,2.8rem)] font-[430] leading-[1.04] text-primary-strong">
                      {product.name}
                    </h3>
                    <p className="mt-4 mb-0 leading-[1.7] text-text-muted">{product.shortDescription}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-[0.86rem] font-[650] text-primary-strong">
                    {product.secondaryAction.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </EditorialSection>
  );
}
