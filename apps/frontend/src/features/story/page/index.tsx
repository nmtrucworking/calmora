import { ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import content from "@features/content/content.json";
import { imageManifest } from "@features/content/imageManifest";
import { ResponsiveImage } from "@shared/components/media/ResponsiveImage";
import { SectionHeading } from "@shared/components/ui/SectionHeading";
import { InfoCard } from "@shared/components/ui/InfoCard";
import { useLanguage } from "@app/providers/LanguageContext";

const StoryLotusCanvas = lazy(() =>
  import("@shared/components/story/StoryLotusCanvas").then((module) => ({
    default: module.StoryLotusCanvas,
  })),
);

const lifeCycleVi = [
  {
    label: "01 · Ủ mầm",
    title: "Bắt đầu trong lớp bùn sâu.",
    text: "Sen khởi đầu ở nơi chưa ai nhìn thấy. Rễ bám vào đất, giữ lại ký ức của mùa trước để chuẩn bị cho một vòng đời mới.",
  },
  {
    label: "02 · Vươn lên",
    title: "Đi qua mặt nước để tìm ánh sáng.",
    text: "Thân sen vươn qua tầng nước, mang theo chất liệu cũ nhưng chọn một hình hài mới — như cách Senova đưa văn hóa trà vào nhịp sống hiện tại.",
  },
  {
    label: "03 · Nở",
    title: "Từng lớp cánh mở theo nhịp khám phá.",
    text: "Hoa không nở theo đồng hồ. Mỗi nhịp cuộn mở thêm một lớp cánh, biến hành động xem thành một khoảng dừng để chạm, ngửi và cảm nhận.",
  },
  {
    label: "04 · Trao hạt",
    title: "Khép một mùa để bắt đầu câu chuyện khác.",
    text: "Cánh rời hoa, hạt ở lại. Hương sen và câu chuyện được trao từ người này sang người khác, để vòng đời tiếp tục trong một chén trà mới.",
  },
];

const lifeCycleEn = [
  { label: "01 · Germinate", title: "Beginning deep in the mud.", text: "The lotus begins where no one can see. Its roots hold the memory of the previous season while preparing for a new cycle." },
  { label: "02 · Rise", title: "Passing through water in search of light.", text: "The stem rises through the water, carrying old material into a new form — as Senova brings tea culture into contemporary life." },
  { label: "03 · Bloom", title: "Each layer opens with discovery.", text: "The flower does not bloom by the clock. Each scroll opens another layer, turning viewing into a pause to touch, smell and sense." },
  { label: "04 · Share seeds", title: "One season closes as another story begins.", text: "Petals fall while seeds remain. Lotus fragrance and story pass from one person to another, continuing the cycle in a new cup of tea." },
];

const englishStoryData: typeof content.storyPage = {
  kicker: "Our story / Keep — Open — Share",
  eyebrow: "A cultural story",
  title: "A lotus petal opens a Vietnamese story.",
  description: "From an invitation to tea to the Keep — Open — Share journey, Senova brings lotus culture and tea into a contemporary experience to use and give.",
  body: "Senova does not attempt to reproduce an ancient ritual in full, nor attach every product to a place simply to appear local. It connects values that can remain alive today: keeping a familiar fragrance, opening a new experience and sharing a meaningful story.",
  timeline: [
    { label: "01", title: "Keep", text: "Senova Classic keeps lotus tea as the foundation: an approachable drink for everyday life." },
    { label: "02", title: "Open", text: "Senova Petal Pack turns one cup into a sequence of opening, sensing, brewing, waiting and enjoying." },
    { label: "03", title: "Share", text: "Senova Gift Set brings tea, Petal Pack, brewing guidance and story cards into a meaningful gift." },
  ],
};

export default function StoryPage() {
  const { language } = useLanguage();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const lifeCycleRef = useRef<HTMLElement>(null);
  const storyData = language === "vi" ? content.storyPage : englishStoryData;
  const lifeCycle = language === "vi" ? lifeCycleVi : lifeCycleEn;
  const ui = language === "vi"
    ? { scroll: "Cuộn để theo dõi vòng đời của sen", aria: "Vòng đời hoa sen", loading: "Đang dựng bông sen...", progress: "Vòng đời sen", fallbackAlt: "Senova Petal Pack thay thế cho hoạt cảnh vòng đời hoa sen" }
    : { scroll: "Scroll through the lotus life cycle", aria: "Lotus life cycle", loading: "Rendering the lotus...", progress: "Lotus life cycle", fallbackAlt: "Senova Petal Pack as an alternative to the animated lotus life cycle" };
  const { scrollYProgress } = useScroll({
    target: lifeCycleRef,
    offset: ["start start", "end end"],
  });
  const progressScale = useTransform(scrollYProgress, [0, 1], [0.02, 1]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return (
    <div>
      <header className="grid min-h-[calc(82svh-6rem)] content-center py-16 max-[760px]:min-h-[72svh] max-[760px]:py-10">
        <div className="max-w-[48rem]">
          <p className="mt-0 mb-4 text-[0.75rem] uppercase tracking-[0.26em] text-accent-strong">
            {storyData.kicker}
          </p>
          <SectionHeading
            eyebrow={storyData.eyebrow}
            title={storyData.title}
            description={storyData.description}
          />
          <p className="mt-5 mb-0 max-w-[42rem] text-base leading-[1.8] text-text-muted">
            {storyData.body}
          </p>
          <p className="mt-9 mb-0 inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.2em] text-text-soft">
            <ArrowDown aria-hidden="true" className="h-4 w-4 animate-bounce motion-reduce:animate-none" />
            {ui.scroll}
          </p>
        </div>
      </header>

      <section
        ref={lifeCycleRef}
        className={
          prefersReducedMotion
            ? "grid gap-8 pb-16"
            : "relative grid grid-cols-[minmax(0,0.88fr)_minmax(24rem,1.12fr)] items-start gap-8 max-[900px]:block"
        }
        aria-label={ui.aria}
      >
        {!prefersReducedMotion ? (
          <div className="sticky top-[5.2rem] z-0 col-start-2 row-start-1 h-[calc(100svh-6.4rem)] overflow-hidden rounded-[var(--radius-md)] border border-border bg-[radial-gradient(circle_at_50%_42%,rgba(255,251,242,0.96),rgba(235,230,216,0.72))] max-[900px]:top-[4.2rem] max-[900px]:h-[56svh]">
            <Suspense
              fallback={
                <div className="grid h-full place-items-center text-text-muted">
                  {ui.loading}
                </div>
              }
            >
              <StoryLotusCanvas
                className="h-full min-h-0"
                scrollProgress={scrollYProgress}
                showBackdrop
              />
            </Suspense>

            <div
              className="pointer-events-none absolute top-1/2 right-4 z-10 flex -translate-y-1/2 items-center gap-2"
              aria-hidden="true"
            >
              <div className="h-28 w-px overflow-hidden bg-[rgba(31,95,68,0.18)]">
                <motion.div
                  className="h-full w-full origin-top bg-accent-strong"
                  style={{ scaleY: progressScale }}
                />
              </div>
              <span className="[writing-mode:vertical-rl] text-[0.58rem] uppercase tracking-[0.2em] text-text-soft max-[520px]:hidden">
                {ui.progress}
              </span>
            </div>
          </div>
        ) : (
          <figure className="m-0 overflow-hidden rounded-[var(--radius-md)] border border-border bg-[var(--surface-paper)]">
            <ResponsiveImage
              asset={imageManifest["product-petal-pack"]}
              alt={ui.fallbackAlt}
              className="aspect-[4/3] h-full w-full object-cover saturate-[0.86]"
              loading="lazy"
              sizes="(max-width: 980px) 100vw, 50vw"
            />
          </figure>
        )}

        <div
          className={
            prefersReducedMotion
              ? "grid gap-5"
              : "col-start-1 row-start-1 max-[900px]:relative max-[900px]:z-10 max-[900px]:-mt-[56svh]"
          }
        >
          {lifeCycle.map((stage) => (
            <div
              key={stage.label}
              className={
                prefersReducedMotion
                  ? ""
                  : "grid min-h-[calc(100svh-6.4rem)] content-center py-16 max-[900px]:min-h-[100svh] max-[900px]:content-end max-[900px]:pb-12"
              }
            >
              <div className="max-w-[31rem] rounded-[var(--radius-md)] bg-[rgba(255,253,248,0.9)] p-1 backdrop-blur-[3px] max-[900px]:border-l max-[900px]:border-accent max-[900px]:p-3">
                <InfoCard label={stage.label} title={stage.title} text={stage.text} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
