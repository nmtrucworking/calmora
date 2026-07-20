# 10. Admin dashboard và vận hành

## 1. Module admin

### 1.1. Batch registry

Danh sách:

- batch code;
- product;
- status;
- revision;
- số unit;
- QA state;
- public visibility;
- anchor status;
- packaged date.

Filter:

- product;
- status;
- date;
- anchor status;
- risk count.

### 1.2. Batch detail

Sections:

1. overview;
2. source summary;
3. event timeline;
4. documents;
5. unit counts;
6. QA approval;
7. anchor history;
8. audit log;
9. recall controls.

### 1.3. Unit registry

- search public code;
- status;
- batch;
- printed/packed/distributed time;
- activation time;
- risk score;
- scan count;
- support case.

Không hiển thị secret.

### 1.4. Risk review queue

Priority:

- scan before distributed;
- many clients;
- many invalid secret attempts;
- impossible travel;
- code used across many units/IP source;
- user report.

Actions:

- clear false positive;
- maintain recheck;
- mark suspicious;
- confirm compromised;
- recall;
- void;
- open support case.

Mọi action cần reason.

### 1.5. Anchor monitor

- pending;
- submitted;
- confirmed;
- failed;
- retry count;
- network;
- transaction ID;
- root hash;
- mismatch.

## 2. Workflow tạo batch

1. Create draft.
2. Add source metadata.
3. Add trace events.
4. Attach document hashes.
5. Submit QA.
6. QA approve.
7. Issue units.
8. Export print file.
9. Mark printed.
10. Mark packed.
11. Mark distributed.
12. Anchor revision.

Không issue unit cho batch void.

## 3. Unit issuance workflow

### Input

- quantity;
- code profile;
- product/batch;
- export format;
- label template version.

### Output

- issue job ID;
- count;
- secure download;
- checksum;
- expiry.

Audit:

- actor;
- quantity;
- batch;
- download time;
- export checksum.

## 4. Bulk transition

Bulk action cần:

- list code hoặc upload scan result;
- dry-run;
- count valid/invalid;
- confirmation;
- idempotency;
- partial failure report.

Không cho bulk transition sang `activated`.

## 5. Recall

### Batch recall

- reason code;
- public message;
- affected unit count;
- effective time;
- approver;
- notification plan.

Khi recall:

- public trace ưu tiên recall notice;
- activation disabled;
- unit không bị xóa;
- anchor revision mới;
- audit event.

### Unit recall

Dùng khi lỗi riêng từng pack.

## 6. Correction

Không edit event approved.

UI:

1. chọn event;
2. tạo correction;
3. nêu reason;
4. nhập payload mới;
5. approve;
6. tăng revision;
7. anchor mới.

## 7. Support flow

Trang support nhận:

- public code tự điền;
- vấn đề;
- ảnh tem optional;
- thông tin liên hệ optional và consent.

Support admin xem:

- trạng thái unit;
- timeline;
- activation attempts aggregate;
- risk reasons;
- prior review.

Không xem secret.

## 8. Dashboard KPI

- issued/printed/packed/distributed;
- activation rate;
- scan-to-activation;
- invalid secret rate;
- suspicious rate;
- false-positive cleared;
- scan before distribution;
- anchor pending/failed;
- mean time to review;
- mean time to resolve support;
- print error rate;
- mapping error rate.

## 9. Operational controls

- feature flag `TRACEABILITY_ENABLED`;
- feature flag `UNIT_ACTIVATION_ENABLED`;
- feature flag `LEDGER_ANCHOR_ENABLED`;
- kill switch activation;
- pause QR by batch;
- pause anchor worker;
- emergency revoke signer.

## 10. SOP tối thiểu

- SOP sinh mã;
- SOP chuyển file nhà in;
- SOP kiểm tra sau in;
- SOP gắn tem;
- SOP mark distributed;
- SOP QA approve;
- SOP recall;
- SOP xử lý mã nghi vấn;
- SOP mất file secret;
- SOP signer incident.

## 11. Audit events

- `trace_batch_created`
- `trace_event_created`
- `trace_event_approved`
- `trace_units_issued`
- `trace_secret_export_downloaded`
- `trace_units_marked_printed`
- `trace_units_marked_packed`
- `trace_units_marked_distributed`
- `trace_risk_reviewed`
- `trace_batch_recalled`
- `trace_anchor_retried`
- `trace_correction_approved`

## 12. Không cho phép

- xem secret sau export;
- xóa audit;
- edit root hash;
- mark activated thủ công;
- approve không có permission;
- recall không reason;
- bulk update không dry-run;
- download secret file không audit.
