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
  "/pre-order": {
    title: "Đăng ký đặt trước Senova | Calmora",
    description:
      "Gửi nhu cầu đặt trước, yêu cầu mẫu thử hoặc đăng ký nhận thông tin sản phẩm Senova.",
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
