# 08. Testing and Quality

## 1. Trạng thái tài liệu

- `CURRENT`: backend chưa có bộ test đầy đủ trong repository; logic tập trung trong `app/main.py`.
- `NEXT`: bổ sung unit test, API integration test và regression test cho QR, submission, analytics, error envelope.
- `TARGET`: test pyramid đầy đủ, migration/contract/security/performance/resilience test và quality gate trong CI.

## 2. Mục tiêu chất lượng

1. API hoạt động đúng contract.
2. Business rule được bảo vệ khi refactor.
3. Không làm mất dữ liệu hoặc tạo trạng thái sai khi retry/concurrency.
4. Security/privacy control có test.
5. Migration có thể chạy trên dữ liệu thật với rủi ro đã đánh giá.
6. Release có tiêu chí chấp nhận rõ, không dựa vào kiểm tra thủ công đơn lẻ.

## 3. Test pyramid

```text
                    E2E
                /-----------\
              Contract/API
            /-----------------\
          Integration/Repository
        /-------------------------\
      Unit/Domain/Schema/Utility
    /-------------------------------\
```

Tỷ lệ không bắt buộc cứng, nhưng ưu tiên:

- Nhiều unit test cho rule thuần.
- Đủ integration test với PostgreSQL/Redis/provider fake.
- Ít E2E nhưng bao phủ critical journey.

## 4. Phân loại test

| Loại | Mục đích | Chạy |
| --- | --- | --- |
| Unit | Rule/utility/service thuần | mọi PR |
| Schema/validation | Pydantic request/response | mọi PR |
| API integration | Route + middleware + DB | mọi PR |
| Repository | Query, constraint, transaction | mọi PR |
| Migration | upgrade/downgrade/backfill | PR có schema + nightly |
| Contract | OpenAPI/response compatibility | mọi PR |
| E2E | Journey frontend-backend | staging/release |
| Security | AuthZ, injection, CSRF, upload, webhook | PR nhạy cảm + scheduled |
| Performance | Latency/throughput/load | pre-release/scheduled |
| Resilience | Provider timeout, retry, queue, DB/cache failure | pre-release |
| Data quality | Aggregate/report/export | scheduled |

## 5. Test stack đề xuất

- `pytest`.
- `pytest-asyncio` nếu dùng async.
- FastAPI `TestClient` hoặc `httpx.AsyncClient`.
- `factory_boy` hoặc fixture tự viết.
- Testcontainers/PostgreSQL service trong CI.
- Redis test service khi cần.
- `freezegun` hoặc clock abstraction cho time-based rule.
- `respx`/mock transport cho outbound HTTP.
- Coverage tool.
- OpenAPI diff/checker khi contract ổn định.

Không mock database ở mọi test; constraint/transaction cần chạy trên PostgreSQL thật.

## 6. Cấu trúc test mục tiêu

```text
apps/backend/
  tests/
    conftest.py
    unit/
      core/
      modules/
        qr/
        submissions/
        catalog/
        commerce/
    integration/
      api/
      repositories/
      migrations/
      providers/
    contract/
      snapshots/
      test_openapi.py
    security/
      test_authorization.py
      test_csrf.py
      test_webhooks.py
      test_uploads.py
    performance/
      locustfile.py
    e2e/
```

## 7. Fixture principles

1. Fixture nhỏ, có mục đích rõ.
2. Không dùng một fixture khổng lồ cho mọi test.
3. Dữ liệu test deterministic.
4. Không chứa PII thật.
5. Mỗi test tự độc lập; không phụ thuộc thứ tự.
6. Database reset bằng transaction rollback/schema recreate phù hợp.
7. Clock, UUID và provider response có thể điều khiển khi cần.

Ví dụ fixture:

- `active_product`.
- `active_qr_record`.
- `paused_qr_record`.
- `published_qr_content`.
- `customer_user`.
- `content_editor`.
- `admin_user`.
- `active_cart`.
- `paid_order`.

## 8. Unit test

### 8.1. QR utility

- Normalize lowercase -> uppercase.
- Trim outer whitespace.
- Không tự sửa whitespace giữa code.
- Active record -> active.
- `active_from` tương lai -> paused.
- `expires_at < now` -> expired.
- Explicit paused/revoked có ưu tiên.
- Destination hợp lệ xây đúng query.
- Destination absolute/protocol-relative bị từ chối.
- Query client không thay destination.

### 8.2. Submission validation

Mỗi `kind`:

