import { Link } from "@app/router/RouterContext";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";
import { useLanguage } from "@app/providers/LanguageContext";

export default function NotFoundPage() {
  const { language } = useLanguage();
  const copy = language === "vi"
    ? { title: "Không tìm thấy trang.", text: "Đường dẫn có thể đã thay đổi hoặc không tồn tại.", home: "Về trang chủ", products: "Xem bộ sản phẩm", contact: "Liên hệ hỗ trợ" }
    : { title: "Page not found.", text: "The address may have changed or may not exist.", home: "Back to home", products: "View products", contact: "Contact support" };
  return (
    <section className={styles.thankYouPanel}>
      <p className={styles.eyebrow}>404</p>
      <h1>{copy.title}</h1>
      <p className={styles.bodyText}>{copy.text}</p>
      <div className={styles.actions}>
        <Link href="/" className={styles.primaryButton}>
          {copy.home}
        </Link>
        <Link href="/products" className={styles.secondaryButton}>
          {copy.products}
        </Link>
        <Link href="/contact" className={styles.secondaryButton}>
          {copy.contact}
        </Link>
      </div>
    </section>
  );
}
