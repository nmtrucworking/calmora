import { ArrowRight } from "lucide-react";
import { EditorialSection } from "@shared/components/luxury/EditorialSection";
import { ImageReveal } from "@shared/components/luxury/ImageReveal";
import { LuxuryButton } from "@shared/components/luxury/LuxuryButton";
import { ProductStatement } from "@shared/components/luxury/ProductStatement";
import { SectionEyebrow } from "@shared/components/luxury/SectionEyebrow";
import { orderedLuxuryProducts, productLuxuryCopy } from "@features/content/luxuryCopy";
import { useLanguage } from "@app/providers/LanguageContext";
import { Link } from "@app/router/RouterContext";

export default function ProductsPage() {
  const { language } = useLanguage();
  const copy = {
    vi: {
      eyebrow: "Bộ sưu tập",
      title: "Petal Pack giữ vai trò biểu tượng của Senova.",
      text:
        "Ba dòng sản phẩm không chia đều như catalogue. Petal Pack là điểm nhận diện chính; Classic giữ nhịp trà hằng ngày; Gift Set đưa câu chuyện vào quà tặng.",
      signature: "Sản phẩm chủ đạo",
      explore: "Khám phá",
      preorder: "Đặt trước",
      compare: "Vai trò trong hệ sản phẩm",
      closingTitle: "Chọn một nhịp trà, hoặc bắt đầu bằng Petal Pack.",
      closingText:
        "Nếu chưa chắc cấu hình phù hợp, hãy gửi yêu cầu đặt trước để Senova tư vấn theo nhu cầu cá nhân, tasting hoặc quà tặng.",
    },
    en: {
      eyebrow: "Collection",
      title: "Petal Pack is Senova's signature.",
      text:
        "The three product lines are not treated as equal catalogue cards. Petal Pack is the main identity; Classic keeps the daily rhythm; Gift Set carries the story into gifting.",
      signature: "Signature product",
      explore: "Explore",
      preorder: "Pre-order",
      compare: "Role in the system",
      closingTitle: "Choose a tea rhythm, or begin with Petal Pack.",
      closingText:
        "If the right configuration is not clear yet, send a preorder request and Senova can advise for personal use, tasting or gifting.",
    },
  }[language];

  const petalPack = productLuxuryCopy[language]["petal-pack"];

  return (
    <div className="bg-[var(--page-bg)]">
      <section className="relative min-h-[min(43rem,100svh)] overflow-hidden bg-[var(--senova-forest-black)] px-6 pt-28 pb-14 text-text-inverse max-[760px]:px-4">
        <img
          src={petalPack.image}
          alt={petalPack.heroAlt}
          className="absolute inset-y-0 right-0 h-full w-[58%] object-cover opacity-68 saturate-[0.72] max-[900px]:w-full max-[900px]:opacity-36"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,26,22,0.94)_0%,rgba(16,26,22,0.7)_48%,rgba(16,26,22,0.18)_100%)]" />
        <div className="relative z-10 mx-auto grid min-h-[30.5rem] max-w-[var(--page-max)] items-end">
          <div className="max-w-[46rem]">
            <SectionEyebrow className="text-accent-gold">{copy.eyebrow}</SectionEyebrow>
            <h1 className="mt-5 mb-0 font-display text-[clamp(2.55rem,5.7vw,4.8rem)] font-[420] leading-[1.04]">
              {copy.title}
            </h1>
            <p className="mt-6 mb-0 max-w-[38rem] text-[1.05rem] leading-[1.8] text-text-inverse-muted">
              {copy.text}
            </p>
            <div className="mt-8 flex flex-wrap gap-5">
              <LuxuryButton href="/products/petal-pack" variant="dark">
                {copy.explore} Petal Pack
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </LuxuryButton>
              <LuxuryButton href="/order-request" variant="light">
                {copy.preorder}
              </LuxuryButton>
            </div>
          </div>
        </div>
      </section>

      <EditorialSection>
        <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] gap-[clamp(2rem,6vw,5rem)] max-[900px]:grid-cols-1">
          <ImageReveal
            src={petalPack.image}
            alt={petalPack.heroAlt}
            className="aspect-[4/5] max-h-[44rem]"
            loading="eager"
          />
          <div>
            <ProductStatement eyebrow={copy.signature} title={petalPack.name} text={petalPack.description} />
            <div className="mt-8 grid gap-4">
              {petalPack.highlights.map((highlight) => (
                <p key={highlight} className="m-0 border-t border-border py-4 leading-[1.7] text-text-muted">
                  {highlight}
                </p>
              ))}
            </div>
          </div>
        </div>
      </EditorialSection>

      <EditorialSection className="bg-[var(--surface)]">
        <div className="grid gap-10">
          <ProductStatement
            eyebrow={copy.compare}
            title={language === "vi" ? "Một biểu tượng, hai nhịp bổ trợ." : "One signature, two supporting rhythms."}
            text={
              language === "vi"
                ? "Collection được sắp xếp theo vai trò sử dụng thay vì ba ô thương mại bằng nhau."
                : "The collection is arranged by usage role rather than three equal commerce tiles."
            }
          />
          <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr] gap-5 max-[960px]:grid-cols-1">
            {orderedLuxuryProducts.map((productId) => {
              const product = productLuxuryCopy[language][productId];
              const isSignature = productId === "petal-pack";

              return (
                <Link
                  key={productId}
                  href={`/products/${productId}`}
                  className="group grid overflow-hidden border border-border bg-[var(--surface-paper)] text-text no-underline shadow-[var(--shadow-luxury-sm)]"
                >
                  <div className={isSignature ? "aspect-[16/10]" : "aspect-[4/3]"}>
                    <img
                      src={product.image}
                      alt={product.heroAlt}
                      className="h-full w-full object-cover saturate-[0.86] transition duration-[900ms] ease-[var(--ease-luxury)] group-hover:scale-[1.015]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="grid gap-8 p-6">
                    <div>
                      <span className="text-[0.72rem] font-[650] uppercase tracking-[0.22em] text-accent-strong">
                        {product.role}
                      </span>
                      <h2 className="mt-3 mb-0 font-display text-[clamp(1.7rem,3vw,2.8rem)] font-[430] leading-[1.04] text-text">
                        {product.name}
                      </h2>
                      <p className="mt-4 mb-0 leading-[1.7] text-text-muted">{product.shortDescription}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[0.86rem] font-[650] text-[var(--accent)]">
                      {copy.explore}
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </EditorialSection>

      <EditorialSection>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-8 max-[760px]:grid-cols-1">
          <ProductStatement eyebrow="Concierge" title={copy.closingTitle} text={copy.closingText} />
          <LuxuryButton href="/order-request" variant="primary">
            {copy.preorder}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </LuxuryButton>
        </div>
      </EditorialSection>
    </div>
  );
}
