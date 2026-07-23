import { useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { trackEvent } from "@shared/analytics/analytics";
import { QuickFeedback } from "@features/qr/components/QuickFeedback";
import { PetalPackExperience } from "@features/qr/components/PetalPackExperience";
import { RitualTimer } from "@features/qr/components/RitualTimer";
import { useRitualProgress } from "@features/qr/services/useRitualProgress";
import type { SenovaProduct } from "@features/products/data/products";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";
import { DEFAULT_QR_CONTENT_VERSION, type QrExperienceStep } from "@shared/api/qrExperience";
import { useQrExperience } from "@features/qr/services/useQrExperience";
import { useLanguage, type Language } from "@app/providers/LanguageContext";
import { getLocalizedProduct } from "@features/content/i18n";

type ExperiencePageProps = { product?: SenovaProduct };

function preparationText(product: Pick<SenovaProduct, "brewing">, language: Language) {
  const brewing = product.brewing;
  if (!brewing) return language === "vi" ? "Chuẩn bị dụng cụ và làm theo hướng dẫn của phiên bản sản phẩm bạn đang có." : "Prepare your brewing tools and follow the guidance for your product version.";
  const details = [
    brewing.waterVolume ? `${brewing.waterVolume.min}–${brewing.waterVolume.max} ml${language === "vi" ? " nước" : " water"}` : null,
    brewing.waterTemperature ? `${brewing.waterTemperature.min}–${brewing.waterTemperature.max}°C` : null,
    brewing.steepingTime
      ? `${brewing.steepingTime.min}–${brewing.steepingTime.max} ${brewing.steepingTime.unit === "minute" ? (language === "vi" ? "phút" : "minutes") : (language === "vi" ? "giây" : "seconds")}`
      : null,
  ].filter(Boolean);
  return details.length
    ? (language === "vi" ? `Chuẩn bị dụng cụ pha, ${details.join(", ")}.` : `Prepare your brewing tools and ${details.join(", ")}.`)
    : (language === "vi" ? "Làm theo hướng dẫn của phiên bản sản phẩm bạn đang có." : "Follow the guidance for your product version.");
}

function timerSeconds(product: SenovaProduct) {
  const time = product.brewing?.steepingTime;
  if (!time) return 0;
  return time.unit === "minute" ? time.max * 60 : time.max;
}

export default function ExperiencePage({ product }: ExperiencePageProps) {
  const { language } = useLanguage();
  const localizedProduct = product ? getLocalizedProduct(product, language) : undefined;
  const copy = language === "vi"
    ? { eyebrow: "Trải nghiệm", notFound: "Không tìm thấy trải nghiệm sản phẩm.", noMatch: "Đường dẫn trải nghiệm chưa khớp với sản phẩm Senova.", products: "Xem bộ sản phẩm", loading: "Đang tải nội dung…", offline: "Thiết bị đang ngoại tuyến.", loadError: "Chưa thể tải nội dung QR.", checkConnection: "Hãy kiểm tra kết nối rồi thử lại.", unavailable: "Nội dung hiện không khả dụng.", retry: "Thử lại", productPage: "Về trang sản phẩm", support: "Liên hệ hỗ trợ", prepare: "Chuẩn bị", prepareTitle: "Chuẩn bị cho một khoảng chậm", progress: "Tiến trình nghi thức", intro: "Giới thiệu", quickFeedback: "Phản hồi nhanh", complete: "Hoàn tất", step: "Bước", start: "Bắt đầu trải nghiệm", storyOnly: "Chỉ đọc câu chuyện", assumption: "Thông số pha đang được Senova tiếp tục kiểm chứng. Vui lòng sử dụng hướng dẫn của phiên bản sản phẩm bạn đang có.", toFeedback: "Đến phản hồi nhanh", finishStep: "Hoàn thành bước", back: "Quay lại", skip: "Bỏ qua", feedbackTitle: "Ghi lại điều bạn nhớ nhất.", skipFeedback: "Bỏ qua phản hồi", completeTitle: "Khoảng chậm của bạn đã trọn vẹn.", completeText: "Cảm ơn bạn đã dành thời gian quan sát, pha và thưởng thức cùng Senova.", preorder: "Đặt trước", explore: "Khám phá bộ sản phẩm", share: "Chia sẻ câu chuyện", restart: "Bắt đầu lại" }
    : { eyebrow: "Experience", notFound: "Product experience not found.", noMatch: "This experience link does not match a Senova product.", products: "View products", loading: "Loading content…", offline: "Your device is offline.", loadError: "QR content could not be loaded.", checkConnection: "Check your connection and try again.", unavailable: "This content is currently unavailable.", retry: "Try again", productPage: "Back to product", support: "Contact support", prepare: "Prepare", prepareTitle: "Prepare for a quiet pause", progress: "Ritual progress", intro: "Introduction", quickFeedback: "Quick feedback", complete: "Complete", step: "Step", start: "Begin the experience", storyOnly: "Read the story only", assumption: "Senova is still validating these brewing parameters. Please use the guidance included with your product version.", toFeedback: "Continue to quick feedback", finishStep: "Complete step", back: "Back", skip: "Skip", feedbackTitle: "Record what you remember most.", skipFeedback: "Skip feedback", completeTitle: "Your quiet pause is complete.", completeText: "Thank you for taking time to observe, brew and enjoy tea with Senova.", preorder: "Preorder", explore: "Explore products", share: "Share the story", restart: "Start again" };
  const { search } = useRouter();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const batchCode = params.get("batch") ?? "";
  const source = params.get("source") ?? "qr";
  const contentVersion = params.get("version") ?? DEFAULT_QR_CONTENT_VERSION;
  const locale = params.get("locale") === "en" || params.get("locale") === "vi" ? params.get("locale") as Language : language;
  const { content: qrContent, error, isLoading, retry } = useQrExperience(product?.slug, {
    version: contentVersion,
    batch: batchCode,
    locale,
  });
  const contentViewed = params.get("content") ?? qrContent?.contentViewed ?? "unknown-scan";
  const ritualSteps = useMemo<QrExperienceStep[]>(
    () => localizedProduct && qrContent
      ? [
          { label: copy.prepare, title: copy.prepareTitle, text: preparationText(localizedProduct, language) },
          ...qrContent.guidance.steps,
        ]
      : [],
    [copy.prepare, copy.prepareTitle, language, localizedProduct, qrContent],
  );
  const feedbackStep = ritualSteps.length;
  const completeStep = ritualSteps.length + 1;
  const storageKey = `senova.ritual.${product?.slug ?? "unknown"}.${contentVersion}.${batchCode || "default"}`;
  const progress = useRitualProgress(storageKey, completeStep);

  useEffect(() => {
    if (!product || (!qrContent && product.slug !== "petal-pack")) return;
    trackEvent({
      eventName: "experience_intro_view",
      productSlug: product.slug,
      batchCode,
      source,
      contentViewed,
      contentVersion,
    });
  }, [batchCode, contentVersion, contentViewed, product, qrContent, source]);

  if (!product) {
    return (
      <section className={styles.qrPanel}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p><h1>{copy.notFound}</h1>
        <p className={styles.bodyText}>{copy.noMatch}</p>
        <Link href="/products" className={styles.primaryButton}>{copy.products}</Link>
      </section>
    );
  }

  if (product.slug === "petal-pack") {
    return (
      <PetalPackExperience
        batchCode={batchCode}
        contentVersion={contentVersion}
        contentViewed={contentViewed}
        product={product}
      />
    );
  }

  if (isLoading) {
    return <section className={styles.qrPanel} aria-live="polite"><p className={styles.eyebrow}>{copy.eyebrow}</p><h1>{copy.loading}</h1></section>;
  }

  if (error || !qrContent) {
    const offline = typeof navigator !== "undefined" && !navigator.onLine;
    return (
      <section className={styles.qrPanel}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h1>{offline ? copy.offline : copy.loadError}</h1>
        <p className={styles.bodyText}>{offline ? copy.checkConnection : error?.message ?? copy.unavailable}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} onClick={retry}>{copy.retry}</button>
          <Link href={`/products/${product.slug}`} className={styles.secondaryButton}>{copy.productPage}</Link>
          <Link href="/contact?topic=qr-support" className={styles.iconButton}>{copy.support}</Link>
        </div>
      </section>
    );
  }

  const currentStep = progress.step;
  const percent = currentStep < 0 ? 0 : Math.round(((currentStep + 1) / (completeStep + 1)) * 100);
  const activeStep = currentStep >= 0 && currentStep < ritualSteps.length ? ritualSteps[currentStep] : undefined;
  const showTimer = activeStep?.title.toLocaleLowerCase("vi").includes("chờ") && timerSeconds(product) > 0;

  function startRitual() {
    trackEvent({ eventName: "ritual_start", productSlug: product!.slug, batchCode, contentVersion, contentViewed });
    progress.next();
  }

  function completeCurrentStep() {
    if (activeStep) {
      trackEvent({
        eventName: "ritual_step_complete",
        productSlug: product!.slug,
        batchCode,
        contentVersion,
        contentViewed,
        status: activeStep.label,
      });
    }
    progress.next();
  }

  function finishRitual() {
    trackEvent({ eventName: "ritual_complete", productSlug: product!.slug, batchCode, contentVersion, contentViewed });
    progress.goTo(completeStep);
  }

  return (
    <article className="mx-auto grid min-h-[calc(100svh-7rem)] w-full max-w-[48rem] content-center gap-6 py-8">
      <header className="grid gap-3" aria-label={copy.progress}>
        <div className="flex items-center justify-between gap-4 text-sm font-bold text-text-muted">
          <span>{currentStep < 0 ? copy.intro : currentStep === feedbackStep ? copy.quickFeedback : currentStep >= completeStep ? copy.complete : `${copy.step} ${currentStep + 1}/${ritualSteps.length}`}</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[rgba(138,104,37,0.12)]" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${percent}%` }} />
        </div>
      </header>

      {currentStep < 0 ? (
        <section className={styles.formPanel}>
          <p className={styles.eyebrow}>{qrContent.eyebrow}</p>
          <h1 className="mt-3 mb-0 font-display text-[clamp(2.5rem,9vw,4.5rem)] leading-none text-primary-strong">{qrContent.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-text-muted">{qrContent.lede}</p>
          <div className="mt-6 rounded-lg border border-border bg-surface-strong p-5">
            {qrContent.story.paragraphs.map((paragraph) => <p className="leading-relaxed text-text-muted" key={paragraph}>{paragraph}</p>)}
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} onClick={startRitual}>{copy.start}<ArrowRight aria-hidden="true" /></button>
            <Link href="/story" className={styles.secondaryButton}>{copy.storyOnly}</Link>
          </div>
        </section>
      ) : activeStep ? (
        <section className={styles.formPanel}>
          <p className={styles.eyebrow}>{activeStep.label}</p>
          <h1 className="mt-3 mb-0 font-display text-[clamp(2.4rem,8vw,4rem)] leading-none text-primary-strong">{activeStep.title}</h1>
          <p className="mt-6 text-lg leading-[1.8] text-text-muted">{activeStep.text}</p>
          {currentStep === 0 && product.brewing?.isAssumption ? (
            <p className="mt-5 rounded-lg border border-border bg-surface-strong p-4 text-sm leading-relaxed text-text-muted">
              {copy.assumption}
            </p>
          ) : null}
          {showTimer ? <RitualTimer seconds={timerSeconds(product)} /> : null}
          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} onClick={completeCurrentStep}>
              {currentStep === ritualSteps.length - 1 ? copy.toFeedback : copy.finishStep}<ArrowRight aria-hidden="true" />
            </button>
            <button type="button" className={styles.secondaryButton} onClick={progress.previous}><ArrowLeft aria-hidden="true" />{copy.back}</button>
            <button type="button" className={styles.iconButton} onClick={progress.next}>{copy.skip}</button>
          </div>
        </section>
      ) : currentStep === feedbackStep ? (
        <section className={styles.formPanel}>
          <p className={styles.eyebrow}>{copy.quickFeedback}</p>
          <h1 className="mt-3 mb-0 font-display text-[clamp(2.4rem,8vw,4rem)] leading-none text-primary-strong">{copy.feedbackTitle}</h1>
          <QuickFeedback
            product={product}
            batchCode={batchCode}
            contentVersion={contentVersion}
            contentViewed={contentViewed}
            locale={locale}
            onSubmitted={finishRitual}
          />
          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={finishRitual}>{copy.skipFeedback}</button>
            <button type="button" className={styles.iconButton} onClick={progress.previous}><ArrowLeft aria-hidden="true" />{copy.back}</button>
          </div>
        </section>
      ) : (
        <section className={`${styles.formPanel} text-center`}>
          <Check aria-hidden="true" className="mx-auto h-10 w-10 text-primary" />
          <p className={styles.eyebrow}>{copy.complete}</p>
          <h1 className="mx-auto mt-3 mb-0 max-w-[14ch] font-display text-[clamp(2.5rem,9vw,4.5rem)] leading-none text-primary-strong">{copy.completeTitle}</h1>
          <p className="mx-auto mt-5 max-w-[36rem] leading-relaxed text-text-muted">{copy.completeText}</p>
          <div className={`${styles.actions} justify-center`}>
            <Link
              href={`/order-request?product=${product.slug}&quantity=1&intent=personal&source=qr`}
              className={styles.primaryButton}
              onClick={() => trackEvent({
                eventName: "order_request_click",
                productSlug: product.slug,
                batchCode,
                contentVersion,
                contentViewed,
                source: "qr",
              })}
            >
              {copy.preorder} {localizedProduct?.name ?? product.name}<ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/products" className={styles.secondaryButton}>{copy.explore}</Link>
            <Link href="/story" className={styles.iconButton}>{copy.share}</Link>
          </div>
          <button type="button" className="mx-auto mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-text-muted" onClick={progress.restart}><RotateCcw aria-hidden="true" className="h-4 w-4" />{copy.restart}</button>
        </section>
      )}
    </article>
  );
}
