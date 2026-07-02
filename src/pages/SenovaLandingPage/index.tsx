import { luxuryLandingCopy } from "../../content/luxuryCopy";
import { useLanguage } from "../../contexts/LanguageContext";
import { CollectionShowcase } from "../../features/landing/sections/CollectionShowcase";
import { CulturalMaterial } from "../../features/landing/sections/CulturalMaterial";
import { FinalCTA } from "../../features/landing/sections/FinalCTA";
import { GiftExperience } from "../../features/landing/sections/GiftExperience";
import { LuxuryHero } from "../../features/landing/sections/LuxuryHero";
import { SignatureProduct } from "../../features/landing/sections/SignatureProduct";
import { TeaRitual } from "../../features/landing/sections/TeaRitual";

export default function SenovaLandingPage() {
  const { language } = useLanguage();
  const content = luxuryLandingCopy[language];

  return (
    <>
      <LuxuryHero content={content.hero} />
      <SignatureProduct content={content.signature} />
      <TeaRitual content={content.ritual} language={language} />
      <CollectionShowcase content={content.collection} language={language} />
      <CulturalMaterial content={content.culture} />
      <GiftExperience content={content.gift} />
      <FinalCTA content={content.finalCta} />
    </>
  );
}