- Đủ required field -> pass.
- Thiếu từng required field -> validation error.
- Field chỉ whitespace -> invalid.
- Email format sai.
- Text vượt max length.
- Honeypot có giá trị -> spam.
- Optional field được giữ đúng.
- Sanitize không phá dữ liệu số/boolean.

### 8.3. Order calculation

- Subtotal.
- Line discount.
- Order discount.
- Shipping.
- Tax nếu áp dụng.
- Rounding.
- VND integer.
- Không cho total âm.
- Price snapshot không đổi khi catalog price đổi.

### 8.4. State machine

- Mọi transition hợp lệ.
- Mọi transition bị cấm.
- Idempotent transition khi nhận event lặp.
- Refund/cancel theo payment/fulfillment state.

### 8.5. Permission

- Permission đúng cho phép.
- Thiếu permission từ chối.
- Ownership rule.
- Account disabled/locked.
- Step-up/MFA rule nếu có.

## 9. Schema and serialization test

Kiểm tra:

- Request alias `camelCase` -> model `snake_case`.
- Response JSON đúng `camelCase`.
- Timestamp luôn timezone-aware.
- Money integer + currency.
- Enum invalid bị từ chối.
- Unknown field policy rõ (`forbid` cho request nhạy cảm nếu phù hợp).
- Response không vô tình chứa password hash/token/internal note.

## 10. API integration test cho backend hiện tại

### 10.1. Health

| Case | Expected |
| --- | --- |
| `GET /api/health` | 200, `success=true`, `status=ok` |
| Method không hỗ trợ | 405 envelope chuẩn sau khi middleware hoàn thiện |

### 10.2. QR resolve

| Case | Expected |
| --- | --- |
| `pp-2601-a` | normalize, active, có redirect URL |
| Code không tồn tại | 404 `QR_NOT_FOUND` |
| Paused | 200, status paused, không active redirect |
| Revoked | 200, status revoked |
| Expired theo thời gian | 200, status expired |
| Destination invalid trong fixture | lỗi cấu hình an toàn |
| Client truyền destination khác | bị bỏ qua |
| Locale/version hợp lệ | nội dung đúng |
| Content không tồn tại | 404 `QR_CONTENT_NOT_FOUND` |
| Batch override | guidance/notice đúng |

### 10.3. QR scan

| Case | Expected |
| --- | --- |
| Active QR | accepted |
| Inactive QR | event đúng status, không làm crash |
| Invalid QR | contract đã định |
| Vượt rate limit | 429 |
| Payload text có `< >` | sanitize theo behavior hiện tại |
| Event không chứa PII | schema/allowlist |

### 10.4. Submission

| Case | Expected |
| --- | --- |
| Contact hợp lệ | success + reference/id |
| Partner hợp lệ | success |
| Sample-interest hợp lệ | success |
| Feedback hợp lệ | success |
| Pre-order hợp lệ | success, không tạo order/payment trong Inquiry Mode |
| Thiếu required | 422 `VALIDATION_ERROR` |
| Honeypot | 400 `SPAM_DETECTED` |
| Vượt rate limit | 429 |
| Payload dài/quá lớn | 413/422 theo middleware |
| Restart app với PostgreSQL | submission vẫn đọc được sau restart; rate-limit bucket reset là giới hạn đã biết |

### 10.5. Analytics

- Event allowlist hợp lệ.
- Event name không hợp lệ bị từ chối sau hardening.
- PII field bị từ chối/bỏ qua theo contract.
- Vượt rate limit.
- Timestamp invalid.
- Endpoint lỗi không ảnh hưởng journey chính ở frontend.

## 11. Database integration test

Test trên PostgreSQL thật:

- Unique slug/SKU/QR code.
- FK.
- Check amount/status.
- Partial unique default variant/address.
- Transaction rollback.
- Repository filter/sort/pagination.
- JSONB query nếu có.
- Soft delete/archive behavior.
- Lock/version conflict.
- Atomic inventory reservation.

Không thay các test này bằng SQLite nếu production dùng PostgreSQL và có constraint/behavior khác.

## 12. Migration test

### 12.1. Database sạch

```text
alembic upgrade head
```

Kiểm tra:

- Tất cả bảng/index/constraint tạo được.
- Seed/reference migration idempotent nếu chạy theo quy trình.

### 12.2. Upgrade từ version trước

