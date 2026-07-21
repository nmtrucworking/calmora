import type { BrandFooterGroup, BrandNavItem } from "@features/content/brand";
import type { Language } from "@app/providers/LanguageContext";
import type { ProductId, SenovaProduct } from "@features/products/data/products";
import type { SeoContent } from "./sitePages";

type ProductCopy = Pick<
  SenovaProduct,
  | "name"
  | "eyebrow"
  | "tagline"
  | "description"
  | "shortDescription"
  | "priceLabel"
  | "availability"
  | "variants"
  | "includedItems"
  | "dimensions"
  | "brewingNotes"
  | "shippingNote"
  | "giftOptions"
  | "badges"
  | "heroAlt"
  | "suitableFor"
  | "highlights"
  | "experienceSteps"
  | "seo"
> & {
  role: string;
  primaryAction: SenovaProduct["primaryAction"];
  secondaryAction?: SenovaProduct["secondaryAction"];
  batchLabel?: string;
};

export type LocalizedProduct = Omit<
  SenovaProduct,
  | "role"
  | "primaryAction"
  | "secondaryAction"
  | keyof Pick<
      ProductCopy,
      | "name"
      | "eyebrow"
      | "tagline"
      | "description"
      | "shortDescription"
      | "priceLabel"
      | "availability"
      | "variants"
      | "includedItems"
      | "dimensions"
      | "brewingNotes"
      | "shippingNote"
      | "giftOptions"
      | "badges"
      | "heroAlt"
      | "suitableFor"
      | "highlights"
      | "experienceSteps"
      | "seo"
    >
> &
  ProductCopy;

export type LocalizedCollection = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  productIds: ProductId[];
  mood: string;
};

export type LocalizedService = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  blocks: { title: string; text: string }[];
};

export type LocalizedPolicy = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  blocks: { title: string; text: string }[];
};

export type LocalizedJournalPost = {
  slug: string;
  eyebrow: string;
  title: string;
  excerpt: string;
  readTime: string;
  relatedHref: string;
};

