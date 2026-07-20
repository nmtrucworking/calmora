import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { normalizeQrCode } from "@features/qr/services/qrRegistry";
import type { QrResolveResult } from "@features/qr/types/qr";
import { resolveQr, trackQrScan } from "@shared/api/qr";
import { trackEvent } from "@shared/analytics/analytics";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";

type QrRedirectPageProps = {
  code: string;
};

function getStatusCopy(result: QrResolveResult) {
  if (result.status === "expired") {
    return {
      title: "Ma QR da het han.",
      body: `Ma ${result.code} thuoc mot lo hoac chien dich khong con mo. Ban van co the xem bo san pham hoac lien he Senova de duoc ho tro.`,
    };
  }

  if (result.status === "revoked") {
    return {
      title: "Ma QR da duoc thu hoi.",
      body: `Ma ${result.code} khong con duoc dung cho trai nghiem cong khai. Vui long lien he Senova neu ban dang cam san pham co ma nay.`,
    };
  }

  if (result.status === "paused") {
    return {
      title: "Ma QR dang tam ngung hoat dong.",
      body: `Ma ${result.code} chua chuyen huong tu dong trong giai doan nay. Ban van co the xem bo san pham hoac lien he Senova de duoc ho tro.`,
    };
  }

  return {
    title: "Ma QR chua duoc nhan dien.",
    body: `Ma ${result.code || "khong xac dinh"} khong co trong danh sach trai nghiem dang mo.`,
  };
}

function QrStatusPanel({ result }: { result: QrResolveResult }) {
  const copy = getStatusCopy(result);

  return (
    <section className={styles.qrPanel}>
      <QrCode className={styles.qrIcon} aria-hidden="true" />
      <p className={styles.eyebrow}>QR Senova</p>
      <h1>{copy.title}</h1>
      <p className={styles.bodyText}>{copy.body}</p>
      <div className={styles.actions}>
        <Link href="/products" className={styles.primaryButton}>
          Xem bo san pham
        </Link>
        <Link href="/contact" className={styles.secondaryButton}>
          Lien he ho tro
        </Link>
      </div>
    </section>
  );
}

export default function QrRedirectPage({ code }: QrRedirectPageProps) {
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
        <h1>Dang kiem tra ma QR.</h1>
        <p className={styles.bodyText}>Ma {normalizedCode || "khong xac dinh"} dang duoc doi chieu voi registry Senova.</p>
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
      <h1>{result.flowType === "experience" || !result.flowType ? "Dang mo trai nghiem" : "Dang mo ho so truy xuat"} {result.productSlug}.</h1>
      <p className={styles.bodyText}>Ma lo {result.batchCode ?? result.code} dang duoc ghi nhan.</p>
      {result.contentVersion ? <span className={styles.statusBadge}>Noi dung {result.contentVersion}</span> : null}
    </section>
  );
}
