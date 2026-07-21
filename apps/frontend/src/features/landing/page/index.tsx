import { luxuryLandingCopy } from "@features/content/luxuryCopy";
import { useLanguage } from "@app/providers/LanguageContext";
import { CollectionShowcase } from "@features/landing/sections/CollectionShowcase";
import { CulturalMaterial } from "@features/landing/sections/CulturalMaterial";
import { FinalCTA } from "@features/landing/sections/FinalCTA";
import { GiftExperience } from "@features/landing/sections/GiftExperience";
import { LuxuryHero } from "@features/landing/sections/LuxuryHero";
import { SignatureProduct } from "@features/landing/sections/SignatureProduct";
import { TeaRitual } from "@features/landing/sections/TeaRitual";
import { IntentSelector } from "@features/landing/sections/IntentSelector";
import { ProductProof } from "@features/landing/sections/ProductProof";
import { ProjectStatus } from "@features/landing/sections/ProjectStatus";

export default function SenovaLandingPage() {
  const { language } = useLanguage();
  const content = luxuryLandingCopy[language];

  return (
    <>
      <LuxuryHero content={content.hero} />
      <IntentSelector language={language} />
      <SignatureProduct content={content.signature} />
      <ProductProof language={language} />
      <TeaRitual content={content.ritual} language={language} />
      <CollectionShowcase content={content.collection} language={language} />
      <CulturalMaterial content={content.culture} />
      <GiftExperience content={content.gift} />
      <ProjectStatus language={language} />
      <FinalCTA content={content.finalCta} />
    </>
  );
}
