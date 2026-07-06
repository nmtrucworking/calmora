import { useEffect, useState, type FormEvent } from "react";
import { Mail, Send } from "lucide-react";
import { useRouter } from "@app/router/RouterState";
import { trackEvent } from "@shared/analytics/analytics";
import { submitForm } from "@shared/api/submissions";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";

export default function ContactPage() {
  const { navigate, search } = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const topic = new URLSearchParams(search).get("topic") ?? "product";

  useEffect(() => {
    trackEvent({ eventName: "contact_start", source: topic });
  }, [topic]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<
      string,
      string
    >;

    if (!payload.name || !payload.email || !payload.topic || !payload.message) {
      setError("Vui lòng điền tên, email, chủ đề và nội dung liên hệ.");
      setIsSubmitting(false);
      return;
    }

    const result = await submitForm("contact", payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? "Nội dung chưa thể gửi. Vui lòng thử lại.");
      return;
    }

    trackEvent({ eventName: "contact_submit", source: payload.topic });
    navigate("/thank-you?type=contact");
  }

  return (
    <article className={styles.page}>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <p className={styles.eyebrow}>Liên hệ</p>
          <h1>Bắt đầu một trải nghiệm với Senova.</h1>
          <p className={styles.heroDescription}>
            Gửi yêu cầu mẫu thử, đặt lịch trao đổi, hỏi về Gift Set hoặc đề xuất hợp tác phát triển
            sản phẩm.
          </p>
        </div>
        <aside className={styles.heroAside}>
          <Mail aria-hidden="true" />
          <strong>hello@senova.vn</strong>
          <p className={styles.bodyText}>Senova dự kiến phản hồi trong 1-3 ngày làm việc.</p>
        </aside>
      </section>

      <section className={styles.formLayout}>
        <div className={styles.cardGrid}>
          <article className={styles.panel}>
            <span className={styles.panelLabel}>Mẫu thử</span>
            <h2>Trải nghiệm sản phẩm</h2>
            <p>Trao đổi về Classic, Petal Pack hoặc phiên bản thử nghiệm theo sự kiện.</p>
          </article>
          <article className={styles.panel}>
            <span className={styles.panelLabel}>Gift Set</span>
            <h2>Tư vấn quà tặng</h2>
            <p>Ghi nhận nhu cầu quà đối tác, quà tri ân hoặc phiên bản theo mùa.</p>
          </article>
          <article className={styles.panel}>
            <span className={styles.panelLabel}>Hợp tác</span>
            <h2>Đối tác và phân phối</h2>
            <p>Kết nối nguồn lực sản xuất, nguyên liệu, kênh bán hoặc không gian trải nghiệm.</p>
          </article>
        </div>

        <div className={styles.formPanel}>
          <h2>Nội dung liên hệ</h2>
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
            <div className={styles.fieldGroup}>
              <label htmlFor="topic">Chủ đề</label>
              <select id="topic" name="topic" defaultValue={topic} required>
                <option value="product">Sản phẩm và mẫu thử</option>
                <option value="gift-set">Gift Set</option>
                <option value="event">Sự kiện trải nghiệm</option>
                <option value="distribution">Phân phối</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="message">Nội dung</label>
              <textarea id="message" name="message" required />
            </div>
            {error ? <p className={styles.errorText}>{error}</p> : null}
            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
              <Send aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </article>
  );
}