const productCopy: Record<Language, Record<ProductId, ProductCopy>> = {
  vi: {
    classic: {
      name: "Senova Classic",
      eyebrow: "GIỮ / Nghi thức hằng ngày",
      role: "Giữ",
      tagline: "Giữ hương sen trong nhịp sống mỗi ngày.",
      description:
        "Dòng trà hương sen nền tảng, được trình bày trong hình thức thuận tiện để người dùng có thể pha và thưởng thức thường xuyên.",
      shortDescription: "Dành cho những khoảng lặng có thể lặp lại mỗi ngày.",
      priceLabel: "Liên hệ để nhận giá dự kiến",
      availability: "Mở danh sách đặt trước theo lô nhỏ",
      variants: [
        { id: "daily-box", label: "Hộp 12 gói", note: "Nhịp thưởng trà hằng ngày" },
        { id: "trial-set", label: "Bộ thử 3 gói", note: "Dành cho lần chạm đầu tiên" },
      ],
      includedItems: [
        "Trà hương sen định lượng từng lần pha",
        "Thẻ hướng dẫn pha ngắn gọn",
        "Bao bì giấy mỹ thuật có niêm phong",
      ],
      dimensions: "Hộp 12 x 8 x 5 cm, phù hợp kệ trà hoặc bàn làm việc",
      brewingNotes: ["Dùng 180 ml nước nóng", "Chờ 4-5 phút", "Thưởng thức khi hương sen vừa mở"],
      shippingNote: "Dự kiến giao trong 3-5 ngày làm việc sau khi đội ngũ Senova xác nhận.",
      giftOptions: ["Thêm thiệp lời nhắn", "Gói giấy lụa", "Lên lịch giao theo ngày"],
      badges: ["Everyday ritual", "Single serve", "Preorder"],
      primaryAction: { label: "Mở trải nghiệm Classic", href: "/experience/classic" },
      secondaryAction: { label: "Đăng ký đặt trước", href: "/order-request?product=classic" },
      heroAlt: "Hộp trà hương sen Senova Classic",
      suitableFor: [
        "Sử dụng hằng ngày",
        "Khoảng nghỉ tại nhà hoặc nơi làm việc",
        "Người mới bắt đầu tiếp cận trà hương sen",
        "Người muốn duy trì một nhịp thưởng trà đơn giản",
      ],
      highlights: [
        "Phần trà được định lượng cho một lần pha",
        "Thao tác sử dụng gọn và dễ hình thành thói quen",
        "Hương sen được đặt trong trải nghiệm thưởng trà chậm, không cầu kỳ",
        "Là điểm vào phù hợp cho người mới tiếp cận Senova",
      ],
      experienceSteps: [
        { title: "Mở gói", text: "Lấy một phần trà đã được định lượng, giữ thao tác gọn và sạch." },
        { title: "Pha trà", text: "Đặt phần trà vào cốc và thực hiện theo hướng dẫn in trên bao bì." },
        { title: "Giữ một khoảng chậm", text: "Dành thời gian để hương sen và vị trà dần hiện ra trước khi thưởng thức." },
      ],
      seo: {
        title: "Senova Classic | Senova by Calmora",
        description: "Senova Classic giữ trà hương sen trong một hình thức dễ tiếp cận cho nhịp thưởng trà hằng ngày.",
      },
    },
    "petal-pack": {
      name: "Senova Petal Pack",
      eyebrow: "MỞ / Trải nghiệm chủ đạo",
      role: "Mở",
      tagline: "Mở một cánh sen, bắt đầu một khoảng lặng.",
      description:
        "Phần trà cho một lần pha, đặt trong túi lọc và được bao quanh bởi cánh sen sấy tạo hình búp sen.",
      shortDescription:
        "Phần trà một ly trong hình dáng búp sen, biến thao tác pha trà thành trải nghiệm giác quan.",
      priceLabel: "Liên hệ để nhận giá dự kiến",
      availability: "Lô trải nghiệm PP-2601-A đang nhận inquiry",
      variants: [
        { id: "petal-single", label: "Set 6 Petal Pack", note: "Trải nghiệm cá nhân" },
        { id: "petal-hosting", label: "Set 18 Petal Pack", note: "Cho tasting và booth" },
      ],
      includedItems: [
        "Petal Pack tạo hình búp sen",
        "Trà túi lọc một ly",
        "Thẻ QR câu chuyện và phản hồi",
        "Hướng dẫn nghi thức mở - pha",
      ],
      dimensions: "Mỗi Petal Pack được bảo quản trong khay riêng, hộp 18 x 12 x 7 cm",
      brewingNotes: ["Tách nhẹ cánh sen để thưởng hương", "Pha nguyên búp sen theo thông số hiển thị", "Chờ trà chiết xuất rồi thưởng thức"],
      shippingNote: "Hàng thử nghiệm được đội ngũ Senova xác nhận lịch giao và điều kiện bảo quản.",
      giftOptions: ["Thiệp cá nhân hóa", "QR lời nhắn", "Gói riêng từng khách mời"],
      badges: ["Signature experience", "QR story", "Limited batch"],
      primaryAction: { label: "Bắt đầu trải nghiệm", href: "/experience/petal-pack" },
      secondaryAction: { label: "Gửi phản hồi", href: "/feedback/petal-pack" },
      batchLabel: "Lô thử nghiệm PP-2601-A",
      heroAlt: "Senova Petal Pack tạo hình búp sen với phần trà bên trong",
      suitableFor: [
        "Người muốn trải nghiệm một hình thức thưởng trà mới",
        "Hoạt động giới thiệu sản phẩm tại booth hoặc sự kiện",
        "Người quan tâm thiết kế, chất liệu và câu chuyện văn hóa",
        "Quà tặng nhỏ có tính trải nghiệm",
      ],
      highlights: [
        "Một phần trà tương ứng với một lần pha",
        "Cánh sen tạo hình búp trở thành điểm chạm trực quan của sản phẩm",
        "Thao tác mở gói được thiết kế như bước đầu của trải nghiệm",
        "Nội dung QR tiếp nối câu chuyện sau khi người dùng cầm sản phẩm",
      ],
      experienceSteps: [
        { title: "Tách nhẹ cánh sen", text: "Tách nhẹ phần cánh bên ngoài để thưởng hương, không mở rời toàn bộ búp." },
        { title: "Cảm nhận", text: "Dành một khoảnh khắc để nhìn hình dáng, chất liệu và hương trước khi rót nước." },
        { title: "Pha trà", text: "Đặt phần trà vào cốc và thực hiện theo hướng dẫn in trên bao bì." },
        { title: "Chờ", text: "Để hương và vị dần hiện ra. Trang QR có thể cung cấp câu chuyện ngắn trong lúc đợi." },
        { title: "Thưởng thức", text: "Quan sát màu nước, cảm nhận hương vị, rồi ghi lại phản hồi về trải nghiệm." },
      ],
      seo: {
        title: "Senova Petal Pack | Senova by Calmora",
        description:
          "Senova Petal Pack mở trải nghiệm trà hương sen bằng hình dáng búp sen, thao tác cảm nhận và nội dung QR.",
      },
    },
    "gift-set": {
      name: "Senova Gift Set",
      eyebrow: "TRAO / Quà tặng văn hóa",
      role: "Trao",
      tagline: "Trao hương sen, gửi một lời trân trọng.",
      description:
        "Bộ quà dự kiến kết hợp trà hương sen, Petal Pack, hướng dẫn pha và thẻ câu chuyện trong một hành trình trao tặng thống nhất.",
      shortDescription:
        "Bộ quà trà sen kết hợp sản phẩm, trải nghiệm và câu chuyện văn hóa trong một hành trình hoàn chỉnh.",
      priceLabel: "Báo giá theo cấu hình quà tặng",
      availability: "Nhận tư vấn corporate và seasonal gifting",
      variants: [
        { id: "gift-personal", label: "Personal Gift Set", note: "Quà tặng cá nhân cao cấp" },
        { id: "gift-corporate", label: "Corporate Edition", note: "Cấu hình cho đối tác và sự kiện" },
      ],
      includedItems: [
        "Senova Classic",
        "Senova Petal Pack",
        "Thẻ câu chuyện và hướng dẫn pha",
        "Hộp quà cứng có lời nhắn",
      ],
      dimensions: "Hộp quà 28 x 20 x 9 cm, có thể điều chỉnh theo cấu hình doanh nghiệp",
      brewingNotes: ["Bắt đầu bằng lời nhắn", "Chọn Classic hoặc Petal Pack", "Dùng QR để tiếp tục câu chuyện"],
      shippingNote: "Concierge xác nhận số lượng, ngày giao, tên người nhận và lời nhắn trước khi chốt đơn.",
      giftOptions: ["Đóng dấu logo đối tác", "Thiệp song ngữ", "Giao nhiều địa chỉ", "Phiên bản theo mùa"],
      badges: ["Gifting", "Corporate", "Custom quote"],
      primaryAction: { label: "Đăng ký nhận thông tin", href: "/order-request?product=gift-set" },
      secondaryAction: { label: "Liên hệ tư vấn", href: "/contact?topic=gift-set" },
      heroAlt: "Bộ quà trà sen Senova Gift Set",
      suitableFor: ["Quà tri ân", "Quà lưu niệm", "Quà đối tác", "Phiên bản theo mùa"],
      highlights: [
        "Kết hợp sản phẩm, trải nghiệm và nội dung văn hóa trong một chỉnh thể",
        "Có thể điều chỉnh lời nhắn và nội dung QR theo dịp trao tặng",
        "Phù hợp với quà tri ân, quà lưu niệm, quà đối tác và phiên bản theo mùa",
        "Người nhận có thể tiếp tục chia sẻ câu chuyện sau khi thưởng thức",
      ],
      experienceSteps: [
        { title: "Mở hộp", text: "Tiếp cận từng thành phần theo một trình tự rõ ràng." },
        { title: "Đọc lời nhắn", text: "Nhận biết dụng ý của người trao và câu chuyện Giữ - Mở - Trao." },
        { title: "Chọn trải nghiệm", text: "Bắt đầu với Classic hoặc Petal Pack tùy nhịp thưởng trà." },
        { title: "Tiếp tục câu chuyện", text: "Dùng thẻ hoặc QR để đọc thêm và chia sẻ lại ý nghĩa của món quà." },
      ],
      seo: {
        title: "Senova Gift Set | Senova by Calmora",
        description:
          "Senova Gift Set là phiên bản quà tặng đang hoàn thiện, kết nối trà hương sen, lời nhắn và câu chuyện văn hóa.",
      },
    },
  },
  en: {
    classic: {
      name: "Senova Classic",
      eyebrow: "KEEP / Everyday ritual",
      role: "Keep",
      tagline: "Keep lotus tea within the rhythm of every day.",
      description:
        "The foundational lotus tea line, presented in an easy format for regular brewing and quiet daily use.",
      shortDescription: "For repeatable pauses that can belong to any day.",
      priceLabel: "From VND 320,000",
      availability: "Small-batch preorder list open",
      variants: [
        { id: "daily-box", label: "Box of 12 sachets", note: "Everyday tea rhythm" },
        { id: "trial-set", label: "3-sachet trial set", note: "For the first touchpoint" },
      ],
      includedItems: [
        "Portioned lotus tea for single brews",
        "Concise brewing guide",
        "Sealed fine-paper packaging",
      ],
      dimensions: "12 x 8 x 5 cm box, suitable for a tea shelf or desk",
      brewingNotes: ["Use 180 ml hot water", "Steep for 4-5 minutes", "Enjoy as the lotus note opens"],
      shippingNote: "Estimated delivery in 3-5 business days after concierge confirmation.",
      giftOptions: ["Add a message card", "Tissue wrapping", "Schedule delivery by date"],
      badges: ["Everyday ritual", "Single serve", "Preorder"],
      primaryAction: { label: "Open the Classic experience", href: "/experience/classic" },
      secondaryAction: { label: "Join preorder", href: "/order-request?product=classic" },
      heroAlt: "Senova Classic lotus tea box",
      suitableFor: [
        "Daily use",
        "Quiet breaks at home or work",
        "Newcomers to lotus tea",
        "Clients who want a simple tea rhythm",
      ],
      highlights: [
        "Tea is portioned for a single brew",
        "A compact routine that is easy to repeat",
        "Lotus aroma is framed as a slow, unfussy tasting moment",
        "A natural entry point into Senova",
      ],
      experienceSteps: [
        { title: "Open", text: "Take one portioned tea sachet and keep the gesture clean and simple." },
        { title: "Brew", text: "Place the tea in a cup and follow the guide printed on the package." },
        { title: "Hold the pause", text: "Give the lotus aroma and tea body time to unfold before drinking." },
      ],
      seo: {
        title: "Senova Classic | Senova by Calmora",
        description: "Senova Classic keeps lotus tea in an approachable form for an everyday tea ritual.",
      },
    },
    "petal-pack": {
      name: "Senova Petal Pack",
      eyebrow: "OPEN / Signature experience",
      role: "Open",
      tagline: "Open a lotus petal, begin a quiet pause.",
      description:
        "A single-brew tea portion in a filter sachet, wrapped by dried lotus petals shaped into a lotus bud.",
      shortDescription:
        "A single-cup tea ritual in the shape of a lotus bud, turning brewing into a tactile experience.",
      priceLabel: "From VND 480,000",
      availability: "Trial batch PP-2601-A is open for inquiry",
      variants: [
        { id: "petal-single", label: "Set of 6 Petal Packs", note: "Personal tasting" },
        { id: "petal-hosting", label: "Set of 18 Petal Packs", note: "For tasting sessions and booths" },
      ],
      includedItems: [
        "Lotus-bud Petal Pack",
        "Single-cup tea filter",
        "QR story and feedback card",
        "Open-and-brew ritual guide",
      ],
      dimensions: "Each Petal Pack is protected in its own tray, 18 x 12 x 7 cm box",
      brewingNotes: ["Open each lotus layer", "Use 200 ml hot water", "Steep for 5 minutes and scan the QR while waiting"],
      shippingNote: "Trial stock is scheduled and handled after concierge review.",
      giftOptions: ["Personalized card", "QR message", "Individually wrapped guest pieces"],
      badges: ["Signature experience", "QR story", "Limited batch"],
      primaryAction: { label: "Begin the experience", href: "/experience/petal-pack" },
      secondaryAction: { label: "Share feedback", href: "/feedback/petal-pack" },
      batchLabel: "Trial batch PP-2601-A",
      heroAlt: "Senova Petal Pack shaped as a lotus bud with tea inside",
      suitableFor: [
        "Clients seeking a new tea experience",
        "Product introductions at booths or events",
        "Design, material and culture-led gifting",
        "Small experiential gifts",
      ],
      highlights: [
        "One tea portion corresponds to one brew",
        "The lotus-bud form becomes a visual touchpoint",
        "The opening gesture is designed as the first step of the experience",
        "QR content continues the story after the product is in hand",
      ],
      experienceSteps: [
        { title: "Open the petals", text: "Gently open each layer to observe the structure before brewing." },
        { title: "Notice", text: "Pause to take in the shape, material and aroma before pouring water." },
        { title: "Brew", text: "Place the tea in a cup and follow the guide printed on the package." },
        { title: "Wait", text: "Let the aroma and body appear. The QR story can accompany this short wait." },
        { title: "Taste", text: "Observe the liquor, taste slowly, and leave feedback on the experience." },
      ],
      seo: {
        title: "Senova Petal Pack | Senova by Calmora",
        description:
          "Senova Petal Pack opens a lotus tea experience through a lotus-bud form, tactile ritual and QR storytelling.",
      },
    },
    "gift-set": {
      name: "Senova Gift Set",
      eyebrow: "GIVE / Cultural gifting",
      role: "Give",
      tagline: "Give lotus aroma with a considered message.",
      description:
        "A gift concept combining lotus tea, Petal Pack, brewing guidance and story cards in one composed gifting journey.",
      shortDescription:
        "A lotus tea gift set that joins product, experience and cultural storytelling in a complete gesture.",
      priceLabel: "Quoted by gifting configuration",
      availability: "Corporate and seasonal gifting consultation open",
      variants: [
        { id: "gift-personal", label: "Personal Gift Set", note: "Premium personal gifting" },
        { id: "gift-corporate", label: "Corporate Edition", note: "Configured for partners and events" },
      ],
      includedItems: ["Senova Classic", "Senova Petal Pack", "Story and brewing card", "Rigid gift box with message"],
      dimensions: "28 x 20 x 9 cm gift box, adjustable for corporate configurations",
      brewingNotes: ["Begin with the message", "Choose Classic or Petal Pack", "Use the QR to continue the story"],
      shippingNote: "Concierge confirms quantity, delivery date, recipient names and messages before production.",
      giftOptions: ["Partner logo mark", "Bilingual card", "Multi-address delivery", "Seasonal edition"],
      badges: ["Gifting", "Corporate", "Custom quote"],
      primaryAction: { label: "Request information", href: "/order-request?product=gift-set" },
      secondaryAction: { label: "Contact concierge", href: "/contact?topic=gift-set" },
      heroAlt: "Senova Gift Set lotus tea gift box",
      suitableFor: ["Appreciation gifts", "Souvenirs", "Partner gifting", "Seasonal editions"],
      highlights: [
        "Combines product, experience and cultural content in one composition",
        "Message and QR content can be adjusted by occasion",
        "Suitable for appreciation, souvenirs, partner gifts and seasonal editions",
        "Recipients can continue the story after tasting",
      ],
      experienceSteps: [
        { title: "Open the box", text: "Move through each component in a clear sequence." },
        { title: "Read the message", text: "Recognize the giver's intent and the Keep - Open - Give story." },
        { title: "Choose the ritual", text: "Begin with Classic or Petal Pack depending on the desired rhythm." },
        { title: "Continue the story", text: "Use the card or QR to read more and share the gift's meaning." },
      ],
      seo: {
        title: "Senova Gift Set | Senova by Calmora",
        description:
          "Senova Gift Set is a developing gifting edition that connects lotus tea, message cards and cultural storytelling.",
      },
    },
  },
};

