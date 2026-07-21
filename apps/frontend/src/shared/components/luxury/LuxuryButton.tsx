import type { ReactNode } from "react";
import { Link } from "@app/router/RouterContext";
import { cx } from "@shared/utils/classNames";

type LuxuryButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "dark" | "light";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
};

const baseClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] border px-5 py-3 text-[0.88rem] font-[700] no-underline transition-[background,border-color,color,box-shadow,transform] duration-[var(--motion-base)] ease-[var(--ease-luxury)] hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const variantClass = {
  primary:
    "border-primary bg-primary text-on-primary shadow-brand-sm hover:border-primary-strong hover:bg-primary-strong",
  secondary:
    "border-border-strong bg-surface-strong text-primary-strong hover:border-accent hover:text-accent-strong",
  dark:
    "border-accent-gold bg-accent-gold text-[var(--senova-forest-black)] shadow-brand-sm hover:border-[var(--senova-gold-400)] hover:bg-[var(--senova-gold-400)]",
  light:
    "border-[rgb(243_239_229_/_38%)] bg-transparent text-text-inverse hover:border-accent-gold hover:text-accent-gold",
} as const;

export function LuxuryButton({
  children,
  href,
  type = "button",
  variant = "primary",
  className,
  disabled = false,
  loading = false,
  onClick,
}: LuxuryButtonProps) {
  const buttonClass = cx(baseClass, variantClass[variant], className);

  if (href) {
    return (
      <Link href={disabled || loading ? "#" : href} className={buttonClass} onClick={disabled || loading ? undefined : onClick} aria-disabled={disabled || loading}>
        {loading ? "Đang xử lý…" : children}
      </Link>
    );
  }

  return (
    <button type={type} className={buttonClass} onClick={onClick} disabled={disabled || loading} aria-busy={loading}>
      {loading ? "Đang xử lý…" : children}
    </button>
  );
}
