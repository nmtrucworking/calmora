import { useEffect, useState, type FormEvent } from "react";
import { ClipboardCheck, ExternalLink, Send } from "lucide-react";
import { Link } from "../../contexts/RouterContext";
import { useRouter } from "../../contexts/RouterState";
import { trackEvent } from "../../features/analytics/analytics";
import { submitForm } from "../../features/forms/submissions";
import { getProductBySlug, products } from "../../features/products/data/products";
import { systemStyles as styles } from "../../styles/systemPageClasses";

const validationProducts = products.filter((product) =>
  ["petal-pack", "gift-set"].includes(product.slug),
);

const reportReferenceDate = "2026-06-27";

function getFieldValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function getCheckedValues(formData: FormData, field: string) {
  return formData
    .getAll(field)
    .filter((value): value is string => typeof value === "string")
    .join(", ");
}

export default function PreOrderPage() {
  const { navigate, search } = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestedProduct = new URLSearchParams(search).get("product") ?? "petal-pack";
  const selectedProduct = getProductBySlug(requestedProduct);
  const defaultProduct =
    selectedProduct && validationProducts.some((product) => product.slug === selectedProduct.slug)
      ? selectedProduct.slug
      : "petal-pack";

  useEffect(() => {
    trackEvent({ eventName: "sample_interest_start", source: defaultProduct });
  }, [defaultProduct]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      website: getFieldValue(formData, "website"),
      name: getFieldValue(formData, "name"),
      email: getFieldValue(formData, "email"),
      phone: getFieldValue(formData, "phone"),
      role: getFieldValue(formData, "role"),
      primaryProduct: getFieldValue(formData, "primaryProduct"),
      sampleFormat: getFieldValue(formData, "sampleFormat"),
      useCase: getFieldValue(formData, "useCase"),
      expectedQuantity: getFieldValue(formData, "expectedQuantity"),
      timeline: getFieldValue(formData, "timeline"),
      giftBudget: getFieldValue(formData, "giftBudget"),
      validationTopics: getCheckedValues(formData, "validationTopics"),
      petalPackQuestion: getFieldValue(formData, "petalPackQuestion"),
      giftSetQuestion: getFieldValue(formData, "giftSetQuestion"),
      evidenceConsent: getFieldValue(formData, "evidenceConsent"),
      message: getFieldValue(formData, "message"),
      campaign: "petal-pack-gift-set-validation",
      reportReferenceDate,
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.role ||
      !payload.primaryProduct ||
      !payload.sampleFormat ||
      !payload.useCase ||
      !payload.validationTopics ||
      !payload.evidenceConsent
    ) {
      setError(
        "Vui lòng điền thông tin liên hệ, vai trò, sản phẩm quan tâm, dạng mẫu thử và phần đồng ý sử dụng phản hồi ẩn danh.",
      );
      setIsSubmitting(false);
      return;
    }

    const result = await submitForm("sample-interest", payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? "Thông tin chưa thể gửi. Vui lòng thử lại.");
      return;
    }

    trackEvent({ eventName: "sample_interest_submit", source: payload.primaryProduct });
    navigate(`/thank-you?type=sample-interest&product=${payload.primaryProduct}`);
  }

  return (
    <article className={styles.page}>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <p className={styles.eyebrow}>Đăng ký mẫu thử / khảo sát</p>
          <h1>Góp dữ liệu kiểm chứng cho Petal Pack và Gift Set.</h1>
          <p className={styles.heroDescription}>
            Trang này ghi nhận người quan tâm dùng thử, góp ý ý tưởng quà tặng và cho phép Senova
            tổng hợp phản hồi ẩn danh để bổ sung vào báo cáo validation ngày 27/06/2026. Đây chưa
            phải giao dịch thanh toán hay cam kết giao hàng.
          </p>
          <div className={styles.actions}>
            <a className={styles.primaryButton} href="#sample-interest-form">
              Điền khảo sát
              <ClipboardCheck aria-hidden="true" />
            </a>
            <a className={styles.secondaryButton} href="mailto:hello@senova.vn?subject=Senova sample interest">
              Gửi qua email
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
        <aside className={styles.heroAside}>
          <strong>Petal Pack + Gift Set</strong>
          <p className={styles.bodyText}>
            Senova đang cần xác thực mức hấp dẫn của thao tác mở cánh sen, nhu cầu nhận mẫu thử,
            dịp tặng phù hợp và kỳ vọng về bộ quà.
          </p>
          <span className={styles.statusBadge}>Dữ liệu dùng ở dạng tổng hợp ẩn danh</span>
        </aside>
      </section>

      <section className={styles.formLayout}>
        <div className={styles.productStrip}>
          {validationProducts.map((product) => (
            <article className={styles.productCard} key={product.slug}>
              <div className={styles.productImage}>
                <img src={product.image} alt={product.heroAlt} loading="lazy" />
              </div>
              <div className={styles.productBody}>
                <span className={styles.panelLabel}>{product.role}</span>
                <h3>{product.name}</h3>
                <p className={styles.bodyText}>{product.shortDescription}</p>
                <Link className={styles.inlineLink} href={product.href}>
                  Xem chi tiết
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.formPanel} id="sample-interest-form">
          <p className={styles.eyebrow}>Phiếu ghi nhận validation</p>
          <h2>Đăng ký quan tâm mẫu thử</h2>
          <p className={styles.fieldHint}>
            Các trường dưới đây giúp nhóm Senova biết nên mời ai dùng thử, cần hỏi sâu phần nào và
            có đủ bằng chứng tổng hợp cho Petal Pack / Gift Set trong hồ sơ validation.
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.hiddenField}>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="name">Tên của bạn</label>
                <input id="name" name="name" autoComplete="name" required />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="phone">Số điện thoại</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="role">Bạn đăng ký với vai trò nào?</label>
                <select id="role" name="role" required defaultValue="">
                  <option value="" disabled>
                    Chọn vai trò
                  </option>
                  <option value="consumer">Người dùng cá nhân</option>
                  <option value="gift-buyer">Người mua quà tặng</option>
                  <option value="event-corporate">Doanh nghiệp / sự kiện</option>
                  <option value="retail-partner">Đối tác bán lẻ / phân phối</option>
                </select>
              </div>
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="primaryProduct">Sản phẩm muốn xác thực</label>
                <select id="primaryProduct" name="primaryProduct" defaultValue={defaultProduct} required>
                  {validationProducts.map((product) => (
                    <option value={product.slug} key={product.slug}>
                      {product.name}
                    </option>
                  ))}
                  <option value="petal-pack,gift-set">Cả Petal Pack và Gift Set</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="sampleFormat">Dạng tham gia mong muốn</label>
                <select id="sampleFormat" name="sampleFormat" required defaultValue="">
                  <option value="" disabled>
                    Chọn hình thức
                  </option>
                  <option value="sample-at-event">Nhận mẫu tại booth / sự kiện</option>
                  <option value="home-sample">Nhận mẫu thử tại nhà</option>
                  <option value="interview">Phỏng vấn nhanh 15 phút</option>
                  <option value="concept-review">Chỉ góp ý concept Gift Set</option>
                </select>
              </div>
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="useCase">Bối cảnh bạn sẽ dùng hoặc tặng</label>
                <select id="useCase" name="useCase" required defaultValue="">
                  <option value="" disabled>
                    Chọn bối cảnh
                  </option>
                  <option value="daily-ritual">Thưởng trà cá nhân</option>
                  <option value="small-gift">Quà nhỏ cho bạn bè / gia đình</option>
                  <option value="corporate-gift">Quà tri ân đối tác / khách hàng</option>
                  <option value="event-souvenir">Quà lưu niệm sự kiện</option>
                  <option value="tourism-cultural">Trải nghiệm du lịch / văn hóa</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="expectedQuantity">Số lượng quan tâm</label>
                <input
                  id="expectedQuantity"
                  name="expectedQuantity"
                  type="number"
                  min="1"
                  placeholder="Ví dụ: 5, 20, 100"
                />
              </div>
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="timeline">Thời điểm cần thông tin</label>
                <select id="timeline" name="timeline" defaultValue="">
                  <option value="">Chưa xác định</option>
                  <option value="july-2026">Trong tháng 07/2026</option>
                  <option value="q3-2026">Quý 3/2026</option>
                  <option value="q4-2026">Quý 4/2026</option>
                  <option value="later">Sau đó</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="giftBudget">Khoảng ngân sách quà tặng</label>
                <select id="giftBudget" name="giftBudget" defaultValue="">
                  <option value="">Chưa xác định</option>
                  <option value="under-150k">Dưới 150.000đ / phần</option>
                  <option value="150k-300k">150.000đ - 300.000đ / phần</option>
                  <option value="300k-500k">300.000đ - 500.000đ / phần</option>
                  <option value="over-500k">Trên 500.000đ / phần</option>
                </select>
              </div>
            </div>

            <fieldset className={styles.choiceGroup}>
              <legend>Senova nên dùng phản hồi của bạn để kiểm chứng điều gì?</legend>
              <label>
                <input name="validationTopics" type="checkbox" value="petal-opening" />
                <span>Thao tác mở cánh sen có đủ khác biệt và dễ hiểu không</span>
              </label>
              <label>
                <input name="validationTopics" type="checkbox" value="taste-aroma" />
                <span>Hương, vị và thời gian pha có phù hợp với kỳ vọng không</span>
              </label>
              <label>
                <input name="validationTopics" type="checkbox" value="gift-occasion" />
                <span>Gift Set có hợp với dịp tặng và người nhận cụ thể không</span>
              </label>
              <label>
                <input name="validationTopics" type="checkbox" value="story-qr" />
                <span>Nội dung QR / câu chuyện có làm món quà đáng nhớ hơn không</span>
              </label>
            </fieldset>

            <div className={styles.fieldGroup}>
              <label htmlFor="petalPackQuestion">Điều gì khiến bạn muốn hoặc chưa muốn thử Petal Pack?</label>
              <textarea id="petalPackQuestion" name="petalPackQuestion" />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="giftSetQuestion">Với Gift Set, bạn cần thấy rõ điều gì trước khi cân nhắc đặt?</label>
              <textarea id="giftSetQuestion" name="giftSetQuestion" />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="message">Ghi chú thêm cho nhóm Senova</label>
              <textarea id="message" name="message" />
            </div>

            <fieldset className={styles.choiceGroup}>
              <legend>Đồng ý sử dụng phản hồi</legend>
              <label>
                <input name="evidenceConsent" type="checkbox" value="anonymous-report-use" required />
                <span>
                  Tôi đồng ý để Senova tổng hợp phản hồi ở dạng ẩn danh, không công khai thông tin
                  cá nhân, cho hồ sơ validation và báo cáo ngày 27/06/2026.
                </span>
              </label>
            </fieldset>

            {error ? <p className={styles.errorText}>{error}</p> : null}
            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi đăng ký mẫu thử"}
              <Send aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </article>
  );
}
