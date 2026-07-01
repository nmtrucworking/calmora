import { Link } from "../../contexts/RouterContext";
import { systemStyles as styles } from "../../styles/systemPageClasses";

export default function NotFoundPage() {
  return (
    <section className={styles.thankYouPanel}>
      <p className={styles.eyebrow}>404</p>
      <h1>Không tìm thấy trang.</h1>
      <p className={styles.bodyText}>Đường dẫn có thể đã thay đổi hoặc không tồn tại.</p>
      <div className={styles.actions}>
        <Link href="/" className={styles.primaryButton}>
          Về trang chủ
        </Link>
        <Link href="/products" className={styles.secondaryButton}>
          Xem bộ sản phẩm
        </Link>
        <Link href="/contact" className={styles.secondaryButton}>
          Liên hệ hỗ trợ
        </Link>
      </div>
    </section>
  );
}
