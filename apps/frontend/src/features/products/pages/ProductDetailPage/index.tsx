import { ArrowLeft, ArrowRight, Check, QrCode } from "lucide-react";
import { useState } from "react";
import { EditorialSection } from "@shared/components/luxury/EditorialSection";
import { ImageReveal } from "@shared/components/luxury/ImageReveal";
import { LuxuryButton } from "@shared/components/luxury/LuxuryButton";
import { ProductStatement } from "@shared/components/luxury/ProductStatement";
import { SectionEyebrow } from "@shared/components/luxury/SectionEyebrow";
import { orderedLuxuryProducts, productLuxuryCopy } from "@features/content/luxuryCopy";
import { useLanguage, type Language } from "@app/providers/LanguageContext";
import { Link } from "@app/router/RouterContext";
import type { SenovaProduct } from "@features/products/data/products";
import { getImageAssetByPath } from "@features/content/imageManifest";
import { ImageStatusLabel } from "@shared/components/media/ImageStatusLabel";
import { ResponsiveImage } from "@shared/components/media/ResponsiveImage";
import { productTrustItems, servicePromise, trustStatusLabel } from "@features/content/trustContent";

type ProductDetailPageProps = {
  product?: SenovaProduct;
};

const detailCopy: Record<
  Language,
  {
    products: string;
    notFoundTitle: string;
    notFoundText: string;
    notFoundCta: string;
    configuration: string;
    addToBag: string;
    included: string;
    materials: string;
    ritual: string;
    culturalStory: string;
    related: string;
    preorderTitle: string;
    preorderText: string;
    preorder: string;
    qrTitle: string;
    qrText: string;
  }
> = {
  vi: {
    products: "Bộ sưu tập",
    notFoundTitle: "Trang sản phẩm đang được chuẩn bị.",
    notFoundText: "Mã đường dẫn này chưa có nội dung công khai. Bạn có thể quay về bộ sưu tập Senova.",
    notFoundCta: "Về trang sản phẩm",
    configuration: "Cấu hình",
    addToBag: "Gửi yêu cầu đặt trước",
    included: "Trong cấu hình này",
    materials: "Chất liệu và chi tiết",
    ritual: "Nghi thức sử dụng",
    culturalStory: "Câu chuyện văn hóa",
    related: "Sản phẩm liên quan",
    preorderTitle: "Đội ngũ Senova xác nhận trước khi chốt đơn.",
    preorderText:
      "Senova đang tiếp nhận yêu cầu đặt trước. Gửi thông tin để được tư vấn cấu hình, lịch giao và ghi chú quà tặng.",
    preorder: "Gửi yêu cầu đặt trước",
    qrTitle: "QR tiếp nối trải nghiệm vật lý.",
    qrText:
      "Sau khi mở sản phẩm, QR có thể đưa người dùng tới hướng dẫn, câu chuyện ngắn và biểu mẫu phản hồi.",
  },
  en: {
    products: "Collection",
    notFoundTitle: "This product page is being prepared.",
    notFoundText: "This route does not have public content yet. You can return to the Senova collection.",
    notFoundCta: "Back to products",
    configuration: "Configuration",
    addToBag: "Send preorder request",
    included: "Included",
    materials: "Materials and details",
    ritual: "Usage ritual",
    culturalStory: "Cultural story",
    related: "Related products",
    preorderTitle: "Concierge confirms before finalizing.",
    preorderText:
      "Senova currently works through inquiry and preorder. Send a request for configuration, delivery timing and gift notes.",
    preorder: "Send preorder request",
    qrTitle: "QR continues the physical experience.",
    qrText:
      "After opening the product, QR can lead clients to guidance, a short story and feedback.",
  },
};

function ProductNotFound() {
  const { language } = useLanguage();
  const copy = detailCopy[language];

  return (
    <EditorialSection>
      <div className="mx-auto max-w-[44rem] text-center">
        <SectionEyebrow>{copy.products}</SectionEyebrow>
        <h1 className="mt-4 mb-0 font-display text-[clamp(2.15rem,5.4vw,4.25rem)] font-[430] leading-[1.04] text-text">
          {copy.notFoundTitle}
        </h1>
        <p className="mt-5 mb-0 leading-[1.75] text-text-muted">{copy.notFoundText}</p>
        <div className="mt-8">
          <LuxuryButton href="/products">{copy.notFoundCta}</LuxuryButton>
        </div>
      </div>
    </EditorialSection>
  );
}

