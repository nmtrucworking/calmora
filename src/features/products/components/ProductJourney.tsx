import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getLocalizedProducts } from "../../../content/i18n";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Link } from "../../../contexts/RouterContext";
import { products } from "../data/products";
import { productsPageStyles as styles } from "../../../styles/productsPageClasses";

export function ProductJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { language } = useLanguage();
  const localizedProducts = getLocalizedProducts(products, language);
  const classic = localizedProducts.find((product) => product.id === "classic");
  const petalPack = localizedProducts.find((product) => product.id === "petal-pack");
  const giftSet = localizedProducts.find((product) => product.id === "gift-set");
  const copy = {
    vi: {
      headline: "Câu chuyện không kết thúc khi tách trà cạn.",
      subline: "Nó tiếp tục khi được hiểu và kể lại.",
      primary: "Khám phá Petal Pack",
      secondary: "Đăng ký mẫu thử",
      story: "Câu chuyện Senova",
    },
    en: {
      headline: "The story does not end when the cup is empty.",
      subline: "It continues when it is understood and retold.",
      primary: "Explore Petal Pack",
      secondary: "Request a sample",
      story: "Senova story",
    },
  }[language];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const classicTranslateXVal = useTransform(scrollYProgress, [0.1, 0.85], [-120, 0]);
  const classicOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.85], [0, 0.8, 1]);
  const giftSetTranslateXVal = useTransform(scrollYProgress, [0.1, 0.85], [120, 0]);
  const giftSetOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.85], [0, 0.8, 1]);
  const petalPackTranslateYVal = useTransform(scrollYProgress, [0.1, 0.85], [40, 0]);
  const petalPackOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.85], [0, 0.9, 1]);
  const logoScale = useTransform(scrollYProgress, [0.75, 0.95], [0.85, 1]);
  const logoGlow = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);

  const classicTranslateX = isMobile ? 0 : classicTranslateXVal;
  const giftSetTranslateX = isMobile ? 0 : giftSetTranslateXVal;
  const petalPackTranslateY = isMobile ? 0 : petalPackTranslateYVal;

  return (
    <section ref={containerRef} className={styles.journeySection}>
      <div className={styles.journeyContainer}>
        <div className={styles.convergeStage}>
          <div className={styles.trackLine}>
            <svg className={styles.trackSvg} viewBox="0 0 400 100" fill="none">
              <path d="M50 80 Q200 10 350 80" stroke="rgba(255, 250, 240, 0.08)" strokeWidth="1.5" />
            </svg>
          </div>

          <div className={styles.convergeItems}>
            {classic ? (
              <motion.div
                className={`${styles.convergeBubble} ${styles.bubbleClassic}`}
                style={{ x: classicTranslateX, opacity: classicOpacity }}
              >
                <span className={styles.bubbleLabel}>Classic</span>
                <p className={styles.bubbleRole}>{classic.role}</p>
              </motion.div>
            ) : null}

            {petalPack ? (
              <motion.div
                className={`${styles.convergeBubble} ${styles.bubblePetalPack}`}
                style={{ y: petalPackTranslateY, opacity: petalPackOpacity }}
              >
                <span className={styles.bubbleLabel}>Petal Pack</span>
                <p className={styles.bubbleRole}>{petalPack.role}</p>
              </motion.div>
            ) : null}

            {giftSet ? (
              <motion.div
                className={`${styles.convergeBubble} ${styles.bubbleGiftSet}`}
                style={{ x: giftSetTranslateX, opacity: giftSetOpacity }}
              >
                <span className={styles.bubbleLabel}>Gift Set</span>
                <p className={styles.bubbleRole}>{giftSet.role}</p>
              </motion.div>
            ) : null}
          </div>

          <motion.div className={styles.centralLogoWrap} style={{ scale: logoScale }}>
            <motion.div className={styles.centralLogoGlow} style={{ opacity: logoGlow }} />
            <svg className={styles.calmoraMarkSvg} viewBox="0 0 100 100" fill="none">
              <path d="M50 15 C45 35 30 55 50 85 C70 55 55 35 50 15 Z" fill="rgba(248, 223, 147, 0.15)" stroke="var(--accent-gold)" strokeWidth="1.8" />
              <path d="M50 35 C42 48 42 70 50 85 C58 70 58 48 50 35 Z" fill="rgba(185, 86, 114, 0.2)" stroke="var(--accent)" strokeWidth="1.2" />
            </svg>
          </motion.div>
        </div>

        <div className={styles.journeyCopy}>
          <h2 className={styles.journeyHeadline}>
            {copy.headline}
            <br />
            {copy.subline}
          </h2>

          <div className={styles.journeyActions}>
            <Link href="/products/petal-pack" className={styles.journeyPrimaryBtn}>
              {copy.primary}
            </Link>
            <Link href="/dat-truoc" className={styles.journeySecondaryBtn}>
              {copy.secondary}
            </Link>
          </div>

          <div className={styles.journeyLinkWrap}>
            <Link href="/story" className={styles.journeyStoryLink}>
              {copy.story} <span className={styles.arrowIcon}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
