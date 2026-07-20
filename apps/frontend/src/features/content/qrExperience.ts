import type { ProductId } from "@features/products/data/products";

export type QrExperienceStep = {
  label: string;
  title: string;
  text: string;
};

export type QrExperienceContent = {
  productSlug: ProductId;
  version: string;
  contentViewed: string;
  eyebrow: string;
  title: string;
  lede: string;
  storyTitle: string;
  storyParagraphs: string[];
  guidanceTitle: string;
  guidanceIntro: string;
  guidanceSteps: QrExperienceStep[];
  prompt: string;
};

export const qrExperienceContent: Record<ProductId, QrExperienceContent> = {
  classic: {
    productSlug: "classic",
    version: "v1",
    contentViewed: "classic-scan",
    eyebrow: "QR Senova Classic / Giữ",
    title: "Giữ một khoảng lặng mỗi ngày.",
    lede:
      "Classic là điểm bắt đầu của Senova: một phần trà hương sen gọn, dễ pha và đủ chậm để hương sen tiếp tục hiện diện trong đời sống thường ngày.",
    storyTitle: "Câu chuyện phía sau",
    storyParagraphs: [
      "Giữ một giá trị không có nghĩa là giữ nguyên mọi hình thức cũ. Classic tạo một điểm tiếp cận đơn giản để người dùng bắt đầu nhận biết hương sen, vị trà và khoảng lặng của việc thưởng thức.",
      "Một phần trà, một chiếc cốc và vài phút được dành riêng đã đủ để biến việc pha trà thành một nhịp nghỉ có chủ đích.",
    ],
    guidanceTitle: "Cách bắt đầu",
    guidanceIntro: "Dành cho một tách trà hằng ngày, không cần chuẩn bị cầu kỳ.",
    guidanceSteps: [
      {
        label: "01",
        title: "Mở một phần trà",
        text: "Lấy một phần trà đã định lượng, giữ thao tác gọn và sạch trước khi pha.",
      },
      {
        label: "02",
        title: "Pha bằng nước nóng",
        text: "Dùng khoảng 180 ml nước nóng và làm theo hướng dẫn in trên bao bì của đúng phiên bản sản phẩm.",
      },
      {
        label: "03",
        title: "Chờ hương sen mở",
        text: "Chờ 4-5 phút để hương và vị dần ổn định trước khi thưởng thức.",
      },
      {
        label: "04",
        title: "Giữ một khoảng chậm",
        text: "Thưởng thức trong một khoảng nghỉ ít bị gián đoạn, rồi ghi lại cảm nhận nếu có thể.",
      },
    ],
    prompt: "Hôm nay, bạn muốn dành tách trà này cho chính mình hay mời một người khác ngồi lại?",
  },
  "petal-pack": {
    productSlug: "petal-pack",
    version: "v1",
    contentViewed: "petal-pack-scan",
    eyebrow: "QR Senova Petal Pack / Mở",
    title: "Mở một cánh sen, bắt đầu một khoảng lặng.",
    lede:
      "Petal Pack là phần trà cho một lần pha, đặt trong túi lọc và được bao quanh bởi cánh sen sấy tạo hình búp sen.",
    storyTitle: "Ý nghĩa của trải nghiệm",
    storyParagraphs: [
      "Petal Pack không mô phỏng một nghi lễ lịch sử cụ thể. Đây là nghi thức trải nghiệm do Senova thiết kế để người dùng chủ động bước ra khỏi nhịp vội và bắt đầu thưởng trà.",
      "Văn hóa không chỉ được hiểu bằng thông tin. Nó còn được ghi nhớ qua hình dáng, mùi hương, thao tác và cảm giác.",
    ],
    guidanceTitle: "Mở - cảm nhận - pha",
    guidanceIntro: "Hãy để thao tác mở cánh trở thành bước đầu tiên của tách trà.",
    guidanceSteps: [
      {
        label: "01",
        title: "Tách nhẹ cánh sen",
        text: "Tách nhẹ phần cánh bên ngoài để thưởng hương, không mở rời toàn bộ búp sen.",
      },
      {
        label: "02",
        title: "Cảm nhận bằng nhiều giác quan",
        text: "Nhận biết hình dáng, chất liệu và hương trong khoảnh khắc đầu tiên.",
      },
      {
        label: "03",
        title: "Pha nguyên búp sen",
        text: "Đặt nguyên búp sen vào dụng cụ pha và rót nước theo thông số đang hiển thị.",
      },
      {
        label: "04",
        title: "Chờ rồi thưởng thức",
        text: "Chờ khoảng 5 phút để hương vị hiện ra, quan sát màu nước và ghi lại điều khiến bạn nhớ nhất.",
      },
    ],
    prompt:
      "Điều khiến bạn nhớ nhất là hình dáng búp sen, thao tác mở cánh, hương trà hay khoảng thời gian chờ?",
  },
  "gift-set": {
    productSlug: "gift-set",
    version: "v1",
    contentViewed: "gift-set-scan",
    eyebrow: "QR Senova Gift Set / Trao",
    title: "Một món quà có câu chuyện.",
    lede:
      "Gift Set kết hợp trà hương sen, Petal Pack, hướng dẫn pha và thẻ câu chuyện trong một hành trình trao tặng thống nhất.",
    storyTitle: "Giữ - Mở - Trao",
    storyParagraphs: [
      "Bạn nhận được Senova Gift Set không chỉ như một hộp trà, mà như một lời mời dành thời gian cho hương sen, cho chính mình và cho người đã chuẩn bị món quà.",
      "Điều được trao đi không chỉ là sản phẩm, mà còn là thời gian chuẩn bị, sự lựa chọn có chủ đích và một lời trân trọng.",
    ],
    guidanceTitle: "Bắt đầu từ đâu?",
    guidanceIntro: "Mỗi thành phần trong Gift Set đảm nhiệm một vai trò trong hành trình nhận quà.",
    guidanceSteps: [
      {
        label: "01",
        title: "Đọc lời nhắn",
        text: "Bắt đầu bằng thông điệp đi cùng bộ quà để nhận biết dụng ý của người trao.",
      },
      {
        label: "02",
        title: "Chọn trải nghiệm",
        text: "Chọn Classic khi bạn muốn một tách trà gọn và quen thuộc; chọn Petal Pack khi muốn bắt đầu bằng thao tác mở cánh.",
      },
      {
        label: "03",
        title: "Pha theo hướng dẫn",
        text: "Dùng hướng dẫn in trên bao bì hoặc thẻ đi kèm để pha đúng phần trà bạn chọn.",
      },
      {
        label: "04",
        title: "Tiếp tục câu chuyện",
        text: "Sau khi thưởng thức, bạn có thể gửi phản hồi hoặc kể lại ý nghĩa món quà cho một người khác.",
      },
    ],
    prompt: "Món quà này phù hợp nhất với dịp trao tặng nào, và điều gì làm người nhận nhớ đến nó?",
  },
};

export function getQrExperienceContent(productSlug: ProductId) {
  return qrExperienceContent[productSlug];
}
