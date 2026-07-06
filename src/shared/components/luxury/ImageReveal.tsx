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
    <figure
      className={cx(
        "m-0 overflow-hidden border border-[rgba(56,75,68,0.18)] bg-[var(--surface)] shadow-[var(--shadow-luxury-sm)]",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cx("h-full w-full object-cover saturate-[0.88]", imageClassName)}
        loading={loading}
        decoding="async"
      />
    </figure>
  );
}
