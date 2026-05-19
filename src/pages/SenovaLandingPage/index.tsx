import { landingContent } from "../../features/landing/content/landingContent";
import { CTA } from "../../features/landing/sections/CTA";
import { Concept } from "../../features/landing/sections/Concept";
import { ExperienceTimeline } from "../../features/landing/sections/ExperienceTimeline";
import { Header } from "../../features/landing/sections/Header";
import { Hero } from "../../features/landing/sections/Hero";
import { Impact } from "../../features/landing/sections/Impact";
import styles from "../../features/landing/SenovaLandingPage.module.css";
import { ScrollModelCanvas } from "../../features/landing/three/ScrollModelCanvas";

export default function SenovaLandingPage() {
  return (
    <main className={styles.page}>
      <ScrollModelCanvas />
      <div className={styles.scrim} />
      <Header navItems={landingContent.nav} />
      <Hero content={landingContent.hero} />
      <Concept content={landingContent.concept} />
      <ExperienceTimeline content={landingContent.experience} />
      <Impact content={landingContent.impact} />
      <CTA content={landingContent.cta} />
    </main>
  );
}
