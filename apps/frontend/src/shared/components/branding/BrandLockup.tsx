import { BrandMark } from "@shared/components/branding/BrandMark";
import { cx } from "@shared/utils/classNames";

type BrandLockupProps = {
  className?: string;
  inverse?: boolean;
  size?: "sm" | "md";
};

export function BrandLockup({ className, inverse = false, size = "md" }: BrandLockupProps) {
  return (
    <span className={cx("inline-flex min-w-0 items-center", size === "sm" ? "gap-2.5" : "gap-3", className)}>
      <BrandMark size={size} />
      <span className="grid min-w-0 leading-none">
        <span
          className={cx(
            "font-display font-[560] tracking-[0.16em]",
            size === "sm" ? "text-[0.9rem]" : "text-[1.02rem]",
            inverse ? "text-text-inverse" : "text-primary",
          )}
        >
          SENOVA
        </span>
        <span
          className={cx(
            "mt-1 text-[0.6rem] font-[650] tracking-[0.14em]",
            inverse ? "text-text-inverse-muted" : "text-text-muted",
          )}
        >
          by Calmora
        </span>
      </span>
    </span>
  );
}
