import { brandNavigation, brandPrinciples, brandSummary } from "../../constants/brand";
import { InfoCard } from "../../components/ui/InfoCard";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { getSitePageContent, siteRoutes } from "../../routes/siteRoutes";
import styles from "./SitePage.module.css";
import { Link } from "../../contexts/RouterContext";
import { StaggerContainer, StaggerItem } from "../../components/ui/ZenMotion";

type SitePageProps = {
  path: string;
};

export default function SitePage({ path }: SitePageProps) {
  const content = getSitePageContent(path);

  return (
    <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <SectionHeading
              eyebrow={content.eyebrow}
              title={content.title}
              description={content.text}
            />
            <p className={styles.summary}>{brandSummary}</p>
            <div className={styles.actions}>
              <Link href="/" className={styles.primaryAction}>
                Về trang chủ
              </Link>
              <a href="mailto:hello@senova.vn" className={styles.secondaryAction}>
                Liên hệ thử nghiệm
              </a>
            </div>
          </div>

          <aside className={styles.heroPanel} aria-label="Tóm tắt định hướng thương hiệu">
            <p className={styles.panelKicker}>Giữ - Mở - Trao</p>
            <h2 className={styles.panelTitle}>Một mạch kể chung cho toàn bộ trải nghiệm Senova.</h2>
            <p className={styles.panelText}>
              Mỗi trang mở một lát cắt khác nhau, nhưng cùng trở về trà hương sen, thao tác trải nghiệm và câu chuyện được trao đi.
            </p>
            <StaggerContainer className={styles.principleList}>
              {brandPrinciples.map((principle) => (
                <StaggerItem key={principle.label}>
                  <InfoCard
                    label={principle.label}
                    title={principle.title}
                    text={principle.text}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </aside>
        </section>

        <section className={styles.catalog}>
          <SectionHeading
            eyebrow="Khám phá thêm"
            title="Tiếp tục hành trình Senova"
            description="Chọn một trang để đi sâu hơn vào sản phẩm, câu chuyện văn hóa hoặc nghi thức trải nghiệm."
            align="center"
          />
          <StaggerContainer className={styles.catalogGrid}>
            {brandNavigation.slice(1).map((item) => {
              const route = siteRoutes.find((entry) => entry.href === item.href);
              return (
                <StaggerItem key={item.href}>
                  <InfoCard
                    href={item.href}
                    label={item.label}
                    title={route?.title ?? item.label}
                    text={route?.text ?? "Mở trang để xem nội dung liên quan."}
                  />
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>
    </div>
  );
}