1. Tạo schema ở revision N.
2. Nạp fixture dữ liệu đại diện.
3. Upgrade head.
4. Kiểm tra dữ liệu/backfill.
5. Chạy API/repository test.

### 12.3. Downgrade/rollback

- Test downgrade khi migration hỗ trợ.
- Nếu downgrade mất dữ liệu, tài liệu phải ghi rõ restore/forward-fix plan.

### 12.4. Data migration

Test:

- Null/legacy value.
- Duplicate data.
- Large batch.
- Resume/retry.
- Không lock lâu ngoài dự kiến.

## 13. Contract test

### 13.1. OpenAPI

- OpenAPI sinh thành công.
- Operation ID unique.
- Security scheme đúng.
- Request/response schema có example.
- Error response được khai báo.

### 13.2. Breaking change

CI cảnh báo/fail khi:

- Xóa endpoint.
- Xóa required/response field đang dùng.
- Đổi field type.
- Đổi optional -> required.
- Thu hẹp enum.
- Đổi status code quan trọng.

Thêm enum value cũng cần review vì client exhaustive switch có thể lỗi.

### 13.3. Frontend adapter contract

Test fixture JSON giống response backend cho:

- Product.
- QR resolve/content.
- Submission response/error.
- Analytics accepted.
- Cart/order khi triển khai.

## 14. Authentication test

### Registration

- Email normalize.
- Duplicate.
- Password policy.
- Terms version.
- Không nhận role từ client.

### Verification

- Valid.
- Invalid.
- Expired.
- Used.
- Concurrent double-use.

### Login

- Success.
- Invalid password.
- Unknown email với response trung tính.
- Locked/disabled/unverified.
- Rate limit.
- Session creation.

### Refresh/session

- Rotation.
- Old token reuse.
- Revoked session.
- Expiry.
- Logout/logout-all.

### Password reset

- Request generic.
- Token invalid/expired/used.
- Password changed.
- Session revoked theo policy.

## 15. Authorization test matrix

Mỗi protected endpoint test tối thiểu:

1. Anonymous -> 401.
2. Authenticated thiếu permission -> 403.
3. Có permission -> success.
4. Có permission nhưng resource ngoài ownership/scope -> 404/403 theo policy.
5. Account disabled/locked -> denied.
6. Resource state không cho action -> 409/422.
7. Audit được tạo cho mutation quan trọng.

Critical cases:

- Editor không publish.
- Lead operator không export nếu thiếu quyền.
- Order operator không refund.
- Finance không quản lý role.
- Inventory operator không sửa trực tiếp total/order.
- User không đọc order/address của user khác.
- Admin không tự vượt delegated permission nếu mô hình đó được bật.

## 16. Commerce test

### Cart

- Add/update/remove.
- Duplicate add merge quantity theo rule.
- Quantity min/max.
- Variant archived/unavailable.
- Cart version conflict.
- Guest cart merge.
- Price refresh.

### Create order

- Empty cart.
- Valid cart.
- Price changed.
- Stock insufficient.
- Concurrent purchase last stock.
- Idempotency replay cùng payload.
- Idempotency key cùng nhưng payload khác.
- Order snapshot.
- Transaction rollback khi reservation lỗi.

### Order state

- Confirm/cancel/process/ship/deliver.
- Invalid transition.
- Duplicate command.
- Cancel after paid.
- Cancel after shipped.
- Guest access token.
- Ownership.

## 17. Inventory concurrency test

Test song song:

- Hai request cùng mua tồn cuối.
- Tổng reservation không vượt available.
- Một thành công, một `INSUFFICIENT_STOCK` hoặc behavior đã định.
- Release reservation idempotent.
- Expiry job và payment success cạnh tranh không tạo âm tồn.
- Adjustment đồng thời giữ movement đúng.

Dùng transaction thật; test unit không đủ.

## 18. Payment test

Dùng provider fake/sandbox:

- Create payment.
- Provider timeout.
- Retry/idempotency.
- Valid webhook.
- Invalid signature.
- Replay/duplicate event.
- Out-of-order event.
- Amount/currency mismatch.
- Client return forged.
- Payment success cập nhật order đúng.
- Event sau khi order cancelled.
- Partial/full refund.
- Refund vượt captured amount.
- Refund duplicate.

Không dùng card credential thật trong test.

## 19. Fulfillment test

- Tạo shipment từ order hợp lệ.
- Ship khi order chưa đủ điều kiện -> denied.
- Provider timeout/retry.
- Webhook duplicate/out-of-order.
- Tracking mapping.
- Delivered/failed/returned.
- Shipment không làm mất order history.

