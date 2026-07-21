import type { Language } from "@app/providers/LanguageContext";
import { EditorialSection } from "@shared/components/luxury/EditorialSection";
import { LuxuryButton } from "@shared/components/luxury/LuxuryButton";
import { ProductStatement } from "@shared/components/luxury/ProductStatement";

export function ProjectStatus({ language }: { language: Language }) {
  const content = language === "vi"
    ? { eyebrow: "Trạng thái dự án", title: "Senova đang nhận yêu cầu trải nghiệm và đặt trước.", text: "Sản phẩm, thông số và phạm vi giao được xác nhận theo từng cấu hình. Website chưa mở thanh toán trực tuyến.", action: "Gửi yêu cầu đặt trước" }
    : { eyebrow: "Project status", title: "Senova is accepting experience and preorder requests.", text: "Products, specifications and delivery scope are confirmed per configuration. Online payment is not yet available.", action: "Send a preorder request" };

  return (
    <EditorialSection className="bg-[var(--surface)]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-8 border-l-2 border-accent px-6 max-[720px]:grid-cols-1 max-[720px]:px-5">
        <ProductStatement {...content} />
        <LuxuryButton href="/order-request">{content.action}</LuxuryButton>
      </div>
    </EditorialSection>
  );
}
