import type { ProductId } from "@features/products/data/products";

export type CollectionContent = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  productIds: ProductId[];
  mood: string;
};

export type JournalPost = {
  slug: string;
  eyebrow: string;
  title: string;
  excerpt: string;
  readTime: string;
  relatedHref: string;
};

export type ServiceContent = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  blocks: { title: string; text: string }[];
};

export type PolicyContent = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  blocks: { title: string; text: string }[];
};

export const collections: CollectionContent[] = [
  {
    slug: "signature",
    eyebrow: "Signature collection",
    title: "Nhung cham dau tien cua Senova.",
    description:
      "Bo suu tap nen tang gom Classic, Petal Pack va Gift Set, duoc sap xep theo hanh trinh Giu - Mo - Trao.",
    productIds: ["classic", "petal-pack", "gift-set"],
    mood: "Danh cho khach lan dau cham vao ngon ngu tra sen Senova.",
  },
  {
    slug: "gifting",
    eyebrow: "Gifting edit",
    title: "Qua tang co loi nhan va nghi thuc.",
    description:
      "Nhung cau hinh phu hop tri an, doi tac, su kien va nhung ngay can mot mon qua co chieu sau.",
    productIds: ["gift-set", "petal-pack"],
    mood: "Uu tien bao bi, loi nhan, lich giao va trai nghiem nguoi nhan.",
  },
  {
    slug: "daily-ritual",
    eyebrow: "Daily ritual",
    title: "Khoang lang co the lap lai moi ngay.",
    description:
      "Nhung san pham de duy tri thoi quen thuong tra gon, dep va co the bat dau o bat cu noi nao.",
    productIds: ["classic", "petal-pack"],
    mood: "Phu hop ban lam viec, nha rieng va private tasting nho.",
  },
];

export const services: Record<string, ServiceContent> = {
  "/gifting": {
    path: "/gifting",
    eyebrow: "Gift concierge",
    title: "Trao huong sen nhu mot loi nhan duoc chuan bi ky.",
    description:
      "Trang goi y qua tang ca nhan, thiep loi nhan, bao bi va lich giao cho nhung dip can su trang trong.",
    ctaLabel: "Gui yeu cau qua tang",
    ctaHref: "/checkout?intent=gifting",
    blocks: [
      { title: "Gift message", text: "Them loi nhan rieng, QR cau chuyen hoac thiep song ngu." },
      { title: "Presentation", text: "Goi giay lua, niem phong va cau hinh hop theo nguoi nhan." },
      { title: "Delivery timing", text: "Concierge xac nhan ngay giao va dieu kien bao quan truoc khi chot." },
    ],
  },
  "/corporate-gifting": {
    path: "/corporate-gifting",
    eyebrow: "Corporate gifting",
    title: "Qua tang doi tac co cau chuyen va kha nang ca nhan hoa.",
    description:
      "Danh cho doanh nghiep, su kien va chuong trinh tri an can mot ngon ngu qua tang tinh te.",
    ctaLabel: "Len cau hinh doanh nghiep",
    ctaHref: "/partners?topic=corporate-gifting",
    blocks: [
      { title: "Bulk inquiry", text: "Ghi nhan so luong, ngan sach, nhom nguoi nhan va thoi diem giao." },
      { title: "Customization", text: "Tuy bien loi nhan, ngon ngu, QR va dau an thuong hieu doi tac." },
      { title: "Concierge review", text: "Moi cau hinh duoc doi ngu Senova ra soat truoc khi san xuat." },
    ],
  },
  "/concierge": {
    path: "/concierge",
    eyebrow: "Client concierge",
    title: "Mot diem cham rieng cho khach hang can duoc tu van.",
    description:
      "Concierge ho tro chon san pham, cau hinh qua tang, lich tasting va thong tin lo thu nghiem.",
    ctaLabel: "Dat lich concierge",
    ctaHref: "/checkout?intent=concierge",
    blocks: [
      { title: "Product guidance", text: "Chon Classic, Petal Pack hay Gift Set theo nguoi nhan va dip tang." },
      { title: "Private support", text: "Lien he qua email hoac dien thoai truoc khi xac nhan inquiry." },
      { title: "Aftercare", text: "Huong dan bao quan, pha tra va tiep nhan phan hoi sau trai nghiem." },
    ],
  },
  "/private-tasting": {
    path: "/private-tasting",
    eyebrow: "Private tasting",
    title: "Dat mot khoang thu tra rieng cho nhom nho.",
    description:
      "UI booking mock cho tasting ca nhan, doi tac hoac su kien nho, tap trung vao nghi thuc mo - pha - ke chuyen.",
    ctaLabel: "Yeu cau lich tasting",
    ctaHref: "/checkout?intent=private-tasting",
    blocks: [
      { title: "Format", text: "30-45 phut, toi uu cho 4-12 khach moi." },
      { title: "Products", text: "Thu Classic, mo Petal Pack va xem cau hinh Gift Set." },
      { title: "Follow-up", text: "Gui tom tat cau hinh phu hop sau buoi tasting." },
    ],
  },
};

