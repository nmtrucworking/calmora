import { ArrowRight } from "lucide-react";
import { Link } from "@app/router/RouterContext";
import { useLanguage } from "@app/providers/LanguageContext";
import styles from "./LuxuryEditorialPage.module.css";

type EditorialBlock = {
  label?: string;
  title: string;
  text: string;
};

type EditorialAction = {
  label: string;
  href: string;
};

type LuxuryEditorialPageProps = {
  blocks: EditorialBlock[];
  description: string;
  eyebrow: string;
  primaryAction: EditorialAction;
  secondaryAction?: EditorialAction;
  title: string;
  variant: "gifting" | "ritual";
};

const editorialCopy = {
  vi: {
    ritual: {
      sequenceEyebrow: "Một nghi thức Senova",
      sequenceTitle: "Sáu chuyển động. Một khoảng trà.",
      statement: "Nghi thức không thêm thời gian. Nó trả lại sự chú ý.",
      editEyebrow: "Chọn hình thức",
      editTitle: "Ba cách để bắt đầu một khoảng trà.",
      closing: "Bắt đầu bằng một sản phẩm phù hợp với nhịp sống của bạn.",
    },
    gifting: {
      sequenceEyebrow: "Nghệ thuật trao tặng",
      sequenceTitle: "Ba chi tiết làm nên một món quà.",
      statement: "Điều được nhớ lại không chỉ là món quà, mà là cách nó được trao.",
      editEyebrow: "Senova Gifting",
      editTitle: "Một lời nhắn được chuẩn bị bằng hương sen.",
      closing: "Hãy để Senova chuẩn bị món quà theo đúng người nhận và thời điểm trao.",
    },
  },
  en: {
    ritual: {
      sequenceEyebrow: "A Senova ritual",
      sequenceTitle: "Six gestures. One quiet tea moment.",
      statement: "Ritual does not add time. It gives attention back.",
      editEyebrow: "Choose a form",
      editTitle: "Three ways to begin a quiet tea moment.",
      closing: "Begin with the expression that suits your rhythm.",
    },
    gifting: {
      sequenceEyebrow: "The art of gifting",
      sequenceTitle: "Three details shape a memorable gift.",
      statement: "What remains is not only the gift, but the way it was given.",
      editEyebrow: "Senova Gifting",
      editTitle: "A message prepared through the scent of lotus.",
      closing: "Let Senova prepare the gift around its recipient and moment.",
    },
  },
} as const;

const productEdit = [
  {
    href: "/products/classic",
    image: "/assets/products/classic-pack-optimized.jpg",
    image720: "/assets/products/classic-pack-720.webp",
    image1440: "/assets/products/classic-pack-1440.webp",
    name: "Classic",
  },
  {
    href: "/products/petal-pack",
    image: "/assets/products/petal-pack-optimized.jpg",
    image720: "/assets/products/petal-pack-720.webp",
    image1440: "/assets/products/petal-pack-1440.webp",
    name: "Petal Pack",
  },
  {
    href: "/products/gift-set",
    image: "/assets/products/gift-set-optimized.jpg",
    image720: "/assets/products/gift-set-720.webp",
    image1440: "/assets/products/gift-set-1440.webp",
    name: "Gift Set",
  },
] as const;

export function LuxuryEditorialPage({
  blocks,
  description,
  eyebrow,
  primaryAction,
  secondaryAction,
  title,
  variant,
}: LuxuryEditorialPageProps) {
  const { language } = useLanguage();
  const copy = editorialCopy[language][variant];
  const isRitual = variant === "ritual";

  return (
    <article className={styles.page} data-variant={variant}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.heroDescription}>{description}</p>
        </div>
        <div className={styles.heroMedia} aria-hidden="true">
          <picture>
            {!isRitual ? (
              <source
                type="image/webp"
                srcSet="/assets/products/gift-set-720.webp 720w, /assets/products/gift-set-1440.webp 1440w"
              />
            ) : null}
            <img
              src={isRitual ? "/assets/UX/petal-pack/brew.png" : "/assets/products/gift-set-optimized.jpg"}
              alt=""
              fetchPriority="high"
            />
          </picture>
        </div>
        <span className={styles.heroIndex} aria-hidden="true">S / 01</span>
      </section>

      <section className={styles.sequence} aria-label={copy.sequenceTitle}>
        <header className={styles.sequenceHeader}>
          <p className={styles.eyebrow}>{copy.sequenceEyebrow}</p>
          <h2>{copy.sequenceTitle}</h2>
        </header>
        <div className={styles.sequenceList}>
          {blocks.map((block, index) => (
            <article className={styles.sequenceItem} key={`${block.label ?? ""}-${block.title}`}>
              <span className={styles.sequenceNumber}>{String(index + 1).padStart(2, "0")}</span>
              <div>
                {block.label ? <p>{block.label.replace(/^\d+\s*\/\s*/, "")}</p> : null}
                <h3>{block.title}</h3>
              </div>
              <p className={styles.sequenceText}>{block.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.statement}>
        <div className={styles.statementImage} aria-hidden="true">
          <img
            src={isRitual ? "/assets/UX/petal-pack/sense.png" : "/assets/products/gift-set-optimized.jpg"}
            alt=""
            loading="lazy"
          />
        </div>
        <blockquote>{copy.statement}</blockquote>
      </section>

      {isRitual ? (
        <section className={styles.productEdit}>
          <header>
            <p className={styles.eyebrow}>{copy.editEyebrow}</p>
            <h2>{copy.editTitle}</h2>
          </header>
          <div className={styles.productRail}>
            {productEdit.map((product) => (
              <Link className={styles.productMoment} href={product.href} key={product.href}>
                <picture>
                  <source type="image/webp" srcSet={`${product.image720} 720w, ${product.image1440} 1440w`} />
                  <img src={product.image} alt="" loading="lazy" />
                </picture>
                <span>{product.name}<ArrowRight aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className={styles.giftingInterlude}>
          <p className={styles.eyebrow}>{copy.editEyebrow}</p>
          <h2>{copy.editTitle}</h2>
        </section>
      )}

      <section className={styles.closing}>
        <p>{copy.closing}</p>
        <div className={styles.actions}>
          <Link href={primaryAction.href} className={styles.primaryAction}>
            {primaryAction.label}<ArrowRight aria-hidden="true" />
          </Link>
          {secondaryAction ? (
            <Link href={secondaryAction.href} className={styles.secondaryAction}>
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      </section>
    </article>
  );
}
