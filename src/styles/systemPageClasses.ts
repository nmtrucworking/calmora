import { luxuryMotion } from "./luxuryEffects";

export const systemStyles = {
  page: "grid gap-[clamp(2rem,5vw,4.5rem)]",
  hero:
    "grid min-h-[min(34rem,calc(100svh-8rem))] grid-cols-[minmax(0,1fr)_minmax(16rem,0.55fr)] items-end gap-[clamp(1.5rem,5vw,4rem)] pt-16 max-[900px]:min-h-0 max-[900px]:grid-cols-1 max-[900px]:pt-8 [&_h1]:mt-[0.9rem] [&_h1]:mb-0 [&_h1]:max-w-[15ch] [&_h1]:font-display [&_h1]:text-[clamp(2.7rem,7vw,5.4rem)] [&_h1]:font-[760] [&_h1]:leading-none [&_h1]:tracking-normal [&_h1]:text-primary-strong",
  heroCompact: "min-h-80 items-center",
  eyebrow: "m-0 text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-accent-gold",
  title:
    "mt-[0.9rem] mb-0 max-w-[15ch] font-display text-[clamp(2.7rem,7vw,5.4rem)] font-[760] leading-none tracking-normal text-primary-strong",
  heroDescription:
    "mt-5 mb-0 max-w-[42rem] text-[clamp(1rem,2vw,1.15rem)] leading-[1.75] text-text-muted",
  lead: "leading-[1.75] text-text-muted",
  bodyText: "leading-[1.75] text-text-muted",
  fieldHint: "leading-[1.75] text-text-muted",
  errorText: "m-0 text-[0.84rem] font-bold leading-[1.75] text-[#9f1f38]",
  successText: "m-0 text-[0.9rem] font-extrabold leading-[1.75] text-primary-strong",
  heroAside:
    `grid gap-[0.65rem] rounded-lg p-[clamp(1.25rem,3vw,2rem)] ${luxuryMotion.surface} [&_strong]:font-display [&_strong]:text-[1.6rem] [&_strong]:text-primary-strong`,
  panel:
    `grid min-h-52 content-start rounded-lg p-[clamp(1.25rem,3vw,2rem)] ${luxuryMotion.surface} ${luxuryMotion.cardHover} [&_h2]:mt-[0.65rem] [&_h2]:mb-0 [&_h2]:font-display [&_h2]:text-[clamp(1.8rem,4vw,3rem)] [&_h2]:leading-[1.08] [&_h2]:text-primary-strong [&_h3]:mt-3 [&_h3]:mb-0 [&_h3]:text-[1.2rem] [&_h3]:text-primary-strong [&_p]:mt-3 [&_p]:mb-0 [&_p]:leading-[1.68] [&_p]:text-text-muted`,
  formPanel:
    `rounded-lg p-[clamp(1.25rem,3vw,2rem)] ${luxuryMotion.surface} [&_h2]:mt-[0.65rem] [&_h2]:mb-0 [&_h2]:font-display [&_h2]:text-[clamp(1.8rem,4vw,3rem)] [&_h2]:leading-[1.08] [&_h2]:text-primary-strong`,
  thankYouPanel:
    `mx-auto my-16 max-w-[48rem] rounded-lg p-[clamp(1.25rem,3vw,2rem)] text-center ${luxuryMotion.surface} [&_h1]:mt-[0.65rem] [&_h1]:mb-0 [&_h1]:font-display [&_h1]:text-[clamp(1.8rem,4vw,3rem)] [&_h1]:leading-[1.08] [&_h1]:text-primary-strong`,
  qrPanel:
    `mx-auto my-16 grid max-w-[48rem] justify-items-center gap-4 rounded-lg p-[clamp(1.25rem,3vw,2rem)] text-center ${luxuryMotion.surface} [&_h1]:mt-[0.65rem] [&_h1]:mb-0 [&_h1]:font-display [&_h1]:text-[clamp(1.8rem,4vw,3rem)] [&_h1]:leading-[1.08] [&_h1]:text-primary-strong`,
  actions: "mt-7 flex flex-wrap gap-[0.8rem] max-[560px]:flex-col",
  primaryButton:
    `inline-flex min-h-[2.85rem] items-center justify-center gap-[0.55rem] rounded-full border border-primary bg-primary px-[1.1rem] py-3 text-[0.9rem] font-extrabold text-on-primary no-underline disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 max-[560px]:w-full ${luxuryMotion.button}`,
  secondaryButton:
    `inline-flex min-h-[2.85rem] items-center justify-center gap-[0.55rem] rounded-full border border-border-strong bg-[#fffdf899] px-[1.1rem] py-3 text-[0.9rem] font-extrabold text-primary-strong no-underline disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 max-[560px]:w-full ${luxuryMotion.button}`,
  iconButton:
    `inline-flex min-h-[2.85rem] items-center justify-center gap-[0.55rem] rounded-full border border-border-strong bg-[#fffdf899] px-[1.1rem] py-3 text-[0.9rem] font-extrabold text-primary-strong no-underline ${luxuryMotion.button}`,
  sectionHeader:
    "max-w-[48rem] [&_h2]:mt-[0.65rem] [&_h2]:mb-0 [&_h2]:font-display [&_h2]:text-[clamp(1.8rem,4vw,3rem)] [&_h2]:leading-[1.08] [&_h2]:text-primary-strong",
  cardGrid: "grid grid-cols-3 gap-4 max-[900px]:grid-cols-1",
  stepGrid: "grid grid-cols-2 gap-4 max-[900px]:grid-cols-1",
  panelLabel:
    "text-[0.82rem] font-extrabold uppercase tracking-[0.12em] text-accent-gold",
  productStrip: "grid grid-cols-3 gap-4 max-[900px]:grid-cols-1",
  productCard:
    `overflow-hidden rounded-lg text-inherit no-underline ${luxuryMotion.surface} ${luxuryMotion.cardHover}`,
  productImage:
    "grid aspect-[4/3] place-items-center bg-[radial-gradient(circle_at_50%_40%,rgba(179,38,93,0.16),transparent_38%),rgba(255,253,248,0.58)] [&_img]:h-auto [&_img]:w-[min(72%,16rem)] [&_img]:drop-shadow-[0_18px_28px_rgba(37,31,21,0.18)]",
  productBody:
    "p-4 [&_h3]:mt-[0.4rem] [&_h3]:mb-0 [&_h3]:text-[1.1rem] [&_h3]:text-primary-strong",
  inlineLink:
    "mt-[0.85rem] inline-flex min-h-11 w-fit items-center text-[0.86rem] font-extrabold text-primary no-underline hover:text-primary-strong",
  statusBadge:
    "inline-flex w-fit rounded-full border border-[rgba(179,38,93,0.2)] bg-[rgba(179,38,93,0.08)] px-[0.65rem] py-[0.3rem] text-[0.75rem] font-extrabold text-accent-strong",
  formLayout:
    "grid grid-cols-[minmax(0,0.68fr)_minmax(20rem,0.72fr)] items-start gap-[clamp(1.25rem,4vw,3rem)] max-[900px]:grid-cols-1",
  form: "mt-[1.4rem] grid gap-4",
  fieldGroup:
    "grid gap-[0.45rem] [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-border-strong [&_input]:bg-[#fffdf8b8] [&_input]:px-[0.9rem] [&_input]:py-[0.78rem] [&_input]:text-text [&_input]:outline-none [&_input]:transition-[border-color,box-shadow,background] [&_input]:duration-[320ms] [&_input]:ease-[cubic-bezier(0.22,1,0.36,1)] [&_input:focus]:border-primary [&_input:focus]:shadow-[0_0_0_3px_rgba(111,85,23,0.14)] [&_label]:text-[0.88rem] [&_label]:font-extrabold [&_label]:text-primary-strong [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-border-strong [&_select]:bg-[#fffdf8b8] [&_select]:px-[0.9rem] [&_select]:py-[0.78rem] [&_select]:text-text [&_select]:outline-none [&_select]:transition-[border-color,box-shadow,background] [&_select]:duration-[320ms] [&_select]:ease-[cubic-bezier(0.22,1,0.36,1)] [&_select:focus]:border-primary [&_select:focus]:shadow-[0_0_0_3px_rgba(111,85,23,0.14)] [&_textarea]:min-h-32 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-border-strong [&_textarea]:bg-[#fffdf8b8] [&_textarea]:px-[0.9rem] [&_textarea]:py-[0.78rem] [&_textarea]:text-text [&_textarea]:outline-none [&_textarea]:transition-[border-color,box-shadow,background] [&_textarea]:duration-[320ms] [&_textarea]:ease-[cubic-bezier(0.22,1,0.36,1)] [&_textarea:focus]:border-primary [&_textarea:focus]:shadow-[0_0_0_3px_rgba(111,85,23,0.14)]",
  choiceGroup:
    "m-0 grid gap-3 rounded-lg border border-border bg-[#fffdf86b] p-4 [&_input]:mt-[0.2rem] [&_input]:h-4 [&_input]:w-4 [&_input]:accent-primary [&_label]:grid [&_label]:grid-cols-[auto_minmax(0,1fr)] [&_label]:items-start [&_label]:gap-[0.7rem] [&_label]:leading-[1.55] [&_label]:text-text-muted [&_legend]:px-[0.35rem] [&_legend]:text-[0.88rem] [&_legend]:font-extrabold [&_legend]:text-primary-strong",
  hiddenField: "absolute -left-[100vw] h-px w-px overflow-hidden",
  inlineFields: "grid grid-cols-2 gap-4 max-[560px]:grid-cols-1",
  qrIcon: "h-12 w-12 text-primary",
} as const;
