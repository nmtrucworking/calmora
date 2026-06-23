import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "../data/products";
import styles from "../../../pages/ProductsPage/ProductsPage.module.css";
import { ArrowRight } from "lucide-react";


type ProductId = "classic" | "petal-pack" | "gift-set";

function getInitialProductId(): ProductId {
  const hash = window.location.hash.replace("#", "");
  if (hash === "classic" || hash === "petal-pack" || hash === "gift-set") {
    return hash;
  }
  return "petal-pack";
}

export function LotusOrbitNav() {
  const [activeId, setActiveId] = useState<ProductId>(() => getInitialProductId());

  const handleSelect = (id: ProductId) => {
    setActiveId(id);
    // Update hash without triggering a page reload
    window.history.pushState(null, "", `#${id}`);
  };

  const activeProduct = products.find((p) => p.id === activeId) || products[1];

  // Helper to get orbital positioning classes
  const getOrbitPosition = (id: string) => {
    if (id === activeId) return styles.orbitActive;
    if (activeId === "petal-pack") {
      return id === "classic" ? styles.orbitLeft : styles.orbitRight;
    }
    if (activeId === "classic") {
      return id === "petal-pack" ? styles.orbitRight : styles.orbitBack;
    }
    // activeId is gift-set
    return id === "petal-pack" ? styles.orbitLeft : styles.orbitBack;
  };

  return (
    <section className={styles.orbitSection} aria-label="Lựa chọn sản phẩm">
      <div className={styles.orbitContainer}>
        <div className={styles.orbitHeader}>
          <span className={styles.orbitLabel}>Khám phá bộ sản phẩm</span>
          <h2 className={styles.orbitTitle}>Chọn một hình thái thưởng trà</h2>
        </div>

        {/* Orbit Ring Layout */}
        <div className={styles.orbitStage}>
          {/* Centered lotus core element */}
          <div className={styles.orbitCore}>
            <div className={styles.coreGlow} />
          </div>

          {/* Orbit Items */}
          <div className={styles.orbitTrack}>
            {products.map((p) => {
              const posClass = getOrbitPosition(p.id);
              const isActive = p.id === activeId;
              
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`${styles.orbitItem} ${posClass}`}
                  onClick={() => handleSelect(p.id)}
                  aria-pressed={isActive}
                  aria-label={`Xem sản phẩm ${p.name}`}
                >
                  <div className={styles.orbitItemCard}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className={styles.orbitItemImage}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={styles.orbitItemLabel}>{p.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Info Area */}
        <div className={styles.orbitDetailWrap}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={styles.orbitDetailGrid}
            >
              <div className={styles.orbitDetailCopy}>
                <span className={styles.detailEyebrow}>{activeProduct.eyebrow}</span>
                <h3 className={styles.detailName}>{activeProduct.name}</h3>
                <p className={styles.detailTagline}>&ldquo;{activeProduct.tagline}&rdquo;</p>
                <p className={styles.detailDescription}>{activeProduct.description}</p>
                
                <div className={styles.detailActions}>
                  <a href={`#${activeProduct.id}`} className={styles.detailCta}>
                    Khám phá nghi thức {activeProduct.role.toLowerCase()}
                    <ArrowRight className={styles.detailCtaIcon} />
                  </a>
                </div>
              </div>

              <div className={styles.orbitDetailVisual}>
                <div className={styles.visualGlow} />
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className={styles.detailImage}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
