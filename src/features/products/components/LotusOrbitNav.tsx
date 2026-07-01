import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getLocalizedProducts } from "../../../content/i18n";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Link } from "../../../contexts/RouterContext";
import { luxuryEase } from "../../../styles/luxuryEffects";
import { products } from "../data/products";
import { productsPageStyles as styles } from "../../../styles/productsPageClasses";

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
  const [isMobile, setIsMobile] = useState(false);
  const { language } = useLanguage();
  const localizedProducts = getLocalizedProducts(products, language);
  const copy = {
    vi: {
      aria: "Lựa chọn sản phẩm",
      label: "Khám phá bộ sản phẩm",
      title: "Chọn một hình thái thưởng trà",
      viewProduct: "Xem",
      viewProductAria: "Xem sản phẩm",
    },
    en: {
      aria: "Product selection",
      label: "Explore the product edit",
      title: "Choose a form of tea ritual",
      viewProduct: "View",
      viewProductAria: "View product",
    },
  }[language];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (id: ProductId) => {
    setActiveId(id);
    window.history.pushState(null, "", `#${id}`);
  };

  const activeProduct = localizedProducts.find((product) => product.id === activeId) ?? localizedProducts[1];

  const getOrbitPosition = (id: string) => {
    if (id === activeId) return styles.orbitActive;
    if (activeId === "petal-pack") {
      return id === "classic" ? styles.orbitLeft : styles.orbitRight;
    }
    if (activeId === "classic") {
      return id === "petal-pack" ? styles.orbitRight : styles.orbitBack;
    }
    return id === "petal-pack" ? styles.orbitLeft : styles.orbitBack;
  };

  return (
    <section className={styles.orbitSection} aria-label={copy.aria}>
      <div className={styles.orbitContainer}>
        <div className={styles.orbitHeader}>
          <span className={styles.orbitLabel}>{copy.label}</span>
          <h2 className={styles.orbitTitle}>{copy.title}</h2>
        </div>

        {isMobile ? (
          <div className={styles.mobileTabSelector}>
            {localizedProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                className={`${styles.mobileTabBtn} ${activeId === product.id ? styles.mobileTabBtnActive : ""}`}
                onClick={() => handleSelect(product.id)}
              >
                {product.role}
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.orbitStage}>
            <div className={styles.orbitCore}>
              <div className={styles.coreGlow} />
            </div>

            <div className={styles.orbitTrack}>
              {localizedProducts.map((product) => {
                const isActive = product.id === activeId;

                return (
                  <button
                    key={product.id}
                    type="button"
                    className={`${styles.orbitItem} ${getOrbitPosition(product.id)}`}
                    onClick={() => handleSelect(product.id)}
                    aria-pressed={isActive}
                    aria-label={`${copy.viewProductAria} ${product.name}`}
                  >
                    <div className={styles.orbitItemCard}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.orbitItemImage}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className={styles.orbitItemLabel}>{product.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.orbitDetailWrap}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
              transition={{ duration: 0.82, ease: luxuryEase }}
              className={styles.orbitDetailGrid}
            >
              <div className={styles.orbitDetailCopy}>
                <span className={styles.detailEyebrow}>{activeProduct.eyebrow}</span>
                <h3 className={styles.detailName}>{activeProduct.name}</h3>
                <p className={styles.detailTagline}>&ldquo;{activeProduct.tagline}&rdquo;</p>
                <p className={styles.detailDescription}>{activeProduct.description}</p>

                <div className={styles.detailActions}>
                  <Link href={activeProduct.href} className={styles.detailCta}>
                    {copy.viewProduct} {activeProduct.name}
                    <ArrowRight className={styles.detailCtaIcon} />
                  </Link>
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
