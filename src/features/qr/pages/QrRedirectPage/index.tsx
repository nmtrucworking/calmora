import { useEffect } from "react";
import { QrCode } from "lucide-react";
import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { getQrRecord } from "@features/content/sitePages";
import { trackEvent } from "@shared/analytics/analytics";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";

type QrRedirectPageProps = {
  code: string;
};

export default function QrRedirectPage({ code }: QrRedirectPageProps) {
  const { navigate } = useRouter();
  const normalizedCode = code.trim().toUpperCase();
  const record = getQrRecord(normalizedCode);

  useEffect(() => {
    if (!record?.active) return;

    const batch = record.batchCode ?? normalizedCode;
    const contentViewed = `${record.productSlug}-scan`;
    const searchParams = new URLSearchParams({
      batch,
      source: "qr",
      content: contentViewed,
    });

    trackEvent({
      eventName: "qr_scan",
      productSlug: record.productSlug,
      batchCode: batch,
      source: "qr",
      contentViewed,
    });

    const timer = window.setTimeout(() => {
      navigate(`${record.destination}?${searchParams.toString()}`);
    }, 520);

    return () => window.clearTimeout(timer);
  }, [navigate, normalizedCode, record]);

  if (!record) {
    return (
      <section className={styles.qrPanel}>
        <QrCode className={styles.qrIcon} aria-hidden="true" />
        <p className={styles.eyebrow}>QR Senova</p>
        <h1>Mã QR chưa được nhận diện.</h1>
        <p className={styles.bodyText}>
          Mã {normalizedCode || "không xác định"} không có trong danh sách trải nghiệm đang mở.
        </p>
        <div className={styles.actions}>
          <Link href="/products" className={styles.primaryButton}>
            Xem bộ sản phẩm
          </Link>
          <Link href="/contact" className={styles.secondaryButton}>
            Liên hệ hỗ trợ
          </Link>
        </div>
      </section>
    );
  }

  if (!record.active) {
    return (
      <section className={styles.qrPanel}>
        <QrCode className={styles.qrIcon} aria-hidden="true" />
        <p className={styles.eyebrow}>QR Senova</p>
        <h1>Mã QR đã tạm ngừng hoạt động.</h1>
        <p className={styles.bodyText}>
          Mã {record.code} không còn chuyển hướng tự động. Bạn vẫn có thể xem bộ sản phẩm hoặc liên
          hệ Senova để được hỗ trợ.
        </p>
        <div className={styles.actions}>
          <Link href="/products" className={styles.primaryButton}>
            Xem bộ sản phẩm
          </Link>
          <Link href="/contact" className={styles.secondaryButton}>
            Liên hệ hỗ trợ
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.qrPanel}>
      <QrCode className={styles.qrIcon} aria-hidden="true" />
      <p className={styles.eyebrow}>QR Senova</p>
      <h1>Đang mở trải nghiệm {record.productSlug}.</h1>
      <p className={styles.bodyText}>Mã lô {record.batchCode ?? record.code} đang được ghi nhận.</p>
    </section>
  );
}
