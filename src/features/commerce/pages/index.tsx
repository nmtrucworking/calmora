import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Gift,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  commerceText,
  getLocalizedProduct,
  getLocalizedProducts,
  type LocalizedCollection,
  type LocalizedJournalPost,
  type LocalizedPolicy,
  type LocalizedProduct,
  type LocalizedService,
} from "@features/content/i18n";
import { useLanguage } from "@app/providers/LanguageContext";
import { Link } from "@app/router/RouterContext";
import { useInquiryBag } from "@app/providers/InquiryBagContext";
import { useRouter } from "@app/router/RouterState";
import { products, type ProductId } from "@features/products/data/products";
import { submitForm } from "@shared/api/submissions";
import { luxuryMotion } from "@shared/styles/luxuryEffects";
import { cx } from "@shared/utils/classNames";

const pageClass = "grid gap-[clamp(2rem,5vw,4.5rem)]";
const eyebrowClass = "m-0 text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-accent-gold";
const heroClass =
  "grid min-h-[min(36rem,calc(100svh-8rem))] grid-cols-[minmax(0,1fr)_minmax(16rem,0.55fr)] items-end gap-[clamp(1.5rem,5vw,4rem)] pt-16 max-[900px]:min-h-0 max-[900px]:grid-cols-1 max-[900px]:pt-8";
const titleClass =
  "mt-[0.9rem] mb-0 max-w-[16ch] font-display text-[clamp(2.7rem,7vw,5.4rem)] font-[760] leading-none text-primary-strong";
const bodyClass = "text-base leading-[1.75] text-text-muted";
const panelClass = `rounded-lg p-[clamp(1.25rem,3vw,2rem)] ${luxuryMotion.surface}`;
const primaryButtonClass =
  `inline-flex min-h-[2.85rem] items-center justify-center gap-[0.55rem] rounded-full border border-primary bg-primary px-[1.1rem] py-3 text-[0.9rem] font-extrabold text-on-primary no-underline disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${luxuryMotion.button}`;
const secondaryButtonClass =
  `inline-flex min-h-[2.85rem] items-center justify-center gap-[0.55rem] rounded-full border border-border-strong bg-[#fffdf899] px-[1.1rem] py-3 text-[0.9rem] font-extrabold text-primary-strong no-underline ${luxuryMotion.button}`;
const fieldClass =
  `w-full rounded-lg border border-border-strong bg-[#fffdf8b8] px-[0.9rem] py-[0.78rem] text-text outline-none ${luxuryMotion.field}`;

function useCommerceCopy() {
  const { language } = useLanguage();
  return {
    language,
    text: commerceText[language],
    products: getLocalizedProducts(products, language),
  };
}

