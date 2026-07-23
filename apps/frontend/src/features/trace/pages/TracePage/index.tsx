import { useEffect, useMemo, useState } from "react";
import { Link } from "@app/router/RouterContext";
import { activateUnit, getUnitTrace, recordUnitScan, TraceApiError } from "@shared/api/trace";
import type { UnitTrace, VerificationStatus } from "@features/trace/types";
import styles from "./TracePage.module.css";
import { useLanguage, type Language } from "@app/providers/LanguageContext";

const STATUS_COPY: Record<Language, Record<VerificationStatus, { label: string; body: string; tone?: string }>> = {
  vi: {
    "not-distributed": { label: "Chưa phát hành", body: "Mã này chưa được phát hành để bán.", tone: styles.warning },
    "valid-unactivated": { label: "Hợp lệ · chưa kích hoạt", body: "Mã thuộc lô Senova đã được ghi nhận và có thể kích hoạt." },
    activated: { label: "Đã kích hoạt", body: "Mã bí mật đã được xác minh và kích hoạt trước đó." },
    recheck: { label: "Cần kiểm tra thêm", body: "Senova đang kiểm tra thêm lịch sử sử dụng của mã này.", tone: styles.warning },
    suspicious: { label: "Có dấu hiệu bất thường", body: "Mã được sử dụng theo cách bất thường. Vui lòng liên hệ Senova.", tone: styles.warning },
    compromised: { label: "Mã đã bị lạm dụng", body: "Mã xác thực đã bị lạm dụng; trạng thái này không tự kết luận sản phẩm vật lý là giả.", tone: styles.danger },
    recalled: { label: "Sản phẩm thuộc diện thu hồi", body: "Không sử dụng sản phẩm và vui lòng liên hệ Senova.", tone: styles.danger },
    invalid: { label: "Mã đã hủy", body: "Mã này không còn hiệu lực.", tone: styles.danger },
  },
  en: {
    "not-distributed": { label: "Not distributed", body: "This code has not been released for sale.", tone: styles.warning },
    "valid-unactivated": { label: "Valid · not activated", body: "This code belongs to a recorded Senova batch and can be activated." },
    activated: { label: "Activated", body: "The secret code was previously verified and activated." },
    recheck: { label: "Further review needed", body: "Senova is reviewing this code's usage history.", tone: styles.warning },
    suspicious: { label: "Unusual activity", body: "This code has been used unusually. Please contact Senova.", tone: styles.warning },
    compromised: { label: "Code compromised", body: "The verification code has been misused; this status alone does not mean the physical product is counterfeit.", tone: styles.danger },
    recalled: { label: "Product recalled", body: "Do not use this product and please contact Senova.", tone: styles.danger },
    invalid: { label: "Code cancelled", body: "This code is no longer valid.", tone: styles.danger },
  },
};

