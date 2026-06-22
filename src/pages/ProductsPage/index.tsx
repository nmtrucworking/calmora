import { brandFooterGroups, brandNavigation } from "../../constants/brand";
import { SiteFrame } from "../../components/layout/SiteFrame";
import { ProductHeroStage } from "../../features/products/components/ProductHeroStage";
import { LotusOrbitNav } from "../../features/products/components/LotusOrbitNav";
import { PetalPackReveal } from "../../features/products/components/PetalPackReveal";
import { ClassicRitualScene } from "../../features/products/components/ClassicRitualScene";
import { GiftSetExplodedView } from "../../features/products/components/GiftSetExplodedView";
import { ProductJourney } from "../../features/products/components/ProductJourney";
import styles from "./ProductsPage.module.css";

export default function ProductsPage() {
  return (
    <SiteFrame navItems={brandNavigation} footerGroups={brandFooterGroups}>
      <div className={styles.pageContainer}>
        {/* Section 01: Hero perspective stage */}
        <ProductHeroStage />

        {/* Section 02: Orbit Select stage */}
        <LotusOrbitNav />

        {/* Section 03: Petal Pack reveal scroll-timeline */}
        <PetalPackReveal />

        {/* Section 04: Classic Daily table scene */}
        <ClassicRitualScene />

        {/* Section 05: Gift Set interactive exploded hotspots */}
        <GiftSetExplodedView />

        {/* Section 06: Final converging journey */}
        <ProductJourney />
      </div>
    </SiteFrame>
  );
}
