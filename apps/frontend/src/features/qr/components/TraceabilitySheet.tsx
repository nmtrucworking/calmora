import { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import { Link } from "@app/router/RouterContext";
import styles from "./PetalPackExperience.module.css";
import { useLanguage } from "@app/providers/LanguageContext";

type TraceabilitySheetProps = {
  batchCode: string;
  isOpen: boolean;
  onClose: () => void;
};

export function TraceabilitySheet({ batchCode, isOpen, onClose }: TraceabilitySheetProps) {
  const { language } = useLanguage();
  const copy = language === "vi"
    ? { info: "Thông tin sản phẩm", title: "Nguồn gốc & lô Petal Pack", close: "Đóng thông tin sản phẩm", line: "Dòng sản phẩm", pack: "Mã pack", packValue: "QR theo lô · chưa định danh đơn vị", batch: "Mã lô", packed: "Ngày đóng gói", updating: "Đang cập nhật", status: "Trạng thái nội dung", experimental: "Hướng dẫn thử nghiệm", scans: "Lịch sử quét", scansValue: "Không công bố trên màn hình này", region: "Vùng nguyên liệu công bố", regionValue: "Thái Nguyên · nguồn sen đang cập nhật", notice: "Mã QR này mở nội dung theo lô; không tự thân chứng minh tính xác thực vật lý của sản phẩm.", details: "Xem chi tiết kỹ thuật" }
    : { info: "Product information", title: "Petal Pack origin & batch", close: "Close product information", line: "Product line", pack: "Pack code", packValue: "Batch-level QR · no unit identifier", batch: "Batch code", packed: "Packed on", updating: "Updating", status: "Content status", experimental: "Experimental guidance", scans: "Scan history", scansValue: "Not displayed on this screen", region: "Declared ingredient region", regionValue: "Thái Nguyên · lotus source being updated", notice: "This QR code opens batch-specific content; it does not by itself prove the physical authenticity of the product.", details: "View technical details" };
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.sheetBackdrop} role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="traceability-title"
        aria-modal="true"
        className={styles.sheet}
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.sheetHandle} aria-hidden="true" />
        <header className={styles.sheetHeader}>
          <div>
            <p>{copy.info}</p>
            <h2 id="traceability-title">{copy.title}</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label={copy.close}>
            <X aria-hidden="true" />
          </button>
        </header>

        <dl className={styles.traceList}>
          <div><dt>{copy.line}</dt><dd>Senova Petal Pack</dd></div>
          <div><dt>{copy.pack}</dt><dd>{copy.packValue}</dd></div>
          <div><dt>{copy.batch}</dt><dd>{batchCode}</dd></div>
          <div><dt>{copy.packed}</dt><dd>{copy.updating}</dd></div>
          <div><dt>{copy.status}</dt><dd>{copy.experimental}</dd></div>
          <div><dt>{copy.scans}</dt><dd>{copy.scansValue}</dd></div>
          <div><dt>{copy.region}</dt><dd>{copy.regionValue}</dd></div>
        </dl>

        <p className={styles.sheetNotice}>
          {copy.notice}
        </p>
        <Link className={styles.sheetLink} href={`/trace/${encodeURIComponent(batchCode)}`}>
          {copy.details} <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
