import { ArrowLeft, ArrowRight, Check, Gift, QrCode, Ruler, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { useState } from "react";
import { Link } from "../../contexts/RouterContext";
import { useInquiryBag } from "../../contexts/InquiryBagContext";
import { products, type SenovaProduct } from "../../features/products/data/products";
import { productDetailStyles as styles } from "../../styles/productDetailClasses";

type ProductDetailPageProps = {
  product?: SenovaProduct;
};

function ProductStatusBadge({ status }: { status: SenovaProduct["status"] }) {
  const label = status === "active" ? "Đang mở trải nghiệm" : "Đang chuẩn bị";

  return <span className={styles.statusBadge}>{label}</span>;
}

function ProductNotFound() {
  return (
    <section className={styles.emptyState}>
      <p className={styles.eyebrow}>Sản phẩm</p>
      <h1>Trang sản phẩm đang được chuẩn bị.</h1>
      <p>
        Mã đường dẫn này chưa có nội dung công khai. Bạn có thể quay về bộ sản phẩm Senova để
        tiếp tục khám phá.
      </p>
      <Link href="/products" className={styles.primaryButton}>
        Về trang sản phẩm
      </Link>
    </section>
  );
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  const { addItem } = useInquiryBag();
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
          Sản phẩm
        </Link>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.metaRow}>
            <span className={styles.eyebrow}>{product.eyebrow}</span>
            <ProductStatusBadge status={product.status} />
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
              <span className={styles.eyebrow}>Cau hinh</span>
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
              Them vao inquiry bag
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

      <section className={styles.contentGrid} aria-label="Thông tin sản phẩm">
        <div className={styles.infoPanel}>
          <div className={styles.sectionHeading}>
            <Sparkles aria-hidden="true" />
            <h2>Điểm nổi bật</h2>
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
          <h2>Phù hợp cho</h2>
          <div className={styles.pillList}>
            {product.suitableFor.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.contentGrid} aria-label="Thong tin commerce">
        <div className={styles.infoPanel}>
          <div className={styles.sectionHeading}>
            <Gift aria-hidden="true" />
            <h2>Trong cau hinh nay</h2>
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
            <h2>Kich thuoc va pha tra</h2>
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
          <p className={styles.eyebrow}>Delivery / gifting</p>
          <h2>Concierge xac nhan truoc khi chot don.</h2>
          <p>{product.shippingNote}</p>
          <div className={styles.pillList}>
            {product.giftOptions.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        </div>
        <Link href="/checkout" className={styles.primaryButton}>
          Gui inquiry
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <section className={styles.gallerySection} aria-labelledby="product-gallery-title">
        <div className={styles.galleryHeader}>
          <p className={styles.eyebrow}>Bộ sản phẩm</p>
          <h2 id="product-gallery-title">Ba hình thái trong cùng một câu chuyện trà sen.</h2>
          <p>
            Nhìn tổng thể Classic, Petal Pack và Gift Set để thấy vai trò Giữ - Mở - Trao
            được triển khai qua từng hình thức sản phẩm.
          </p>
        </div>

        <div className={styles.galleryGrid}>
          {products.map((item) => {
            const isCurrentProduct = item.id === product.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`${styles.galleryCard} ${isCurrentProduct ? styles.galleryCardActive : ""}`}
                aria-current={isCurrentProduct ? "page" : undefined}
              >
                <span className={styles.galleryRole}>{item.role}</span>
                <div className={styles.galleryImageFrame}>
                  <img src={item.image} alt={item.heroAlt} loading="lazy" decoding="async" />
                </div>
                <div className={styles.galleryCardCopy}>
                  <h3>{item.name}</h3>
                  <p>{item.shortDescription}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.experienceSection}>
        <div className={styles.experienceHeader}>
          <p className={styles.eyebrow}>Hành trình sử dụng</p>
          <h2>{isPetalPack ? "Mở - pha - thưởng thức" : "Một nhịp trải nghiệm gọn"}</h2>
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
            <p className={styles.eyebrow}>QR động</p>
            <h2>Nối sản phẩm vật lý với câu chuyện số.</h2>
            <p>
              Sau khi mở Petal Pack, người dùng có thể quét QR để đọc câu chuyện ngắn, xem lại
              hướng dẫn trải nghiệm và gửi phản hồi.
            </p>
          </div>
          <Link href="/experience/petal-pack" className={styles.primaryButton}>
            Mở trải nghiệm QR
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      ) : null}
    </article>
  );
}
