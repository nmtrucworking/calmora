import { CheckCircle2, Clock3, FlaskConical } from "lucide-react";
import type { Language } from "@app/providers/LanguageContext";
import { productTrustItems, trustStatusLabel } from "@features/content/trustContent";
import { EditorialSection } from "@shared/components/luxury/EditorialSection";
import { ProductStatement } from "@shared/components/luxury/ProductStatement";

const statusIcon = {
  confirmed: CheckCircle2,
  validating: FlaskConical,
  planned: Clock3,
};

export function ProductProof({ language }: { language: Language }) {
  const heading = language === "vi"
    ? { eyebrow: "Thông tin sản phẩm", title: "Điều đã xác nhận được tách khỏi điều đang hoàn thiện.", text: "Senova công bố trạng thái của từng thông tin để hình ảnh nguyên mẫu và định hướng thiết kế không bị hiểu như cam kết thương mại cuối cùng." }
    : { eyebrow: "Product information", title: "Confirmed facts are separated from work in progress.", text: "Senova states the status of each item so prototype imagery and design direction are not mistaken for final commercial claims." };

  return (
    <EditorialSection className="bg-[var(--page-bg)]">
      <ProductStatement {...heading} />
      <div className="mt-10 grid grid-cols-2 gap-px border border-border bg-border max-[760px]:grid-cols-1">
        {productTrustItems.map((item) => {
          const Icon = statusIcon[item.status];
          return (
            <article key={item.id} className="bg-[var(--surface-paper)] p-6">
              <div className="flex items-center gap-2 text-accent-strong">
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span className="text-[0.72rem] font-[700] uppercase tracking-[0.12em]">{trustStatusLabel[language][item.status]}</span>
              </div>
              <h3 className="mt-5 mb-0 text-[0.88rem] font-[650] text-text-muted">{item.label[language]}</h3>
              <p className="mt-2 mb-0 font-display text-[1.45rem] leading-[1.3] text-text">{item.value[language]}</p>
            </article>
          );
        })}
      </div>
    </EditorialSection>
  );
}
