import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  ChevronDown,
  ClipboardList,
  Clock3,
  Edit3,
  Eye,
  FileText,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  MessageSquarePlus,
  Package,
  Plus,
  QrCode,
  Save,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@app/router/RouterContext";
import { useRouter } from "@app/router/RouterState";
import { AdminStoreProvider, useAdminStore } from "./AdminStore";
import { AdminQrCode } from "./AdminQrCode";
import { demoCredentials } from "./data";
import { filterProducts, getAdminRedirect, validateProduct, type ProductValidationErrors } from "./adminLogic";
import {
  ConfirmDialog,
  EmptyState,
  formatDate,
  KpiCard,
  LineChart,
  PageHeader,
  Pagination,
  StatusBadge,
  ToastRegion,
} from "./AdminUI";
import type {
  AdminProduct,
  AdminSession,
  ProductStatus,
  ProductVariant,
  QrRecord,
  QrStatus,
  SubmissionKind,
  SubmissionStatus,
} from "./types";
import "./admin.css";

const SESSION_KEY = "senova-admin-demo-session";
const PAGE_SIZE = 5;

const kindLabels: Record<SubmissionKind, string> = {
  feedback: "Phản hồi",
  "pre-order": "Đặt trước",
  "sample-interest": "Đăng ký mẫu",
  contact: "Liên hệ",
  partners: "Đối tác",
};

const assignees = ["Chưa phân công", "Thu Hà", "Minh Khôi", "Ngọc Lan"];

function readSession(): AdminSession | null {
  try {
    const value = window.sessionStorage.getItem(SESSION_KEY);
    return value ? (JSON.parse(value) as AdminSession) : null;
  } catch {
    return null;
  }
}

function AdminLogin({ onLogin }: { onLogin: (session: AdminSession) => void }) {
  const { navigate } = useRouter();
  const [email, setEmail] = useState(demoCredentials.email);
  const [password, setPassword] = useState(demoCredentials.password);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    window.setTimeout(() => {
      if (email.trim().toLowerCase() !== demoCredentials.email || password !== demoCredentials.password) {
        setError("Email hoặc mật khẩu demo chưa đúng.");
        setSubmitting(false);
        return;
      }
      const session = { name: "Quản trị Senova", email: demoCredentials.email, role: "Administrator" };
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      onLogin(session);
      navigate("/admin");
    }, 420);
  };

  return (
    <main className="adminRoot adminLogin">
      <section className="adminLogin__panel">
        <form className="adminLogin__form" onSubmit={submit} noValidate>
          <div className="adminLogin__brand">
            <span><Leaf size={21} /></span>
            <div><strong>SENOVA</strong><small>Admin workspace</small></div>
          </div>
          <span className="adminEyebrow">Chào mừng trở lại</span>
          <h1>Đăng nhập quản trị</h1>
          <p className="adminLogin__lead">Theo dõi sản phẩm, QR và các kết nối khách hàng trong một không gian tập trung.</p>
          <div className="adminField">
            <label htmlFor="admin-email">Email <span>*</span></label>
            <input id="admin-email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className={error ? "is-error" : ""} />
          </div>
          <div className="adminField">
            <label htmlFor="admin-password">Mật khẩu <span>*</span></label>
            <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={error ? "is-error" : ""} />
            {error ? <small className="adminField__error" role="alert">{error}</small> : null}
          </div>
          <button className="adminButton adminButton--primary adminLogin__submit" type="submit" disabled={submitting}>
            {submitting ? "Đang xác thực..." : "Đăng nhập"}
          </button>
          <div className="adminLogin__demo">
            <strong>Tài khoản demo</strong>
            Email: {demoCredentials.email}<br />Mật khẩu: {demoCredentials.password}
          </div>
        </form>
      </section>
      <aside className="adminLogin__visual" aria-hidden="true">
        <div className="adminLogin__quote">
          <span>Senova Operations</span>
          <blockquote>Nuôi dưỡng từng kết nối, từ một cánh sen đến một trải nghiệm.</blockquote>
          <p>Frontend prototype · Dữ liệu trong phiên không được lưu trữ lâu dài</p>
        </div>
      </aside>
    </main>
  );
}

const navItems = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/qr", label: "Mã QR", icon: QrCode },
  { href: "/admin/submissions", label: "Khách hàng tiềm năng", icon: Users },
  { href: "/admin/analytics", label: "Phân tích", icon: BarChart3 },
];

function pageLabel(pathname: string) {
  if (pathname === "/admin") return "Tổng quan";
  if (pathname.includes("/products/new")) return "Thêm sản phẩm";
  if (pathname.match(/^\/admin\/products\/[^/]+$/)) return "Chi tiết sản phẩm";
  if (pathname.startsWith("/admin/products")) return "Sản phẩm";
  if (pathname.includes("/qr/new")) return "Tạo mã QR";
  if (pathname.match(/^\/admin\/qr\/[^/]+$/)) return "Chi tiết mã QR";
  if (pathname.startsWith("/admin/qr")) return "Mã QR";
  if (pathname.match(/^\/admin\/submissions\/[^/]+$/)) return "Chi tiết yêu cầu";
  if (pathname.startsWith("/admin/submissions")) return "Khách hàng tiềm năng";
  if (pathname.startsWith("/admin/analytics")) return "Phân tích";
  return "Không tìm thấy";
}

