import type { ReactNode } from "react";
import { Link } from "../../contexts/RouterContext";
import { cx } from "../../utils/classNames";

type LuxuryButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "dark" | "light";
  className?: string;
  onClick?: () => void;
};

const baseClass =
  "inline-flex min-h-11 items-center justify-center gap-2 text-[0.88rem] font-[650] no-underline transition-[background,border-color,color,box-shadow] duration-[420ms] ease-[var(--ease-luxury)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(175,149,88,0.42)] focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const variantClass = {
  primary:
    "border border-primary bg-primary px-[1.15rem] py-[0.82rem] text-on-primary hover:bg-primary-strong",
  secondary:
    "border-0 border-b border-current bg-transparent px-0 py-[0.6rem] text-primary-strong hover:text-accent-strong",
  dark:
    "border border-accent-gold bg-accent-gold px-[1.15rem] py-[0.82rem] text-[var(--senova-forest-black)] hover:bg-[var(--senova-gold-light)]",
  light:
    "border border-[rgba(243,239,229,0.46)] bg-transparent px-[1.15rem] py-[0.82rem] text-text-inverse hover:border-accent-gold hover:text-accent-gold",
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
