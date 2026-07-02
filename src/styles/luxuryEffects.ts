export const luxuryEase = [0.22, 1, 0.36, 1] as const;
export const luxuryEaseClass = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export const luxuryMotion = {
  duration: {
    quick: "duration-[320ms]",
    standard: "duration-[520ms]",
    slow: "duration-[760ms]",
  },
  reveal:
    "translate-y-3 opacity-0 animate-[senovaReveal_900ms_var(--ease-luxury)_both] motion-reduce:translate-y-0 motion-reduce:animate-none motion-reduce:opacity-100",
  revealSlow:
    "translate-y-4 opacity-0 animate-[senovaReveal_1100ms_var(--ease-luxury)_both] motion-reduce:translate-y-0 motion-reduce:animate-none motion-reduce:opacity-100",
  surface:
    "border border-border bg-[var(--surface-paper)] shadow-[var(--shadow-luxury-sm)]",
  darkSurface:
    "border border-[rgba(243,239,229,0.12)] bg-[rgba(243,239,229,0.045)] shadow-[var(--shadow-luxury-dark)]",
  cardHover:
    "transition-[background,border-color,box-shadow,filter] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-border-strong hover:shadow-[var(--shadow-luxury-md)] motion-reduce:transition-none",
  darkCardHover:
    "transition-[background,border-color,box-shadow,filter] duration-[760ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[rgba(200,177,120,0.28)] hover:bg-[rgba(243,239,229,0.065)] hover:shadow-[var(--shadow-luxury-dark)] motion-reduce:transition-none",
  button:
    "transition-[background,border-color,box-shadow,color] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_12px_28px_rgba(16,26,22,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(175,149,88,0.42)] focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg motion-reduce:transition-none",
  link:
    "transition-[color,border-color,gap,transform] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
  field:
    "transition-[border-color,box-shadow,background] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus:border-primary focus:shadow-[0_0_0_3px_rgba(111,85,23,0.14)]",
} as const;

export const framerLuxuryTransition = {
  duration: 1.05,
  ease: luxuryEase,
} as const;
