import { motion } from "framer-motion";
import { imageRevealVariants, motionViewport } from "@shared/motion/animationSystem";
import { cx } from "@shared/utils/classNames";

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
      <img
        src={src}
        alt={alt}
        className={cx(
          "h-full w-full object-cover saturate-[0.88] transition duration-[1200ms] ease-[var(--ease-luxury)] group-hover:scale-[1.018] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          imageClassName,
        )}
        loading={loading}
        decoding="async"
      />
    </motion.figure>
  );
}
