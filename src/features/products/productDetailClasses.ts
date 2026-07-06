import { luxuryMotion } from "@shared/styles/luxuryEffects";

export const productDetailStyles = {
  page: "grid gap-[clamp(2rem,5vw,4.5rem)]",
  breadcrumb:
    "[&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:gap-2 [&_a]:text-[0.88rem] [&_a]:font-bold [&_a]:text-text-muted [&_a]:no-underline [&_svg]:h-4 [&_svg]:w-4",
  hero:
    "grid min-h-[min(42rem,calc(100svh-8rem))] grid-cols-[minmax(0,1fr)_minmax(18rem,0.82fr)] items-center gap-[clamp(2rem,6vw,5rem)] max-[900px]:min-h-0 max-[900px]:grid-cols-1 [&_h1]:mt-4 [&_h1]:mb-0 [&_h1]:max-w-[12ch] [&_h1]:font-display [&_h1]:text-[clamp(3rem,8vw,6rem)] [&_h1]:font-[760] [&_h1]:leading-[0.98] [&_h1]:tracking-normal [&_h1]:text-primary-strong max-[560px]:[&_h1]:max-w-[10ch]",
  heroCopy: "max-w-[40rem] max-[900px]:max-w-full",
  metaRow: "flex flex-wrap items-center gap-3",
  eyebrow: "m-0 text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-accent-gold",
  statusBadge:
    "inline-flex min-h-8 items-center rounded-full border border-[rgba(179,38,93,0.22)] bg-[rgba(179,38,93,0.08)] px-[0.7rem] py-[0.35rem] text-[0.75rem] font-extrabold text-accent-strong",
  tagline:
    "mt-5 mb-0 font-display text-[clamp(1.35rem,3vw,2rem)] italic leading-[1.25] text-accent-strong",
  description: "mt-5 mb-0 max-w-[35rem] text-base leading-[1.75] text-text-muted",
  actions: "mt-8 flex flex-wrap gap-[0.85rem] max-[560px]:flex-col",
  primaryButton:
    `inline-flex min-h-[2.9rem] items-center justify-center gap-[0.55rem] rounded-full border border-primary bg-primary px-[1.15rem] py-3 text-[0.9rem] font-extrabold text-on-primary no-underline max-[560px]:w-full [&_svg]:h-4 [&_svg]:w-4 ${luxuryMotion.button}`,
  secondaryButton:
    `inline-flex min-h-[2.9rem] items-center justify-center gap-[0.55rem] rounded-full border border-border-strong bg-[#fffdf88f] px-[1.15rem] py-3 text-[0.9rem] font-extrabold text-primary-strong no-underline max-[560px]:w-full [&_svg]:h-4 [&_svg]:w-4 ${luxuryMotion.button}`,
  batchLabel: "mt-4 mb-0 text-[0.82rem] font-bold text-text-soft",
  heroVisual: "flex justify-center",
  imagePlate:
    "relative grid min-h-[28rem] w-[min(100%,30rem)] place-items-center overflow-hidden rounded-lg border border-[rgba(31,95,68,0.18)] bg-[radial-gradient(circle_at_50%_44%,rgba(199,111,152,0.1),transparent_42%),linear-gradient(140deg,rgba(255,253,248,0.76),rgba(216,227,212,0.5))] shadow-[var(--shadow-luxury-md)] before:absolute before:inset-4 before:rounded-lg before:border before:border-[rgba(31,95,68,0.12)] before:content-[''] max-[560px]:min-h-80 [&_img]:relative [&_img]:h-auto [&_img]:w-[min(72%,21rem)] [&_img]:object-contain [&_img]:drop-shadow-[0_24px_34px_rgba(37,31,21,0.16)]",
  contentGrid: "grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-4 max-[900px]:grid-cols-1",
  infoPanel:
    `rounded-lg p-[clamp(1.25rem,3vw,2rem)] ${luxuryMotion.surface} [&_h2]:m-0 [&_h2]:font-display [&_h2]:text-[clamp(1.6rem,3vw,2.4rem)] [&_h2]:leading-[1.12] [&_h2]:text-primary-strong`,
  sectionHeading: "flex items-center gap-[0.65rem] [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem] [&_svg]:text-accent-strong",
  checkList:
    "mt-[1.35rem] mb-0 grid list-none gap-[0.9rem] p-0 [&_li]:grid [&_li]:grid-cols-[1.25rem_minmax(0,1fr)] [&_li]:items-start [&_li]:gap-[0.7rem] [&_li]:leading-[1.55] [&_li]:text-text-muted [&_svg]:mt-[0.18rem] [&_svg]:h-[1.05rem] [&_svg]:w-[1.05rem] [&_svg]:text-primary",
  pillList:
    "mt-5 flex flex-wrap gap-[0.55rem] [&_span]:rounded-full [&_span]:border [&_span]:border-[rgba(31,95,68,0.22)] [&_span]:bg-[rgba(31,114,74,0.08)] [&_span]:px-3 [&_span]:py-2 [&_span]:text-[0.86rem] [&_span]:font-[750] [&_span]:text-primary-strong",
  gallerySection: "grid gap-[clamp(1.25rem,3vw,2rem)]",
  galleryHeader:
    "max-w-[46rem] [&_h2]:mt-[0.65rem] [&_h2]:mb-0 [&_h2]:max-w-[16ch] [&_h2]:font-display [&_h2]:text-[clamp(2rem,4vw,3.5rem)] [&_h2]:leading-[1.04] [&_h2]:text-primary-strong [&_p:last-child]:mt-4 [&_p:last-child]:mb-0 [&_p:last-child]:max-w-[40rem] [&_p:last-child]:leading-[1.75] [&_p:last-child]:text-text-muted",
  galleryGrid: "grid grid-cols-3 gap-4 max-[900px]:grid-cols-1",
  galleryCard:
    `relative grid min-h-[28rem] content-between overflow-hidden rounded-lg bg-[linear-gradient(180deg,rgba(255,253,248,0.76),rgba(255,253,248,0.56)),var(--surface-strong)] p-4 text-text no-underline max-[900px]:min-h-0 ${luxuryMotion.surface} ${luxuryMotion.cardHover}`,
  galleryCardActive:
    "border-[rgba(179,38,93,0.42)] bg-[linear-gradient(180deg,rgba(255,253,248,0.84),rgba(255,253,248,0.62)),rgba(179,38,93,0.08)]",
  galleryRole:
    "relative z-[2] justify-self-start rounded-full border border-[rgba(111,85,23,0.22)] bg-[#fffdf8b8] px-[0.7rem] py-[0.35rem] text-[0.76rem] font-extrabold text-accent-gold",
  galleryImageFrame:
    "my-2 grid min-h-56 place-items-center [&_img]:max-h-60 [&_img]:w-[min(82%,16rem)] [&_img]:object-contain [&_img]:drop-shadow-[0_20px_28px_rgba(37,31,21,0.18)]",
  galleryCardCopy:
    "relative z-[2] [&_h3]:m-0 [&_h3]:font-display [&_h3]:text-[clamp(1.35rem,2.5vw,2rem)] [&_h3]:leading-[1.1] [&_h3]:text-primary-strong [&_p]:mt-[0.65rem] [&_p]:mb-0 [&_p]:text-[0.92rem] [&_p]:leading-[1.6] [&_p]:text-text-muted",
  experienceSection: "grid gap-6",
  experienceHeader:
    "max-w-[46rem] [&_h2]:mt-3 [&_h2]:mb-0 [&_h2]:font-display [&_h2]:text-[clamp(1.6rem,3vw,2.4rem)] [&_h2]:leading-[1.12] [&_h2]:text-primary-strong [&_p]:text-base [&_p]:leading-[1.75] [&_p]:text-text-muted",
  stepGrid: "grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1",
  stepItem:
    `min-h-[13.5rem] rounded-lg p-5 ${luxuryMotion.surface} [&_h3]:mt-[0.85rem] [&_h3]:mb-0 [&_h3]:text-[1.05rem] [&_h3]:text-primary-strong [&_p]:mt-[0.6rem] [&_p]:mb-0 [&_p]:text-[0.92rem] [&_p]:leading-[1.65] [&_p]:text-text-muted [&_span]:font-display [&_span]:text-[1.7rem] [&_span]:font-[760] [&_span]:text-accent-gold`,
  qrPanel:
    `grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 rounded-lg bg-[linear-gradient(120deg,rgba(31,114,74,0.08),rgba(179,38,93,0.05)),var(--surface-strong)] p-[clamp(1.25rem,3vw,2rem)] max-[900px]:grid-cols-1 max-[900px]:items-start ${luxuryMotion.surface} [&>svg]:h-10 [&>svg]:w-10 [&>svg]:text-primary [&_h2]:mt-[0.35rem] [&_h2]:mb-0 [&_h2]:font-display [&_h2]:text-[clamp(1.6rem,3vw,2.4rem)] [&_h2]:leading-[1.12] [&_h2]:text-primary-strong [&_p]:text-base [&_p]:leading-[1.75] [&_p]:text-text-muted [&_p:last-child]:mb-0`,
  emptyState:
    "mx-auto my-20 max-w-[45rem] rounded-lg border border-border bg-surface-strong p-[clamp(1.5rem,4vw,3rem)] text-center [&_h1]:mt-4 [&_h1]:mb-0 [&_h1]:max-w-full [&_h1]:font-display [&_h1]:text-[clamp(2.4rem,6vw,4.5rem)] [&_h1]:font-[760] [&_h1]:leading-[0.98] [&_h1]:tracking-normal [&_h1]:text-primary-strong [&_p]:text-base [&_p]:leading-[1.75] [&_p]:text-text-muted",
} as const;