function ProductCard({ product, compact = false }: { product: LocalizedProduct; compact?: boolean }) {
  const { addItem } = useInquiryBag();
  const { text } = useCommerceCopy();
  const [saved, setSaved] = useState(false);

  return (
    <article className={cx("group grid overflow-hidden rounded-lg", luxuryMotion.surface, luxuryMotion.cardHover)}>
      <div className="relative grid aspect-[4/3] place-items-center bg-[radial-gradient(circle_at_50%_40%,rgba(179,38,93,0.1),transparent_42%),rgba(255,253,248,0.58)]">
        <button
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-border bg-[#fffdf8cc] text-accent-strong"
          type="button"
          aria-label={text.ui.saveProduct}
          onClick={() => setSaved((value) => !value)}
        >
          <Heart className={cx("h-4 w-4", saved && "fill-current")} />
        </button>
        <img
          src={product.image}
          alt={product.heroAlt}
          className="h-auto w-[min(72%,17rem)] object-contain drop-shadow-[0_22px_30px_rgba(37,31,21,0.14)]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="grid gap-4 p-5">
        <div>
          <p className={eyebrowClass}>{product.role}</p>
          <h3 className="mt-2 mb-0 font-display text-[clamp(1.45rem,3vw,2rem)] leading-[1.05] text-primary-strong">
            {product.name}
          </h3>
          <p className="mt-3 mb-0 text-[0.94rem] leading-[1.65] text-text-muted">
            {compact ? product.tagline : product.shortDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-[rgba(31,95,68,0.18)] bg-[rgba(31,114,74,0.07)] px-3 py-1 text-[0.72rem] font-extrabold text-primary-strong"
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4 max-[560px]:grid">
          <span className="text-[0.92rem] font-extrabold text-primary-strong">{product.priceLabel}</span>
          <div className="flex gap-2">
            <button
              type="button"
              className={cx("inline-flex h-10 items-center rounded-full border border-primary bg-primary px-4 text-[0.78rem] font-extrabold text-on-primary", luxuryMotion.button)}
              onClick={() => addItem({ productId: product.id, variantId: product.variants[0]?.id })}
            >
              {text.ui.addToBag}
            </button>
            <Link href={product.href} className={cx("grid h-10 w-10 place-items-center rounded-full border border-border-strong text-primary-strong", luxuryMotion.button)}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductGrid({ productIds }: { productIds?: ProductId[] }) {
  const { products: localizedProducts } = useCommerceCopy();
  const visibleProducts = productIds
    ? productIds.map((id) => localizedProducts.find((product) => product.id === id)).filter((product): product is LocalizedProduct => Boolean(product))
    : localizedProducts;

  return (
    <div className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[680px]:grid-cols-1">
      {visibleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function CollectionHero({ collection }: { collection?: LocalizedCollection }) {
  const { text } = useCommerceCopy();

  return (
    <section className={heroClass}>
      <div>
        <p className={eyebrowClass}>{collection?.eyebrow ?? text.ui.collectionsEyebrow}</p>
        <h1 className={titleClass}>{collection?.title ?? text.ui.collectionsTitle}</h1>
        <p className="mt-5 mb-0 max-w-[42rem] text-[clamp(1rem,2vw,1.15rem)] leading-[1.75] text-text-muted">
          {collection?.description ?? text.ui.collectionsDescription}
        </p>
      </div>
      <aside className={panelClass}>
        <p className={eyebrowClass}>{text.ui.clientNote}</p>
        <p className="m-0 font-display text-[1.45rem] leading-[1.45] text-primary-strong">
          {collection?.mood ?? text.ui.collectionMoodFallback}
        </p>
      </aside>
    </section>
  );
}

export function CollectionsPage() {
  const { text } = useCommerceCopy();

  return (
    <article className={pageClass}>
      <CollectionHero />
      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4 max-[680px]:grid">
          <div>
            <p className={eyebrowClass}>{text.ui.edits}</p>
            <h2 className="mt-2 mb-0 font-display text-[clamp(2rem,4vw,3.4rem)] leading-none text-primary-strong">
              {text.ui.chooseMoment}
            </h2>
          </div>
          <Link href="/gifting" className={secondaryButtonClass}>
            {text.ui.giftingConcierge}
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
          {text.collections.map((collection) => (
            <Link key={collection.slug} href={`/collections/${collection.slug}`} className={cx(panelClass, "text-inherit no-underline")}>
              <p className={eyebrowClass}>{collection.eyebrow}</p>
              <h3 className="mt-3 mb-0 font-display text-[1.7rem] leading-[1.08] text-primary-strong">{collection.title}</h3>
              <p className={bodyClass}>{collection.mood}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-5">
        <p className={eyebrowClass}>{text.ui.allProducts}</p>
        <ProductGrid />
      </section>
    </article>
  );
}

export function CollectionDetailPage({ slug }: { slug: string }) {
  const { text } = useCommerceCopy();
  const collection = text.collections.find((item) => item.slug === slug) ?? text.collections[0];

  return (
    <article className={pageClass}>
      <CollectionHero collection={collection} />
      <section className="grid gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={eyebrowClass}>{text.ui.curatedSelection}</p>
          <div className="flex gap-2 text-[0.78rem] font-extrabold text-text-soft">
            <span className="rounded-full border border-border px-3 py-2">{text.ui.availability}</span>
            <span className="rounded-full border border-border px-3 py-2">{text.ui.ritual}</span>
            <span className="rounded-full border border-border px-3 py-2">{text.ui.gifting}</span>
          </div>
        </div>
        <ProductGrid productIds={collection.productIds} />
      </section>
    </article>
  );
}

export function SearchPage() {
  const { search } = useRouter();
  const { text, products: localizedProducts } = useCommerceCopy();
  const query = new URLSearchParams(search).get("q")?.toLowerCase() ?? "";
  const [term, setTerm] = useState(query);
  const results = localizedProducts.filter((product) =>
    [product.name, product.role, product.shortDescription, ...product.badges].join(" ").toLowerCase().includes(term),
  );

  return (
    <article className={pageClass}>
      <section className={heroClass}>
        <div>
          <p className={eyebrowClass}>{text.ui.search}</p>
          <h1 className={titleClass}>{text.ui.searchTitle}</h1>
        </div>
        <label className={cx(panelClass, "grid gap-3")}>
          <span className={eyebrowClass}>{text.ui.keyword}</span>
          <span className="flex items-center gap-3">
            <Search className="h-5 w-5 text-primary" />
            <input className={fieldClass} value={term} onChange={(event) => setTerm(event.target.value.toLowerCase())} placeholder="petal, gift, classic..." />
          </span>
        </label>
      </section>
      <ProductGrid productIds={results.map((product) => product.id)} />
    </article>
  );
}

export function WishlistPage() {
  const { text } = useCommerceCopy();
  const wishlist: ProductId[] = ["petal-pack", "gift-set"];

  return (
    <article className={pageClass}>
      <section className={heroClass}>
        <div>
          <p className={eyebrowClass}>{text.ui.wishlist}</p>
          <h1 className={titleClass}>{text.ui.wishlistTitle}</h1>
          <p className={bodyClass}>{text.ui.wishlistNote}</p>
        </div>
        <aside className={panelClass}>
          <Heart className="h-8 w-8 text-accent-strong" />
          <p className={bodyClass}>{text.ui.wishlistAside}</p>
        </aside>
      </section>
      <ProductGrid productIds={wishlist} />
    </article>
  );
}

function BagLine({ productId, quantity }: { productId: ProductId; quantity: number }) {
  const { language } = useLanguage();
  const { text } = useCommerceCopy();
  const baseProduct = products.find((item) => item.id === productId);
  const product = baseProduct ? getLocalizedProduct(baseProduct, language) : undefined;
  const { updateItem, removeItem } = useInquiryBag();

  if (!product) return null;

  return (
    <article className="grid grid-cols-[8rem_minmax(0,1fr)_auto] gap-4 rounded-lg border border-border bg-surface-strong p-4 max-[680px]:grid-cols-1">
      <img src={product.image} alt={product.heroAlt} className="h-28 w-28 object-contain" />
      <div>
        <p className={eyebrowClass}>{product.role}</p>
        <h3 className="mt-1 mb-0 font-display text-[1.45rem] text-primary-strong">{product.name}</h3>
        <p className="mt-2 mb-0 text-[0.9rem] text-text-muted">{product.priceLabel}</p>
      </div>
      <div className="grid content-between justify-items-end gap-4 max-[680px]:justify-items-start">
        <div className="flex items-center gap-2">
          <button className="grid h-9 w-9 place-items-center rounded-full border border-border" type="button" onClick={() => updateItem(productId, { quantity: quantity - 1 })}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-8 text-center font-extrabold">{quantity}</span>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-border" type="button" onClick={() => updateItem(productId, { quantity: quantity + 1 })}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button className="inline-flex items-center gap-2 text-[0.82rem] font-extrabold text-accent-strong" type="button" onClick={() => removeItem(productId)}>
          <Trash2 className="h-4 w-4" />
          {text.ui.remove}
        </button>
      </div>
    </article>
  );
}

export function BagPage() {
  const { items } = useInquiryBag();
  const { text } = useCommerceCopy();

  return (
    <article className={pageClass}>
      <section className={heroClass}>
        <div>
          <p className={eyebrowClass}>{text.ui.inquiryBag}</p>
          <h1 className={titleClass}>{text.ui.bagTitle}</h1>
          <p className={bodyClass}>{text.ui.bagDescription}</p>
        </div>
        <aside className={panelClass}>
          <ShoppingBag className="h-8 w-8 text-primary" />
          <p className={bodyClass}>{items.length ? `${items.length} ${text.ui.bagCount}` : text.ui.bagEmpty}</p>
        </aside>
      </section>
      {items.length ? (
        <section className="grid grid-cols-[minmax(0,1fr)_20rem] items-start gap-5 max-[900px]:grid-cols-1">
          <div className="grid gap-3">
            {items.map((item) => (
              <BagLine key={item.productId} productId={item.productId} quantity={item.quantity} />
            ))}
          </div>
          <aside className={cx(panelClass, "sticky top-28 grid gap-4")}>
            <p className={eyebrowClass}>{text.ui.nextStep}</p>
            <p className={bodyClass}>{text.ui.nextStepText}</p>
            <Link href="/checkout" className={primaryButtonClass}>
              {text.ui.continueInquiry}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      ) : (
        <section className={cx(panelClass, "text-center")}>
          <h2 className="mt-0 font-display text-[2rem] text-primary-strong">{text.ui.bagEmpty}</h2>
          <Link href="/collections" className={primaryButtonClass}>{text.ui.exploreCollections}</Link>
        </section>
      )}
    </article>
  );
}

export function CheckoutPage() {
  const { items, clearBag } = useInquiryBag();
  const { navigate, search } = useRouter();
  const { language } = useLanguage();
  const { text } = useCommerceCopy();
  const intent = new URLSearchParams(search).get("intent") ?? "preorder";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    await submitForm("pre-order", {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      intent,
      notes: String(form.get("notes") ?? ""),
      itemCount: items.length,
    });
    clearBag();
    navigate("/checkout/thank-you");
  };

  return (
    <article className={pageClass}>
      <section className={heroClass}>
        <div>
          <p className={eyebrowClass}>{text.ui.checkoutEyebrow}</p>
          <h1 className={titleClass}>{text.ui.checkoutTitle}</h1>
          <p className={bodyClass}>{text.ui.checkoutDescription}</p>
        </div>
        <aside className={panelClass}>
          <p className={eyebrowClass}>{text.ui.intent}</p>
          <p className="m-0 font-display text-[1.6rem] text-primary-strong">{intent}</p>
        </aside>
      </section>
      <section className="grid grid-cols-[minmax(0,1fr)_22rem] items-start gap-5 max-[900px]:grid-cols-1">
        <form className={cx(panelClass, "grid gap-4")} onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 max-[680px]:grid-cols-1">
            <label className="grid gap-2">
              <span className={eyebrowClass}>{text.ui.name}</span>
              <input className={fieldClass} name="name" required />
            </label>
            <label className="grid gap-2">
              <span className={eyebrowClass}>{text.ui.phone}</span>
              <input className={fieldClass} name="phone" required />
            </label>
          </div>
          <label className="grid gap-2">
            <span className={eyebrowClass}>{text.ui.email}</span>
            <input className={fieldClass} name="email" type="email" required />
          </label>
          <label className="grid gap-2">
            <span className={eyebrowClass}>{text.ui.notesLabel}</span>
            <textarea className={cx(fieldClass, "min-h-36 resize-y")} name="notes" placeholder={text.ui.notesPlaceholder} />
          </label>
          <button className={primaryButtonClass} type="submit" disabled={isSubmitting}>
            {isSubmitting ? text.ui.submitting : text.ui.submitInquiry}
          </button>
        </form>
        <aside className={cx(panelClass, "grid gap-4")}>
          <p className={eyebrowClass}>{text.ui.review}</p>
          {items.length ? (
            items.map((item) => {
              const baseProduct = products.find((product) => product.id === item.productId);
              const product = baseProduct ? getLocalizedProduct(baseProduct, language) : undefined;
              return product ? <p key={item.productId} className="m-0 text-[0.95rem] font-bold text-primary-strong">{item.quantity} x {product.name}</p> : null;
            })
          ) : (
            <p className={bodyClass}>{text.ui.emptyCheckout}</p>
          )}
        </aside>
      </section>
    </article>
  );
}

export function CheckoutThankYouPage() {
  const { text } = useCommerceCopy();

  return (
    <section className={cx(panelClass, "mx-auto my-16 max-w-[48rem] text-center")}>
      <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
      <p className={eyebrowClass}>{text.ui.inquiryReceived}</p>
      <h1 className="font-display text-[clamp(2rem,5vw,4rem)] leading-none text-primary-strong">{text.ui.thankYouTitle}</h1>
      <p className={bodyClass}>{text.ui.thankYouText}</p>
      <Link href="/account/orders" className={primaryButtonClass}>{text.ui.viewMockStatus}</Link>
    </section>
  );
}

export function ServicePage({ content }: { content: LocalizedService }) {
  const { text } = useCommerceCopy();

  return (
    <article className={pageClass}>
      <section className={heroClass}>
        <div>
          <p className={eyebrowClass}>{content.eyebrow}</p>
          <h1 className={titleClass}>{content.title}</h1>
          <p className={bodyClass}>{content.description}</p>
          <div className="mt-7">
            <Link href={content.ctaHref} className={primaryButtonClass}>{content.ctaLabel}</Link>
          </div>
        </div>
        <aside className={panelClass}>
          <Gift className="h-8 w-8 text-accent-strong" />
          <p className={bodyClass}>{text.ui.serviceAside}</p>
        </aside>
      </section>
      <section className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
        {content.blocks.map((block) => (
          <article key={block.title} className={panelClass}>
            <h2 className="mt-0 font-display text-[1.7rem] text-primary-strong">{block.title}</h2>
            <p className={bodyClass}>{block.text}</p>
          </article>
        ))}
      </section>
    </article>
  );
}

export function PolicyPage({ content }: { content: LocalizedPolicy }) {
  return (
    <article className={pageClass}>
      <section className="max-w-[48rem] pt-16">
        <p className={eyebrowClass}>{content.eyebrow}</p>
        <h1 className={titleClass}>{content.title}</h1>
        <p className={bodyClass}>{content.description}</p>
      </section>
      <section className="grid gap-3">
        {content.blocks.map((block) => (
          <article key={block.title} className={panelClass}>
            <h2 className="m-0 text-[1.25rem] text-primary-strong">{block.title}</h2>
            <p className={bodyClass}>{block.text}</p>
          </article>
        ))}
      </section>
    </article>
  );
}

export function AccountPage({ view = "overview" }: { view?: "overview" | "orders" | "wishlist" }) {
  const { text } = useCommerceCopy();
  const isOrders = view === "orders";
  const isWishlist = view === "wishlist";

  return (
    <article className={pageClass}>
      <section className={heroClass}>
        <div>
          <p className={eyebrowClass}>{text.ui.accountEyebrow}</p>
          <h1 className={titleClass}>{isOrders ? text.ui.accountOrdersTitle : isWishlist ? text.ui.accountWishlistTitle : text.ui.accountOverviewTitle}</h1>
          <p className={bodyClass}>{text.account.note}</p>
        </div>
        <aside className={panelClass}>
          <UserRound className="h-8 w-8 text-primary" />
          <h2 className="m-0 font-display text-[1.6rem] text-primary-strong">{text.account.profileName}</h2>
          <p className="m-0 text-text-muted">{text.account.tier}</p>
        </aside>
      </section>
      {isWishlist ? (
        <ProductGrid productIds={["petal-pack", "gift-set"]} />
      ) : (
        <section className="grid gap-3">
          {text.account.orders.map((order) => (
            <article key={order.id} className={cx(panelClass, "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 max-[680px]:grid-cols-1")}>
              <div>
                <p className={eyebrowClass}>{order.id}</p>
                <h2 className="mt-2 mb-0 font-display text-[1.7rem] text-primary-strong">{order.title}</h2>
                <p className={bodyClass}>{order.status}</p>
              </div>
              <div className="text-right max-[680px]:text-left">
                <p className="m-0 font-bold text-primary-strong">{order.date}</p>
                <p className="m-0 text-sm text-text-muted">{order.totalLabel}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </article>
  );
}

export function OrderStatusPage() {
  const { text } = useCommerceCopy();

  return (
    <article className={pageClass}>
      <section className={heroClass}>
        <div>
          <p className={eyebrowClass}>{text.ui.orderStatus}</p>
          <h1 className={titleClass}>{text.ui.orderStatusTitle}</h1>
          <p className={bodyClass}>{text.ui.orderStatusDescription}</p>
        </div>
        <aside className={panelClass}>
          <PackageCheck className="h-8 w-8 text-primary" />
          <p className={bodyClass}>{text.ui.orderStatusAside}</p>
        </aside>
      </section>
      <section className={cx(panelClass, "grid gap-3")}>
        <label className="grid gap-2">
          <span className={eyebrowClass}>{text.ui.inquiryCode}</span>
          <input className={fieldClass} defaultValue="SNV-2601-018" />
        </label>
        <div className="grid grid-cols-3 gap-3 max-[680px]:grid-cols-1">
          {["Received", "Concierge review", "Configuration proposal"].map((step, index) => (
            <div key={step} className="rounded-lg border border-border bg-[#fffdf86b] p-4">
              <CalendarDays className="h-5 w-5 text-accent-gold" />
              <p className="mb-0 font-bold text-primary-strong">{index + 1}. {step}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

export function JournalPage({ slug }: { slug?: string }) {
  const { text } = useCommerceCopy();
  const post = slug ? text.journalPosts.find((item) => item.slug === slug) : undefined;

  if (post) {
    return (
      <article className={pageClass}>
        <section className="max-w-[50rem] pt-16">
          <p className={eyebrowClass}>{post.eyebrow}</p>
          <h1 className={titleClass}>{post.title}</h1>
          <p className={bodyClass}>{post.excerpt}</p>
          <Link href={post.relatedHref} className={primaryButtonClass}>{text.ui.relatedPage}</Link>
        </section>
        <section className={panelClass}>
          <p className={bodyClass}>{text.ui.journalMock}</p>
        </section>
      </article>
    );
  }

  return (
    <article className={pageClass}>
      <section className={heroClass}>
        <div>
          <p className={eyebrowClass}>{text.ui.journal}</p>
          <h1 className={titleClass}>{text.ui.journalTitle}</h1>
        </div>
      </section>
      <section className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
        {text.journalPosts.map((item: LocalizedJournalPost) => (
          <Link key={item.slug} href={`/journal/${item.slug}`} className={cx(panelClass, "text-inherit no-underline")}>
            <p className={eyebrowClass}>{item.eyebrow}</p>
            <h2 className="font-display text-[1.7rem] leading-[1.1] text-primary-strong">{item.title}</h2>
            <p className={bodyClass}>{item.excerpt}</p>
            <span className="text-[0.78rem] font-extrabold text-accent-gold">{item.readTime}</span>
          </Link>
        ))}
      </section>
    </article>
  );
}
