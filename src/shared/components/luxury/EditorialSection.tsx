import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { motionViewport, sectionRevealVariants } from "@shared/motion/animationSystem";
import { cx } from "@shared/utils/classNames";

type EditorialSectionProps = {
  children: ReactNode;
  id?: string;
  dark?: boolean;
  className?: string;
  innerClassName?: string;
};

export function EditorialSection({
  children,
  id,
  dark = false,
  className,
  innerClassName,
}: EditorialSectionProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={motionViewport}
      variants={sectionRevealVariants}
      className={cx(
        "relative px-6 py-[clamp(5rem,10vw,9rem)] max-[760px]:px-4 max-[760px]:py-20",
        dark && "bg-[var(--surface-dark)] text-text-inverse",
        className,
      )}
    >
      <div className={cx("mx-auto w-full max-w-[var(--page-max)]", innerClassName)}>{children}</div>
    </motion.section>
  );
}
