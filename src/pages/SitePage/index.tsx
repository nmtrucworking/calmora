import { landingContent } from "../../features/landing/content/landingContent";
import { Footer } from "../../features/landing/sections/Footer";
import { Header } from "../../features/landing/sections/Header";
import styles from "../../features/landing/SenovaLandingPage.module.css";

type SitePageProps = {
  path: string;
};

const pageMap: Record<string, { eyebrow: string; title: string; text: string }> = {
  "/products": {
    eyebrow: "Bộ sưu tập",
    title: "Trà sen trong hình hài mới.",
    text: "Không gian này sẽ giới thiệu các dòng trà, hộp quà và phiên bản mùa sen của Senova.",
  },
  "/story": {
    eyebrow: "Câu chuyện",
    title: "Từ hồ sen đến nghi thức trà.",
    text: "Trang câu chuyện dành cho nguồn cảm hứng, chất liệu bản địa và tinh thần thiết kế của Senova.",
  },
  "/ritual": {
    eyebrow: "Nghi thức",
    title: "Pha trà bằng nhịp chậm của sen.",
    text: "Trang nghi thức sẽ mô tả cách nhìn, mở, pha và chia sẻ trà sen như một trải nghiệm cảm quan.",
  },
  "/seasonal": {
    eyebrow: "Mùa sen",
    title: "Những phiên bản theo mùa.",
    text: "Nơi lưu giữ các concept giới hạn theo mùa nở, mùa thu hoạch và mùa quà tặng.",
  },
  "/contact": {
    eyebrow: "Liên hệ",
    title: "Bắt đầu một thử nghiệm với Senova.",
    text: "Gửi yêu cầu mẫu thử, đặt lịch trao đổi hoặc đề xuất hợp tác phát triển sản phẩm.",
  },
  "/partners": {
    eyebrow: "Hợp tác",
    title: "Cùng mở rộng giá trị của sen Việt.",
    text: "Trang dành cho đối tác nguyên liệu, sản xuất, phân phối và trải nghiệm thương hiệu.",
  },
};

export default function SitePage({ path }: SitePageProps) {
  const content = pageMap[path] ?? {
    eyebrow: "Senova",
    title: "Trang đang được chuẩn bị.",
    text: "Quay lại trang chủ để xem vòng đời hoa sen và trải nghiệm prototype hiện tại.",
  };

  return (
    <main className={`${styles.page} ${styles.sitePage}`}>
      <Header navItems={landingContent.nav} />
      <section className={styles.siteHero}>
        <p className={styles.heroEyebrow}>{content.eyebrow}</p>
        <h1 className={styles.siteTitle}>{content.title}</h1>
        <p className={styles.siteDescription}>{content.text}</p>
        <a href="/" className={styles.siteBackLink}>
          Về trang chủ
        </a>
      </section>
      <Footer content={landingContent.footer} />
    </main>
  );
}
