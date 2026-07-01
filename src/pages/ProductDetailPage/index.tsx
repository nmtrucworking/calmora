import { ArrowLeft, ArrowRight, Check, Gift, QrCode, Ruler, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { useState } from "react";
import { getLocalizedProduct } from "../../content/i18n";
import { useInquiryBag } from "../../contexts/InquiryBagContext";
import { useLanguage, type Language } from "../../contexts/LanguageContext";
import { Link } from "../../contexts/RouterContext";
import { products, type SenovaProduct } from "../../features/products/data/products";
import { productDetailStyles as styles } from "../../styles/productDetailClasses";

type ProductDetailPageProps = {
  product?: SenovaProduct;
};

const detailText: Record<
  Language,
  {
    products: string;
    notFoundEyebrow: string;
    notFoundTitle: string;
    notFoundText: string;
    notFoundCta: string;
    active: string;
    draft: string;
    configuration: string;
    addToBag: string;
    productInfo: string;
    highlights: string;
    suitableFor: string;
    commerceInfo: string;
    included: string;
    dimensionsAndBrewing: string;
    deliveryEyebrow: string;
    deliveryTitle: string;
    sendInquiry: string;
    galleryEyebrow: string;
    galleryTitle: string;
    galleryText: string;
    journeyEyebrow: string;
    petalJourney: string;
    defaultJourney: string;
    qrEyebrow: string;
    qrTitle: string;
    qrText: string;
    qrCta: string;
  }
> = {
  vi: {
    products: "Sản phẩm",
    notFoundEyebrow: "Sản phẩm",
    notFoundTitle: "Trang sản phẩm đang được chuẩn bị.",
    notFoundText:
      "Mã đường dẫn này chưa có nội dung công khai. Bạn có thể quay về bộ sản phẩm Senova để tiếp tục khám phá.",
    notFoundCta: "Về trang sản phẩm",
    active: "Đang mở trải nghiệm",
    draft: "Đang chuẩn bị",
    configuration: "Cấu hình",
    addToBag: "Thêm vào inquiry bag",
    productInfo: "Thông tin sản phẩm",
    highlights: "Điểm nổi bật",
    suitableFor: "Phù hợp cho",
    commerceInfo: "Thông tin commerce",
    included: "Trong cấu hình này",
    dimensionsAndBrewing: "Kích thước và pha trà",
    deliveryEyebrow: "Delivery / gifting",
    deliveryTitle: "Concierge xác nhận trước khi chốt đơn.",
    sendInquiry: "Gửi inquiry",
    galleryEyebrow: "Bộ sản phẩm",
    galleryTitle: "Ba hình thái trong cùng một câu chuyện trà sen.",
    galleryText:
      "Nhìn tổng thể Classic, Petal Pack và Gift Set để thấy vai trò Giữ - Mở - Trao được triển khai qua từng hình thức sản phẩm.",
    journeyEyebrow: "Hành trình sử dụng",
    petalJourney: "Mở - pha - thưởng thức",
    defaultJourney: "Một nhịp trải nghiệm gọn",
    qrEyebrow: "QR động",
    qrTitle: "Nối sản phẩm vật lý với câu chuyện số.",
    qrText:
      "Sau khi mở Petal Pack, người dùng có thể quét QR để đọc câu chuyện ngắn, xem lại hướng dẫn trải nghiệm và gửi phản hồi.",
    qrCta: "Mở trải nghiệm QR",
  },
  en: {
    products: "Products",
    notFoundEyebrow: "Product",
    notFoundTitle: "This product page is being prepared.",
    notFoundText:
      "This route does not have public content yet. You can return to the Senova product edit and keep exploring.",
    notFoundCta: "Back to products",
    active: "Experience open",
    draft: "In preparation",
    configuration: "Configuration",
    addToBag: "Add to inquiry bag",
    productInfo: "Product information",
    highlights: "Highlights",
    suitableFor: "Suitable for",
    commerceInfo: "Commerce information",
    included: "Included in this configuration",
    dimensionsAndBrewing: "Dimensions and brewing",
    deliveryEyebrow: "Delivery / gifting",
    deliveryTitle: "Concierge confirms before finalizing.",
    sendInquiry: "Send inquiry",
    galleryEyebrow: "Product edit",
    galleryTitle: "Three forms within one lotus tea story.",
    galleryText:
      "View Classic, Petal Pack and Gift Set together to see Keep - Open - Give expressed through each product form.",
    journeyEyebrow: "Usage journey",
    petalJourney: "Open - brew - taste",
    defaultJourney: "A compact experience rhythm",
    qrEyebrow: "Dynamic QR",
    qrTitle: "Connect the physical product with a digital story.",
    qrText:
      "After opening Petal Pack, clients can scan the QR to read a short story, revisit the experience guide and send feedback.",
    qrCta: "Open QR experience",
  },
};

function ProductStatusBadge({ status, language }: { status: SenovaProduct["status"]; language: Language }) {
  const label = status === "active" ? detailText[language].active : detailText[language].draft;

  return <span className={styles.statusBadge}>{label}</span>;
}

function ProductNotFound() {
  const { language } = useLanguage();
  const copy = detailText[language];

  return (
    <section className={styles.emptyState}>
      <p className={styles.eyebrow}>{copy.notFoundEyebrow}</p>
      <h1>{copy.notFoundTitle}</h1>
      <p>{copy.notFoundText}</p>
      <Link href="/products" className={styles.primaryButton}>
        {copy.notFoundCta}
      </Link>
    </section>
  );
}

export default function ProductDetailPage({ product: baseProduct }: ProductDetailPageProps) {
  const { addItem } = useInquiryBag();
  const { language } = useLanguage();
  const copy = detailText[language];
  const product = baseProduct ? getLocalizedProduct(baseProduct, language) : undefined;
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]?.id);

  if (!product) {
    return <ProductNotFound />;
  }

  const isPetalPack = product.slug === "petal-pack";

  return (
    <article className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link href="/products">
          <ArrowLeft aria-hidden="true" />
          {copy.products}
        </Link>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.metaRow}>
            <span className={styles.eyebrow}>{product.eyebrow}</span>
            <ProductStatusBadge status={product.status} language={language} />
          </div>
          <h1>{product.name}</h1>
          <p className={styles.tagline}>{product.tagline}</p>
          <p className={styles.description}>{product.description}</p>

          <div className="mt-6 grid gap-3 rounded-lg border border-border bg-surface-strong p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-display text-[1.55rem] font-[760] text-primary-strong">
                {product.priceLabel}
              </span>
              <span className={styles.statusBadge}>{product.availability}</span>
            </div>
            <div className="grid gap-2">
              <span className={styles.eyebrow}>{copy.configuration}</span>
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  className={`rounded-lg border p-3 text-left transition ${
                    selectedVariant === variant.id
                      ? "border-primary bg-[rgba(31,114,74,0.1)]"
                      : "border-border bg-[#fffdf866]"
                  }`}
                  onClick={() => setSelectedVariant(variant.id)}
                >
                  <span className="block font-extrabold text-primary-strong">{variant.label}</span>
                  <span className="text-[0.84rem] text-text-muted">{variant.note}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => addItem({ productId: product.id, variantId: selectedVariant })}
            >
              {copy.addToBag}
              <ShoppingBag aria-hidden="true" />
            </button>
            <Link href={product.primaryAction.href} className={styles.primaryButton}>
              {product.primaryAction.label}
              <ArrowRight aria-hidden="true" />
            </Link>
            {product.secondaryAction ? (
              <Link href={product.secondaryAction.href} className={styles.secondaryButton}>
                {product.secondaryAction.label}
              </Link>
            ) : null}
          </div>

          {product.batchLabel ? <p className={styles.batchLabel}>{product.batchLabel}</p> : null}
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.imagePlate}>
            <img src={product.image} alt={product.heroAlt} decoding="async" />
          </div>
        </div>
      </section>

      <section className={styles.contentGrid} aria-label={copy.productInfo}>
        <div className={styles.infoPanel}>
          <div className={styles.sectionHeading}>
            <Sparkles aria-hidden="true" />
            <h2>{copy.highlights}</h2>
          </div>
          <ul className={styles.checkList}>
            {product.highlights.map((highlight) => (
              <li key={highlight}>
                <Check aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.infoPanel}>
          <h2>{copy.suitableFor}</h2>
          <div className={styles.pillList}>
            {product.suitableFor.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.contentGrid} aria-label={copy.commerceInfo}>
        <div className={styles.infoPanel}>
          <div className={styles.sectionHeading}>
            <Gift aria-hidden="true" />
            <h2>{copy.included}</h2>
          </div>
          <ul className={styles.checkList}>
            {product.includedItems.map((item) => (
              <li key={item}>
                <Check aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.infoPanel}>
          <div className={styles.sectionHeading}>
            <Ruler aria-hidden="true" />
            <h2>{copy.dimensionsAndBrewing}</h2>
          </div>
          <p className={styles.description}>{product.dimensions}</p>
          <div className={styles.pillList}>
            {product.brewingNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.qrPanel}>
        <Truck aria-hidden="true" />
        <div>
          <p className={styles.eyebrow}>{copy.deliveryEyebrow}</p>
          <h2>{copy.deliveryTitle}</h2>
          <p>{product.shippingNote}</p>
          <div className={styles.pillList}>
            {product.giftOptions.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        </div>
        <Link href="/checkout" className={styles.primaryButton}>
          {copy.sendInquiry}
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <section className={styles.gallerySection} aria-labelledby="product-gallery-title">
        <div className={styles.galleryHeader}>
          <p className={styles.eyebrow}>{copy.galleryEyebrow}</p>
          <h2 id="product-gallery-title">{copy.galleryTitle}</h2>
          <p>{copy.galleryText}</p>
        </div>

        <div className={styles.galleryGrid}>
          {products.map((item) => {
            const localizedItem = getLocalizedProduct(item, language);
            const isCurrentProduct = localizedItem.id === product.id;

            return (
              <Link
                key={localizedItem.id}
                href={localizedItem.href}
                className={`${styles.galleryCard} ${isCurrentProduct ? styles.galleryCardActive : ""}`}
                aria-current={isCurrentProduct ? "page" : undefined}
              >
                <span className={styles.galleryRole}>{localizedItem.role}</span>
                <div className={styles.galleryImageFrame}>
                  <img src={localizedItem.image} alt={localizedItem.heroAlt} loading="lazy" decoding="async" />
                </div>
                <div className={styles.galleryCardCopy}>
                  <h3>{localizedItem.name}</h3>
                  <p>{localizedItem.shortDescription}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.experienceSection}>
        <div className={styles.experienceHeader}>
          <p className={styles.eyebrow}>{copy.journeyEyebrow}</p>
          <h2>{isPetalPack ? copy.petalJourney : copy.defaultJourney}</h2>
          <p>{product.shortDescription}</p>
        </div>

        <div className={styles.stepGrid}>
          {product.experienceSteps.map((step, index) => (
            <div key={step.title} className={styles.stepItem}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {isPetalPack ? (
        <section className={styles.qrPanel}>
          <QrCode aria-hidden="true" />
          <div>
            <p className={styles.eyebrow}>{copy.qrEyebrow}</p>
            <h2>{copy.qrTitle}</h2>
            <p>{copy.qrText}</p>
          </div>
          <Link href="/experience/petal-pack" className={styles.primaryButton}>
            {copy.qrCta}
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      ) : null}
    </article>
  );
}
