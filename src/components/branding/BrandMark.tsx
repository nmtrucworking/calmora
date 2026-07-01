import { cx } from "../../utils/classNames";

type BrandMarkProps = {
  size?: "sm" | "md";
};

export function BrandMark({ size = "md" }: BrandMarkProps) {
  const iconSize = size === "sm" ? "h-[1.15rem] w-[1.15rem]" : "h-[2.4rem] w-[2.4rem]";

  return (
    <span
      className={cx(
        "grid place-items-center rounded-xl bg-[#fffaf00a] backdrop-blur-[18px]",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
      )}
      aria-hidden="false"
    >
      <img
        src="/assets/brand/calmora-mark.png"
        alt="Calmora Mark"
        className={cx("object-contain", iconSize)}
        decoding="async"
        fetchPriority="high"
        width="256"
        height="190"
      />
    </span>
  );
}
