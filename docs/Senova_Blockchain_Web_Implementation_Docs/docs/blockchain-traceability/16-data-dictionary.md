# 16. Từ điển dữ liệu

## 1. TraceBatch

| Field | Type | Public | Required | Ghi chú |
|---|---|---:|---:|---|
| `id` | UUID | No | Yes | Internal |
| `batchCode` | string | Yes | Yes | Unique |
| `productSlug` | enum | Yes | Yes | classic/petal-pack/gift-set |
| `contentVersion` | string | Yes | No | Nội dung duyệt |
| `status` | enum | Partial | Yes | Internal mapped |
| `productionDate` | date | Yes | No | Khi xác nhận |
| `packagedAt` | datetime | Yes | No | |
| `bestBefore` | date | Yes | No | Không giả định |
| `sourceSummary` | object | Filtered | Yes | Public allowlist |
| `revision` | int | Yes | Yes | Tăng khi correction |
| `publicVisibility` | bool | No | Yes | |
| `createdBy` | UUID | No | Yes | |
| `approvedBy` | UUID | No | No | |

## 2. TraceUnit

| Field | Type | Public | Required | Ghi chú |
|---|---|---:|---:|---|
| `publicCode` | string | Yes | Yes | Random |
| `secretDigest` | string | Never | Yes | HMAC |
| `secretDigestVersion` | string | Never | Yes | Pepper version |
| `batchId` | UUID | No | Yes | |
| `status` | enum | Mapped | Yes | |
| `riskLevel` | enum | Mapped | Yes | |
| `riskScore` | int | No | Yes | |
| `scanCount` | int | No | Yes | |
| `uniqueClientCount` | int | No | Yes | Approximate |
| `printedAt` | datetime | No | No | |
| `packedAt` | datetime | No | No | |
| `distributedAt` | datetime | No | No | |
| `activatedAt` | datetime | Yes | No | |
| `version` | int | No | Yes | Optimistic |

## 3. TraceEvent

| Field | Type | Public | Required | Ghi chú |
|---|---|---:|---:|---|
| `eventType` | enum | Yes | Yes | Approved only |
| `entityType` | enum | No | Yes | batch/unit |
| `entityId` | UUID | No | Yes | |
| `status` | enum | No | Yes | draft/approved/superseded |
| `occurredAt` | datetime | Yes | Yes | Nghiệp vụ |
| `recordedAt` | datetime | No | Yes | Server |
| `locationCode` | string | Filtered | No | |
| `actorOrg` | string | Filtered | No | |
| `payload` | JSON | Filtered | Yes | |
| `payloadHash` | string | Yes | Yes | |
| `supersedesEventId` | UUID | No | No | Correction |

## 4. Public source summary

Allowlist gợi ý:

```json
{
  "lotusRegion": "Đồng Tháp",
  "teaType": "Trà xanh ướp hương sen",
  "processingMethod": "Sấy bơm nhiệt ở nhiệt độ thấp",
  "qualityStatus": "Đã duyệt nội bộ"
}
```

Không public:

- giá mua;
- supplier contract;
- công thức chi tiết;
- nhân sự;
- internal note;
- private document URL.

## 5. Scan event

| Field | Public | Retention |
|---|---:|---:|
| `qrCode` | No | 180d detail |
| `clientTokenHash` | No | 180d |
| `ipPrefixHash` | No | Ngắn nhất cần thiết |
| `userAgentFamily` | No | 180d |
| `regionCode` | No | 180d |
| `riskDelta` | No | 24m/aggregate |
| `occurredAt` | No | 24m/aggregate |

## 6. Activation result enum

- `activated`
- `already-activated`
- `invalid-secret`
- `not-distributed`
- `recalled`
- `void`
- `rate-limited`
- `state-conflict`

## 7. Risk level enum

- `normal`
- `recheck`
- `suspicious`
- `compromised`

## 8. Anchor status

- `not-requested`
- `pending`
- `submitted`
- `confirmed`
- `failed`
- `mismatch`
- `superseded`

## 9. Document type

- `qa-report`
- `microbiology-report`
- `moisture-report`
- `supplier-certificate`
- `batch-photo`
- `process-record`
- `recall-notice`

## 10. Hash format

Chuẩn:

```text
sha256:<64 lowercase hex>
```

Ví dụ:

```text
sha256:5f70bf18a086007016e948b04aed3b82103a36be...
```

## 11. Location

Pilot chỉ dùng code nội bộ hoặc tỉnh/thành:

```text
VN-DT
VN-SG
FACILITY-HCM-01
```

Không public GPS chính xác.

## 12. Time

- API ISO 8601 UTC.
- UI chuyển múi giờ người dùng.
- `eventTime` khác `recordTime`.
- Không tin thời gian trình duyệt cho nghiệp vụ.

## 13. Version

- `schemaVersion`: format bundle.
- `contentVersion`: nội dung trải nghiệm.
- `revision`: dữ liệu trace.
- `version`: optimistic concurrency.
- `secretDigestVersion`: pepper.
