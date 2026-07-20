# 00. Phạm vi điều hành và tiêu chí thành công

## 1. Bài toán

Senova đã có luồng QR để đưa người dùng từ sản phẩm vật lý đến nội dung sản phẩm, hướng dẫn trải nghiệm và câu chuyện văn hóa. Bước mở rộng lần này bổ sung hai khả năng:

1. **Truy xuất nguồn gốc có cấu trúc:** pack hoặc lô phải truy ngược được đến lô nguyên liệu, công đoạn sản xuất, kiểm nghiệm, đóng gói và phân phối.
2. **Xác thực sử dụng:** mã bí mật dưới niêm phong chỉ được kích hoạt lần đầu; các lần quét sau được audit và đánh giá rủi ro thay vì tự động kết luận hàng giả.

Blockchain được dùng để neo hash của dữ liệu đã duyệt. Hệ thống không dùng blockchain để lưu toàn bộ nội dung hoặc thay thế quy trình kiểm soát vật lý.

## 2. Mục tiêu sản phẩm

### 2.1. Người tiêu dùng

- Quét QR không cần đăng nhập.
- Xem đúng sản phẩm, mã lô, ngày đóng gói và timeline nguồn gốc.
- Xem trạng thái: hợp lệ, đã kích hoạt, cần kiểm tra, nghi vấn, thu hồi hoặc mã hủy.
- Kích hoạt bằng mã bí mật sau khi mở niêm phong.
- Xem câu chuyện văn hóa và hướng dẫn pha sau phần xác minh.
- Có kênh báo cáo khi trạng thái không phù hợp.

### 2.2. Đội vận hành

- Tạo lô và đơn vị sản phẩm có quan hệ cha–con.
- Sinh mã ngẫu nhiên hàng loạt mà không trùng.
- Quản lý in, gắn tem, đóng gói, xuất kho, void và recall.
- Xem audit scan, activation attempt và risk score.
- Đính kèm hash tài liệu kiểm nghiệm.
- Neo bundle lên blockchain và theo dõi trạng thái giao dịch.
- Xuất dữ liệu phục vụ kiểm tra và xử lý khiếu nại.

### 2.3. Đội kỹ thuật

- Không phá vỡ route QR và content workflow hiện tại.
- Không đưa PII vào analytics hoặc blockchain.
- Có idempotency cho mutation quan trọng.
- Có retry và reconciliation khi blockchain không khả dụng.
- Có test tự động cho state transition, activation và quyền truy cập.
- Có metric và alert tối thiểu trước production.

## 3. Phạm vi theo dòng sản phẩm

| Dòng | Định danh mặc định | Xác thực | Ghi chú |
|---|---|---|---|
| Senova Classic | Theo lô | Không bắt buộc | Ưu tiên truy xuất, không tăng chi phí từng túi |
| Senova Petal Pack | Theo từng pack | Public QR + secret code | Dòng trọng tâm của pilot |
| Senova Gift Set | Theo từng hộp | Public QR + secret code + tem niêm phong | Giá trị cao, phù hợp serial hóa |
| Pack nằm trong Gift Set | Theo quyết định cấu hình | Có thể theo hộp thay vì từng pack | Tránh chi phí và UX dư thừa |

## 4. Ngoài phạm vi

- Thanh toán trực tuyến.
- Quản lý tồn kho và fulfillment đầy đủ.
- NFT, token, loyalty coin.
- Public blockchain chứa dữ liệu cá nhân.
- Kết luận pháp lý “hàng giả” chỉ bằng telemetry.
- Nhận diện vị trí chính xác của người dùng.
- IoT tự động ghi nhiệt độ nếu chưa có thiết bị và quy trình hiệu chuẩn.
- Thay thế chứng nhận an toàn thực phẩm hoặc kiểm nghiệm.

## 5. Tiêu chí thành công R1

- 100% pack pilot truy ngược được đến một batch hợp lệ.
- 100% batch có ít nhất một sự kiện nguồn nguyên liệu, sản xuất, QA và đóng gói.
- Không có public code trùng.
- QR resolve p95 dưới 600 ms ở production.
- Trang trace tải nội dung chính p75 dưới 2,5 giây trên mạng di động thử nghiệm.
- Không có raw IP, email hoặc số điện thoại trong blockchain payload.
- Correction event không xóa sự kiện cũ.
- Có thể recall một batch và hiển thị trạng thái trên toàn bộ unit liên quan.

## 6. Tiêu chí thành công R2

- Tỷ lệ activation thành công từ pack hợp lệ trên 95%.
- False-positive `suspicious` dưới 3% trong pilot.
- Brute-force không thể vượt quá rate limit cấu hình.
- Mã bị scan trước `distributed` tạo cảnh báo nhưng không kích hoạt.
- Scan cùng thiết bị không tự động chuyển `suspicious`.
- Support có thể xem lịch sử trạng thái mà không thấy secret code gốc.

## 7. Tiêu chí thành công R3

- 100% bundle được duyệt có anchor record.
- Retry không tạo giao dịch neo trùng về mặt nghiệp vụ.
- Proof endpoint phát hiện được dữ liệu off-chain bị thay đổi.
- Chain outage không làm gián đoạn trang truy xuất cơ bản.
- Reconciliation phát hiện transaction thiếu, thất bại hoặc sai network.
- Không có private key trong repository hoặc log.

## 8. Các quyết định phải chốt trước Sprint 1

1. Domain production chính thức cho QR.
2. Petal Pack pilot serial theo từng pack hay theo hộp.
3. Vị trí và vật liệu niêm phong secret code.
4. Đơn vị chịu trách nhiệm nhập và duyệt từng sự kiện.
5. Bộ trường tối thiểu của batch pilot.
6. Thời hạn lưu scan event và activation attempt.
7. Ngưỡng risk score ban đầu.
8. Blockchain R3 dùng EVM testnet hay permissioned ledger thử nghiệm.
9. Ai giữ khóa ký và quy trình xoay khóa.
10. Nội dung pháp lý trên màn hình trạng thái nghi vấn.
