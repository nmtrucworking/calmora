import type { Language } from "@app/providers/LanguageContext";
import type { LocalizedText } from "@features/about/data/aboutContent";

export type TeamMember = {
  id: "nguyen-minh-truc" | "tran-quoc-khanh" | "nguyen-ngoc-thao-vy";
  name: string;
  monogram: string;
  role: LocalizedText;
  shortBio: LocalizedText;
  responsibilities: Record<Language, readonly string[]>;
};

export const teamMembers: readonly TeamMember[] = [
  {
    id: "nguyen-minh-truc",
    name: "Nguyễn Minh Trúc",
    monogram: "MT",
    role: { vi: "Trưởng nhóm · Công nghệ, dữ liệu và trải nghiệm số", en: "Team Lead · Technology, Data & Digital Experience" },
    shortBio: {
      vi: "Phụ trách định hướng sản phẩm số, kiến trúc website, hệ thống QR, phân tích dữ liệu khảo sát và quản trị tài liệu triển khai.",
      en: "Leads digital product direction, website architecture, the QR system, survey data analysis and implementation documentation.",
    },
    responsibilities: {
      vi: ["Định hướng sản phẩm", "Website và trải nghiệm QR", "Phân tích khảo sát và dữ liệu", "Kiến trúc truy xuất", "Tài liệu và điều phối"],
      en: ["Product direction", "Website and QR experience", "Survey and data analysis", "Traceability architecture", "Documentation and coordination"],
    },
  },
  {
    id: "tran-quoc-khanh",
    name: "Trần Quốc Khánh",
    monogram: "QK",
    role: { vi: "Mô hình kinh doanh và vận hành", en: "Business Model & Operations" },
    shortBio: {
      vi: "Phụ trách mô hình kinh doanh, chiến lược doanh thu, chi phí, kênh triển khai và phương án vận hành theo từng giai đoạn.",
      en: "Leads the business model, revenue strategy, costs, channels and the operating approach for each stage.",
    },
    responsibilities: {
      vi: ["Mô hình kinh doanh", "Giá và logic doanh thu", "Giả định chi phí và dòng tiền", "Phân phối và hợp tác", "Vận hành thử nghiệm"],
      en: ["Business model", "Pricing and revenue logic", "Cost and cash-flow assumptions", "Distribution and partnerships", "Pilot operations"],
    },
  },
  {
    id: "nguyen-ngoc-thao-vy",
    name: "Nguyễn Ngọc Thảo Vy",
    monogram: "TV",
    role: { vi: "Sản phẩm, dược và kiểm soát chất lượng", en: "Product, Pharmacy & Quality Control" },
    shortBio: {
      vi: "Phụ trách góc nhìn nguyên liệu, bảo quản, rủi ro chất lượng và các yêu cầu cần kiểm chứng trước khi sản phẩm được mở rộng.",
      en: "Leads the review of materials, storage, quality risks and the requirements to validate before a product is expanded.",
    },
    responsibilities: {
      vi: ["Rà soát nguyên liệu", "Câu hỏi về bảo quản và độ ổn định", "Rủi ro chất lượng", "Hỗ trợ thử cảm quan", "Danh mục an toàn và tuân thủ"],
      en: ["Material review", "Storage and stability questions", "Quality risks", "Sensory-test support", "Safety and compliance checklist"],
    },
  },
];

