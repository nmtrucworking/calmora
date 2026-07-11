import { StaggerContainer, StaggerItem } from "@shared/components/ui/ZenMotion";
import { cx } from "@shared/utils/classNames";
import { SectionEyebrow } from "./SectionEyebrow";

type ProductStatementProps = {
  eyebrow: string;
  title: string;
  text: string;
  dark?: boolean;
  className?: string;
};

export function ProductStatement({ eyebrow, title, text, dark = false, className }: ProductStatementProps) {
  return (
    <StaggerContainer className={cx("max-w-[48rem]", className)} staggerDelay={0.08}>
      <StaggerItem>
        <SectionEyebrow className={dark ? "text-accent-gold" : undefined}>{eyebrow}</SectionEyebrow>
      </StaggerItem>
      <StaggerItem>
        <h2
          className={cx(
            "mt-4 mb-0 font-display text-[clamp(1.9rem,4vw,3.45rem)] font-[430] leading-[1.06] text-text",
            dark && "text-text-inverse",
          )}
        >
          {title}
        </h2>
      </StaggerItem>
      <StaggerItem>
        <p
          className={cx(
            "mt-5 mb-0 max-w-[42rem] text-[1rem] leading-[1.76] text-text-muted",
            dark && "!text-[rgba(255,250,240,0.86)] [text-shadow:0_1px_18px_rgba(0,0,0,0.32)]",
          )}
        >
          {text}
        </p>
      </StaggerItem>
    </StaggerContainer>
  );
}
