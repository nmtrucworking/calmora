import { motion, useMotionValue, useTransform } from "framer-motion";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { TextReveal } from "../../../components/ui/ZenMotion";
import { getLocalizedProduct } from "../../../content/i18n";
import { useLanguage } from "../../../contexts/LanguageContext";
import { luxuryEase } from "../../../styles/luxuryEffects";
import { products } from "../data/products";
import { productsPageStyles as styles } from "../../../styles/productsPageClasses";

const petalClasses = [styles.petal1, styles.petal2, styles.petal3, styles.petal4];

export function ProductHeroStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { language } = useLanguage();
  const copy = {
    vi: {
      eyebrow: "SENOVA COLLECTION / 01-03",
      title: "Ba hình hài của một câu chuyện trà sen.",
      subtitle: "Một tách trà để giữ. Một cánh sen để mở. Một món quà để trao.",
    },
    en: {
      eyebrow: "SENOVA COLLECTION / 01-03",
      title: "Three forms of one lotus tea story.",
      subtitle: "A cup to keep. A petal to open. A gift to give.",
    },
  }[language];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const petalPackX = useTransform(mouseX, [-300, 300], [-12, 12]);
  const petalPackY = useTransform(mouseY, [-300, 300], [-10, 10]);
  const classicX = useTransform(mouseX, [-300, 300], [-7, 7]);
  const classicY = useTransform(mouseY, [-300, 300], [-6, 6]);
  const giftSetX = useTransform(mouseX, [-300, 300], [-4, 4]);
  const giftSetY = useTransform(mouseY, [-300, 300], [-4, 4]);

  const handleMouseMove = (event: MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const classic = products.find((product) => product.id === "classic");
  const petalPack = products.find((product) => product.id === "petal-pack");
  const giftSet = products.find((product) => product.id === "gift-set");
  const localizedClassic = classic ? getLocalizedProduct(classic, language) : undefined;
  const localizedPetalPack = petalPack ? getLocalizedProduct(petalPack, language) : undefined;
  const localizedGiftSet = giftSet ? getLocalizedProduct(giftSet, language) : undefined;

  return (
    <section
      ref={containerRef}
      className={styles.heroSection}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-labelledby="hero-title"
    >
      <div className={styles.heroContainer}>
        <div className={styles.heroText}>
          <p className={styles.heroEyebrow}>{copy.eyebrow}</p>
          <h1 id="hero-title" className={styles.heroTitle}>
            <TextReveal text={copy.title} />
          </h1>
          <p className={styles.heroSubtitle}>{copy.subtitle}</p>
        </div>

        <div className={styles.stageFrame}>
          <div className={styles.stageFloor} />

          {localizedGiftSet ? (
            <motion.div
              className={`${styles.productLayer} ${styles.layerGiftSet}`}
              style={{ x: giftSetX, y: giftSetY, z: -20, scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, ease: luxuryEase, delay: 0.34 }}
            >
              <img
                src={localizedGiftSet.image}
                alt={localizedGiftSet.name}
                className={styles.productImage}
                decoding="async"
                fetchPriority="high"
              />
              <div className={styles.layerLabel}>{localizedGiftSet.role}</div>
            </motion.div>
          ) : null}

          {localizedClassic ? (
            <motion.div
              className={`${styles.productLayer} ${styles.layerClassic}`}
              style={{ x: classicX, y: classicY, z: 10, scale: 0.85 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, ease: luxuryEase, delay: 0.18 }}
            >
              <img
                src={localizedClassic.image}
                alt={localizedClassic.name}
                className={styles.productImage}
                decoding="async"
                fetchPriority="high"
              />
              <div className={styles.layerLabel}>{localizedClassic.role}</div>
            </motion.div>
          ) : null}

          {localizedPetalPack ? (
            <motion.div
              className={`${styles.productLayer} ${styles.layerPetalPack}`}
              style={{ x: petalPackX, y: petalPackY, z: 30, scale: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, ease: luxuryEase }}
            >
              <img
                src={localizedPetalPack.image}
                alt={localizedPetalPack.name}
                className={styles.productImage}
                decoding="async"
                fetchPriority="high"
              />
              <div className={styles.layerLabel}>{localizedPetalPack.role}</div>
            </motion.div>
          ) : null}

          <div className={styles.floatingPetals}>
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                className={`${styles.petalDecor} ${petalClasses[item - 1]}`}
                animate={{ y: [0, -7, 0], rotate: [0, 3, 0] }}
                transition={{
                  duration: 7 + item * 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