export default function TracePage({ publicCode }: { publicCode: string }) {
  const { language } = useLanguage();
  const ui = language === "vi"
    ? { notFound: "Không tìm thấy mã truy xuất này.", invalidSecret: "Mã bí mật không hợp lệ. Hãy kiểm tra lại phần mã dưới tem niêm phong.", activateFailed: "Không thể kích hoạt mã.", loading: "Đang đối chiếu bằng chứng truy xuất…", contact: "Liên hệ Senova", eyebrow: "Senova · Truy xuất sản phẩm", lead: "Dữ liệu vận hành được lưu tại Senova; hash bất biến giúp phát hiện nếu hồ sơ đã bị thay đổi sau khi neo bằng chứng.", verification: "Trạng thái xác minh", publicCode: "Mã công khai", batch: "Lô sản xuất", packed: "Đóng gói", updating: "Đang cập nhật", bestBefore: "Hạn dùng", package: "Xem trên bao bì", journey: "Hành trình lô sản phẩm", activation: "Kích hoạt một lần", activationText: "Tách lớp tem niêm phong và nhập mã bí mật. Mã không được lưu trên thiết bị sau khi gửi.", secret: "Mã bí mật dưới tem", verifying: "Đang xác minh…", verify: "Xác minh và kích hoạt", proof: "Bằng chứng dữ liệu", proofMatch: "Hash hồ sơ hiện tại khớp bằng chứng đã neo.", proofSync: "Bằng chứng đang được đồng bộ; dữ liệu truy xuất vẫn khả dụng.", network: "Mạng", status: "Trạng thái", experience: "Mở trải nghiệm sản phẩm" }
    : { notFound: "This traceability code was not found.", invalidSecret: "The secret code is invalid. Check the code beneath the security seal.", activateFailed: "The code could not be activated.", loading: "Checking traceability evidence…", contact: "Contact Senova", eyebrow: "Senova · Product traceability", lead: "Operational data is held by Senova; an immutable hash helps reveal whether a record changed after its proof was anchored.", verification: "Verification status", publicCode: "Public code", batch: "Production batch", packed: "Packed", updating: "Updating", bestBefore: "Best before", package: "See packaging", journey: "Product batch journey", activation: "One-time activation", activationText: "Peel back the security seal and enter the secret code. The code is not stored on this device after submission.", secret: "Secret code beneath seal", verifying: "Verifying…", verify: "Verify and activate", proof: "Data proof", proofMatch: "The current record hash matches the anchored proof.", proofSync: "Proof is being synchronized; traceability data remains available.", network: "Network", status: "Status", experience: "Open product experience" };
  const [trace, setTrace] = useState<UnitTrace | null>(null);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const normalizedCode = useMemo(() => publicCode.trim().toUpperCase(), [publicCode]);

  useEffect(() => {
    let current = true;
    void getUnitTrace(normalizedCode)
      .then((value) => {
        if (!current) return;
        setTrace(value);
        void recordUnitScan(normalizedCode).catch(() => undefined);
      })
      .catch((reason: unknown) => {
        if (!current) return;
        setError(reason instanceof TraceApiError && reason.code === "NETWORK_ERROR"
          ? reason.message
          : ui.notFound);
      })
      .finally(() => current && setLoading(false));
    return () => {
      current = false;
      setSecret("");
    };
  }, [normalizedCode, ui.notFound]);

  async function activate(event: React.FormEvent) {
    event.preventDefault();
    const submittedSecret = secret;
    setSecret("");
    setError("");
    setActivating(true);
    try {
      await activateUnit(normalizedCode, submittedSecret);
      setTrace(await getUnitTrace(normalizedCode));
    } catch (reason) {
      setError(reason instanceof TraceApiError && reason.code === "SECRET_CODE_INVALID"
        ? ui.invalidSecret
        : reason instanceof Error ? reason.message : ui.activateFailed);
    } finally {
      setActivating(false);
    }
  }

  if (loading) return <main className={styles.page}><div className={styles.loading}>{ui.loading}</div></main>;
  if (!trace) return <main className={styles.page}><div className={styles.shell}><p className={styles.error}>{error}</p><Link className={styles.link} href="/contact">{ui.contact}</Link></div></main>;

  const copy = STATUS_COPY[language][trace.verification.status];
  const canActivate = trace.verification.status === "valid-unactivated";

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <p className={styles.eyebrow}>{ui.eyebrow}</p>
        <h1 className={styles.title}>{trace.product.name}</h1>
        <p className={styles.lead}>{ui.lead}</p>
        <div className={styles.grid}>
          <section className={styles.card} aria-labelledby="verification-title">
            <span className={`${styles.status} ${copy.tone ?? ""}`}>{copy.label}</span>
            <h2 id="verification-title">{ui.verification}</h2>
            <p>{language === "vi" ? trace.verification.publicMessage || copy.body : copy.body}</p>
            <dl className={styles.facts}>
              <div className={styles.fact}><dt>{ui.publicCode}</dt><dd>{trace.publicCode}</dd></div>
              <div className={styles.fact}><dt>{ui.batch}</dt><dd>{trace.batch.batchCode}</dd></div>
              <div className={styles.fact}><dt>{ui.packed}</dt><dd>{trace.batch.packagedAt ? new Date(trace.batch.packagedAt).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US") : ui.updating}</dd></div>
              <div className={styles.fact}><dt>{ui.bestBefore}</dt><dd>{trace.batch.bestBefore ? new Date(trace.batch.bestBefore).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US") : ui.package}</dd></div>
            </dl>
            <h2>{ui.journey}</h2>
            <ol className={styles.timeline}>
              {trace.trace.timeline.map((item) => <li key={`${item.type}-${item.occurredAt}`}><time>{new Date(item.occurredAt).toLocaleString(language === "vi" ? "vi-VN" : "en-US")}</time><h3>{item.title}</h3>{item.locationLabel ? <span>{item.locationLabel}</span> : null}</li>)}
            </ol>
          </section>

          <aside>
            {canActivate ? <section className={styles.card}>
              <h2>{ui.activation}</h2>
              <p>{ui.activationText}</p>
              <form className={styles.form} onSubmit={activate}>
                <label htmlFor="secret-code">{ui.secret}</label>
                <input id="secret-code" className={styles.input} value={secret} onChange={(event) => setSecret(event.target.value)} minLength={8} autoComplete="off" required />
                <button className={styles.button} disabled={activating} type="submit">{activating ? ui.verifying : ui.verify}</button>
                {error ? <p className={styles.error} role="alert">{error}</p> : null}
              </form>
            </section> : null}
            <section className={`${styles.card} ${styles.proof}`}>
              <details>
                <summary>{ui.proof}</summary>
                <p>{trace.proof.status === "confirmed" && trace.proof.match ? ui.proofMatch : ui.proofSync}</p>
                <dl><dt>{ui.network}</dt><dd>{trace.proof.network}</dd><dt>{ui.status}</dt><dd>{trace.proof.status}</dd></dl>
                {trace.proof.rootHash ? <p className={styles.hash}>{trace.proof.rootHash}</p> : null}
              </details>
              <p><Link className={styles.link} href={trace.content.experiencePath}>{ui.experience}</Link></p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
