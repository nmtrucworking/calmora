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
            "mt-4 mb-0 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-[430] leading-[1.02] text-text",
            dark && "text-text-inverse",
          )}
        >
          {title}
        </h2>
      </StaggerItem>
      <StaggerItem>
        <p
          className={cx(
            "mt-6 mb-0 max-w-[42rem] text-[1.04rem] leading-[1.8] text-text-muted",
            dark && "text-text-inverse-muted",
          )}
        >
          {text}
        </p>
      </StaggerItem>
    </StaggerContainer>
  );
}
