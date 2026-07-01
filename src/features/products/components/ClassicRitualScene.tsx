import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { productsPageStyles as styles } from "../../../styles/productsPageClasses";
import { products } from "../data/products";

import { PackageOpen, Droplets, Timer } from "lucide-react";

export function ClassicRitualScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const classicProduct = products.find((p) => p.id === "classic");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Animate elements along a curve path on scroll
  const packetX = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [-40, 20, 110]);
  const packetY = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [60, -10, 20]);
  const packetRotate = useTransform(scrollYProgress, [0.1, 0.9], [5, 45]);
  const packetOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.7, 0.9], [0, 1, 1, 0]);

  // Steaming cup heat wave opacity
  const steamOpacity = useTransform(scrollYProgress, [0.45, 0.7, 0.95], [0, 0.85, 0]);

  if (!classicProduct) return null;

  return (
    <section id="classic" ref={containerRef} className={styles.classicSection}>
      <div className={styles.classicGrid}>
        
        {/* Table Scene Frame */}
        <div className={styles.classicVisualStage}>
          <div className={styles.classicTableSurface}>
            {/* Shadows */}
            <div className={styles.classicShadow} />
            
            {/* Box packshot */}
            <motion.div 
              className={styles.classicBoxWrapper}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={classicProduct.image}
                alt={classicProduct.name}
                className={styles.classicBoxImage}
                loading="lazy"
                decoding="async"
              />
            </motion.div>

            {/* Floating Tea Packet sliding on curve */}
            <motion.div 
              className={styles.classicPacketWrapper}
              style={{ x: packetX, y: packetY, rotate: packetRotate, opacity: packetOpacity }}
            >
              <div className={styles.classicPacket}>
                <span className={styles.packetMark}>SENOVA</span>
              </div>
            </motion.div>

            {/* Tea Cup at the end of the curve */}
            <div className={styles.classicCupWrapper}>
              {/* Animated steam lines */}
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

        {/* Copy Content */}
        <div className={styles.classicCopy}>
          <span className={styles.classicKicker}>{classicProduct.eyebrow}</span>
          <h2 className={styles.classicTitle}>{classicProduct.name}</h2>
          <p className={styles.classicTagline}>&ldquo;{classicProduct.tagline}&rdquo;</p>
          <p className={styles.classicDescription}>
            Classic là điểm bắt đầu của Senova: trà hương sen được trình bày trong hình thức thuận tiện để người dùng có thể pha và thưởng thức thường xuyên.
          </p>

          <div className={styles.classicPillars}>
            <div className={styles.pillarItem}>
              <div className={styles.pillarIconWrap}>
                <PackageOpen className={styles.pillarIcon} />
              </div>
              <div>
                <h4 className={styles.pillarTitle}>Mở gói</h4>
                <p className={styles.pillarText}>Lấy một phần trà đã được định lượng, giữ thao tác gọn và sạch.</p>
              </div>
            </div>
            <div className={styles.pillarItem}>
              <div className={styles.pillarIconWrap}>
                <Droplets className={styles.pillarIcon} />
              </div>
              <div>
                <h4 className={styles.pillarTitle}>Pha trà</h4>
                <p className={styles.pillarText}>Đặt phần trà vào cốc và thực hiện theo hướng dẫn in trên bao bì.</p>
              </div>
            </div>
            <div className={styles.pillarItem}>
              <div className={styles.pillarIconWrap}>
                <Timer className={styles.pillarIcon} />
              </div>
              <div>
                <h4 className={styles.pillarTitle}>Dành một khoảng chậm</h4>
                <p className={styles.pillarText}>Chờ hương sen và vị trà dần hiện ra trước khi thưởng thức.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
