import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "../../../pages/ProductsPage/ProductsPage.module.css";
import { Link } from "../../../contexts/RouterContext";

export function ProductJourney() {
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Animate the icons converging to center on scroll
  const classicTranslateXVal = useTransform(scrollYProgress, [0.1, 0.85], [-120, 0]);
  const classicOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.85], [0, 0.8, 1]);
  
  const giftSetTranslateXVal = useTransform(scrollYProgress, [0.1, 0.85], [120, 0]);
  const giftSetOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.85], [0, 0.8, 1]);

  const petalPackTranslateYVal = useTransform(scrollYProgress, [0.1, 0.85], [40, 0]);
  const petalPackOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.85], [0, 0.9, 1]);

  const classicTranslateX = isMobile ? 0 : classicTranslateXVal;
  const giftSetTranslateX = isMobile ? 0 : giftSetTranslateXVal;
  const petalPackTranslateY = isMobile ? 0 : petalPackTranslateYVal;

  // Lotus path morph / merge effect
  const logoScale = useTransform(scrollYProgress, [0.75, 0.95], [0.85, 1]);
  const logoGlow = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);

  return (
    <section ref={containerRef} className={styles.journeySection}>
      <div className={styles.journeyContainer}>
        
        {/* Converging visual path */}
        <div className={styles.convergeStage}>
          <div className={styles.trackLine}>
            {/* Curved background line vector */}
            <svg className={styles.trackSvg} viewBox="0 0 400 100" fill="none">
              <path d="M50 80 Q200 10 350 80" stroke="rgba(255, 250, 240, 0.08)" strokeWidth="1.5" />
            </svg>
          </div>

          <div className={styles.convergeItems}>
            {/* Classic Icon bubble */}
            <motion.div 
              className={`${styles.convergeBubble} ${styles.bubbleClassic}`}
              style={{ x: classicTranslateX, opacity: classicOpacity }}
            >
              <span className={styles.bubbleLabel}>Classic</span>
              <p className={styles.bubbleRole}>Dùng hằng ngày</p>
            </motion.div>

            {/* Petal Pack Icon bubble (Center peak) */}
            <motion.div 
              className={`${styles.convergeBubble} ${styles.bubblePetalPack}`}
              style={{ y: petalPackTranslateY, opacity: petalPackOpacity }}
            >
              <span className={styles.bubbleLabel}>Petal Pack</span>
              <p className={styles.bubbleRole}>Trải nghiệm</p>
            </motion.div>

            {/* Gift Set Icon bubble */}
            <motion.div 
              className={`${styles.convergeBubble} ${styles.bubbleGiftSet}`}
              style={{ x: giftSetTranslateX, opacity: giftSetOpacity }}
            >
              <span className={styles.bubbleLabel}>Gift Set</span>
              <p className={styles.bubbleRole}>Trao tặng</p>
            </motion.div>
          </div>

          {/* Calmora central merge icon */}
          <motion.div 
            className={styles.centralLogoWrap}
            style={{ scale: logoScale }}
          >
            <motion.div 
              className={styles.centralLogoGlow} 
              style={{ opacity: logoGlow }} 
            />
            {/* Clean Calmora mark */}
            <svg className={styles.calmoraMarkSvg} viewBox="0 0 100 100" fill="none">
              <path d="M50 15 C45 35 30 55 50 85 C70 55 55 35 50 15 Z" fill="rgba(248, 223, 147, 0.15)" stroke="var(--accent-gold)" strokeWidth="1.8" />
              <path d="M50 35 C42 48 42 70 50 85 C58 70 58 48 50 35 Z" fill="rgba(185, 86, 114, 0.2)" stroke="var(--accent)" strokeWidth="1.2" />
            </svg>
          </motion.div>
        </div>

        {/* Final copy */}
        <div className={styles.journeyCopy}>
          <h2 className={styles.journeyHeadline}>
            Không chỉ chọn một loại trà.<br />
            Hãy chọn cách bạn muốn chạm vào hương sen Việt.
          </h2>

          <div className={styles.journeyActions}>
            <Link href="/san-pham/petal-pack" className={styles.journeyPrimaryBtn}>
              Khám phá Petal Pack
            </Link>
            <a href="mailto:hello@senova.vn" className={styles.journeySecondaryBtn}>
              Nhận thông tin sản phẩm
            </a>
          </div>

          <div className={styles.journeyLinkWrap}>
            <Link href="/story" className={styles.journeyStoryLink}>
              Câu chuyện Senova <span className={styles.arrowIcon}>→</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
