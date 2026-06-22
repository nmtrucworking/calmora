import { motion } from "framer-motion";
import { brandFooterGroups, brandNavigation } from "../../constants/brand";
import { SiteFrame } from "../../components/layout/SiteFrame";
import { SectionHeading } from "../../components/ui/SectionHeading";
import styles from "./AboutPage.module.css";
import { Award, Eye, ThermometerSnowflake, ShieldCheck } from "lucide-react";
import content from "../../data/content.json";
import { Link } from "../../contexts/RouterContext";


export default function AboutPage() {
  const aboutData = content.aboutPage;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.28,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const techIcons = [
    <Eye className={styles.techIcon} />,
    <ThermometerSnowflake className={styles.techIcon} />,
    <Award className={styles.techIcon} />
  ];

  return (
    <SiteFrame navItems={brandNavigation} footerGroups={brandFooterGroups}>
      <motion.div
        className={styles.page}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <section className={styles.hero} aria-labelledby="about-hero-title">
          <motion.div className={styles.heroCopy} variants={itemVariants}>
            <SectionHeading
              eyebrow={aboutData.hero.eyebrow}
              title={aboutData.hero.title}
              description={aboutData.hero.description}
            />
          </motion.div>
        </section>

        {/* Brand Mission Section */}
        <section className={styles.missionSection}>
          <div className={styles.gridTwoCols}>
            <motion.div className={styles.missionCopy} variants={itemVariants}>
              <p className={styles.sectionLabel}>{aboutData.mission.label}</p>
              <h2 className={styles.sectionTitle}>{aboutData.mission.title}</h2>
              <p className={styles.bodyText}>
                {aboutData.mission.text}
              </p>
            </motion.div>
            <motion.div className={styles.quoteCard} variants={itemVariants}>
              <p className={styles.quoteText}>
                &ldquo;{aboutData.mission.quote}&rdquo;
              </p>
              <p className={styles.quoteAuthor}>{aboutData.mission.quoteAuthor}</p>
            </motion.div>
          </div>
        </section>

        {/* Science & Technology Section */}
        <section className={styles.techSection}>
          <motion.div className={styles.techHeader} variants={itemVariants}>
            <SectionHeading
              eyebrow={aboutData.tech.eyebrow}
              title={aboutData.tech.title}
              description={aboutData.tech.description}
              align="center"
            />
          </motion.div>

          <div className={styles.techGrid}>
            {aboutData.tech.cards.map((card, index) => (
              <motion.div key={card.title} className={styles.techCard} variants={itemVariants}>
                <div className={styles.techIconWrapper}>
                  {techIcons[index] || <Award className={styles.techIcon} />}
                </div>
                <h3 className={styles.techCardTitle}>{card.title}</h3>
                <p className={styles.techCardText}>{card.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Principles Section */}
        <section className={styles.principlesSection}>
          <motion.div className={styles.principlesHeader} variants={itemVariants}>
            <h2 className={styles.principlesTitle}>{aboutData.ritual.title}</h2>
          </motion.div>
          <div className={styles.principlesGrid}>
            {aboutData.ritual.items.map((item) => (
              <motion.div key={item.number} className={styles.principleItem} variants={itemVariants}>
                <span className={styles.principleNumber}>{item.number}</span>
                <h4 className={styles.principleItemTitle}>{item.title}</h4>
                <p className={styles.principleItemText}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Flow Section */}
        <section className={styles.ctaSection}>
          <motion.div className={styles.ctaInner} variants={itemVariants}>
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
          </motion.div>
        </section>
      </motion.div>
    </SiteFrame>
  );
}
