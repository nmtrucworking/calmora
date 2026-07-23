import { useEffect } from "react";
import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { trackEvent } from "@shared/analytics/analytics";
import { QrFeedbackForm } from "@features/qr/components/QrFeedbackForm";
import type { SenovaProduct } from "@features/products/data/products";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";
import { DEFAULT_QR_CONTENT_VERSION } from "@shared/api/qrExperience";
import { useQrExperience } from "@features/qr/services/useQrExperience";
import { useLanguage, type Language } from "@app/providers/LanguageContext";
import { getLocalizedProduct } from "@features/content/i18n";

type FeedbackPageProps = {
  product?: SenovaProduct;
};

export default function FeedbackPage({ product }: FeedbackPageProps) {
  const { language } = useLanguage();
  const localizedProduct = product ? getLocalizedProduct(product, language) : undefined;
  const copy = language === "vi"
    ? { eyebrow: "Phản hồi", notFound: "Không tìm thấy sản phẩm để phản hồi.", products: "Xem bộ sản phẩm", qr: "Phản hồi trải nghiệm QR", description: "Chia sẻ cảm nhận sau khi mở, pha, thưởng thức hoặc nhận quà để Senova cải tiến phiên bản tiếp theo.", batch: "Lô", data: "Dữ liệu cải tiến", title: "Phản hồi gắn với đúng sản phẩm, nội dung và lô trải nghiệm.", privacy: "Senova chỉ dùng phản hồi để tổng hợp chất lượng trải nghiệm. Email không được đưa vào analytics hành vi.", send: "Gửi phản hồi" }
    : { eyebrow: "Feedback", notFound: "No product was found for this feedback form.", products: "View products", qr: "QR experience feedback", description: "Share what you noticed while opening, brewing, enjoying or receiving the gift to help Senova improve the next edition.", batch: "Batch", data: "Product improvement", title: "Feedback stays connected to the right product, content and experience batch.", privacy: "Senova uses feedback only to assess experience quality. Email addresses are not included in behavioural analytics.", send: "Send feedback" };
  const { search } = useRouter();
  const params = new URLSearchParams(search);
  const batchCode = params.get("batch") ?? "";
  const source = params.get("source") ?? "qr";
  const contentVersion = params.get("version") ?? DEFAULT_QR_CONTENT_VERSION;
  const locale = params.get("locale") === "en" || params.get("locale") === "vi" ? params.get("locale") as Language : language;
  const { content: qrContent } = useQrExperience(product?.slug, { version: contentVersion, batch: batchCode, locale });
  const contentViewed = params.get("content") ?? qrContent?.contentViewed ?? "unknown-feedback";

  useEffect(() => {
    if (!product || !qrContent) return;

    trackEvent({
      eventName: "feedback_start",
      productSlug: product.slug,
      batchCode,
      source,
      contentViewed,
      contentVersion,
    });
  }, [batchCode, contentVersion, contentViewed, product, qrContent, source]);

  if (!product) {
    return (
      <section className={styles.qrPanel}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h1>{copy.notFound}</h1>
        <Link href="/products" className={styles.primaryButton}>
          {copy.products}
        </Link>
      </section>
    );
  }

  return (
    <article className={styles.page}>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <p className={styles.eyebrow}>{copy.qr}</p>
          <h1>{localizedProduct?.name ?? product.name}</h1>
          <p className={styles.heroDescription}>{copy.description}</p>
        </div>
        <aside className={styles.heroAside}>
          <strong>{localizedProduct?.role ?? product.role}</strong>
          <p className={styles.bodyText}>{localizedProduct?.shortDescription ?? product.shortDescription}</p>
          {batchCode ? <span className={styles.statusBadge}>SKU / {copy.batch} {batchCode}</span> : null}
        </aside>
      </section>

      <section className={styles.formLayout}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>{copy.data}</p>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.lead}>{copy.privacy}</p>
        </div>

        <QrFeedbackForm
          product={product}
          skuOrLot={batchCode}
          source={source}
          contentViewed={contentViewed}
          contentVersion={contentVersion}
          title={copy.send}
        />
      </section>
    </article>
  );
}
