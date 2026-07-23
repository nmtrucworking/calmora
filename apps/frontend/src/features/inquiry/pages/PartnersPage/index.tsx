import { useEffect, useState, type FormEvent } from "react";
import { Handshake, Send } from "lucide-react";
import { useRouter } from "@app/router/RouterState";
import { trackEvent } from "@shared/analytics/analytics";
import { submitForm } from "@shared/api/submissions";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";
import { useLanguage } from "@app/providers/LanguageContext";

const partnersCopy = {
  vi: { required: "Vui lòng điền tên, email, đơn vị và nội dung hợp tác.", failed: "Đề xuất chưa thể gửi. Vui lòng thử lại.", eyebrow: "Hợp tác", title: "Cùng mở rộng giá trị của sen Việt trong trải nghiệm hiện đại.", description: "Senova tìm kiếm đối tác nguyên liệu, sản xuất, phân phối, sự kiện và nội dung thương hiệu để phát triển sản phẩm một cách có chủ đích.", suitable: "Đối tác phù hợp", suitableText: "Ưu tiên những đề xuất có bối cảnh rõ, nhu cầu thật và tôn trọng chất liệu văn hóa.", partner: "Đối tác", cards: [["Nguyên liệu", "Kết nối nguồn trà, sen và quy trình thử nghiệm phù hợp."], ["Sản xuất", "Phát triển bao bì, đóng gói, tạo hình và kiểm soát phiên bản."], ["Kênh trải nghiệm", "Booth, workshop, không gian trà hoặc sự kiện thương hiệu."]], formTitle: "Đề xuất hợp tác", name: "Người liên hệ", organization: "Đơn vị", type: "Hình thức", types: [["material", "Nguyên liệu"], ["production", "Sản xuất"], ["distribution", "Phân phối"], ["experience", "Sự kiện trải nghiệm"], ["content", "Nội dung thương hiệu"]], message: "Nội dung đề xuất", submitting: "Đang gửi...", submit: "Gửi đề xuất" },
  en: { required: "Please enter your name, email, organization and proposal.", failed: "Your proposal could not be sent. Please try again.", eyebrow: "Partnerships", title: "Bring the value of Vietnamese lotus into contemporary experiences.", description: "Senova welcomes ingredient, production, distribution, event and brand-content partners who want to develop products with intention.", suitable: "A good partnership", suitableText: "We prioritize proposals with clear context, a real need and respect for cultural material.", partner: "Partner", cards: [["Ingredients", "Connect tea and lotus sources with an appropriate testing process."], ["Production", "Develop packaging, forming, packing and version control."], ["Experience channels", "Booths, workshops, tea spaces or brand events."]], formTitle: "Partnership proposal", name: "Contact person", organization: "Organization", type: "Partnership type", types: [["material", "Ingredients"], ["production", "Production"], ["distribution", "Distribution"], ["experience", "Experiential events"], ["content", "Brand content"]], message: "Your proposal", submitting: "Sending...", submit: "Send proposal" },
} as const;

export default function PartnersPage() {
  const { language } = useLanguage();
  const copy = partnersCopy[language];
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
      setError(copy.required);
      setIsSubmitting(false);
      return;
    }

    const result = await submitForm("partners", payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? copy.failed);
      return;
    }

    trackEvent({ eventName: "partner_inquiry", source: payload.partnerType });
    navigate("/thank-you?type=partners");
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
          <Handshake aria-hidden="true" />
          <strong>{copy.suitable}</strong>
          <p className={styles.bodyText}>{copy.suitableText}</p>
        </aside>
      </section>

      <section className={styles.formLayout}>
        <div className={styles.cardGrid}>
          {copy.cards.map(([title, text]) => (
            <article className={styles.panel} key={title}>
              <span className={styles.panelLabel}>{copy.partner}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
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
            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="organization">{copy.organization}</label>
                <input id="organization" name="organization" required />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="partnerType">{copy.type}</label>
                <select id="partnerType" name="partnerType" defaultValue="experience">
                  {copy.types.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                </select>
              </div>
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
