export type ProductId = "classic" | "petal-pack" | "gift-set";

export type SenovaProduct = {
  id: ProductId;
  slug: ProductId;
  name: string;
  line: ProductId;
  eyebrow: string;
  tagline: string;
  description: string;
  shortDescription: string;
  role: "Giữ" | "Mở" | "Trao";
  href: string;
  image: string;
  status: "draft" | "active" | "archived";
  priceLabel: string;
  availability: string;
  variants: {
    id: string;
    label: string;
    note: string;
  }[];
  includedItems: string[];
  dimensions: string;
  brewingNotes: string[];
  shippingNote: string;
  giftOptions: string[];
  badges: string[];
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  batchLabel?: string;
  heroAlt: string;
  suitableFor: string[];
  highlights: string[];
  experienceSteps: {
    title: string;
    text: string;
  }[];
  seo: {
    title: string;
    description: string;
  };
};

export const productSlugs: ProductId[] = ["classic", "petal-pack", "gift-set"];

export const products: SenovaProduct[] = [
  {
    id: "classic",
    slug: "classic",
    name: "Senova Classic",
    line: "classic",
    eyebrow: "GIỮ / Nghi thức hằng ngày",
    tagline: "Giữ hương sen trong nhịp sống mỗi ngày.",
    description:
      "Dòng trà hương sen nền tảng, được trình bày trong hình thức thuận tiện để người dùng có thể pha và thưởng thức thường xuyên.",
    shortDescription: "Dành cho những khoảng lặng có thể lặp lại mỗi ngày.",
    role: "Giữ",
    href: "/products/classic",
    image: "/assets/products/classic-pack.jpg",
    status: "active",
    priceLabel: "Tu 320.000 VND",
    availability: "Mo danh sach dat truoc theo lo nho",
    variants: [
      { id: "daily-box", label: "Hop 12 goi", note: "Nhip thuong tra hang ngay" },
      { id: "trial-set", label: "Bo thu 3 goi", note: "Danh cho lan cham dau tien" },
    ],
    includedItems: [
      "Tra huong sen dinh luong tung lan pha",
      "The huong dan pha ngan gon",
      "Bao bi giay my thuat co niem phong",
    ],
    dimensions: "Hop 12 x 8 x 5 cm, phu hop ke tra hoac ban lam viec",
    brewingNotes: ["Dung 180 ml nuoc nong", "Cho 4-5 phut", "Thuong thuc khi huong sen vua mo"],
    shippingNote: "Du kien giao trong 3-5 ngay lam viec sau khi xac nhan concierge.",
    giftOptions: ["Them thiep loi nhan", "Goi giay lua", "Len lich giao theo ngay"],
    badges: ["Everyday ritual", "Single serve", "Preorder"],
    primaryAction: {
      label: "Mở trải nghiệm Classic",
      href: "/experience/classic",
    },
    secondaryAction: {
      label: "Đăng ký đặt trước",
      href: "/dat-truoc?product=classic",
    },
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
      {
        title: "Mở gói",
        text: "Lấy một phần trà đã được định lượng, giữ thao tác gọn và sạch.",
      },
      {
        title: "Pha trà",
        text: "Đặt phần trà vào cốc và thực hiện theo hướng dẫn in trên bao bì của phiên bản sản phẩm.",
      },
      {
        title: "Giữ một khoảng chậm",
        text: "Dành thời gian để hương sen và vị trà dần hiện ra trước khi thưởng thức.",
      },
    ],
    seo: {
      title: "Senova Classic | Calmora",
      description:
        "Senova Classic giữ trà hương sen trong một hình thức dễ tiếp cận cho nhịp thưởng trà hằng ngày.",
    },
  },
  {
    id: "petal-pack",
    slug: "petal-pack",
    name: "Senova Petal Pack",
    line: "petal-pack",
    eyebrow: "MỞ / Trải nghiệm chủ đạo",
    tagline: "Mở một cánh sen, bắt đầu một khoảng lặng.",
    description:
      "Phần trà cho một lần pha, đặt trong túi lọc và được bao quanh bởi cánh sen sấy tạo hình búp sen.",
    shortDescription:
      "Phần trà một ly trong hình dáng búp sen, biến thao tác pha trà thành trải nghiệm giác quan.",
    role: "Mở",
    href: "/products/petal-pack",
    image: "/assets/products/petal-pack.jpg",
    status: "active",
    priceLabel: "Tu 480.000 VND",
    availability: "Lo trai nghiem PP-2601-A dang nhan inquiry",
    variants: [
      { id: "petal-single", label: "Set 6 Petal Pack", note: "Trai nghiem ca nhan" },
      { id: "petal-hosting", label: "Set 18 Petal Pack", note: "Cho tasting va booth" },
    ],
    includedItems: [
      "Petal Pack tao hinh bup sen",
      "Tra tui loc mot ly",
      "The QR cau chuyen va phan hoi",
      "Huong dan nghi thuc mo - pha",
    ],
    dimensions: "Moi Petal Pack duoc bao quan trong khay rieng, hop 18 x 12 x 7 cm",
    brewingNotes: ["Mo tung lop canh sen", "Dung 200 ml nuoc nong", "Cho 5 phut va quet QR trong luc doi"],
    shippingNote: "Hang thu nghiem duoc concierge xac nhan lich giao va dieu kien bao quan.",
    giftOptions: ["Thiep ca nhan hoa", "QR loi nhan", "Goi rieng tung khach moi"],
    badges: ["Signature experience", "QR story", "Limited batch"],
    primaryAction: {
      label: "Bắt đầu trải nghiệm",
      href: "/experience/petal-pack",
    },
    secondaryAction: {
      label: "Gửi phản hồi",
      href: "/feedback/petal-pack",
    },
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
      "Phù hợp cho hoạt động dùng thử, booth trải nghiệm và quà tặng nhỏ",
    ],
    experienceSteps: [
      {
        title: "Mở cánh sen",
        text: "Mở nhẹ từng lớp cánh để quan sát cấu trúc Petal Pack và cảm nhận hình dáng trước khi pha.",
      },
      {
        title: "Cảm nhận",
        text: "Dành một khoảnh khắc để nhìn hình dáng, nhận biết chất liệu và cảm nhận hương trước khi rót nước.",
      },
      {
        title: "Pha trà",
        text: "Đặt phần trà vào cốc và thực hiện theo hướng dẫn in trên bao bì của phiên bản sản phẩm.",
      },
      {
        title: "Chờ",
        text: "Để hương và vị dần hiện ra. Trang QR có thể cung cấp câu chuyện ngắn trong khoảng thời gian này.",
      },
      {
        title: "Thưởng thức",
        text: "Quan sát màu nước, cảm nhận hương và vị, rồi ghi lại phản hồi về trải nghiệm.",
      },
    ],
    seo: {
      title: "Senova Petal Pack | Calmora",
      description:
        "Senova Petal Pack mở trải nghiệm trà hương sen bằng hình dáng búp sen, thao tác cảm nhận và nội dung QR.",
    },
  },
  {
    id: "gift-set",
    slug: "gift-set",
    name: "Senova Gift Set",
    line: "gift-set",
    eyebrow: "TRAO / Quà tặng văn hóa",
    tagline: "Trao hương sen, gửi một lời trân trọng.",
    description:
      "Bộ quà dự kiến kết hợp trà hương sen, Petal Pack, hướng dẫn pha và thẻ câu chuyện trong một hành trình trao tặng thống nhất.",
    shortDescription:
      "Bộ quà trà sen kết hợp sản phẩm, trải nghiệm và câu chuyện văn hóa trong một hành trình hoàn chỉnh.",
    role: "Trao",
    href: "/products/gift-set",
    image: "/assets/products/gift-set.jpg",
    status: "draft",
    priceLabel: "Bao gia theo cau hinh qua tang",
    availability: "Nhan tu van corporate va seasonal gifting",
    variants: [
      { id: "gift-personal", label: "Personal Gift Set", note: "Qua tang ca nhan cao cap" },
      { id: "gift-corporate", label: "Corporate Edition", note: "Cau hinh cho doi tac va su kien" },
    ],
    includedItems: [
      "Senova Classic",
      "Senova Petal Pack",
      "The cau chuyen va huong dan pha",
      "Hop qua cung co loi nhan",
    ],
    dimensions: "Hop qua 28 x 20 x 9 cm, co the dieu chinh theo cau hinh doanh nghiep",
    brewingNotes: ["Bat dau bang loi nhan", "Chon Classic hoac Petal Pack", "Dung QR de tiep tuc cau chuyen"],
    shippingNote: "Concierge xac nhan so luong, ngay giao, ten nguoi nhan va loi nhan truoc khi chot don.",
    giftOptions: ["Dong dau logo doi tac", "Thiep song ngu", "Giao nhieu dia chi", "Phien ban theo mua"],
    badges: ["Gifting", "Corporate", "Custom quote"],
    primaryAction: {
      label: "Đăng ký nhận thông tin",
      href: "/dat-truoc?product=gift-set",
    },
    secondaryAction: {
      label: "Liên hệ tư vấn",
      href: "/contact?topic=gift-set",
    },
    heroAlt: "Bộ quà trà sen Senova Gift Set",
    suitableFor: ["Quà tri ân", "Quà lưu niệm", "Quà đối tác", "Phiên bản theo mùa"],
    highlights: [
      "Kết hợp sản phẩm, trải nghiệm và nội dung văn hóa trong một chỉnh thể",
      "Có thể điều chỉnh lời nhắn và nội dung QR theo dịp trao tặng",
      "Phù hợp với quà tri ân, quà lưu niệm, quà đối tác và phiên bản theo mùa",
      "Người nhận có thể tiếp tục chia sẻ câu chuyện sau khi thưởng thức",
    ],
    experienceSteps: [
      {
        title: "Mở hộp",
        text: "Tiếp cận từng thành phần theo một trình tự rõ ràng, không để phần trang trí lấn át sản phẩm.",
      },
      {
        title: "Đọc lời nhắn",
        text: "Nhận biết dụng ý của người trao và câu chuyện Giữ - Mở - Trao.",
      },
      {
        title: "Chọn trải nghiệm",
        text: "Bắt đầu với Classic cho một tách trà hằng ngày hoặc Petal Pack cho trải nghiệm mở cánh.",
      },
      {
        title: "Tiếp tục câu chuyện",
        text: "Dùng thẻ hoặc QR để đọc thêm và chia sẻ lại ý nghĩa của món quà.",
      },
    ],
    seo: {
      title: "Senova Gift Set | Calmora",
      description:
        "Senova Gift Set là phiên bản quà tặng đang hoàn thiện, kết nối trà hương sen, lời nhắn và câu chuyện văn hóa.",
    },
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function isProductSlug(slug: string): slug is ProductId {
  return productSlugs.includes(slug as ProductId);
}