export const teamContent = {
  hero: {
    eyebrow: { vi: "Đội ngũ Calmora", en: "The Calmora team" },
    title: { vi: "Ba chuyên môn, một bài toán chung.", en: "Three disciplines, one shared problem." },
    description: {
      vi: "Senova được phát triển bởi đội ngũ liên ngành từ công nghệ và dữ liệu, quản trị kinh doanh và dược. Mỗi chuyên môn phụ trách một nhóm giả định và rủi ro khác nhau của dự án.",
      en: "Senova is developed by an interdisciplinary team spanning technology and data, business administration and pharmacy. Each discipline addresses a different group of assumptions and risks within the project.",
    },
  },
  members: {
    eyebrow: { vi: "Những người thực hiện", en: "The people doing the work" },
    title: { vi: "Trách nhiệm được gọi tên rõ ràng.", en: "Responsibilities, clearly named." },
    responsibilitiesLabel: { vi: "Phạm vi phụ trách", en: "Areas of responsibility" },
  },
  matrix: {
    eyebrow: { vi: "Cấu trúc liên ngành", en: "Interdisciplinary structure" },
    title: { vi: "Vì sao Senova cần một đội ngũ liên ngành?", en: "Why does Senova need an interdisciplinary team?" },
    columnCapability: { vi: "Năng lực", en: "Capability" },
    columnDecisions: { vi: "Nhóm quyết định và rủi ro", en: "Decisions and risks" },
    rows: {
      vi: [
        ["Công nghệ và dữ liệu", "Website, QR, dữ liệu phản hồi, truy xuất, đo lường"],
        ["Quản trị kinh doanh", "Khách hàng, giá, dòng tiền, tồn kho, kênh bán"],
        ["Dược và sản phẩm", "Nguyên liệu, độ ổn định, bảo quản, chất lượng"],
        ["Văn hóa và nghệ thuật", "Diễn giải biểu tượng, bối cảnh, ngôn ngữ kể chuyện"],
        ["Phát triển bền vững", "Chuỗi giá trị, tác động và tính khả thi dài hạn"],
      ],
      en: [
        ["Technology and data", "Website, QR, feedback data, traceability and measurement"],
        ["Business administration", "Customers, pricing, cash flow, inventory and channels"],
        ["Pharmacy and product", "Materials, stability, storage and quality"],
        ["Culture and the arts", "Symbolic interpretation, context and narrative language"],
        ["Sustainable development", "Value chain, impact and long-term feasibility"],
      ],
    },
  },
  advisors: {
    eyebrow: { vi: "Định hướng chuyên môn", en: "Academic guidance" },
    title: { vi: "Giảng viên hướng dẫn", en: "Faculty advisors" },
    description: {
      vi: "Đội ngũ nhận định hướng ở những lớp quyết định cần thêm góc nhìn về phát triển bền vững, văn hóa và nghệ thuật.",
      en: "The team receives guidance where decisions require additional perspectives on sustainability, culture and the arts.",
    },
    people: [
      { name: "Cô Ngân", unit: { vi: "Viện Ứng dụng Phát triển bền vững", en: "Institute of Applied Sustainable Development" } },
      { name: "TS. Vũ Huyền Trang", unit: { vi: "Khoa Ngoại ngữ · Định hướng nghệ thuật và văn hóa", en: "Faculty of Foreign Languages · Arts and cultural guidance" } },
    ],
  },
  principles: {
    eyebrow: { vi: "Nguyên tắc làm việc", en: "Working principles" },
    title: { vi: "Cách đội ngũ ra quyết định.", en: "How the team makes decisions." },
    items: {
      vi: [
        ["Phân biệt dữ liệu và giả định", "Nội dung chưa kiểm chứng phải được đánh dấu."],
        ["Ưu tiên nguyên mẫu nhỏ", "Không tạo gánh nặng tồn kho trước khi có tín hiệu."],
        ["Kiểm tra trải nghiệm vật lý trước", "QR chỉ mở rộng câu chuyện."],
        ["Không đánh đổi tính chính xác", "Tránh tuyên bố vượt dữ liệu để lấy hiệu ứng truyền thông."],
        ["Ghi nhận phản hồi thành quyết định", "Mỗi vòng thử phải tạo ra thay đổi cụ thể."],
      ],
      en: [
        ["Separate data from assumptions", "Unvalidated content must be identified."],
        ["Prefer small prototypes", "Avoid inventory commitments before there is a signal."],
        ["Test the physical experience first", "QR should only extend the story."],
        ["Do not trade accuracy for effect", "Avoid claims that go beyond the available data."],
        ["Turn feedback into decisions", "Every test cycle should lead to a concrete change."],
      ],
    },
  },
  cta: {
    eyebrow: { vi: "Cùng làm việc", en: "Work with us" },
    title: { vi: "Cùng hoàn thiện một trải nghiệm trà sen có cơ sở.", en: "Help shape a lotus tea experience with a clear basis." },
    body: {
      vi: "Chúng tôi chào đón những trao đổi cụ thể về nguyên liệu, sản xuất, thử nghiệm, trải nghiệm và nội dung văn hóa.",
      en: "We welcome focused conversations about ingredients, production, testing, experience design and cultural content.",
    },
    primary: { label: { vi: "Đề xuất hợp tác", en: "Propose a partnership" }, href: "/partners" },
    secondary: { label: { vi: "Liên hệ nhóm", en: "Contact the team" }, href: "/contact" },
  },
} as const;
