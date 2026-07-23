import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import type { SenovaProduct } from "@features/products/data/products";
import { submitForm } from "@shared/api/submissions";
import { trackEvent } from "@shared/analytics/analytics";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";

const memorableOptions = {
  vi: [["shape", "Hình dáng búp sen"], ["aroma", "Hương"], ["opening", "Thao tác tách nhẹ"], ["color", "Màu nước"], ["taste", "Vị trà"], ["story", "Câu chuyện"]],
  en: [["shape", "Lotus bud form"], ["aroma", "Aroma"], ["opening", "Gently opening the petals"], ["color", "Tea colour"], ["taste", "Taste"], ["story", "The story"]],
} as const;

type QuickFeedbackProps = {
  product: SenovaProduct;
  batchCode: string;
  contentVersion: string;
  contentViewed: string;
  locale: "vi" | "en";
  onSubmitted: () => void;
};

export function QuickFeedback({
  product,
  batchCode,
  contentVersion,
  contentViewed,
  locale,
  onSubmitted,
}: QuickFeedbackProps) {
  const copy = locale === "vi"
    ? { required: "Vui lòng chọn điều đáng nhớ nhất và mức độ dễ hiểu.", failed: "Phản hồi chưa thể gửi. Vui lòng thử lại.", thanks: "Cảm ơn bạn đã chia sẻ.", received: "Phản hồi đã được ghi nhận mà không làm gián đoạn trải nghiệm.", memorable: "Điều khiến bạn nhớ nhất là gì?", clear: "Trải nghiệm có dễ hiểu không?", more: "Bạn muốn chia sẻ thêm điều gì? (không bắt buộc)", sending: "Đang gửi…", submit: "Gửi phản hồi nhanh" }
    : { required: "Please choose what you remember most and rate how clear the experience was.", failed: "Your feedback could not be sent. Please try again.", thanks: "Thank you for sharing.", received: "Your feedback was recorded without interrupting the experience.", memorable: "What do you remember most?", clear: "Was the experience easy to understand?", more: "Would you like to share anything else? (optional)", sending: "Sending…", submit: "Send quick feedback" };
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const mostMemorable = String(form.get("mostMemorable") ?? "");
    const clarityScore = Number(form.get("clarityScore") ?? 0);
    if (!mostMemorable || clarityScore < 1 || clarityScore > 5) {
      setError(copy.required);
      return;
    }
    setError("");
    setIsSubmitting(true);
    const result = await submitForm("feedback", {
      productId: product.id,
      productSlug: product.slug,
      qrCode: batchCode || null,
      batchCode: batchCode || null,
      contentVersion,
      contentViewed,
      completedStep: "complete",
      mostMemorable,
      clarityScore,
      comment: String(form.get("comment") ?? ""),
      locale,
      optInConsent: true,
      timestamp: new Date().toISOString(),
    });
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error?.message ?? copy.failed);
      return;
    }
    trackEvent({
      eventName: "quick_feedback_submit",
      productSlug: product.slug,
      batchCode,
      contentVersion,
      contentViewed,
    });
    setSubmitted(true);
    onSubmitted();
  }

  if (submitted) {
    return (
      <div className="grid justify-items-center gap-3 py-8 text-center" role="status">
        <Check aria-hidden="true" className="h-8 w-8 text-primary" />
        <h2 className="m-0 font-display text-3xl text-primary-strong">{copy.thanks}</h2>
        <p className="m-0 text-text-muted">{copy.received}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset className={styles.choiceGroup}>
        <legend>{copy.memorable}</legend>
        {memorableOptions[locale].map(([value, label]) => (
          <label key={value}><input type="radio" name="mostMemorable" value={value} required /><span>{label}</span></label>
        ))}
      </fieldset>
      <fieldset className={styles.choiceGroup}>
        <legend>{copy.clear}</legend>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <label key={score} className="!grid min-h-11 !grid-cols-1 place-items-center rounded-lg border border-border bg-surface-strong">
              <input className="sr-only" type="radio" name="clarityScore" value={score} required />
              <span>{score}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className={styles.fieldGroup}>
        <span>{copy.more}</span>
        <textarea name="comment" />
      </label>
      {error ? <p className={styles.errorText} role="alert">{error}</p> : null}
      <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
        {isSubmitting ? copy.sending : copy.submit}<Send aria-hidden="true" />
      </button>
    </form>
  );
}
