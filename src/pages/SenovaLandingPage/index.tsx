import { landingContent } from "../../features/landing/content/landingContent";
import { Chapters } from "../../features/landing/sections/Chapters";
import { CTA } from "../../features/landing/sections/CTA";
import { Hero } from "../../features/landing/sections/Hero";

export default function SenovaLandingPage() {
  return (
    <>
      <Hero content={landingContent.hero} />
      <Chapters chapters={landingContent.chapters} />
      <CTA content={landingContent.cta} />
    </>
  );
}
