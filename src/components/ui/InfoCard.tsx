import styles from "./InfoCard.module.css";

type InfoCardProps = {
  label: string;
  title: string;
  text: string;
  href?: string;
};

export function InfoCard({ label, title, text, href }: InfoCardProps) {
  const content = (
    <>
      <p className={styles.label}>{label}</p>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
      {href ? <span className={styles.linkHint}>Mở trang</span> : null}
    </>
  );

  if (href) {
    return (
      <a className={styles.card} href={href}>
        {content}
      </a>
    );
  }

  return <article className={styles.card}>{content}</article>;
}
