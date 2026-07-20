# 09. Security, privacy và threat model

## 1. Tài sản cần bảo vệ

- tính đúng của mapping pack–code;
- secret code;
- quyền admin;
- hash và revision;
- tài liệu QA;
- trạng thái recall;
- signer key;
- audit log;
- dữ liệu scan tối thiểu;
- uy tín thương hiệu.

## 2. Đối tượng đe dọa

- người sao chép QR;
- bot dò code;
- người nội bộ lấy file in;
- nhà in xử lý sai hoặc làm lộ;
- attacker thay QR bằng phishing QR;
- admin bị chiếm tài khoản;
- người nhập dữ liệu sai;
- script scan bombing;
- attacker sửa database;
- cấu hình blockchain sai network.

## 3. Threat matrix

| Threat | Tác động | Kiểm soát |
|---|---|---|
| QR copy | Nhiều hàng dùng một mã | Secret dưới niêm phong, risk audit |
| Scan bombing | Mã thật bị nghi vấn | Rate limit, bot detection, không auto-fake |
| Enumeration | Thu thập code hợp lệ | Random 96-bit, response đồng đều |
| Secret brute force | Kích hoạt trái phép | HMAC digest, rate limit, lock window |
| File in bị lộ | Kích hoạt trước bán | Access audit, encrypted transfer, distribution state |
| Mapping sai | Trace sai vật thể | Scan tại checkpoint, đối soát |
| Admin takeover | Sửa batch/recall | MFA, RBAC, CSRF, audit |
| Data poisoning | Blockchain neo dữ liệu sai | 4-eyes approval, correction event |
| Log leakage | Lộ secret/PII | Redaction, structured logging |
| QR phishing | Mất dữ liệu người dùng | Domain text, tamper-evident seal |
| Chain key theft | Anchor giả | KMS/HSM, rotate, revoke |
| Chain outage | Proof unavailable | Async outbox, cached receipt |
| Privacy overcollection | Vi phạm niềm tin | coarse region, retention, consent |
| Replay activation | State không đúng | idempotency + row lock |

## 4. Authentication và authorization

### Admin

- session HttpOnly;
- CSRF double-submit;
- MFA production;
- deny-by-default;
- permission theo action;
- session revoke;
- account lock;
- audit.

Permission đề xuất:

```text
trace.batches.read
trace.batches.write
trace.batches.approve
trace.events.write
trace.events.approve
trace.units.issue
trace.units.transition
trace.units.export_secrets
trace.units.void
trace.risk.review
trace.recall.execute
trace.anchors.read
trace.anchors.retry
trace.anchors.reconcile
```

Không gộp tất cả vào `admin`.

## 5. Segregation of duties

- người tạo event không tự approve event quan trọng;
- người issue code không tự xác nhận toàn bộ pack;
- export secret cần permission riêng;
- recall cần role QA/Operations;
- ledger retry không cho sửa root hash;
- correction cần reason.

## 6. Rate limiting

Đề xuất staging/pilot:

| Endpoint | Limit |
|---|---:|
| QR resolve | 120/IP/phút |
| Trace view | 120/IP/phút |
| Scan event | 60/IP/phút |
| Activation | 5/unit/15 phút; 10/IP/15 phút |
| Support submit | 5/IP/giờ |
| Admin login | Theo policy hiện hữu |
| Unit issue | 5/admin/phút |

Production multi-instance cần Redis/distributed limiter. In-memory limiter không đủ.

## 7. Data minimization

### Có thể lưu

- client token hash;
- IP prefix hash;
- user-agent family;
- region cấp tỉnh/thành;
- timestamp;
- risk signal.

### Không lưu theo mặc định

- raw IP dài hạn;
- GPS;
- device fingerprint chi tiết;
- danh bạ;
- camera data;
- advertising ID;
- secret plaintext;
- full referrer URL có query nhạy cảm.

Referrer chỉ lưu origin hoặc sanitize.

## 8. Retention và deletion

- scan raw/detail: 180 ngày pilot;
- aggregate: lâu hơn theo mục tiêu thống kê;
- support PII: theo policy submissions;
- secret digest: giữ theo vòng đời unit;
- blockchain: không chứa PII nên không cần xóa PII on-chain;
- document private: theo chính sách QA.

Job retention phải audit số record xóa.

## 9. Logging

Log được phép:

```json
{
  "event": "trace_activation_attempt",
  "requestId": "...",
  "publicCodeHash": "...",
  "result": "invalid",
  "riskDelta": 20
}
```

Không log:

```json
{
  "secretCode": "...",
  "email": "...",
  "rawIp": "..."
}
```

## 10. Security headers và frontend

- HTTPS;
- HSTS production;
- CSP;
- `frame-ancestors`;
- `Referrer-Policy`;
- no inline secret in URL;
- no secret in query string;
- no localStorage secret;
- no third-party analytics on activation form nếu chưa đánh giá.

## 11. Input validation

- code normalize allowlist;
- secret normalize có kiểm soát;
- payload size limit;
- JSON depth limit;
- enum validation;
- timestamp server-side;
- admin text sanitize;
- storage file MIME và size validation.

## 12. Incident severity

| Level | Ví dụ |
|---|---|
| SEV-1 | Signer key lộ, recall sai toàn hệ thống |
| SEV-2 | File secret batch bị lộ, mass scan bombing |
| SEV-3 | Một unit compromised, false positive tăng |
| SEV-4 | Lỗi hiển thị proof, analytics thiếu |

## 13. Security test bắt buộc

- public code enumeration;
- secret brute force;
- activation race;
- idempotency conflict;
- CSRF admin;
- permission bypass;
- SQL injection;
- JSON injection;
- open redirect;
- log secret check;
- chain adapter wrong network;
- webhook/worker replay nếu có.
