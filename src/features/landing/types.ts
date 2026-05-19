import type { MutableRefObject } from "react";

export type ScrollProgressRef = MutableRefObject<number>;

export type LandingNavItem = {
  label: string;
  href: string;
};

export type LandingFooterGroup = {
  title: string;
  links: LandingNavItem[];
};

export type LandingChapter = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
};

export type LandingContent = {
  nav: LandingNavItem[];
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    scrollHint: string;
  };
  chapters: LandingChapter[];
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    label: string;
    href: string;
  };
  footer: {
    tagline: string;
    groups: LandingFooterGroup[];
  };
};
