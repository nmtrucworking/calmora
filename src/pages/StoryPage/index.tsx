import { RotateCw } from "lucide-react";
import { useState } from "react";
import { InfoCard } from "../../components/ui/InfoCard";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { StoryLotusCanvas } from "../../components/story/StoryLotusCanvas";
import content from "../../data/content.json";
import { StaggerContainer, StaggerItem } from "../../components/ui/ZenMotion";

export default function StoryPage() {
  const [restartSignal, setRestartSignal] = useState(0);
  const storyData = content.storyPage;

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
            <StoryLotusCanvas
              className="min-h-[39rem] max-[980px]:min-h-[30rem]"
              restartSignal={restartSignal}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="inline-flex cursor-pointer items-center gap-[0.6rem] rounded-full border-0 bg-[#fffaf00f] px-[0.85rem] py-2 text-text transition-colors duration-150 hover:bg-[#fffaf024]"
              aria-label="Khoi dong lai hoat canh"
              onClick={() => setRestartSignal((s) => s + 1)}
            >
              <RotateCw className="h-4 w-4" />
              <span className="text-[0.9rem] font-semibold">Khoi dong lai</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
