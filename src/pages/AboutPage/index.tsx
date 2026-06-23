import { SectionHeading } from "../../components/ui/SectionHeading";
import styles from "./AboutPage.module.css";
import { Award, Eye, ThermometerSnowflake, ShieldCheck, type LucideIcon } from "lucide-react";
import content from "../../data/content.json";
import { Link } from "../../contexts/RouterContext";


export default function AboutPage() {
  const aboutData = content.aboutPage;
  const techIcons: LucideIcon[] = [Eye, ThermometerSnowflake, Award];

  return (
    <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="about-hero-title">
          <div className={`${styles.heroCopy} ${styles.introReveal}`}>
            <SectionHeading
              eyebrow={aboutData.hero.eyebrow}
              title={aboutData.hero.title}
              description={aboutData.hero.description}
            />
          </div>
        </section>

        <section className={styles.missionSection}>
          <div className={styles.gridTwoCols}>
            <div className={`${styles.missionCopy} ${styles.revealOnView}`}>
              <p className={styles.sectionLabel}>{aboutData.mission.label}</p>
              <h2 className={styles.sectionTitle}>{aboutData.mission.title}</h2>
              <p className={styles.bodyText}>
                {aboutData.mission.text}
              </p>
            </div>
            <div className={`${styles.quoteCard} ${styles.revealOnView}`}>
              <p className={styles.quoteText}>
                &ldquo;{aboutData.mission.quote}&rdquo;
              </p>
              <p className={styles.quoteAuthor}>{aboutData.mission.quoteAuthor}</p>
            </div>
          </div>
        </section>

        <section className={styles.techSection}>
          <div className={`${styles.techHeader} ${styles.revealOnView}`}>
            <SectionHeading
              eyebrow={aboutData.tech.eyebrow}
              title={aboutData.tech.title}
              description={aboutData.tech.description}
              align="center"
            />
          </div>

          <div className={styles.techGrid}>
            {aboutData.tech.cards.map((card, index) => {
              const TechIcon = techIcons[index] ?? Award;

              return (
              <article key={card.title} className={`${styles.techCard} ${styles.revealOnView}`}>
                <div className={styles.techIconWrapper}>
                  <TechIcon className={styles.techIcon} />
                </div>
                <h3 className={styles.techCardTitle}>{card.title}</h3>
                <p className={styles.techCardText}>{card.text}</p>
              </article>
              );
            })}
          </div>
        </section>

        <section className={styles.principlesSection}>
          <div className={`${styles.principlesHeader} ${styles.revealOnView}`}>
            <h2 className={styles.principlesTitle}>{aboutData.ritual.title}</h2>
          </div>
          <div className={styles.principlesGrid}>
            {aboutData.ritual.items.map((item) => (
              <article key={item.number} className={`${styles.principleItem} ${styles.revealOnView}`}>
                <span className={styles.principleNumber}>{item.number}</span>
                <h4 className={styles.principleItemTitle}>{item.title}</h4>
                <p className={styles.principleItemText}>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.ctaSection} ${styles.revealOnView}`}>
          <div className={styles.ctaInner}>
            <ShieldCheck className={styles.ctaIcon} />
            <h2 className={styles.ctaTitle}>{aboutData.cta.title}</h2>
            <p className={styles.ctaText}>
              {aboutData.cta.text}
            </p>
            <div className={styles.ctaButtonWrap}>
              <a href="mailto:hello@senova.vn" className={styles.ctaBtn}>
                {aboutData.cta.btnText}
              </a>
              <Link href="/products" className={styles.ctaSecondaryBtn}>
                {aboutData.cta.secondaryBtnText}
              </Link>
            </div>
          </div>
        </section>
    </div>
  );
}
