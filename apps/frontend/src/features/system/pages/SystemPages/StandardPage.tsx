import { ArrowRight } from "lucide-react";
import { Link } from "@app/router/RouterContext";
import type { StandardPageContent } from "@features/content/sitePages";
import { products } from "@features/products/data/products";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";
import { getImageAssetByPath } from "@features/content/imageManifest";
import { ResponsiveImage } from "@shared/components/media/ResponsiveImage";
import { LuxuryEditorialPage } from "@shared/components/editorial/LuxuryEditorialPage";
import { useLanguage } from "@app/providers/LanguageContext";
import { getLocalizedProducts } from "@features/content/i18n";

type StandardPageProps = {
  content: StandardPageContent;
  showProducts?: boolean;
};

export default function StandardPage({ content, showProducts = false }: StandardPageProps) {
  const { language } = useLanguage();
  const localizedProducts = getLocalizedProducts(products, language);
  const ui = language === "vi"
    ? {
        motif: "Giữ - Mở - Trao",
        motifTitle: "Một mạch kể chung cho toàn bộ hệ Senova.",
        motifText: "Các trang nội dung cùng quay về sản phẩm, nghi thức, QR và phản hồi sau trải nghiệm.",
        mainContent: "Nội dung chính",
        relatedProducts: "Sản phẩm liên quan",
        draft: "Đang hoàn thiện",
        continue: "Tiếp tục",
      }
    : {
        motif: "Keep - Open - Share",
        motifTitle: "One narrative across the Senova collection.",
        motifText: "Every page returns to the products, rituals, QR stories and post-experience feedback.",
        mainContent: "Main content",
        relatedProducts: "Related products",
        draft: "In development",
        continue: "Continue",
      };
  if (content.path === "/ritual" && content.cta) {
    return (
      <LuxuryEditorialPage
        variant="ritual"
        blocks={content.blocks}
        description={content.description}
        eyebrow={content.eyebrow}
        title={content.title}
        primaryAction={content.cta.primary}
        secondaryAction={content.cta.secondary}
      />
    );
  }

  return (
    <article className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className={styles.heroDescription}>{content.description}</p>
          {content.cta ? (
            <div className={styles.actions}>
              <Link href={content.cta.primary.href} className={styles.primaryButton}>
                {content.cta.primary.label}
                <ArrowRight aria-hidden="true" />
              </Link>
              {content.cta.secondary ? (
                <Link href={content.cta.secondary.href} className={styles.secondaryButton}>
                  {content.cta.secondary.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
        <aside className={styles.heroAside}>
          <p className={styles.eyebrow}>{ui.motif}</p>
          <strong>{ui.motifTitle}</strong>
          <p className={styles.bodyText}>{ui.motifText}</p>
        </aside>
      </section>

      <section className={styles.stepGrid} aria-label={ui.mainContent}>
        {content.blocks.map((block) => (
          <article className={styles.panel} key={`${block.label ?? ""}-${block.title}`}>
            {block.label ? <span className={styles.panelLabel}>{block.label}</span> : null}
            <h2>{block.title}</h2>
            <p>{block.text}</p>
          </article>
        ))}
      </section>

      {showProducts ? (
        <section className={styles.productStrip} aria-label={ui.relatedProducts}>
          {localizedProducts.map((product) => (
            <Link href={product.href} className={styles.productCard} key={product.slug}>
              <div className={styles.productImage}>
                {getImageAssetByPath(product.image) ? (
                  <ResponsiveImage
                    asset={getImageAssetByPath(product.image)!}
                    alt={product.heroAlt}
                    sizes="(max-width: 760px) 100vw, 33vw"
                  />
                ) : null}
              </div>
              <div className={styles.productBody}>
                <span className={styles.panelLabel}>{product.role}</span>
                <h3>{product.name}</h3>
                <p className={styles.bodyText}>{product.shortDescription}</p>
                {product.status === "draft" ? (
                  <span className={styles.statusBadge}>{ui.draft}</span>
                ) : null}
              </div>
            </Link>
          ))}
        </section>
      ) : null}

      {content.cta ? (
        <section className={styles.panel}>
          <p className={styles.eyebrow}>{ui.continue}</p>
          <h2>{content.cta.title}</h2>
          <p>{content.cta.text}</p>
          <div className={styles.actions}>
            <Link href={content.cta.primary.href} className={styles.primaryButton}>
              {content.cta.primary.label}
            </Link>
            {content.cta.secondary ? (
              <Link href={content.cta.secondary.href} className={styles.secondaryButton}>
                {content.cta.secondary.label}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </article>
  );
}
