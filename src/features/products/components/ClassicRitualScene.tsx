import { motion, useScroll, useTransform } from "framer-motion";
import { Droplets, PackageOpen, Timer } from "lucide-react";
import { useRef } from "react";
import { getLocalizedProduct } from "../../../content/i18n";
import { useLanguage } from "../../../contexts/LanguageContext";
import { luxuryEase } from "../../../styles/luxuryEffects";
import { products } from "../data/products";
import { productsPageStyles as styles } from "../../../styles/productsPageClasses";

const pillarIcons = [PackageOpen, Droplets, Timer];

export function ClassicRitualScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const baseClassicProduct = products.find((product) => product.id === "classic");
  const classicProduct = baseClassicProduct ? getLocalizedProduct(baseClassicProduct, language) : undefined;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const packetX = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [-24, 18, 82]);
  const packetY = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [44, -6, 18]);
  const packetRotate = useTransform(scrollYProgress, [0.1, 0.9], [3, 22]);
  const packetOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.7, 0.9], [0, 1, 1, 0]);
  const steamOpacity = useTransform(scrollYProgress, [0.45, 0.7, 0.95], [0, 0.85, 0]);

  if (!classicProduct) return null;

  return (
    <section id="classic" ref={containerRef} className={styles.classicSection}>
      <div className={styles.classicGrid}>
        <div className={styles.classicVisualStage}>
          <div className={styles.classicTableSurface}>
            <div className={styles.classicShadow} />

            <motion.div
              className={styles.classicBoxWrapper}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.18, ease: luxuryEase }}
            >
              <img
                src={classicProduct.image}
                alt={classicProduct.name}
                className={styles.classicBoxImage}
                loading="lazy"
                decoding="async"
              />
            </motion.div>

            <motion.div
              className={styles.classicPacketWrapper}
              style={{ x: packetX, y: packetY, rotate: packetRotate, opacity: packetOpacity }}
            >
              <div className={styles.classicPacket}>
                <span className={styles.packetMark}>SENOVA</span>
              </div>
            </motion.div>

            <div className={styles.classicCupWrapper}>
              <motion.div className={styles.classicSteam} style={{ opacity: steamOpacity }}>
                <span className={styles.steamWave1}>~</span>
                <span className={styles.steamWave2}>~</span>
              </motion.div>
              <div className={styles.classicCup}>
                <div className={styles.cupRim} />
                <div className={styles.cupLiquid} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.classicCopy}>
          <span className={styles.classicKicker}>{classicProduct.eyebrow}</span>
          <h2 className={styles.classicTitle}>{classicProduct.name}</h2>
          <p className={styles.classicTagline}>&ldquo;{classicProduct.tagline}&rdquo;</p>
          <p className={styles.classicDescription}>{classicProduct.description}</p>

          <div className={styles.classicPillars}>
            {classicProduct.experienceSteps.slice(0, 3).map((step, index) => {
              const Icon = pillarIcons[index] ?? PackageOpen;

              return (
                <div className={styles.pillarItem} key={step.title}>
                  <div className={styles.pillarIconWrap}>
                    <Icon className={styles.pillarIcon} />
                  </div>
                  <div>
                    <h4 className={styles.pillarTitle}>{step.title}</h4>
                    <p className={styles.pillarText}>{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
