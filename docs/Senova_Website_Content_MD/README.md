# Bộ nội dung Markdown cho website Calmora | Senova

## Mục đích

Bộ file này tổ chức lại nội dung từ tài liệu **Senova_Cau_chuyen_van_hoa_cho_website.docx** theo cấu trúc route và component hiện có của repository `nmtrucworking/calmora`.

Nội dung công khai sử dụng một mạch kể thống nhất:

> **GIỮ một giá trị. MỞ một trải nghiệm. TRAO một câu chuyện Việt.**

Bộ file đóng vai trò **content source of truth** cho đội phát triển, biên tập và thiết kế. Repository hiện chưa đọc Markdown trực tiếp; nội dung đang được đặt trong JSON, TypeScript và một số component React.

## Cấu trúc

```text
Senova_Website_Content_MD/
├── README.md
├── brand/
│   └── core.md
├── routes/
│   ├── home.md
│   ├── about.md
│   ├── story.md
│   ├── ritual.md
│   ├── seasonal.md
│   ├── products/
│   │   ├── index.md
│   │   ├── classic.md
│   │   ├── petal-pack.md
│   │   └── gift-set.md
│   └── qr/
│       ├── classic.md
│       ├── petal-pack.md
│       └── gift-set.md
├── seo/
│   └── metadata.md
└── internal/
    ├── editorial-guidelines.md
    └── repo-content-map.md
```

## Trạng thái nội dung

| Nhóm | Trạng thái | Ghi chú |
|---|---|---|
| Thông điệp thương hiệu | Sẵn sàng | Dùng thống nhất trên toàn website |
| Trang chủ | Sẵn sàng | Có thể ánh xạ vào `content.json` |
| Trang giới thiệu | Sẵn sàng | Thay nội dung công nghệ chưa có căn cứ |
| Trang câu chuyện | Sẵn sàng | Bản kể văn hóa chính thức |
| Trang bộ sản phẩm | Sẵn sàng | Ánh xạ vào `products.ts` và các component |
| Trang chi tiết Classic | Sẵn sàng | Không dùng tuyên bố vật liệu chưa xác nhận |
| Trang chi tiết Petal Pack | Sẵn sàng | Giữ định vị sản phẩm chủ đạo |
| Trang chi tiết Gift Set | Nội dung sẵn sàng, sản phẩm đang chuẩn bị | Giữ trạng thái `draft` trong dữ liệu |
| Trang nghi thức | Sẵn sàng | Không gọi là nghi lễ truyền thống |
| Trang mùa sen | Khung nội dung | Chỉ xuất bản nội dung địa danh khi có nguồn |
| Trang QR | Sẵn sàng | Mỗi QR dẫn đúng nội dung của SKU |
| SEO và social copy | Sẵn sàng | Luôn định danh Calmora, Senova và trà sen |
| Hướng dẫn biên tập | Nội bộ | Không xuất bản |

## Cách tích hợp

### Phương án 1 — Đồng bộ thủ công vào cấu trúc hiện tại

1. Dùng `routes/home.md`, `routes/about.md` và `routes/story.md` để cập nhật `src/data/content.json`.
2. Dùng các file trong `routes/products/` để cập nhật `src/features/products/data/products.ts`.
3. Thay các đoạn hardcode trong component theo bảng tại `internal/repo-content-map.md`.
4. Tạo route riêng cho ba trang QR thay vì đưa người dùng về trang chủ.
5. Rà soát metadata, Open Graph và structured data theo `seo/metadata.md`.

### Phương án 2 — Chuyển sang content-driven architecture

Dùng Markdown/MDX làm nguồn nội dung, nạp file khi build bằng cơ chế phù hợp với Vite. Frontmatter trong bộ file đã chuẩn hóa các trường cơ bản như `route`, `slug`, `status`, `metaTitle`, `metaDescription`, `primaryCta` và `secondaryCta`.

## Nguyên tắc xuất bản

- Không tuyên bố Senova đại diện cho toàn bộ văn hóa trà Việt.
- Không gọi Petal Pack là nghi lễ trà sen truyền thống.
- Không đưa tuyên bố sức khỏe, công nghệ, vật liệu, nguồn gốc hoặc chứng nhận chưa có hồ sơ.
- Không gắn sản phẩm với một địa danh nếu nguyên liệu và quy trình thực tế không thể truy xuất.
- Hướng dẫn pha phải bám theo thông số đã thử nghiệm của từng phiên bản sản phẩm.
