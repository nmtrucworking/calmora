import type { Language } from "@app/providers/LanguageContext";
import type { ProductId } from "@features/products/data/products";

type LinkCopy = {
  label: string;
  href: string;
};

type ProductLuxuryCopy = {
  name: string;
  role: string;
  eyebrow: string;
  tagline: string;
  description: string;
  shortDescription: string;
  priceLabel: string;
  availability: string;
  image: string;
  heroAlt: string;
  primaryAction: LinkCopy;
  secondaryAction: LinkCopy;
  variants: { id: string; label: string; note: string }[];
  includedItems: string[];
  dimensions: string;
  brewingNotes: string[];
  giftOptions: string[];
  highlights: string[];
  suitableFor: string[];
  experienceSteps: { title: string; text: string }[];
  culturalNote: string;
  materialNotes: { title: string; text: string }[];
};

export type LuxuryLandingCopy = {
  hero: {
    eyebrow: string;
    title: string;
    lines: string[];
    description: string;
    primary: LinkCopy;
    secondary: LinkCopy;
    imageAlt: string;
    scrollHint: string;
  };
  signature: {
    eyebrow: string;
    title: string;
    text: string;
    steps: string[];
    imageAlt: string;
  };
  ritual: {
    eyebrow: string;
    title: string;
    text: string;
    steps: { number: string; title: string; text: string; productId: ProductId }[];
  };
  collection: {
    eyebrow: string;
    title: string;
    text: string;
  };
  culture: {
    eyebrow: string;
    title: string;
    text: string;
    points: { title: string; text: string }[];
  };
  gift: {
    eyebrow: string;
    title: string;
    text: string;
    primary: LinkCopy;
    secondary: LinkCopy;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    text: string;
    primary: LinkCopy;
    secondary: LinkCopy;
  };
};

export type LuxuryLayoutCopy = {
  brand: string;
  summary: string;
  navAria: string;
  mobileNavAria: string;
  menuOpen: string;
  menuClose: string;
  languageToggle: string;
  preorder: string;
  navigation: LinkCopy[];
  footerGroups: { title: string; links: LinkCopy[] }[];
};

