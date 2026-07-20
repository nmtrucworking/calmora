import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import type { SenovaProduct } from "@features/products/data/products";
import { submitForm } from "@shared/api/submissions";
import { trackEvent } from "@shared/analytics/analytics";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";

const memorableOptions = [
  ["shape", "Hình dáng búp sen"],
  ["aroma", "Hương"],
  ["opening", "Thao tác tách nhẹ"],
  ["color", "Màu nước"],
  ["taste", "Vị trà"],
  ["story", "Câu chuyện"],
] as const;

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
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const mostMemorable = String(form.get("mostMemorable") ?? "");
    const clarityScore = Number(form.get("clarityScore") ?? 0);
    if (!mostMemorable || clarityScore < 1 || clarityScore > 5) {
      setError("Vui lòng chọn điều đáng nhớ nhất và mức độ dễ hiểu.");
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
      setError(result.error?.message ?? "Phản hồi chưa thể gửi. Vui lòng thử lại.");
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
        <h2 className="m-0 font-display text-3xl text-primary-strong">Cảm ơn bạn đã chia sẻ.</h2>
        <p className="m-0 text-text-muted">Phản hồi đã được ghi nhận mà không làm gián đoạn trải nghiệm.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset className={styles.choiceGroup}>
        <legend>Điều khiến bạn nhớ nhất là gì?</legend>
        {memorableOptions.map(([value, label]) => (
          <label key={value}><input type="radio" name="mostMemorable" value={value} required /><span>{label}</span></label>
        ))}
      </fieldset>
      <fieldset className={styles.choiceGroup}>
        <legend>Trải nghiệm có dễ hiểu không?</legend>
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
        <span>Bạn muốn chia sẻ thêm điều gì? (không bắt buộc)</span>
        <textarea name="comment" />
      </label>
      {error ? <p className={styles.errorText} role="alert">{error}</p> : null}
      <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Đang gửi…" : "Gửi phản hồi nhanh"}<Send aria-hidden="true" />
      </button>
    </form>
  );
}
