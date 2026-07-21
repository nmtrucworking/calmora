import type { ImgHTMLAttributes } from "react";
import type { ImageAsset } from "@features/content/imageManifest";
import { cx } from "@shared/utils/classNames";

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  asset: ImageAsset;
  sizes?: string;
};

export function ResponsiveImage({ asset, alt, className, loading = "lazy", sizes = "100vw", ...props }: ResponsiveImageProps) {
  return (
    <picture className="contents">
      {asset.sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
      ))}
      <img
        {...props}
        src={asset.fallback}
        alt={alt}
        width={asset.width}
        height={asset.height}
        className={cx(className)}
        loading={loading}
        decoding="async"
      />
    </picture>
  );
}
