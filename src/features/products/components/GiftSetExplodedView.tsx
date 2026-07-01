import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getLocalizedProduct } from "../../../content/i18n";
import { useLanguage } from "../../../contexts/LanguageContext";
import { luxuryEase } from "../../../styles/luxuryEffects";
import { products } from "../data/products";
import { productsPageStyles as styles } from "../../../styles/productsPageClasses";

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
  const { language } = useLanguage();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const baseGiftSet = products.find((product) => product.id === "gift-set");
  const giftSet = baseGiftSet ? getLocalizedProduct(baseGiftSet, language) : undefined;
  const copy = {
    vi: {
      alt: "Senova Gift Set dạng bung tách thành phần",
      detailAria: "Xem thông tin chi tiết:",
      description:
        "Gift Set kết hợp Classic, Petal Pack, hướng dẫn pha và thẻ câu chuyện trong một bộ quà thống nhất. Điều được trao đi là thời gian chuẩn bị, sự lựa chọn có chủ đích và lời mời người nhận dành cho mình một khoảng lặng.",
      hotspots: [
        { id: 1, top: "35%", left: "30%", title: "Senova Classic", description: "Phần trà hương sen nền tảng, giúp người nhận bắt đầu bằng một tách trà có thể pha thường xuyên." },
        { id: 2, top: "48%", left: "48%", title: "Senova Petal Pack", description: "Điểm nhấn mở cánh, giúp người nhận tiếp xúc với sản phẩm qua hình dáng, thao tác và giác quan." },
        { id: 3, top: "62%", left: "25%", title: "Thẻ câu chuyện", description: "Nội dung ngắn giải thích hành trình Giữ - Mở - Trao và mở đường đến câu chuyện số qua QR." },
        { id: 4, top: "30%", left: "70%", title: "Bao bì đồng bộ", description: "Không gian sắp đặt các thành phần theo một trình tự rõ ràng, để phần trang trí không lấn át sản phẩm." },
        { id: 5, top: "65%", left: "65%", title: "Hướng dẫn pha", description: "Chỉ dẫn người nhận bắt đầu đúng với từng phiên bản sản phẩm, thay vì phải tự tìm thông tin." },
      ],
    },
    en: {
      alt: "Exploded component view of Senova Gift Set",
      detailAria: "View detail:",
      description:
        "Gift Set combines Classic, Petal Pack, brewing guidance and story cards in one composed gift. What is given is preparation time, deliberate choice and an invitation for the recipient to keep a quiet pause.",
      hotspots: [
        { id: 1, top: "35%", left: "30%", title: "Senova Classic", description: "The foundational lotus tea that lets the recipient begin with a cup they can brew regularly." },
        { id: 2, top: "48%", left: "48%", title: "Senova Petal Pack", description: "The opening gesture that lets the recipient meet the product through shape, touch and senses." },
        { id: 3, top: "62%", left: "25%", title: "Story card", description: "Short content explaining the Keep - Open - Give journey and leading into the digital story through QR." },
        { id: 4, top: "30%", left: "70%", title: "Composed packaging", description: "A clear arrangement of components so decoration never overwhelms the product." },
        { id: 5, top: "65%", left: "65%", title: "Brewing guide", description: "Guidance that helps the recipient begin correctly with each product version." },
      ],
    },
  }[language] satisfies { alt: string; detailAria: string; description: string; hotspots: Hotspot[] };

  if (!giftSet) return null;

  return (
    <section id="gift-set" className={styles.giftSetSection}>
      <div className={styles.giftSetContainer}>
        <div className={styles.giftSetHeader}>
          <span className={styles.giftSetKicker}>{giftSet.eyebrow}</span>
          <h2 className={styles.giftSetTitle}>{giftSet.name}</h2>
          <p className={styles.giftSetTagline}>&ldquo;{giftSet.tagline}&rdquo;</p>
          <p className={styles.giftSetDescription}>{copy.description}</p>
        </div>

        <div className={styles.explodedStage}>
          <div className={styles.explodedImageWrapper}>
            <div className={styles.explodedGlow} />
            <img
              src={giftSet.image}
              alt={copy.alt}
              className={styles.explodedImage}
              loading="lazy"
              decoding="async"
            />

            {copy.hotspots.map((hotspot) => {
              const isActive = activeHotspot === hotspot.id;

              return (
                <div key={hotspot.id} className={styles.hotspotAnchor} style={{ top: hotspot.top, left: hotspot.left }}>
                  <button
                    type="button"
                    className={`${styles.hotspotBtn} ${isActive ? styles.hotspotBtnActive : ""}`}
                    onClick={() => setActiveHotspot(isActive ? null : hotspot.id)}
                    aria-label={`${copy.detailAria} ${hotspot.title}`}
                    aria-expanded={isActive}
                  >
                    <span className={styles.hotspotPulse} />
                    <span className={styles.hotspotIcon}>+</span>
                  </button>

                  <AnimatePresence>
                    {!isMobile && isActive ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 8, filter: "blur(3px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.96, y: 8, filter: "blur(2px)" }}
                        transition={{ duration: 0.48, ease: luxuryEase }}
                        className={styles.hotspotPopover}
                      >
                        <h4 className={styles.popoverTitle}>{hotspot.title}</h4>
                        <p className={styles.popoverDescription}>{hotspot.description}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {isMobile && activeHotspot !== null ? (
          <div className={styles.mobileHotspotDetail}>
            <h4 className={styles.mobileHotspotDetailTitle}>
              {copy.hotspots.find((hotspot) => hotspot.id === activeHotspot)?.title}
            </h4>
            <p className={styles.mobileHotspotDetailDesc}>
              {copy.hotspots.find((hotspot) => hotspot.id === activeHotspot)?.description}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