function AdminShell({ session, onLogout, children }: { session: AdminSession; onLogout: () => void; children: ReactNode }) {
  const { pathname } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="adminRoot adminShell">
      {menuOpen ? <button type="button" className="adminSidebarBackdrop" aria-label="Đóng menu" onClick={() => setMenuOpen(false)} /> : null}
      <aside className={`adminSidebar ${menuOpen ? "is-open" : ""}`} aria-label="Điều hướng quản trị">
        <Link className="adminBrand" href="/admin">
          <span className="adminBrand__mark"><Leaf size={20} /></span>
          <span><strong>SENOVA</strong><small>Admin workspace</small></span>
        </Link>
        <nav className="adminNav">
          <p className="adminNav__label">Vận hành</p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return <Link href={href} key={href} className={active ? "is-active" : ""} onClick={() => setMenuOpen(false)}><Icon size={18} /><span>{label}</span></Link>;
          })}
        </nav>
        <div className="adminSidebar__footer"><p>Prototype V1</p><span>Dữ liệu sẽ reset khi tải lại</span></div>
      </aside>
      <div className="adminMain">
        <header className="adminTopbar">
          <div className="adminTopbar__left">
            <button className="adminMenuButton" type="button" aria-label="Mở menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
            <div className="adminBreadcrumb">Admin&nbsp;&nbsp;/&nbsp;&nbsp;<strong>{pageLabel(pathname)}</strong></div>
          </div>
          <div className="adminTopbar__actions">
            <button className="adminIconButton" type="button" aria-label="Thông báo"><Bell size={18} /><i /></button>
            <div className="adminProfile">
              <button className="adminProfile__trigger" type="button" aria-expanded={profileOpen} onClick={() => setProfileOpen((value) => !value)}>
                <span className="adminAvatar">QS</span>
                <div><strong>{session.name}</strong><small>{session.role}</small></div>
                <ChevronDown size={15} />
              </button>
              {profileOpen ? (
                <div className="adminProfile__menu">
                  <div><strong>{session.name}</strong><span>{session.email}</span></div>
                  <button type="button" onClick={onLogout}><LogOut size={16} />Đăng xuất</button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <main className="adminContent">{children}</main>
      </div>
      <ToastRegion />
    </div>
  );
}

function DashboardPage() {
  const { products, qrRecords, submissions, analytics } = useAdminStore();
  const scans = qrRecords.reduce((total, record) => total + record.scans, 0);
  const openLeads = submissions.filter((submission) => submission.status !== "closed").length;
  const activeQr = qrRecords.filter((record) => record.status === "active").length;
  const recent = [...submissions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <>
      <PageHeader eyebrow="Trung tâm vận hành" title="Chào buổi tối, Senova" description="Một góc nhìn nhanh về sản phẩm, hành trình QR và những kết nối khách hàng mới nhất." />
      <section className="adminKpiGrid" aria-label="Chỉ số tổng quan">
        <KpiCard label="Tổng lượt quét QR" value={scans.toLocaleString("vi-VN")} delta="+12,6% so với tuần trước" icon={<QrCode size={20} />} />
        <KpiCard label="Yêu cầu đang xử lý" value={String(openLeads)} delta={`${submissions.filter((item) => item.status === "new").length} yêu cầu mới`} icon={<UserCheck size={20} />} tone="gold" />
        <KpiCard label="QR đang hoạt động" value={`${activeQr}/${qrRecords.length}`} delta="Hệ thống vận hành ổn định" icon={<Activity size={20} />} tone="blue" />
        <KpiCard label="Sản phẩm công khai" value={String(products.filter((product) => product.status === "active").length)} delta={`${products.filter((product) => product.status === "draft").length} bản nháp cần hoàn thiện`} icon={<Package size={20} />} tone="pink" />
      </section>
      <div className="adminGrid">
        <section className="adminCard">
          <div className="adminCard__header"><div><h2>Xu hướng 7 ngày</h2><p>Lượt quét QR và yêu cầu khách hàng</p></div><div className="adminLegend"><span><i />Lượt quét</span><span><i />Yêu cầu</span></div></div>
          <div className="adminCard__body"><LineChart data={analytics} /></div>
        </section>
        <section className="adminCard">
          <div className="adminCard__header"><div><h2>Hoạt động gần đây</h2><p>Cập nhật mới trong hệ thống</p></div><Clock3 size={18} color="#7b8881" /></div>
          <div className="adminCard__body">
            <ul className="adminActivityList">
              {recent.map((item) => <li key={item.id}><span className="adminActivityList__icon"><FileText size={15} /></span><div><strong>{kindLabels[item.kind]} từ {item.customer.name}</strong><p>{item.reference} · {formatDate(item.createdAt, true)}</p></div></li>)}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

function ProductsPage() {
  const { products } = useAdminStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => filterProducts(products, query, status as "all" | ProductStatus), [products, query, status]);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <PageHeader eyebrow="Danh mục" title="Sản phẩm" description="Quản lý nội dung hiển thị, trạng thái phát hành và các biến thể của Senova." action={<Link className="adminButton adminButton--primary" href="/admin/products/new"><Plus size={16} />Thêm sản phẩm</Link>} />
      <section className="adminCard">
        <div className="adminToolbar">
          <label className="adminSearch"><Search size={16} /><input aria-label="Tìm sản phẩm" placeholder="Tìm theo tên, slug hoặc dòng..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label>
          <select className="adminSelect" aria-label="Lọc trạng thái" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">Tất cả trạng thái</option><option value="active">Đang hoạt động</option><option value="draft">Bản nháp</option><option value="archived">Đã lưu trữ</option></select>
        </div>
        {visible.length ? <div className="adminTableWrap"><table className="adminTable"><thead><tr><th>Sản phẩm</th><th>Dòng / Vai trò</th><th>Giá hiển thị</th><th>Trạng thái</th><th>Cập nhật</th><th><span className="sr-only">Thao tác</span></th></tr></thead><tbody>{visible.map((product) => <tr key={product.id}><td><div className="adminTable__primary"><img src={product.image} alt="" /><div><Link href={`/admin/products/${product.id}`} className="adminTable__link">{product.name}</Link><small>/{product.slug} · {product.variants.length} biến thể</small></div></div></td><td>{product.line} / {product.role}</td><td>{product.priceLabel}</td><td><StatusBadge status={product.status} /></td><td>{formatDate(product.updatedAt)}</td><td><div className="adminRowActions"><Link href={`/admin/products/${product.id}`} aria-label={`Sửa ${product.name}`}><Edit3 size={15} /></Link></div></td></tr>)}</tbody></table></div> : <EmptyState title="Không tìm thấy sản phẩm" description="Hãy thay đổi từ khóa hoặc bộ lọc để xem kết quả khác." />}
        <Pagination page={page} pageCount={pageCount} total={filtered.length} onPage={setPage} />
      </section>
    </>
  );
}

