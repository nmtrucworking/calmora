import { useEffect } from "react";
import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { getQrExperienceContent } from "@features/content/qrExperience";
import { trackEvent } from "@shared/analytics/analytics";
import { QrFeedbackForm } from "@features/qr/components/QrFeedbackForm";
import type { SenovaProduct } from "@features/products/data/products";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";

type FeedbackPageProps = {
  product?: SenovaProduct;
};

export default function FeedbackPage({ product }: FeedbackPageProps) {
  const { search } = useRouter();
  const params = new URLSearchParams(search);
  const batchCode = params.get("batch") ?? "";
  const source = params.get("source") ?? "qr";
  const qrContent = product ? getQrExperienceContent(product.slug) : undefined;
  const contentViewed = params.get("content") ?? qrContent?.contentViewed ?? "unknown-feedback";
  const contentVersion = params.get("version") ?? qrContent?.version ?? "v1";

  useEffect(() => {
    if (!product) return;

    trackEvent({
      eventName: "feedback_start",
      productSlug: product.slug,
      batchCode,
      source,
      contentViewed,
      contentVersion,
    });
  }, [batchCode, contentVersion, contentViewed, product, source]);

  if (!product) {
    return (
      <section className={styles.qrPanel}>
        <p className={styles.eyebrow}>Phản hồi</p>
        <h1>Không tìm thấy sản phẩm để phản hồi.</h1>
        <Link href="/products" className={styles.primaryButton}>
          Xem bộ sản phẩm
        </Link>
      </section>
    );
  }

  return (
    <article className={styles.page}>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <p className={styles.eyebrow}>Phản hồi trải nghiệm QR</p>
          <h1>{product.name}</h1>
          <p className={styles.heroDescription}>
            Chia sẻ cảm nhận sau khi mở, pha, thưởng thức hoặc nhận quà để Senova cải tiến phiên bản tiếp theo.
          </p>
        </div>
        <aside className={styles.heroAside}>
          <strong>{product.role}</strong>
          <p className={styles.bodyText}>{product.shortDescription}</p>
          {batchCode ? <span className={styles.statusBadge}>SKU / Lô {batchCode}</span> : null}
        </aside>
      </section>

      <section className={styles.formLayout}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Dữ liệu cải tiến</p>
          <h2 className={styles.title}>Phản hồi gắn với đúng sản phẩm, nội dung và lô trải nghiệm.</h2>
          <p className={styles.lead}>
            Senova chỉ dùng phản hồi để tổng hợp chất lượng trải nghiệm. Email không được đưa vào analytics hành vi.
          </p>
        </div>

        <QrFeedbackForm
          product={product}
          skuOrLot={batchCode}
          source={source}
          contentViewed={contentViewed}
          contentVersion={contentVersion}
          title="Gửi phản hồi"
        />
      </section>
    </article>
  );
}
