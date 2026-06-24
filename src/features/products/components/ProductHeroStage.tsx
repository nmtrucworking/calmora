import { motion, useMotionValue, useTransform } from "framer-motion";
import { type MouseEvent, useRef, useState, useEffect } from "react";
import { products } from "../data/products";
import styles from "../../../pages/ProductsPage/ProductsPage.module.css";
import { TextReveal } from "../../../components/ui/ZenMotion";

export function ProductHeroStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax transforms for the three products
  // Foreground (Petal Pack) shifts the most
  const petalPackX = useTransform(mouseX, [-300, 300], [-25, 25]);
  const petalPackY = useTransform(mouseY, [-300, 300], [-25, 25]);

  // Middleground (Classic) shifts medium
  const classicX = useTransform(mouseX, [-300, 300], [-12, 12]);
  const classicY = useTransform(mouseY, [-300, 300], [-12, 12]);

  // Background (Gift Set) shifts the least
  const giftSetX = useTransform(mouseX, [-300, 300], [-6, 6]);
  const giftSetY = useTransform(mouseY, [-300, 300], [-6, 6]);

  const handleMouseMove = (e: MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates from center
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Reset spring to center
    mouseX.set(0);
    mouseY.set(0);
  };

  const classic = products.find((p) => p.id === "classic");
  const petalPack = products.find((p) => p.id === "petal-pack");
  const giftSet = products.find((p) => p.id === "gift-set");

  return (
    <section 
      ref={containerRef}
      className={styles.heroSection}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-labelledby="hero-title"
    >
      <div className={styles.heroContainer}>
        {/* Text Area */}
        <div className={styles.heroText}>
          <p className={styles.heroEyebrow}>SENOVA COLLECTION / 01—03</p>
          <h1 id="hero-title" className={styles.heroTitle}>
            <TextReveal text="Ba hình hài của một câu chuyện trà sen." />
          </h1>
          <p className={styles.heroSubtitle}>
            Một tách trà để giữ. Một cánh sen để mở. Một món quà để trao.
          </p>
        </div>

        {/* 3D Parallax Stage */}
        <div className={styles.stageFrame}>
          {/* Floor / Table reflection effect */}
          <div className={styles.stageFloor} />

          {/* Layer 1: Background - Gift Set */}
          {giftSet && (
            <motion.div
              className={`${styles.productLayer} ${styles.layerGiftSet}`}
              style={{ x: giftSetX, y: giftSetY, z: -20, scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <img
                src={giftSet.image}
                alt={giftSet.name}
                className={styles.productImage}
                decoding="async"
                fetchPriority="high"
              />
              <div className={styles.layerLabel}>{giftSet.role}</div>
            </motion.div>
          )}

          {/* Layer 2: Middleground - Classic */}
          {classic && (
            <motion.div
              className={`${styles.productLayer} ${styles.layerClassic}`}
              style={{ x: classicX, y: classicY, z: 10, scale: 0.85 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              <img
                src={classic.image}
                alt={classic.name}
                className={styles.productImage}
                decoding="async"
                fetchPriority="high"
              />
              <div className={styles.layerLabel}>{classic.role}</div>
            </motion.div>
          )}

          {/* Layer 3: Foreground - Petal Pack */}
          {petalPack && (
            <motion.div
              className={`${styles.productLayer} ${styles.layerPetalPack}`}
              style={{ x: petalPackX, y: petalPackY, z: 30, scale: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={petalPack.image}
                alt={petalPack.name}
                className={styles.productImage}
                decoding="async"
                fetchPriority="high"
              />
              <div className={styles.layerLabel}>{petalPack.role}</div>
            </motion.div>
          )}

          {/* Floating petals decor */}
          <div className={styles.floatingPetals}>
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={`${styles.petalDecor} ${styles[`petal${i}`]}`}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 8, 0],
                }}
                transition={{
                  duration: 4 + i * 1.5,
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