function ProductFormPage({ id }: { id?: string }) {
  const { products, saveProduct, setProductStatus, notify } = useAdminStore();
  const { navigate } = useRouter();
  const existing = id ? products.find((product) => product.id === id) : undefined;
  const empty: AdminProduct = { id: "", name: "", slug: "", line: "", role: "", tagline: "", shortDescription: "", image: "/assets/products/petal-pack-optimized.jpg", priceLabel: "", availability: "", status: "draft", variants: [], updatedAt: new Date().toISOString() };
  const [form, setForm] = useState<AdminProduct>(existing ?? empty);
  const [errors, setErrors] = useState<ProductValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<ProductStatus | null>(null);
  const isNew = !existing;

  if (id && !existing) return <NotFoundPage />;

  const update = (field: keyof AdminProduct, value: AdminProduct[keyof AdminProduct]) => setForm((current) => ({ ...current, [field]: value }));
  const validate = () => {
    const next = validateProduct(form, products, existing?.id);
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) { notify("Vui lòng kiểm tra các trường bắt buộc.", "error"); return; }
    setSaving(true);
    const product = { ...form, id: existing?.id ?? form.slug, updatedAt: new Date().toISOString() };
    await saveProduct(product);
    notify(isNew ? "Đã tạo sản phẩm mới." : "Đã lưu thay đổi sản phẩm.");
    setSaving(false);
    navigate(`/admin/products/${product.id}`);
  };
  const changeStatus = async () => {
    if (!confirm || !existing) return;
    await setProductStatus(existing.id, confirm);
    setForm((current) => ({ ...current, status: confirm }));
    notify(`Đã cập nhật trạng thái ${existing.name}.`);
    setConfirm(null);
  };
  const addVariant = () => update("variants", [...form.variants, { id: `variant-${Date.now()}`, label: "", note: "" }]);
  const updateVariant = (index: number, field: keyof ProductVariant, value: string) => update("variants", form.variants.map((variant, variantIndex) => variantIndex === index ? { ...variant, [field]: value } : variant));
  const removeVariant = (index: number) => update("variants", form.variants.filter((_, variantIndex) => variantIndex !== index));

  return (
    <>
      <PageHeader eyebrow={isNew ? "Danh mục / Tạo mới" : "Danh mục / Chỉnh sửa"} title={isNew ? "Thêm sản phẩm" : form.name} description={isNew ? "Tạo bản nháp sản phẩm mới cho danh mục Senova." : `Cập nhật nội dung và trạng thái cho /${form.slug}.`} action={!isNew ? <Link className="adminButton adminButton--ghost" href={`/products/${form.slug}`} target="_blank"><Eye size={16} />Xem trang công khai</Link> : undefined} />
      <form className="adminGrid" onSubmit={submit} noValidate>
        <section className="adminCard">
          <div className="adminCard__header"><div><h2>Thông tin sản phẩm</h2><p>Các trường chính hiển thị trên website</p></div></div>
          <div className="adminCard__body">
            <div className="adminFormGrid">
              <div className="adminField"><label htmlFor="product-name">Tên sản phẩm <span>*</span></label><input id="product-name" className={errors.name ? "is-error" : ""} value={form.name} onChange={(event) => update("name", event.target.value)} />{errors.name ? <small className="adminField__error">{errors.name}</small> : null}</div>
              <div className="adminField"><label htmlFor="product-slug">Slug <span>*</span></label><input id="product-slug" className={errors.slug ? "is-error" : ""} value={form.slug} onChange={(event) => update("slug", event.target.value.toLowerCase().replace(/\s+/g, "-"))} />{errors.slug ? <small className="adminField__error">{errors.slug}</small> : null}</div>
              <div className="adminField"><label htmlFor="product-line">Dòng sản phẩm</label><input id="product-line" value={form.line} onChange={(event) => update("line", event.target.value)} /></div>
              <div className="adminField"><label htmlFor="product-role">Vai trò</label><input id="product-role" value={form.role} onChange={(event) => update("role", event.target.value)} /></div>
              <div className="adminField adminField--full"><label htmlFor="product-tagline">Tagline <span>*</span></label><input id="product-tagline" className={errors.tagline ? "is-error" : ""} value={form.tagline} onChange={(event) => update("tagline", event.target.value)} />{errors.tagline ? <small className="adminField__error">{errors.tagline}</small> : null}</div>
              <div className="adminField adminField--full"><label htmlFor="product-description">Mô tả ngắn <span>*</span></label><textarea id="product-description" className={errors.shortDescription ? "is-error" : ""} value={form.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} />{errors.shortDescription ? <small className="adminField__error">{errors.shortDescription}</small> : null}</div>
              <div className="adminField"><label htmlFor="product-price">Giá hiển thị</label><input id="product-price" value={form.priceLabel} onChange={(event) => update("priceLabel", event.target.value)} /></div>
              <div className="adminField"><label htmlFor="product-image">Đường dẫn ảnh</label><input id="product-image" value={form.image} onChange={(event) => update("image", event.target.value)} /></div>
              <div className="adminField adminField--full"><label htmlFor="product-availability">Thông tin khả dụng</label><input id="product-availability" value={form.availability} onChange={(event) => update("availability", event.target.value)} /></div>
            </div>
            <div className="adminSectionTitle"><h3>Biến thể sản phẩm</h3><button type="button" className="adminButton adminButton--secondary" onClick={addVariant}><Plus size={14} />Thêm biến thể</button></div>
            {form.variants.map((variant, index) => <div className="adminVariant" key={variant.id}><input aria-label={`Tên biến thể ${index + 1}`} value={variant.label} placeholder="Tên biến thể" onChange={(event) => updateVariant(index, "label", event.target.value)} /><input aria-label={`Ghi chú biến thể ${index + 1}`} value={variant.note} placeholder="Ghi chú" onChange={(event) => updateVariant(index, "note", event.target.value)} /><button type="button" aria-label="Xóa biến thể" onClick={() => removeVariant(index)}><Trash2 size={15} /></button></div>)}
            {!form.variants.length ? <EmptyState title="Chưa có biến thể" description="Thêm biến thể nếu sản phẩm có nhiều quy cách." /> : null}
            <div className="adminFormActions"><Link href="/admin/products" className="adminButton adminButton--ghost">Hủy</Link><button className="adminButton adminButton--primary" type="submit" disabled={saving}><Save size={15} />{saving ? "Đang lưu..." : "Lưu sản phẩm"}</button></div>
          </div>
        </section>
        <aside className="adminFormAside">
          <section className="adminCard"><div className="adminCard__header"><h2>Xuất bản</h2>{!isNew ? <StatusBadge status={form.status} /> : null}</div><div className="adminCard__body"><img className="adminPreviewImage" src={form.image} alt="Xem trước sản phẩm" /><ul className="adminMetaList"><li><span>Trạng thái</span><strong>{isNew ? "Bản nháp" : <StatusBadge status={form.status} />}</strong></li><li><span>Cập nhật</span><strong>{formatDate(form.updatedAt, true)}</strong></li><li><span>Biến thể</span><strong>{form.variants.length}</strong></li></ul>{!isNew ? <div className="adminFormActions">{form.status !== "active" ? <button type="button" className="adminButton adminButton--secondary" onClick={() => setConfirm("active")}>Kích hoạt</button> : <button type="button" className="adminButton adminButton--ghost" onClick={() => setConfirm("draft")}>Chuyển về nháp</button>}{form.status !== "archived" ? <button type="button" className="adminButton adminButton--danger" onClick={() => setConfirm("archived")}>Lưu trữ</button> : null}</div> : null}</div></section>
        </aside>
      </form>
      <ConfirmDialog open={Boolean(confirm)} title="Thay đổi trạng thái sản phẩm?" description="Thao tác này chỉ thay đổi dữ liệu trong phiên prototype hiện tại." confirmLabel="Cập nhật" danger={confirm === "archived"} onCancel={() => setConfirm(null)} onConfirm={changeStatus} />
    </>
  );
}

