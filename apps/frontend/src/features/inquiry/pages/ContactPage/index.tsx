import { useEffect, useState, type FormEvent } from "react";
import { Mail, Send } from "lucide-react";
import { useRouter } from "@app/router/RouterState";
import { trackEvent } from "@shared/analytics/analytics";
import { submitForm } from "@shared/api/submissions";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";
import { useLanguage } from "@app/providers/LanguageContext";

const contactCopy = {
  vi: {
    required: "Vui lòng điền tên, email, chủ đề và nội dung liên hệ.", failed: "Nội dung chưa thể gửi. Vui lòng thử lại.", eyebrow: "Liên hệ", title: "Bắt đầu một trải nghiệm với Senova.", description: "Gửi yêu cầu mẫu thử, đặt lịch trao đổi, hỏi về Gift Set hoặc đề xuất hợp tác phát triển sản phẩm.", response: "Senova dự kiến phản hồi trong 1-3 ngày làm việc.", cards: [["Mẫu thử", "Trải nghiệm sản phẩm", "Trao đổi về Classic, Petal Pack hoặc phiên bản thử nghiệm theo sự kiện."], ["Gift Set", "Tư vấn quà tặng", "Ghi nhận nhu cầu quà đối tác, quà tri ân hoặc phiên bản theo mùa."], ["Hợp tác", "Đối tác và phân phối", "Kết nối nguồn lực sản xuất, nguyên liệu, kênh bán hoặc không gian trải nghiệm."]], formTitle: "Nội dung liên hệ", name: "Tên của bạn", topic: "Chủ đề", topics: [["product", "Sản phẩm và mẫu thử"], ["gift-set", "Gift Set"], ["event", "Sự kiện trải nghiệm"], ["distribution", "Phân phối"], ["other", "Khác"]], message: "Nội dung", submitting: "Đang gửi...", submit: "Gửi liên hệ",
  },
  en: {
    required: "Please enter your name, email, topic and message.", failed: "Your message could not be sent. Please try again.", eyebrow: "Contact", title: "Begin an experience with Senova.", description: "Request a sample, schedule a conversation, ask about Gift Set or propose a product development partnership.", response: "Senova expects to reply within 1–3 business days.", cards: [["Samples", "Experience the products", "Discuss Classic, Petal Pack or an event trial edition."], ["Gift Set", "Gifting consultation", "Share your needs for partner gifts, appreciation gifts or seasonal editions."], ["Partnerships", "Partners and distribution", "Connect production, ingredients, retail channels or experiential spaces."]], formTitle: "Your message", name: "Your name", topic: "Topic", topics: [["product", "Products and samples"], ["gift-set", "Gift Set"], ["event", "Experiential events"], ["distribution", "Distribution"], ["other", "Other"]], message: "Message", submitting: "Sending...", submit: "Send message",
  },
} as const;

export default function ContactPage() {
  const { language } = useLanguage();
  const copy = contactCopy[language];
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
      setError(copy.required);
      setIsSubmitting(false);
      return;
    }

    const result = await submitForm("contact", payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? copy.failed);
      return;
    }

    trackEvent({ eventName: "contact_submit", source: payload.topic });
    navigate("/thank-you?type=contact");
  }

  return (
    <article className={styles.page}>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className={styles.heroDescription}>{copy.description}</p>
        </div>
        <aside className={styles.heroAside}>
          <Mail aria-hidden="true" />
          <strong>hello@senova.vn</strong>
          <p className={styles.bodyText}>{copy.response}</p>
        </aside>
      </section>

      <section className={styles.formLayout}>
        <div className={styles.cardGrid}>
          {copy.cards.map(([label, title, text]) => <article className={styles.panel} key={title}><span className={styles.panelLabel}>{label}</span><h2>{title}</h2><p>{text}</p></article>)}
        </div>

        <div className={styles.formPanel}>
          <h2>{copy.formTitle}</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.hiddenField}>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="name">{copy.name}</label>
                <input id="name" name="name" autoComplete="name" required />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="topic">{copy.topic}</label>
              <select id="topic" name="topic" defaultValue={topic} required>
                {copy.topics.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="message">{copy.message}</label>
              <textarea id="message" name="message" required />
            </div>
            {error ? <p className={styles.errorText}>{error}</p> : null}
            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? copy.submitting : copy.submit}
              <Send aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </article>
  );
}
