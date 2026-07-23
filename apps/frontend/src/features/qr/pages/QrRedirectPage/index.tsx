import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { normalizeQrCode } from "@features/qr/services/qrRegistry";
import type { QrResolveResult } from "@features/qr/types/qr";
import { resolveQr, trackQrScan } from "@shared/api/qr";
import { trackEvent } from "@shared/analytics/analytics";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";
import { useLanguage, type Language } from "@app/providers/LanguageContext";

type QrRedirectPageProps = {
  code: string;
};

function getStatusCopy(result: QrResolveResult, language: Language) {
  if (language === "en") {
    if (result.status === "expired") return { title: "This QR code has expired.", body: `Code ${result.code} belongs to a batch or campaign that is no longer active. You can still view the products or contact Senova for support.` };
    if (result.status === "revoked") return { title: "This QR code has been revoked.", body: `Code ${result.code} is no longer available for a public experience. Please contact Senova if this code appears on a product you hold.` };
    if (result.status === "paused") return { title: "This QR code is temporarily paused.", body: `Code ${result.code} is not redirecting automatically at this time. You can still view the products or contact Senova for support.` };
    return { title: "This QR code is not recognized.", body: `Code ${result.code || "unknown"} is not in the list of active experiences.` };
  }
  if (result.status === "expired") {
    return {
      title: "Mã QR đã hết hạn.",
      body: `Mã ${result.code} thuộc một lô hoặc chiến dịch không còn mở. Bạn vẫn có thể xem bộ sản phẩm hoặc liên hệ Senova để được hỗ trợ.`,
    };
  }

  if (result.status === "revoked") {
    return {
      title: "Mã QR đã được thu hồi.",
      body: `Mã ${result.code} không còn được dùng cho trải nghiệm công khai. Vui lòng liên hệ Senova nếu bạn đang cầm sản phẩm có mã này.`,
    };
  }

  if (result.status === "paused") {
    return {
      title: "Mã QR đang tạm ngưng hoạt động.",
      body: `Mã ${result.code} chưa chuyển hướng tự động trong giai đoạn này. Bạn vẫn có thể xem bộ sản phẩm hoặc liên hệ Senova để được hỗ trợ.`,
    };
  }

  return {
    title: "Mã QR chưa được nhận diện.",
    body: `Mã ${result.code || "không xác định"} không có trong danh sách trải nghiệm đang mở.`,
  };
}

function QrStatusPanel({ result }: { result: QrResolveResult }) {
  const { language } = useLanguage();
  const copy = getStatusCopy(result, language);

  return (
    <section className={styles.qrPanel}>
      <QrCode className={styles.qrIcon} aria-hidden="true" />
      <p className={styles.eyebrow}>QR Senova</p>
      <h1>{copy.title}</h1>
      <p className={styles.bodyText}>{copy.body}</p>
      <div className={styles.actions}>
        <Link href="/products" className={styles.primaryButton}>
          {language === "vi" ? "Xem bộ sản phẩm" : "View products"}
        </Link>
        <Link href="/contact" className={styles.secondaryButton}>
          {language === "vi" ? "Liên hệ hỗ trợ" : "Contact support"}
        </Link>
      </div>
    </section>
  );
}

export default function QrRedirectPage({ code }: QrRedirectPageProps) {
  const { language } = useLanguage();
  const { navigate } = useRouter();
  const normalizedCode = normalizeQrCode(code);
  const [result, setResult] = useState<QrResolveResult | null>(null);

  useEffect(() => {
    let isCurrent = true;
    let timer = 0;

    void resolveQr(normalizedCode).then((resolvedResult) => {
      if (!isCurrent) return;

      setResult(resolvedResult);

      if (resolvedResult.status === "unknown") {
        trackEvent({
          eventName: "qr_invalid",
          source: "qr",
          contentViewed: "unknown",
        });
        return;
      }

      if (resolvedResult.status !== "active") {
        trackEvent({
          eventName: "qr_inactive",
          productSlug: resolvedResult.productSlug,
          batchCode: resolvedResult.batchCode,
          source: "qr",
          contentViewed: resolvedResult.contentViewed,
          status: resolvedResult.status,
        });
        return;
      }

      trackEvent({
        eventName: "qr_scan",
        productSlug: resolvedResult.productSlug,
        batchCode: resolvedResult.batchCode,
        source: "qr",
        contentViewed: resolvedResult.contentViewed,
        contentVersion: resolvedResult.contentVersion,
      });
      trackQrScan(resolvedResult.code, {
        source: "qr",
        path: `/q/${resolvedResult.code}`,
        referrer: document.referrer || undefined,
      });

      timer = window.setTimeout(() => {
        const target = resolvedResult.traceUrl ?? resolvedResult.redirectUrl;
        if (!target) return;

        trackEvent({
          eventName: "qr_redirect_success",
          productSlug: resolvedResult.productSlug,
          batchCode: resolvedResult.batchCode,
          source: "qr",
          contentViewed: resolvedResult.contentViewed,
          contentVersion: resolvedResult.contentVersion,
          destination: resolvedResult.destination,
        });
        navigate(target);
      }, 320);
    });

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [navigate, normalizedCode]);

  if (!result) {
    return (
      <section className={styles.qrPanel}>
        <QrCode className={styles.qrIcon} aria-hidden="true" />
        <p className={styles.eyebrow}>QR Senova</p>
        <h1>{language === "vi" ? "Đang kiểm tra mã QR." : "Checking the QR code."}</h1>
        <p className={styles.bodyText}>{language === "vi" ? `Mã ${normalizedCode || "không xác định"} đang được đối chiếu với hệ thống Senova.` : `Code ${normalizedCode || "unknown"} is being checked against the Senova registry.`}</p>
      </section>
    );
  }

  if (result.status !== "active") {
    return <QrStatusPanel result={result} />;
  }

  return (
    <section className={styles.qrPanel}>
      <QrCode className={styles.qrIcon} aria-hidden="true" />
      <p className={styles.eyebrow}>QR Senova</p>
      <h1>{result.flowType === "experience" || !result.flowType ? (language === "vi" ? "Đang mở trải nghiệm" : "Opening experience") : (language === "vi" ? "Đang mở hồ sơ truy xuất" : "Opening traceability record")} {result.productSlug}.</h1>
      <p className={styles.bodyText}>{language === "vi" ? `Mã lô ${result.batchCode ?? result.code} đang được ghi nhận.` : `Batch ${result.batchCode ?? result.code} is being recorded.`}</p>
      {result.contentVersion ? <span className={styles.statusBadge}>{language === "vi" ? "Nội dung" : "Content"} {result.contentVersion}</span> : null}
    </section>
  );
}
