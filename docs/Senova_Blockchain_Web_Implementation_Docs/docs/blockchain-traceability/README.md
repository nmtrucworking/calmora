# Senova Blockchain Traceability — Bộ tài liệu triển khai website

> **Repository đích:** `nmtrucworking/calmora`  
> **Frontend:** React 19 + TypeScript + Vite  
> **Backend:** FastAPI + PostgreSQL + Alembic  
> **Mục tiêu:** mở rộng hệ QR hiện tại thành hệ truy xuất theo lô, định danh từng pack, kích hoạt một lần, phát hiện mã bị sao chép và neo bằng chứng dữ liệu lên blockchain.

## 1. Phạm vi của bộ tài liệu

Bộ tài liệu này mô tả cách triển khai trực tiếp trong website Senova hiện tại, không xây một ứng dụng truy xuất tách rời.

Luồng mục tiêu:

```text
Sản phẩm vật lý
    ↓
QR công khai riêng cho pack hoặc lô
    ↓
/q/:code trên website Senova
    ↓
Resolve QR và nhận diện loại luồng
    ├── Nội dung văn hóa hiện tại
    ├── Truy xuất theo lô
    └── Truy xuất và xác thực từng pack
            ↓
Trang /trace/:publicCode
            ↓
Nguồn gốc + tiến trình sản xuất + trạng thái xác minh
            ↓
Nhập mã bí mật dưới tem để kích hoạt
            ↓
Audit lượt quét và phát hiện bất thường
            ↓
Neo hash của audit bundle lên blockchain
```

Blockchain không lưu ảnh, thông tin khách hàng, nội dung văn hóa, phiếu kiểm nghiệm đầy đủ hoặc dữ liệu hành vi chi tiết. Blockchain chỉ lưu bằng chứng tối thiểu: định danh đối tượng, hash, phiên bản, thời gian, trạng thái neo và tham chiếu giao dịch.

## 2. Nguyên tắc triển khai

1. **Không thay thế hệ QR hiện có.** Mở rộng `qr_records` và `/q/:code` để hỗ trợ nhiều loại luồng.
2. **Không kết luận hàng giả chỉ vì quét lần thứ hai.** Hệ thống phân loại `activated`, `recheck`, `suspicious`, `compromised`.
3. **Tách QR công khai và mã bí mật.** QR dùng để truy xuất; mã bí mật dưới niêm phong dùng để kích hoạt một lần.
4. **PostgreSQL là nguồn dữ liệu vận hành.** Blockchain là lớp bằng chứng, không phải database giao diện.
5. **Không ghi dữ liệu cá nhân lên blockchain.**
6. **Phát triển theo từng lớp.** Hoàn thiện định danh, audit, quy trình in và dữ liệu lô trước; sau đó mới bật adapter blockchain.
7. **Tương thích mô hình pre-order hiện tại.** Luồng truy xuất không bổ sung thanh toán trực tuyến, tồn kho hoặc fulfillment ngoài phạm vi.

## 3. Thứ tự đọc đề xuất

| Thứ tự | Tài liệu | Mục đích |
|---:|---|---|
| 1 | [00-executive-scope.md](00-executive-scope.md) | Chốt mục tiêu, phạm vi, giả định và tiêu chí thành công |
| 2 | [01-current-state-gap-analysis.md](01-current-state-gap-analysis.md) | Đối chiếu với codebase hiện tại |
| 3 | [02-target-architecture.md](02-target-architecture.md) | Kiến trúc mục tiêu và ranh giới hệ thống |
| 4 | [03-domain-model-state-machines.md](03-domain-model-state-machines.md) | Domain model và state machine |
| 5 | [04-database-migrations.md](04-database-migrations.md) | Thiết kế bảng, index và migration |
| 6 | [05-api-contracts.md](05-api-contracts.md) | Contract public/admin |
| 7 | [06-frontend-implementation.md](06-frontend-implementation.md) | Route, component, state và UX |
| 8 | [07-qr-unit-identity-activation.md](07-qr-unit-identity-activation.md) | Sinh mã, in tem, kích hoạt và audit |
| 9 | [08-blockchain-ledger-integration.md](08-blockchain-ledger-integration.md) | Hash, outbox và adapter blockchain |
| 10 | [09-security-privacy-threat-model.md](09-security-privacy-threat-model.md) | Threat model và kiểm soát |
| 11 | [10-admin-operations.md](10-admin-operations.md) | Dashboard và vận hành |
| 12 | [11-testing-quality.md](11-testing-quality.md) | Test matrix và quality gate |
| 13 | [12-deployment-observability.md](12-deployment-observability.md) | Deploy, metric, logging, alert |
| 14 | [13-roadmap-backlog.md](13-roadmap-backlog.md) | Sprint, backlog và dependency |
| 15 | [14-incident-response-runbook.md](14-incident-response-runbook.md) | Runbook khi mã bị lộ hoặc bị tấn công |
| 16 | [15-acceptance-checklist.md](15-acceptance-checklist.md) | Checklist nghiệm thu |
| 17 | [16-data-dictionary.md](16-data-dictionary.md) | Từ điển dữ liệu |
| 18 | [17-adrs.md](17-adrs.md) | Các quyết định kiến trúc |

## 4. Vị trí đặt trong repository

Đề xuất sao chép toàn bộ thư mục này vào:

```text
docs/blockchain-traceability/
```

Các tài liệu feature hiện tại trong frontend/backend vẫn được giữ. Bộ tài liệu này đóng vai trò đặc tả liên ứng dụng và nguồn chuẩn cho việc chia task.

## 5. Phạm vi phát hành

### Release R1 — Traceability foundation

- Dữ liệu lô và sự kiện sản xuất.
- QR theo lô.
- Timeline truy xuất trên website.
- Admin tạo và duyệt lô.
- Hash bundle lưu trong PostgreSQL.
- Chưa bật blockchain thật.

### Release R2 — Unit activation

- Public code riêng từng Petal Pack hoặc Gift Set.
- Secret code dưới tem.
- Kích hoạt một lần.
- Audit scan.
- Risk scoring và dashboard nghi vấn.
- Quy trình void, recall và support case.

### Release R3 — Blockchain anchoring

- Outbox neo hash.
- Adapter EVM testnet hoặc permissioned ledger.
- Proof endpoint.
- Hiển thị trạng thái xác minh blockchain.
- Retry, reconciliation và alert.

### Release R4 — Partner network

- Nhà cung cấp, cơ sở sản xuất và phòng kiểm nghiệm ký sự kiện.
- Permissioned network khi có ít nhất hai tổ chức độc lập.
- Quy chế quản trị khóa và tranh chấp dữ liệu.

## 6. Điều kiện dừng

Không phát hành tuyên bố “chống hàng giả bằng blockchain” nếu thiếu một trong các điều kiện:

- mã từng pack không duy nhất;
- secret code có thể nhìn thấy trước khi mở sản phẩm;
- không đối soát mã in với pack vật lý;
- dữ liệu nguồn gốc chưa có người chịu trách nhiệm;
- không có audit trail cho sửa sai;
- chưa kiểm thử scan bombing và brute force;
- frontend hiển thị “hàng giả” chỉ dựa trên lần quét thứ hai;
- blockchain adapter chưa có reconciliation.
