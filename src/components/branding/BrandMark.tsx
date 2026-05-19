import { Leaf } from "lucide-react";
import styles from "./BrandMark.module.css";

type BrandMarkProps = {
  size?: "sm" | "md";
};

export function BrandMark({ size = "md" }: BrandMarkProps) {
  return (
    <span className={`${styles.mark} ${styles[size]}`} aria-hidden="true">
      <Leaf className={styles.icon} />
    </span>
  );
}
