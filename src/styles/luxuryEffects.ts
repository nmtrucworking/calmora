export const luxuryEase = [0.22, 1, 0.36, 1] as const;
export const luxuryEaseClass = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export const luxuryMotion = {
  duration: {
    quick: "duration-[320ms]",
    standard: "duration-[520ms]",
    slow: "duration-[760ms]",
  },
  reveal:
    "translate-y-4 opacity-0 animate-[senovaReveal_820ms_var(--ease-luxury)_both] motion-reduce:translate-y-0 motion-reduce:animate-none motion-reduce:opacity-100",
  revealSlow:
    "translate-y-5 opacity-0 animate-[senovaReveal_980ms_var(--ease-luxury)_both] motion-reduce:translate-y-0 motion-reduce:animate-none motion-reduce:opacity-100",
  surface:
    "border border-[rgba(31,95,68,0.18)] bg-[rgba(255,253,248,0.76)] shadow-[var(--shadow-luxury-sm)] backdrop-blur-[18px]",
  darkSurface:
    "border border-[rgba(255,250,240,0.08)] bg-[rgba(255,250,240,0.025)] shadow-[var(--shadow-luxury-dark)] backdrop-blur-[14px]",
  cardHover:
    "transition-[background,border-color,box-shadow,transform,filter] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-border-strong hover:shadow-[var(--shadow-luxury-md)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
  darkCardHover:
    "transition-[background,border-color,box-shadow,transform,filter] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-[rgba(248,223,147,0.22)] hover:bg-[rgba(255,250,240,0.045)] hover:shadow-[var(--shadow-luxury-dark)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
  button:
    "transition-[background,border-color,box-shadow,transform,color] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(37,31,21,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(111,85,23,0.3)] focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg motion-reduce:transition-none motion-reduce:hover:translate-y-0",
  link:
    "transition-[color,border-color,gap,transform] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
  field:
    "transition-[border-color,box-shadow,background] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus:border-primary focus:shadow-[0_0_0_3px_rgba(111,85,23,0.14)]",
} as const;

export const framerLuxuryTransition = {
  duration: 1.05,
  ease: luxuryEase,
} as const;
