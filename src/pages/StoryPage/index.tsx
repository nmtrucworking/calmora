import { RotateCw } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { InfoCard } from "../../components/ui/InfoCard";
import { SectionHeading } from "../../components/ui/SectionHeading";
import content from "../../data/content.json";
import { StaggerContainer, StaggerItem } from "../../components/ui/ZenMotion";
import { luxuryMotion } from "../../styles/luxuryEffects";
import { cx } from "../../utils/classNames";

const StoryLotusCanvas = lazy(() =>
  import("../../components/story/StoryLotusCanvas").then((module) => ({
    default: module.StoryLotusCanvas,
  })),
);

export default function StoryPage() {
  const [restartSignal, setRestartSignal] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const storyData = content.storyPage;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return (
    <div className="grid gap-10">
      <section className="grid min-h-[calc(100svh-11rem)] grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] items-start gap-7 py-11 max-[980px]:min-h-0 max-[980px]:grid-cols-1">
        <div className="max-w-[42rem]">
          <p className="mt-0 mb-4 text-[0.75rem] uppercase tracking-[0.26em] text-accent-gold">
            {storyData.kicker}
          </p>
          <SectionHeading
            eyebrow={storyData.eyebrow}
            title={storyData.title}
            description={storyData.description}
          />
          <p className="mt-5 mb-0 max-w-[38rem] text-base leading-[1.8] text-text-muted">
            {storyData.body}
          </p>

          <StaggerContainer
            className="mt-7 grid grid-cols-3 gap-[0.9rem] max-[980px]:grid-cols-1 [&_article]:px-4 [&_article]:pt-4 [&_article]:pb-[0.95rem]"
            aria-label="Cac giai doan cua bong sen"
          >
            {storyData.timeline.map((item) => (
              <StaggerItem key={item.label}>
                <InfoCard label={item.label} title={item.title} text={item.text} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        <div className="relative grid content-start gap-[0.9rem] [&>*]:sticky [&>*]:top-[6.4rem] max-[980px]:[&>*]:relative max-[980px]:[&>*]:top-auto">
          <div className="sticky top-[6.4rem] max-[980px]:relative max-[980px]:top-auto">
            {prefersReducedMotion ? (
              <figure className="m-0 min-h-[30rem] overflow-hidden rounded-[var(--radius-md)] border border-border bg-[var(--surface-paper)]">
                <img
                  src="/assets/products/petal-pack-optimized.jpg"
                  alt="Senova Petal Pack trong vai trò hình ảnh thay thế cho hoạt cảnh hoa sen"
                  className="h-full min-h-[30rem] w-full object-cover saturate-[0.86]"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ) : (
              <Suspense
                fallback={
                  <div className="grid min-h-[30rem] place-items-center rounded-[var(--radius-md)] border border-border bg-[var(--surface-paper)] text-text-muted">
                    Đang dựng bông sen...
                  </div>
                }
              >
                <StoryLotusCanvas
                  className="min-h-[39rem] max-[980px]:min-h-[30rem]"
                  restartSignal={restartSignal}
                />
              </Suspense>
            )}
          </div>
          {!prefersReducedMotion ? (
            <div className="flex items-center justify-center">
              <button
                className={cx("inline-flex min-h-11 cursor-pointer items-center gap-[0.6rem] rounded-[var(--radius-sm)] border border-border bg-transparent px-[0.85rem] py-2 text-text hover:bg-[var(--surface-tint)]", luxuryMotion.button)}
                aria-label="Khởi động lại hoạt cảnh"
                onClick={() => setRestartSignal((s) => s + 1)}
              >
                <RotateCw className="h-4 w-4" />
                <span className="text-[0.9rem] font-semibold">Khởi động lại</span>
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
