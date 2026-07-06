import type { ProductId } from "../features/products/data/products";

export type SeoContent = {
  title: string;
  description: string;
  image?: string;
  robots?: string;
};

export type InfoBlock = {
  label?: string;
  title: string;
  text: string;
};

export type StandardPageContent = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  blocks: InfoBlock[];
  cta?: {
    title: string;
    text: string;
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
  seo: SeoContent;
};

export const canonicalBaseUrl = "https://senova.vn";

export const pageSeo: Record<string, SeoContent> = {
  "/": {
    title: "Senova | Calmora",
    description:
      "Senova là dự án trà sen trải nghiệm do Calmora phát triển, kết nối sản phẩm, nghi thức và câu chuyện Việt.",
  },
  "/about": {
    title: "Giới thiệu Senova | Calmora",
    description:
      "Calmora phát triển Senova như một hệ sản phẩm trà sen trải nghiệm trong hành trình Giữ - Mở - Trao.",
  },
  "/story": {
    title: "Câu chuyện Senova | Calmora",
    description:
      "Một cánh sen mở ra câu chuyện Việt qua mạch kể Giữ - Mở - Trao của Senova.",
  },
  "/products": {
    title: "Bộ sản phẩm Senova | Calmora",
    description:
      "Khám phá Senova Classic, Senova Petal Pack và Senova Gift Set trong cùng một hệ trải nghiệm trà sen.",
  },
  "/experience/classic": {
    title: "Senova Classic QR | Giữ một khoảng lặng mỗi ngày",
    description:
      "Trang QR Senova Classic với câu chuyện văn hóa, hướng dẫn pha trà hằng ngày và phản hồi follow-up theo SKU hoặc mã lô.",
  },
  "/experience/petal-pack": {
    title: "Senova Petal Pack QR | Mở một cánh sen",
    description:
      "Trang QR Senova Petal Pack với câu chuyện mở cánh sen, hướng dẫn trải nghiệm giác quan và phản hồi follow-up theo SKU hoặc mã lô.",
  },
  "/experience/gift-set": {
    title: "Senova Gift Set QR | Một món quà có câu chuyện",
    description:
      "Trang QR Senova Gift Set dành cho người nhận quà, kết nối câu chuyện Giữ - Mở - Trao, hướng dẫn bắt đầu và phản hồi follow-up.",
  },
  "/ritual": {
    title: "Nghi thức thưởng trà Senova | Calmora",
    description:
      "Chuỗi thao tác mở, cảm nhận, pha, chờ và thưởng thức do Senova thiết kế cho trải nghiệm trà sen.",
  },
  "/seasonal": {
    title: "Mùa sen | Calmora",
    description:
      "Không gian nội dung theo mùa của Senova, nơi hương sen, ký ức và câu chuyện gặp nhau.",
  },
  "/dat-truoc": {
    title: "Đăng ký mẫu thử Senova | Calmora",
    description:
      "Đăng ký quan tâm mẫu thử và góp phản hồi validation cho Senova Petal Pack, Senova Gift Set.",
  },
  "/pre-order": {
    title: "Đăng ký mẫu thử Senova | Calmora",
    description:
      "Đăng ký quan tâm mẫu thử và góp phản hồi validation cho Senova Petal Pack, Senova Gift Set.",
  },
  "/contact": {
    title: "Liên hệ Senova | Calmora",
    description:
      "Liên hệ Calmora về sản phẩm Senova, mẫu thử, sự kiện, phân phối hoặc hợp tác thương hiệu.",
  },
  "/partners": {
    title: "Hợp tác cùng Senova | Calmora",
    description:
      "Kết nối với Calmora cho hợp tác nguyên liệu, sản xuất, phân phối và trải nghiệm thương hiệu Senova.",
  },
  "/thank-you": {
    title: "Senova đã ghi nhận thông tin | Calmora",
    description: "Cảm ơn bạn đã gửi thông tin cho Senova.",
    robots: "noindex,follow",
  },
  "/privacy": {
    title: "Chính sách dữ liệu | Calmora",
    description: "Cách Senova thu thập, sử dụng và lưu trữ dữ liệu biểu mẫu.",
  },
  "/terms": {
    title: "Điều khoản sử dụng | Calmora",
    description: "Điều khoản sử dụng website giới thiệu và thử nghiệm sản phẩm Senova.",
  },
  "/collections": {
    title: "Collections Senova | Calmora",
    description: "Cac bo suu tap Senova theo ritual, gifting va concierge preorder.",
  },
  "/collections/signature": {
    title: "Signature Collection Senova | Calmora",
    description: "Classic, Petal Pack va Gift Set trong mot hanh trinh Giu - Mo - Trao.",
  },
  "/collections/gifting": {
    title: "Gifting Collection Senova | Calmora",
    description: "Qua tang Senova co loi nhan, QR, bao bi va lich giao qua concierge.",
  },
  "/collections/daily-ritual": {
    title: "Daily Ritual Collection Senova | Calmora",
    description: "Nhung cau hinh Senova cho khoang lang thuong tra hang ngay.",
  },
  "/search": {
    title: "Tim kiem Senova | Calmora",
    description: "Tim san pham, gift edit va ritual phu hop trong he sinh thai Senova.",
  },
  "/wishlist": {
    title: "Wishlist Senova | Calmora",
    description: "Luu lai nhung cau hinh san pham Senova dang duoc quan tam.",
    robots: "noindex,follow",
  },
  "/bag": {
    title: "Inquiry Bag Senova | Calmora",
    description: "Gio yeu cau san pham Senova truoc khi concierge xac nhan.",
    robots: "noindex,follow",
  },
  "/checkout": {
    title: "Concierge Checkout Senova | Calmora",
    description: "Gui yeu cau dat truoc, qua tang hoac tasting cho concierge Senova.",
    robots: "noindex,follow",
  },
  "/checkout/thank-you": {
    title: "Senova da ghi nhan inquiry | Calmora",
    description: "Concierge Senova da ghi nhan yeu cau va se phan hoi.",
    robots: "noindex,follow",
  },
  "/gifting": {
    title: "Gifting Senova | Calmora",
    description: "Qua tang tra sen cao cap voi loi nhan, bao bi va lich giao duoc concierge xac nhan.",
  },
  "/corporate-gifting": {
    title: "Corporate Gifting Senova | Calmora",
    description: "Qua tang doi tac Senova voi cau hinh so luong, ca nhan hoa va concierge review.",
  },
  "/concierge": {
    title: "Concierge Senova | Calmora",
    description: "Tu van san pham, gift set, tasting va preorder Senova qua concierge.",
  },
  "/private-tasting": {
    title: "Private Tasting Senova | Calmora",
    description: "Dat lich tasting rieng cho Senova Classic, Petal Pack va Gift Set.",
  },
  "/shipping": {
    title: "Giao hang Senova | Calmora",
    description: "Thong tin giao hang va dieu kien bao quan san pham Senova.",
  },
  "/returns": {
    title: "Doi tra Senova | Calmora",
    description: "Chinh sach doi tra mock cho giai doan concierge preorder Senova.",
  },
  "/faq": {
    title: "FAQ Senova | Calmora",
    description: "Cau hoi thuong gap ve preorder, gifting, QR va private tasting Senova.",
  },
  "/care": {
    title: "Cham soc san pham Senova | Calmora",
    description: "Huong dan bao quan, pha tra va cham soc Gift Set Senova.",
  },
  "/account": {
    title: "Tai khoan Senova | Calmora",
    description: "Ho so khach hang mock cho wishlist va inquiry Senova.",
    robots: "noindex,follow",
  },
  "/account/orders": {
    title: "Inquiry history Senova | Calmora",
    description: "Trang thai cac yeu cau concierge Senova.",
    robots: "noindex,follow",
  },
  "/account/wishlist": {
    title: "Wishlist tai khoan Senova | Calmora",
    description: "San pham Senova da luu trong tai khoan mock.",
    robots: "noindex,follow",
  },
  "/order-status": {
    title: "Theo doi yeu cau Senova | Calmora",
    description: "Tra cuu trang thai inquiry Senova bang ma mau.",
    robots: "noindex,follow",
  },
  "/journal": {
    title: "Journal Senova | Calmora",
    description: "Editorial notes ve tra sen, gifting va seasonal ritual cua Senova.",
  },
  "/journal/gift-language": {
    title: "Gift Language | Senova Journal",
    description: "Mot ghi chu ve ngon ngu qua tang cao cap cua Senova.",
  },
  "/journal/petal-ritual": {
    title: "Petal Ritual | Senova Journal",
    description: "Vi sao thao tac mo canh la mot phan cua trai nghiem Petal Pack.",
  },
  "/journal/seasonal-lotus": {
    title: "Seasonal Lotus | Senova Journal",
    description: "Mua sen nhu mot nguyen tac bien tap cho Senova.",
  },
  "/404": {
    title: "Không tìm thấy trang | Calmora",
    description: "Đường dẫn có thể đã thay đổi hoặc không tồn tại.",
    robots: "noindex,follow",
  },
};

