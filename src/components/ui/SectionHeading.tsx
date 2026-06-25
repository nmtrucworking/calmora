import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  level?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  level = "h1",
}: SectionHeadingProps) {
  const TitleTag = level;

  return (
    <header className={`${styles.heading} ${styles[align]}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <TitleTag className={styles.title}>{title}</TitleTag>
      {description ? <p className={styles.description}>{description}</p> : null}
    </header>
  );
}
