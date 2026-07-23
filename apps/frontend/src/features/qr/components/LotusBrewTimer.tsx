import { useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { getLocalizedWaitMilestone } from "./petalPackTimer";
import styles from "./PetalPackExperience.module.css";
import { useLanguage } from "@app/providers/LanguageContext";

type LotusBrewTimerProps = {
  onComplete: () => void;
  seconds?: number;
};

export function LotusBrewTimer({ onComplete, seconds = 180 }: LotusBrewTimerProps) {
  const { language } = useLanguage();
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
  const cue = useMemo(() => getLocalizedWaitMilestone(remaining, language), [language, remaining]);
  const copy = language === "vi"
    ? { timer: "Thời gian chờ trà", remaining: `Còn ${minutes} phút ${remaining % 60} giây`, pause: "Tạm dừng", resume: "Tiếp tục" }
    : { timer: "Tea steeping time", remaining: `${minutes} minutes ${remaining % 60} seconds remaining`, pause: "Pause", resume: "Resume" };

  return (
    <div className={styles.timer} aria-label={copy.timer}>
      <div
        className={styles.lotusTimer}
        role="timer"
        aria-live={remaining === 0 ? "polite" : "off"}
        aria-label={copy.remaining}
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
          aria-label={isRunning ? copy.pause : copy.resume}
        >
          {isRunning ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {isRunning ? copy.pause : copy.resume}
        </button>
      ) : null}
    </div>
  );
}
