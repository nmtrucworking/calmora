import type { ReactNode } from "react";
import { cx } from "@shared/utils/classNames";

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return (
    <p
      className={cx(
        "m-0 text-[0.75rem] font-[650] uppercase tracking-[0.24em] text-accent-gold",
        className,
      )}
    >
      {children}
    </p>
  );
}
