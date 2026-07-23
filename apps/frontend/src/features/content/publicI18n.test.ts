import { describe, expect, it } from "vitest";
import { localizedStandardPages, localizedThankYouMessages, publicSeo } from "./publicI18n";

const languages = ["vi", "en"] as const;
const standardPaths = ["/ritual", "/seasonal", "/privacy", "/terms"];
const publicSeoPaths = ["/", "/about", "/team", "/story", "/products", "/ritual", "/seasonal", "/contact", "/partners", "/order-request", "/order-request/success", "/thank-you", "/privacy", "/terms", "/404"];
const thankYouTypes = ["feedback", "pre-order", "sample-interest", "contact", "partners"];

describe("public website translations", () => {
  it.each(languages)("provides complete standard pages for %s", (language) => {
    for (const path of standardPaths) {
      const page = localizedStandardPages[language][path];
      expect(page?.path).toBe(path);
      expect(page?.title.trim()).toBeTruthy();
      expect(page?.description.trim()).toBeTruthy();
      expect(page?.blocks.length).toBeGreaterThan(0);
      expect(page?.blocks.every((block) => block.title.trim() && block.text.trim())).toBe(true);
    }
  });

  it.each(languages)("provides public SEO metadata for %s", (language) => {
    for (const path of publicSeoPaths) {
      expect(publicSeo[language][path]?.title.trim()).toBeTruthy();
      expect(publicSeo[language][path]?.description.trim()).toBeTruthy();
    }
  });

  it.each(languages)("provides thank-you states for %s", (language) => {
    for (const type of thankYouTypes) {
      expect(localizedThankYouMessages[language][type]?.title.trim()).toBeTruthy();
      expect(localizedThankYouMessages[language][type]?.text.trim()).toBeTruthy();
    }
  });
});
