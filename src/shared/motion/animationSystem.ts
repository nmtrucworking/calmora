import { luxuryEase } from "@shared/styles/luxuryEffects";

export const motionEase = {
  luxury: luxuryEase,
  expressive: [0.16, 1, 0.3, 1] as const,
  precise: [0.4, 0, 0.2, 1] as const,
} as const;

export const motionDuration = {
  instant: 0.18,
  fast: 0.32,
  base: 0.56,
  reveal: 0.92,
  slow: 1.18,
} as const;

export const motionViewport = {
  once: true,
  margin: "0px 0px -14% 0px",
  amount: 0.18,
} as const;

export const transition = {
  quick: { duration: motionDuration.fast, ease: motionEase.luxury },
  reveal: { duration: motionDuration.reveal, ease: motionEase.luxury },
  slowReveal: { duration: motionDuration.slow, ease: motionEase.expressive },
  route: { duration: 0.42, ease: motionEase.precise },
} as const;

export const pageTransitionVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: transition.route,
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(3px)",
    transition: { duration: 0.22, ease: motionEase.precise },
  },
} as const;

export const sectionRevealVariants = {
  hidden: { opacity: 0, y: 26, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: transition.slowReveal,
  },
} as const;

export const revealVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: transition.reveal,
  },
} as const;

export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.reveal },
} as const;

export const imageRevealVariants = {
  hidden: { opacity: 0, scale: 1.035, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: transition.slowReveal,
  },
} as const;

export const heroImageVariants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: "var(--hero-image-opacity)",
    scale: 1,
    transition: { duration: 1.4, ease: motionEase.expressive },
  },
} as const;

export const wordRevealVariants = {
  hidden: { y: "92%", opacity: 0.01 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.86, ease: motionEase.luxury },
  },
} as const;

export function staggerVariants(delay = 0, staggerChildren = 0.1) {
  return {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren,
      },
    },
  } as const;
}
