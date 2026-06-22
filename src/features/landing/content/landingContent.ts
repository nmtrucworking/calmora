import content from "../../../data/content.json";
import type { LandingContent } from "../types";

export const landingContent: LandingContent = {
  nav: content.landing.nav,
  hero: content.landing.hero,
  chapters: content.landing.chapters,
  cta: content.landing.cta,
  footer: {
    tagline: content.landing.footer.tagline,
    groups: content.brand.footerGroups,
  },
};
