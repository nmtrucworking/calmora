import { ArrowLeft, ArrowRight, Check, QrCode, Sparkles } from "lucide-react";
import { Link } from "../../contexts/RouterContext";
import type { SenovaProduct } from "../../features/products/data/products";
import styles from "./ProductDetailPage.module.css";

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

          <div className={styles.actions}>
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
            <h2>Sẵn sàng nối bao bì vật lý với câu chuyện số.</h2>
            <p>
              Route `/q/[code]` trong tài liệu sẽ ghi nhận lượt quét, xác định pack và chuyển đến
              trang trải nghiệm Petal Pack tương ứng.
            </p>
          </div>
          <Link href="/trai-nghiem/petal-pack/mo-canh-sen" className={styles.primaryButton}>
            Xem landing QR mẫu
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      ) : null}
    </article>
  );
}
