import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "../../../pages/ProductsPage/ProductsPage.module.css";
import { products } from "../data/products";

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
            Một nhịp trà có thể lặp lại mỗi ngày. Senova Classic giữ hương sen thanh trong một hình thức dễ pha, dễ sử dụng và đủ gần gũi để trở thành thói quen cân bằng mỗi buổi sáng của bạn.
          </p>

          <div className={styles.classicPillars}>
            <div className={styles.pillarItem}>
              <span className={styles.pillarNum}>01</span>
              <div>
                <h4 className={styles.pillarTitle}>Mở gói</h4>
                <p className={styles.pillarText}>Bao bì giấy kraft tráng bạc mộc mạc, bảo quản trà tối đa.</p>
              </div>
            </div>
            <div className={styles.pillarItem}>
              <span className={styles.pillarNum}>02</span>
              <div>
                <h4 className={styles.pillarTitle}>Ngâm trà</h4>
                <p className={styles.pillarText}>Túi lọc tam giác phân hủy sinh học, giải phóng tối đa hương vị.</p>
              </div>
            </div>
            <div className={styles.pillarItem}>
              <span className={styles.pillarNum}>03</span>
              <div>
                <h4 className={styles.pillarTitle}>Dành một khoảng chậm</h4>
                <p className={styles.pillarText}>3 phút chờ đợi là khoảng thời gian tĩnh lặng bắt đầu ngày mới.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