export default function ProductDetailPage({ product: baseProduct }: ProductDetailPageProps) {
  const { language } = useLanguage();
  const copy = detailCopy[language];
  const localizedProduct = baseProduct ? productLuxuryCopy[language][baseProduct.id] : undefined;
  const product =
    baseProduct && localizedProduct
      ? {
          ...localizedProduct,
          priceLabel: baseProduct.priceLabel,
          availability: baseProduct.availability,
          variants: baseProduct.variants,
          shippingNote: baseProduct.shippingNote,
        }
      : undefined;
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]?.id);

  if (!baseProduct || !product) {
    return <ProductNotFound />;
  }

  const selectedVariantData = product.variants.find((variant) => variant.id === selectedVariant) ?? product.variants[0];
  const enabledDeliveryScopes = selectedVariantData?.deliveryScopes?.filter((scope) => scope.enabled) ?? [];
  const unavailableStatuses = ["TEMPORARILY_UNAVAILABLE", "SOLD_OUT", "DISCONTINUED"];
  const canPreorder =
    selectedVariantData?.available !== false &&
    !unavailableStatuses.includes(baseProduct.commerce?.status ?? "PRE_ORDER");
  const relatedProducts = orderedLuxuryProducts.filter((productId) => productId !== baseProduct.id);
  const heroAsset = getImageAssetByPath(product.image);
  const trustItems = productTrustItems.filter((item) => item.productId === baseProduct.id);

  return (
    <article className="bg-[var(--page-bg)]">
      <section className="relative overflow-hidden bg-[var(--senova-forest-black)] px-6 pt-24 pb-18 text-text-inverse max-[760px]:px-4">
        <div className="mx-auto max-w-[var(--page-max)]">
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center gap-2 text-[0.88rem] font-[650] text-text-inverse-muted no-underline hover:text-text-inverse"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {copy.products}
          </Link>

          <div className="mt-10 grid grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.85fr)] items-center gap-[clamp(2rem,6vw,5rem)] max-[900px]:grid-cols-1">
            <div>
              <SectionEyebrow className="text-accent-gold">{product.eyebrow}</SectionEyebrow>
              <h1 className="mt-5 mb-0 max-w-[11ch] font-display text-[clamp(2.55rem,6.2vw,5.1rem)] font-[420] leading-[1.04]">
                {product.name}
              </h1>
              <p className="mt-5 mb-0 font-display text-[clamp(1.35rem,3vw,2.1rem)] font-[430] leading-[1.18] text-accent-gold">
                {product.tagline}
              </p>
              <p className="mt-5 mb-0 max-w-[38rem] text-[1.04rem] leading-[1.8] text-text-inverse-muted">
                {product.description}
              </p>

              <div className="mt-8 grid max-w-[34rem] gap-4 border border-[rgba(243,239,229,0.14)] bg-[rgba(243,239,229,0.045)] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-display text-[1.65rem] text-accent-gold">{product.priceLabel}</span>
                  <span className="text-[0.78rem] uppercase tracking-[0.16em] text-text-inverse-soft">
                    {product.availability}
                  </span>
                </div>
                <div className="grid gap-3">
                  <SectionEyebrow className="text-accent-gold">{copy.configuration}</SectionEyebrow>
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      className={`min-h-11 border p-3 text-left transition-colors ${
                        selectedVariant === variant.id
                          ? "border-accent-gold bg-[rgba(175,149,88,0.16)]"
                          : "border-[rgba(243,239,229,0.16)] bg-transparent"
                      }`}
                      onClick={() => setSelectedVariant(variant.id)}
                    >
                      <span className="block font-[650] text-text-inverse">{variant.label}</span>
                      <span className="text-[0.86rem] text-text-inverse-muted">{variant.note}</span>
                    </button>
                  ))}
                </div>
                <div className="grid gap-2 border-t border-[rgba(243,239,229,0.14)] pt-4 text-[0.88rem] text-text-inverse-muted">
                  <p className="m-0">
                    Thời gian chuẩn bị: {selectedVariantData?.preparationTime
                      ? `${selectedVariantData.preparationTime.min}–${selectedVariantData.preparationTime.max} ngày làm việc`
                      : "Senova sẽ xác nhận sau khi nhận yêu cầu"}
                  </p>
                  <p className="m-0">
                    Phạm vi giao hàng: {enabledDeliveryScopes.length
                      ? enabledDeliveryScopes.map((scope) => scope.label).join(", ")
                      : "Xác nhận theo sản phẩm"}
                  </p>
                  {selectedVariantData?.preparationTime?.isAssumption ? (
                    <p className="m-0 text-[0.78rem] text-accent-gold">Thông tin dự kiến, đang được kiểm chứng.</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {canPreorder ? (
                  <LuxuryButton
                    href={`/order-request?product=${baseProduct.id}&variant=${selectedVariant}&quantity=1&intent=personal&source=product-detail`}
                    variant="dark"
                  >
                    {copy.addToBag}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </LuxuryButton>
                ) : (
                  <span className="inline-flex min-h-11 items-center border border-[rgba(243,239,229,0.3)] px-5 text-sm text-text-inverse-muted">
                    Tạm ngừng nhận đặt trước
                  </span>
                )}
                <LuxuryButton href={`/experience/${baseProduct.id}`} variant="light">
                  {language === "vi" ? "Xem nghi thức sử dụng" : "View usage ritual"}
                </LuxuryButton>
              </div>
            </div>

            <div className="relative">
              <ImageReveal
                src={product.image}
                alt={product.heroAlt}
                className="aspect-[4/5] border-[rgba(243,239,229,0.16)] bg-[rgba(243,239,229,0.04)]"
                imageClassName="object-cover"
                loading="eager"
              />
              {heroAsset ? <ImageStatusLabel asset={heroAsset} language={language} /> : null}
            </div>
          </div>
        </div>
      </section>

      <EditorialSection>
        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-[clamp(2rem,6vw,5rem)] max-[900px]:grid-cols-1">
          <ProductStatement eyebrow={product.role} title={product.tagline} text={product.shortDescription} />
          <div className="grid gap-5">
            {product.highlights.map((highlight) => (
              <div key={highlight} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 border-t border-border py-4">
                <Check aria-hidden="true" className="mt-1 h-4 w-4 text-accent-strong" />
                <p className="m-0 leading-[1.7] text-text-muted">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </EditorialSection>

      <EditorialSection className="bg-[var(--surface)]">
        <div className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1">
          <section className="border border-border bg-[var(--surface-paper)] p-6">
            <SectionEyebrow>{copy.included}</SectionEyebrow>
            <ul className="mt-6 mb-0 grid list-none gap-4 p-0">
              {product.includedItems.map((item) => (
                <li key={item} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 text-text-muted">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 text-[var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-border bg-[var(--surface-paper)] p-6">
            <SectionEyebrow>{copy.materials}</SectionEyebrow>
            <div className="mt-6 grid gap-5">
              {product.materialNotes.map((note) => (
                <article key={note.title} className="border-t border-border pt-4">
                  <h2 className="m-0 font-display text-[1.55rem] font-[430] text-[var(--accent)]">
                    {note.title}
                  </h2>
                  <p className="mt-2 mb-0 leading-[1.7] text-text-muted">{note.text}</p>
                </article>
              ))}
              <p className="m-0 border-t border-border pt-4 leading-[1.7] text-text-muted">{product.dimensions}</p>
            </div>
          </section>
        </div>
      </EditorialSection>

      <EditorialSection>
        <ProductStatement
          eyebrow={language === "vi" ? "Bằng chứng & trạng thái" : "Evidence & status"}
          title={language === "vi" ? "Thông tin được công bố theo mức độ xác nhận." : "Information is published with an explicit confidence level."}
          text={language === "vi" ? "Các chi tiết đang kiểm chứng hoặc hoàn thiện không được trình bày như cam kết thương mại cuối cùng." : "Items under validation or development are not presented as final commercial claims."}
        />
        <div className="mt-9 grid grid-cols-2 gap-px border border-border bg-border max-[720px]:grid-cols-1">
          {trustItems.map((item) => (
            <article key={item.id} className="bg-[var(--surface-paper)] p-6">
              <span className="text-[0.72rem] font-[700] uppercase tracking-[0.12em] text-accent-strong">{trustStatusLabel[language][item.status]}</span>
              <h2 className="mt-4 mb-0 text-[0.88rem] font-[650] text-text-muted">{item.label[language]}</h2>
              <p className="mt-2 mb-0 font-display text-[1.5rem] leading-[1.3]">{item.value[language]}</p>
            </article>
          ))}
          <article className="bg-[var(--surface-paper)] p-6">
            <span className="text-[0.72rem] font-[700] uppercase tracking-[0.12em] text-accent-strong">{language === "vi" ? "Dịch vụ" : "Service"}</span>
            <h2 className="mt-4 mb-0 text-[0.88rem] font-[650] text-text-muted">{language === "vi" ? "Cam kết phản hồi" : "Response promise"}</h2>
            <p className="mt-2 mb-0 font-display text-[1.5rem] leading-[1.3]">{servicePromise.responseTime[language]}</p>
          </article>
          <article className="bg-[var(--surface-paper)] p-6">
            <span className="text-[0.72rem] font-[700] uppercase tracking-[0.12em] text-accent-strong">{language === "vi" ? "Xác nhận đơn" : "Order confirmation"}</span>
            <h2 className="mt-4 mb-0 text-[0.88rem] font-[650] text-text-muted">{servicePromise.preparationTime[language]}</h2>
            <p className="mt-2 mb-0 leading-[1.7] text-text">{servicePromise.paymentMethod[language]}</p>
          </article>
        </div>
      </EditorialSection>

      <EditorialSection>
        <ProductStatement eyebrow={copy.ritual} title={product.tagline} text={product.culturalNote} />
        <div className="mt-10 grid grid-cols-4 gap-5 max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
          {product.experienceSteps.map((step, index) => (
            <article key={step.title} className="grid min-h-[15rem] content-between border-t border-border-strong py-5">
              <span className="font-display text-[1.7rem] text-accent-strong">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="m-0 text-[1.08rem] font-[650] text-[var(--accent)]">{step.title}</h2>
                <p className="mt-3 mb-0 text-[0.95rem] leading-[1.7] text-text-muted">{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection className="bg-[var(--surface)]">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 border border-border bg-[var(--surface-paper)] p-6 max-[900px]:grid-cols-1">
          <QrCode aria-hidden="true" className="h-10 w-10 text-accent-strong" />
          <div>
            <SectionEyebrow>{copy.culturalStory}</SectionEyebrow>
            <h2 className="mt-3 mb-0 font-display text-[clamp(1.8rem,4vw,3rem)] font-[430] text-text">
              {copy.qrTitle}
            </h2>
            <p className="mt-3 mb-0 leading-[1.75] text-text-muted">{copy.qrText}</p>
          </div>
          <LuxuryButton href={`/experience/${baseProduct.id}`} variant="primary">
            {product.primaryAction.label}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </LuxuryButton>
        </div>
      </EditorialSection>

      <EditorialSection>
        <ProductStatement
          eyebrow={copy.related}
          title={language === "vi" ? "Những nhịp còn lại trong hệ Senova." : "The remaining rhythms in Senova."}
          text={
            language === "vi"
              ? "Mỗi dòng sản phẩm đảm nhiệm một vai trò khác nhau trong cùng câu chuyện trà sen."
              : "Each product line holds a different role within the same lotus tea story."
          }
        />
        <div className="mt-10 grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
          {relatedProducts.map((productId) => {
            const related = productLuxuryCopy[language][productId];
            const relatedAsset = getImageAssetByPath(related.image);

            return (
              <Link
                key={productId}
                href={`/products/${productId}`}
                className="grid overflow-hidden border border-border bg-[var(--surface-paper)] text-text no-underline shadow-[var(--shadow-luxury-sm)]"
              >
                {relatedAsset ? (
                  <ResponsiveImage
                    asset={relatedAsset}
                    alt={related.heroAlt}
                    className="aspect-[16/10] w-full object-cover saturate-[0.86]"
                    sizes="(max-width: 760px) 100vw, 50vw"
                  />
                ) : null}
                <div className="p-5">
                  <SectionEyebrow>{related.role}</SectionEyebrow>
                  <h2 className="mt-3 mb-0 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-[430] text-text">
                    {related.name}
                  </h2>
                  <p className="mt-3 mb-0 leading-[1.7] text-text-muted">{related.shortDescription}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </EditorialSection>

      <EditorialSection className="bg-[var(--senova-forest-black)] text-text-inverse">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-8 max-[760px]:grid-cols-1">
          <ProductStatement
            eyebrow={language === "vi" ? "Dịch vụ Senova" : "Concierge"}
            title={copy.preorderTitle}
            text={copy.preorderText}
            dark
          />
          <LuxuryButton href={`/order-request?product=${baseProduct.id}&source=product-detail-footer`} variant="dark">
            {copy.preorder}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </LuxuryButton>
        </div>
      </EditorialSection>

      {canPreorder ? (
        <div className="fixed inset-x-0 bottom-0 z-30 hidden items-center justify-between gap-3 border-t border-border bg-[var(--surface-strong)] px-4 py-3 shadow-brand-md max-[760px]:flex">
          <span className="min-w-0 truncate text-[0.82rem] font-[650] text-text">{product.name}</span>
          <LuxuryButton
            href={`/order-request?product=${baseProduct.id}&variant=${selectedVariant}&quantity=1&intent=personal&source=product-detail-sticky`}
            className="min-h-10 shrink-0 px-4 py-2"
          >
            {language === "vi" ? "Gửi yêu cầu" : "Send request"}
          </LuxuryButton>
        </div>
      ) : null}
    </article>
  );
}