export function getLocalizedProduct(product: SenovaProduct, language: Language): LocalizedProduct {
  return { ...product, ...productCopy[language][product.id] };
}

export function getLocalizedProducts(products: SenovaProduct[], language: Language): LocalizedProduct[] {
  return products.map((product) => getLocalizedProduct(product, language));
}

export const brandText: Record<
  Language,
  {
    summary: string;
    navigation: BrandNavItem[];
    footerGroups: BrandFooterGroup[];
    navAria: string;
    mobileNavAria: string;
    footerAria: string;
    bagLabel: string;
    menuOpen: string;
    menuClose: string;
    inquiryCta: string;
    languageToggle: string;
  }
> = {
  vi: {
    summary: "Senova là hệ trà sen theo mô hình concierge và preorder, dành cho trải nghiệm cá nhân, gifting và tasting riêng.",
    navigation: [
      { label: "Trang chủ", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: "Sản phẩm", href: "/products" },
      { label: "Gifting", href: "/gifting" },
      { label: "Concierge", href: "/concierge" },
      { label: "Journal", href: "/journal" },
      { label: "Client Care", href: "/faq" },
    ],
    footerGroups: [
      {
        title: "Commerce",
        links: [
          { label: "Collections", href: "/collections" },
          { label: "Signature edit", href: "/collections/signature" },
          { label: "Wishlist", href: "/wishlist" },
          { label: "Inquiry bag", href: "/bag" },
        ],
      },
      {
        title: "Luxury services",
        links: [
          { label: "Gifting", href: "/gifting" },
          { label: "Corporate gifting", href: "/corporate-gifting" },
          { label: "Concierge", href: "/concierge" },
          { label: "Private tasting", href: "/private-tasting" },
        ],
      },
      {
        title: "Client care",
        links: [
          { label: "Giao hàng", href: "/shipping" },
          { label: "Đổi trả", href: "/returns" },
          { label: "FAQ", href: "/faq" },
          { label: "Chăm sóc sản phẩm", href: "/care" },
        ],
      },
      {
        title: "Senova",
        links: [
          { label: "Câu chuyện", href: "/story" },
          { label: "Nghi thức", href: "/ritual" },
          { label: "Journal", href: "/journal" },
          { label: "Chính sách dữ liệu", href: "/privacy" },
        ],
      },
    ],
    navAria: "Điều hướng chính",
    mobileNavAria: "Điều hướng di động",
    footerAria: "Điều hướng chân trang",
    bagLabel: "Bag",
    menuOpen: "Mở menu",
    menuClose: "Đóng menu",
    inquiryCta: "Gửi inquiry",
    languageToggle: "Chuyển sang tiếng Anh",
  },
  en: {
    summary: "Senova is a concierge and preorder lotus tea house for personal rituals, gifting and private tasting.",
    navigation: [
      { label: "Home", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: "Products", href: "/products" },
      { label: "Gifting", href: "/gifting" },
      { label: "Concierge", href: "/concierge" },
      { label: "Journal", href: "/journal" },
      { label: "Client Care", href: "/faq" },
    ],
    footerGroups: [
      {
        title: "Commerce",
        links: [
          { label: "Collections", href: "/collections" },
          { label: "Signature edit", href: "/collections/signature" },
          { label: "Wishlist", href: "/wishlist" },
          { label: "Inquiry bag", href: "/bag" },
        ],
      },
      {
        title: "Luxury services",
        links: [
          { label: "Gifting", href: "/gifting" },
          { label: "Corporate gifting", href: "/corporate-gifting" },
          { label: "Concierge", href: "/concierge" },
          { label: "Private tasting", href: "/private-tasting" },
        ],
      },
      {
        title: "Client care",
        links: [
          { label: "Shipping", href: "/shipping" },
          { label: "Returns", href: "/returns" },
          { label: "FAQ", href: "/faq" },
          { label: "Product care", href: "/care" },
        ],
      },
      {
        title: "Senova",
        links: [
          { label: "Story", href: "/story" },
          { label: "Ritual", href: "/ritual" },
          { label: "Journal", href: "/journal" },
          { label: "Privacy", href: "/privacy" },
        ],
      },
    ],
    navAria: "Primary navigation",
    mobileNavAria: "Mobile navigation",
    footerAria: "Footer navigation",
    bagLabel: "Bag",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    inquiryCta: "Send inquiry",
    languageToggle: "Switch to Vietnamese",
  },
};

