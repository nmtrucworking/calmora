import { useEffect, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useRouter } from "../../contexts/RouterState";
import { trackEvent } from "../../features/analytics/analytics";
import { submitForm } from "../../features/forms/submissions";
import { products } from "../../features/products/data/products";
import styles from "../SystemPages/SystemPages.module.css";

export default function PreOrderPage() {
  const { navigate, search } = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestedProduct = new URLSearchParams(search).get("product") ?? "petal-pack";

  useEffect(() => {
    trackEvent({ eventName: "preorder_start", source: requestedProduct });
  }, [requestedProduct]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<
      string,
      string
    >;

    if (!payload.name || !payload.email || !payload.product || !payload.quantity) {
      setError("Vui lòng điền tên, email, sản phẩm và số lượng dự kiến.");
      setIsSubmitting(false);
      return;
    }

    const result = await submitForm("pre-order", payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? "Yêu cầu chưa thể gửi. Vui lòng thử lại.");
      return;
    }

    trackEvent({ eventName: "preorder_submit", source: payload.product });
    navigate("/thank-you?type=pre-order");
  }

  return (
    <article className={styles.page}>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <p className={styles.eyebrow}>Đăng ký đặt trước</p>
          <h1>Ghi nhận nhu cầu cho phiên bản Senova phù hợp.</h1>
          <p className={styles.heroDescription}>
            Biểu mẫu này giúp Senova đo lường nhu cầu, chuẩn bị mẫu thử và liên hệ khi sản phẩm có
            thông tin phù hợp. Đây chưa phải giao dịch thanh toán.
          </p>
        </div>
        <aside className={styles.heroAside}>
          <strong>Classic / Petal Pack / Gift Set</strong>
          <p className={styles.bodyText}>
            Gift Set đang hoàn thiện, nên CTA chính là đăng ký nhận thông tin hoặc liên hệ tư vấn.
          </p>
        </aside>
      </section>

      <section className={styles.formLayout}>
        <div className={styles.productStrip}>
          {products.map((product) => (
            <article className={styles.productCard} key={product.slug}>
              <div className={styles.productImage}>
                <img src={product.image} alt={product.heroAlt} loading="lazy" />
              </div>
              <div className={styles.productBody}>
                <span className={styles.panelLabel}>{product.role}</span>
                <h3>{product.name}</h3>
                <p className={styles.bodyText}>{product.shortDescription}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.formPanel}>
          <h2>Thông tin đăng ký</h2>
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
                <label htmlFor="phone">Số điện thoại</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="quantity">Số lượng dự kiến</label>
                <input id="quantity" name="quantity" type="number" min="1" defaultValue="1" required />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="product">Sản phẩm quan tâm</label>
              <select id="product" name="product" defaultValue={requestedProduct} required>
                {products.map((product) => (
                  <option value={product.slug} key={product.slug}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="message">Nhu cầu hoặc thời điểm mong muốn</label>
              <textarea id="message" name="message" />
            </div>
            {error ? <p className={styles.errorText}>{error}</p> : null}
            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi đăng ký"}
              <Send aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </article>
  );
}