function QrPage() {
  const { qrRecords, products } = useAdminStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => qrRecords.filter((record) => `${record.code} ${record.productSlug} ${record.campaign}`.toLowerCase().includes(query.toLowerCase()) && (status === "all" || record.status === status)), [qrRecords, query, status]);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const productName = (slug: string) => products.find((product) => product.slug === slug)?.name ?? slug;

  return <><PageHeader eyebrow="Trải nghiệm số" title="Mã QR" description="Theo dõi mã phát hành, lô sản phẩm, phiên bản nội dung và lượt quét." action={<Link className="adminButton adminButton--primary" href="/admin/qr/new"><Plus size={16} />Tạo mã QR</Link>} /><section className="adminCard"><div className="adminToolbar"><label className="adminSearch"><Search size={16} /><input aria-label="Tìm mã QR" placeholder="Tìm mã, sản phẩm hoặc chiến dịch..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label><select className="adminSelect" aria-label="Lọc trạng thái QR" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">Tất cả trạng thái</option><option value="active">Đang hoạt động</option><option value="paused">Tạm dừng</option><option value="expired">Hết hạn</option><option value="revoked">Đã thu hồi</option></select></div>{visible.length ? <div className="adminTableWrap"><table className="adminTable"><thead><tr><th>Xem trước</th><th>Mã QR</th><th>Sản phẩm / Lô</th><th>Chiến dịch</th><th>Lượt quét</th><th>Trạng thái</th><th><span className="sr-only">Thao tác</span></th></tr></thead><tbody>{visible.map((record) => <tr key={record.id}><td><AdminQrCode code={record.code} compact size={58} /></td><td><Link className="adminTable__link" href={`/admin/qr/${record.id}`}>{record.code}</Link><br /><small>{record.contentVersion} · {record.locale.toUpperCase()}</small></td><td><strong>{productName(record.productSlug)}</strong><br /><small>{record.batchCode}</small></td><td>{record.campaign}</td><td>{record.scans.toLocaleString("vi-VN")}</td><td><StatusBadge status={record.status} /></td><td><div className="adminRowActions"><Link href={`/admin/qr/${record.id}`} aria-label={`Xem ${record.code}`}><Eye size={15} /></Link></div></td></tr>)}</tbody></table></div> : <EmptyState title="Không tìm thấy mã QR" description="Thử thay đổi từ khóa hoặc bộ lọc trạng thái." />}<Pagination page={page} pageCount={Math.ceil(filtered.length / PAGE_SIZE)} total={filtered.length} onPage={setPage} /></section></>;
}

