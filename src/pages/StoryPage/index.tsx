import { brandFooterGroups, brandNavigation } from "../../constants/brand";
import { SiteFrame } from "../../components/layout/SiteFrame";
import { InfoCard } from "../../components/ui/InfoCard";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { StoryLotusCanvas } from "../../components/story/StoryLotusCanvas";
import styles from "./StoryPage.module.css";

export default function StoryPage() {
  return (
    <SiteFrame navItems={brandNavigation} footerGroups={brandFooterGroups}>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Story / lotus sequence</p>
            <SectionHeading
              eyebrow="Câu chuyện"
              title="Từ búp đến tàn, bông sen tự kể nhịp thời gian của mình."
              description="Hero được giữ cố định trong tầm nhìn đầu tiên để người xem đọc được chuỗi chuyển động ngay lập tức, thay vì phải cuộn để hiểu câu chuyện."
            />
            <p className={styles.body}>
              Không gian này giữ một nhịp kể chậm và có kiểm soát. Lotus 3D chạy một vòng tự động qua
              búp, nở rồi tàn, giúp story page có chiều sâu mà vẫn tách biệt hoàn toàn khỏi landing.
            </p>

            <div className={styles.timeline} aria-label="Các giai đoạn của bông sen">
              <InfoCard
                label="01"
                title="Búp"
                text="Giữ cấu trúc khép, tối giản và tĩnh để mở màn bằng sự chờ đợi."
              />
              <InfoCard
                label="02"
                title="Nở"
                text="Cánh bung ra, ánh sáng mở rộng và tâm điểm của hero được đẩy lên cao nhất."
              />
              <InfoCard
                label="03"
                title="Tàn"
                text="Nhịp lắng xuống, để lại một kết thúc mềm và có ký ức thị giác rõ ràng."
              />
            </div>
          </div>

          <div className={styles.visualShell}>
            <div className={styles.visualFrame}>
              <StoryLotusCanvas className={styles.visualCanvas} />
            </div>
            <p className={styles.visualCaption}>
              Hoạt cảnh tự chạy, không phụ thuộc cuộn trang, và được cố định ở hero.
            </p>
          </div>
        </section>
      </div>
    </SiteFrame>
  );
}