export const standardPages: Record<string, StandardPageContent> = {
  "/ritual": {
    path: "/ritual",
    eyebrow: "Nghi thức trải nghiệm",
    title: "Mở - cảm nhận - pha - chờ - thưởng thức.",
    description:
      "Một chuỗi thao tác do Senova thiết kế để người dùng dành sự chú ý cho hình dáng, hương vị và khoảng thời gian thưởng trà.",
    blocks: [
      {
        label: "01 / Nhìn",
        title: "Quan sát trước khi mở",
        text: "Nhìn hình dáng sản phẩm, chất liệu và cách đóng gói trước khi bắt đầu thao tác.",
      },
      {
        label: "02 / Mở",
        title: "Mở nhẹ, không vội",
        text: "Với Petal Pack, tách nhẹ cánh sen để cảm nhận hình dáng và hương, theo đúng hướng dẫn của phiên bản sản phẩm.",
      },
      {
        label: "03 / Cảm nhận",
        title: "Ghi nhận giác quan",
        text: "Nhận biết hình dáng, chất liệu và hương trước khi rót nước.",
      },
      {
        label: "04 / Pha",
        title: "Pha theo thông số bao bì",
        text: "Dùng lượng nước và thời gian được in trên bao bì của đúng phiên bản sản phẩm.",
      },
      {
        label: "05 / Chờ",
        title: "Để hương vị hiện ra",
        text: "Dành thời gian để hương sen và vị trà dần ổn định trước khi uống.",
      },
      {
        label: "06 / Thưởng thức",
        title: "Quan sát màu nước, hương và vị",
        text: "Thưởng thức chậm, sau đó có thể gửi phản hồi để Senova cải tiến sản phẩm.",
      },
    ],
    cta: {
      title: "Chọn một hình thức thưởng trà",
      text: "Mỗi dòng sản phẩm giữ một vai trò khác nhau trong cùng hành trình Giữ - Mở - Trao.",
      primary: { label: "Xem bộ sản phẩm", href: "/products" },
      secondary: { label: "Mở trải nghiệm Petal Pack", href: "/experience/petal-pack" },
    },
    seo: pageSeo["/ritual"],
  },
  "/seasonal": {
    path: "/seasonal",
    eyebrow: "Mùa sen",
    title: "Những thời điểm để hương, ký ức và câu chuyện gặp nhau.",
    description:
      "Không gian nội dung theo mùa của Senova, nơi bối cảnh văn hóa được giới thiệu mà không biến địa danh thành nhãn trang trí cho sản phẩm.",
    blocks: [
      {
        label: "Bối cảnh",
        title: "Mùa như một nhịp kể",
        text: "Senova dùng mùa sen để mở rộng câu chuyện về hương, ký ức và thói quen thưởng trà trong hiện tại.",
      },
      {
        label: "Biên tập",
        title: "Không tuyệt đối hóa biểu tượng",
        text: "Nội dung theo mùa được biên tập như chất liệu văn hóa tham khảo, tránh biến sen thành cam kết lịch sử hoặc nhãn trang trí.",
      },
      {
        label: "Ứng dụng",
        title: "Phiên bản thử nghiệm theo dịp",
        text: "Gift Set và nội dung QR có thể được điều chỉnh theo mùa, dịp trao tặng hoặc bối cảnh sự kiện.",
      },
    ],
    cta: {
      title: "Đưa mùa sen vào một trải nghiệm cụ thể",
      text: "Nếu bạn đang chuẩn bị sự kiện hoặc quà tặng theo mùa, Senova có thể cùng phát triển nội dung phù hợp.",
      primary: { label: "Liên hệ hợp tác", href: "/partners" },
      secondary: { label: "Xem Gift Set", href: "/products/gift-set" },
    },
    seo: pageSeo["/seasonal"],
  },
  "/privacy": {
    path: "/privacy",
    eyebrow: "Chính sách dữ liệu",
    title: "Dữ liệu được thu thập để phục vụ trải nghiệm Senova.",
    description:
      "Website chỉ yêu cầu các thông tin cần thiết cho phản hồi, đặt trước, liên hệ và hợp tác.",
    blocks: [
      {
        title: "Loại dữ liệu",
        text: "Biểu mẫu có thể thu thập tên, email, số điện thoại, sản phẩm quan tâm, nội dung phản hồi và nhu cầu liên hệ.",
      },
      {
        title: "Mục đích sử dụng",
        text: "Dữ liệu được dùng để phản hồi yêu cầu, cải tiến sản phẩm, tổng hợp nhu cầu và chuẩn bị kế hoạch thử nghiệm.",
      },
      {
        title: "Lưu trữ và quyền yêu cầu",
        text: "Bạn có thể yêu cầu cập nhật hoặc xóa dữ liệu bằng cách liên hệ hello@senova.vn. Senova không bán dữ liệu cá nhân.",
      },
      {
        title: "Dữ liệu khảo sát",
        text: "Phản hồi có thể được dùng ở dạng tổng hợp, không công khai thông tin cá nhân trên website.",
      },
    ],
    seo: pageSeo["/privacy"],
  },
  "/terms": {
    path: "/terms",
    eyebrow: "Điều khoản sử dụng",
    title: "Website phục vụ giới thiệu và thử nghiệm sản phẩm Senova.",
    description:
      "Các thông tin trên website có thể được cập nhật khi sản phẩm, nội dung và kế hoạch vận hành thay đổi.",
    blocks: [
      {
        title: "Tính chất nội dung",
        text: "Hình ảnh mockup và mô tả sản phẩm không mặc nhiên đại diện cho phiên bản thương mại cuối cùng.",
      },
      {
        title: "Đặt trước",
        text: "Thông tin đăng ký đặt trước giúp Senova đo lường nhu cầu và chưa phải giao dịch thanh toán.",
      },
      {
        title: "Tài sản thương hiệu",
        text: "Không sao chép logo, hình ảnh, nội dung hoặc tài sản thương hiệu Calmora | Senova khi chưa được chấp thuận.",
      },
      {
        title: "Nội dung bên thứ ba",
        text: "Website có thể dẫn đến nguồn ngoài trong tương lai; Senova không chịu trách nhiệm cho nội dung ngoài phạm vi vận hành của mình.",
      },
    ],
    seo: pageSeo["/terms"],
  },
};

