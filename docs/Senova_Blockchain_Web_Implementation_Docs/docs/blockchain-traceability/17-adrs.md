# 17. Architecture Decision Records

## ADR-001 — Giữ `/q/:code` làm entry point

**Status:** Accepted

**Decision:** QR trên mọi sản phẩm tiếp tục dùng `/q/:code`. Resolver trả `flowType` để chọn experience, batch trace hoặc unit trace.

**Reason:** Không phá QR hiện có và cho phép đổi đích đến.

**Consequence:** Resolver trở thành thành phần quan trọng, cần test compatibility.

---

## ADR-002 — PostgreSQL là nguồn dữ liệu vận hành

**Status:** Accepted

**Decision:** UI đọc PostgreSQL; blockchain chỉ là bằng chứng.

**Reason:** Query, correction, privacy và availability.

**Consequence:** Cần proof/reconciliation để phát hiện divergence.

---

## ADR-003 — QR công khai và secret code tách riêng

**Status:** Accepted

**Decision:** QR có thể quét nhiều lần; secret dưới niêm phong kích hoạt một lần.

**Reason:** QR tĩnh có thể sao chép.

**Consequence:** Tăng chi phí in và SOP, nhưng giảm rủi ro copy trước mở.

---

## ADR-004 — Không dùng “scan lần hai = giả”

**Status:** Accepted

**Decision:** Lượt scan là tín hiệu; state dựa trên nhiều rule và review.

**Reason:** Refresh, thiết bị thứ hai và chia sẻ link tạo false positive.

**Consequence:** Cần risk engine và support workflow.

---

## ADR-005 — Ledger qua Port/Adapter

**Status:** Accepted

**Decision:** Domain gọi `LedgerPort`; implementation database/EVM/Fabric thay thế được.

**Reason:** Tránh khóa công nghệ và hỗ trợ phát triển theo giai đoạn.

**Consequence:** Contract nội bộ phải ổn định.

---

## ADR-006 — Blockchain anchor bất đồng bộ

**Status:** Accepted

**Decision:** Ghi outbox trong transaction, worker gửi chain sau.

**Reason:** Chain outage không được làm hỏng activation/approval.

**Consequence:** UI có trạng thái pending.

---

## ADR-007 — Không đưa PII lên chain

**Status:** Accepted

**Decision:** Chỉ hash, revision, entity key và timestamp.

**Reason:** Privacy và tính bất biến.

**Consequence:** Dữ liệu chi tiết cần quản lý off-chain.

---

## ADR-008 — Event append-only và correction

**Status:** Accepted

**Decision:** Không sửa event approved; tạo correction.

**Reason:** Audit và hash history.

**Consequence:** UI cần hiển thị trạng thái hiện hành và giữ lịch sử nội bộ.

---

## ADR-009 — Public code random tối thiểu 96-bit

**Status:** Accepted

**Decision:** Không dùng serial tăng dần.

**Reason:** Chống enumeration.

**Consequence:** Cần hệ thống generation/export.

---

## ADR-010 — Secret digest dùng HMAC với pepper

**Status:** Proposed

**Decision:** HMAC-SHA256 để xác minh secret; pepper ở secret manager.

**Alternative:** Argon2id.

**Reason:** Secret random entropy cao, cần kiểm tra nhanh và chống DB leak bằng pepper.

**Consequence:** Phải có rate limit và rotation version.

---

## ADR-011 — Risk engine rule-based trong MVP

**Status:** Accepted

**Decision:** Không dùng ML.

**Reason:** Thiếu dữ liệu gán nhãn và cần giải thích.

**Consequence:** Rule phải cấu hình, đo false positive.

---

## ADR-012 — Không query chain trực tiếp cho page view

**Status:** Accepted

**Decision:** Receipt cache PostgreSQL; worker reconcile.

**Reason:** Performance và availability.

**Consequence:** Proof có thể pending và có thời gian đồng bộ.

---

## ADR-013 — Petal Pack là pilot unit-level

**Status:** Accepted

**Decision:** Classic theo batch; Petal Pack theo pack; Gift Set theo hộp.

**Reason:** Giá trị, trải nghiệm và chi phí khác nhau.

**Consequence:** Không áp dụng một mức truy xuất cho mọi SKU.

---

## ADR-014 — Secret export chỉ hiển thị một lần

**Status:** Accepted

**Decision:** Plain secret chỉ xuất trong file in có thời hạn.

**Reason:** Giảm bề mặt lộ.

**Consequence:** Mất file phải void/reissue, không phục hồi secret.

---

## ADR-015 — Permissioned network chỉ khi có đối tác độc lập

**Status:** Accepted

**Decision:** Không triển khai Fabric chỉ với node do Senova kiểm soát.

**Reason:** Không tăng tính độc lập đáng kể.

**Consequence:** R3 có thể dùng database/EVM testnet trước.
