import { ArrowRight, Gift, Leaf, PackageSearch } from "lucide-react";
import type { Language } from "@app/providers/LanguageContext";
import { Link } from "@app/router/RouterContext";
import { EditorialSection } from "@shared/components/luxury/EditorialSection";
import { ProductStatement } from "@shared/components/luxury/ProductStatement";

const copy = {
  vi: {
    eyebrow: "Bạn muốn bắt đầu từ đâu?",
    title: "Chọn điều bạn đang tìm kiếm.",
    text: "Ba lối vào ngắn giúp bạn đi thẳng đến thông tin cần thiết.",
    items: [
      { title: "Tìm sản phẩm", text: "Hiểu vai trò của Petal Pack, Classic và Gift Set.", href: "/products", label: "Xem sản phẩm", icon: PackageSearch },
      { title: "Học nghi thức", text: "Xem cách mở, cảm nhận, pha và thưởng thức.", href: "/ritual", label: "Xem nghi thức", icon: Leaf },
      { title: "Chuẩn bị quà", text: "Bắt đầu nhu cầu quà cá nhân hoặc đối tác.", href: "/gifting", label: "Trao đổi về bộ quà", icon: Gift },
    ],
  },
  en: {
    eyebrow: "Where would you like to begin?",
    title: "Choose what you are looking for.",
    text: "Three concise paths take you directly to the information you need.",
    items: [
      { title: "Find a product", text: "Understand the roles of Petal Pack, Classic and Gift Set.", href: "/products", label: "View products", icon: PackageSearch },
      { title: "Learn the ritual", text: "See how to open, notice, brew and taste.", href: "/ritual", label: "View ritual", icon: Leaf },
      { title: "Prepare a gift", text: "Begin a personal or partner gifting request.", href: "/gifting", label: "Discuss gifting", icon: Gift },
    ],
  },
} as const;

export function IntentSelector({ language }: { language: Language }) {
  const content = copy[language];

  return (
    <EditorialSection id="start" className="bg-[var(--surface-strong)]">
      <ProductStatement eyebrow={content.eyebrow} title={content.title} text={content.text} />
      <div className="mt-10 grid grid-cols-3 gap-5 max-[840px]:grid-cols-1">
        {content.items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group grid min-h-[15rem] content-between border border-border bg-[var(--surface-paper)] p-6 text-text no-underline transition-[border-color,transform] duration-[var(--motion-base)] hover:-translate-y-1 hover:border-border-strong motion-reduce:hover:translate-y-0"
            >
              <Icon aria-hidden="true" className="h-6 w-6 text-accent-strong" />
              <div>
                <h3 className="m-0 font-display text-[var(--text-h3)] font-[500] leading-[var(--leading-heading)]">{item.title}</h3>
                <p className="mt-3 mb-5 leading-[var(--leading-body)] text-text-muted">{item.text}</p>
                <span className="inline-flex items-center gap-2 font-[650] text-accent-strong">
                  {item.label}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </EditorialSection>
  );
}
