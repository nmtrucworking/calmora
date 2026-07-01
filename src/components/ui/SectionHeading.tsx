import { cx } from "../../utils/classNames";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  level?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  level = "h1",
}: SectionHeadingProps) {
  const TitleTag = level;

  return (
    <header
      className={cx(
        "grid gap-[0.85rem]",
        align === "center" && "justify-items-center text-center",
        align === "left" && "justify-items-start",
      )}
    >
      <p className="m-0 text-[0.8rem] uppercase tracking-[0.24em] text-accent-gold">{eyebrow}</p>
      <TitleTag className="m-0 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.95] text-text">
        {title}
      </TitleTag>
      {description ? (
        <p className="m-0 max-w-[42rem] text-base leading-[1.75] text-text-muted">{description}</p>
      ) : null}
    </header>
  );
}
