import { CupSoda, Droplets, Leaf, Recycle } from "lucide-react";
import type { LandingContent } from "../types";

export const landingContent: LandingContent = {
  nav: [
    { label: "Concept", href: "#concept" },
    { label: "Trải nghiệm", href: "#experience" },
    { label: "Tác động", href: "#impact" },
  ],
  hero: {
    eyebrow: "Trà hương sen được tái thiết kế cho thế hệ trải nghiệm",
    title: "Một bộ áo mới cho trà sen truyền thống.",
    description:
      "Senova kết hợp trà, hương sen và thiết kế cảm quan để tạo nên sản phẩm trà bản địa có tính mới: đẹp hơn trong nghi thức, rõ hơn trong câu chuyện văn hóa, linh hoạt hơn trong mô hình kinh doanh.",
    primaryCta: "Xem concept 3D",
    primaryHref: "#concept",
    secondaryCta: "Cấu trúc trải nghiệm",
    secondaryHref: "#experience",
    scrollHint: "Scroll để mô hình bung nở",
  },
  concept: {
    eyebrow: "Creative Direction",
    title: "Hoa sen không chỉ là biểu tượng. Nó là giao diện sản phẩm.",
    description:
      'Landing page dùng mô hình hoa sen 3D làm trung tâm nhận diện. Khi người dùng scroll, cánh sen tách lớp, ánh sáng vàng trà phát ra từ lõi, lá sen mở rộng như một mặt phẳng sinh thái. Đây là cách chuyển ý tưởng "sen + innovation" thành ngôn ngữ thị giác.',
    pillars: [
      {
        icon: Leaf,
        title: "Bản địa hóa nguyên liệu",
        text: "Khai thác sen địa phương để tái định vị trà hương sen truyền thống bằng trải nghiệm sản phẩm mới.",
      },
      {
        icon: CupSoda,
        title: "Trải nghiệm vị giác mới",
        text: "Mở rộng từ trà khô, trà túi lọc sang concept trà sen hiện đại, có thể phát triển thành dòng trà sữa mix sen.",
      },
      {
        icon: Droplets,
        title: "Nghi thức pha trà",
        text: "Gợi ý đóng gói từng phần trà bằng cánh sen, biến một ly trà thành một trải nghiệm cảm quan.",
      },
      {
        icon: Recycle,
        title: "Giá trị môi trường - xã hội",
        text: "Tận dụng nguồn sen sẵn có, giảm lãng phí phụ phẩm và nâng giá trị văn hóa bản địa.",
      },
    ],
  },
  experience: {
    eyebrow: "Experience System",
    title: "Từ ly trà thành một chuỗi tương tác cảm quan.",
    steps: [
      {
        number: "01",
        title: "Nhìn",
        text: "Bao bì lấy hình thái cánh sen; màu trà, xanh lá và ánh sáng hổ phách tạo cảm giác tự nhiên nhưng hiện đại.",
      },
      {
        number: "02",
        title: "Mở",
        text: "Mỗi phần trà được xem như một đơn vị trải nghiệm, có thể gói bằng cánh sen hoặc vật liệu gợi hình cánh sen.",
      },
      {
        number: "03",
        title: "Pha",
        text: "Lõi trà bung hương; câu chuyện bản địa được kích hoạt bằng QR, hình ảnh vùng sen và quy trình chế biến.",
      },
      {
        number: "04",
        title: "Chia sẻ",
        text: "Sản phẩm có khả năng mở rộng sang quà tặng, trà sữa mix sen, hoặc phiên bản giới hạn theo mùa sen.",
      },
    ],
  },
  impact: {
    eyebrow: "Market Fit",
    title: "Khác biệt không nằm ở việc thêm hương sen, mà ở cách tổ chức giá trị.",
    description:
      "Senova có thể định vị ở giao điểm giữa thực phẩm - văn hóa - quà tặng. Điểm nhấn là tái cấu trúc sản phẩm quen thuộc thành trải nghiệm có khả năng truyền thông, mở rộng SKU và gắn với nguồn lực địa phương.",
    cards: [
      {
        number: "01",
        title: "Tính mới",
        text: "Thiết kế lại hình thức đóng gói và nghi thức sử dụng trà sen.",
      },
      {
        number: "02",
        title: "Tính khả thi",
        text: "Dựa trên nguồn nguyên liệu sen sẵn có và mô hình trà đã quen thuộc.",
      },
      {
        number: "03",
        title: "Tính mở rộng",
        text: "Có thể phát triển thành trà khô, trà túi lọc, trà sữa mix sen và quà tặng.",
      },
    ],
  },
  cta: {
    eyebrow: "Senova Prototype",
    title: "Trà sen cho một thế hệ thích chạm, nhìn, pha và kể lại.",
    description:
      "Landing page này được thiết kế để làm nổi bật tinh thần đổi mới: mô hình 3D bung nở theo scroll, ánh sáng hổ phách từ lõi trà, và bố cục nội dung kể rõ giá trị sản phẩm.",
    label: "Liên hệ thử nghiệm sản phẩm",
    href: "mailto:hello@senova.vn",
  },
};