function QrFormPage({ id }: { id?: string }) {
  const { qrRecords, products, saveQrRecord, setQrStatus, notify } = useAdminStore();
  const { navigate } = useRouter();
  const existing = id ? qrRecords.find((record) => record.id === id) : undefined;
  const defaultProduct = products[0]?.slug ?? "";
  const [form, setForm] = useState<QrRecord>(existing ?? { id: "", code: "", productSlug: defaultProduct, batchCode: "", contentVersion: "v1", destination: `/experience/${defaultProduct}`, campaign: "", locale: "vi", status: "paused", scans: 0, createdAt: new Date().toISOString() });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<QrStatus | null>(null);
  if (id && !existing) return <NotFoundPage />;
  const update = (field: keyof QrRecord, value: QrRecord[keyof QrRecord]) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!/^[A-Z0-9-]{4,32}$/.test(form.code)) next.code = "Dùng 4–32 ký tự in hoa, số hoặc dấu gạch ngang.";
    if (qrRecords.some((record) => record.code === form.code && record.id !== existing?.id)) next.code = "Mã QR này đã tồn tại.";
    if (!form.batchCode.trim()) next.batchCode = "Vui lòng nhập mã lô.";
    if (!form.campaign.trim()) next.campaign = "Vui lòng nhập chiến dịch.";
    setErrors(next);
    if (Object.keys(next).length) { notify("Vui lòng kiểm tra thông tin mã QR.", "error"); return; }
    setSaving(true);
    const record = { ...form, id: existing?.id ?? `qr-${Date.now()}`, destination: `/experience/${form.productSlug}` };
    await saveQrRecord(record);
    notify(existing ? "Đã lưu thông tin mã QR." : "Đã tạo mã QR mới.");
    setSaving(false);
    navigate(`/admin/qr/${record.id}`);
  };
  const changeStatus = async () => { if (!confirm || !existing) return; await setQrStatus(existing.id, confirm); setForm((current) => ({ ...current, status: confirm })); notify(`Đã chuyển ${existing.code} sang trạng thái mới.`); setConfirm(null); };

  return <><PageHeader eyebrow={existing ? "QR / Chi tiết" : "QR / Tạo mới"} title={existing ? form.code : "Tạo mã QR"} description="Mã chỉ được kích hoạt khi sản phẩm và phiên bản nội dung đã sẵn sàng." /><form className="adminGrid" onSubmit={submit} noValidate><section className="adminCard"><div className="adminCard__header"><div><h2>Thông tin phát hành</h2><p>Ánh xạ mã đến sản phẩm và nội dung trải nghiệm</p></div></div><div className="adminCard__body"><div className="adminFormGrid"><div className="adminField"><label htmlFor="qr-code">Mã QR <span>*</span></label><input id="qr-code" value={form.code} className={errors.code ? "is-error" : ""} onChange={(event) => update("code", event.target.value.toUpperCase().replace(/\s+/g, "-"))} />{errors.code ? <small className="adminField__error">{errors.code}</small> : null}</div><div className="adminField"><label htmlFor="qr-product">Sản phẩm <span>*</span></label><select id="qr-product" value={form.productSlug} onChange={(event) => { update("productSlug", event.target.value); update("destination", `/experience/${event.target.value}`); }}>{products.map((product) => <option key={product.id} value={product.slug}>{product.name}</option>)}</select></div><div className="adminField"><label htmlFor="qr-batch">Mã lô <span>*</span></label><input id="qr-batch" value={form.batchCode} className={errors.batchCode ? "is-error" : ""} onChange={(event) => update("batchCode", event.target.value.toUpperCase())} />{errors.batchCode ? <small className="adminField__error">{errors.batchCode}</small> : null}</div><div className="adminField"><label htmlFor="qr-version">Phiên bản nội dung</label><input id="qr-version" value={form.contentVersion} onChange={(event) => update("contentVersion", event.target.value)} /></div><div className="adminField"><label htmlFor="qr-campaign">Chiến dịch <span>*</span></label><input id="qr-campaign" value={form.campaign} className={errors.campaign ? "is-error" : ""} onChange={(event) => update("campaign", event.target.value)} />{errors.campaign ? <small className="adminField__error">{errors.campaign}</small> : null}</div><div className="adminField"><label htmlFor="qr-locale">Ngôn ngữ</label><select id="qr-locale" value={form.locale} onChange={(event) => update("locale", event.target.value as "vi" | "en")}><option value="vi">Tiếng Việt</option><option value="en">English</option></select></div><div className="adminField"><label htmlFor="qr-expiry">Ngày hết hạn</label><input id="qr-expiry" type="date" value={form.expiresAt ?? ""} onChange={(event) => update("expiresAt", event.target.value)} /></div><div className="adminField"><label htmlFor="qr-destination">Destination</label><input id="qr-destination" value={`/experience/${form.productSlug}`} readOnly /><small>Tự động suy ra từ sản phẩm.</small></div></div><div className="adminFormActions"><Link href="/admin/qr" className="adminButton adminButton--ghost">Hủy</Link><button className="adminButton adminButton--primary" type="submit" disabled={saving}><Save size={15} />{saving ? "Đang lưu..." : "Lưu mã QR"}</button></div></div></section><aside className="adminFormAside"><section className="adminCard"><div className="adminCard__header"><div><h2>Bản xem trước</h2><p>Cập nhật theo mã đang nhập</p></div></div><div className="adminCard__body"><AdminQrCode code={form.code} downloadable /></div></section><section className="adminCard"><div className="adminCard__header"><h2>Trạng thái</h2><StatusBadge status={form.status} /></div><div className="adminCard__body"><ul className="adminMetaList"><li><span>Lượt quét</span><strong>{form.scans.toLocaleString("vi-VN")}</strong></li><li><span>Ngày tạo</span><strong>{formatDate(form.createdAt)}</strong></li><li><span>Đích nội dung</span><strong>{form.destination}</strong></li></ul>{existing ? <div className="adminFormActions"><button type="button" className="adminButton adminButton--secondary" onClick={() => setConfirm(form.status === "active" ? "paused" : "active")}>{form.status === "active" ? "Tạm dừng" : "Kích hoạt"}</button>{form.status !== "revoked" ? <button type="button" className="adminButton adminButton--danger" onClick={() => setConfirm("revoked")}>Thu hồi</button> : null}</div> : <p style={{ color: "var(--admin-muted)", fontSize: 10, lineHeight: 1.6 }}>Mã mới được tạo ở trạng thái tạm dừng để kiểm tra trước khi kích hoạt.</p>}</div></section></aside></form><ConfirmDialog open={Boolean(confirm)} title="Xác nhận thay đổi trạng thái QR" description={confirm === "revoked" ? "Mã đã thu hồi không nên được kích hoạt lại trong quy trình production." : "Trải nghiệm của người quét sẽ thay đổi ngay trong dữ liệu prototype."} confirmLabel={confirm === "revoked" ? "Thu hồi mã" : "Cập nhật"} danger={confirm === "revoked"} onCancel={() => setConfirm(null)} onConfirm={changeStatus} /></>;
}

