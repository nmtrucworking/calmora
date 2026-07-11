import type { ReactNode } from "react";
import { Link } from "@app/router/RouterContext";
import { cx } from "@shared/utils/classNames";

type LuxuryButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "dark" | "light";
  className?: string;
  onClick?: () => void;
};

const baseClass =
  "relative isolate inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden text-[0.88rem] font-[720] tracking-normal no-underline shadow-[0_14px_32px_rgba(7,17,15,0.16)] transition-[background,border-color,color,box-shadow,transform,gap] duration-[520ms] ease-[var(--ease-luxury)] before:absolute before:inset-[1px] before:z-[-1] before:rounded-[calc(var(--radius-sm)-1px)] before:border before:border-[rgba(255,250,240,0.18)] before:content-[''] after:absolute after:inset-y-0 after:left-[-45%] after:z-[-1] after:w-[38%] after:skew-x-[-18deg] after:bg-[linear-gradient(90deg,transparent,rgba(255,250,240,0.28),transparent)] after:opacity-0 after:transition-[left,opacity] after:duration-[700ms] after:ease-[var(--ease-luxury)] hover:-translate-y-0.5 hover:gap-3 hover:shadow-[0_20px_46px_rgba(7,17,15,0.22)] hover:after:left-[112%] hover:after:opacity-100 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(175,149,88,0.42)] focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg motion-reduce:transition-none motion-reduce:before:transition-none motion-reduce:after:hidden motion-reduce:hover:translate-y-0";

const variantClass = {
  primary:
    "border border-[rgba(11,26,21,0.9)] bg-[linear-gradient(135deg,var(--primary),var(--primary-strong)_58%,#13281f)] px-[1.2rem] py-[0.84rem] text-on-primary hover:border-[rgba(248,223,147,0.42)] hover:bg-[linear-gradient(135deg,var(--primary-strong),#1f3a2f_58%,#10221b)]",
  secondary:
    "border border-[rgba(138,104,37,0.28)] bg-[rgba(255,253,248,0.42)] px-[1.05rem] py-[0.78rem] text-primary-strong shadow-[0_12px_28px_rgba(37,31,21,0.08)] hover:border-[rgba(138,104,37,0.5)] hover:bg-[rgba(255,253,248,0.72)] hover:text-accent-strong",
  dark:
    "border border-[rgba(248,223,147,0.92)] bg-[linear-gradient(135deg,var(--senova-gold-light),var(--senova-gold)_46%,#c9a94d)] px-[1.2rem] py-[0.84rem] text-[var(--senova-forest-black)] shadow-[0_16px_40px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,252,246,0.62)] hover:border-[rgba(255,234,171,1)] hover:bg-[linear-gradient(135deg,#fff0bb,var(--senova-gold-light)_48%,#d5b65f)]",
  light:
    "border border-[rgba(243,239,229,0.38)] bg-[rgba(255,250,240,0.06)] px-[1.2rem] py-[0.84rem] text-[rgba(255,250,240,0.92)] shadow-[0_16px_38px_rgba(0,0,0,0.2)] [backdrop-filter:blur(16px)] hover:border-[rgba(248,223,147,0.8)] hover:bg-[rgba(248,223,147,0.1)] hover:text-accent-gold",
} as const;

export function LuxuryButton({
  children,
  href,
  type = "button",
  variant = "primary",
  className,
  onClick,
}: LuxuryButtonProps) {
  const buttonClass = cx(baseClass, variantClass[variant], "rounded-[var(--radius-sm)]", className);

  if (href) {
    return (
      <Link href={href} className={buttonClass} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}
