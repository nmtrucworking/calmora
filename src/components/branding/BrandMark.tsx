import styles from "./BrandMark.module.css";

type BrandMarkProps = {
  size?: "sm" | "md";
};

export function BrandMark({ size = "md" }: BrandMarkProps) {
  return (
    <span className={`${styles.mark} ${styles[size]}`} aria-hidden="false">
      <img
        src="/assets/brand/calmora-mark.png"
        alt="Calmora Mark"
        className={styles.icon}
        decoding="async"
        fetchPriority="high"
        width="256"
        height="190"
      />
    </span>
  );
}
