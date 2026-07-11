import { useEffect, useState, type FormEvent } from "react";
import { ClipboardCheck, ExternalLink, Send } from "lucide-react";
import { productLuxuryCopy } from "@features/content/luxuryCopy";
import { useLanguage, type Language } from "@app/providers/LanguageContext";
import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { trackEvent } from "@shared/analytics/analytics";
import { submitForm } from "@shared/api/submissions";
import { getProductBySlug, products } from "@features/products/data/products";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";

const validationProducts = products.filter((product) =>
  ["petal-pack", "gift-set"].includes(product.slug),
);

const reportReferenceDate = "2026-06-27";

const pageCopy: Record<
  Language,
  {
    eyebrow: string;
    title: string;
    description: string;
    formAnchor: string;
    email: string;
    asideTitle: string;
    asideText: string;
    asideBadge: string;
    detail: string;
    formEyebrow: string;
    formTitle: string;
    formText: string;
    errorRequired: string;
    errorSubmit: string;
    submitting: string;
    submit: string;
    fields: Record<string, string>;
    options: Record<string, { value: string; label: string }[]>;
    validationLegend: string;
    validationTopics: string[];
    consentLegend: string;
    consentText: string;
  }
> = {
  vi: {
    eyebrow: "Đăng ký mẫu thử / khảo sát",
    title: "Góp dữ liệu kiểm chứng cho Petal Pack và Gift Set.",
    description:
      "Trang này ghi nhận người quan tâm dùng thử, góp ý ý tưởng quà tặng và cho phép Senova tổng hợp phản hồi ẩn danh cho hồ sơ validation ngày 27/06/2026. Đây chưa phải giao dịch thanh toán hay cam kết giao hàng.",
    formAnchor: "Điền khảo sát",
    email: "Gửi qua email",
    asideTitle: "Petal Pack + Gift Set",
    asideText:
      "Senova đang xác thực mức hấp dẫn của thao tác mở cánh sen, nhu cầu nhận mẫu thử, dịp tặng phù hợp và kỳ vọng về bộ quà.",
    asideBadge: "Dữ liệu dùng ở dạng tổng hợp ẩn danh",
    detail: "Xem chi tiết",
    formEyebrow: "Phiếu ghi nhận validation",
    formTitle: "Đăng ký quan tâm mẫu thử",
    formText:
      "Các trường dưới đây giúp nhóm Senova biết nên mời ai dùng thử, cần hỏi sâu phần nào và có đủ bằng chứng tổng hợp cho Petal Pack / Gift Set.",
    errorRequired:
      "Vui lòng điền thông tin liên hệ, vai trò, sản phẩm quan tâm, dạng mẫu thử và phần đồng ý sử dụng phản hồi ẩn danh.",
    errorSubmit: "Thông tin chưa thể gửi. Vui lòng thử lại.",
    submitting: "Đang gửi...",
    submit: "Gửi đăng ký mẫu thử",
    fields: {
      name: "Tên của bạn",
      email: "Email",
      phone: "Số điện thoại",
      role: "Bạn đăng ký với vai trò nào?",
      rolePlaceholder: "Chọn vai trò",
      primaryProduct: "Sản phẩm muốn xác thực",
      sampleFormat: "Dạng tham gia mong muốn",
      samplePlaceholder: "Chọn hình thức",
      useCase: "Bối cảnh bạn sẽ dùng hoặc tặng",
      useCasePlaceholder: "Chọn bối cảnh",
      expectedQuantity: "Số lượng quan tâm",
      expectedQuantityPlaceholder: "Ví dụ: 5, 20, 100",
      timeline: "Thời điểm cần thông tin",
      giftBudget: "Khoảng ngân sách quà tặng",
      petalQuestion: "Điều gì khiến bạn muốn hoặc chưa muốn thử Petal Pack?",
      giftQuestion: "Với Gift Set, bạn cần thấy rõ điều gì trước khi cân nhắc đặt?",
      message: "Ghi chú thêm cho nhóm Senova",
    },
    options: {
      roles: [
        { value: "consumer", label: "Người dùng cá nhân" },
        { value: "gift-buyer", label: "Người mua quà tặng" },
        { value: "event-corporate", label: "Doanh nghiệp / sự kiện" },
        { value: "retail-partner", label: "Đối tác bán lẻ / phân phối" },
      ],
      sampleFormats: [
        { value: "sample-at-event", label: "Nhận mẫu tại booth / sự kiện" },
        { value: "home-sample", label: "Nhận mẫu thử tại nhà" },
        { value: "interview", label: "Phỏng vấn nhanh 15 phút" },
        { value: "concept-review", label: "Chỉ góp ý concept Gift Set" },
      ],
      useCases: [
        { value: "daily-ritual", label: "Thưởng trà cá nhân" },
        { value: "small-gift", label: "Quà nhỏ cho bạn bè / gia đình" },
        { value: "corporate-gift", label: "Quà tri ân đối tác / khách hàng" },
        { value: "event-souvenir", label: "Quà lưu niệm sự kiện" },
        { value: "tourism-cultural", label: "Trải nghiệm du lịch / văn hóa" },
      ],
      timelines: [
        { value: "", label: "Chưa xác định" },
        { value: "july-2026", label: "Trong tháng 07/2026" },
        { value: "q3-2026", label: "Quý 3/2026" },
        { value: "q4-2026", label: "Quý 4/2026" },
        { value: "later", label: "Sau đó" },
      ],
      budgets: [
        { value: "", label: "Chưa xác định" },
        { value: "under-150k", label: "Dưới 150.000đ / phần" },
        { value: "150k-300k", label: "150.000đ - 300.000đ / phần" },
        { value: "300k-500k", label: "300.000đ - 500.000đ / phần" },
        { value: "over-500k", label: "Trên 500.000đ / phần" },
      ],
    },
    validationLegend: "Senova nên dùng phản hồi của bạn để kiểm chứng điều gì?",
    validationTopics: [
      "Thao tác mở cánh sen có đủ khác biệt và dễ hiểu không",
      "Hương, vị và thời gian pha có phù hợp với kỳ vọng không",
      "Gift Set có hợp với dịp tặng và người nhận cụ thể không",
      "Nội dung QR / câu chuyện có làm món quà đáng nhớ hơn không",
    ],
    consentLegend: "Đồng ý sử dụng phản hồi",
    consentText:
      "Tôi đồng ý để Senova tổng hợp phản hồi ở dạng ẩn danh, không công khai thông tin cá nhân, cho hồ sơ validation và báo cáo ngày 27/06/2026.",
  },
  en: {
    eyebrow: "Sample interest / validation",
    title: "Contribute validation data for Petal Pack and Gift Set.",
    description:
      "This page records sample interest, gifting feedback and consent for Senova to summarize anonymous responses for the validation report dated 27 June 2026. This is not payment or a delivery commitment.",
    formAnchor: "Fill the survey",
    email: "Send by email",
    asideTitle: "Petal Pack + Gift Set",
    asideText:
      "Senova is validating the opening gesture, sample interest, suitable gifting occasions and expectations for the gift configuration.",
    asideBadge: "Feedback is used only in anonymous summary form",
    detail: "View detail",
    formEyebrow: "Validation form",
    formTitle: "Register sample interest",
    formText:
      "These fields help Senova choose sample participants, identify topics for deeper questions and collect useful evidence for Petal Pack / Gift Set.",
    errorRequired:
      "Please complete contact details, role, product interest, sample format and anonymous feedback consent.",
    errorSubmit: "Your information could not be sent. Please try again.",
    submitting: "Sending...",
    submit: "Send sample interest",
    fields: {
      name: "Your name",
      email: "Email",
      phone: "Phone",
      role: "Which role best describes you?",
      rolePlaceholder: "Choose a role",
      primaryProduct: "Product to validate",
      sampleFormat: "Preferred participation format",
      samplePlaceholder: "Choose a format",
      useCase: "How would you use or gift it?",
      useCasePlaceholder: "Choose a use case",
      expectedQuantity: "Expected quantity",
      expectedQuantityPlaceholder: "Example: 5, 20, 100",
      timeline: "Information timing",
      giftBudget: "Gift budget range",
      petalQuestion: "What makes you want or hesitate to try Petal Pack?",
      giftQuestion: "For Gift Set, what must be clear before you consider ordering?",
      message: "Additional note for Senova",
    },
    options: {
      roles: [
        { value: "consumer", label: "Personal user" },
        { value: "gift-buyer", label: "Gift buyer" },
        { value: "event-corporate", label: "Business / event" },
        { value: "retail-partner", label: "Retail / distribution partner" },
      ],
      sampleFormats: [
        { value: "sample-at-event", label: "Receive a sample at a booth / event" },
        { value: "home-sample", label: "Receive a home sample" },
        { value: "interview", label: "15-minute quick interview" },
        { value: "concept-review", label: "Gift Set concept review only" },
      ],
      useCases: [
        { value: "daily-ritual", label: "Personal tea ritual" },
        { value: "small-gift", label: "Small gift for friends / family" },
        { value: "corporate-gift", label: "Partner / client appreciation gift" },
        { value: "event-souvenir", label: "Event souvenir" },
        { value: "tourism-cultural", label: "Tourism / cultural experience" },
      ],
      timelines: [
        { value: "", label: "Not decided" },
        { value: "july-2026", label: "In July 2026" },
        { value: "q3-2026", label: "Q3 2026" },
        { value: "q4-2026", label: "Q4 2026" },
        { value: "later", label: "Later" },
      ],
      budgets: [
        { value: "", label: "Not decided" },
        { value: "under-150k", label: "Under VND 150,000 / set" },
        { value: "150k-300k", label: "VND 150,000 - 300,000 / set" },
        { value: "300k-500k", label: "VND 300,000 - 500,000 / set" },
        { value: "over-500k", label: "Above VND 500,000 / set" },
      ],
    },
    validationLegend: "What should Senova validate with your feedback?",
    validationTopics: [
      "Whether the lotus opening gesture is distinctive and clear",
      "Whether aroma, taste and brewing time meet expectations",
      "Whether Gift Set fits the occasion and recipient",
      "Whether QR / story content makes the gift more memorable",
    ],
    consentLegend: "Feedback consent",
    consentText:
      "I agree that Senova may summarize my feedback anonymously, without publishing personal information, for validation materials and the report dated 27 June 2026.",
  },
};

function getFieldValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function getCheckedValues(formData: FormData, field: string) {
  return formData
    .getAll(field)
    .filter((value): value is string => typeof value === "string")
    .join(", ");
}

export default function PreOrderPage() {
  const { navigate, search } = useRouter();
  const { language } = useLanguage();
  const copy = pageCopy[language];
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestedProduct = new URLSearchParams(search).get("product") ?? "petal-pack";
  const selectedProduct = getProductBySlug(requestedProduct);
  const defaultProduct =
    selectedProduct && validationProducts.some((product) => product.slug === selectedProduct.slug)
      ? selectedProduct.slug
      : "petal-pack";

  useEffect(() => {
    trackEvent({ eventName: "sample_interest_start", source: defaultProduct });
  }, [defaultProduct]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      website: getFieldValue(formData, "website"),
      name: getFieldValue(formData, "name"),
      email: getFieldValue(formData, "email"),
      phone: getFieldValue(formData, "phone"),
      role: getFieldValue(formData, "role"),
      primaryProduct: getFieldValue(formData, "primaryProduct"),
      sampleFormat: getFieldValue(formData, "sampleFormat"),
      useCase: getFieldValue(formData, "useCase"),
      expectedQuantity: getFieldValue(formData, "expectedQuantity"),
      timeline: getFieldValue(formData, "timeline"),
      giftBudget: getFieldValue(formData, "giftBudget"),
      validationTopics: getCheckedValues(formData, "validationTopics"),
      petalPackQuestion: getFieldValue(formData, "petalPackQuestion"),
      giftSetQuestion: getFieldValue(formData, "giftSetQuestion"),
      evidenceConsent: getFieldValue(formData, "evidenceConsent"),
      message: getFieldValue(formData, "message"),
      campaign: "petal-pack-gift-set-validation",
      reportReferenceDate,
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.role ||
      !payload.primaryProduct ||
      !payload.sampleFormat ||
      !payload.useCase ||
      !payload.validationTopics ||
      !payload.evidenceConsent
    ) {
      setError(copy.errorRequired);
      setIsSubmitting(false);
      return;
    }

    const result = await submitForm("sample-interest", payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? copy.errorSubmit);
      return;
    }

    trackEvent({ eventName: "sample_interest_submit", source: payload.primaryProduct });
    navigate(`/thank-you?type=sample-interest&product=${payload.primaryProduct}`);
  }

  return (
    <article className={styles.page}>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className={styles.heroDescription}>{copy.description}</p>
          <div className={styles.actions}>
            <a className={styles.primaryButton} href="#sample-interest-form">
              {copy.formAnchor}
              <ClipboardCheck aria-hidden="true" />
            </a>
            <a className={styles.secondaryButton} href="mailto:hello@senova.vn?subject=Senova sample interest">
              {copy.email}
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
        <aside className={styles.heroAside}>
          <strong>{copy.asideTitle}</strong>
          <p className={styles.bodyText}>{copy.asideText}</p>
          <span className={styles.statusBadge}>{copy.asideBadge}</span>
        </aside>
      </section>

      <section className={styles.formLayout}>
        <div className={styles.productStrip}>
          {validationProducts.map((product) => {
            const displayProduct = productLuxuryCopy[language][product.id];

            return (
              <article className={styles.productCard} key={product.slug}>
                <div className={styles.productImage}>
                  <img src={displayProduct.image} alt={displayProduct.heroAlt} loading="lazy" />
                </div>
                <div className={styles.productBody}>
                  <span className={styles.panelLabel}>{displayProduct.role}</span>
                  <h3>{displayProduct.name}</h3>
                  <p className={styles.bodyText}>{displayProduct.shortDescription}</p>
                  <Link className={styles.inlineLink} href={product.href}>
                    {copy.detail}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.formPanel} id="sample-interest-form">
          <p className={styles.eyebrow}>{copy.formEyebrow}</p>
          <h2>{copy.formTitle}</h2>
          <p className={styles.fieldHint}>{copy.formText}</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.hiddenField}>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="name">{copy.fields.name}</label>
                <input id="name" name="name" autoComplete="name" required />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="email">{copy.fields.email}</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="phone">{copy.fields.phone}</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="role">{copy.fields.role}</label>
                <select id="role" name="role" required defaultValue="">
                  <option value="" disabled>
                    {copy.fields.rolePlaceholder}
                  </option>
                  {copy.options.roles.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="primaryProduct">{copy.fields.primaryProduct}</label>
                <select id="primaryProduct" name="primaryProduct" defaultValue={defaultProduct} required>
                  {validationProducts.map((product) => {
                    const displayProduct = productLuxuryCopy[language][product.id];
                    return (
                      <option value={product.slug} key={product.slug}>
                        {displayProduct.name}
                      </option>
                    );
                  })}
                  <option value="petal-pack,gift-set">Petal Pack + Gift Set</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="sampleFormat">{copy.fields.sampleFormat}</label>
                <select id="sampleFormat" name="sampleFormat" required defaultValue="">
                  <option value="" disabled>
                    {copy.fields.samplePlaceholder}
                  </option>
                  {copy.options.sampleFormats.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="useCase">{copy.fields.useCase}</label>
                <select id="useCase" name="useCase" required defaultValue="">
                  <option value="" disabled>
                    {copy.fields.useCasePlaceholder}
                  </option>
                  {copy.options.useCases.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="expectedQuantity">{copy.fields.expectedQuantity}</label>
                <input
                  id="expectedQuantity"
                  name="expectedQuantity"
                  type="number"
                  min="1"
                  placeholder={copy.fields.expectedQuantityPlaceholder}
                />
              </div>
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="timeline">{copy.fields.timeline}</label>
                <select id="timeline" name="timeline" defaultValue="">
                  {copy.options.timelines.map((option) => (
                    <option key={option.value || "empty"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="giftBudget">{copy.fields.giftBudget}</label>
                <select id="giftBudget" name="giftBudget" defaultValue="">
                  {copy.options.budgets.map((option) => (
                    <option key={option.value || "empty"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <fieldset className={styles.choiceGroup}>
              <legend>{copy.validationLegend}</legend>
              {copy.validationTopics.map((topic, index) => (
                <label key={topic}>
                  <input
                    name="validationTopics"
                    type="checkbox"
                    value={["petal-opening", "taste-aroma", "gift-occasion", "story-qr"][index]}
                  />
                  <span>{topic}</span>
                </label>
              ))}
            </fieldset>

            <div className={styles.fieldGroup}>
              <label htmlFor="petalPackQuestion">{copy.fields.petalQuestion}</label>
              <textarea id="petalPackQuestion" name="petalPackQuestion" />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="giftSetQuestion">{copy.fields.giftQuestion}</label>
              <textarea id="giftSetQuestion" name="giftSetQuestion" />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="message">{copy.fields.message}</label>
              <textarea id="message" name="message" />
            </div>

            <fieldset className={styles.choiceGroup}>
              <legend>{copy.consentLegend}</legend>
              <label>
                <input name="evidenceConsent" type="checkbox" value="anonymous-report-use" required />
                <span>{copy.consentText}</span>
              </label>
            </fieldset>

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