export const luxuryLayoutCopy: Record<Language, LuxuryLayoutCopy> = {
  vi: {
    brand: "CALMORA | SENOVA",
    summary:
      "Senova đặt trà hương sen trong một trải nghiệm có hình dáng, thao tác và câu chuyện để trao đi.",
    navAria: "Điều hướng chính",
    mobileNavAria: "Điều hướng di động",
    menuOpen: "Mở menu",
    menuClose: "Đóng menu",
    languageToggle: "Đổi ngôn ngữ",
    preorder: "Đặt trước",
    navigation: [
      { label: "Câu chuyện", href: "/story" },
      { label: "Bộ sưu tập", href: "/products" },
      { label: "Trải nghiệm", href: "/ritual" },
      { label: "Văn hóa", href: "/seasonal" },
      { label: "Liên hệ", href: "/contact" },
    ],
    footerGroups: [
      {
        title: "Senova",
        links: [
          { label: "Bộ sưu tập", href: "/products" },
          { label: "Câu chuyện", href: "/story" },
          { label: "Trải nghiệm", href: "/ritual" },
          { label: "Liên hệ", href: "/contact" },
        ],
      },
      {
        title: "Dịch vụ",
        links: [
          { label: "Đặt trước", href: "/reorder" },
          { label: "Quà tặng", href: "/gifting" },
          { label: "Concierge", href: "/concierge" },
          { label: "Hợp tác", href: "/partners" },
        ],
      },
    ],
  },
  en: {
    brand: "CALMORA | SENOVA",
    summary:
      "Senova frames lotus tea through form, gesture and story, prepared for tasting and gifting.",
    navAria: "Primary navigation",
    mobileNavAria: "Mobile navigation",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    languageToggle: "Switch language",
    preorder: "Pre-order",
    navigation: [
      { label: "Story", href: "/story" },
      { label: "Collection", href: "/products" },
      { label: "Experience", href: "/ritual" },
      { label: "Culture", href: "/seasonal" },
      { label: "Contact", href: "/contact" },
    ],
    footerGroups: [
      {
        title: "Senova",
        links: [
          { label: "Collection", href: "/products" },
          { label: "Story", href: "/story" },
          { label: "Experience", href: "/ritual" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Service",
        links: [
          { label: "Pre-order", href: "/reorder" },
          { label: "Gifting", href: "/gifting" },
          { label: "Concierge", href: "/concierge" },
          { label: "Partners", href: "/partners" },
        ],
      },
    ],
  },
};

export const luxuryLandingCopy: Record<Language, LuxuryLandingCopy> = {
  vi: {
    hero: {
      eyebrow: "Senova Petal Pack",
      title: "Một búp sen. Một lần pha. Một nghi thức.",
      lines: ["Một búp sen.", "Một lần pha.", "Một nghi thức."],
      description:
        "Phần trà cho một lần pha, được bao quanh bởi cánh sen sấy tạo hình búp sen.",
      primary: { label: "Khám phá Petal Pack", href: "/products/petal-pack" },
      secondary: { label: "Xem nghi thức pha", href: "/ritual" },
      imageAlt: "Senova Petal Pack tạo hình búp sen đặt trên nền chất liệu tối",
      scrollHint: "Cuộn để mở câu chuyện",
    },
    signature: {
      eyebrow: "Signature Product",
      title: "Petal Pack là điểm chạm đầu tiên của Senova.",
      text:
        "Một phần trà định lượng cho một lần pha, đặt trong túi lọc và được bao quanh bởi cánh sen thật. Người dùng không chỉ mở gói trà, mà mở một nhịp chậm trước khi rót nước.",
      steps: ["Tách nhẹ", "Cảm nhận hương", "Pha cùng cánh sen", "Thưởng thức"],
      imageAlt: "Cận cảnh Senova Petal Pack như sản phẩm chủ đạo",
    },
    ritual: {
      eyebrow: "Tea Ritual",
      title: "Bốn nhịp nhỏ để một tách trà có thời gian hiện ra.",
      text:
        "Nghi thức được giữ ngắn, rõ và có thể lặp lại. Mỗi bước phục vụ trải nghiệm sử dụng, không chỉ là lớp trang trí.",
      steps: [
        {
          number: "01",
          title: "Tách nhẹ cánh sen",
          text: "Mở từng lớp để nhìn cấu trúc búp sen trước khi pha.",
          productId: "petal-pack",
        },
        {
          number: "02",
          title: "Chạm hương",
          text: "Dành một khoảnh khắc cho hương sen và chất liệu khô.",
          productId: "petal-pack",
        },
        {
          number: "03",
          title: "Pha cùng cánh sen",
          text: "Đặt phần trà vào chén, rót nước nóng và chờ hương mở.",
          productId: "classic",
        },
        {
          number: "04",
          title: "Thưởng thức",
          text: "Quan sát màu nước, nếm chậm và tiếp tục câu chuyện qua QR.",
          productId: "gift-set",
        },
      ],
    },
    collection: {
      eyebrow: "Senova Collection",
      title: "Ba vai trò, một hệ sản phẩm.",
      text:
        "Petal Pack giữ vị trí biểu tượng; Classic là nhịp dùng hằng ngày; Gift Set đưa câu chuyện vào một món quà có chuẩn bị.",
    },
    culture: {
      eyebrow: "Cultural Material",
      title: "Văn hóa nằm trong thao tác và chất liệu.",
      text:
        "Senova không dùng hoa sen như họa tiết trang trí dày đặc. Câu chuyện được kể qua cách mở, cách pha, thẻ QR và cảm giác của giấy, trà, cánh sen.",
      points: [
        {
          title: "Sen trong đời sống Việt",
          text: "Hình ảnh sen được giữ tiết chế, xuất hiện như vật liệu và hành động hơn là biểu tượng phủ kín giao diện.",
        },
        {
          title: "QR tiếp nối câu chuyện",
          text: "Sau khi cầm sản phẩm, người dùng có thể đọc hướng dẫn, câu chuyện ngắn và gửi phản hồi.",
        },
        {
          title: "Quà tặng có dụng ý",
          text: "Gift Set ưu tiên lời nhắn, trình tự mở hộp và vai trò của người nhận trong trải nghiệm.",
        },
      ],
    },
    gift: {
      eyebrow: "Gift Experience",
      title: "Một món quà cần khoảng lặng ở đúng nơi.",
      text:
        "Gift Set kết hợp trà, Petal Pack, thẻ câu chuyện và bao bì vật liệu để người nhận bước vào trải nghiệm theo một trình tự rõ ràng.",
      primary: { label: "Khám phá Senova Gift Set", href: "/products/gift-set" },
      secondary: { label: "Trao đổi đơn quà tặng", href: "/contact?topic=gift-set" },
    },
    finalCta: {
      eyebrow: "Calmora | Senova",
      title: "Sen trà giao hòa, chuyện Việt ngân nga.",
      text: "Khám phá bộ sưu tập hoặc gửi yêu cầu đặt trước để Senova tư vấn cấu hình phù hợp.",
      primary: { label: "Khám phá bộ sưu tập", href: "/products" },
      secondary: { label: "Đặt trước", href: "/reorder" },
    },
  },
  en: {
    hero: {
      eyebrow: "Senova Petal Pack",
      title: "One lotus bud. One brew. One ritual.",
      lines: ["One lotus bud.", "One brew.", "One ritual."],
      description:
        "A single-brew tea portion wrapped with dried lotus petals and shaped into a lotus bud.",
      primary: { label: "Explore Petal Pack", href: "/products/petal-pack" },
      secondary: { label: "View the ritual", href: "/ritual" },
      imageAlt: "Senova Petal Pack lotus-bud product on a dark material surface",
      scrollHint: "Scroll to open the story",
    },
    signature: {
      eyebrow: "Signature Product",
      title: "Petal Pack is Senova's first touchpoint.",
      text:
        "A portioned tea sachet for one brew, wrapped with real lotus petals. The user does not only open tea packaging; they open a slower beat before pouring water.",
      steps: ["Open gently", "Notice aroma", "Brew with petals", "Taste slowly"],
      imageAlt: "Close view of Senova Petal Pack as the signature product",
    },
    ritual: {
      eyebrow: "Tea Ritual",
      title: "Four quiet beats before a cup of tea appears.",
      text:
        "The ritual stays concise, clear and repeatable. Every step serves the experience rather than decoration.",
      steps: [
        {
          number: "01",
          title: "Open the petals",
          text: "Unfold each layer to see the lotus-bud structure before brewing.",
          productId: "petal-pack",
        },
        {
          number: "02",
          title: "Notice the aroma",
          text: "Hold a short pause for lotus aroma and dry material detail.",
          productId: "petal-pack",
        },
        {
          number: "03",
          title: "Brew with petals",
          text: "Place the tea in a cup, pour hot water and let the aroma open.",
          productId: "classic",
        },
        {
          number: "04",
          title: "Taste",
          text: "Observe the liquor, drink slowly and continue the story through QR.",
          productId: "gift-set",
        },
      ],
    },
    collection: {
      eyebrow: "Senova Collection",
      title: "Three roles, one product system.",
      text:
        "Petal Pack is the signature; Classic holds the daily rhythm; Gift Set carries the story into prepared gifting.",
    },
    culture: {
      eyebrow: "Cultural Material",
      title: "Culture lives in gesture and material.",
      text:
        "Senova avoids treating lotus as dense decoration. The story appears through opening, brewing, QR cards and the feeling of paper, tea and petals.",
      points: [
        {
          title: "Lotus in Vietnamese life",
          text: "The lotus is handled with restraint, appearing as material and action rather than a repeated motif.",
        },
        {
          title: "QR continues the story",
          text: "After receiving the product, clients can read guidance, a short story and leave feedback.",
        },
        {
          title: "Gifting with intent",
          text: "Gift Set prioritizes message, unboxing sequence and the recipient's role in the experience.",
        },
      ],
    },
    gift: {
      eyebrow: "Gift Experience",
      title: "A gift needs silence in the right place.",
      text:
        "Gift Set combines tea, Petal Pack, story card and material packaging so the recipient can enter the experience in a clear order.",
      primary: { label: "Explore Senova Gift Set", href: "/products/gift-set" },
      secondary: { label: "Discuss gifting", href: "/contact?topic=gift-set" },
    },
    finalCta: {
      eyebrow: "Calmora | Senova",
      title: "Lotus and tea in dialogue, a Vietnamese story carried forward.",
      text: "Explore the collection or send a preorder request so Senova can advise the right configuration.",
      primary: { label: "Explore collection", href: "/products" },
      secondary: { label: "Pre-order", href: "/reorder" },
    },
  },
};

export const productLuxuryCopy: Record<Language, Record<ProductId, ProductLuxuryCopy>> = {
  vi: {
    "petal-pack": {
      name: "Senova Petal Pack",
      role: "Signature",
      eyebrow: "Mở / Trải nghiệm chủ đạo",
      tagline: "Một búp sen cho một lần pha.",
      description:
        "Phần trà cho một lần pha, đặt trong túi lọc và được bao quanh bởi cánh sen sấy tạo hình búp sen.",
      shortDescription:
        "Sản phẩm biểu tượng của Senova, biến thao tác pha trà thành một khoảnh khắc mở, chạm hương và thưởng thức.",
      priceLabel: "Từ 480.000 VND",
      availability: "Lô trải nghiệm PP-2601-A đang nhận inquiry",
      image: "/assets/products/petal-pack-optimized.jpg",
      heroAlt: "Senova Petal Pack tạo hình búp sen với phần trà bên trong",
      primaryAction: { label: "Bắt đầu trải nghiệm", href: "/experience/petal-pack" },
      secondaryAction: { label: "Đặt trước Petal Pack", href: "/reorder?product=petal-pack" },
      variants: [
        { id: "petal-single", label: "Set 6 Petal Pack", note: "Trải nghiệm cá nhân" },
        { id: "petal-hosting", label: "Set 18 Petal Pack", note: "Cho tasting và booth" },
      ],
      includedItems: [
        "Petal Pack tạo hình búp sen",
        "Trà túi lọc cho một lần pha",
        "Thẻ QR câu chuyện và phản hồi",
        "Hướng dẫn nghi thức mở - pha",
      ],
      dimensions: "Mỗi Petal Pack được bảo quản trong khay riêng, hộp 18 x 12 x 7 cm.",
      brewingNotes: ["Mở từng lớp cánh sen", "Dùng 200 ml nước nóng", "Chờ 5 phút và quét QR trong lúc đợi"],
      giftOptions: ["Thiệp cá nhân hóa", "QR lời nhắn", "Gói riêng từng khách mời"],
      highlights: [
        "Một phần trà tương ứng với một lần pha",
        "Cánh sen tạo hình búp trở thành điểm chạm trực quan",
        "Thao tác mở gói là bước đầu của trải nghiệm",
        "Nội dung QR tiếp nối câu chuyện sau khi cầm sản phẩm",
      ],
      suitableFor: [
        "Tasting sản phẩm",
        "Booth trải nghiệm",
        "Quà tặng nhỏ có câu chuyện",
        "Người quan tâm thiết kế và nghi thức trà",
      ],
      experienceSteps: [
        { title: "Mở cánh sen", text: "Mở nhẹ từng lớp để quan sát cấu trúc búp sen trước khi pha." },
        { title: "Chạm hương", text: "Dành một khoảnh khắc cho hương sen và chất liệu trước khi rót nước." },
        { title: "Pha trà", text: "Đặt phần trà vào chén và thực hiện theo hướng dẫn trên thẻ." },
        { title: "Thưởng thức", text: "Quan sát màu nước, nếm chậm và tiếp tục câu chuyện qua QR." },
      ],
      culturalNote:
        "Petal Pack dùng hình dáng sen như một thao tác mở, không phải họa tiết phủ ngoài. Giá trị nằm ở nhịp chậm trước khi pha trà.",
      materialNotes: [
        { title: "Cánh sen sấy", text: "Tạo cảm giác vật liệu thật và giữ hình dáng búp sen." },
        { title: "Trà định lượng", text: "Giúp một lần pha có tỷ lệ rõ ràng và dễ lặp lại." },
        { title: "Thẻ QR", text: "Mở hướng dẫn, câu chuyện ngắn và kênh phản hồi." },
      ],
    },
    classic: {
      name: "Senova Classic",
      role: "Daily Ritual",
      eyebrow: "Giữ / Nghi thức hằng ngày",
      tagline: "Giữ hương sen trong nhịp sống mỗi ngày.",
      description:
        "Dòng trà hương sen nền tảng, được trình bày trong hình thức thuận tiện để pha và thưởng thức thường xuyên.",
      shortDescription: "Nhịp trà hằng ngày, gọn, rõ và dễ lặp lại.",
      priceLabel: "Từ 320.000 VND",
      availability: "Mở danh sách đặt trước theo lô nhỏ",
      image: "/assets/products/classic-pack-optimized.jpg",
      heroAlt: "Hộp trà hương sen Senova Classic",
      primaryAction: { label: "Mở trải nghiệm Classic", href: "/experience/classic" },
      secondaryAction: { label: "Đặt trước Classic", href: "/reorder?product=classic" },
      variants: [
        { id: "daily-box", label: "Hộp 12 gói", note: "Nhịp thưởng trà hằng ngày" },
        { id: "trial-set", label: "Bộ thử 3 gói", note: "Dành cho lần chạm đầu tiên" },
      ],
      includedItems: ["Trà hương sen định lượng", "Thẻ hướng dẫn pha", "Bao bì giấy mỹ thuật có niêm phong"],
      dimensions: "Hộp 12 x 8 x 5 cm, phù hợp kệ trà hoặc bàn làm việc.",
      brewingNotes: ["Dùng 180 ml nước nóng", "Chờ 4-5 phút", "Thưởng thức khi hương sen vừa mở"],
      giftOptions: ["Thêm thiệp lời nhắn", "Gói giấy lụa", "Lên lịch giao theo ngày"],
      highlights: [
        "Phần trà được định lượng cho một lần pha",
        "Thao tác sử dụng gọn và dễ hình thành thói quen",
        "Hương sen được đặt trong trải nghiệm chậm, không cầu kỳ",
      ],
      suitableFor: ["Sử dụng hằng ngày", "Khoảng nghỉ tại nhà", "Người mới tiếp cận trà hương sen"],
      experienceSteps: [
        { title: "Mở gói", text: "Lấy một phần trà đã định lượng, giữ thao tác gọn và sạch." },
        { title: "Pha trà", text: "Đặt phần trà vào chén và thực hiện theo hướng dẫn trên bao bì." },
        { title: "Giữ một khoảng chậm", text: "Dành thời gian để hương sen và vị trà dần hiện ra." },
      ],
      culturalNote:
        "Classic giữ trà hương sen ở vị trí nền tảng: dễ dùng, dễ lặp lại, không cần trình diễn.",
      materialNotes: [
        { title: "Trà hương sen", text: "Được giữ trong phần dùng vừa đủ cho một lần pha." },
        { title: "Bao bì giấy", text: "Tạo cảm giác thân thiện với nhịp dùng hằng ngày." },
        { title: "Hướng dẫn ngắn", text: "Giúp người mới bắt đầu không cần đoán tỷ lệ pha." },
      ],
    },
    "gift-set": {
      name: "Senova Gift Set",
      role: "Cultural Gifting",
      eyebrow: "Trao / Quà tặng văn hóa",
      tagline: "Trao hương sen, gửi một lời trân trọng.",
      description:
        "Bộ quà kết hợp trà hương sen, Petal Pack, hướng dẫn pha và thẻ câu chuyện trong một trình tự trao tặng thống nhất.",
      shortDescription: "Cấu hình quà tặng có sản phẩm, lời nhắn, thẻ câu chuyện và nghi thức mở hộp.",
      priceLabel: "Báo giá theo cấu hình quà tặng",
      availability: "Nhận tư vấn corporate và seasonal gifting",
      image: "/assets/products/gift-set-optimized.jpg",
      heroAlt: "Bộ quà trà sen Senova Gift Set",
      primaryAction: { label: "Đăng ký nhận thông tin", href: "/reorder?product=gift-set" },
      secondaryAction: { label: "Liên hệ tư vấn", href: "/contact?topic=gift-set" },
      variants: [
        { id: "gift-personal", label: "Personal Gift Set", note: "Quà tặng cá nhân" },
        { id: "gift-corporate", label: "Corporate Edition", note: "Cấu hình cho đối tác và sự kiện" },
      ],
      includedItems: ["Senova Classic", "Senova Petal Pack", "Thẻ câu chuyện", "Hộp quà có lời nhắn"],
      dimensions: "Hộp quà 28 x 20 x 9 cm, có thể điều chỉnh theo cấu hình doanh nghiệp.",
      brewingNotes: ["Bắt đầu bằng lời nhắn", "Chọn Classic hoặc Petal Pack", "Dùng QR để tiếp tục câu chuyện"],
      giftOptions: ["Đóng dấu logo đối tác", "Thiệp song ngữ", "Giao nhiều địa chỉ", "Phiên bản theo mùa"],
      highlights: [
        "Kết hợp sản phẩm, trải nghiệm và nội dung văn hóa",
        "Có thể điều chỉnh lời nhắn và QR theo dịp trao tặng",
        "Phù hợp với quà tri ân, đối tác và sự kiện",
      ],
      suitableFor: ["Quà tri ân", "Quà lưu niệm", "Quà đối tác", "Phiên bản theo mùa"],
      experienceSteps: [
        { title: "Mở hộp", text: "Tiếp cận từng thành phần theo một trình tự rõ ràng." },
        { title: "Đọc lời nhắn", text: "Nhận biết dụng ý của người trao và câu chuyện đi cùng món quà." },
        { title: "Chọn trải nghiệm", text: "Bắt đầu với Classic hoặc Petal Pack tùy nhịp thưởng trà." },
        { title: "Tiếp tục câu chuyện", text: "Dùng thẻ hoặc QR để đọc thêm và chia sẻ lại ý nghĩa món quà." },
      ],
      culturalNote:
        "Gift Set đặt trọng tâm vào sự chuẩn bị: lời nhắn, trình tự mở hộp và cách câu chuyện được gửi tiếp.",
      materialNotes: [
        { title: "Hộp quà", text: "Giữ sản phẩm theo trình tự mở hộp có chủ ý." },
        { title: "Thẻ câu chuyện", text: "Đưa người nhận vào bối cảnh trước khi pha trà." },
        { title: "Cấu hình linh hoạt", text: "Phù hợp cá nhân, đối tác hoặc mùa lễ tặng quà." },
      ],
    },
  },
  en: {
    "petal-pack": {
      name: "Senova Petal Pack",
      role: "Signature",
      eyebrow: "Open / Signature experience",
      tagline: "A lotus bud for one brew.",
      description:
        "A single-brew tea portion in a filter sachet, wrapped by dried lotus petals shaped into a lotus bud.",
      shortDescription:
        "Senova's signature product, turning tea brewing into a moment of opening, noticing aroma and tasting.",
      priceLabel: "From VND 480,000",
      availability: "Trial batch PP-2601-A is open for inquiry",
      image: "/assets/products/petal-pack-optimized.jpg",
      heroAlt: "Senova Petal Pack shaped as a lotus bud with tea inside",
      primaryAction: { label: "Begin the experience", href: "/experience/petal-pack" },
      secondaryAction: { label: "Pre-order Petal Pack", href: "/reorder?product=petal-pack" },
      variants: [
        { id: "petal-single", label: "Set of 6 Petal Packs", note: "Personal tasting" },
        { id: "petal-hosting", label: "Set of 18 Petal Packs", note: "For tasting sessions and booths" },
      ],
      includedItems: ["Lotus-bud Petal Pack", "Single-cup tea filter", "QR story and feedback card", "Open-and-brew ritual guide"],
      dimensions: "Each Petal Pack is protected in its own tray, 18 x 12 x 7 cm box.",
      brewingNotes: ["Open each lotus layer", "Use 200 ml hot water", "Steep for 5 minutes and scan the QR while waiting"],
      giftOptions: ["Personalized card", "QR message", "Individually wrapped guest pieces"],
      highlights: [
        "One tea portion corresponds to one brew",
        "The lotus-bud form becomes a visual touchpoint",
        "The opening gesture is the first step of the experience",
        "QR content continues the story after the product is in hand",
      ],
      suitableFor: ["Product tasting", "Experience booths", "Small story-led gifts", "Design and tea ritual audiences"],
      experienceSteps: [
        { title: "Open the petals", text: "Gently unfold each layer to observe the lotus-bud structure before brewing." },
        { title: "Notice aroma", text: "Hold a short pause for lotus aroma and material before pouring water." },
        { title: "Brew", text: "Place the tea in a cup and follow the card guide." },
        { title: "Taste", text: "Observe the liquor, drink slowly and continue the story through QR." },
      ],
      culturalNote:
        "Petal Pack uses the lotus as an opening gesture, not surface decoration. Its value sits in the slower beat before brewing.",
      materialNotes: [
        { title: "Dried lotus petals", text: "Bring real material presence and shape the bud form." },
        { title: "Portioned tea", text: "Makes each brew clear, repeatable and easy to guide." },
        { title: "QR card", text: "Opens guidance, a short story and feedback." },
      ],
    },
    classic: {
      name: "Senova Classic",
      role: "Daily Ritual",
      eyebrow: "Keep / Everyday ritual",
      tagline: "Keep lotus tea within the rhythm of every day.",
      description: "The foundational lotus tea line, presented in an easy format for regular brewing.",
      shortDescription: "A compact, repeatable daily tea rhythm.",
      priceLabel: "From VND 320,000",
      availability: "Small-batch preorder list open",
      image: "/assets/products/classic-pack-optimized.jpg",
      heroAlt: "Senova Classic lotus tea box",
      primaryAction: { label: "Open the Classic experience", href: "/experience/classic" },
      secondaryAction: { label: "Pre-order Classic", href: "/reorder?product=classic" },
      variants: [
        { id: "daily-box", label: "Box of 12 sachets", note: "Everyday tea rhythm" },
        { id: "trial-set", label: "3-sachet trial set", note: "For the first touchpoint" },
      ],
      includedItems: ["Portioned lotus tea", "Brewing guide card", "Sealed fine-paper packaging"],
      dimensions: "12 x 8 x 5 cm box, suitable for a tea shelf or desk.",
      brewingNotes: ["Use 180 ml hot water", "Steep for 4-5 minutes", "Enjoy as the lotus note opens"],
      giftOptions: ["Add a message card", "Tissue wrapping", "Schedule delivery by date"],
      highlights: [
        "Tea is portioned for one brew",
        "The routine is compact and easy to repeat",
        "Lotus aroma is framed as a slow, unfussy tasting moment",
      ],
      suitableFor: ["Daily use", "Quiet breaks at home", "Newcomers to lotus tea"],
      experienceSteps: [
        { title: "Open", text: "Take one portioned tea sachet and keep the gesture clean." },
        { title: "Brew", text: "Place the tea in a cup and follow the package guide." },
        { title: "Hold the pause", text: "Give the lotus aroma and tea body time to unfold." },
      ],
      culturalNote:
        "Classic keeps lotus tea in a foundational place: approachable, repeatable and not theatrical.",
      materialNotes: [
        { title: "Lotus tea", text: "Held in a portion sized for one brew." },
        { title: "Paper packaging", text: "Keeps the line close to daily use." },
        { title: "Short guide", text: "Helps new clients brew without guessing ratios." },
      ],
    },
    "gift-set": {
      name: "Senova Gift Set",
      role: "Cultural Gifting",
      eyebrow: "Give / Cultural gifting",
      tagline: "Give lotus aroma as a prepared message.",
      description:
        "A gifting configuration that combines lotus tea, Petal Pack, brewing guidance and a story card.",
      shortDescription: "A gift configuration with product, message, story card and unboxing sequence.",
      priceLabel: "Quote by gifting configuration",
      availability: "Corporate and seasonal gifting consultation open",
      image: "/assets/products/gift-set-optimized.jpg",
      heroAlt: "Senova Gift Set lotus tea gift box",
      primaryAction: { label: "Register interest", href: "/reorder?product=gift-set" },
      secondaryAction: { label: "Contact concierge", href: "/contact?topic=gift-set" },
      variants: [
        { id: "gift-personal", label: "Personal Gift Set", note: "Personal gifting" },
        { id: "gift-corporate", label: "Corporate Edition", note: "For partners and events" },
      ],
      includedItems: ["Senova Classic", "Senova Petal Pack", "Story card", "Gift box with message"],
      dimensions: "28 x 20 x 9 cm gift box, adjustable for corporate configurations.",
      brewingNotes: ["Begin with the message", "Choose Classic or Petal Pack", "Use QR to continue the story"],
      giftOptions: ["Partner logo seal", "Bilingual card", "Multi-address delivery", "Seasonal edition"],
      highlights: [
        "Combines product, experience and cultural content",
        "Message and QR content can adapt by occasion",
        "Suitable for appreciation, partner and event gifting",
      ],
      suitableFor: ["Appreciation gifts", "Keepsakes", "Partner gifts", "Seasonal editions"],
      experienceSteps: [
        { title: "Open the box", text: "Approach each component in a clear order." },
        { title: "Read the message", text: "Understand the sender's intent and the story carried with the gift." },
        { title: "Choose the experience", text: "Begin with Classic or Petal Pack depending on the tea moment." },
        { title: "Continue the story", text: "Use the card or QR to read more and share the meaning onward." },
      ],
      culturalNote:
        "Gift Set centers preparation: message, unboxing order and the way a story is carried forward.",
      materialNotes: [
        { title: "Gift box", text: "Holds the products in an intentional opening sequence." },
        { title: "Story card", text: "Gives the recipient context before brewing." },
        { title: "Flexible configuration", text: "Works for personal, partner or seasonal gifting." },
      ],
    },
  },
};

export const orderedLuxuryProducts: ProductId[] = ["petal-pack", "classic", "gift-set"];
