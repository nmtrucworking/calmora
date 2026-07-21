import { useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { getWaitMilestone } from "./petalPackTimer";
import styles from "./PetalPackExperience.module.css";

type LotusBrewTimerProps = {
  onComplete: () => void;
  seconds?: number;
};

export function LotusBrewTimer({ onComplete, seconds = 180 }: LotusBrewTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          onComplete();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning, onComplete, remaining]);

  const minutes = Math.floor(remaining / 60);
  const displaySeconds = String(remaining % 60).padStart(2, "0");
  const elapsedRatio = (seconds - remaining) / seconds;
  const illuminatedPetals = Math.min(4, Math.max(1, Math.ceil(elapsedRatio * 4)));
  const cue = useMemo(() => getWaitMilestone(remaining), [remaining]);

  return (
    <div className={styles.timer} aria-label="Thời gian chờ trà">
      <div
        className={styles.lotusTimer}
        role="timer"
        aria-live={remaining === 0 ? "polite" : "off"}
        aria-label={`Còn ${minutes} phút ${remaining % 60} giây`}
      >
        {[0, 1, 2, 3].map((petal) => (
          <span
            aria-hidden="true"
            className={`${styles.timerPetal} ${petal < illuminatedPetals ? styles.timerPetalActive : ""}`}
            key={petal}
          />
        ))}
        <time className={styles.timerTime} dateTime={`PT${remaining}S`}>
          {minutes}:{displaySeconds}
        </time>
      </div>

      <p className={styles.timerCue}>{cue}</p>
      {remaining > 0 ? (
        <button
          type="button"
          className={styles.timerControl}
          onClick={() => setIsRunning((value) => !value)}
          aria-label={isRunning ? "Tạm dừng thời gian chờ" : "Tiếp tục thời gian chờ"}
        >
          {isRunning ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {isRunning ? "Tạm dừng" : "Tiếp tục"}
        </button>
      ) : null}
    </div>
  );
}
