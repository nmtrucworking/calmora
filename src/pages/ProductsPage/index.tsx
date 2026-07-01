import { useEffect, useRef } from "react";
import { ProductHeroStage } from "../../features/products/components/ProductHeroStage";
import { LotusOrbitNav } from "../../features/products/components/LotusOrbitNav";
import { PetalPackReveal } from "../../features/products/components/PetalPackReveal";
import { ClassicRitualScene } from "../../features/products/components/ClassicRitualScene";
import { GiftSetExplodedView } from "../../features/products/components/GiftSetExplodedView";
import { ProductJourney } from "../../features/products/components/ProductJourney";
import { productsPageStyles as styles } from "../../styles/productsPageClasses";

const focusSectionClasses = styles.productFocusSection.split(" ");
const activeSectionClasses = styles.productFocusActive.split(" ");

export default function ProductsPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const sections = Array.from(page.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement,
    );
    const sectionRatios = new Map<HTMLElement, number>();

    sections.forEach((section, index) => {
      section.dataset.productFocusIndex = String(index);
      section.classList.add(...focusSectionClasses);
    });
    sections[0]?.classList.add(...activeSectionClasses);

    const updateActiveSection = () => {
      const activeSection = sections.reduce<HTMLElement | null>((current, section) => {
        if (!current) return section;
        return (sectionRatios.get(section) ?? 0) > (sectionRatios.get(current) ?? 0)
          ? section
          : current;
      }, null);

      if (!activeSection || (sectionRatios.get(activeSection) ?? 0) < 0.16) return;

      sections.forEach((section) => {
        if (section === activeSection) {
          section.classList.add(...activeSectionClasses);
        } else {
          section.classList.remove(...activeSectionClasses);
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionRatios.set(entry.target as HTMLElement, entry.intersectionRatio);
        });
        updateActiveSection();
      },
      {
        root: null,
        rootMargin: "-18% 0px -28% 0px",
        threshold: [0.16, 0.32, 0.48, 0.64, 0.8],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      sections.forEach((section) => {
        delete section.dataset.productFocusIndex;
        section.classList.remove(...focusSectionClasses, ...activeSectionClasses);
      });
    };
  }, []);

  return (
    <div ref={pageRef} className={styles.productsPage}>
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
  );
}
