import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@app/providers/LanguageContext";
import { Link } from "@app/router/RouterContext";
import { teamContent, teamMembers } from "@features/team/data/teamContent";
import type { LocalizedText } from "@features/about/data/aboutContent";
import { trackEvent } from "@shared/analytics/analytics";
import { motionViewport, sectionRevealVariants } from "@shared/motion/animationSystem";
import styles from "./TeamPage.module.css";

export default function TeamPage() {
  const { language } = useLanguage();
  const t = (text: LocalizedText) => text[language];
  const c = teamContent;

  useEffect(() => {
    trackEvent({ eventName: "team_page_view" });
  }, []);

  return (
    <article className={styles.page}>
      <section className={styles.hero} aria-labelledby="team-hero-title">
        <div className={styles.heroInner}>
          <motion.div initial="hidden" animate="visible" variants={sectionRevealVariants}>
            <p className={styles.eyebrow}>{t(c.hero.eyebrow)}</p>
            <h1 id="team-hero-title">{t(c.hero.title)}</h1>
            <p className={styles.heroDescription}>{t(c.hero.description)}</p>
          </motion.div>
          <motion.div
            className={styles.heroComposition}
            aria-hidden="true"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, delay: 0.12 }}
          >
            {teamMembers.map((member, index) => (
              <div key={member.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{member.monogram}</strong>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className={styles.membersSection} aria-labelledby="team-members-title">
        <motion.header initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <p className={styles.eyebrow}>{t(c.members.eyebrow)}</p>
          <h2 id="team-members-title">{t(c.members.title)}</h2>
        </motion.header>
        <div className={styles.memberList}>
          {teamMembers.map((member, index) => (
            <motion.article
              className={styles.memberProfile}
              key={member.id}
              initial="hidden"
              whileInView="visible"
              viewport={motionViewport}
              variants={sectionRevealVariants}
              onViewportEnter={() => trackEvent({ eventName: "team_member_view", contentViewed: member.id })}
            >
              <div className={styles.memberIndex} aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{member.monogram}</strong>
              </div>
              <div className={styles.memberIdentity}>
                <p>{t(member.role)}</p>
                <h3>{member.name}</h3>
                <div className={styles.nameRule} />
                <p className={styles.memberBio}>{t(member.shortBio)}</p>
              </div>
              <div className={styles.responsibilities}>
                <h4>{t(c.members.responsibilitiesLabel)}</h4>
                <ul>
                  {member.responsibilities[language].map((responsibility) => <li key={responsibility}>{responsibility}</li>)}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.matrixSection} aria-labelledby="team-matrix-title">
        <motion.div className={styles.matrixIntro} initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <p className={styles.eyebrow}>{t(c.matrix.eyebrow)}</p>
          <h2 id="team-matrix-title">{t(c.matrix.title)}</h2>
        </motion.div>
        <motion.div className={styles.matrixTable} role="table" initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <div className={styles.matrixHead} role="row">
            <span role="columnheader">{t(c.matrix.columnCapability)}</span>
            <span role="columnheader">{t(c.matrix.columnDecisions)}</span>
          </div>
          {c.matrix.rows[language].map(([capability, decisions], index) => (
            <div className={styles.matrixRow} role="row" key={capability}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <strong role="cell">{capability}</strong>
              <p role="cell">{decisions}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <section className={styles.advisorSection} aria-labelledby="team-advisors-title">
        <motion.div initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <p className={styles.eyebrow}>{t(c.advisors.eyebrow)}</p>
          <h2 id="team-advisors-title">{t(c.advisors.title)}</h2>
          <p>{t(c.advisors.description)}</p>
        </motion.div>
        <div className={styles.advisorList}>
          {c.advisors.people.map((advisor, index) => (
            <motion.article key={advisor.name} initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{advisor.name}</h3>
              <p>{t(advisor.unit)}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.principlesSection} aria-labelledby="working-principles-title">
        <motion.header initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <p className={styles.eyebrow}>{t(c.principles.eyebrow)}</p>
          <h2 id="working-principles-title">{t(c.principles.title)}</h2>
        </motion.header>
        <ol>
          {c.principles.items[language].map(([title, text], index) => (
            <motion.li key={title} initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className={styles.finalCta} aria-labelledby="team-cta-title">
        <motion.div initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <p className={styles.eyebrow}>{t(c.cta.eyebrow)}</p>
          <h2 id="team-cta-title">{t(c.cta.title)}</h2>
          <p>{t(c.cta.body)}</p>
          <div className={styles.actions}>
            <Link
              className={styles.primaryButton}
              href={c.cta.primary.href}
              onClick={() => trackEvent({ eventName: "team_to_partners_click", destination: "/partners" })}
            >
              {t(c.cta.primary.label)} <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              className={styles.secondaryButton}
              href={c.cta.secondary.href}
              onClick={() => trackEvent({ eventName: "team_to_contact_click", destination: "/contact" })}
            >
              {t(c.cta.secondary.label)} <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </section>
    </article>
  );
}
