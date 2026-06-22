import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "../../../pages/ProductsPage/ProductsPage.module.css";
import { Sparkles } from "lucide-react";

export function PetalPackReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll inside container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map progress into intermediate values
  // These will control opacity and translations of various visual layers
  const step1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.3], [1, 1, 0]);
  const step2Opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.5, 0.55], [0, 1, 1, 0]);
  const step3Opacity = useTransform(scrollYProgress, [0.45, 0.55, 0.75, 0.8], [0, 1, 1, 0]);
  const step4Opacity = useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]);


  const stepsData = [
    {
      num: "01",
      label: "MỞ",
      title: "Mở một cánh sen",
      text: "Trải nghiệm bắt đầu bằng việc mở búp sen khô được định hình thủ công, bảo vệ từng búp trà bên trong.",
    },
    {
      num: "02",
      label: "CHẠM",
      title: "Chạm vào chất liệu thật",
      text: "Cánh sen thật sấy lạnh bao quanh búp trà, cho phép bạn cảm nhận độ xơ nhẹ và hương thơm nguyên bản ngay trên đầu ngón tay.",
    },
    {
      num: "03",
      label: "PHA",
      title: "Nghi thức rót nước",
      text: "Định lượng trà hoàn hảo cho một lần pha. Đặt túi trà vào tách và để nước sôi đánh thức các lớp hương hoa sen ẩn giấu.",
    },
    {
      num: "04",
      label: "THƯỞNG",
      title: "Thưởng thức hương vị",
      text: "Một nhịp thở chậm lại. Hơi nước bốc lên mang theo hương thơm thanh tao của sen và vị đậm đà của trà hữu cơ.",
    },
  ];

  return (
    <div id="petal-pack" ref={containerRef} className={styles.petalPackTrack}>
      <div className={styles.petalPackSticky}>
        <div className={styles.petalPackGrid}>
          
          {/* Left Side: Visual Experience */}
          <div className={styles.revealVisualArea}>
            <div className={styles.revealTitleBadge}>
              <Sparkles className={styles.revealBadgeIcon} />
              SENOVA PETAL PACK
            </div>

            {/* Visual Layers that morph on scroll */}
            <div className={styles.revealDisplayStage}>
              
              {/* Layer 1: Closed Bud (State 1) */}
              <motion.div className={styles.revealLayer} style={{ opacity: step1Opacity }}>
                <svg className={styles.revealSvg} viewBox="0 0 100 100" fill="none">
                  {/* Outer bud petals */}
                  <path d="M50 20 C42 45 42 75 50 85 C58 75 58 45 50 20 Z" fill="rgba(185, 86, 114, 0.2)" stroke="var(--accent)" strokeWidth="1.5" />
                  <path d="M50 20 C32 48 38 72 45 82" stroke="var(--accent)" strokeWidth="1.2" strokeDasharray="1 1" />
                  <path d="M50 20 C68 48 62 72 55 82" stroke="var(--accent)" strokeWidth="1.2" strokeDasharray="1 1" />
                </svg>
                <p className={styles.revealStepHint}>Búp sen khép mình tĩnh lặng</p>
              </motion.div>

              {/* Layer 2: Peeling Petals (State 2) */}
              <motion.div className={styles.revealLayer} style={{ opacity: step2Opacity }}>
                <svg className={styles.revealSvg} viewBox="0 0 100 100" fill="none">
                  {/* Bud opening up */}
                  <path d="M50 32 C48 50 48 78 50 85 C52 78 52 50 50 32 Z" fill="rgba(185, 86, 114, 0.4)" stroke="var(--accent)" strokeWidth="1.5" />
                  {/* Left peeling petal */}
                  <path d="M50 32 C25 40 22 70 32 80 C40 76 46 62 50 85" fill="rgba(185, 86, 114, 0.15)" stroke="var(--accent)" strokeWidth="1.2" />
                  {/* Right peeling petal */}
                  <path d="M50 32 C75 40 78 70 68 80 C60 76 54 62 50 85" fill="rgba(185, 86, 114, 0.15)" stroke="var(--accent)" strokeWidth="1.2" />
                </svg>
                <p className={styles.revealStepHint}>Cánh sen bắt đầu hé nở</p>
              </motion.div>

              {/* Layer 3: Brewing / Tea core (State 3) */}
              <motion.div className={styles.revealLayer} style={{ opacity: step3Opacity }}>
                <svg className={styles.revealSvg} viewBox="0 0 100 100" fill="none">
                  {/* Tea cup */}
                  <path d="M30 65 C30 80 70 80 70 65 L72 52 L28 52 Z" fill="rgba(255, 250, 240, 0.05)" stroke="var(--text-soft)" strokeWidth="1.5" />
                  {/* Liquid inside */}
                  <path d="M31 58 C45 61 55 56 69 58 L68 65 C68 76 32 76 32 65 Z" fill="rgba(248, 223, 147, 0.28)" />
                  {/* Tea bag sinking */}
                  <rect x="46" y="42" width="8" height="11" rx="1" fill="rgba(255, 250, 240, 0.2)" stroke="var(--text)" strokeWidth="1" />
                  <path d="M50 42 L50 25" stroke="var(--text-soft)" strokeWidth="0.8" strokeDasharray="2 2" />
                </svg>
                <p className={styles.revealStepHint}>Trà hòa mình vào nước ấm</p>
              </motion.div>

              {/* Layer 4: Steaming Cup (State 4) */}
              <motion.div className={styles.revealLayer} style={{ opacity: step4Opacity }}>
                <svg className={styles.revealSvg} viewBox="0 0 100 100" fill="none">
                  {/* Hot Tea Cup */}
                  <path d="M30 65 C30 80 70 80 70 65 L72 52 L28 52 Z" fill="rgba(255, 250, 240, 0.08)" stroke="var(--text)" strokeWidth="1.8" />
                  <path d="M31 58 C45 61 55 56 69 58 L68 65 C68 76 32 76 32 65 Z" fill="rgba(248, 223, 147, 0.45)" />
                  {/* Steam lines */}
                  <motion.path 
                    d="M40 44 Q43 38 40 32 T40 20" 
                    stroke="rgba(248, 223, 147, 0.4)" 
                    strokeWidth="1.2" 
                    animate={{ y: [0, -8, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.path 
                    d="M50 44 Q47 36 50 28 T50 16" 
                    stroke="rgba(248, 223, 147, 0.5)" 
                    strokeWidth="1.2"
                    animate={{ y: [0, -10, 0], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  />
                  <motion.path 
                    d="M60 44 Q63 38 60 32 T60 20" 
                    stroke="rgba(248, 223, 147, 0.4)" 
                    strokeWidth="1.2"
                    animate={{ y: [0, -8, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  />
                </svg>
                <p className={styles.revealStepHint}>Hương thơm lan tỏa trọn vẹn</p>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Copy Content */}
          <div className={styles.revealTextContent}>
            {stepsData.map((step) => {
              // We highlight the current step based on scroll
              return (
                <div key={step.num} className={styles.revealTextStep}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepNum}>{step.num}</span>
                    <span className={styles.stepTag}>{step.label}</span>
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.text}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
