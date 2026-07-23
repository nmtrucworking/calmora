import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useRouter } from "@app/router/RouterState";
import { trackEvent } from "@shared/analytics/analytics";
import type { SenovaProduct } from "@features/products/data/products";
import { submitForm } from "@shared/api/submissions";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";
import { useLanguage } from "@app/providers/LanguageContext";

type QrFeedbackFormProps = {
  product: SenovaProduct;
  skuOrLot?: string;
  source?: string;
  contentViewed: string;
  contentVersion?: string;
  title?: string;
  description?: string;
};

const priceRangeValues = ["under-150k", "150k-300k", "300k-500k", "500k-800k", "over-800k", "not-sure"] as const;
const purchasePurposeValues = ["daily-use", "personal-gift", "corporate-event-gift", "tourism-cultural", "undecided"] as const;

function getFieldValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

export function QrFeedbackForm({
  product,
  skuOrLot = "",
  source = "qr",
  contentViewed,
  contentVersion = "v1",
  title,
  description,
}: QrFeedbackFormProps) {
  const { language } = useLanguage();
  const copy = language === "vi"
    ? { title: "Gửi phản hồi nhanh", description: "Phản hồi được lưu theo sản phẩm, mã lô và nội dung đã xem để Senova cải tiến trải nghiệm QR.", required: "Vui lòng điền mã SKU/lô, cảm nhận, khoảng giá, mục đích mua và phần đồng ý phản hồi.", failed: "Phản hồi chưa thể gửi. Vui lòng thử lại.", optional: "Không bắt buộc", name: "Tên của bạn", lot: "SKU hoặc mã lô", source: "Nguồn quét", viewed: "Nội dung đã xem", sensory: "Cảm nhận giác quan", placeholder: "Hương, vị, màu nước, cảm giác mở gói hoặc trải nghiệm nhận quà...", price: "Khoảng giá có thể chấp nhận", choosePrice: "Chọn khoảng giá", prices: ["Dưới 150.000đ", "150.000đ - 300.000đ", "300.000đ - 500.000đ", "500.000đ - 800.000đ", "Trên 800.000đ", "Chưa xác định"], purpose: "Ý định / mục đích mua", choosePurpose: "Chọn mục đích", purposes: ["Dùng hằng ngày", "Quà tặng cá nhân", "Quà doanh nghiệp / sự kiện", "Trải nghiệm du lịch / văn hóa", "Chưa xác định"], consentTitle: "Đồng ý sử dụng phản hồi", consent: "Tôi đồng ý để Senova tổng hợp phản hồi ở dạng ẩn danh cho hoạt động cải tiến sản phẩm, QR follow-up và báo cáo nội bộ.", sending: "Đang gửi...", submit: "Gửi phản hồi" }
    : { title: "Send quick feedback", description: "Feedback is associated with the product, batch and viewed content to help Senova improve the QR experience.", required: "Please enter the SKU/batch, sensory feedback, price range, purchase purpose and feedback consent.", failed: "Your feedback could not be sent. Please try again.", optional: "Optional", name: "Your name", lot: "SKU or batch code", source: "Scan source", viewed: "Content viewed", sensory: "Sensory feedback", placeholder: "Aroma, taste, tea colour, opening the package or receiving the gift...", price: "Acceptable price range", choosePrice: "Choose a price range", prices: ["Under VND 150,000", "VND 150,000–300,000", "VND 300,000–500,000", "VND 500,000–800,000", "Over VND 800,000", "Not sure"], purpose: "Purchase intent / purpose", choosePurpose: "Choose a purpose", purposes: ["Everyday use", "Personal gift", "Corporate / event gift", "Tourism / cultural experience", "Not sure"], consentTitle: "Consent to use feedback", consent: "I agree that Senova may aggregate my feedback anonymously for product improvement, QR follow-up and internal reporting.", sending: "Sending...", submit: "Send feedback" };
  const resolvedTitle = title ?? copy.title;
  const resolvedDescription = description ?? copy.description;
  const { navigate } = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      website: getFieldValue(formData, "website"),
      name: getFieldValue(formData, "name"),
      email: getFieldValue(formData, "email"),
      skuOrLot: getFieldValue(formData, "skuOrLot"),
      source: getFieldValue(formData, "source"),
      contentViewed: getFieldValue(formData, "contentViewed"),
      contentVersion: getFieldValue(formData, "contentVersion"),
      sensoryFeedback: getFieldValue(formData, "sensoryFeedback"),
      acceptablePriceRange: getFieldValue(formData, "acceptablePriceRange"),
      purchaseIntentPurpose: getFieldValue(formData, "purchaseIntentPurpose"),
      optInConsent: getFieldValue(formData, "optInConsent"),
      productSlug: product.slug,
      batchCode: getFieldValue(formData, "skuOrLot"),
    };

    if (
      !payload.skuOrLot ||
      !payload.source ||
      !payload.contentViewed ||
      !payload.sensoryFeedback ||
      !payload.acceptablePriceRange ||
      !payload.purchaseIntentPurpose ||
      !payload.optInConsent
    ) {
      setError(copy.required);
      setIsSubmitting(false);
      return;
    }

    const result = await submitForm("feedback", payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? copy.failed);
      return;
    }

    trackEvent({
      eventName: "feedback_submit",
      productSlug: product.slug,
      batchCode: payload.skuOrLot,
      source: payload.source,
      contentViewed: payload.contentViewed,
      contentVersion: payload.contentVersion,
    });
    navigate(`/thank-you?type=feedback&product=${product.slug}`);
  }

  return (
    <div className={styles.formPanel}>
      <p className={styles.eyebrow}>QR follow-up</p>
      <h2>{resolvedTitle}</h2>
      <p className={styles.fieldHint}>{resolvedDescription}</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.hiddenField}>
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className={styles.inlineFields}>
          <div className={styles.fieldGroup}>
            <label htmlFor="name">
              {copy.name} <span className="text-text-soft font-normal text-[0.8em]">({copy.optional})</span>
            </label>
            <input id="name" name="name" autoComplete="name" />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="email">
              Email <span className="text-text-soft font-normal text-[0.8em]">({copy.optional})</span>
            </label>
            <input id="email" name="email" type="email" autoComplete="email" />
          </div>
        </div>

        <div className={styles.inlineFields}>
          <div className={styles.fieldGroup}>
            <label htmlFor="skuOrLot">{copy.lot}</label>
            <input id="skuOrLot" name="skuOrLot" defaultValue={skuOrLot} required />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="source">{copy.source}</label>
            <input id="source" name="source" defaultValue={source || "qr"} required />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="contentViewed">{copy.viewed}</label>
          <input id="contentViewed" name="contentViewed" defaultValue={contentViewed} readOnly required />
        </div>

        <div className={styles.hiddenField}>
          <label htmlFor="contentVersion">Content version</label>
          <input id="contentVersion" name="contentVersion" defaultValue={contentVersion} readOnly />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="sensoryFeedback">{copy.sensory}</label>
          <textarea
            id="sensoryFeedback"
            name="sensoryFeedback"
            required
            placeholder={copy.placeholder}
          />
        </div>

        <div className={styles.inlineFields}>
          <div className={styles.fieldGroup}>
            <label htmlFor="acceptablePriceRange">{copy.price}</label>
            <select id="acceptablePriceRange" name="acceptablePriceRange" required defaultValue="">
              <option value="" disabled>
                {copy.choosePrice}
              </option>
              {priceRangeValues.map((value, index) => (
                <option key={value} value={value}>
                  {copy.prices[index]}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="purchaseIntentPurpose">{copy.purpose}</label>
            <select id="purchaseIntentPurpose" name="purchaseIntentPurpose" required defaultValue="">
              <option value="" disabled>
                {copy.choosePurpose}
              </option>
              {purchasePurposeValues.map((value, index) => (
                <option key={value} value={value}>
                  {copy.purposes[index]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className={styles.choiceGroup}>
          <legend>{copy.consentTitle}</legend>
          <label>
            <input name="optInConsent" type="checkbox" value="anonymous-follow-up" required />
            <span>
              {copy.consent}
            </span>
          </label>
        </fieldset>

        {error ? <p className={styles.errorText}>{error}</p> : null}
        <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
          {isSubmitting ? copy.sending : copy.submit}
          <Send aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
