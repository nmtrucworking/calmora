---
document: "editorial-guidelines"
visibility: "internal-only"
version: "1.0"
updated: "2026-06-24"
---

# Hướng dẫn biên tập nội bộ

> File này không xuất bản trên website.

## Phạm vi nội dung chính thức

Nội dung công khai phải bám theo một câu chuyện thống nhất:

- **Giữ:** Senova Classic.
- **Mở:** Senova Petal Pack.
- **Trao:** Senova Gift Set.

Senova không chia sản phẩm thành ba phiên bản đại diện cho Bắc, Trung và Nam. Nội dung địa danh chỉ được xuất bản như chương bối cảnh độc lập.

## Những tuyên bố không sử dụng

1. **“Sen là quốc hoa chính thức của Việt Nam.”**  
   Không dùng nếu không có văn bản pháp lý xác nhận.

2. **“Senova đại diện cho toàn bộ văn hóa trà Việt.”**  
   Phạm vi quá rộng và không thể chứng minh bằng một bộ sản phẩm.

3. **“Petal Pack là nghi lễ trà sen truyền thống.”**  
   Không chính xác. Đây là nghi thức trải nghiệm do Senova thiết kế.

4. **“Sản phẩm kế thừa trực tiếp kỹ nghệ trà sen Tây Hồ, Huế hoặc Đồng Tháp.”**  
   Chỉ dùng khi nguyên liệu, quy trình và đối tác thực tế có thể truy xuất.

5. **Tuyên bố sức khỏe:** giảm căng thẳng, thải độc, chữa mất ngủ, chống oxy hóa hoặc công dụng điều trị.  
   Không dùng nếu chưa có căn cứ pháp lý và khoa học cho chính sản phẩm.

6. **Tuyên bố vật liệu hoặc kỹ thuật:** hữu cơ, sấy lạnh, sấy thăng hoa, túi lọc phân hủy sinh học, hộp gỗ óc chó, ép kim, bao bì tái chế.  
   Chỉ dùng khi đúng với mẫu sản phẩm đang bán.

7. **Tuyên bố công nghệ:** Computer Vision phân loại nguyên liệu, công nghệ bảo toàn hoạt chất, truy xuất thông minh.  
   Chỉ dùng khi hệ thống thực tế đã tồn tại và có tài liệu chứng minh.

## Nội dung hiện có trong repository cần thay hoặc gỡ

### `src/data/content.json`

Các nội dung cần loại khỏi bản xuất bản nếu chưa có hồ sơ:

- “Computer Vision phân loại”.
- “Công nghệ sấy thăng hoa”.
- “Tối ưu hóa giá trị dược liệu”.
- “Alkaloid thư giãn”.
- “Flavonoid chống oxy hóa”.
- “Trà cổ thụ”.
- “Hồ Tây sớm mai” khi nguồn nguyên liệu chưa được xác định.
- Chữ ký “Calmora Tea Masters”.

### `PetalPackReveal.tsx`

Không dùng nếu chưa xác nhận:

- “sấy lạnh”;
- “hương thơm nguyên bản”;
- “định lượng hoàn hảo”;
- “trà hữu cơ”;
- mô tả cánh sen bảo vệ “búp trà” nếu bên trong thực tế là túi lọc.

### `ClassicRitualScene.tsx`

Không dùng nếu chưa xác nhận:

- giấy kraft tráng bạc;
- túi lọc tam giác phân hủy sinh học;
- thời gian pha cố định ba phút;
- tuyên bố bảo quản tối đa hoặc giải phóng tối đa hương vị.

### `GiftSetExplodedView.tsx`

Không dùng nếu chưa xác nhận:

- trà hữu cơ hảo hạng;
- nhị hoa sen thanh lọc;
- hộp gỗ óc chó;
- ép kim;
- “chuẩn vị”;
- “đỉnh cao trải nghiệm” hoặc “hộp gỗ di sản”.

## Bản đồ nguồn

| Mã | Nguồn | Phạm vi sử dụng |
|---|---|---|
| N1 | Mô tả dự án Senova — Trà sen trải nghiệm | Cấu trúc ba sản phẩm; website là không gian nội dung số |
| N2 | Senova — Nội dung trình bày ba dòng sản phẩm | Logic ba vai trò bổ trợ |
| N3 | Đề cương dự án Senova | Mô hình sản phẩm — trải nghiệm — câu chuyện |
| N4 | Tóm tắt ý tưởng và hiện trạng dự án | Giới hạn tuyên bố và yêu cầu rà soát |
| S1 | Robert Wenner, *The Deep Roots of Vietnamese Tea* | Nguồn nền về quan hệ lịch sử và văn hóa của trà |
| S2 | Tư liệu tổng quan về Vietnamese lotus tea | Mô tả khái quát về trà sen và kỹ nghệ tạo hương |

## Kiểm tra trước khi xuất bản

- [ ] Nội dung khớp với nguyên mẫu và vật liệu thực tế.
- [ ] Không gọi cánh sen là thành phần tạo hương nếu vai trò thực tế chỉ là bao gói hoặc tạo hình.
- [ ] Mọi địa danh, vùng nguyên liệu và kỹ nghệ đều có nguồn hoặc đối tác truy xuất.
- [ ] Hướng dẫn pha và bảo quản đã được thử nghiệm với mẫu sản phẩm.
- [ ] Trang QR mở đúng nội dung của từng SKU trên điện thoại.
- [ ] Ảnh minh họa không làm người xem hiểu nhầm là sản phẩm thương mại đã hoàn thiện.
- [ ] Ngôn ngữ văn hóa được rà soát trước khi công bố chính thức.
- [ ] Metadata có đầy đủ Calmora, Senova và cụm “trà sen” hoặc “trà hương sen”.
