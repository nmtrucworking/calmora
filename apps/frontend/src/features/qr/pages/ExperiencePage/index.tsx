import { useEffect } from "react";
import { ArrowRight, Check, MessageSquare, Quote } from "lucide-react";
import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { trackEvent } from "@shared/analytics/analytics";
import { QrFeedbackForm } from "@features/qr/components/QrFeedbackForm";
import type { SenovaProduct } from "@features/products/data/products";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";
import { DEFAULT_QR_CONTENT_VERSION } from "@shared/api/qrExperience";
import { useQrExperience } from "@features/qr/services/useQrExperience";

type ExperiencePageProps = {
  product?: SenovaProduct;
};

export default function ExperiencePage({ product }: ExperiencePageProps) {
  const { search } = useRouter();
  const params = new URLSearchParams(search);
  const batchCode = params.get("batch") ?? "";
  const source = params.get("source") ?? "qr";
  const contentVersion = params.get("version") ?? DEFAULT_QR_CONTENT_VERSION;
  const locale = params.get("locale") === "en" ? "en" : "vi";
  const { content: qrContent, error, isLoading, retry } = useQrExperience(product?.slug, {
    version: contentVersion,
    batch: batchCode,
    locale,
  });
  const contentViewed = params.get("content") ?? qrContent?.contentViewed ?? "unknown-scan";

  useEffect(() => {
    if (!product || !qrContent) return;

    trackEvent({
      eventName: "experience_start",
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
        <p className={styles.eyebrow}>Trải nghiệm</p>
        <h1>Không tìm thấy trải nghiệm sản phẩm.</h1>
        <p className={styles.bodyText}>Đường dẫn trải nghiệm chưa khớp với sản phẩm Senova.</p>
        <Link href="/products" className={styles.primaryButton}>
          Xem bộ sản phẩm
        </Link>
      </section>
    );
  }

  if (isLoading) {
    return <section className={styles.qrPanel}><p className={styles.eyebrow}>Trải nghiệm</p><h1>Đang tải nội dung…</h1></section>;
  }

  if (error || !qrContent) {
    return (
      <section className={styles.qrPanel}>
        <p className={styles.eyebrow}>Trải nghiệm</p>
        <h1>Chưa thể tải nội dung QR.</h1>
        <p className={styles.bodyText}>{error?.message ?? "Nội dung hiện không khả dụng."}</p>
        <button type="button" className={styles.primaryButton} onClick={retry}>Thử lại</button>
      </section>
    );
  }

  const activeQrContent = qrContent;
  const guidance = activeQrContent.guidance;

  return (
    <article className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{activeQrContent.eyebrow}</p>
          <h1>{activeQrContent.title}</h1>
          <p className={styles.heroDescription}>{activeQrContent.lede}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {batchCode ? <span className={styles.statusBadge}>SKU / Lô {batchCode}</span> : null}
            <span className={styles.statusBadge}>Nguồn {source}</span>
            <span className={styles.statusBadge}>Nội dung {contentVersion}</span>
          </div>
          <div className={styles.actions}>
            <a href="#qr-feedback-form" className={styles.primaryButton}>
              Gửi phản hồi
              <MessageSquare aria-hidden="true" />
            </a>
            <a href="#brew-guidance" className={styles.secondaryButton}>
              Xem hướng dẫn
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <aside className={styles.heroAside}>
          <img src={product.image} alt={product.heroAlt} loading="eager" style={{ width: "100%" }} />
          {product.status === "draft" ? <span className={styles.statusBadge}>Phiên bản đang hoàn thiện</span> : null}
        </aside>
      </section>

      <section className={styles.formLayout}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Câu chuyện văn hóa</p>
          <h2 className={styles.title}>{activeQrContent.story.title}</h2>
        </div>
        <article className={styles.panel}>
          <Quote aria-hidden="true" className="text-accent" />
          {activeQrContent.story.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            <strong className="text-text">{activeQrContent.reflectionPrompt}</strong>
          </p>
        </article>
      </section>

      <section id="brew-guidance" className="scroll-mt-28 grid gap-6">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Hướng dẫn trải nghiệm</p>
          <h2 className={styles.title}>{guidance.title}</h2>
          <p className={styles.lead}>{guidance.intro}</p>
          {activeQrContent.batchNotice ? <p className={styles.lead}>{activeQrContent.batchNotice}</p> : null}
        </div>
        <div className={styles.stepGrid}>
          {guidance.steps.map((step) => (
            <article className={styles.panel} key={step.label}>
              <span className={styles.panelLabel}>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="qr-feedback-form" className="scroll-mt-28 grid gap-6">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Sau khi xem QR</p>
          <h2 className={styles.title}>Ghi lại điều bạn cảm nhận được.</h2>
          <p className={styles.lead}>
            Mẫu ngắn này giúp Senova hiểu đúng SKU hoặc lô, nội dung đã xem, cảm nhận giác quan,
            khoảng giá phù hợp và mục đích mua hoặc tặng.
          </p>
        </div>
        <QrFeedbackForm
          product={product}
          skuOrLot={batchCode}
          source={source}
          contentViewed={contentViewed}
          contentVersion={contentVersion}
          title="Phản hồi QR"
        />
      </section>

      <section className={styles.cardGrid} aria-label="Điểm nổi bật">
        {product.highlights.slice(0, 3).map((highlight) => (
          <article className={styles.panel} key={highlight}>
            <Check aria-hidden="true" className="text-accent" />
            <p>{highlight}</p>
          </article>
        ))}
      </section>
    </article>
  );
}
