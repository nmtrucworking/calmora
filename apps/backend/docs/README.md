# Senova Backend Documentation

> Bộ tài liệu đặc tả backend đầy đủ cho repository `calmora`.
>
> Phạm vi tài liệu bao phủ cả trạng thái hiện tại, kiến trúc mục tiêu và các trường hợp mở rộng khi Senova chuyển từ website giới thiệu/thu thập quan tâm sang nền tảng nội dung, QR trải nghiệm, thương mại và quản trị vận hành.

## 1. Mục tiêu

Bộ tài liệu này dùng làm nguồn tham chiếu thống nhất cho:

- Backend developer.
- Frontend developer.
- QA/tester.
- DevOps.
- Product owner/BA.
- Người quản trị nội dung và vận hành Senova.

Tài liệu không giả định rằng toàn bộ chức năng đã được triển khai. Mỗi tài liệu phải phân biệt rõ:

| Ký hiệu | Ý nghĩa |
| --- | --- |
| `CURRENT` | Đã có trong code hiện tại hoặc đã có API chạy được. |
| `NEXT` | Nên triển khai trong giai đoạn kế tiếp để thay mock/in-memory. |
| `TARGET` | Kiến trúc đầy đủ cho vận hành dài hạn. |
| `OPTIONAL` | Chỉ triển khai khi có nhu cầu nghiệp vụ hoặc quy mô phù hợp. |

## 2. Bối cảnh hiện tại

Backend hiện tại là FastAPI và đang tập trung vào:

- Health check.
- Resolve QR và nội dung trải nghiệm QR.
- Ghi nhận QR scan.
- Nhận các loại submission.
- Ghi nhận analytics event.
- Seed JSON và lưu dữ liệu runtime trong bộ nhớ tiến trình.

Frontend hiện có các nhóm chức năng lớn:

- Website nội dung và câu chuyện thương hiệu.
- Danh mục ba dòng sản phẩm: Senova Classic, Senova Petal Pack và Senova Gift Set.
- QR sản phẩm, trải nghiệm văn hóa và phản hồi.
- Contact, partner, sample-interest và reorder/pre-order.
- Các bề mặt commerce dạng mock: collection, search, wishlist, bag, checkout, account và order status.
- Journal, dịch vụ, chính sách và nội dung SEO.

Vì vậy, backend mục tiêu được thiết kế theo hướng **modular monolith**, đủ tách domain nhưng không tạo chi phí vận hành microservice quá sớm.

## 3. Bản đồ tài liệu

| Tài liệu | Nội dung |
| --- | --- |
| [`01-system-scope-and-architecture.md`](./01-system-scope-and-architecture.md) | Phạm vi hệ thống, nguyên tắc kiến trúc, module, luồng chính, lựa chọn công nghệ. |
| [`02-domain-model-and-business-rules.md`](./02-domain-model-and-business-rules.md) | Domain model, vòng đời thực thể, quy tắc nghiệp vụ, trạng thái và bất biến dữ liệu. |
| [`03-database-design.md`](./03-database-design.md) | Thiết kế PostgreSQL, bảng, khóa, index, soft delete, audit và retention. |
| [`04-api-contracts.md`](./04-api-contracts.md) | Quy ước REST API, endpoint public/account/admin, request/response, phân trang và lỗi. |
| [`05-authentication-authorization.md`](./05-authentication-authorization.md) | Authentication, session/token, RBAC, permission matrix và bảo vệ route. |
| [`06-cross-cutting-concerns.md`](./06-cross-cutting-concerns.md) | Validation, idempotency, concurrency, rate limit, file upload, email, jobs và caching. |
| [`07-security-privacy-and-compliance.md`](./07-security-privacy-and-compliance.md) | Security baseline, PII, consent, retention, secrets, threat model và incident handling. |
| [`08-testing-and-quality.md`](./08-testing-and-quality.md) | Test pyramid, contract test, integration test, security test, performance test và DoD. |
| [`09-deployment-observability-and-operations.md`](./09-deployment-observability-and-operations.md) | Môi trường, Docker, CI/CD, migration, logging, metrics, alert, backup và runbook. |
| [`10-implementation-roadmap.md`](./10-implementation-roadmap.md) | Lộ trình chuyển từ backend hiện tại sang kiến trúc đầy đủ, theo milestone và tiêu chí hoàn thành. |
| [`features/qr-product-cultural-story.md`](./features/qr-product-cultural-story.md) | Đặc tả chuyên sâu QR và câu chuyện văn hóa sản phẩm hiện có. |

## 4. Phạm vi chức năng đầy đủ

### 4.1. Public experience

