# 05. API contracts

## 1. Quy ước chung

Base path mới:

```text
/api/v1
```

Envelope:

```json
{
  "success": true,
  "data": {}
}
```

Lỗi:

```json
{
  "success": false,
  "error": {
    "code": "TRACE_UNIT_NOT_FOUND",
    "message": "Trace unit was not found.",
    "requestId": "..."
  }
}
```

Mutation quan trọng yêu cầu:

```http
Idempotency-Key: <8-128 safe characters>
```

Không trả internal UUID, secret digest, raw IP hoặc full user-agent qua public API.

## 2. Mở rộng QR resolve

### `GET /api/v1/qr/{code}`

Response `unit-trace`:

```json
{
  "success": true,
  "data": {
    "code": "U7K9M4C8Q2",
    "productSlug": "petal-pack",
    "batchCode": "PP-20260720-B03",
    "contentVersion": "v2",
    "flowType": "unit-trace",
    "status": "active",
    "traceUrl": "/trace/U7K9M4C8Q2",
    "redirectUrl": null
  }
}
```

Response `experience` giữ compatibility.

## 3. Public trace API

### 3.1. Unit trace

```http
GET /api/v1/trace/units/{publicCode}
```

Response:

```json
{
  "success": true,
  "data": {
    "publicCode": "U7K9M4C8Q2",
    "product": {
      "slug": "petal-pack",
      "name": "Senova Petal Pack",
      "role": "Mở"
    },
    "batch": {
      "batchCode": "PP-20260720-B03",
      "packagedAt": "2026-07-20T09:00:00Z",
      "bestBefore": null
    },
    "verification": {
      "status": "valid-unactivated",
      "activatedAt": null,
      "messageCode": "UNIT_VALID_NOT_ACTIVATED"
    },
    "trace": {
      "sourceSummary": {
        "lotusRegion": "Đồng Tháp",
        "teaType": "Trà xanh ướp hương sen"
      },
      "timeline": [
        {
          "type": "lotus_received",
          "occurredAt": "2026-07-15T02:30:00Z",
          "title": "Tiếp nhận nguyên liệu sen",
          "locationLabel": "Đồng Tháp"
        }
      ]
    },
    "proof": {
      "status": "confirmed",
      "network": "senova-testnet",
      "rootHash": "sha256:...",
      "transactionId": "0x...",
      "verifiedAt": "2026-07-20T10:00:00Z"
    },
    "content": {
      "experiencePath": "/experience/petal-pack",
      "contentVersion": "v2"
    }
  }
}
```

### 3.2. Batch trace

```http
GET /api/v1/trace/batches/{batchCode}
```

Chỉ trả dữ liệu public và aggregate; không trả unit list.

### 3.3. Scan event

```http
POST /api/v1/trace/units/{publicCode}/scan
```

Request:

```json
{
  "source": "qr",
  "path": "/q/U7K9M4C8Q2",
  "campaign": "pilot-2026",
  "clientToken": "browser-generated-random-token",
  "regionCode": "VN-SG"
}
```

`regionCode` optional và chỉ gửi khi người dùng đồng ý hoặc lấy từ cấp độ không chính xác. Frontend không gửi latitude/longitude.

Response luôn nhẹ:

```json
{
  "success": true,
  "data": {
    "accepted": true,
    "riskLevel": "normal"
  }
}
```

### 3.4. Activation

```http
POST /api/v1/trace/units/{publicCode}/activate
Idempotency-Key: activate-<uuid>
```

Request:

```json
{
  "secretCode": "7M4K-92AX-PQ5T",
  "clientToken": "browser-generated-random-token",
  "consent": {
    "coarseRegion": false
  }
}
```

Success lần đầu:

```json
{
  "success": true,
  "data": {
    "result": "activated",
    "verificationStatus": "activated",
    "activatedAt": "2026-07-20T13:20:00Z",
    "messageCode": "ACTIVATION_SUCCESS"
  }
}
```

Đã kích hoạt:

```json
{
  "success": true,
  "data": {
    "result": "already-activated",
    "verificationStatus": "activated",
    "activatedAt": "2026-07-20T13:20:00Z",
    "messageCode": "UNIT_ALREADY_ACTIVATED"
  }
}
```

Secret sai:

```json
{
  "success": false,
  "error": {
    "code": "SECRET_CODE_INVALID",
    "message": "The verification code is invalid."
  }
}
```

Không tiết lộ phần nào của secret.

### 3.5. Proof

```http
GET /api/v1/trace/units/{publicCode}/proof
```

