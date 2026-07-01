import { Award, Eye, ThermometerSnowflake, ShieldCheck, type LucideIcon } from "lucide-react";
import { SectionHeading } from "../../components/ui/SectionHeading";
import content from "../../data/content.json";
import { Link } from "../../contexts/RouterContext";
import { cx } from "../../utils/classNames";

const revealClass =
  "translate-y-[18px] opacity-0 animate-[aboutReveal_680ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:translate-y-0 motion-reduce:animate-none motion-reduce:opacity-100";

export default function AboutPage() {
  const aboutData = content.aboutPage;
  const techIcons: LucideIcon[] = [Eye, ThermometerSnowflake, Award];

  return (
    <div className="grid gap-28 pb-12 max-[900px]:gap-[4.5rem]">
      <section className="pt-8" aria-labelledby="about-hero-title">
        <div className="max-w-[44rem] translate-y-[18px] opacity-0 animate-[aboutReveal_720ms_cubic-bezier(0.16,1,0.3,1)_80ms_both] motion-reduce:translate-y-0 motion-reduce:animate-none motion-reduce:opacity-100">
          <SectionHeading
            eyebrow={aboutData.hero.eyebrow}
            title={aboutData.hero.title}
            description={aboutData.hero.description}
          />
        </div>
      </section>

      <section className="[content-visibility:auto] [contain-intrinsic-size:auto_680px]">
        <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-8">
          <div className={revealClass}>
            <p className="m-0 text-[0.8rem] uppercase tracking-[0.24em] text-accent-gold">
              {aboutData.mission.label}
            </p>
            <h2 className="mt-[0.9rem] mb-0 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.08] text-text">
              {aboutData.mission.title}
            </h2>
            <p className="mt-5 mb-0 text-[1.05rem] leading-[1.8] text-text-muted [&_strong]:text-accent-gold">
              {aboutData.mission.text}
            </p>
          </div>
          <div
            className={cx(
              revealClass,
              "relative overflow-hidden rounded-brand-lg bg-[#fffaf008] p-[2.2rem] backdrop-blur-2xl before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:-translate-y-full before:bg-[linear-gradient(180deg,transparent,var(--accent-gold),transparent)] before:animate-[aboutLineScan_1.2s_cubic-bezier(0.16,1,0.3,1)_420ms_both] motion-reduce:before:animate-none",
            )}
          >
            <p className="m-0 font-display text-[1.35rem] italic leading-[1.6] text-text">
              &ldquo;{aboutData.mission.quote}&rdquo;
            </p>
            <p className="mt-5 mb-0 text-[0.82rem] uppercase tracking-[0.16em] text-accent-gold">
              {aboutData.mission.quoteAuthor}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-14 [content-visibility:auto] [contain-intrinsic-size:auto_680px]">
        <div className={cx("mx-auto max-w-[44rem]", revealClass)}>
          <SectionHeading
            eyebrow={aboutData.tech.eyebrow}
            title={aboutData.tech.title}
            description={aboutData.tech.description}
            align="center"
            level="h2"
          />
        </div>

        <div className="grid grid-cols-3 gap-[1.8rem] max-[900px]:grid-cols-1 max-[900px]:gap-8">
          {aboutData.tech.cards.map((card, index) => {
            const TechIcon = techIcons[index] ?? Award;

            return (
              <article
                key={card.title}
                className={cx(
                  revealClass,
                  "grid gap-[1.1rem] rounded-brand-lg bg-[#fffaf008] p-8 transition-colors duration-200 hover:bg-[#fffaf00f]",
                  index === 1 && "[animation-delay:80ms]",
                  index === 2 && "[animation-delay:160ms]",
                )}
              >
                <div className="grid h-[3.2rem] w-[3.2rem] place-items-center rounded-brand-sm bg-[rgba(248,223,147,0.05)]">
                  <TechIcon className="h-6 w-6 text-accent-gold" />
                </div>
                <h3 className="m-0 font-display text-[1.38rem] leading-[1.1] text-text">
                  {card.title}
                </h3>
                <p className="m-0 text-[0.94rem] leading-[1.7] text-text-muted">{card.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-[2.8rem] pt-[4.5rem] [content-visibility:auto] [contain-intrinsic-size:auto_680px]">
        <div className={revealClass}>
          <h2 className="m-0 text-center font-display text-[2.2rem] leading-[1.1] text-text">
            {aboutData.ritual.title}
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-[2.2rem] max-[900px]:grid-cols-1 max-[900px]:gap-8">
          {aboutData.ritual.items.map((item, index) => (
            <article
              key={item.number}
              className={cx(
                revealClass,
                "grid gap-[0.85rem]",
                index === 1 && "[animation-delay:80ms]",
                index === 2 && "[animation-delay:160ms]",
              )}
            >
              <span className="text-[0.76rem] uppercase tracking-[0.24em] text-accent-gold">
                {item.number}
              </span>
              <h4 className="m-0 text-[1.25rem] font-bold text-text">{item.title}</h4>
              <p className="m-0 text-[0.92rem] leading-[1.65] text-text-soft">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className={cx(
          revealClass,
          "mx-auto max-w-[52rem] rounded-brand-lg bg-[radial-gradient(circle_at_top,rgba(185,86,114,0.06),transparent_60%),rgba(7,17,15,0.28)] px-8 py-[4.5rem] text-center backdrop-blur-[18px] [content-visibility:auto] [contain-intrinsic-size:auto_680px]",
        )}
      >
        <div className="flex flex-col items-center gap-5">
          <ShieldCheck className="h-[2.8rem] w-[2.8rem] text-accent-gold" />
          <h2 className="m-0 font-display text-[2.4rem] leading-[1.1] text-text">
            {aboutData.cta.title}
          </h2>
          <p className="m-0 max-w-[32rem] text-[1.05rem] leading-[1.7] text-text-muted">
            {aboutData.cta.text}
          </p>
          <div className="mt-4 flex gap-4 max-[900px]:w-full max-[900px]:flex-col">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-gold px-[1.6rem] py-3 font-bold text-page-bg no-underline transition duration-150 hover:bg-[#fffaf0] max-[900px]:w-full"
            >
              {aboutData.cta.btnText}
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#fffaf014] px-[1.6rem] py-3 font-bold text-text no-underline transition duration-150 hover:bg-[#fffaf024] max-[900px]:w-full"
            >
              {aboutData.cta.secondaryBtnText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
