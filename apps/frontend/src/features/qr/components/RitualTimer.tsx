import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { systemStyles as styles } from "@shared/styles/systemPageClasses";

export function RitualTimer({ seconds, onComplete }: { seconds: number; onComplete?: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning, onComplete, remaining]);

  const minutes = Math.floor(remaining / 60);
  const displaySeconds = String(remaining % 60).padStart(2, "0");

  return (
    <div className="mt-6 grid justify-items-center gap-4 rounded-lg border border-border bg-surface-strong p-5 text-center">
      <Clock3 aria-hidden="true" className="h-7 w-7 text-accent-strong" />
      <p className="m-0 font-display text-[clamp(2.4rem,12vw,4.5rem)] tabular-nums text-primary-strong" aria-live="polite">
        {minutes}:{displaySeconds}
      </p>
      <p className="m-0 text-sm leading-relaxed text-text-muted">Timer hỗ trợ nhịp chờ và không khóa bước tiếp theo.</p>
      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" className={styles.secondaryButton} onClick={() => setIsRunning((value) => !value)}>
          {isRunning ? "Tạm dừng" : remaining === seconds ? "Bắt đầu timer" : "Tiếp tục"}
        </button>
        <button type="button" className={styles.iconButton} onClick={() => { setIsRunning(false); setRemaining(seconds); }}>
          Đặt lại
        </button>
      </div>
    </div>
  );
}
