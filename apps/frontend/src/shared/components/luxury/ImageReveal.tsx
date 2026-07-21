import { motion } from "framer-motion";
import { imageRevealVariants, motionViewport } from "@shared/motion/animationSystem";
import { cx } from "@shared/utils/classNames";
import { getImageAssetByPath } from "@features/content/imageManifest";
import { ResponsiveImage } from "@shared/components/media/ResponsiveImage";

type ImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
};

export function ImageReveal({
  src,
  alt,
  className,
  imageClassName,
  loading = "lazy",
}: ImageRevealProps) {
  const asset = getImageAssetByPath(src);
  const imageClasses = cx(
    "h-full w-full object-cover saturate-[0.88] transition duration-[var(--motion-slow)] ease-[var(--ease-luxury)] group-hover:scale-[1.012] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
    imageClassName,
  );

  return (
    <motion.figure
      initial="hidden"
      whileInView="visible"
      viewport={motionViewport}
      variants={imageRevealVariants}
      className={cx(
        "group m-0 overflow-hidden border border-[rgba(56,75,68,0.18)] bg-[var(--surface)] shadow-[var(--shadow-luxury-sm)]",
        className,
      )}
    >
      {asset ? (
        <ResponsiveImage asset={asset} alt={alt} className={imageClasses} loading={loading} sizes="(max-width: 900px) 100vw, 50vw" />
      ) : (
        <img src={src} alt={alt} className={imageClasses} loading={loading} decoding="async" />
      )}
    </motion.figure>
  );
}