- Product catalog.
- Product detail và variant.
- Collection.
- Search.
- Content page, journal, service và policy.
- QR resolve.
- QR experience content theo sản phẩm, phiên bản, lô và ngôn ngữ.
- Form contact, partner, sample-interest, feedback và reorder/pre-order.
- Analytics event không chứa PII.

### 4.2. Customer account

- Đăng ký, đăng nhập, đăng xuất.
- Xác minh email.
- Quên/đặt lại mật khẩu.
- Hồ sơ và địa chỉ.
- Wishlist.
- Cart.
- Đơn hàng và theo dõi trạng thái.
- Consent và quyền riêng tư.

### 4.3. Commerce

Hệ thống hỗ trợ hai chế độ:

1. **Inquiry mode**: checkout chỉ tạo yêu cầu tư vấn/đặt trước, chưa thu tiền trực tuyến.
2. **Transactional mode**: tạo order, payment, shipment và hoàn tiền theo quy trình đầy đủ.

Không được mô tả checkout hiện tại là thanh toán thật khi chưa tích hợp payment gateway và đối soát.

### 4.4. Admin/back-office

- Quản trị product, variant, price, inventory và collection.
- Quản trị content, journal, SEO và phiên bản nội dung QR.
- Quản trị QR code, batch override và trạng thái phát hành.
- Xử lý submission/lead.
- Xử lý order, payment và shipment.
- Quản trị customer và consent theo quyền.
- Dashboard analytics.
- Media library.
- User, role, permission.
- Audit log.

## 5. Nguyên tắc bắt buộc

1. **API contract ổn định**: frontend không phụ thuộc trực tiếp vào cấu trúc database.
2. **Không lưu production data trong memory**: dữ liệu nghiệp vụ phải được lưu bền vững.
3. **Không log PII thô**: đặc biệt với form, địa chỉ, điện thoại và payment metadata.
4. **Không open redirect**: đích QR chỉ đến từ registry nội bộ đã được kiểm duyệt.
5. **Không tự suy diễn nội dung văn hóa hoặc hướng dẫn pha**: content phải có phiên bản và trạng thái duyệt.
6. **Mọi thao tác admin quan trọng phải audit được**.
7. **Mọi create endpoint có rủi ro gửi lặp phải hỗ trợ idempotency**.
8. **Mọi cập nhật tồn kho/đơn hàng phải xử lý concurrency**.
9. **Không đưa payment card data vào hệ thống**: chỉ lưu token/reference từ cổng thanh toán.
10. **Migration phải chạy trước application rollout và có phương án rollback dữ liệu**.

## 6. Cấu trúc code mục tiêu

```text
apps/backend/
  app/
    main.py
    api/
      dependencies.py
      router.py
      routes/
        public/
        account/
        admin/
    core/
      config.py
      errors.py
      logging.py
      security.py
      telemetry.py
    db/
      base.py
      session.py
      migrations/
    modules/
      auth/
      users/
      catalog/
      content/
      qr/
      submissions/
      commerce/
      inventory/
      payments/
      fulfillment/
      analytics/
      media/
      notifications/
      audit/
    workers/
    tests/
  docs/
  alembic.ini
  requirements.txt
```

Mỗi module nên có tối thiểu:

```text
module/
  models.py
  schemas.py
  repository.py
  service.py
  routes.py
  permissions.py
  events.py
```

Không bắt buộc tạo đủ file khi module còn nhỏ. Mục tiêu là giữ ranh giới trách nhiệm, không tạo cấu trúc rỗng chỉ để đúng mẫu.

## 7. Quy trình cập nhật tài liệu

Khi thêm hoặc đổi chức năng backend:

1. Cập nhật business rule nếu hành vi nghiệp vụ thay đổi.
2. Cập nhật API contract trước hoặc cùng pull request code.
3. Cập nhật database design nếu thêm bảng/index/constraint.
4. Thêm test case tương ứng.
5. Cập nhật migration/rollout note nếu thay đổi không tương thích.
6. Ghi rõ endpoint hoặc module đang ở trạng thái `CURRENT`, `NEXT`, `TARGET` hay `OPTIONAL`.

## 8. Definition of Done cho tài liệu backend

Một feature chỉ được coi là có đặc tả đủ khi có:

- Phạm vi và trường hợp ngoài phạm vi.
- Actor và quyền truy cập.
- Luồng chính.
- Luồng lỗi/biên.
- Dữ liệu vào/ra.
- Business rule.
- API contract.
- Dữ liệu lưu trữ.
- Security/privacy consideration.
- Audit/analytics requirement.
- Test cases.
- Rollout và migration note nếu ảnh hưởng production.
