import { landingContent } from "../../features/landing/content/landingContent";
import { Chapters } from "../../features/landing/sections/Chapters";
import { CTA } from "../../features/landing/sections/CTA";
import { Header } from "../../features/landing/sections/Header";
import { Hero } from "../../features/landing/sections/Hero";
import styles from "../../features/landing/SenovaLandingPage.module.css";
import { ScrollModelCanvas } from "../../features/landing/three/ScrollModelCanvas";

export default function SenovaLandingPage() {
  return (
    <main className={styles.page}>
      <ScrollModelCanvas />
      <div className={styles.scrim} />
      <Header navItems={landingContent.nav} />
      <Hero content={landingContent.hero} />
      <Chapters chapters={landingContent.chapters} />
      <CTA content={landingContent.cta} />
    </main>
  );
}