Response:

```json
{
  "success": true,
  "data": {
    "entityType": "unit",
    "entityPublicCode": "U7K9M4C8Q2",
    "schemaVersion": "trace-bundle-v1",
    "revision": 2,
    "localRootHash": "sha256:...",
    "anchoredRootHash": "sha256:...",
    "match": true,
    "anchorStatus": "confirmed",
    "network": "senova-testnet",
    "transactionId": "0x..."
  }
}
```

## 4. Admin batch API

Permission prefix đề xuất: `trace.*`.

### 4.1. Create batch

```http
POST /api/v1/admin/trace/batches
X-CSRF-Token: ...
```

Request:

```json
{
  "batchCode": "PP-20260720-B03",
  "productSlug": "petal-pack",
  "contentVersion": "v2",
  "productionDate": "2026-07-20"
}
```

### 4.2. Add event

```http
POST /api/v1/admin/trace/batches/{batchId}/events
```

Request:

```json
{
  "eventType": "drying_completed",
  "occurredAt": "2026-07-18T08:00:00Z",
  "locationCode": "FACILITY-HCM-01",
  "payload": {
    "method": "heat-pump-low-temperature",
    "targetTemperatureC": "45",
    "durationHours": "12",
    "measuredMoisturePercent": null
  }
}
```

Số đo chưa xác nhận để `null`, không dùng giá trị giả.

### 4.3. Approve batch

```http
POST /api/v1/admin/trace/batches/{batchId}/approve
Idempotency-Key: ...
```

Backend validate required event, increment revision và tạo anchor outbox.

### 4.4. Recall batch

```http
POST /api/v1/admin/trace/batches/{batchId}/recall
```

Request:

```json
{
  "reasonCode": "QUALITY_REVIEW",
  "publicMessage": "Sản phẩm thuộc lô này đang được kiểm tra bổ sung.",
  "internalNote": "..."
}
```

## 5. Admin unit API

### 5.1. Issue units

```http
POST /api/v1/admin/trace/batches/{batchId}/units/issue
Idempotency-Key: ...
```

Request:

```json
{
  "quantity": 100,
  "codeProfile": "petal-pack-v1",
  "exportFormat": "csv"
}
```

Response không trả secret digest; trả secret plaintext đúng một lần trong file export có kiểm soát. Không log response body.

### 5.2. Mark printed/packed/distributed

```http
POST /api/v1/admin/trace/units/{unitId}/transition
```

Request:

```json
{
  "action": "mark-packed",
  "expectedVersion": 2
}
```

### 5.3. Void unit

```http
POST /api/v1/admin/trace/units/{unitId}/void
```

### 5.4. Risk review

```http
POST /api/v1/admin/trace/units/{unitId}/risk-review
```

Request:

```json
{
  "decision": "clear-false-positive",
  "reason": "Khách hàng quét lại bằng hai thiết bị trong cùng hộ gia đình."
}
```

## 6. Ledger admin API

```http
POST /api/v1/admin/trace/batches/{batchId}/anchor
GET  /api/v1/admin/trace/anchors
POST /api/v1/admin/trace/anchors/{anchorId}/retry
POST /api/v1/admin/trace/anchors/reconcile
```

## 7. Error codes

| Code | HTTP |
|---|---:|
| `TRACE_UNIT_NOT_FOUND` | 404 |
| `TRACE_BATCH_NOT_FOUND` | 404 |
| `TRACE_UNIT_VOID` | 409 |
| `TRACE_UNIT_RECALLED` | 409 |
| `TRACE_UNIT_NOT_DISTRIBUTED` | 409 |
| `SECRET_CODE_INVALID` | 400 |
| `ACTIVATION_RATE_LIMITED` | 429 |
| `IDEMPOTENCY_CONFLICT` | 409 |
| `TRACE_STATE_CONFLICT` | 409 |
| `TRACE_REQUIRED_EVENTS_MISSING` | 422 |
| `TRACE_DOCUMENT_HASH_MISMATCH` | 422 |
| `LEDGER_ANCHOR_PENDING` | 202 |
| `LEDGER_UNAVAILABLE` | 503 admin-only |
| `TRACE_PROOF_MISMATCH` | 409 |

## 8. Security contract

- Activation response không cho biết mã sai bao nhiêu ký tự.
- Not-found và invalid token có latency gần tương đương.
- Admin unit export cần permission riêng `trace.units.export_secrets`.
- Secret export có audit event.
- Public proof không trả private storage URL.
- API log middleware redact `secretCode`.
