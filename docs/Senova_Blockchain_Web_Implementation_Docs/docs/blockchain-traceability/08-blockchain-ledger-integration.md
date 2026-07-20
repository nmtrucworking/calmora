# 08. Tích hợp blockchain và ledger

## 1. Vai trò của blockchain

Blockchain chỉ chứng minh rằng một hash hoặc root hash đã tồn tại tại một thời điểm và không bị sửa mà không để lại lịch sử.

Blockchain không chứng minh:

- sen thật sự đến từ vùng khai báo;
- cảm biến đo đúng;
- người nhập dữ liệu trung thực;
- QR chưa bị sao chép;
- pack vật lý khớp mã nếu quy trình in sai.

Do đó blockchain là lớp bằng chứng sau quy trình kiểm soát dữ liệu.

## 2. Mô hình triển khai theo giai đoạn

### R1 — Database ledger

- tạo canonical bundle;
- hash SHA-256;
- lưu `ledger_anchors` network `database-local`;
- proof endpoint hoạt động;
- dùng để hoàn thiện contract.

### R3 — EVM testnet

- smart contract đơn giản lưu anchor;
- backend worker ký giao dịch;
- không token/NFT;
- transaction async;
- phù hợp demo và kiểm thử liên kết công khai.

### R4 — Permissioned ledger

Chỉ triển khai khi có ít nhất hai tổ chức độc lập:

- Senova;
- nhà cung cấp;
- cơ sở sản xuất;
- phòng kiểm nghiệm.

Hyperledger Fabric hoặc nền tảng permissioned tương đương phù hợp hơn nếu cần danh tính tổ chức, quyền riêng tư và quản trị thành viên.

## 3. Canonical bundle

### 3.1. Quy tắc

- UTF-8;
- key sort lexicographic;
- timestamp UTC ISO 8601;
- decimal lưu chuỗi;
- bỏ field volatile;
- `null` được giữ có chủ đích;
- schema version bắt buộc;
- event sort theo `occurredAt`, sau đó `id`;
- document sort theo `sha256`.

### 3.2. Ví dụ

```json
{
  "schemaVersion": "trace-bundle-v1",
  "entity": {
    "type": "batch",
    "code": "PP-20260720-B03",
    "revision": 4
  },
  "events": [
    {
      "eventType": "drying_completed",
      "occurredAt": "2026-07-18T08:00:00Z",
      "payloadHash": "sha256:..."
    }
  ],
  "documents": [
    {
      "documentType": "qa-report",
      "sha256": "sha256:..."
    }
  ],
  "previousRootHash": "sha256:..."
}
```

Hash:

```text
rootHash = SHA256(canonical_json_bytes)
```

## 4. Merkle tree

MVP có thể hash toàn bundle. Khi event lớn, dùng Merkle tree:

```text
leaf = SHA256(event_canonical_json)
root = merkle(leaves)
```

Lợi ích:

- proof từng event;
- không cần trả toàn bundle;
- dễ mở rộng.

Không triển khai Merkle sớm nếu chưa có nhu cầu.

## 5. Smart contract tối thiểu cho EVM

Interface khái niệm:

```solidity
event TraceAnchored(
    bytes32 indexed entityKey,
    uint256 revision,
    bytes32 rootHash,
    bytes32 previousRootHash,
    uint256 anchoredAt
);

function anchor(
    bytes32 entityKey,
    uint256 revision,
    bytes32 rootHash,
    bytes32 previousRootHash
) external onlyRole(ANCHOR_ROLE);
```

Contract rule:

- revision phải lớn hơn revision trước;
- root hash không zero;
- không overwrite;
- emit event;
- role-based access;
- pause khi sự cố.

Không lưu raw batch code nếu cần giảm lộ dữ liệu; dùng:

```text
entityKey = keccak256("batch:" + batchCode)
```

## 6. Ledger outbox

### 6.1. Tại sao cần outbox

- không để chain outage làm rollback nghiệp vụ;
- retry có kiểm soát;
- tránh transaction phân tán;
- hỗ trợ reconciliation.

### 6.2. Worker

Pseudo-code:

```python
async def run_once():
    jobs = await repo.claim_jobs(limit=20)
    for job in jobs:
        try:
            bundle = await proof_builder.build(job.aggregate_id, job.revision)
            receipt = await ledger.anchor(bundle)
            await repo.confirm(job, bundle, receipt)
        except RetryableLedgerError as exc:
            await repo.retry(job, backoff(job.attempts), str(exc))
        except PermanentLedgerError as exc:
            await repo.fail(job, str(exc))
```

Backoff:

```text
1m → 5m → 15m → 1h → 6h
```

Sau ngưỡng chuyển `failed` và alert.

## 7. Idempotency anchor

Idempotency key:

```text
network + entityType + entityId + revision
```

Worker phải:

1. kiểm tra local anchor;
2. kiểm tra transaction receipt nếu đã submitted;
3. chỉ gửi mới khi chưa có bằng chứng;
4. không gửi lại mù khi timeout;
5. reconcile bằng event log.

## 8. Proof verification

Public proof:

1. build local canonical bundle;
2. tính local root;
3. lấy anchored root từ receipt/cache;
4. so sánh;
5. trả `match`.

Không query chain trực tiếp ở mọi page view. Cache receipt trong PostgreSQL.

## 9. Key management

### Staging

- private key trong secret manager;
- ví riêng cho staging;
- hạn mức thấp;
- không dùng khóa cá nhân.

### Production

- KMS/HSM hoặc managed signer;
- role separation;
- rotate key;
- emergency revoke;
- không log signed transaction raw nếu chứa metadata nhạy cảm;
- admin không xem private key.

## 10. Network configuration

Environment:

```text
LEDGER_ADAPTER=database|evm|fabric
LEDGER_NETWORK=senova-testnet
LEDGER_RPC_URL=...
LEDGER_CONTRACT_ADDRESS=...
LEDGER_SIGNER_KEY_REF=...
LEDGER_CONFIRMATIONS=...
LEDGER_OUTBOX_BATCH_SIZE=20
```

Frontend không có biến private.

## 11. Chain outage

Public trace response:

```json
{
  "proof": {
    "status": "pending",
    "messageCode": "PROOF_SYNC_PENDING"
  }
}
```

Không chặn:

- trace timeline;
- activation;
- feedback.

Anchor được retry sau.

## 12. Reconciliation

Job định kỳ:

- anchor submitted quá lâu;
- receipt missing;
- tx reverted;
- local root khác anchored root;
- duplicate logical anchor;
- wrong network/contract;
- block reorg nếu dùng public chain.

Kết quả tạo audit và alert.

## 13. Permissioned network decision gate

Chỉ chuyển sang Fabric khi:

- có partner chịu vận hành node hoặc ký sự kiện;
- có governance document;
- có MSP/identity owner;
- có quy tắc onboarding/offboarding;
- có dispute process;
- có SLA;
- lợi ích cao hơn database + chữ ký số.

Nếu toàn bộ node do Senova kiểm soát, permissioned blockchain không tạo nhiều tính độc lập hơn database audit.
