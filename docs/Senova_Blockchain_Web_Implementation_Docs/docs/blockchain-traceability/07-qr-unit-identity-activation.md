# 07. QR từng pack, định danh và kích hoạt

## 1. Hai lớp mã

### QR công khai

- in ngoài bao bì;
- có thể quét nhiều lần;
- chứa URL `/q/:publicCode`;
- dùng để truy xuất và điều hướng;
- không chứa secret.

### Mã bí mật

- dưới tem cào hoặc niêm phong;
- chỉ nhìn thấy khi mở sản phẩm;
- dùng để kích hoạt;
- không in trong QR;
- server chỉ lưu digest.

## 2. Cấu trúc public code

Yêu cầu:

- tối thiểu 80–96 bit entropy;
- Base32 không phân biệt hoa thường;
- loại ký tự dễ nhầm: `0/O`, `1/I/L`;
- không tuần tự;
- không chứa batch code trực tiếp;
- đủ ngắn để nhập thủ công khi cần.

Ví dụ:

```text
7K9M4C8Q2T6X
```

Không dùng:

```text
PP-000001
PP-000002
```

## 3. Secret code

Đề xuất 12–16 ký tự random, chia nhóm:

```text
7M4K-92AX-PQ5T
```

Secret phải độc lập với public code.

Digest:

```text
HMAC-SHA256(server_pepper, normalized_secret)
```

Yêu cầu:

- pepper ở secret manager;
- không commit;
- rotation có version;
- database lưu `secret_digest_version`;
- rate limit chống brute force;
- không log request body.

## 4. Sinh mã

Pseudo-code:

```python
def issue_unit(batch_id: UUID) -> IssuedUnit:
    public_code = random_base32(bits=96)
    secret_code = random_base32(bits=96)
    digest = hmac_sha256(settings.secret_pepper, normalize(secret_code))

    return IssuedUnit(
        public_code=public_code,
        secret_code_plaintext=secret_code,  # return once
        secret_digest=digest,
    )
```

Retry khi unique constraint conflict.

## 5. Export in ấn

CSV bảo mật:

```csv
rowNumber,publicCode,qrUrl,secretCode,batchCode
1,7K9M4C8Q2T6X,https://<domain>/q/7K9M4C8Q2T6X,7M4K-92AX-PQ5T,PP-20260720-B03
```

Quy tắc:

- file secret được tạo theo request có permission;
- signed download hết hạn;
- audit người tải;
- không gửi qua email không mã hóa;
- xóa file tạm sau thời hạn;
- không lưu file trong repository;
- nhà in chỉ nhận số lượng cần thiết.

## 6. Đối soát vật lý

### Checkpoint 1 — Sau in

Quét sample hoặc toàn bộ tùy quy mô:

- QR đọc được;
- URL đúng domain;
- public code có trong registry;
- mã chưa void.

### Checkpoint 2 — Khi gắn tem

- public code khớp secret code cùng hàng;
- gắn đúng batch;
- ghi `printed_at` hoặc `packed_at`.

### Checkpoint 3 — Đóng thùng

Đối soát:

```text
issued = printed + print_error + void_unused
printed = packed + damaged_after_print
packed = distributed + inventory_pending + void_damaged
```

### Checkpoint 4 — Xuất kho

Chỉ chuyển `distributed` cho unit thực sự rời quyền kiểm soát.

## 7. Activation rule

### Hợp lệ

- QR active;
- unit `distributed`;
- batch không recalled;
- secret đúng;
- chưa activated;
- request chưa rate-limited.

### Đã dùng

Secret đúng nhưng unit activated:

- không kích hoạt lần hai;
- ghi attempt;
- trả thời gian activation;
- tính risk theo ngữ cảnh;
- không kết luận hàng giả.

### Scan trước phân phối

- ghi signal;
- không kích hoạt;
- cảnh báo nội bộ;
- public copy: “Mã chưa được phát hành để bán”.

### Secret sai

- ghi attempt;
- tăng risk;
- không trả thông tin khác;
- sau ngưỡng trả 429.

## 8. Idempotency

Frontend tạo UUID cho mỗi submit. Backend lưu hash idempotency key theo unit.

- cùng key + cùng payload → trả response cũ;
- cùng key + payload khác → `IDEMPOTENCY_CONFLICT`;
- hai key đồng thời → row lock quyết định một activation.

## 9. Scan audit

Không dùng `scan_count > 1` làm điều kiện giả mạo.

Tín hiệu:

- cùng client token;
- thời gian giữa scan;
- số unit khác nhau từ một IP prefix;
- region coarse;
- trạng thái distribution;
- secret attempt;
- tốc độ request.

Ví dụ:

| Tình huống | Risk |
|---|---:|
| refresh cùng client trong 5 phút | 0 |
| scan lại cùng client sau 1 ngày | 0 |
| client thứ hai cùng region | +5 |
| 5 client trong 10 phút | +25 |
| scan trước distributed | +50 |
| 20 unit khác nhau từ một nguồn | +40 |
| 5 secret sai | +30 |

## 10. QR phishing

Trên bao bì in thêm text:

```text
Chỉ truy xuất tại: <domain chính thức>
Senova không yêu cầu OTP hoặc thông tin ngân hàng.
```

Tem phải để lại dấu vết nếu bị bóc thay.

## 11. Code lifecycle

- `issued`: code đã sinh.
- `printed`: đã in.
- `packed`: đã gắn vào pack.
- `distributed`: đã phát hành.
- `void`: lỗi, hủy, mất tem.
- `activated`: người dùng kích hoạt.
- `compromised`: code bị lạm dụng xác nhận.

Không tái sử dụng code void.

## 12. Pilot

Pilot 100–300 Petal Pack:

- 1 batch;
- 1 nhà in;
- 1 template;
- 1 nhóm vận hành;
- quét kiểm tra 100%;
- giữ log đối soát;
- đo false positive;
- chưa tuyên bố chống giả quy mô thương mại.
