import { brandFooterGroups, brandNavigation, brandPrinciples, brandSummary } from "../../constants/brand";
import { SiteFrame } from "../../components/layout/SiteFrame";
import { InfoCard } from "../../components/ui/InfoCard";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { getSitePageContent, siteRoutes } from "../../routes/siteRoutes";
import styles from "./SitePage.module.css";

type SitePageProps = {
  path: string;
};

export default function SitePage({ path }: SitePageProps) {
  const content = getSitePageContent(path);

  return (
    <SiteFrame navItems={brandNavigation} footerGroups={brandFooterGroups}>
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
              <a href="/" className={styles.primaryAction}>
                Về trang chủ
              </a>
              <a href="mailto:hello@senova.vn" className={styles.secondaryAction}>
                Liên hệ thử nghiệm
              </a>
            </div>
          </div>

          <aside className={styles.heroPanel} aria-label="Tóm tắt định hướng thương hiệu">
            <p className={styles.panelKicker}>Brand system</p>
            <h2 className={styles.panelTitle}>Cùng một ngôn ngữ thị giác cho toàn website.</h2>
            <p className={styles.panelText}>
              Các trang ngoài landing sẽ dùng chung tone, nhịp chữ và khung tương tác để mở rộng an toàn.
            </p>
            <div className={styles.principleList}>
              {brandPrinciples.map((principle) => (
                <InfoCard
                  key={principle.label}
                  label={principle.label}
                  title={principle.title}
                  text={principle.text}
                />
              ))}
            </div>
          </aside>
        </section>

        <section className={styles.catalog}>
          <SectionHeading
            eyebrow="Lối đi"
            title="Các trang trong hệ thống"
            description="Thêm trang mới vào đây mà không phải đụng vào landing page hoặc khối 3D."
            align="center"
          />
          <div className={styles.catalogGrid}>
            {brandNavigation.slice(1).map((item) => {
              const route = siteRoutes.find((entry) => entry.href === item.href);
              return (
                <InfoCard
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  title={route?.title ?? item.label}
                  text={route?.text ?? "Mở trang để xem nội dung liên quan."}
                />
              );
            })}
          </div>
        </section>
      </div>
    </SiteFrame>
  );
}
