import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { localizedThankYouMessages } from "@features/content/publicI18n";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";
import { useLanguage } from "@app/providers/LanguageContext";

export default function ThankYouPage() {
  const { language } = useLanguage();
  const { search } = useRouter();
  const type = new URLSearchParams(search).get("type") ?? "contact";
  const messages = localizedThankYouMessages[language];
  const message = messages[type] ?? messages.contact;

  return (
    <section className={styles.thankYouPanel}>
      <p className={styles.eyebrow}>{language === "vi" ? "Senova đã ghi nhận" : "Received by Senova"}</p>
      <h1>{message.title}</h1>
      <p className={styles.bodyText}>{message.text}</p>
      <div className={styles.actions}>
        <Link href="/" className={styles.primaryButton}>
          {language === "vi" ? "Về trang chủ" : "Back to home"}
        </Link>
        <Link href="/products" className={styles.secondaryButton}>
          {language === "vi" ? "Xem bộ sản phẩm" : "View products"}
        </Link>
        <Link href="/story" className={styles.secondaryButton}>
          {language === "vi" ? "Đọc câu chuyện" : "Read our story"}
        </Link>
      </div>
    </section>
  );
}
