import type { LucideIcon } from "lucide-react";
import type { MutableRefObject } from "react";

export type ScrollProgressRef = MutableRefObject<number>;

export type LandingNavItem = {
  label: string;
  href: string;
};

export type LandingPillar = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export type TimelineStep = {
  number: string;
  title: string;
  text: string;
};

export type ImpactCard = {
  number: string;
  title: string;
  text: string;
};

export type LandingContent = {
  nav: LandingNavItem[];
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
    scrollHint: string;
  };
  concept: {
    eyebrow: string;
    title: string;
    description: string;
    pillars: LandingPillar[];
  };
  experience: {
    eyebrow: string;
    title: string;
    steps: TimelineStep[];
  };
  impact: {
    eyebrow: string;
    title: string;
    description: string;
    cards: ImpactCard[];
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    label: string;
    href: string;
  };
};
