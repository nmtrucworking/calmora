import type { ReactNode } from "react";
import { EditorialSection } from "./EditorialSection";

type DarkSectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  innerClassName?: string;
};

export function DarkSection({ children, id, className, innerClassName }: DarkSectionProps) {
  return (
    <EditorialSection id={id} dark className={className} innerClassName={innerClassName}>
      {children}
    </EditorialSection>
  );
}
