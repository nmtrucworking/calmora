import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useRouter } from "../../contexts/RouterState";
import { trackEvent } from "../analytics/analytics";
import type { SenovaProduct } from "../products/data/products";
import { submitForm } from "./submissions";
import { systemStyles as styles } from "../../styles/systemPageClasses";

type QrFeedbackFormProps = {
  product: SenovaProduct;
  skuOrLot?: string;
  source?: string;
  contentViewed: string;
  title?: string;
  description?: string;
};

const priceRanges = [
  { value: "under-150k", label: "Dưới 150.000đ" },
  { value: "150k-300k", label: "150.000đ - 300.000đ" },
  { value: "300k-500k", label: "300.000đ - 500.000đ" },
  { value: "500k-800k", label: "500.000đ - 800.000đ" },
  { value: "over-800k", label: "Trên 800.000đ" },
  { value: "not-sure", label: "Chưa xác định" },
];

const purchasePurposes = [
  { value: "daily-use", label: "Dùng hằng ngày" },
  { value: "personal-gift", label: "Quà tặng cá nhân" },
  { value: "corporate-event-gift", label: "Quà doanh nghiệp / sự kiện" },
  { value: "tourism-cultural", label: "Trải nghiệm du lịch / văn hóa" },
  { value: "undecided", label: "Chưa xác định" },
];

function getFieldValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

export function QrFeedbackForm({
  product,
  skuOrLot = "",
  source = "qr",
  contentViewed,
  title = "Gửi phản hồi nhanh",
  description = "Phản hồi được lưu theo sản phẩm, mã lô và nội dung đã xem để Senova cải tiến trải nghiệm QR.",
}: QrFeedbackFormProps) {
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
      setError("Vui lòng điền mã SKU/lô, cảm nhận, khoảng giá, mục đích mua và phần đồng ý phản hồi.");
      setIsSubmitting(false);
      return;
    }

    const result = await submitForm("feedback", payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? "Phản hồi chưa thể gửi. Vui lòng thử lại.");
      return;
    }

    trackEvent({
      eventName: "feedback_submit",
      productSlug: product.slug,
      batchCode: payload.skuOrLot,
      source: payload.source,
      contentViewed: payload.contentViewed,
    });
    navigate(`/thank-you?type=feedback&product=${product.slug}`);
  }

  return (
    <div className={styles.formPanel}>
      <p className={styles.eyebrow}>QR follow-up</p>
      <h2>{title}</h2>
      <p className={styles.fieldHint}>{description}</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.hiddenField}>
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className={styles.inlineFields}>
          <div className={styles.fieldGroup}>
            <label htmlFor="name">
              Tên của bạn <span className="text-text-soft font-normal text-[0.8em]">(Không bắt buộc)</span>
            </label>
            <input id="name" name="name" autoComplete="name" />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="email">
              Email <span className="text-text-soft font-normal text-[0.8em]">(Không bắt buộc)</span>
            </label>
            <input id="email" name="email" type="email" autoComplete="email" />
          </div>
        </div>

        <div className={styles.inlineFields}>
          <div className={styles.fieldGroup}>
            <label htmlFor="skuOrLot">SKU hoặc mã lô</label>
            <input id="skuOrLot" name="skuOrLot" defaultValue={skuOrLot} required />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="source">Nguồn quét</label>
            <input id="source" name="source" defaultValue={source || "qr"} required />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="contentViewed">Nội dung đã xem</label>
          <input id="contentViewed" name="contentViewed" defaultValue={contentViewed} readOnly required />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="sensoryFeedback">Cảm nhận giác quan</label>
          <textarea
            id="sensoryFeedback"
            name="sensoryFeedback"
            required
            placeholder="Hương, vị, màu nước, cảm giác mở gói hoặc trải nghiệm nhận quà..."
          />
        </div>

        <div className={styles.inlineFields}>
          <div className={styles.fieldGroup}>
            <label htmlFor="acceptablePriceRange">Khoảng giá có thể chấp nhận</label>
            <select id="acceptablePriceRange" name="acceptablePriceRange" required defaultValue="">
              <option value="" disabled>
                Chọn khoảng giá
              </option>
              {priceRanges.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="purchaseIntentPurpose">Ý định / mục đích mua</label>
            <select id="purchaseIntentPurpose" name="purchaseIntentPurpose" required defaultValue="">
              <option value="" disabled>
                Chọn mục đích
              </option>
              {purchasePurposes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className={styles.choiceGroup}>
          <legend>Đồng ý sử dụng phản hồi</legend>
          <label>
            <input name="optInConsent" type="checkbox" value="anonymous-follow-up" required />
            <span>
              Tôi đồng ý để Senova tổng hợp phản hồi ở dạng ẩn danh cho hoạt động cải tiến sản phẩm,
              QR follow-up và báo cáo nội bộ.
            </span>
          </label>
        </fieldset>

        {error ? <p className={styles.errorText}>{error}</p> : null}
        <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
          <Send aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
