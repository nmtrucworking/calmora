import type { Language } from "@app/providers/LanguageContext";
import type { ImageAsset } from "@features/content/imageManifest";

export function ImageStatusLabel({ asset, language }: { asset: ImageAsset; language: Language }) {
  if (asset.status === "production") return null;

  return (
    <span className="absolute right-3 bottom-3 border border-[rgb(255_250_240_/_42%)] bg-[rgb(7_17_15_/_78%)] px-2.5 py-1.5 text-[0.68rem] font-[650] tracking-[0.08em] text-text-inverse">
      {asset.statusLabel[language]}
    </span>
  );
}
