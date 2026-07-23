import type { Language } from "@app/providers/LanguageContext";

export type LocalizedText = Record<Language, string>;

type LinkCopy = {
  label: LocalizedText;
  href: string;
};

export type BrandPrinciple = {
  id: "keep" | "open" | "share";
  index: string;
  label: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
};

export const aboutContent = {
  hero: {
    eyebrow: {
      vi: "Calmora · Thương hiệu khởi tạo Senova",
      en: "Calmora · The brand behind Senova",
    },
    title: {
      vi: "Làm mới chất liệu Việt bằng ngôn ngữ sản phẩm hiện đại.",
      en: "Reframing Vietnamese cultural materials through contemporary product design.",
    },
    description: {
      vi: "Calmora phát triển những sản phẩm lấy cảm hứng từ chất liệu bản địa, được thiết kế để có thể sử dụng, cảm nhận và trao tặng trong đời sống hiện đại. Senova là dự án đầu tiên của Calmora, bắt đầu từ trà hương sen Việt.",
      en: "Calmora develops products inspired by local cultural materials, designed to be used, sensed and shared in contemporary life. Senova is Calmora’s first project, beginning with Vietnamese lotus-scented tea.",
    },
    primary: { label: { vi: "Khám phá lý tưởng Calmora", en: "Discover Calmora’s principles" }, href: "#brand-ideal" } satisfies LinkCopy,
    secondary: { label: { vi: "Gặp đội ngũ", en: "Meet the team" }, href: "/team" } satisfies LinkCopy,
  },
  startingQuestion: {
    eyebrow: { vi: "Điểm khởi đầu", en: "The starting point" },
    title: {
      vi: "Làm thế nào để một giá trị truyền thống tiếp tục sống trong hiện tại?",
      en: "How can a traditional value continue to live in the present?",
    },
    paragraphs: {
      vi: [
        "Nhiều sản phẩm truyền thống vẫn còn giá trị về hương vị, ký ức và văn hóa, nhưng cách tiếp cận thường chưa phù hợp với hành vi sử dụng của người dùng hôm nay.",
        "Calmora không chọn sao chép nguyên trạng quá khứ, cũng không biến bản sắc thành một lớp trang trí. Chúng tôi tìm kiếm một cấu trúc mới, nơi sản phẩm, thao tác và câu chuyện cùng tồn tại trong một trải nghiệm thống nhất.",
      ],
      en: [
        "Many traditional products still carry meaningful taste, memory and culture, yet their current forms may not fit how people live and use products today.",
        "Calmora does not seek to reproduce the past unchanged, nor to reduce identity to decoration. We look for a new structure in which product, gesture and story form one coherent experience.",
      ],
    },
    quote: {
      vi: "Một giá trị chỉ thật sự tiếp tục khi con người còn có thể sử dụng, cảm nhận và trao nó cho người khác.",
      en: "A value truly continues when people can still use it, sense it and pass it on to someone else.",
    },
  },
  vision: {
    title: { vi: "Tầm nhìn", en: "Vision" },
    text: {
      vi: "Đưa chất liệu văn hóa Việt trở thành những trải nghiệm có thể sử dụng, ghi nhớ và tiếp tục được trao đi.",
      en: "Turn Vietnamese cultural materials into experiences that can be used, remembered and passed on.",
    },
  },
  mission: {
    title: { vi: "Sứ mệnh", en: "Mission" },
    text: {
      vi: "Calmora nghiên cứu và tái thiết kế sản phẩm bản địa từ hình thức, thao tác sử dụng, cảm giác vật liệu đến nội dung số, nhằm giúp giá trị truyền thống trở nên rõ ràng và dễ tiếp cận hơn trong đời sống hiện đại.",
      en: "Calmora studies and redesigns local products across form, gesture, material feeling and digital content, helping traditional values become clearer and more accessible in contemporary life.",
    },
  },
  ideal: {
    title: { vi: "Lý tưởng đổi mới", en: "Our ideal of innovation" },
    text: {
      vi: "Đổi mới không phải là thay thế giá trị cũ. Đổi mới là tạo ra một hình thức mới để giá trị ấy tiếp tục được sử dụng.",
      en: "Innovation does not mean replacing what came before. It means creating a new form through which that value can continue to be used.",
    },
  },
  principles: {
    eyebrow: { vi: "Ba nguyên tắc thương hiệu", en: "Three brand principles" },
    title: { vi: "Giữ điều còn sống. Mở cách tiếp cận. Trao đi có bối cảnh.", en: "Keep what still lives. Open a new approach. Share it with context." },
    items: [
      {
        id: "keep",
        index: "01",
        label: { vi: "Giữ", en: "Keep" },
        title: { vi: "Giữ một giá trị còn sống.", en: "Keep a value that is still alive." },
        text: {
          vi: "Trà hương sen được đặt trong hình thức dễ tiếp cận để người dùng hôm nay có thể sử dụng và tìm thấy ý nghĩa. Giữ không có nghĩa là đóng băng sản phẩm trong quá khứ.",
          en: "Lotus-scented tea is placed in an approachable form so people today can use it and find meaning. Keeping does not mean freezing a product in the past.",
        },
      },
      {
        id: "open",
        index: "02",
        label: { vi: "Mở", en: "Open" },
        title: { vi: "Mở một trải nghiệm có chủ đích.", en: "Open an intentional experience." },
        text: {
          vi: "Hình dáng, thao tác, hương và vị cùng dẫn người dùng bước vào một khoảng thưởng trà. Văn hóa được chuyển từ nội dung để đọc thành trải nghiệm để thực hiện.",
          en: "Form, gesture, aroma and taste lead people into a moment for tea. Culture moves from something to read into an experience to perform.",
        },
      },
      {
        id: "share",
        index: "03",
        label: { vi: "Trao", en: "Share" },
        title: { vi: "Trao một câu chuyện có bối cảnh.", en: "Share a story with context." },
        text: {
          vi: "Một món quà có giá trị khi người trao chuẩn bị được lời nhắn, trình tự và câu chuyện để người nhận có thể tiếp tục trải nghiệm.",
          en: "A gift gains value when its message, sequence and story are prepared so the recipient can continue the experience.",
        },
      },
    ] satisfies BrandPrinciple[],
  },
  method: {
    eyebrow: { vi: "Phương pháp phát triển", en: "Development method" },
    title: { vi: "Bắt đầu nhỏ, kiểm chứng rõ, mở rộng có kiểm soát.", en: "Start small, validate clearly, expand with control." },
    description: {
      vi: "Calmora xem mỗi sản phẩm mới là một tập hợp giả định cần được kiểm chứng: người dùng có hiểu cách sử dụng không, trải nghiệm có tạo giá trị thật không, sản phẩm có thể ổn định và sản xuất được không, và mức giá có phù hợp với giá trị cảm nhận hay không.",
      en: "Calmora treats every new product as a set of assumptions to validate: whether people understand its use, whether the experience creates real value, whether it can be made consistently and whether its price fits the value perceived.",
    },
    note: {
      vi: "Đây là phương pháp phát triển Calmora lựa chọn cho giai đoạn nguyên mẫu và kiểm chứng.",
      en: "This is the development method Calmora has chosen for its prototyping and validation stage.",
    },
    items: {
      vi: [
        ["Quan sát", "Xác định hành vi, điểm gãy và bối cảnh sử dụng."],
        ["Đặt giả định", "Phân biệt điều đã biết với điều cần kiểm chứng."],
        ["Tạo nguyên mẫu nhỏ", "Ưu tiên mẫu đủ để thử thay vì đầu tư tồn kho sớm."],
        ["Thử nghiệm", "Kiểm tra cảm quan, thao tác, nội dung và ý định mua."],
        ["Chuẩn hóa", "Hoàn thiện quy trình, tiêu chí chất lượng và dữ liệu."],
        ["Mở rộng", "Chỉ mở rộng khi sản phẩm, vận hành và dòng tiền có cơ sở."],
      ],
      en: [
        ["Observe", "Identify behaviours, friction and contexts of use."],
        ["Frame assumptions", "Separate what is known from what needs validation."],
        ["Prototype small", "Build enough to test before committing to inventory."],
        ["Test", "Review sensory quality, gestures, content and purchase intent."],
        ["Standardize", "Refine the process, quality criteria and data."],
        ["Expand", "Scale only when product, operations and cash flow have a basis."],
      ],
    },
  },
  senova: {
    eyebrow: { vi: "Dự án đầu tiên", en: "The first project" },
    title: { vi: "Senova là cách Calmora bắt đầu từ một cánh sen.", en: "Senova is how Calmora begins with a lotus petal." },
    body: {
      vi: "Senova lấy trà hương sen làm sản phẩm lõi và thiết kế lại hành trình mở – pha – thưởng thức – trao tặng. Ba dòng sản phẩm không phải ba câu chuyện tách rời; chúng tạo thành ba vai trò trong cùng một hệ trải nghiệm.",
      en: "Senova begins with lotus-scented tea and redesigns the journey of opening, brewing, tasting and gifting. Its three products are not separate stories; they play three roles in one experience system.",
    },
    roles: {
      vi: [
        ["Classic · Giữ", "Đưa trà hương sen vào nhịp dùng hằng ngày."],
        ["Petal Pack · Mở", "Biến hình dáng và thao tác pha thành điểm chạm giác quan."],
        ["Gift Set · Trao", "Đưa trà, hướng dẫn và câu chuyện vào một món quà có chuẩn bị."],
      ],
      en: [
        ["Classic · Keep", "Brings lotus-scented tea into an everyday rhythm."],
        ["Petal Pack · Open", "Turns form and brewing gestures into sensory touchpoints."],
        ["Gift Set · Share", "Places tea, guidance and story inside a prepared gift."],
      ],
    },
    cta: { label: { vi: "Khám phá hệ sản phẩm", en: "Explore the product system" }, href: "/products" } satisfies LinkCopy,
  },
  responsibility: {
    eyebrow: { vi: "Trách nhiệm văn hóa", en: "Cultural responsibility" },
    title: { vi: "Kể chuyện văn hóa cần đi cùng trách nhiệm.", en: "Cultural storytelling requires responsibility." },
    body: {
      vi: "Calmora không xem sen là một biểu tượng có thể gắn tùy ý lên mọi sản phẩm. Mỗi diễn giải cần được đối chiếu với nguồn, bối cảnh và người có chuyên môn. Website phải phân biệt rõ câu chuyện thương hiệu, dữ liệu lịch sử, diễn giải thiết kế và giả định đang được kiểm chứng.",
      en: "Calmora does not treat the lotus as a symbol to place arbitrarily on any product. Every interpretation should be checked against sources, context and relevant expertise. The website distinguishes brand narrative, historical data, design interpretation and assumptions under validation.",
    },
    principles: {
      vi: [
        "Không gán ý nghĩa tuyệt đối cho biểu tượng sen.",
        "Không biến một địa danh thành nhãn trang trí khi thiếu quan hệ thực tế.",
        "Không gọi một thao tác mới là nghi thức truyền thống.",
        "Không dùng QR để thay thế toàn bộ trải nghiệm vật lý.",
        "Không công bố nguồn gốc, kiểm nghiệm hoặc chất lượng khi chưa có hồ sơ.",
      ],
      en: [
        "Do not assign absolute meanings to the lotus symbol.",
        "Do not turn a place into decoration without a real relationship.",
        "Do not call a newly designed gesture a traditional ritual.",
        "Do not let QR replace the physical experience.",
        "Do not claim origin, testing or quality without documentation.",
      ],
    },
  },
  team: {
    eyebrow: { vi: "Đội ngũ liên ngành", en: "An interdisciplinary team" },
    title: { vi: "Một bài toán văn hóa – sản phẩm cần nhiều góc nhìn cùng làm việc.", en: "A cultural product problem needs several perspectives working together." },
    body: {
      vi: "Senova được phát triển bởi đội ngũ từ công nghệ và dữ liệu, quản trị kinh doanh và dược; đồng thời nhận định hướng từ giảng viên về phát triển bền vững, văn hóa và nghệ thuật.",
      en: "Senova is developed by a team spanning technology and data, business administration and pharmacy, with faculty guidance in sustainability, culture and the arts.",
    },
    cta: { label: { vi: "Gặp đội ngũ Calmora", en: "Meet the Calmora team" }, href: "/team" } satisfies LinkCopy,
  },
  finalCta: {
    eyebrow: { vi: "Senova by Calmora", en: "Senova by Calmora" },
    title: { vi: "Từ một cánh sen đến một trải nghiệm có thể tiếp tục.", en: "From one lotus petal to an experience that can continue." },
    body: {
      vi: "Khám phá hệ sản phẩm Senova hoặc trao đổi với nhóm về nguyên liệu, thử nghiệm, hợp tác và quà tặng.",
      en: "Explore the Senova product system or speak with the team about ingredients, testing, partnerships and gifting.",
    },
    primary: { label: { vi: "Khám phá sản phẩm", en: "Explore products" }, href: "/products" } satisfies LinkCopy,
    secondary: { label: { vi: "Trao đổi hợp tác", en: "Discuss a partnership" }, href: "/partners" } satisfies LinkCopy,
  },
} as const;