export const policies: Record<string, PolicyContent> = {
  "/shipping": {
    path: "/shipping",
    eyebrow: "Delivery care",
    title: "Giao hang duoc xac nhan nhu mot phan cua trai nghiem.",
    description: "Senova chua mo checkout thanh toan tu dong; moi lich giao duoc concierge xac nhan.",
    blocks: [
      { title: "Thoi gian", text: "Don ca nhan du kien 3-5 ngay lam viec sau khi xac nhan." },
      { title: "Qua tang", text: "Don qua tang co the len lich giao theo ngay va ghi chu nguoi nhan." },
      { title: "Bao quan", text: "San pham duoc dong goi de giam anh huong nhiet va am trong qua trinh giao." },
    ],
  },
  "/returns": {
    path: "/returns",
    eyebrow: "Returns",
    title: "Doi tra can duoc xu ly binh tinh va ro rang.",
    description: "Trang chinh sach mock cho giai doan preorder, uu tien lien he concierge truoc khi xu ly.",
    blocks: [
      { title: "San pham loi", text: "Ghi nhan hinh anh, ma lo va tinh trang dong goi de duoc ho tro." },
      { title: "Gift Set", text: "Don ca nhan hoa se duoc xac nhan dieu kien doi tra truoc khi san xuat." },
      { title: "Hoan tien", text: "Chua ap dung thanh toan online; dieu kien hoan tien se duoc cap nhat khi mo ban that." },
    ],
  },
  "/faq": {
    path: "/faq",
    eyebrow: "FAQ",
    title: "Nhung cau hoi thuong gap truoc khi gui inquiry.",
    description: "Cac cau tra loi ngan gon ve dat truoc, Gift Set, QR va tasting.",
    blocks: [
      { title: "Senova da ban chinh thuc chua?", text: "Website hien o giai doan concierge + preorder, chua checkout thanh toan online." },
      { title: "Co the dat Gift Set doanh nghiep khong?", text: "Co. Hay gui yeu cau corporate gifting de duoc cau hinh so luong va loi nhan." },
      { title: "QR tren Petal Pack dung de lam gi?", text: "QR mo cau chuyen, huong dan trai nghiem va bieu mau phan hoi." },
      { title: "Co lich tasting rieng khong?", text: "Co the gui yeu cau private tasting cho nhom nho hoac doi tac." },
    ],
  },
  "/care": {
    path: "/care",
    eyebrow: "Product care",
    title: "Bao quan de huong sen giu duoc khoang lang cua no.",
    description: "Huong dan cham soc san pham, bao bi va cach pha tra trong giai doan trai nghiem.",
    blocks: [
      { title: "Bao quan", text: "De noi kho mat, tranh anh nang truc tiep va dong kin sau khi mo." },
      { title: "Pha tra", text: "Dung dung luong nuoc va thoi gian tren tung phien ban san pham." },
      { title: "Gift Set", text: "Giu hop qua o trang thai phang, tranh de vat nang len canh hoac the cau chuyen." },
    ],
  },
};

export const journalPosts: JournalPost[] = [
  {
    slug: "gift-language",
    eyebrow: "Gifting note",
    title: "Mot mon qua cao cap can im lang dung luc.",
    excerpt: "Cach Senova dung loi nhan, bao bi va QR de bien qua tang thanh mot khoang doi thoai.",
    readTime: "4 phut doc",
    relatedHref: "/gifting",
  },
  {
    slug: "petal-ritual",
    eyebrow: "Ritual",
    title: "Vi sao thao tac mo canh quan trong hon hinh dang.",
    excerpt: "Petal Pack khong chi de nhin; no tao ra nhip cham truoc khi pha tra.",
    readTime: "5 phut doc",
    relatedHref: "/products/petal-pack",
  },
  {
    slug: "seasonal-lotus",
    eyebrow: "Seasonal",
    title: "Mua sen nhu mot nguyen tac bien tap.",
    excerpt: "Dung mua va ky uc nhu chat lieu, khong bien dia danh thanh trang tri.",
    readTime: "3 phut doc",
    relatedHref: "/seasonal",
  },
];

export const customerProfile = {
  name: "Guest client",
  email: "client@senova.vn",
  tier: "Preview Circle",
  note: "Ho so mau cho giai doan chua co dang nhap.",
};

export const mockOrders = [
  {
    id: "SNV-2601-018",
    title: "Petal Pack tasting inquiry",
    status: "Dang cho concierge xac nhan",
    date: "2026-01-18",
    totalLabel: "Bao gia sau khi xac nhan",
  },
  {
    id: "SNV-2601-024",
    title: "Corporate Gift Set consultation",
    status: "Dang len cau hinh",
    date: "2026-01-24",
    totalLabel: "Theo so luong va tuy bien",
  },
];
