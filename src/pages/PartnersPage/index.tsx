import { useEffect, useState, type FormEvent } from "react";
import { Handshake, Send } from "lucide-react";
import { useRouter } from "../../contexts/RouterState";
import { trackEvent } from "../../features/analytics/analytics";
import { submitForm } from "../../features/forms/submissions";
import styles from "../SystemPages/SystemPages.module.css";

export default function PartnersPage() {
  const { navigate } = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackEvent({ eventName: "partner_inquiry", source: "partners_page_view" });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<
      string,
      string
    >;

    if (!payload.name || !payload.email || !payload.organization || !payload.message) {
      setError("Vui lòng điền tên, email, đơn vị và nội dung hợp tác.");
      setIsSubmitting(false);
      return;
    }

    const result = await submitForm("partners", payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? "Đề xuất chưa thể gửi. Vui lòng thử lại.");
      return;
    }

    trackEvent({ eventName: "partner_inquiry", source: payload.partnerType });
    navigate("/thank-you?type=partners");
  }

  return (
    <article className={styles.page}>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <p className={styles.eyebrow}>Hợp tác</p>
          <h1>Cùng mở rộng giá trị của sen Việt trong trải nghiệm hiện đại.</h1>
          <p className={styles.heroDescription}>
            Senova tìm kiếm đối tác nguyên liệu, sản xuất, phân phối, sự kiện và nội dung thương
            hiệu để phát triển sản phẩm một cách có chủ đích.
          </p>
        </div>
        <aside className={styles.heroAside}>
          <Handshake aria-hidden="true" />
          <strong>Đối tác phù hợp</strong>
          <p className={styles.bodyText}>
            Ưu tiên những đề xuất có bối cảnh rõ, nhu cầu thật và tôn trọng chất liệu văn hóa.
          </p>
        </aside>
      </section>

      <section className={styles.formLayout}>
        <div className={styles.cardGrid}>
          {[
            ["Nguyên liệu", "Kết nối nguồn trà, sen và quy trình thử nghiệm phù hợp."],
            ["Sản xuất", "Phát triển bao bì, đóng gói, tạo hình và kiểm soát phiên bản."],
            ["Kênh trải nghiệm", "Booth, workshop, không gian trà hoặc sự kiện thương hiệu."],
          ].map(([title, text]) => (
            <article className={styles.panel} key={title}>
              <span className={styles.panelLabel}>Đối tác</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className={styles.formPanel}>
          <h2>Đề xuất hợp tác</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.hiddenField}>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="name">Người liên hệ</label>
                <input id="name" name="name" autoComplete="name" required />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>
            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="organization">Đơn vị</label>
                <input id="organization" name="organization" required />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="partnerType">Hình thức</label>
                <select id="partnerType" name="partnerType" defaultValue="experience">
                  <option value="material">Nguyên liệu</option>
                  <option value="production">Sản xuất</option>
                  <option value="distribution">Phân phối</option>
                  <option value="experience">Sự kiện trải nghiệm</option>
                  <option value="content">Nội dung thương hiệu</option>
                </select>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="message">Nội dung đề xuất</label>
              <textarea id="message" name="message" required />
            </div>
            {error ? <p className={styles.errorText}>{error}</p> : null}
            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi đề xuất"}
              <Send aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </article>
  );
}
