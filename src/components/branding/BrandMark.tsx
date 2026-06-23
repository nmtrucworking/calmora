import styles from "./BrandMark.module.css";

type BrandMarkProps = {
  size?: "sm" | "md";
};

export function BrandMark({ size = "md" }: BrandMarkProps) {
  return (
    <span className={`${styles.mark} ${styles[size]}`} aria-hidden="true">
      <img
        src="/calmora-mark-original-look.svg"
        alt="Calmora Mark"
        className={styles.icon}
        decoding="async"
        fetchPriority="high"
      />
    </span>
  );
}
