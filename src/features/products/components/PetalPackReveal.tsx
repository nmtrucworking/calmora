import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRef } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { productsPageStyles as styles } from "../../../styles/productsPageClasses";

type RevealStep = {
  num: string;
  label: string;
  title: string;
  text: string;
};

function StepSvg({ state }: { state: string }) {
  if (state === "03" || state === "04") {
    return (
      <svg viewBox="0 0 100 100" fill="none">
        <path d="M30 65 C30 80 70 80 70 65 L72 52 L28 52 Z" fill="rgba(255,250,240,0.05)" stroke="var(--text)" strokeWidth="1.6" />
        <path d="M31 58 C45 61 55 56 69 58 L68 65 C68 76 32 76 32 65 Z" fill="rgba(248,223,147,0.32)" stroke="var(--accent-gold)" strokeWidth="1" />
        {state === "03" ? (
          <>
            <rect x="46" y="42" width="8" height="11" rx="1.5" fill="rgba(255,250,240,0.05)" stroke="var(--text)" strokeWidth="1.1" />
            <path d="M50 42 L50 22" stroke="var(--accent-gold)" strokeWidth="0.9" strokeDasharray="2 2" />
          </>
        ) : (
          <>
            <motion.path d="M40 44 Q43 38 40 32 T40 20" stroke="rgba(248,223,147,0.34)" strokeWidth="1.2" animate={{ y: [0, -5, 0], opacity: [0.24, 0.58, 0.24] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }} />
            <motion.path d="M50 44 Q47 36 50 28 T50 16" stroke="rgba(248,223,147,0.42)" strokeWidth="1.2" animate={{ y: [0, -6, 0], opacity: [0.28, 0.68, 0.28] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
            <motion.path d="M60 44 Q63 38 60 32 T60 20" stroke="rgba(248,223,147,0.34)" strokeWidth="1.2" animate={{ y: [0, -5, 0], opacity: [0.24, 0.58, 0.24] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
          </>
        )}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" fill="none">
      <path d="M50 15 C35 45 40 75 50 88 C60 75 65 45 50 15 Z" fill="rgba(185,86,114,0.05)" stroke="var(--accent)" strokeWidth="1" />
      <path d="M50 20 C40 45 42 75 50 85 C58 75 60 45 50 20 Z" fill="rgba(185,86,114,0.16)" stroke="var(--accent)" strokeWidth="1.6" />
      {state === "02" ? (
        <>
          <path d="M50 28 C22 38 20 68 30 80 C38 76 44 60 50 85" fill="rgba(185,86,114,0.12)" stroke="var(--accent)" strokeWidth="1.6" />
          <path d="M50 28 C78 38 80 68 70 80 C62 76 56 60 50 85" fill="rgba(185,86,114,0.12)" stroke="var(--accent)" strokeWidth="1.6" />
        </>
      ) : null}
      <path d="M50 20 C46 42 47 68 50 85" stroke="var(--accent-gold)" strokeWidth="1.1" strokeOpacity="0.8" />
      <path d="M50 20 C54 42 53 68 50 85" stroke="var(--accent-gold)" strokeWidth="1.1" strokeOpacity="0.8" />
    </svg>
  );
}

export function PetalPackReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const copy = {
    vi: {
      badge: "SENOVA PETAL PACK",
      hints: [
        "Búp sen là điểm bắt đầu của trải nghiệm",
        "Từng lớp cánh mở ra phần trà bên trong",
        "Pha theo thông số trên bao bì",
        "Hương và vị dần hiện ra",
      ],
      steps: [
        { num: "01", label: "MỞ", title: "Mở một cánh sen", text: "Mở nhẹ từng lớp cánh để quan sát cấu trúc Petal Pack và lấy phần trà bên trong." },
        { num: "02", label: "CẢM", title: "Cảm nhận trước khi pha", text: "Dành một khoảnh khắc để nhìn hình dáng, nhận biết chất liệu và cảm nhận hương trước khi rót nước." },
        { num: "03", label: "PHA", title: "Pha theo hướng dẫn", text: "Đặt phần trà vào cốc và thực hiện theo hướng dẫn in trên bao bì." },
        { num: "04", label: "THƯỞNG", title: "Thưởng thức trong nhịp chậm", text: "Quan sát màu nước, cảm nhận hương vị, rồi ghi lại phản hồi về trải nghiệm." },
      ],
    },
    en: {
      badge: "SENOVA PETAL PACK",
      hints: [
        "The lotus bud begins the experience",
        "Each petal reveals the tea inside",
        "Brew according to the package guide",
        "Aroma and body slowly appear",
      ],
      steps: [
        { num: "01", label: "OPEN", title: "Open a lotus petal", text: "Gently open each layer to observe the Petal Pack structure and reveal the tea inside." },
        { num: "02", label: "NOTICE", title: "Notice before brewing", text: "Pause to take in the shape, material and aroma before pouring water." },
        { num: "03", label: "BREW", title: "Brew by the guide", text: "Place the tea in a cup and follow the instructions printed on the package." },
        { num: "04", label: "TASTE", title: "Taste at a slower pace", text: "Observe the liquor, notice aroma and body, then leave feedback on the experience." },
      ],
    },
  }[language] satisfies { badge: string; hints: string[]; steps: RevealStep[] };

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const opacities = [
    useTransform(scrollYProgress, [0, 0.25, 0.3], [1, 1, 0]),
    useTransform(scrollYProgress, [0.2, 0.3, 0.5, 0.55], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [0.45, 0.55, 0.75, 0.8], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]),
  ];

  return (
    <div id="petal-pack" ref={containerRef} className={styles.petalPackTrack}>
      <div className={styles.petalPackSticky}>
        <div className={styles.petalPackGrid}>
          <div className={styles.revealVisualArea}>
            <div className={styles.revealTitleBadge}>
              <Sparkles className={styles.revealBadgeIcon} />
              {copy.badge}
            </div>

            <div className={styles.revealDisplayStage}>
              {copy.steps.map((step, index) => (
                <motion.div key={step.num} className={styles.revealLayer} style={{ opacity: opacities[index] }}>
                  <div className={styles.revealSvg}>
                    <StepSvg state={step.num} />
                  </div>
                  <p className={styles.revealStepHint}>{copy.hints[index]}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className={styles.revealTextContent}>
            {copy.steps.map((step) => (
              <div key={step.num} className={styles.revealTextStep}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>{step.num}</span>
                  <span className={styles.stepTag}>{step.label}</span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <div className={styles.revealMobileSvg}>
                  <StepSvg state={step.num} />
                </div>
                <p className={styles.stepDescription}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
