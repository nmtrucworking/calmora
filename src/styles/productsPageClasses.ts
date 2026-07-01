import { luxuryMotion } from "./luxuryEffects";

export const productsPageStyles = {
  productsPage:
    "relative isolate min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,rgba(236,229,213,0.72)_0%,rgba(226,217,196,0.66)_54%,rgba(216,205,180,0.7)_100%)] px-0 pt-12 pb-20 font-sans text-text before:pointer-events-none before:fixed before:inset-[-1.5rem] before:z-0 before:scale-[1.02] before:bg-[url(/src/assets/products-background-optimized.jpg)] before:bg-cover before:bg-top before:bg-fixed before:opacity-[0.72] before:blur-[1px] before:content-[''] after:pointer-events-none after:fixed after:inset-0 after:z-0 after:bg-[linear-gradient(90deg,rgba(236,229,213,0.58)_0%,rgba(236,229,213,0.34)_44%,rgba(236,229,213,0.5)_100%),linear-gradient(180deg,rgba(255,253,248,0.38)_0%,rgba(255,253,248,0.18)_42%,rgba(216,205,180,0.36)_100%)] after:content-[''] [&>*]:relative [&>*]:z-[1] max-[600px]:pt-[5.4rem] max-[600px]:pb-16 max-[600px]:before:bg-scroll max-[600px]:before:opacity-[0.68] max-[600px]:before:blur-[0.75px]",
  productFocusSection:
    "scroll-mt-[clamp(4.5rem,8vh,5.75rem)] origin-top translate-y-3 scale-[0.996] opacity-[0.88] saturate-[0.96] transition-[opacity,filter,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] max-[600px]:scroll-mt-[4.25rem] max-[600px]:!translate-y-0 max-[600px]:!scale-100 max-[600px]:!opacity-100 max-[600px]:!saturate-100 motion-reduce:!translate-y-0 motion-reduce:!scale-100 motion-reduce:!opacity-100 motion-reduce:!saturate-100 motion-reduce:!transition-none",
  productFocusActive: "!translate-y-0 !scale-100 !opacity-100 !saturate-100",

  heroSection:
    "relative flex items-center justify-center overflow-hidden px-[clamp(1rem,4vw,4rem)] py-[clamp(1.5rem,4vw,4rem)]",
  heroContainer:
    "z-[2] mx-auto grid w-full max-w-[var(--page-max)] grid-cols-[minmax(22rem,0.82fr)_minmax(38rem,1.18fr)] items-center gap-[clamp(2rem,4vw,4.5rem)] max-[900px]:grid-cols-1 max-[900px]:gap-8 max-[900px]:text-center",
  heroText: "max-w-[32rem] max-[900px]:mx-auto",
  heroEyebrow: "m-0 text-[0.8rem] font-semibold uppercase tracking-[0.28em] text-accent-gold",
  heroTitle:
    "mt-[1.2rem] mb-0 font-display text-[clamp(2.5rem,5vw,4.2rem)] font-bold leading-[1.08] tracking-normal text-text-inverse",
  heroSubtitle: "mt-6 mb-0 text-[1.1rem] leading-[1.7] text-text-muted",
  stageFrame:
    "relative flex h-[clamp(28rem,44vw,38rem)] min-h-[28rem] w-full min-w-0 items-center justify-center [perspective:1000px] max-[600px]:h-80 max-[600px]:min-h-80",
  stageFloor:
    "absolute right-[10%] bottom-[10%] left-[10%] h-0.5 bg-[radial-gradient(circle,rgba(248,223,147,0.25)_0%,rgba(248,223,147,0)_80%)] blur-[1px]",
  productLayer:
    "absolute flex max-w-[min(34rem,54%)] flex-col items-center [transform-style:preserve-3d] will-change-transform",
  productImage:
    "h-auto max-h-[clamp(13rem,24vw,22rem)] w-full max-w-[clamp(17rem,26vw,25rem)] object-contain drop-shadow-[0_24px_38px_rgba(37,31,21,0.24)] max-[600px]:max-h-48 max-[600px]:max-w-[clamp(8rem,38vw,10rem)]",
  layerLabel:
    "mt-4 rounded-full border border-[rgba(255,250,240,0.12)] bg-[rgba(255,250,240,0.05)] px-[0.8rem] py-[0.35rem] text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent-gold [backdrop-filter:blur(10px)]",
  layerPetalPack: "z-[5] top-[38%] left-[33%] translate-z-[30px] max-[900px]:top-[37%] max-[900px]:left-[32%]",
  layerClassic: "z-[4] bottom-[11%] left-0 translate-z-[10px] scale-[0.85] max-[900px]:left-[4%] max-[600px]:bottom-0",
  layerGiftSet: "z-[3] top-[8%] right-0 translate-z-[-20px] scale-90 max-[900px]:right-[4%]",
  floatingPetals: "pointer-events-none absolute inset-0",
  petalDecor:
    "absolute h-[22px] w-[14px] rounded-[50%_0_50%_50%] border border-[rgba(179,38,93,0.26)] bg-[linear-gradient(135deg,rgba(197,42,101,0.48)_0%,rgba(179,38,93,0.18)_100%)] blur-[0.4px]",
  petal1: "top-[15%] left-[15%] rotate-[15deg]",
  petal2: "top-[75%] left-[75%] rotate-[-45deg]",
  petal3: "top-[25%] right-[12%] rotate-[115deg]",
  petal4: "bottom-[20%] left-[35%] rotate-[205deg]",

  orbitSection:
    "relative bg-[radial-gradient(circle_at_center,rgba(15,27,24,0.5)_0%,rgba(7,17,15,0)_70%)] px-6 py-24",
  orbitContainer: "mx-auto max-w-[var(--page-max)]",
  orbitHeader: "mb-4 text-center",
  orbitLabel: "text-[0.8rem] font-semibold uppercase tracking-[0.24em] text-accent-gold",
  orbitTitle:
    "mt-[0.8rem] mb-0 font-display text-[clamp(2rem,4vw,3rem)] font-[650] text-text",
  mobileTabSelector:
    "relative z-[5] mx-auto mb-[2.2rem] hidden w-fit justify-center gap-2 rounded-full border border-[rgba(255,250,240,0.08)] bg-[rgba(255,250,240,0.03)] p-[0.4rem] max-[768px]:flex",
  mobileTabBtn:
    "cursor-pointer rounded-full border-0 bg-transparent px-5 py-[0.55rem] text-[0.78rem] font-bold uppercase tracking-[0.05em] text-text-muted transition-[background,color,box-shadow] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
  mobileTabBtnActive: "bg-text text-page-bg",
  orbitStage:
    "relative mb-12 flex min-h-96 items-center justify-center max-[900px]:h-[30rem] max-[768px]:hidden",
  orbitCore:
    "absolute flex h-56 w-56 items-center justify-center rounded-full border border-dashed border-[rgba(248,223,147,0.12)]",
  coreGlow: "h-10 w-10 rounded-full bg-accent-gold opacity-[0.35] blur-[18px]",
  orbitTrack: "relative h-full w-full max-w-[44rem]",
  orbitItem:
    "group absolute cursor-pointer border-0 bg-transparent outline-none transition-[opacity,transform] duration-[980ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity]",
  orbitItemCard:
    `flex flex-col items-center rounded-brand-lg p-6 max-[600px]:p-[0.8rem] ${luxuryMotion.darkSurface} ${luxuryMotion.darkCardHover}`,
  orbitItemImage:
    "h-40 w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.24)] max-[600px]:h-24",
  orbitItemLabel:
    "mt-[0.9rem] text-[0.8rem] font-semibold uppercase tracking-[0.15em] text-text-muted",
  orbitActive:
    "top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 scale-[1.18] opacity-100 max-[600px]:scale-110 [&>div]:border-[rgba(248,223,147,0.32)] [&>div]:bg-[rgba(255,250,240,0.05)] [&_span]:text-accent-gold",
  orbitLeft: "top-1/2 left-0 z-[5] -translate-y-1/2 scale-[0.8] opacity-[0.42]",
  orbitRight: "top-1/2 right-0 z-[5] -translate-y-1/2 scale-[0.8] opacity-[0.42]",
  orbitBack: "top-0 left-1/2 z-[3] -translate-x-1/2 -translate-y-[20%] scale-[0.68] opacity-20",
  orbitDetailWrap: "mx-auto min-h-[25rem] max-w-[48rem]",
  orbitDetailGrid:
    `grid grid-cols-[1.2fr_0.8fr] items-center gap-12 rounded-brand-lg p-[2.2rem] max-[900px]:grid-cols-1 max-[900px]:gap-8 max-[900px]:text-center ${luxuryMotion.darkSurface}`,
  orbitDetailCopy: "",
  detailEyebrow: "text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-accent-gold",
  detailName: "mt-[0.6rem] mb-0 font-display text-[2.2rem] font-bold text-text-inverse",
  detailTagline: "mt-[0.8rem] mb-0 text-[1.05rem] italic text-accent-gold",
  detailDescription: "mt-4 mb-0 leading-[1.7] text-text-muted",
  detailActions: "mt-[1.8rem] max-[900px]:flex max-[900px]:justify-center",
  detailCta:
    "inline-flex items-center gap-[0.6rem] border-b-[1.5px] border-accent-gold pb-1 text-[0.88rem] font-semibold text-text no-underline transition-[gap,border-color,color] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-[0.72rem] hover:border-text",
  detailCtaIcon: "h-4 w-4",
  orbitDetailVisual: "relative flex items-center justify-center",
  visualGlow: "absolute h-32 w-32 rounded-full bg-accent opacity-[0.08] blur-[36px]",
  detailImage:
    "z-[2] max-h-56 w-auto object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.24)] max-[900px]:mx-auto",

  petalPackTrack:
    "relative px-0 py-[clamp(5rem,9vw,8rem)] max-[768px]:min-h-0 max-[768px]:px-6 max-[768px]:py-16",
  petalPackSticky: "relative max-[768px]:!top-auto max-[768px]:!h-auto",
  petalPackGrid:
    "mx-auto grid w-full max-w-[var(--page-max)] grid-cols-2 items-start gap-16 px-6 max-[900px]:grid-cols-1 max-[900px]:gap-8",
  revealVisualArea:
    "sticky top-[clamp(5.5rem,10vh,7rem)] flex min-h-[calc(100svh-clamp(7rem,13vh,9rem))] flex-col items-center justify-center max-[900px]:relative max-[900px]:top-auto max-[900px]:min-h-0 max-[720px]:relative max-[720px]:top-auto max-[720px]:min-h-0",
  revealTitleBadge:
    "mb-8 inline-flex items-center gap-[0.45rem] rounded-full border border-[rgba(255,250,240,0.1)] bg-[rgba(255,250,240,0.05)] px-[0.9rem] py-[0.4rem] text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent-gold",
  revealBadgeIcon: "h-[0.85rem] w-[0.85rem]",
  revealDisplayStage:
    `relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-brand-lg max-[600px]:h-56 max-[600px]:w-56 max-[768px]:hidden ${luxuryMotion.darkSurface}`,
  revealLayer: "absolute inset-0 flex flex-col items-center justify-center p-6",
  revealSvg: "h-44 w-44 max-[600px]:h-32 max-[600px]:w-32",
  revealStepHint: "mt-4 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-text-soft",
  revealTextContent:
    "flex flex-col gap-[clamp(5rem,12vh,8rem)] py-[clamp(2rem,8vh,5rem)] max-[900px]:gap-12 max-[900px]:py-8 max-[720px]:gap-16 max-[720px]:pt-12 max-[720px]:pb-0",
  revealTextStep: "max-w-[25rem] max-[900px]:max-w-full",
  stepHeader: "mb-[0.8rem] flex items-center gap-4",
  stepNum: "font-display text-[1.8rem] font-semibold text-accent-gold",
  stepTag:
    "rounded-full border border-[rgba(185,86,114,0.22)] px-[0.6rem] py-[0.2rem] text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent",
  stepTitle: "m-0 font-display text-[2.2rem] font-[650] text-text-inverse",
  stepDescription: "mt-[0.9rem] mb-0 text-[0.98rem] leading-[1.7] text-text-muted",
  revealMobileSvg:
    "mx-auto my-6 hidden h-auto w-full max-w-48 rounded-brand-md border border-[rgba(255,250,240,0.06)] bg-[rgba(255,250,240,0.015)] p-4 max-[768px]:block [&_svg]:h-auto [&_svg]:w-full",

  classicSection:
    "relative bg-[linear-gradient(180deg,rgba(7,17,15,0)_0%,rgba(15,27,24,0.3)_100%)] px-6 py-32",
  classicGrid:
    "mx-auto grid max-w-[var(--page-max)] grid-cols-[0.95fr_1.05fr] items-center gap-20 max-[900px]:grid-cols-1 max-[900px]:gap-12",
  classicVisualStage: "flex h-[25rem] items-center justify-center max-[600px]:h-72",
  classicTableSurface:
    "relative h-full w-full overflow-hidden rounded-brand-lg border border-[rgba(255,250,240,0.05)] bg-[rgba(255,250,240,0.015)]",
  classicShadow:
    "pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_70%,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0)_70%)]",
  classicBoxWrapper: "absolute top-[15%] left-[10%] z-[3]",
  classicBoxImage:
    "h-64 w-auto object-contain drop-shadow-[0_24px_34px_rgba(0,0,0,0.28)] max-[600px]:h-40",
  classicPacketWrapper: "absolute z-[4]",
  classicPacket:
    "flex h-[6.5rem] w-[5.5rem] items-end rounded-brand-sm border border-[rgba(255,250,240,0.15)] bg-[linear-gradient(135deg,#1b352b_0%,#0d1a15_100%)] p-[0.65rem] shadow-[0_10px_25px_rgba(0,0,0,0.45)]",
  packetMark: "text-[0.58rem] font-bold tracking-[0.22em] text-accent-gold",
  classicCupWrapper: "absolute right-[12%] bottom-[12%] z-[3] flex flex-col items-center max-[600px]:right-[6%] max-[600px]:bottom-[6%]",
  classicSteam: "mb-[0.65rem] flex gap-[0.35rem]",
  steamWave1: "inline-block rotate-[-90deg] text-[1.1rem] text-[rgba(248,223,147,0.6)]",
  steamWave2: "inline-block rotate-[-90deg] text-[1.1rem] text-[rgba(248,223,147,0.6)]",
  classicCup:
    "relative flex h-12 w-16 justify-center rounded-[0_0_1.2rem_1.2rem] border-[1.5px] border-t-0 border-text-soft bg-[rgba(255,250,240,0.08)]",
  cupRim:
    "absolute top-[-4px] h-[6px] w-16 rounded-[50%] border-[1.5px] border-text-soft bg-[rgba(7,17,15,0.9)]",
  cupLiquid:
    "absolute top-px h-1 w-[3.6rem] rounded-[50%] bg-[rgba(248,223,147,0.5)] blur-[0.5px]",
  classicCopy: "max-w-[31rem] max-[900px]:max-w-full",
  classicKicker: "text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-accent-gold",
  classicTitle: "mt-[0.8rem] mb-0 font-display text-[2.8rem] font-bold text-text-inverse",
  classicTagline: "mt-[0.8rem] mb-0 text-[1.1rem] italic text-accent-gold",
  classicDescription: "mt-4 mb-0 leading-[1.7] text-text-muted",
  classicPillars: "mt-[2.2rem] flex flex-col gap-[1.4rem]",
  pillarItem: "flex items-start gap-[1.2rem]",
  pillarIconWrap:
    "flex h-[2.8rem] w-[2.8rem] shrink-0 items-center justify-center rounded-brand-sm border border-[rgba(248,223,147,0.15)] bg-[rgba(248,223,147,0.05)] text-accent-gold",
  pillarIcon: "h-[1.3rem] w-[1.3rem]",
  pillarNum: "mt-[0.2rem] font-display text-[1.2rem] font-bold text-accent",
  pillarTitle: "m-0 text-[1.05rem] font-semibold text-text",
  pillarText: "mt-1 mb-0 text-[0.88rem] leading-[1.6] text-text-muted",

  giftSetSection:
    "relative bg-[linear-gradient(180deg,rgba(7,17,15,0)_0%,rgba(15,27,24,0.4)_100%)] px-6 py-32",
  giftSetContainer: "mx-auto max-w-[var(--page-max)]",
  giftSetHeader: "mx-auto mb-20 max-w-[38rem] text-center",
  giftSetKicker: "text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-accent-gold",
  giftSetTitle: "mt-[0.8rem] mb-0 font-display text-[2.8rem] font-bold text-text-inverse",
  giftSetTagline: "mt-[0.8rem] mb-0 text-[1.1rem] italic text-accent-gold",
  giftSetDescription: "mt-[1.2rem] mb-0 leading-[1.7] text-text-muted",
  explodedStage: "relative mx-auto flex max-w-[48rem] items-center justify-center",
  explodedImageWrapper:
    "relative w-full overflow-visible rounded-brand-lg border border-[rgba(255,250,240,0.05)] bg-[rgba(255,250,240,0.02)]",
  explodedGlow:
    "absolute inset-0 rounded-brand-lg bg-[radial-gradient(circle_at_center,rgba(15,27,24,0.4)_0%,rgba(0,0,0,0.8)_100%)]",
  explodedImage: "block h-auto w-full rounded-brand-lg saturate-[0.92]",
  hotspotAnchor: "absolute z-[5]",
  hotspotBtn:
    "relative flex h-[1.8rem] w-[1.8rem] cursor-pointer items-center justify-center rounded-full border border-[rgba(255,250,240,0.2)] bg-accent-gold text-base font-bold text-page-bg shadow-[0_10px_22px_rgba(0,0,0,0.22)] outline-none transition-[background,box-shadow,transform] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px",
  hotspotBtnActive:
    "rotate-45 bg-accent text-text-inverse shadow-[0_14px_28px_rgba(0,0,0,0.26)]",
  hotspotPulse:
    "pointer-events-none absolute inset-[-7px] rounded-full border border-accent-gold opacity-50 animate-[senovaBreath_3.8s_var(--ease-luxury-inout)_infinite]",
  hotspotIcon: "leading-none",
  hotspotPopover:
    "absolute bottom-[calc(100%+12px)] left-1/2 z-10 w-56 -translate-x-1/2 rounded-brand-md border border-[rgba(255,250,240,0.15)] bg-[rgba(7,17,15,0.9)] p-4 shadow-[0_15px_35px_rgba(0,0,0,0.65)] [backdrop-filter:blur(15px)] max-[768px]:hidden",
  popoverTitle: "m-0 text-[0.95rem] font-semibold tracking-[0.05em] text-accent-gold",
  popoverDescription: "mt-[0.45rem] mb-0 text-[0.78rem] leading-[1.6] text-text-muted",
  mobileHotspotDetail:
    "mt-8 hidden rounded-brand-md border border-border bg-surface-strong p-6 text-left shadow-[var(--shadow-luxury-sm)] max-[768px]:block max-[768px]:animate-[senovaReveal_520ms_var(--ease-luxury)_both]",
  mobileHotspotDetailTitle: "m-0 text-[1.05rem] font-semibold tracking-[0.05em] text-accent-gold",
  mobileHotspotDetailDesc: "mt-2 mb-0 text-[0.85rem] leading-[1.6] text-text-muted",

  journeySection: "relative px-6 py-40",
  journeyContainer: "mx-auto max-w-[var(--page-max)]",
  convergeStage:
    "relative mb-16 flex h-80 flex-col items-center justify-center max-[600px]:h-auto max-[600px]:py-8",
  trackLine: "absolute z-[1] h-auto w-full max-w-[32rem] opacity-[0.62] max-[600px]:hidden",
  trackSvg: "h-auto w-full",
  convergeItems:
    "relative z-[3] h-full w-full max-w-[32rem] max-[600px]:flex max-[600px]:h-auto max-[600px]:flex-col max-[600px]:items-center",
  convergeBubble:
    `absolute flex min-w-32 flex-col items-center justify-center rounded-brand-md px-[1.4rem] py-[0.8rem] text-center max-[600px]:relative max-[600px]:top-auto max-[600px]:right-auto max-[600px]:left-auto max-[600px]:mb-4 max-[600px]:translate-x-0 ${luxuryMotion.darkSurface}`,
  bubbleClassic: "top-[60%] left-0 max-[900px]:top-1/2 max-[900px]:left-[10%]",
  bubblePetalPack: "top-[15%] left-1/2 -translate-x-1/2 border-[rgba(248,223,147,0.22)]",
  bubbleGiftSet: "top-[60%] right-0 max-[900px]:top-1/2 max-[900px]:right-[10%]",
  bubbleLabel: "text-[0.95rem] font-semibold tracking-[0.05em] text-text",
  bubbleRole: "mt-[0.2rem] mb-0 text-[0.7rem] uppercase tracking-[0.12em] text-accent-gold",
  centralLogoWrap:
    "absolute top-1/2 left-1/2 z-[2] flex h-[6.5rem] w-[6.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center",
  centralLogoGlow:
    "absolute inset-[-15px] bg-[radial-gradient(circle,rgba(248,223,147,0.18)_0%,rgba(248,223,147,0)_70%)] blur-[12px]",
  calmoraMarkSvg: "h-full w-full",
  journeyCopy: "mx-auto max-w-[44rem] text-center",
  journeyHeadline:
    "font-display text-[clamp(1.8rem,4vw,2.6rem)] font-[650] leading-[1.25] tracking-normal text-text-inverse",
  journeyActions: "mt-12 flex flex-wrap justify-center gap-6",
  journeyPrimaryBtn:
    `inline-flex items-center rounded-full bg-text px-[1.8rem] py-[0.9rem] text-[0.88rem] font-semibold text-page-bg no-underline hover:bg-accent-gold ${luxuryMotion.button}`,
  journeySecondaryBtn:
    `inline-flex items-center rounded-full border border-[rgba(255,250,240,0.15)] bg-[rgba(255,250,240,0.05)] px-[1.8rem] py-[0.9rem] text-[0.88rem] font-semibold text-text no-underline hover:bg-[rgba(255,250,240,0.1)] ${luxuryMotion.button}`,
  journeyLinkWrap: "mt-10",
  journeyStoryLink:
    "group text-[0.88rem] font-semibold tracking-[0.05em] text-accent-gold no-underline transition-colors duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-text",
  arrowIcon: "inline-block transition-transform duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5",
} as const;
