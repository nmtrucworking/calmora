import { ArrowRight } from "lucide-react";
import { Link } from "../../contexts/RouterContext";
import type { StandardPageContent } from "../../content/sitePages";
import { products } from "../../features/products/data/products";
import styles from "./SystemPages.module.css";

type StandardPageProps = {
  content: StandardPageContent;
  showProducts?: boolean;
};

export default function StandardPage({ content, showProducts = false }: StandardPageProps) {
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
          <p className={styles.eyebrow}>Giữ - Mở - Trao</p>
          <strong>Một mạch kể chung cho toàn bộ hệ Senova.</strong>
          <p className={styles.bodyText}>
            Các trang nội dung cùng quay về sản phẩm, nghi thức, QR và phản hồi sau trải nghiệm.
          </p>
        </aside>
      </section>

      <section className={styles.stepGrid} aria-label="Nội dung chính">
        {content.blocks.map((block) => (
          <article className={styles.panel} key={`${block.label ?? ""}-${block.title}`}>
            {block.label ? <span className={styles.panelLabel}>{block.label}</span> : null}
            <h2>{block.title}</h2>
            <p>{block.text}</p>
          </article>
        ))}
      </section>

      {showProducts ? (
        <section className={styles.productStrip} aria-label="Sản phẩm liên quan">
          {products.map((product) => (
            <Link href={product.href} className={styles.productCard} key={product.slug}>
              <div className={styles.productImage}>
                <img src={product.image} alt={product.heroAlt} loading="lazy" />
              </div>
              <div className={styles.productBody}>
                <span className={styles.panelLabel}>{product.role}</span>
                <h3>{product.name}</h3>
                <p className={styles.bodyText}>{product.shortDescription}</p>
                {product.status === "draft" ? (
                  <span className={styles.statusBadge}>Đang hoàn thiện</span>
                ) : null}
              </div>
            </Link>
          ))}
        </section>
      ) : null}

      {content.cta ? (
        <section className={styles.panel}>
          <p className={styles.eyebrow}>Tiếp tục</p>
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
