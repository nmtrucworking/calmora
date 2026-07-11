import { SectionEyebrow } from "./SectionEyebrow";

type RitualStepProps = {
  number: string;
  title: string;
  text: string;
};

export function RitualStep({ number, title, text }: RitualStepProps) {
  return (
    <article className="grid min-h-[17rem] content-between border-t border-border-strong py-6">
      <SectionEyebrow>{number}</SectionEyebrow>
      <div>
        <h3 className="m-0 font-display text-[clamp(1.5rem,3vw,2.15rem)] font-[450] leading-[1.08] text-primary-strong">
          {title}
        </h3>
        <p className="mt-4 mb-0 max-w-[20rem] leading-[1.75] text-text-muted">{text}</p>
      </div>
    </article>
  );
}