export const thankYouMessages: Record<string, { title: string; text: string }> = {
  feedback: {
    title: "Cảm ơn bạn đã phản hồi.",
    text: "Những ghi nhận của bạn sẽ giúp Senova cải tiến sản phẩm và trải nghiệm trong các phiên bản tiếp theo.",
  },
  "pre-order": {
    title: "Yêu cầu của bạn đã được ghi nhận.",
    text: "Nhóm Senova sẽ liên hệ khi có thông tin phù hợp với sản phẩm đã chọn.",
  },
  "sample-interest": {
    title: "Phiếu quan tâm mẫu thử đã được ghi nhận.",
    text: "Nhóm Senova sẽ tổng hợp phản hồi ẩn danh cho Petal Pack / Gift Set và liên hệ khi có lịch mẫu thử phù hợp.",
  },
  contact: {
    title: "Nội dung liên hệ đã được gửi.",
    text: "Nhóm Senova dự kiến phản hồi trong 1-3 ngày làm việc.",
  },
  partners: {
    title: "Đề xuất hợp tác đã được ghi nhận.",
    text: "Calmora sẽ xem xét nội dung và phản hồi khi có hướng trao đổi phù hợp.",
  },
};

export type QrRecord = {
  code: string;
  productSlug: ProductId;
  batchCode?: string;
  destination: string;
  active: boolean;
  createdAt: string;
  expiresAt?: string;
};

export const qrRecords: QrRecord[] = [
  {
    code: "PP-2601-A",
    productSlug: "petal-pack",
    batchCode: "PP-2601-A",
    destination: "/experience/petal-pack",
    active: true,
    createdAt: "2026-01-01",
  },
  {
    code: "CL-2601-A",
    productSlug: "classic",
    batchCode: "CL-2601-A",
    destination: "/experience/classic",
    active: true,
    createdAt: "2026-01-01",
  },
  {
    code: "GS-2601-A",
    productSlug: "gift-set",
    batchCode: "GS-2601-A",
    destination: "/experience/gift-set",
    active: true,
    createdAt: "2026-01-01",
  },
  {
    code: "PP-2509-X",
    productSlug: "petal-pack",
    batchCode: "PP-2509-X",
    destination: "/experience/petal-pack",
    active: false,
    createdAt: "2025-09-01",
  },
];

export function getQrRecord(code: string) {
  const normalizedCode = code.trim().toUpperCase();
  return qrRecords.find((record) => record.code === normalizedCode);
}