function SubmissionsPage() {
  const { submissions } = useAdminStore();
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("all"); const [kind, setKind] = useState("all"); const [page, setPage] = useState(1);
  const filtered = useMemo(() => submissions.filter((item) => `${item.reference} ${item.customer.name} ${item.customer.email}`.toLowerCase().includes(query.toLowerCase()) && (status === "all" || item.status === status) && (kind === "all" || item.kind === kind)), [submissions, query, status, kind]);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return <><PageHeader eyebrow="Quan hệ khách hàng" title="Khách hàng tiềm năng" description="Tiếp nhận, phân công và theo dõi phản hồi, đặt trước và đề nghị hợp tác." /><section className="adminCard"><div className="adminToolbar"><label className="adminSearch"><Search size={16} /><input aria-label="Tìm yêu cầu" placeholder="Tìm tên, email hoặc mã tham chiếu..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label><select className="adminSelect" aria-label="Lọc loại yêu cầu" value={kind} onChange={(event) => { setKind(event.target.value); setPage(1); }}><option value="all">Tất cả loại</option>{Object.entries(kindLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select className="adminSelect" aria-label="Lọc trạng thái yêu cầu" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">Tất cả trạng thái</option><option value="new">Mới</option><option value="contacted">Đã liên hệ</option><option value="qualified">Tiềm năng</option><option value="closed">Hoàn tất</option></select></div>{visible.length ? <div className="adminTableWrap"><table className="adminTable"><thead><tr><th>Khách hàng</th><th>Loại / Mã</th><th>Sản phẩm</th><th>Phụ trách</th><th>Trạng thái</th><th>Thời gian</th><th><span className="sr-only">Thao tác</span></th></tr></thead><tbody>{visible.map((item) => <tr key={item.id}><td><div className="adminTable__primary"><span className="adminAvatar">{item.customer.name.split(" ").slice(-2).map((word) => word[0]).join("")}</span><div><Link className="adminTable__link" href={`/admin/submissions/${item.id}`}>{item.customer.name}</Link><small>{item.customer.email}</small></div></div></td><td>{kindLabels[item.kind]}<br /><small>{item.reference}</small></td><td>{item.productSlug ?? "—"}</td><td>{item.assignee}</td><td><StatusBadge status={item.status} /></td><td>{formatDate(item.createdAt, true)}</td><td><div className="adminRowActions"><Link href={`/admin/submissions/${item.id}`} aria-label={`Xem ${item.reference}`}><Eye size={15} /></Link></div></td></tr>)}</tbody></table></div> : <EmptyState title="Không có yêu cầu phù hợp" description="Thay đổi từ khóa hoặc bộ lọc để xem lại dữ liệu." />}<Pagination page={page} pageCount={Math.ceil(filtered.length / PAGE_SIZE)} total={filtered.length} onPage={setPage} /></section></>;
}