## 20. Content/QR publish workflow test

- Draft create/update.
- Submit review.
- Editor không publish.
- Approver publish.
- Published revision immutable.
- New revision không đổi public content trước khi publish.
- Locale fallback.
- QR activation thất bại nếu content version chưa publish.
- Batch override chỉ thay field được phép.
- Unpublish invalidates cache.

## 21. Media upload test

- Valid image.
- Size vượt giới hạn.
- MIME spoof.
- Unsupported type.
- Filename path traversal.
- Storage key random.
- Presigned URL expiry.
- Complete trước upload.
- Quarantine/scan failure.
- Private media không truy cập public.
- Media đang được tham chiếu không xóa tùy tiện.

## 22. Security test

### Injection

- SQL-like input ở search/filter.
- Stored XSS ở content/submission.
- URL scheme độc hại.
- Header injection trong email field.

### Access control

- IDOR/horizontal privilege.
- Vertical privilege.
- Mass assignment.
- Hidden admin field.

### Browser

- CORS origin sai.
- CSRF token thiếu/sai.
- Cookie flag được kiểm tra ở staging.
- Security headers.

### Abuse

- Rate limit distributed.
- Reset/login throttling.
- Analytics flood.
- Large JSON/deep nesting.

### Webhook/upload

- Signature invalid.
- Replay.
- Malicious file.

## 23. Privacy test

- Analytics schema từ chối PII field.
- Log capture không chứa raw email/phone/token/payload.
- Export cần permission và tạo audit.
- Signed export URL hết hạn.
- Consent granted/withdrawn.
- Rút consent chặn xử lý marketing sau đó.
- Privacy request xác minh danh tính.
- Anonymization giữ integrity order/audit.
- Retention job chỉ xóa đúng dữ liệu đủ điều kiện.

## 24. Performance test

### 24.1. Endpoint ưu tiên

- Health/readiness.
- Product list/detail.
- QR resolve.
- QR experience content.
- Submission create.
- Analytics ingestion.
- Admin list/filter.
- Create order/payment webhook nếu bật commerce.

### 24.2. Metric

- Throughput.
- p50/p95/p99 latency.
- Error rate.
- DB query count/time.
- Connection pool usage.
- CPU/memory.
- Queue lag.
- Cache hit rate.

### 24.3. SLO định hướng, cần đo lại

Không dùng số giả làm cam kết. Baseline nội bộ có thể đặt sau benchmark, ví dụ:

- Public cached GET p95 thấp.
- QR resolve không phụ thuộc tác vụ analytics chậm.
- Submission trả sau khi lưu bền vững, email gửi nền.
- Webhook trả nhanh sau verify + persist.

## 25. Load and soak test

Load test:

- Tăng tải theo bước.
- Spike QR scan/analytics.
- Burst submission có rate limit.
- Concurrent cart/order.

Soak test:

- Chạy lâu để phát hiện memory leak, pool leak, queue backlog.

Không chạy destructive load test vào production nếu chưa có kế hoạch và giới hạn.

## 26. Resilience test

Giả lập:

- PostgreSQL tạm unavailable.
- Redis unavailable.
- Email provider timeout.
- Payment provider 503.
- Storage error.
- Worker crash giữa job.
- Duplicate delivery.
- App restart.
- Multi-worker.

Expected:

- Dữ liệu nghiệp vụ không mất.
- Không double charge/refund.
- Submission/order đã commit vẫn tồn tại.
- Job retry idempotent.
- Health/readiness phản ánh đúng.
- Degraded feature không kéo sập toàn hệ thống nếu không cần.

## 27. Cache test

- Cache miss -> DB -> set.
- Hit trả đúng schema.
- Publish/update invalidate.
- Locale/version/batch tách key.
- Không cache PII shared.
- Redis down -> fallback DB hoặc behavior đã định.
- Stale content giới hạn chấp nhận được.

## 28. Observability test

- Mỗi request có request ID.
- Error log có code/request ID nhưng không PII.
- Metric tăng đúng.
- Trace correlation qua worker/outbox.
- Audit tạo đúng actor/target.
- Alert rule có synthetic test khi khả thi.

## 29. Test data management

- Chỉ synthetic data trong CI/local.
- Staging dùng synthetic hoặc masked data.
- Không chụp/export production DB vào repository.
- Seed có version và idempotent.
- Test account có owner và cleanup.
- Payment dùng sandbox.

