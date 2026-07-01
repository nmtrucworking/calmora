import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { LandingContent } from "../types";
import { Link } from "../../../contexts/RouterContext";

type CTAProps = {
  content: LandingContent["cta"];
};

const eyebrowClass = "m-0 text-[0.8rem] uppercase tracking-[0.24em] text-accent-gold";

export function CTA({ content }: CTAProps) {
  return (
    <section
      id="cta"
      className="relative z-10 flex min-h-[105vh] items-end px-6 py-28 pb-28 max-[767px]:px-4 max-[767px]:pb-[5.5rem]"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="mr-auto ml-[max(1rem,calc((100vw-82rem)/2+1.5rem))] w-[min(25rem,calc(100vw-2rem))] text-left max-[767px]:mr-0 max-[767px]:ml-0"
      >
        <p className={eyebrowClass}>{content.eyebrow}</p>
        <h2 className="mt-4 mb-0 font-display text-[clamp(2.2rem,5vw,3.8rem)] font-[650] leading-[1.04] text-text">
          {content.title}
        </h2>
        <p className="mt-[1.1rem] mb-0 max-w-[23rem] text-base leading-[1.75] text-text-muted">
          {content.description}
        </p>
        <div className="mt-[1.8rem] flex justify-start">
          <Link
            href={content.href}
            className="inline-flex items-center justify-center gap-[0.45rem] whitespace-nowrap rounded-full border border-primary bg-primary px-5 py-[0.82rem] text-[0.92rem] font-[700] text-on-primary no-underline transition-colors duration-150 hover:bg-primary-strong"
          >
            {content.label}
            <ArrowRight className="h-4 w-4 flex-none" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
