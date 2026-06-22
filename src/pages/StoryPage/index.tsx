import { brandFooterGroups, brandNavigation } from "../../constants/brand";
import { SiteFrame } from "../../components/layout/SiteFrame";
import { InfoCard } from "../../components/ui/InfoCard";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { StoryLotusCanvas } from "../../components/story/StoryLotusCanvas";
import styles from "./StoryPage.module.css";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import content from "../../data/content.json";
import { StaggerContainer, StaggerItem } from "../../components/ui/ZenMotion";

export default function StoryPage() {
  const [restartSignal, setRestartSignal] = useState(0);
  const storyData = content.storyPage;

  return (
    <SiteFrame navItems={brandNavigation} footerGroups={brandFooterGroups}>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.copy}>
            <p className={styles.kicker}>{storyData.kicker}</p>
            <SectionHeading
              eyebrow={storyData.eyebrow}
              title={storyData.title}
              description={storyData.description}
            />
            <p className={styles.body}>{storyData.body}</p>

            <StaggerContainer className={styles.timeline} aria-label="Các giai đoạn của bông sen">
              {storyData.timeline.map((item) => (
                <StaggerItem key={item.label}>
                  <InfoCard
                    label={item.label}
                    title={item.title}
                    text={item.text}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <div className={styles.visualShell}>
            <div className={styles.visualFrame}>
              <StoryLotusCanvas className={styles.visualCanvas} restartSignal={restartSignal} />
            </div>
            <div className={styles.visualActions}>
              <button
                className={styles.restartBtn}
                aria-label="Khởi động lại hoạt cảnh"
                onClick={() => setRestartSignal((s) => s + 1)}
              >
                <RotateCw className={styles.restartIcon} />
                <span className={styles.restartText}>Khởi động lại</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </SiteFrame>
  );
}
