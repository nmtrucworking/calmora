import { ArrowRight } from "lucide-react";
import { EditorialSection } from "@shared/components/luxury/EditorialSection";
import { LuxuryButton } from "@shared/components/luxury/LuxuryButton";
import { ProductStatement } from "@shared/components/luxury/ProductStatement";
import { StaggerContainer, StaggerItem } from "@shared/components/ui/ZenMotion";
import { productLuxuryCopy, orderedLuxuryProducts, type LuxuryLandingCopy } from "@features/content/luxuryCopy";
import type { Language } from "@app/providers/LanguageContext";
import { Link } from "@app/router/RouterContext";
import { getImageAssetByPath } from "@features/content/imageManifest";
import { ResponsiveImage } from "@shared/components/media/ResponsiveImage";
import { ImageStatusLabel } from "@shared/components/media/ImageStatusLabel";

type CollectionShowcaseProps = {
  content: LuxuryLandingCopy["collection"];
  language: Language;
};

export function CollectionShowcase({ content, language }: CollectionShowcaseProps) {
  return (
    <EditorialSection className="bg-[var(--page-bg)]">
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

        <StaggerContainer
          className="grid grid-cols-[1.35fr_0.82fr_0.82fr] gap-5 max-[960px]:grid-cols-1"
          staggerDelay={0.12}
        >
          {orderedLuxuryProducts.map((productId) => {
            const product = productLuxuryCopy[language][productId];
            const isSignature = productId === "petal-pack";
            const asset = getImageAssetByPath(product.image);

            return (
              <StaggerItem key={productId}>
                <Link
                  href={`/products/${productId}`}
                  className="group grid min-h-[30rem] overflow-hidden border border-border bg-[var(--surface-paper)] text-text no-underline shadow-[var(--shadow-luxury-sm)] transition-[border-color,box-shadow,transform] duration-[700ms] ease-[var(--ease-luxury)] hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-luxury-md)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className={`relative overflow-hidden ${isSignature ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
                    {asset ? (
                      <ResponsiveImage
                        asset={asset}
                        alt={product.heroAlt}
                        className="h-full w-full object-cover saturate-[0.86] transition duration-[var(--motion-slow)] ease-[var(--ease-luxury)] group-hover:scale-[1.012] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        sizes="(max-width: 960px) 100vw, 34vw"
                      />
                    ) : null}
                    {asset ? <ImageStatusLabel asset={asset} language={language} /> : null}
                  </div>
                  <div className="grid content-between gap-8 p-6">
                    <div>
                      <span className="text-[0.72rem] font-[650] uppercase tracking-[0.22em] text-accent-strong">
                        {product.role}
                      </span>
                      <h3 className="mt-3 mb-0 font-display text-[clamp(1.7rem,3vw,2.8rem)] font-[430] leading-[1.04] text-primary-strong">
                        {product.name}
                      </h3>
                      <p className="mt-4 mb-0 leading-[1.7] text-text-muted">{product.shortDescription}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[0.86rem] font-[650] text-primary-strong transition-[gap] duration-300 ease-[var(--ease-luxury)] group-hover:gap-3 motion-reduce:transition-none">
                      {product.secondaryAction.label}
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </EditorialSection>
  );
}
