# 06. Frontend implementation

## 1. Mục tiêu

Mở rộng website hiện tại bằng trace feature, không tách khỏi hệ trải nghiệm Senova.

Luồng Petal Pack:

```text
/q/:publicCode
    ↓
Resolve QR
    ↓
/trace/:publicCode
    ↓
Trạng thái xác minh
    ↓
Timeline nguồn gốc
    ↓
Kích hoạt bằng mã dưới tem
    ↓
Hướng dẫn: quan sát → tách nhẹ cánh để thưởng hương → pha nguyên búp
    ↓
Câu chuyện văn hóa và phản hồi
```

## 2. Route

Cập nhật `AppRouter.tsx`:

```text
/q/:code
/trace/:publicCode
/trace/:publicCode/support
```

Không thay:

```text
/experience/classic
/experience/petal-pack
/experience/gift-set
```

## 3. Cấu trúc file

```text
src/features/trace/
  pages/
    TracePage/
      index.tsx
    TraceSupportPage/
      index.tsx
  components/
    VerificationStatusCard/
    TraceProductHero/
    BatchSummary/
    ProvenanceTimeline/
    ActivationPanel/
    BlockchainProofPanel/
    RecallNotice/
    RiskNotice/
    TraceSkeleton/
  hooks/
    useTraceUnit.ts
    useActivation.ts
  services/
    traceStatus.ts
    traceCopy.ts
    clientToken.ts
  types/
    trace.ts

src/shared/api/
  trace.ts
```

## 4. Thay đổi QrRedirectPage

Pseudo-code:

```ts
const result = await resolveQr(code);

if (result.status !== "active") {
  renderQrStatus(result);
  return;
}

trackQrScan(...);

if (result.flowType === "unit-trace" && result.traceUrl) {
  navigate(result.traceUrl);
  return;
}

if (result.flowType === "batch-trace" && result.traceUrl) {
  navigate(result.traceUrl);
  return;
}

navigate(result.redirectUrl);
```

Không hard-code product slug để quyết định trace.

## 5. TypeScript types

```ts
export type PublicVerificationStatus =
  | "not-distributed"
  | "valid-unactivated"
  | "activated"
  | "recheck"
  | "suspicious"
  | "compromised"
  | "recalled"
  | "invalid";

export type TraceProof = {
  status: "not-anchored" | "pending" | "confirmed" | "failed";
  network?: string;
  rootHash?: string;
  transactionId?: string;
  verifiedAt?: string;
};

export type TraceUnitView = {
  publicCode: string;
  product: {
    slug: "classic" | "petal-pack" | "gift-set";
    name: string;
    role: "Giữ" | "Mở" | "Trao";
  };
  batch: {
    batchCode: string;
    packagedAt?: string;
    bestBefore?: string;
  };
  verification: {
    status: PublicVerificationStatus;
    activatedAt?: string;
    messageCode: string;
  };
  trace: {
    sourceSummary: Record<string, string | null>;
    timeline: TraceTimelineItem[];
  };
  proof: TraceProof;
  content: {
    experiencePath: string;
    contentVersion: string;
  };
};
```

## 6. State UI

### 6.1. Valid, chưa kích hoạt

Tiêu đề:

> Mã sản phẩm hợp lệ và chưa được kích hoạt.

CTA:

> Mở niêm phong và nhập mã xác thực.

### 6.2. Đã kích hoạt

> Mã này đã được kích hoạt vào {time}. Nếu bạn là người đã mở sản phẩm, đây là trạng thái bình thường.

Không hiển thị cảnh báo đỏ mặc định.

### 6.3. Recheck

> Hệ thống ghi nhận thêm lượt truy cập và cần đối chiếu. Điều này chưa đủ để kết luận sản phẩm không chính hãng.

### 6.4. Suspicious

> Mã có dấu hiệu được sử dụng trên nhiều thiết bị hoặc trong điều kiện bất thường. Vui lòng kiểm tra niêm phong và gửi yêu cầu hỗ trợ.

### 6.5. Compromised

> Mã xác thực đã được xác nhận là bị lạm dụng. Không tiếp tục sử dụng sản phẩm trước khi được Senova hỗ trợ.

### 6.6. Recalled

Recall notice phải đứng trên toàn bộ nội dung khác.

## 7. Activation UX

Form chỉ có:

- secret code;
- checkbox xác nhận đã mở niêm phong;
- submit;
- privacy note ngắn.

Không yêu cầu:

- tài khoản;
- email;
- số điện thoại;
- vị trí chính xác.

Sau activation thành công:

- xóa input khỏi state;
- không lưu secret trong localStorage;
- chuyển focus đến status;
- phát event `trace_activation_success`;
- hiển thị nút sang trải nghiệm pha.

## 8. Client token

Dùng random token lưu localStorage để phân biệt scan cùng trình duyệt mà không fingerprint xâm lấn:

```ts
const key = "senova_trace_client_token";
const token = localStorage.getItem(key) ?? crypto.randomUUID();
localStorage.setItem(key, token);
```

Backend chỉ lưu hash. Token không phải định danh người dùng và có thể bị xóa.

## 9. Analytics

Event đề xuất:

- `trace_page_view`
- `trace_timeline_view`
- `trace_activation_start`
- `trace_activation_success`
- `trace_activation_already_used`
- `trace_activation_invalid`
- `trace_support_open`
- `trace_proof_view`
- `trace_experience_continue`

Không gửi:

- secret code;
- email;
- phone;
- raw message hỗ trợ;
- precise location.

## 10. Loading và lỗi

### Loading

- skeleton hero;
- skeleton timeline;
- không hiển thị trạng thái giả trước khi API trả.

### Network error

- nút thử lại;
- vẫn cho xem trang sản phẩm chung;
- không suy diễn mã invalid.

### Proof pending

- hiển thị “Bằng chứng đang được đồng bộ”.
- trace data vẫn hiển thị.

## 11. Accessibility

- status có icon + text, không chỉ màu.
- `aria-live="polite"` cho activation result.
- timeline dùng danh sách semantic.
- input secret có label thật.
- error liên kết bằng `aria-describedby`.
- focus management sau submit.
- target chạm tối thiểu 44 px.
- hỗ trợ reduced motion.

## 12. Mobile-first layout

Thứ tự:

1. recall/risk notice;
2. product identity;
3. verification status;
4. activation;
5. origin summary;
6. timeline;
7. blockchain proof;
8. cultural experience;
9. feedback/support.

Không đặt metadata blockchain ở hero chính.

## 13. Component acceptance

### VerificationStatusCard

- render đủ 8 trạng thái;
- copy theo message code từ mapping;
- không dùng từ “giả” trừ nội dung support đã review.

### ActivationPanel

- disable khi recalled/void/compromised;
- submit idempotency key;
- không giữ secret sau submit;
- xử lý 429 với countdown tổng quát.

### BlockchainProofPanel

- collapsed mặc định;
- giải thích hash bằng ngôn ngữ phổ thông;
- transaction ID có nút copy;
- không yêu cầu người dùng hiểu blockchain.

## 14. Test frontend

- route unit trace;
- QR cũ vẫn redirect;
- activation success;
- already activated;
- secret invalid;
- rate limited;
- recalled;
- proof pending;
- API offline;
- keyboard-only;
- mobile 360 px;
- no secret in analytics mock.
