import { useEffect, useMemo, useState } from "react";
import { Link } from "@app/router/RouterContext";
import { activateUnit, getUnitTrace, recordUnitScan, TraceApiError } from "@shared/api/trace";
import type { UnitTrace, VerificationStatus } from "@features/trace/types";
import styles from "./TracePage.module.css";

const STATUS_COPY: Record<VerificationStatus, { label: string; body: string; tone?: string }> = {
  "not-distributed": { label: "Chưa phát hành", body: "Mã này chưa được phát hành để bán.", tone: styles.warning },
  "valid-unactivated": { label: "Hợp lệ · chưa kích hoạt", body: "Mã thuộc lô Senova đã được ghi nhận và có thể kích hoạt." },
  activated: { label: "Đã kích hoạt", body: "Mã bí mật đã được xác minh và kích hoạt trước đó." },
  recheck: { label: "Cần kiểm tra thêm", body: "Senova đang kiểm tra thêm lịch sử sử dụng của mã này.", tone: styles.warning },
  suspicious: { label: "Có dấu hiệu bất thường", body: "Mã được sử dụng theo cách bất thường. Vui lòng liên hệ Senova.", tone: styles.warning },
  compromised: { label: "Mã đã bị lạm dụng", body: "Mã xác thực đã bị lạm dụng; trạng thái này không tự kết luận sản phẩm vật lý là giả.", tone: styles.danger },
  recalled: { label: "Sản phẩm thuộc diện thu hồi", body: "Không sử dụng sản phẩm và vui lòng liên hệ Senova.", tone: styles.danger },
  invalid: { label: "Mã đã hủy", body: "Mã này không còn hiệu lực.", tone: styles.danger },
};

export default function TracePage({ publicCode }: { publicCode: string }) {
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
          : "Không tìm thấy mã truy xuất này.");
      })
      .finally(() => current && setLoading(false));
    return () => {
      current = false;
      setSecret("");
    };
  }, [normalizedCode]);

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
        ? "Mã bí mật không hợp lệ. Hãy kiểm tra lại phần mã dưới tem niêm phong."
        : reason instanceof Error ? reason.message : "Không thể kích hoạt mã.");
    } finally {
      setActivating(false);
    }
  }

  if (loading) return <main className={styles.page}><div className={styles.loading}>Đang đối chiếu bằng chứng truy xuất…</div></main>;
  if (!trace) return <main className={styles.page}><div className={styles.shell}><p className={styles.error}>{error}</p><Link className={styles.link} href="/contact">Liên hệ Senova</Link></div></main>;

  const copy = STATUS_COPY[trace.verification.status];
  const canActivate = trace.verification.status === "valid-unactivated";

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <p className={styles.eyebrow}>Senova · Truy xuất sản phẩm</p>
        <h1 className={styles.title}>{trace.product.name}</h1>
        <p className={styles.lead}>Dữ liệu vận hành được lưu tại Senova; hash bất biến giúp phát hiện nếu hồ sơ đã bị thay đổi sau khi neo bằng chứng.</p>
        <div className={styles.grid}>
          <section className={styles.card} aria-labelledby="verification-title">
            <span className={`${styles.status} ${copy.tone ?? ""}`}>{copy.label}</span>
            <h2 id="verification-title">Trạng thái xác minh</h2>
            <p>{trace.verification.publicMessage || copy.body}</p>
            <dl className={styles.facts}>
              <div className={styles.fact}><dt>Mã công khai</dt><dd>{trace.publicCode}</dd></div>
              <div className={styles.fact}><dt>Lô sản xuất</dt><dd>{trace.batch.batchCode}</dd></div>
              <div className={styles.fact}><dt>Đóng gói</dt><dd>{trace.batch.packagedAt ? new Date(trace.batch.packagedAt).toLocaleDateString("vi-VN") : "Đang cập nhật"}</dd></div>
              <div className={styles.fact}><dt>Hạn dùng</dt><dd>{trace.batch.bestBefore ? new Date(trace.batch.bestBefore).toLocaleDateString("vi-VN") : "Xem trên bao bì"}</dd></div>
            </dl>
            <h2>Hành trình lô sản phẩm</h2>
            <ol className={styles.timeline}>
              {trace.trace.timeline.map((item) => <li key={`${item.type}-${item.occurredAt}`}><time>{new Date(item.occurredAt).toLocaleString("vi-VN")}</time><h3>{item.title}</h3>{item.locationLabel ? <span>{item.locationLabel}</span> : null}</li>)}
            </ol>
          </section>

          <aside>
            {canActivate ? <section className={styles.card}>
              <h2>Kích hoạt một lần</h2>
              <p>Tách lớp tem niêm phong và nhập mã bí mật. Mã không được lưu trên thiết bị sau khi gửi.</p>
              <form className={styles.form} onSubmit={activate}>
                <label htmlFor="secret-code">Mã bí mật dưới tem</label>
                <input id="secret-code" className={styles.input} value={secret} onChange={(event) => setSecret(event.target.value)} minLength={8} autoComplete="off" required />
                <button className={styles.button} disabled={activating} type="submit">{activating ? "Đang xác minh…" : "Xác minh và kích hoạt"}</button>
                {error ? <p className={styles.error} role="alert">{error}</p> : null}
              </form>
            </section> : null}
            <section className={`${styles.card} ${styles.proof}`}>
              <details>
                <summary>Bằng chứng dữ liệu</summary>
                <p>{trace.proof.status === "confirmed" && trace.proof.match ? "Hash hồ sơ hiện tại khớp bằng chứng đã neo." : "Bằng chứng đang được đồng bộ; dữ liệu truy xuất vẫn khả dụng."}</p>
                <dl><dt>Mạng</dt><dd>{trace.proof.network}</dd><dt>Trạng thái</dt><dd>{trace.proof.status}</dd></dl>
                {trace.proof.rootHash ? <p className={styles.hash}>{trace.proof.rootHash}</p> : null}
              </details>
              <p><Link className={styles.link} href={trace.content.experiencePath}>Mở trải nghiệm sản phẩm</Link></p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
