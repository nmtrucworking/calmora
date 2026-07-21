import { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import { Link } from "@app/router/RouterContext";
import styles from "./PetalPackExperience.module.css";

type TraceabilitySheetProps = {
  batchCode: string;
  isOpen: boolean;
  onClose: () => void;
};

export function TraceabilitySheet({ batchCode, isOpen, onClose }: TraceabilitySheetProps) {
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
            <p>Thông tin sản phẩm</p>
            <h2 id="traceability-title">Nguồn gốc &amp; lô Petal Pack</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Đóng thông tin sản phẩm">
            <X aria-hidden="true" />
          </button>
        </header>

        <dl className={styles.traceList}>
          <div><dt>Dòng sản phẩm</dt><dd>Senova Petal Pack</dd></div>
          <div><dt>Mã pack</dt><dd>QR theo lô · chưa định danh đơn vị</dd></div>
          <div><dt>Mã lô</dt><dd>{batchCode}</dd></div>
          <div><dt>Ngày đóng gói</dt><dd>Đang cập nhật</dd></div>
          <div><dt>Trạng thái nội dung</dt><dd>Hướng dẫn thử nghiệm</dd></div>
          <div><dt>Lịch sử quét</dt><dd>Không công bố trên màn hình này</dd></div>
          <div><dt>Vùng nguyên liệu công bố</dt><dd>Thái Nguyên · nguồn sen đang cập nhật</dd></div>
        </dl>

        <p className={styles.sheetNotice}>
          Mã QR này mở nội dung theo lô; không tự thân chứng minh tính xác thực vật lý của sản phẩm.
        </p>
        <Link className={styles.sheetLink} href={`/trace/${encodeURIComponent(batchCode)}`}>
          Xem chi tiết kỹ thuật <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