function SubmissionDetailPage({ id }: { id: string }) {
  const { submissions, updateSubmission, addSubmissionActivity, notify } = useAdminStore();
  const submission = submissions.find((item) => item.id === id);
  const [status, setStatus] = useState<SubmissionStatus>(submission?.status ?? "new");
  const [assignee, setAssignee] = useState(submission?.assignee ?? assignees[0]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  if (!submission) return <NotFoundPage />;
  const save = async () => { setSaving(true); await updateSubmission(submission.id, status, assignee); notify("Đã cập nhật yêu cầu khách hàng."); setSaving(false); };
  const addNote = async (event: FormEvent) => { event.preventDefault(); if (!note.trim()) { notify("Vui lòng nhập nội dung ghi chú.", "error"); return; } await addSubmissionActivity(submission.id, note.trim(), "Quản trị Senova"); setNote(""); notify("Đã thêm ghi chú hoạt động."); };
  return <><PageHeader eyebrow={`Yêu cầu / ${submission.reference}`} title={submission.customer.name} description={`${kindLabels[submission.kind]} nhận từ ${submission.source} vào ${formatDate(submission.createdAt, true)}.`} action={<Link className="adminButton adminButton--ghost" href="/admin/submissions">Quay lại danh sách</Link>} /><div className="adminGrid"><div><section className="adminCard"><div className="adminCard__header"><div><h2>Thông tin khách hàng</h2><p>Dữ liệu khách gửi chỉ được đọc</p></div><StatusBadge status={submission.status} /></div><div className="adminCard__body"><div className="adminInfoGrid"><div className="adminInfoItem"><span>Họ và tên</span><strong>{submission.customer.name}</strong></div><div className="adminInfoItem"><span>Email</span><strong>{submission.customer.email}</strong></div><div className="adminInfoItem"><span>Số điện thoại</span><strong>{submission.customer.phone ?? "Không cung cấp"}</strong></div><div className="adminInfoItem"><span>Sản phẩm quan tâm</span><strong>{submission.productSlug ?? "Chưa xác định"}</strong></div></div><div className="adminSectionTitle"><h3>Nội dung gửi</h3></div><div className="adminMessage">“{submission.message}”</div></div></section><section className="adminCard"><div className="adminCard__header"><div><h2>Lịch sử hoạt động</h2><p>Ghi chú nội bộ của đội vận hành</p></div></div><div className="adminCard__body"><form onSubmit={addNote}><div className="adminField"><label htmlFor="activity-note">Thêm ghi chú</label><textarea id="activity-note" value={note} placeholder="Ghi lại cuộc gọi, email hoặc bước tiếp theo..." onChange={(event) => setNote(event.target.value)} /></div><div className="adminFormActions"><button className="adminButton adminButton--secondary" type="submit"><MessageSquarePlus size={15} />Thêm hoạt động</button></div></form><div className="adminSectionTitle"><h3>{submission.activities.length} hoạt động</h3></div>{submission.activities.length ? <ul className="adminTimeline">{submission.activities.map((activity) => <li key={activity.id}><strong>{activity.author}</strong><p>{activity.content}</p><time>{formatDate(activity.createdAt, true)}</time></li>)}</ul> : <EmptyState title="Chưa có hoạt động" description="Thêm ghi chú đầu tiên để theo dõi tiến trình." />}</div></section></div><aside className="adminFormAside"><section className="adminCard"><div className="adminCard__header"><h2>Xử lý yêu cầu</h2></div><div className="adminCard__body"><div className="adminField"><label htmlFor="submission-status">Trạng thái</label><select id="submission-status" value={status} onChange={(event) => setStatus(event.target.value as SubmissionStatus)}><option value="new">Mới</option><option value="contacted">Đã liên hệ</option><option value="qualified">Tiềm năng</option><option value="closed">Hoàn tất</option></select></div><div className="adminField" style={{ marginTop: 14 }}><label htmlFor="submission-assignee">Người phụ trách</label><select id="submission-assignee" value={assignee} onChange={(event) => setAssignee(event.target.value)}>{assignees.map((name) => <option key={name}>{name}</option>)}</select></div><div className="adminFormActions"><button type="button" className="adminButton adminButton--primary" onClick={save} disabled={saving}><Save size={15} />{saving ? "Đang lưu..." : "Cập nhật"}</button></div></div></section><section className="adminCard"><div className="adminCard__header"><h2>Metadata</h2></div><div className="adminCard__body"><ul className="adminMetaList"><li><span>Mã tham chiếu</span><strong>{submission.reference}</strong></li><li><span>Nguồn</span><strong>{submission.source}</strong></li><li><span>Loại</span><strong>{kindLabels[submission.kind]}</strong></li><li><span>Tiếp nhận</span><strong>{formatDate(submission.createdAt, true)}</strong></li></ul></div></section></aside></div></>;
}

function AnalyticsPage() {
  const { analytics, qrRecords, submissions, products } = useAdminStore();
  const [period, setPeriod] = useState("7"); const [product, setProduct] = useState("all"); const [source, setSource] = useState("all");
  const totalScans = qrRecords.filter((record) => product === "all" || record.productSlug === product).reduce((total, record) => total + record.scans, 0);
  const selectedSubmissions = submissions.filter((item) => (product === "all" || item.productSlug === product) && (source === "all" || item.source === source));
  const conversion = totalScans ? (selectedSubmissions.length / totalScans) * 100 : 0;
  const breakdown = products.map((item) => ({ label: item.name.replace("Senova ", ""), value: qrRecords.filter((record) => record.productSlug === item.slug).reduce((total, record) => total + record.scans, 0) }));
  const maxBreakdown = Math.max(...breakdown.map((item) => item.value), 1);
  return <><PageHeader eyebrow="Dữ liệu vận hành" title="Phân tích" description="Hiểu hiệu quả của các điểm chạm QR và nhu cầu khách hàng qua dữ liệu mẫu." /><div className="adminAnalyticsControls"><select className="adminSelect" aria-label="Khoảng thời gian" value={period} onChange={(event) => setPeriod(event.target.value)}><option value="7">7 ngày gần nhất</option><option value="30">30 ngày gần nhất</option><option value="90">90 ngày gần nhất</option></select><select className="adminSelect" aria-label="Lọc sản phẩm" value={product} onChange={(event) => setProduct(event.target.value)}><option value="all">Tất cả sản phẩm</option>{products.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select><select className="adminSelect" aria-label="Lọc nguồn" value={source} onChange={(event) => setSource(event.target.value)}><option value="all">Tất cả nguồn</option><option value="QR">QR</option><option value="Website">Website</option><option value="Landing page">Landing page</option><option value="Đối tác">Đối tác</option></select></div><section className="adminKpiGrid"><KpiCard label="Lượt quét trong kỳ" value={totalScans.toLocaleString("vi-VN")} delta={`Bộ lọc ${period} ngày`} icon={<QrCode size={20} />} /><KpiCard label="Yêu cầu ghi nhận" value={String(selectedSubmissions.length)} delta="Từ các nguồn đã chọn" icon={<ClipboardList size={20} />} tone="gold" /><KpiCard label="Tỷ lệ chuyển đổi" value={`${conversion.toFixed(2)}%`} delta="Yêu cầu / lượt quét" icon={<TrendingUp size={20} />} tone="blue" /><KpiCard label="Sản phẩm theo dõi" value={String(product === "all" ? products.length : 1)} delta="Có dữ liệu QR" icon={<Boxes size={20} />} tone="pink" /></section><div className="adminGrid"><section className="adminCard"><div className="adminCard__header"><div><h2>Xu hướng lượt quét</h2><p>Dữ liệu mẫu theo ngày</p></div><Sparkles size={17} color="#a87b28" /></div><div className="adminCard__body"><LineChart data={analytics} /></div></section><section className="adminCard"><div className="adminCard__header"><div><h2>Lượt quét theo sản phẩm</h2><p>Tổng hợp toàn bộ dữ liệu mẫu</p></div></div><div className="adminCard__body"><div className="adminBreakdown">{breakdown.map((item) => <div className="adminBreakdown__row" key={item.label}><span>{item.label}</span><div className="adminBreakdown__track"><div className="adminBreakdown__bar" style={{ width: `${(item.value / maxBreakdown) * 100}%` }} /></div><strong>{item.value}</strong></div>)}</div></div></section></div><section className="adminCard"><div className="adminCard__header"><div><h2>Yêu cầu khách hàng theo ngày</h2><p>Tín hiệu quan tâm trong 7 ngày gần nhất</p></div></div><div className="adminCard__body"><LineChart data={analytics} mode="submissions" /></div></section></>;
}

function NotFoundPage() {
  return <section className="adminCard"><EmptyState title="Không tìm thấy trang" description="Đường dẫn quản trị này không tồn tại hoặc bản ghi đã bị loại khỏi dữ liệu mẫu." /><div style={{ display: "flex", justifyContent: "center", paddingBottom: 28 }}><Link className="adminButton adminButton--primary" href="/admin">Về tổng quan</Link></div></section>;
}

function AdminRoutes() {
  const { pathname } = useRouter();
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (normalized === "/admin") return <DashboardPage />;
  if (normalized === "/admin/products") return <ProductsPage />;
  if (normalized === "/admin/products/new") return <ProductFormPage />;
  if (normalized.startsWith("/admin/products/")) return <ProductFormPage id={normalized.split("/")[3]} />;
  if (normalized === "/admin/qr") return <QrPage />;
  if (normalized === "/admin/qr/new") return <QrFormPage />;
  if (normalized.startsWith("/admin/qr/")) return <QrFormPage id={normalized.split("/")[3]} />;
  if (normalized === "/admin/submissions") return <SubmissionsPage />;
  if (normalized.startsWith("/admin/submissions/")) return <SubmissionDetailPage id={normalized.split("/")[3]} />;
  if (normalized === "/admin/analytics") return <AnalyticsPage />;
  return <NotFoundPage />;
}

export default function AdminApp() {
  const { pathname, navigate } = useRouter();
  const [session, setSession] = useState<AdminSession | null>(() => readSession());

  useEffect(() => {
    document.title = `${pageLabel(pathname)} | Senova Admin`;
  }, [pathname]);

  useEffect(() => {
    const redirect = getAdminRedirect(session, pathname);
    if (redirect) navigate(redirect);
  }, [navigate, pathname, session]);

  if (!session) return <AdminLogin onLogin={setSession} />;

  const logout = () => {
    window.sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    navigate("/admin/login");
  };

  return (
    <AdminStoreProvider>
      <AdminShell session={session} onLogout={logout}><AdminRoutes /></AdminShell>
    </AdminStoreProvider>
  );
}
