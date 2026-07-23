import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useLanguage } from "@app/providers/LanguageContext";
import { Link } from "@app/router/RouterContext";
import { aboutContent, type LocalizedText } from "@features/about/data/aboutContent";
import { trackEvent } from "@shared/analytics/analytics";
import { sectionRevealVariants, motionViewport } from "@shared/motion/animationSystem";
import styles from "./AboutPage.module.css";

const heroImage = "/assets/brand/about/calmora-material-hero-1440.webp";
const processImage = "/assets/brand/about/calmora-process-01-1440.webp";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = (text: LocalizedText) => text[language];
  const c = aboutContent;

  useEffect(() => {
    trackEvent({ eventName: "brand_about_view" });
  }, []);

  return (
    <article className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-hero-title">
        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroCopy}
            initial="hidden"
            animate="visible"
            variants={sectionRevealVariants}
          >
            <p className={styles.eyebrow}>{t(c.hero.eyebrow)}</p>
            <h1 id="about-hero-title">{t(c.hero.title)}</h1>
            <p className={styles.heroDescription}>{t(c.hero.description)}</p>
            <div className={styles.actions}>
              <a className={styles.primaryButton} href={c.hero.primary.href}>
                {t(c.hero.primary.label)}
                <ArrowDown aria-hidden="true" />
              </a>
              <Link
                className={styles.secondaryButtonDark}
                href={c.hero.secondary.href}
                onClick={() => trackEvent({ eventName: "about_to_team_click", destination: "/team" })}
              >
                {t(c.hero.secondary.label)}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          <motion.figure
            className={styles.heroFigure}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.12 }}
          >
            <img
              src={heroImage}
              srcSet="/assets/brand/about/calmora-material-hero-720.webp 720w, /assets/brand/about/calmora-material-hero-1440.webp 1440w"
              sizes="(max-width: 760px) 100vw, 58vw"
              width="1440"
              height="810"
              alt={language === "vi" ? "Cánh sen và trà trong khoảnh khắc cảm nhận hương" : "Lotus petals and tea during a moment of sensing the aroma"}
              fetchPriority="high"
            />
            <figcaption>{language === "vi" ? "Chất liệu · thao tác · cảm nhận" : "Material · gesture · perception"}</figcaption>
          </motion.figure>
        </div>
      </section>

      <motion.section
        className={styles.startingSection}
        aria-labelledby="starting-question-title"
        initial="hidden"
        whileInView="visible"
        viewport={motionViewport}
        variants={sectionRevealVariants}
      >
        <div className={styles.sectionIndex}>01</div>
        <div className={styles.startingTitle}>
          <p className={styles.eyebrow}>{t(c.startingQuestion.eyebrow)}</p>
          <h2 id="starting-question-title">{t(c.startingQuestion.title)}</h2>
        </div>
        <div className={styles.startingBody}>
          {c.startingQuestion.paragraphs[language].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <blockquote>“{t(c.startingQuestion.quote)}”</blockquote>
        </div>
      </motion.section>

      <section className={styles.idealSection} id="brand-ideal" aria-labelledby="brand-ideal-title">
        <div className={styles.idealGrid}>
          <motion.article
            className={styles.visionBlock}
            initial="hidden"
            whileInView="visible"
            viewport={motionViewport}
            variants={sectionRevealVariants}
          >
            <span>02 / {t(c.vision.title)}</span>
            <h2 id="brand-ideal-title">{t(c.vision.text)}</h2>
          </motion.article>
          <div className={styles.idealSide}>
            {[c.mission, c.ideal].map((item, index) => (
              <motion.article
                key={item.title.vi}
                initial="hidden"
                whileInView="visible"
                viewport={motionViewport}
                variants={sectionRevealVariants}
              >
                <span>0{index + 3} / {t(item.title)}</span>
                <p>{t(item.text)}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.principlesSection} aria-labelledby="brand-principles-title">
        <motion.header initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <p className={styles.eyebrow}>{t(c.principles.eyebrow)}</p>
          <h2 id="brand-principles-title">{t(c.principles.title)}</h2>
        </motion.header>
        <div className={styles.principleSequence}>
          {c.principles.items.map((item) => (
            <motion.article
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={motionViewport}
              variants={sectionRevealVariants}
              onViewportEnter={() => trackEvent({ eventName: "brand_principle_view", contentViewed: item.id })}
            >
              <div className={styles.principleNumber}>{item.index}</div>
              <div>
                <span>{t(item.label)}</span>
                <h3>{t(item.title)}</h3>
                <p>{t(item.text)}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.methodSection} aria-labelledby="brand-method-title">
        <div className={styles.methodInner}>
          <motion.div
            className={styles.methodIntro}
            initial="hidden"
            whileInView="visible"
            viewport={motionViewport}
            variants={sectionRevealVariants}
            onViewportEnter={() => trackEvent({ eventName: "brand_method_view" })}
          >
            <p className={styles.eyebrow}>{t(c.method.eyebrow)}</p>
            <h2 id="brand-method-title">{t(c.method.title)}</h2>
            <p>{t(c.method.description)}</p>
            <small>{t(c.method.note)}</small>
          </motion.div>
          <motion.figure initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
            <img
              src={processImage}
              srcSet="/assets/brand/about/calmora-process-01-720.webp 720w, /assets/brand/about/calmora-process-01-1440.webp 1440w"
              sizes="(max-width: 900px) 100vw, 42vw"
              width="1440"
              height="810"
              alt={language === "vi" ? "Thao tác mở nguyên mẫu Petal Pack bằng tay" : "A hand opening a Petal Pack prototype"}
              loading="lazy"
              decoding="async"
            />
          </motion.figure>
          <ol className={styles.processList}>
            {c.method.items[language].map(([title, text], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.senovaSection} aria-labelledby="senova-expression-title">
        <motion.div className={styles.senovaCopy} initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <p className={styles.eyebrow}>{t(c.senova.eyebrow)}</p>
          <h2 id="senova-expression-title">{t(c.senova.title)}</h2>
          <p>{t(c.senova.body)}</p>
          <Link
            className={styles.textLink}
            href={c.senova.cta.href}
            onClick={() => trackEvent({ eventName: "about_to_products_click", destination: "/products" })}
          >
            {t(c.senova.cta.label)} <ArrowRight aria-hidden="true" />
          </Link>
        </motion.div>
        <motion.figure className={styles.senovaFigure} initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <img
            src="/assets/products/petal-pack-1440.webp"
            srcSet="/assets/products/petal-pack-720.webp 720w, /assets/products/petal-pack-1440.webp 1440w"
            sizes="(max-width: 900px) 100vw, 58vw"
            width="1440"
            height="810"
            alt={language === "vi" ? "Senova Petal Pack trong hành trình pha trà" : "Senova Petal Pack within the tea-brewing journey"}
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            {c.senova.roles[language].map(([title, text]) => <div key={title}><strong>{title}</strong><span>{text}</span></div>)}
          </figcaption>
        </motion.figure>
      </section>

      <section className={styles.responsibilitySection} aria-labelledby="cultural-responsibility-title">
        <motion.div initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <p className={styles.eyebrow}>{t(c.responsibility.eyebrow)}</p>
          <h2 id="cultural-responsibility-title">{t(c.responsibility.title)}</h2>
          <p>{t(c.responsibility.body)}</p>
        </motion.div>
        <ol>
          {c.responsibility.principles[language].map((principle, index) => (
            <li key={principle}><span>{String(index + 1).padStart(2, "0")}</span>{principle}</li>
          ))}
        </ol>
      </section>

      <section className={styles.teamBridge} aria-labelledby="about-team-title">
        <motion.div initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <p className={styles.eyebrow}>{t(c.team.eyebrow)}</p>
          <h2 id="about-team-title">{t(c.team.title)}</h2>
          <p>{t(c.team.body)}</p>
          <Link
            className={styles.textLink}
            href={c.team.cta.href}
            onClick={() => trackEvent({ eventName: "about_to_team_click", destination: "/team" })}
          >
            {t(c.team.cta.label)} <ArrowRight aria-hidden="true" />
          </Link>
        </motion.div>
        <div className={styles.disciplineMark} aria-hidden="true">
          <span>01</span><span>02</span><span>03</span>
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="about-final-title">
        <motion.div initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionRevealVariants}>
          <p className={styles.eyebrow}>{t(c.finalCta.eyebrow)}</p>
          <h2 id="about-final-title">{t(c.finalCta.title)}</h2>
          <p>{t(c.finalCta.body)}</p>
          <div className={styles.actions}>
            <Link className={styles.primaryButton} href={c.finalCta.primary.href}>{t(c.finalCta.primary.label)} <ArrowRight aria-hidden="true" /></Link>
            <Link className={styles.secondaryButtonDark} href={c.finalCta.secondary.href}>{t(c.finalCta.secondary.label)} <ArrowRight aria-hidden="true" /></Link>
          </div>
        </motion.div>
      </section>
    </article>
  );
}
