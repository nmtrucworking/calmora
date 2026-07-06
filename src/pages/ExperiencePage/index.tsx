import { useEffect, useState, useRef } from "react";
import { ArrowRight, Check, MessageSquare, Play, Pause, RotateCcw, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "../../contexts/RouterContext";
import { useRouter } from "../../contexts/RouterState";
import { trackEvent } from "../../features/analytics/analytics";
import type { SenovaProduct } from "../../features/products/data/products";
import { systemStyles as styles } from "../../styles/systemPageClasses";

type ExperiencePageProps = {
  product?: SenovaProduct;
};

// Web Audio API alarm sound synthesizer to avoid loading heavy audio assets
function playAlarmSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.24, ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
    
    gain.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.24, ctx.currentTime + 0.55);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
    console.error("Failed to play alarm sound", e);
  }
}

function BrewTimer({ duration, isSoundOn, setIsSoundOn }: { duration: number; isSoundOn: boolean; setIsSoundOn: (v: boolean) => void }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [duration]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) window.clearInterval(timerRef.current);
            if (isSoundOn) playAlarmSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isRunning, isSoundOn]);

  const handleStartPause = () => setIsRunning(!isRunning);
  
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / duration) * 100;
  const strokeDashoffset = 283 - (283 * progress) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[rgba(255,250,240,0.02)] border border-[rgba(255,250,240,0.08)] rounded-lg gap-4 mt-6 max-w-[20rem] mx-auto">
      <div className="relative h-28 w-28 flex items-center justify-center">
        <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-[rgba(255,250,240,0.04)] fill-none stroke-[5]"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-[var(--accent)] fill-none stroke-[5] transition-[stroke-dashoffset] duration-1000 ease-linear"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="font-display text-[1.8rem] font-[450] text-[var(--accent)] tabular-nums z-10">
          {minutes}:{String(seconds).padStart(2, "0")}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleStartPause}
          className="inline-flex h-9 min-w-20 items-center justify-center rounded-full bg-primary px-4 py-1 text-[0.8rem] font-bold text-on-primary hover:bg-primary-strong transition-colors cursor-pointer"
        >
          {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
          {isRunning ? "Tạm dừng" : "Bắt đầu"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-transparent text-text hover:bg-[var(--surface-tint)] transition-colors cursor-pointer"
          title="Đặt lại"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsSoundOn(!isSoundOn)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-transparent text-text hover:bg-[var(--surface-tint)] transition-colors cursor-pointer"
          title={isSoundOn ? "Tắt âm báo" : "Bật âm báo"}
        >
          {isSoundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>

      {timeLeft === 0 && (
        <span className="text-[0.82rem] text-accent-strong font-extrabold animate-pulse mt-1">
          Trà đã pha xong! Hãy thưởng thức.
        </span>
      )}
    </div>
  );
}

export default function ExperiencePage({ product }: ExperiencePageProps) {
  const { search } = useRouter();
  const batchCode = new URLSearchParams(search).get("batch") ?? undefined;
  const [activeStep, setActiveStep] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);

  useEffect(() => {
    if (product) {
      trackEvent({
        eventName: "experience_start",
        productSlug: product.slug,
        batchCode,
      });
    }
  }, [batchCode, product]);

  if (!product) {
    return (
      <section className={styles.qrPanel}>
        <p className={styles.eyebrow}>Trải nghiệm</p>
        <h1>Không tìm thấy trải nghiệm sản phẩm.</h1>
        <p className={styles.bodyText}>Đường dẫn trải nghiệm chưa khớp với sản phẩm Senova.</p>
        <Link href="/products" className={styles.primaryButton}>
          Xem bộ sản phẩm
        </Link>
      </section>
    );
  }

  const currentStep = product.experienceSteps[activeStep];
  const totalSteps = product.experienceSteps.length;
  
  // Display Brew Timer on steps related to brewing or steeping ("pha", "chờ", "ngâm", "giữ")
  const showTimer = currentStep && (
    currentStep.title.toLowerCase().includes("pha") || 
    currentStep.title.toLowerCase().includes("chờ") ||
    currentStep.title.toLowerCase().includes("chậm")
  );

  // Set default duration based on product
  const timerDuration = product.id === "petal-pack" ? 300 : (product.id === "classic" ? 270 : 300);

  const handleNext = () => {
    trackEvent({
      eventName: "instruction_step_view",
      productSlug: product.slug,
      source: `step-${activeStep + 1}: ${currentStep?.title || ""}`,
    });
    
    if (activeStep < totalSteps - 1) {
      setActiveStep(activeStep + 1);
    } else {
      document.getElementById("feedback-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <article className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Trải nghiệm QR / {product.role}</p>
          <h1>{product.name}</h1>
          <p className={styles.heroDescription}>{product.shortDescription}</p>
          {batchCode ? <p className={styles.successText}>Mã lô: {batchCode}</p> : null}
          <div className={styles.actions}>
            <a href="#experience-stepper" className={styles.primaryButton}>
              Bắt đầu nghi thức
              <ArrowRight aria-hidden="true" />
            </a>
            <Link href="/ritual" className={styles.secondaryButton}>
              Xem nghi thức chung
            </Link>
          </div>
        </div>
        <aside className={styles.heroAside}>
          <img src={product.image} alt={product.heroAlt} loading="eager" style={{ width: "100%" }} />
          {product.status === "draft" ? (
            <span className={styles.statusBadge}>Phiên bản đang hoàn thiện</span>
          ) : null}
        </aside>
      </section>

      {/* Stepper container */}
      <section id="experience-stepper" className="scroll-mt-28 grid gap-6 max-w-[48rem] mx-auto w-full">
        <div className="flex items-center justify-between gap-2 border-b border-border pb-4 w-full">
          <p className="m-0 text-[0.88rem] font-bold text-primary-strong">Nghi thức pha trà</p>
          <div className="flex items-center gap-1.5">
            {product.experienceSteps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border text-[0.82rem] font-extrabold transition-colors cursor-pointer ${
                  idx === activeStep
                    ? "border-[var(--accent)] bg-[var(--accent)] text-text-inverse shadow-[0_0_12px_rgba(248,223,147,0.2)]"
                    : idx < activeStep
                    ? "border-accent-strong bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-border-strong text-text-soft hover:border-text"
                }`}
                aria-label={`Bước ${idx + 1}`}
              >
                {idx < activeStep ? <Check className="h-3.5 w-3.5" /> : idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Active step panel */}
        {currentStep && (
          <article className="relative min-h-[22rem] flex flex-col justify-between rounded-lg p-6 bg-[var(--surface-paper)] border border-border shadow-brand-md overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-0 h-1 bg-[var(--accent)] transition-all duration-300" style={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }} />
            
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-[0.74rem] font-extrabold uppercase tracking-[0.16em] text-accent-gold">
                  Nghi thức {activeStep + 1} / {totalSteps}
                </span>
                <span className="font-display text-[1.8rem] font-[430] text-accent-gold/30">
                  {String(activeStep + 1).padStart(2, "0")}
                </span>
              </div>
              
              <h2 className="font-display text-[1.8rem] font-[430] text-primary-strong mb-4">{currentStep.title}</h2>
              <p className="text-text-muted leading-[1.7] text-[0.98rem] mb-6">{currentStep.text}</p>
              
              {showTimer && (
                <BrewTimer 
                  duration={timerDuration} 
                  isSoundOn={isSoundOn} 
                  setIsSoundOn={setIsSoundOn} 
                />
              )}
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-5 border-t border-border w-full">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeStep === 0}
                className={`inline-flex min-h-9 items-center gap-1.5 text-[0.88rem] font-bold transition-colors cursor-pointer ${
                  activeStep === 0 ? "text-text-soft cursor-not-allowed opacity-40" : "text-primary-strong hover:text-[var(--accent)]"
                }`}
              >
                <ChevronLeft className="h-4 w-4" /> Quay lại
              </button>
              
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-[0.88rem] font-bold text-on-primary hover:bg-primary-strong transition-colors cursor-pointer"
              >
                {activeStep === totalSteps - 1 ? (
                  <>Hoàn thành nghi thức <Check className="h-4 w-4" /></>
                ) : (
                  <>Tiếp theo <ChevronRight className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </article>
        )}
      </section>

      {/* Feedback section */}
      <section id="feedback-section" className={`${styles.panel} scroll-mt-28`}>
        <p className={styles.eyebrow}>Sau trải nghiệm</p>
        <h2>Ghi lại điều bạn cảm nhận được.</h2>
        <p>
          Phản hồi được lưu theo sản phẩm và mã lô để Senova hiểu rõ hơn cách người dùng mở,
          pha và thưởng thức từng phiên bản.
        </p>
        <div className={styles.actions}>
          <Link href={`/feedback/${product.slug}${batchCode ? `?batch=${batchCode}` : ""}`} className={styles.primaryButton}>
            Gửi phản hồi nhanh
            <MessageSquare aria-hidden="true" />
          </Link>
          <Link href={product.href} className={styles.secondaryButton}>
            Xem chi tiết sản phẩm
          </Link>
        </div>
      </section>

      <section className={styles.cardGrid} aria-label="Điểm cần lưu ý">
        {product.highlights.slice(0, 3).map((highlight) => (
          <article className={styles.panel} key={highlight}>
            <Check aria-hidden="true" className="text-accent" />
            <p>{highlight}</p>
          </article>
        ))}
      </section>
    </article>
  );
}
