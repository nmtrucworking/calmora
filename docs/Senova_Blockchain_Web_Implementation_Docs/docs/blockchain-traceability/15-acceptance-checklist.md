# 15. Checklist nghiệm thu

## A. Product scope

- [ ] Trace được tích hợp trong website Senova.
- [ ] QR cũ vẫn hoạt động.
- [ ] Không phát sinh luồng thanh toán.
- [ ] Petal Pack dùng hướng dẫn đúng: tách nhẹ cánh để thưởng hương, pha nguyên búp.
- [ ] Không tuyên bố blockchain thay thế kiểm nghiệm.
- [ ] Không kết luận giả chỉ bằng scan lần hai.

## B. QR và code

- [ ] Public code random, không tuần tự.
- [ ] Secret độc lập.
- [ ] Secret nằm dưới niêm phong.
- [ ] Secret không nằm trong URL/QR.
- [ ] Database không lưu secret plaintext.
- [ ] Code void không tái sử dụng.
- [ ] Có đối soát issued/printed/packed/distributed.
- [ ] Domain chính thức in bên cạnh QR.

## C. Database

- [ ] Batch/event/unit tables.
- [ ] Unique constraint code/digest.
- [ ] Unit có batch.
- [ ] Event append-only.
- [ ] Correction tham chiếu event cũ.
- [ ] Anchor unique theo entity/revision/network.
- [ ] Migration trên DB trống và hiện hữu.
- [ ] Seed idempotent.

## D. API

- [ ] QR trả `flowType`.
- [ ] Unit trace public API.
- [ ] Activation có idempotency.
- [ ] Activation concurrency safe.
- [ ] Rate limit.
- [ ] Proof endpoint.
- [ ] Recall API.
- [ ] Admin permission.
- [ ] Error envelope thống nhất.
- [ ] Secret redaction.

## E. Frontend

- [ ] `/trace/:publicCode`.
- [ ] Mobile-first.
- [ ] 8 trạng thái public.
- [ ] Recall ưu tiên.
- [ ] Activation xóa secret khỏi state.
- [ ] Không lưu secret localStorage.
- [ ] Proof collapsed.
- [ ] Network error không biến thành invalid.
- [ ] Accessibility.
- [ ] Analytics không chứa PII/secret.

## F. Risk

- [ ] Same-client refresh không tăng risk.
- [ ] Scan pre-distribution có signal.
- [ ] Invalid secret có signal.
- [ ] Rule config server-side.
- [ ] Không auto-compromised từ một tín hiệu.
- [ ] Review queue.
- [ ] Clear false positive có reason.
- [ ] Dashboard suspicious rate.

## G. Security/privacy

- [ ] HTTPS.
- [ ] CSRF admin.
- [ ] MFA production.
- [ ] Permission deny-by-default.
- [ ] Redis limiter khi multi-instance.
- [ ] No raw IP long-term.
- [ ] Coarse region optional.
- [ ] Retention job.
- [ ] Log inspection pass.
- [ ] Secret export audit.
- [ ] Signer secret manager/KMS.

## H. Blockchain

- [ ] Canonical JSON deterministic.
- [ ] Test vectors.
- [ ] Outbox.
- [ ] Worker retry.
- [ ] Idempotent anchor.
- [ ] Receipt cache.
- [ ] Proof match.
- [ ] Chain outage không chặn trace.
- [ ] Reconciliation.
- [ ] Wrong-network detection.
- [ ] Không on-chain PII.

## I. Testing

- [ ] Backend static checks.
- [ ] Frontend lint/build.
- [ ] Unit state tests.
- [ ] Activation race.
- [ ] Brute force.
- [ ] Scan bombing.
- [ ] Recall.
- [ ] Proof mismatch.
- [ ] Migration.
- [ ] Physical QR test.
- [ ] Mobile/network weak test.

## J. Operations

- [ ] SOP issue code.
- [ ] SOP print.
- [ ] SOP pack.
- [ ] SOP distribute.
- [ ] SOP recall.
- [ ] SOP secret leak.
- [ ] Incident owner.
- [ ] Feature flags.
- [ ] Metrics dashboard.
- [ ] Backup/restore.
- [ ] Pilot report.

## Release decision

- [ ] **GO:** tất cả P0 pass.
- [ ] **CONDITIONAL:** chỉ lỗi P1 có owner/deadline.
- [ ] **NO-GO:** secret leak, race, mapping sai, recall fail, proof mismatch không phát hiện hoặc QR cũ bị break.
