import { Link } from "@app/router/RouterContext";

type InfoCardProps = {
  label: string;
  title: string;
  text: string;
  href?: string;
};

export function InfoCard({ label, title, text, href }: InfoCardProps) {
  const cardClass =
    "grid gap-[0.7rem] rounded-brand-md bg-surface p-[1.2rem] text-inherit no-underline transition-colors duration-200 hover:bg-surface-strong";

  const content = (
    <>
      <p className="m-0 text-[0.72rem] uppercase tracking-[0.24em] text-accent-strong">{label}</p>
      <h2 className="m-0 font-display text-2xl leading-[1.05] text-text">{title}</h2>
      <p className="m-0 leading-[1.7] text-text-muted">{text}</p>
      {href ? (
        <span className="text-[0.84rem] font-semibold text-accent-strong">Mở trang</span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link className={cardClass} href={href}>
        {content}
      </Link>
    );
  }

  return <article className={cardClass}>{content}</article>;
}
