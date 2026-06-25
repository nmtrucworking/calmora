import { useEffect, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Link } from "../../contexts/RouterContext";
import { useRouter } from "../../contexts/RouterState";
import { trackEvent } from "../../features/analytics/analytics";
import { submitForm } from "../../features/forms/submissions";
import type { SenovaProduct } from "../../features/products/data/products";
import styles from "../SystemPages/SystemPages.module.css";

type FeedbackPageProps = {
  product?: SenovaProduct;
};

export default function FeedbackPage({ product }: FeedbackPageProps) {
  const { navigate, search } = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const batchCode = new URLSearchParams(search).get("batch") ?? "";

  useEffect(() => {
    if (product) {
      trackEvent({ eventName: "feedback_start", productSlug: product.slug, batchCode });
    }
  }, [batchCode, product]);

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

  const currentProduct = product;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries()) as Record<string, string>;

    if (!payload.name || !payload.email || !payload.rating || !payload.comment) {
      setError("Vui lòng điền tên, email, mức đánh giá và nội dung phản hồi.");
      setIsSubmitting(false);
      return;
    }

    const result = await submitForm("feedback", {
      ...payload,
      productSlug: currentProduct.slug,
      batchCode,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? "Phản hồi chưa thể gửi. Vui lòng thử lại.");
      return;
    }

    trackEvent({ eventName: "feedback_submit", productSlug: currentProduct.slug, batchCode });
    navigate(`/thank-you?type=feedback&product=${currentProduct.slug}`);
  }

  return (
    <article className={styles.page}>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <p className={styles.eyebrow}>Phản hồi trải nghiệm</p>
          <h1>{currentProduct.name}</h1>
          <p className={styles.heroDescription}>
            Chia sẻ cảm nhận sau khi mở, pha và thưởng thức để Senova cải tiến phiên bản tiếp theo.
          </p>
        </div>
        <aside className={styles.heroAside}>
          <strong>{currentProduct.role}</strong>
          <p className={styles.bodyText}>{currentProduct.shortDescription}</p>
          {batchCode ? <span className={styles.statusBadge}>Mã lô {batchCode}</span> : null}
        </aside>
      </section>

      <section className={styles.formLayout}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Dữ liệu cải tiến</p>
          <h2 className={styles.title}>Phản hồi gắn với đúng sản phẩm và lô trải nghiệm.</h2>
          <p className={styles.lead}>
            Senova chỉ dùng phản hồi để tổng hợp chất lượng trải nghiệm. Email không được đưa vào
            analytics hành vi.
          </p>
        </div>

        <div className={styles.formPanel}>
          <h2>Gửi phản hồi</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.hiddenField}>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="name">Tên của bạn</label>
                <input id="name" name="name" autoComplete="name" required />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>
            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="rating">Mức đánh giá</label>
                <select id="rating" name="rating" required defaultValue="">
                  <option value="" disabled>
                    Chọn mức đánh giá
                  </option>
                  <option value="5">Rất tốt</option>
                  <option value="4">Tốt</option>
                  <option value="3">Cần cải thiện nhẹ</option>
                  <option value="2">Chưa phù hợp</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="batchCode">Mã lô</label>
                <input id="batchCode" name="batchCode" defaultValue={batchCode} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="comment">Bạn muốn Senova cải thiện điều gì?</label>
              <textarea id="comment" name="comment" required />
            </div>
            {error ? <p className={styles.errorText}>{error}</p> : null}
            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
              <Send aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </article>
  );
}
