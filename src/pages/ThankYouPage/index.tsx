import { Link } from "../../contexts/RouterContext";
import { useRouter } from "../../contexts/RouterState";
import { thankYouMessages } from "../../content/sitePages";
import styles from "../SystemPages/SystemPages.module.css";

export default function ThankYouPage() {
  const { search } = useRouter();
  const type = new URLSearchParams(search).get("type") ?? "contact";
  const message = thankYouMessages[type] ?? thankYouMessages.contact;

  return (
    <section className={styles.thankYouPanel}>
      <p className={styles.eyebrow}>Senova đã ghi nhận</p>
      <h1>{message.title}</h1>
      <p className={styles.bodyText}>{message.text}</p>
      <div className={styles.actions}>
        <Link href="/" className={styles.primaryButton}>
          Về trang chủ
        </Link>
        <Link href="/products" className={styles.secondaryButton}>
          Xem bộ sản phẩm
        </Link>
        <Link href="/story" className={styles.secondaryButton}>
          Đọc câu chuyện
        </Link>
      </div>
    </section>
  );
}
