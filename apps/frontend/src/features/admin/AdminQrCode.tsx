import { Download } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { getPublicQrUrl, getPublicRouteUrl } from "./adminQrUrl";

type QrDownloadExtension = "png" | "svg";

type AdminQrCodeProps = {
  code?: string;
  compact?: boolean;
  destination?: string;
  downloadName?: string;
  downloadable?: boolean;
  size?: number;
};

export function AdminQrCode({
  code = "",
  compact = false,
  destination,
  downloadName,
  downloadable = false,
  size = 280,
}: AdminQrCodeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const qrUrl = useMemo(
    () => destination ? getPublicRouteUrl(destination) : getPublicQrUrl(code),
    [code, destination],
  );

  useEffect(() => {
    const gradient = {
      type: "linear" as const,
      rotation: Math.PI / 2,
      colorStops: [
        { offset: 0, color: "#07551b" },
        { offset: 1, color: "#8a7000" },
      ],
    };
    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: qrUrl,
      image: `${window.location.origin}/assets/brand/calmora-mark.png`,
      margin: compact ? 4 : 12,
      qrOptions: { errorCorrectionLevel: "H" },
      dotsOptions: { type: "rounded", gradient },
      cornersSquareOptions: { type: "extra-rounded", gradient },
      cornersDotOptions: { type: "classy-rounded", gradient },
      backgroundOptions: { color: "#ffffff" },
      imageOptions: {
        crossOrigin: "anonymous",
        hideBackgroundDots: true,
        imageSize: compact ? 0.16 : 0.2,
        margin: compact ? 1 : 4,
        saveAsBlob: true,
      },
    });

    qrRef.current = qrCode;
    const container = containerRef.current;
    if (container) {
      container.replaceChildren();
      qrCode.append(container);
    }

    return () => {
      if (qrRef.current === qrCode) qrRef.current = null;
      container?.replaceChildren();
    };
  }, [compact, qrUrl, size]);

  const download = async (extension: QrDownloadExtension) => {
    const fileLabel = downloadName || code || destination || "preview";
    const normalizedName = fileLabel.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || "preview";
    await qrRef.current?.download({ name: `senova-${normalizedName}`, extension });
  };

  return (
    <div className={`adminQrPreview ${compact ? "adminQrPreview--compact" : ""}`}>
      <div
        ref={containerRef}
        className="adminQrPreview__canvas"
        role="img"
        aria-label={`Mã QR Senova cho ${destination || code || "bản xem trước"}`}
      />
      {!compact ? <code className="adminQrPreview__url">{qrUrl}</code> : null}
      {downloadable ? (
        <div className="adminQrPreview__actions">
          <button type="button" className="adminButton adminButton--secondary" onClick={() => void download("svg")}>
            <Download size={14} />Tải SVG
          </button>
          <button type="button" className="adminButton adminButton--ghost" onClick={() => void download("png")}>
            <Download size={14} />Tải PNG
          </button>
        </div>
      ) : null}
    </div>
  );
}
