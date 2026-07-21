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

type ExperiencePageProps = { product?: SenovaProduct };

function preparationText(product: SenovaProduct) {
  const brewing = product.brewing;
  if (!brewing) return "Chuẩn bị dụng cụ và làm theo hướng dẫn của phiên bản sản phẩm bạn đang có.";
  const details = [
    brewing.waterVolume ? `${brewing.waterVolume.min}–${brewing.waterVolume.max} ml nước` : null,
    brewing.waterTemperature ? `${brewing.waterTemperature.min}–${brewing.waterTemperature.max}°C` : null,
    brewing.steepingTime
      ? `${brewing.steepingTime.min}–${brewing.steepingTime.max} ${brewing.steepingTime.unit === "minute" ? "phút" : "giây"}`
      : null,
  ].filter(Boolean);
  return details.length ? `Chuẩn bị dụng cụ pha, ${details.join(", ")}.` : "Làm theo hướng dẫn của phiên bản sản phẩm bạn đang có.";
}

function timerSeconds(product: SenovaProduct) {
  const time = product.brewing?.steepingTime;
  if (!time) return 0;
  return time.unit === "minute" ? time.max * 60 : time.max;
}

export default function ExperiencePage({ product }: ExperiencePageProps) {
  const { search } = useRouter();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const batchCode = params.get("batch") ?? "";
  const source = params.get("source") ?? "qr";
  const contentVersion = params.get("version") ?? DEFAULT_QR_CONTENT_VERSION;
  const locale = params.get("locale") === "en" ? "en" : "vi";
  const { content: qrContent, error, isLoading, retry } = useQrExperience(product?.slug, {
    version: contentVersion,
    batch: batchCode,
    locale,
  });
  const contentViewed = params.get("content") ?? qrContent?.contentViewed ?? "unknown-scan";
  const ritualSteps = useMemo<QrExperienceStep[]>(
    () => product && qrContent
      ? [
          { label: "Chuẩn bị", title: "Chuẩn bị cho một khoảng chậm", text: preparationText(product) },
          ...qrContent.guidance.steps,
        ]
      : [],
    [product, qrContent],
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
        <p className={styles.eyebrow}>Trải nghiệm</p><h1>Không tìm thấy trải nghiệm sản phẩm.</h1>
        <p className={styles.bodyText}>Đường dẫn trải nghiệm chưa khớp với sản phẩm Senova.</p>
        <Link href="/products" className={styles.primaryButton}>Xem bộ sản phẩm</Link>
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
    return <section className={styles.qrPanel} aria-live="polite"><p className={styles.eyebrow}>Trải nghiệm</p><h1>Đang tải nội dung…</h1></section>;
  }

  if (error || !qrContent) {
    const offline = typeof navigator !== "undefined" && !navigator.onLine;
    return (
      <section className={styles.qrPanel}>
        <p className={styles.eyebrow}>Trải nghiệm</p>
        <h1>{offline ? "Thiết bị đang ngoại tuyến." : "Chưa thể tải nội dung QR."}</h1>
        <p className={styles.bodyText}>{offline ? "Hãy kiểm tra kết nối rồi thử lại." : error?.message ?? "Nội dung hiện không khả dụng."}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} onClick={retry}>Thử lại</button>
          <Link href={`/products/${product.slug}`} className={styles.secondaryButton}>Về trang sản phẩm</Link>
          <Link href="/contact?topic=qr-support" className={styles.iconButton}>Liên hệ hỗ trợ</Link>
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
      <header className="grid gap-3" aria-label="Tiến trình nghi thức">
        <div className="flex items-center justify-between gap-4 text-sm font-bold text-text-muted">
          <span>{currentStep < 0 ? "Giới thiệu" : currentStep === feedbackStep ? "Phản hồi nhanh" : currentStep >= completeStep ? "Hoàn tất" : `Bước ${currentStep + 1}/${ritualSteps.length}`}</span>
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
            <button type="button" className={styles.primaryButton} onClick={startRitual}>Bắt đầu trải nghiệm<ArrowRight aria-hidden="true" /></button>
            <Link href="/story" className={styles.secondaryButton}>Chỉ đọc câu chuyện</Link>
          </div>
        </section>
      ) : activeStep ? (
        <section className={styles.formPanel}>
          <p className={styles.eyebrow}>{activeStep.label}</p>
          <h1 className="mt-3 mb-0 font-display text-[clamp(2.4rem,8vw,4rem)] leading-none text-primary-strong">{activeStep.title}</h1>
          <p className="mt-6 text-lg leading-[1.8] text-text-muted">{activeStep.text}</p>
          {currentStep === 0 && product.brewing?.isAssumption ? (
            <p className="mt-5 rounded-lg border border-border bg-surface-strong p-4 text-sm leading-relaxed text-text-muted">
              Thông số pha đang được Senova tiếp tục kiểm chứng. Vui lòng sử dụng hướng dẫn của phiên bản sản phẩm bạn đang có.
            </p>
          ) : null}
          {showTimer ? <RitualTimer seconds={timerSeconds(product)} /> : null}
          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} onClick={completeCurrentStep}>
              {currentStep === ritualSteps.length - 1 ? "Đến phản hồi nhanh" : "Hoàn thành bước"}<ArrowRight aria-hidden="true" />
            </button>
            <button type="button" className={styles.secondaryButton} onClick={progress.previous}><ArrowLeft aria-hidden="true" />Quay lại</button>
            <button type="button" className={styles.iconButton} onClick={progress.next}>Bỏ qua</button>
          </div>
        </section>
      ) : currentStep === feedbackStep ? (
        <section className={styles.formPanel}>
          <p className={styles.eyebrow}>Phản hồi nhanh</p>
          <h1 className="mt-3 mb-0 font-display text-[clamp(2.4rem,8vw,4rem)] leading-none text-primary-strong">Ghi lại điều bạn nhớ nhất.</h1>
          <QuickFeedback
            product={product}
            batchCode={batchCode}
            contentVersion={contentVersion}
            contentViewed={contentViewed}
            locale={locale}
            onSubmitted={finishRitual}
          />
          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={finishRitual}>Bỏ qua phản hồi</button>
            <button type="button" className={styles.iconButton} onClick={progress.previous}><ArrowLeft aria-hidden="true" />Quay lại</button>
          </div>
        </section>
      ) : (
        <section className={`${styles.formPanel} text-center`}>
          <Check aria-hidden="true" className="mx-auto h-10 w-10 text-primary" />
          <p className={styles.eyebrow}>Hoàn tất</p>
          <h1 className="mx-auto mt-3 mb-0 max-w-[14ch] font-display text-[clamp(2.5rem,9vw,4.5rem)] leading-none text-primary-strong">Khoảng chậm của bạn đã trọn vẹn.</h1>
          <p className="mx-auto mt-5 max-w-[36rem] leading-relaxed text-text-muted">Cảm ơn bạn đã dành thời gian quan sát, pha và thưởng thức cùng Senova.</p>
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
              Đặt trước {product.name}<ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/products" className={styles.secondaryButton}>Khám phá bộ sản phẩm</Link>
            <Link href="/story" className={styles.iconButton}>Chia sẻ câu chuyện</Link>
          </div>
          <button type="button" className="mx-auto mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-text-muted" onClick={progress.restart}><RotateCcw aria-hidden="true" className="h-4 w-4" />Bắt đầu lại</button>
        </section>
      )}
    </article>
  );
}
