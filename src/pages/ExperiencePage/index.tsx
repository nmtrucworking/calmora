import { ArrowRight, Check, MessageSquare } from "lucide-react";
import { Link } from "../../contexts/RouterContext";
import { useRouter } from "../../contexts/RouterState";
import { trackEvent } from "../../features/analytics/analytics";
import type { SenovaProduct } from "../../features/products/data/products";
import { useEffect } from "react";
import styles from "../SystemPages/SystemPages.module.css";

type ExperiencePageProps = {
  product?: SenovaProduct;
};

export default function ExperiencePage({ product }: ExperiencePageProps) {
  const { search } = useRouter();
  const batchCode = new URLSearchParams(search).get("batch") ?? undefined;

  useEffect(() => {
    if (product) {
      trackEvent({
        eventName: "experience_start",
        productSlug: product.slug,
        batchCode,
      });
    }
  }, [batchCode, product]);

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

  return (
    <article className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Trải nghiệm QR / {product.role}</p>
          <h1>{product.name}</h1>
          <p className={styles.heroDescription}>{product.shortDescription}</p>
          {batchCode ? <p className={styles.successText}>Mã lô: {batchCode}</p> : null}
          <div className={styles.actions}>
            <Link href={`/feedback/${product.slug}${batchCode ? `?batch=${batchCode}` : ""}`} className={styles.primaryButton}>
              Gửi phản hồi
              <MessageSquare aria-hidden="true" />
            </Link>
            <Link href="/ritual" className={styles.secondaryButton}>
              Xem nghi thức chung
            </Link>
          </div>
        </div>
        <aside className={styles.heroAside}>
          <img src={product.image} alt={product.heroAlt} loading="eager" style={{ width: "100%" }} />
          {product.status === "draft" ? (
            <span className={styles.statusBadge}>Phiên bản đang hoàn thiện</span>
          ) : null}
        </aside>
      </section>

      <section className={styles.stepGrid} aria-label="Các bước trải nghiệm">
        {product.experienceSteps.map((step, index) => (
          <article className={styles.panel} key={step.title}>
            <span className={styles.panelLabel}>{String(index + 1).padStart(2, "0")}</span>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.panel}>
        <p className={styles.eyebrow}>Sau trải nghiệm</p>
        <h2>Ghi lại điều bạn cảm nhận được.</h2>
        <p>
          Phản hồi được lưu theo sản phẩm và mã lô để Senova hiểu rõ hơn cách người dùng mở,
          pha và thưởng thức từng phiên bản.
        </p>
        <div className={styles.actions}>
          <Link href={`/feedback/${product.slug}${batchCode ? `?batch=${batchCode}` : ""}`} className={styles.primaryButton}>
            Gửi phản hồi
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link href={product.href} className={styles.secondaryButton}>
            Xem chi tiết sản phẩm
          </Link>
        </div>
      </section>

      <section className={styles.cardGrid} aria-label="Điểm cần lưu ý">
        {product.highlights.slice(0, 3).map((highlight) => (
          <article className={styles.panel} key={highlight}>
            <Check aria-hidden="true" />
            <p>{highlight}</p>
          </article>
        ))}
      </section>
    </article>
  );
}
