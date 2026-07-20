# 14. Incident response runbook

## 1. Mục tiêu

Cung cấp hành động cụ thể khi mã bị lộ, bị scan hàng loạt, mapping sai, recall hoặc blockchain gặp sự cố.

## 2. Vai trò

- Incident Lead.
- Backend owner.
- Frontend owner.
- Operations/QA.
- Communications.
- Security/key owner.

Một người có thể kiêm trong pilot nhưng trách nhiệm phải rõ.

## 3. SEV-1 — Signer key bị lộ

### Dấu hiệu

- transaction không do worker tạo;
- khóa xuất hiện trong log/repository;
- anchor bất thường.

### Hành động

1. Pause ledger worker.
2. Disable signer.
3. Revoke/rotate key.
4. Pause contract role nếu có.
5. Snapshot logs.
6. Reconcile anchor.
7. Đánh dấu receipt nghi vấn.
8. Không xóa history.
9. Thông báo stakeholder.
10. Postmortem.

Public trace vẫn hoạt động từ DB; proof hiển thị pending/under review.

## 4. SEV-2 — File secret batch bị lộ

1. Xác định batch và unit.
2. Pause activation cho batch.
3. Chuyển unit chưa distributed sang void/reissue.
4. Với unit đã distributed:
   - giữ trace;
   - tăng monitoring;
   - support notice;
   - xem xét recall/replace.
5. Thu hồi file và quyền truy cập.
6. Audit download.
7. Tạo code mới cho inventory còn kiểm soát.
8. Không tái sử dụng code.
9. Neo revision sự cố nếu cần.

## 5. SEV-2 — Scan bombing

1. Bật rate-limit nghiêm.
2. Chặn source/pattern.
3. Không mass mark compromised.
4. Tạm ngừng risk transition tự động.
5. Tách bot event khỏi user scan.
6. Theo dõi p95/error.
7. Xóa hoặc tag event theo policy, không sửa audit bí mật.
8. Hiệu chỉnh rule.
9. Thông báo support.

## 6. SEV-2 — Mapping pack–code sai

1. Stop packing line.
2. Quarantine affected inventory.
3. Xác định khoảng serial.
4. Void affected units.
5. Reprint/repack.
6. Nếu đã distributed:
   - support notice;
   - trace message;
   - recall nếu cần.
7. Root cause nhà in/SOP.
8. Reconciliation report.

## 7. SEV-2 — Recall

1. QA tạo recall request.
2. Approver xác nhận.
3. Backend batch state `recalled`.
4. Public recall notice.
5. Disable activation.
6. Xác định unit/điểm bán.
7. Communications.
8. Track returned units.
9. Correction/closure.
10. Anchor revision.

## 8. SEV-3 — False positive tăng

Threshold: suspicious rate vượt baseline.

1. Freeze automatic escalation.
2. Sample cases.
3. Kiểm tra same-client logic.
4. Kiểm tra geo inference.
5. Giảm ngưỡng/weight phù hợp.
6. Clear false positives có audit.
7. Cập nhật copy nếu người dùng bị ảnh hưởng.

## 9. SEV-3 — Ledger down

1. Xác nhận API/RPC.
2. Outbox tiếp tục pending.
3. Không retry dồn dập.
4. Proof pending.
5. Trace/activation tiếp tục.
6. Sau khôi phục, reconcile.
7. Alert nếu oldest pending vượt SLA.

## 10. SEV-3 — Proof mismatch

1. Không tự động sửa.
2. Freeze revision affected.
3. Build bundle lại bằng version đúng.
4. Kiểm tra canonicalization.
5. Kiểm tra DB mutation trái phép.
6. Kiểm tra network/contract.
7. Tạo incident.
8. Public proof under review.
9. Anchor correction revision, không overwrite.

## 11. Communication templates

### Mã cần kiểm tra

> Hệ thống ghi nhận mã xác thực có hoạt động bất thường. Kết quả này chưa đủ để kết luận về nguồn gốc sản phẩm. Vui lòng giữ nguyên bao bì và liên hệ Senova để được đối chiếu.

### Recall

> Senova đang thực hiện kiểm tra bổ sung đối với lô {batchCode}. Vui lòng tạm ngừng sử dụng sản phẩm và liên hệ theo hướng dẫn hỗ trợ.

### Proof sync

> Dữ liệu truy xuất vẫn khả dụng. Bằng chứng blockchain đang được đồng bộ và không ảnh hưởng đến thông tin lô hiện có.

## 12. Evidence checklist

- request ID;
- event IDs;
- batch/unit;
- timestamps;
- audit logs;
- export logs;
- worker logs;
- transaction receipts;
- screenshots;
- SOP records;
- communication.

Không thu thập thêm PII không cần thiết.

## 13. Postmortem

- timeline;
- impact;
- root cause;
- detection;
- response;
- what worked;
- what failed;
- corrective actions;
- owner;
- deadline;
- regression test.