export const commerceText: Record<
  Language,
  {
    collections: LocalizedCollection[];
    services: Record<string, LocalizedService>;
    policies: Record<string, LocalizedPolicy>;
    journalPosts: LocalizedJournalPost[];
    ui: Record<string, string>;
    account: {
      profileName: string;
      tier: string;
      note: string;
      orders: { id: string; title: string; status: string; date: string; totalLabel: string }[];
    };
    seo: Record<string, SeoContent>;
  }
> = {
  vi: {
    collections: [
      {
        slug: "signature",
        eyebrow: "Signature collection",
        title: "Những chạm đầu tiên của Senova.",
        description:
          "Bộ sưu tập nền tảng gồm Classic, Petal Pack và Gift Set, được sắp xếp theo hành trình Giữ - Mở - Trao.",
        productIds: ["classic", "petal-pack", "gift-set"],
        mood: "Dành cho khách lần đầu chạm vào ngôn ngữ trà sen Senova.",
      },
      {
        slug: "gifting",
        eyebrow: "Gifting edit",
        title: "Quà tặng có lời nhắn và nghi thức.",
        description:
          "Những cấu hình phù hợp tri ân, đối tác, sự kiện và những ngày cần một món quà có chiều sâu.",
        productIds: ["gift-set", "petal-pack"],
        mood: "Ưu tiên bao bì, lời nhắn, lịch giao và trải nghiệm người nhận.",
      },
      {
        slug: "daily-ritual",
        eyebrow: "Daily ritual",
        title: "Khoảng lặng có thể lặp lại mỗi ngày.",
        description:
          "Những sản phẩm để duy trì thói quen thưởng trà gọn, đẹp và có thể bắt đầu ở bất cứ nơi nào.",
        productIds: ["classic", "petal-pack"],
        mood: "Phù hợp bàn làm việc, nhà riêng và private tasting nhỏ.",
      },
    ],
    services: {
      "/gifting": {
        path: "/gifting",
        eyebrow: "Dịch vụ quà tặng",
        title: "Trao hương sen như một lời nhắn được chuẩn bị kỹ.",
        description:
          "Trang gợi ý quà tặng cá nhân, thiệp lời nhắn, bao bì và lịch giao cho những dịp cần sự trang trọng.",
        ctaLabel: "Gửi yêu cầu quà tặng",
        ctaHref: "/order-request?intent=gifting",
        blocks: [
          { title: "Lời nhắn", text: "Thêm lời nhắn riêng, QR câu chuyện hoặc thiệp song ngữ." },
          { title: "Trình bày món quà", text: "Gói giấy lụa, niêm phong và cấu hình hộp theo người nhận." },
          { title: "Thời điểm giao", text: "Đội ngũ Senova xác nhận ngày giao và điều kiện bảo quản trước khi chốt." },
        ],
      },
      "/corporate-gifting": {
        path: "/corporate-gifting",
        eyebrow: "Quà tặng doanh nghiệp",
        title: "Quà tặng đối tác có câu chuyện và khả năng cá nhân hóa.",
        description: "Dành cho doanh nghiệp, sự kiện và chương trình tri ân cần một ngôn ngữ quà tặng tinh tế.",
        ctaLabel: "Lên cấu hình doanh nghiệp",
        ctaHref: "/partners?topic=corporate-gifting",
        blocks: [
          { title: "Yêu cầu số lượng lớn", text: "Ghi nhận số lượng, ngân sách, nhóm người nhận và thời điểm giao." },
          { title: "Cá nhân hóa", text: "Tùy biến lời nhắn, ngôn ngữ, QR và dấu ấn thương hiệu đối tác." },
          { title: "Rà soát cấu hình", text: "Mỗi cấu hình được đội ngũ Senova rà soát trước khi sản xuất." },
        ],
      },
      "/concierge": {
        path: "/concierge",
        eyebrow: "Tư vấn riêng",
        title: "Một điểm chạm riêng cho khách hàng cần được tư vấn.",
        description: "Đội ngũ Senova hỗ trợ chọn sản phẩm, cấu hình quà tặng, lịch thử trà và thông tin lô thử nghiệm.",
        ctaLabel: "Đặt lịch tư vấn",
        ctaHref: "/order-request?intent=concierge",
        blocks: [
          { title: "Hướng dẫn chọn sản phẩm", text: "Chọn Classic, Petal Pack hay Gift Set theo người nhận và dịp tặng." },
          { title: "Hỗ trợ riêng", text: "Liên hệ qua email hoặc điện thoại trước khi xác nhận yêu cầu." },
          { title: "Chăm sóc sau trải nghiệm", text: "Hướng dẫn bảo quản, pha trà và tiếp nhận phản hồi sau trải nghiệm." },
        ],
      },
      "/private-tasting": {
        path: "/private-tasting",
        eyebrow: "Buổi thử trà riêng",
        title: "Đặt một khoảng thử trà riêng cho nhóm nhỏ.",
        description:
          "Biểu mẫu đặt lịch thử trà cho cá nhân, đối tác hoặc sự kiện nhỏ, tập trung vào nghi thức mở - pha - kể chuyện.",
        ctaLabel: "Yêu cầu lịch thử trà",
        ctaHref: "/order-request?intent=private-tasting",
        blocks: [
          { title: "Hình thức", text: "30-45 phút, tối ưu cho 4-12 khách mời." },
          { title: "Sản phẩm", text: "Thử Classic, mở Petal Pack và xem cấu hình Gift Set." },
          { title: "Sau buổi thử trà", text: "Gửi tóm tắt cấu hình phù hợp sau buổi trải nghiệm." },
        ],
      },
    },
    policies: {
      "/shipping": {
        path: "/shipping",
        eyebrow: "Chăm sóc giao hàng",
        title: "Giao hàng được xác nhận như một phần của trải nghiệm.",
        description: "Senova chưa mở thanh toán tự động; mọi lịch giao được đội ngũ Senova xác nhận.",
        blocks: [
          { title: "Thời gian", text: "Đơn cá nhân dự kiến 3-5 ngày làm việc sau khi xác nhận." },
          { title: "Quà tặng", text: "Đơn quà tặng có thể lên lịch giao theo ngày và ghi chú người nhận." },
          { title: "Bảo quản", text: "Sản phẩm được đóng gói để giảm ảnh hưởng nhiệt và ẩm trong quá trình giao." },
        ],
      },
      "/returns": {
        path: "/returns",
        eyebrow: "Đổi trả",
        title: "Đổi trả cần được xử lý bình tĩnh và rõ ràng.",
        description: "Chính sách cho giai đoạn đặt trước, ưu tiên liên hệ đội ngũ Senova trước khi xử lý.",
        blocks: [
          { title: "Sản phẩm lỗi", text: "Ghi nhận hình ảnh, mã lô và tình trạng đóng gói để được hỗ trợ." },
          { title: "Gift Set", text: "Đơn cá nhân hóa sẽ được xác nhận điều kiện đổi trả trước khi sản xuất." },
          { title: "Hoàn tiền", text: "Chưa áp dụng thanh toán online; điều kiện hoàn tiền sẽ được cập nhật khi mở bán thật." },
        ],
      },
      "/faq": {
        path: "/faq",
        eyebrow: "Câu hỏi thường gặp",
        title: "Những câu hỏi thường gặp trước khi gửi inquiry.",
        description: "Các câu trả lời ngắn gọn về đặt trước, Gift Set, QR và tasting.",
        blocks: [
          { title: "Senova đã bán chính thức chưa?", text: "Website hiện ở giai đoạn concierge + preorder, chưa checkout thanh toán online." },
          { title: "Có thể đặt Gift Set doanh nghiệp không?", text: "Có. Hãy gửi yêu cầu corporate gifting để được cấu hình số lượng và lời nhắn." },
          { title: "QR trên Petal Pack dùng để làm gì?", text: "QR mở câu chuyện, hướng dẫn trải nghiệm và biểu mẫu phản hồi." },
          { title: "Có lịch tasting riêng không?", text: "Có thể gửi yêu cầu private tasting cho nhóm nhỏ hoặc đối tác." },
        ],
      },
      "/care": {
        path: "/care",
        eyebrow: "Chăm sóc sản phẩm",
        title: "Bảo quản để hương sen giữ được khoảng lặng của nó.",
        description: "Hướng dẫn chăm sóc sản phẩm, bao bì và cách pha trà trong giai đoạn trải nghiệm.",
        blocks: [
          { title: "Bảo quản", text: "Để nơi khô mát, tránh ánh nắng trực tiếp và đóng kín sau khi mở." },
          { title: "Pha trà", text: "Dùng đúng lượng nước và thời gian trên từng phiên bản sản phẩm." },
          { title: "Gift Set", text: "Giữ hộp quà ở trạng thái phẳng, tránh để vật nặng lên cánh hoặc thẻ câu chuyện." },
        ],
      },
    },
    journalPosts: [
      {
        slug: "gift-language",
        eyebrow: "Gifting note",
        title: "Một món quà cao cấp cần im lặng đúng lúc.",
        excerpt: "Cách Senova dùng lời nhắn, bao bì và QR để biến quà tặng thành một khoảng đối thoại.",
        readTime: "4 phút đọc",
        relatedHref: "/gifting",
      },
      {
        slug: "petal-ritual",
        eyebrow: "Ritual",
        title: "Vì sao thao tác mở cánh quan trọng hơn hình dáng.",
        excerpt: "Petal Pack không chỉ để nhìn; nó tạo ra nhịp chậm trước khi pha trà.",
        readTime: "5 phút đọc",
        relatedHref: "/products/petal-pack",
      },
      {
        slug: "seasonal-lotus",
        eyebrow: "Seasonal",
        title: "Mùa sen như một nguyên tắc biên tập.",
        excerpt: "Dùng mùa và ký ức như chất liệu, không biến địa danh thành trang trí.",
        readTime: "3 phút đọc",
        relatedHref: "/seasonal",
      },
    ],
    ui: {
      collectionsEyebrow: "Collections",
      collectionsTitle: "Bộ sưu tập Senova cho những dịp cần sự tinh tế.",
      collectionsDescription:
        "Khám phá các cấu hình sản phẩm theo ritual, gifting và private tasting, tất cả đều kết nối với concierge thay vì checkout tự động.",
      clientNote: "Client note",
      collectionMoodFallback: "Mỗi sản phẩm có thể được chọn cấu hình để đội ngũ Senova xác nhận riêng.",
      edits: "Edits",
      chooseMoment: "Chọn theo khoảnh khắc.",
      giftingConcierge: "Gifting concierge",
      allProducts: "All products",
      curatedSelection: "Curated selection",
      availability: "Availability",
      ritual: "Ritual",
      gifting: "Gifting",
      search: "Search",
      searchTitle: "Tìm đúng khoảnh khắc thưởng trà.",
      keyword: "Keyword",
      wishlist: "Wishlist",
      wishlistTitle: "Những cấu hình đang được lưu lại.",
      wishlistNote: "Wishlist đang là UI mock cho giai đoạn chưa có đăng nhập.",
      wishlistAside: "Khách có thể lưu sản phẩm và gửi inquiry khi đã sẵn sàng.",
      inquiryBag: "Danh sách đặt trước",
      bagTitle: "Giỏ yêu cầu trước khi concierge xác nhận.",
      bagDescription: "Đây không phải giỏ thanh toán. Senova sẽ dùng thông tin này để tư vấn cấu hình phù hợp.",
      bagCount: "dòng sản phẩm đang được quan tâm.",
      bagEmpty: "Bag đang trống.",
      nextStep: "Next step",
      nextStepText: "Gửi inquiry để concierge xác nhận biến thể, lịch giao, lời nhắn và báo giá.",
      continueInquiry: "Tiếp tục inquiry",
      exploreCollections: "Khám phá collections",
      remove: "Xóa",
      saveProduct: "Lưu sản phẩm",
      addToBag: "Thêm vào bag",
      checkoutEyebrow: "Yêu cầu đặt trước",
      checkoutTitle: "Gửi yêu cầu, chưa thanh toán trực tuyến.",
      checkoutDescription: "Quy trình này thu thập thông tin để Senova xác nhận cấu hình và lịch giao riêng.",
      intent: "Mục đích",
      name: "Họ và tên",
      phone: "Số điện thoại",
      email: "Email",
      notesLabel: "Ngày giao dự kiến / lời nhắn quà tặng",
      notesPlaceholder: "Ngày giao mong muốn, lời nhắn, số lượng, người nhận...",
      submitting: "Đang gửi...",
      submitInquiry: "Gửi yêu cầu đặt trước",
      checkoutSubmitError: "Yêu cầu chưa thể gửi. Vui lòng thử lại.",
      review: "Thông tin yêu cầu",
      emptyCheckout: "Không có sản phẩm trong bag; inquiry vẫn có thể gửi cho concierge.",
      inquiryReceived: "Đã nhận yêu cầu",
      thankYouTitle: "Senova đã ghi nhận yêu cầu.",
      thankYouText: "Concierge sẽ phản hồi để xác nhận cấu hình, lịch giao và thông tin quà tặng phù hợp.",
      viewMockStatus: "Xem trạng thái mẫu",
      serviceAside: "Mọi yêu cầu được đội ngũ Senova xác nhận riêng thay vì thanh toán tự động.",
      accountEyebrow: "Client account",
      accountOverviewTitle: "Guest client profile.",
      accountOrdersTitle: "Inquiry history.",
      accountWishlistTitle: "Saved selection.",
      orderStatus: "Order status",
      orderStatusTitle: "Theo dõi inquiry mẫu.",
      orderStatusDescription: "Khách có thể dùng mã yêu cầu để xem trạng thái khi backend thật được kết nối.",
      orderStatusAside: "SNV-2601-018 đang chờ concierge xác nhận.",
      inquiryCode: "Inquiry code",
      journal: "Journal",
      journalTitle: "Những ghi chú về trà, quà tặng và mùa sen.",
      relatedPage: "Mở trang liên quan",
      journalMock:
        "Bài viết này là giao diện editorial mock cho campaign luxury. Nội dung chi tiết có thể được biên tập thêm khi chốt giọng thương hiệu và ảnh campaign.",
    },
    account: {
      profileName: "Guest client",
      tier: "Preview Circle",
      note: "Hồ sơ mẫu cho giai đoạn chưa có đăng nhập.",
      orders: [
        {
          id: "SNV-2601-018",
          title: "Petal Pack tasting inquiry",
          status: "Đang chờ concierge xác nhận",
          date: "2026-01-18",
          totalLabel: "Báo giá sau khi xác nhận",
        },
        {
          id: "SNV-2601-024",
          title: "Corporate Gift Set consultation",
          status: "Đang lên cấu hình",
          date: "2026-01-24",
          totalLabel: "Theo số lượng và tùy biến",
        },
      ],
    },
    seo: {},
  },
  en: {
    collections: [
      {
        slug: "signature",
        eyebrow: "Signature collection",
        title: "Senova's first touchpoints.",
        description:
          "The foundational edit of Classic, Petal Pack and Gift Set, arranged through Keep - Open - Give.",
        productIds: ["classic", "petal-pack", "gift-set"],
        mood: "For clients meeting the Senova lotus tea language for the first time.",
      },
      {
        slug: "gifting",
        eyebrow: "Gifting edit",
        title: "Gifts with message and ritual.",
        description:
          "Configurations for appreciation, partners, events and days that ask for a deeper gift.",
        productIds: ["gift-set", "petal-pack"],
        mood: "Prioritizes packaging, messages, delivery timing and the recipient experience.",
      },
      {
        slug: "daily-ritual",
        eyebrow: "Daily ritual",
        title: "A quiet pause that can repeat each day.",
        description:
          "Products for maintaining a compact, beautiful tea habit that can begin almost anywhere.",
        productIds: ["classic", "petal-pack"],
        mood: "Suitable for desks, private homes and intimate tasting sessions.",
      },
    ],
    services: {
      "/gifting": {
        path: "/gifting",
        eyebrow: "Gift concierge",
        title: "Give lotus aroma as a carefully prepared message.",
        description:
          "A gifting page for personal sets, message cards, packaging and delivery timing for considered occasions.",
        ctaLabel: "Send gifting request",
        ctaHref: "/order-request?intent=gifting",
        blocks: [
          { title: "Gift message", text: "Add a private note, QR story or bilingual card." },
          { title: "Presentation", text: "Tissue wrap, seal and box configuration by recipient." },
          { title: "Delivery timing", text: "Concierge confirms delivery date and care conditions before finalizing." },
        ],
      },
      "/corporate-gifting": {
        path: "/corporate-gifting",
        eyebrow: "Corporate gifting",
        title: "Partner gifts with story and personalization.",
        description: "For companies, events and appreciation programs that need a refined gifting language.",
        ctaLabel: "Plan a corporate configuration",
        ctaHref: "/partners?topic=corporate-gifting",
        blocks: [
          { title: "Bulk inquiry", text: "Capture quantity, budget, recipient groups and delivery timing." },
          { title: "Customization", text: "Adapt message, language, QR content and partner brand details." },
          { title: "Concierge review", text: "Every configuration is reviewed by Senova before production." },
        ],
      },
      "/concierge": {
        path: "/concierge",
        eyebrow: "Client concierge",
        title: "A private touchpoint for clients who want guidance.",
        description: "Concierge supports product choice, gifting configuration, tasting dates and trial batch details.",
        ctaLabel: "Book concierge",
        ctaHref: "/order-request?intent=concierge",
        blocks: [
          { title: "Product guidance", text: "Choose Classic, Petal Pack or Gift Set by recipient and occasion." },
          { title: "Private support", text: "Connect by email or phone before confirming an inquiry." },
          { title: "Aftercare", text: "Receive storage, brewing and feedback guidance after the experience." },
        ],
      },
      "/private-tasting": {
        path: "/private-tasting",
        eyebrow: "Private tasting",
        title: "Book a private tea pause for a small group.",
        description:
          "A mock booking interface for personal, partner or intimate event tastings centered on opening, brewing and storytelling.",
        ctaLabel: "Request tasting time",
        ctaHref: "/order-request?intent=private-tasting",
        blocks: [
          { title: "Format", text: "30-45 minutes, ideal for 4-12 guests." },
          { title: "Products", text: "Taste Classic, open Petal Pack and review Gift Set configurations." },
          { title: "Follow-up", text: "Receive a summary of suitable configurations after the session." },
        ],
      },
    },
    policies: {
      "/shipping": {
        path: "/shipping",
        eyebrow: "Delivery care",
        title: "Delivery is confirmed as part of the experience.",
        description: "Senova has not opened automated payment checkout; every delivery schedule is concierge confirmed.",
        blocks: [
          { title: "Timing", text: "Personal orders are estimated at 3-5 business days after confirmation." },
          { title: "Gifting", text: "Gift orders can be scheduled by date with recipient notes." },
          { title: "Care", text: "Products are packed to reduce heat and humidity exposure during delivery." },
        ],
      },
      "/returns": {
        path: "/returns",
        eyebrow: "Returns",
        title: "Returns should be handled calmly and clearly.",
        description: "A mock policy page for preorder stage, prioritizing concierge contact before processing.",
        blocks: [
          { title: "Product issue", text: "Share photos, batch code and packaging condition for support." },
          { title: "Gift Set", text: "Personalized orders will have return conditions confirmed before production." },
          { title: "Refunds", text: "Online payment is not active yet; refund terms will be updated when live selling opens." },
        ],
      },
      "/faq": {
        path: "/faq",
        eyebrow: "FAQ",
        title: "Common questions before sending an inquiry.",
        description: "Concise answers about preorder, Gift Set, QR and tasting.",
        blocks: [
          { title: "Is Senova officially selling yet?", text: "The site is currently concierge + preorder and does not include online payment checkout." },
          { title: "Can I order corporate Gift Sets?", text: "Yes. Send a corporate gifting request for quantity and message configuration." },
          { title: "What is the QR on Petal Pack for?", text: "The QR opens story content, experience guidance and a feedback form." },
          { title: "Can I request a private tasting?", text: "Yes, private tasting can be requested for small groups or partners." },
        ],
      },
      "/care": {
        path: "/care",
        eyebrow: "Product care",
        title: "Care for the lotus aroma so it keeps its quietness.",
        description: "Guidance for product storage, packaging care and brewing during the experience stage.",
        blocks: [
          { title: "Storage", text: "Keep in a cool, dry place, away from direct sunlight, and seal after opening." },
          { title: "Brewing", text: "Use the water amount and steeping time shown on each product version." },
          { title: "Gift Set", text: "Keep the gift box flat and avoid placing weight on petals or story cards." },
        ],
      },
    },
    journalPosts: [
      {
        slug: "gift-language",
        eyebrow: "Gifting note",
        title: "A luxury gift needs silence at the right moment.",
        excerpt: "How Senova uses message, packaging and QR to turn gifting into a small dialogue.",
        readTime: "4 min read",
        relatedHref: "/gifting",
      },
      {
        slug: "petal-ritual",
        eyebrow: "Ritual",
        title: "Why the opening gesture matters more than the shape.",
        excerpt: "Petal Pack is not only visual; it creates a slower beat before brewing.",
        readTime: "5 min read",
        relatedHref: "/products/petal-pack",
      },
      {
        slug: "seasonal-lotus",
        eyebrow: "Seasonal",
        title: "Lotus season as an editorial principle.",
        excerpt: "Using season and memory as material without turning place into decoration.",
        readTime: "3 min read",
        relatedHref: "/seasonal",
      },
    ],
    ui: {
      collectionsEyebrow: "Collections",
      collectionsTitle: "Senova collections for moments that ask for refinement.",
      collectionsDescription:
        "Explore products by ritual, gifting and private tasting, all connected through concierge rather than automated checkout.",
      clientNote: "Client note",
      collectionMoodFallback: "Each product can be added to the inquiry bag for personal confirmation by Senova.",
      edits: "Edits",
      chooseMoment: "Choose by moment.",
      giftingConcierge: "Gifting concierge",
      allProducts: "All products",
      curatedSelection: "Curated selection",
      availability: "Availability",
      ritual: "Ritual",
      gifting: "Gifting",
      search: "Search",
      searchTitle: "Find the right tea moment.",
      keyword: "Keyword",
      wishlist: "Wishlist",
      wishlistTitle: "Saved configurations.",
      wishlistNote: "Wishlist is a mock UI while sign-in is not active.",
      wishlistAside: "Clients can save products and send an inquiry when ready.",
      inquiryBag: "Inquiry bag",
      bagTitle: "Your request bag before concierge confirmation.",
      bagDescription: "This is not a payment cart. Senova uses it to advise the right configuration.",
      bagCount: "product lines are being considered.",
      bagEmpty: "Your bag is empty.",
      nextStep: "Next step",
      nextStepText: "Send an inquiry so concierge can confirm variants, delivery timing, message and quote.",
      continueInquiry: "Continue inquiry",
      exploreCollections: "Explore collections",
      remove: "Remove",
      saveProduct: "Save product",
      addToBag: "Add to bag",
      checkoutEyebrow: "Concierge checkout",
      checkoutTitle: "Send a request, no online payment yet.",
      checkoutDescription: "This flow gathers details so Senova can confirm configuration and delivery timing.",
      intent: "Intent",
      name: "Name",
      phone: "Phone",
      email: "Email",
      notesLabel: "Delivery preference / gift note",
      notesPlaceholder: "Preferred delivery date, message, quantity, recipient...",
      submitting: "Sending...",
      submitInquiry: "Send concierge inquiry",
      checkoutSubmitError: "Your inquiry could not be sent. Please try again.",
      review: "Review",
      emptyCheckout: "There are no products in the bag; you can still send a concierge inquiry.",
      inquiryReceived: "Inquiry received",
      thankYouTitle: "Senova has received your request.",
      thankYouText: "Concierge will respond to confirm configuration, delivery timing and gifting details.",
      viewMockStatus: "View mock status",
      serviceAside: "Every request is handled by concierge rather than automated checkout.",
      accountEyebrow: "Client account",
      accountOverviewTitle: "Guest client profile.",
      accountOrdersTitle: "Inquiry history.",
      accountWishlistTitle: "Saved selection.",
      orderStatus: "Order status",
      orderStatusTitle: "Track a sample inquiry.",
      orderStatusDescription: "Clients will be able to use an inquiry code once the real backend is connected.",
      orderStatusAside: "SNV-2601-018 is waiting for concierge confirmation.",
      inquiryCode: "Inquiry code",
      journal: "Journal",
      journalTitle: "Notes on tea, gifting and lotus season.",
      relatedPage: "Open related page",
      journalMock:
        "This article is a mock editorial interface for a luxury campaign. Detailed content can be edited once brand voice and campaign imagery are finalized.",
    },
    account: {
      profileName: "Guest client",
      tier: "Preview Circle",
      note: "Mock profile for the stage before sign-in is connected.",
      orders: [
        {
          id: "SNV-2601-018",
          title: "Petal Pack tasting inquiry",
          status: "Waiting for concierge confirmation",
          date: "2026-01-18",
          totalLabel: "Quote after confirmation",
        },
        {
          id: "SNV-2601-024",
          title: "Corporate Gift Set consultation",
          status: "Configuration in progress",
          date: "2026-01-24",
          totalLabel: "By quantity and customization",
        },
      ],
    },
    seo: {
      "/collections": {
        title: "Senova Collections | Calmora",
        description: "Explore Senova collections for lotus tea rituals, gifting and concierge preorder.",
      },
      "/collections/signature": {
        title: "Signature Collection | Senova",
        description: "The foundational Senova edit across Classic, Petal Pack and Gift Set.",
      },
      "/collections/gifting": {
        title: "Gifting Collection | Senova",
        description: "Gift-led Senova configurations with message cards, packaging and concierge delivery timing.",
      },
      "/collections/daily-ritual": {
        title: "Daily Ritual Collection | Senova",
        description: "Daily lotus tea configurations for repeatable quiet pauses.",
      },
      "/search": {
        title: "Search | Senova",
        description: "Search Senova lotus tea products and gifting configurations.",
      },
      "/wishlist": {
        title: "Wishlist | Senova",
        description: "A saved selection UI for Senova products and gifting configurations.",
      },
      "/bag": {
        title: "Inquiry Bag | Senova",
        description: "Review Senova products before sending a concierge inquiry.",
        robots: "noindex,nofollow",
      },
      "/checkout": {
        title: "Concierge Checkout | Senova",
        description: "Send a Senova preorder or gifting inquiry without online payment.",
        robots: "noindex,nofollow",
      },
      "/checkout/thank-you": {
        title: "Inquiry Received | Senova",
        description: "Senova has received your concierge inquiry.",
        robots: "noindex,nofollow",
      },
      "/gifting": {
        title: "Gifting | Senova",
        description: "Personal gifting, message cards and concierge delivery timing for Senova.",
      },
      "/corporate-gifting": {
        title: "Corporate Gifting | Senova",
        description: "Corporate and event gifting configurations for Senova lotus tea.",
      },
      "/concierge": {
        title: "Concierge | Senova",
        description: "Private Senova support for product choice, gifting configuration and tasting.",
      },
      "/private-tasting": {
        title: "Private Tasting | Senova",
        description: "Request a private Senova tasting for a small group or partner event.",
      },
      "/shipping": {
        title: "Shipping | Senova",
        description: "Delivery timing and concierge confirmation for Senova preorder.",
      },
      "/returns": {
        title: "Returns | Senova",
        description: "Mock return policy for Senova preorder and gifting stage.",
      },
      "/faq": {
        title: "FAQ | Senova",
        description: "Answers about Senova preorder, Gift Set, QR and private tasting.",
      },
      "/care": {
        title: "Product Care | Senova",
        description: "Storage and brewing guidance for Senova lotus tea products.",
      },
      "/account": {
        title: "Account | Senova",
        description: "Mock client profile for Senova concierge inquiries.",
        robots: "noindex,nofollow",
      },
      "/account/orders": {
        title: "Inquiry History | Senova",
        description: "Mock inquiry history for Senova concierge preorder.",
        robots: "noindex,nofollow",
      },
      "/account/wishlist": {
        title: "Account Wishlist | Senova",
        description: "Mock saved selection for Senova clients.",
        robots: "noindex,nofollow",
      },
      "/order-status": {
        title: "Order Status | Senova",
        description: "Mock inquiry status tracking for Senova concierge preorder.",
        robots: "noindex,nofollow",
      },
      "/journal": {
        title: "Journal | Senova",
        description: "Editorial notes on Senova lotus tea, gifting and seasonal rituals.",
      },
    },
  },
};

export function getLocalizedSeo(pathname: string, fallback: SeoContent, language: Language) {
  return commerceText[language].seo[pathname] ?? fallback;
}
