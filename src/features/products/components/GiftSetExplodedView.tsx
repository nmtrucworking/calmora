import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productsPageStyles as styles } from "../../../styles/productsPageClasses";
import { products } from "../data/products";

type Hotspot = {
  id: number;
  top: string;
  left: string;
  title: string;
  description: string;
};

export function GiftSetExplodedView() {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const giftSet = products.find((p) => p.id === "gift-set");

  const hotspots: Hotspot[] = [
    {
      id: 1,
      top: "35%",
      left: "30%",
      title: "Senova Classic",
      description: "Phần trà hương sen nền tảng, giúp người nhận bắt đầu bằng một tách trà có thể pha thường xuyên.",
    },
    {
      id: 2,
      top: "48%",
      left: "48%",
      title: "Senova Petal Pack",
      description: "Điểm nhấn mở cánh, giúp người nhận tiếp xúc với sản phẩm qua hình dáng, thao tác và giác quan.",
    },
    {
      id: 3,
      top: "62%",
      left: "25%",
      title: "Thẻ câu chuyện",
      description: "Nội dung ngắn giải thích hành trình Giữ - Mở - Trao và mở đường đến câu chuyện số qua QR.",
    },
    {
      id: 4,
      top: "30%",
      left: "70%",
      title: "Bao bì đồng bộ",
      description: "Không gian sắp đặt các thành phần theo một trình tự rõ ràng, để phần trang trí không lấn át sản phẩm.",
    },
    {
      id: 5,
      top: "65%",
      left: "65%",
      title: "Hướng dẫn pha",
      description: "Chỉ dẫn người nhận bắt đầu đúng với từng phiên bản sản phẩm, thay vì phải tự tìm thông tin.",
    },
  ];

  if (!giftSet) return null;

  return (
    <section id="gift-set" className={styles.giftSetSection}>
      <div className={styles.giftSetContainer}>
        
        {/* Header copy */}
        <div className={styles.giftSetHeader}>
          <span className={styles.giftSetKicker}>{giftSet.eyebrow}</span>
          <h2 className={styles.giftSetTitle}>{giftSet.name}</h2>
          <p className={styles.giftSetTagline}>&ldquo;{giftSet.tagline}&rdquo;</p>
          <p className={styles.giftSetDescription}>
            Gift Set kết hợp Classic, Petal Pack, hướng dẫn pha và thẻ câu chuyện trong một bộ quà thống nhất. Điều được trao đi là thời gian chuẩn bị, sự lựa chọn có chủ đích và lời mời người nhận dành cho mình một khoảng lặng.
          </p>
        </div>

        {/* Visual Stage with Hotspots */}
        <div className={styles.explodedStage}>
          <div className={styles.explodedImageWrapper}>
            <div className={styles.explodedGlow} />
            <img
              src={giftSet.image}
              alt="Senova Gift Set Exploded View"
              className={styles.explodedImage}
              loading="lazy"
              decoding="async"
            />

            {/* Hotspot buttons */}
            {hotspots.map((hs) => {
              const isActive = activeHotspot === hs.id;
              return (
                <div 
                  key={hs.id}
                  className={styles.hotspotAnchor}
                  style={{ top: hs.top, left: hs.left }}
                >
                  <button
                    type="button"
                    className={`${styles.hotspotBtn} ${isActive ? styles.hotspotBtnActive : ""}`}
                    onClick={() => setActiveHotspot(isActive ? null : hs.id)}
                    aria-label={`Xem thông tin chi tiết: ${hs.title}`}
                    aria-expanded={isActive}
                  >
                    <span className={styles.hotspotPulse} />
                    <span className={styles.hotspotIcon}>+</span>
                  </button>

                  {/* Popover overlay (desktop only) */}
                  <AnimatePresence>
                    {!isMobile && isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.hotspotPopover}
                      >
                        <h4 className={styles.popoverTitle}>{hs.title}</h4>
                        <p className={styles.popoverDescription}>{hs.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Hotspot Detail Card */}
        {isMobile && activeHotspot !== null && (
          <div className={styles.mobileHotspotDetail}>
            <h4 className={styles.mobileHotspotDetailTitle}>
              {hotspots.find((h) => h.id === activeHotspot)?.title}
            </h4>
            <p className={styles.mobileHotspotDetailDesc}>
              {hotspots.find((h) => h.id === activeHotspot)?.description}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