## 30. Coverage policy

Coverage là tín hiệu, không phải mục tiêu duy nhất.

Khuyến nghị:

- Theo dõi line/branch coverage.
- Critical domain có branch coverage cao hơn code adapter đơn giản.
- Không viết test vô nghĩa chỉ để tăng số phần trăm.
- Mọi bug production phải có regression test nếu khả thi.

Quality gate có thể tăng dần theo codebase.

## 31. CI pipeline đề xuất

```text
1. Checkout
2. Setup Python/cache
3. Install locked dependencies
4. Lint/format
5. Type check
6. Unit tests
7. Start PostgreSQL/Redis test services
8. Alembic upgrade head
9. Integration tests
10. OpenAPI generation/diff
11. Security/dependency/secret scan
12. Build container
13. Publish artifact for protected branches
```

Chạy song song khi không phụ thuộc để giảm thời gian.

## 32. Pull request quality gate

PR backend cần:

- Mô tả thay đổi.
- Link issue/use case.
- API/data/security impact.
- Test evidence.
- Migration/rollback note nếu có.
- Docs cập nhật.

CI bắt buộc:

- Format/lint pass.
- Unit/integration pass.
- Migration pass.
- Không có secret finding nghiêm trọng.
- Không breaking API không được phê duyệt.

## 33. Definition of Ready cho feature

Trước khi code:

- Actor và permission rõ.
- Luồng chính/lỗi/biên rõ.
- Business rule rõ.
- API contract draft.
- Data model/migration impact.
- Security/privacy impact.
- Acceptance criteria.
- Dependency/provider rõ.

## 34. Definition of Done cho feature

- Code review.
- Unit/integration/contract test.
- Negative/security test phù hợp.
- Migration và rollback plan.
- OpenAPI/docs cập nhật.
- Log/metric/audit.
- Không có PII/secret leak.
- Staging smoke test.
- Feature flag/rollout plan nếu rủi ro.
- Acceptance criteria pass.

## 35. Release test checklist

### Backend hiện tại

- [ ] Health.
- [ ] QR active/paused/expired/revoked/not found.
- [ ] QR content + batch override.
- [ ] QR scan rate limit.
- [ ] Submission đủ 5 kind.
- [ ] Honeypot/validation/rate limit.
- [ ] Analytics accepted/invalid/rate limit.
- [ ] CORS production.
- [ ] Restart không làm mất production data sau khi DB migration hoàn tất.

### Khi có admin

- [ ] Login/MFA/session.
- [ ] Permission matrix.
- [ ] Content publish.
- [ ] Product/QR mutation.
- [ ] Submission PII/export audit.
- [ ] Cache invalidation.

### Khi có commerce

- [ ] Cart price refresh.
- [ ] Order idempotency.
- [ ] Inventory concurrency.
- [ ] Payment webhook verification/replay.
- [ ] Refund permission/idempotency.
- [ ] Shipment state.
- [ ] Reconciliation.

## 36. Bug severity

| Severity | Ví dụ |
| --- | --- |
| Blocker | Mất dữ liệu, double charge, bypass auth/admin, migration phá production |
| Critical | Sai order/payment/inventory, lộ PII giới hạn, QR redirect nguy hiểm |
| Major | Feature chính hỏng, contract frontend vỡ, submission không lưu |
| Minor | UI-facing message/metadata phụ, lỗi không ảnh hưởng dữ liệu |
| Trivial | Tài liệu/format nhỏ |

Severity không thay priority hoàn toàn; cần xét phạm vi và khả năng xảy ra.

## 37. Traceability matrix

Mỗi use case nên map:

```text
Use case -> Business rule -> API endpoint -> DB table/constraint -> Test case -> Metric/Audit
```

Ví dụ:

```text
UC-QR-01 Resolve active QR
-> QR destination allowlist
-> GET /api/v1/qr/{code}
-> qr_records
-> test_resolve_active_qr_builds_safe_redirect
-> qr_resolve_total{status="active"}
```

## 38. Definition of Done cho bộ test

Bộ test được coi đủ cho release khi:

- Critical journey có automated coverage.
- Business invariant có negative/concurrency test.
- API contract có regression protection.
- Migration test trên PostgreSQL.
- Security/privacy path được kiểm tra.
- Test deterministic, không phụ thuộc thứ tự.
- CI có quality gate.
- Kết quả test dễ truy vết theo commit.
