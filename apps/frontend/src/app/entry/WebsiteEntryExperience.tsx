import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@app/providers/LanguageContext";
import styles from "./WebsiteEntryExperience.module.css";

type WebsiteEntryExperienceProps = {
  children: ReactNode;
  suppressAudio?: boolean;
};

const copy = {
  vi: {
    eyebrow: "Trà sen · Một khoảng tĩnh tại",
    title: "Chậm lại, để hương trà mở lối.",
    body: "Một nghi thức nhỏ cho những phút giây trở về với chính mình.",
    enter: "Bước vào Senova",
    musicNote: "Âm nhạc sẽ tự động phát",
    enableMusic: "Bật nhạc nền",
    disableMusic: "Tắt nhạc nền",
  },
  en: {
    eyebrow: "Lotus tea · A quiet pause",
    title: "Slow down, and let tea lead the way.",
    body: "A quiet ritual for the moments that bring you back to yourself.",
    enter: "Enter Senova",
    musicNote: "Music will begin automatically",
    enableMusic: "Turn on background music",
    disableMusic: "Turn off background music",
  },
} as const;

const EXIT_DURATION_MS = 1100;
const MUSIC_VOLUME = 0.24;

export function WebsiteEntryExperience({
  children,
  suppressAudio = false,
}: WebsiteEntryExperienceProps) {
  const { language } = useLanguage();
  const text = copy[language];
  const audioRef = useRef<HTMLAudioElement>(null);
  const enterButtonRef = useRef<HTMLButtonElement>(null);
  const exitTimerRef = useRef<number | undefined>(undefined);
  const [hasEntered, setHasEntered] = useState(() => suppressAudio);
  const [isLeaving, setIsLeaving] = useState(false);
  const [wantsMusic, setWantsMusic] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || suppressAudio) return false;

    audio.volume = MUSIC_VOLUME;
    try {
      await audio.play();
      setWantsMusic(true);
      setIsMusicPlaying(true);
      return true;
    } catch {
      setWantsMusic(false);
      setIsMusicPlaying(false);
      return false;
    }
  }, [suppressAudio]);

  useEffect(() => {
    if (hasEntered) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    enterButtonRef.current?.focus();

    const keepFocusOnEntry = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      event.preventDefault();
      enterButtonRef.current?.focus();
    };

    document.addEventListener("keydown", keepFocusOnEntry);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keepFocusOnEntry);
    };
  }, [hasEntered]);

  useEffect(() => () => window.clearTimeout(exitTimerRef.current), []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (suppressAudio) {
      audio.pause();
      return;
    }

    if (hasEntered && wantsMusic) {
      void audio.play().catch(() => undefined);
    }
  }, [hasEntered, suppressAudio, wantsMusic]);

  const enterWebsite = useCallback(() => {
    if (isLeaving) return;

    setIsLeaving(true);
    void playMusic();
    exitTimerRef.current = window.setTimeout(() => setHasEntered(true), EXIT_DURATION_MS);
  }, [isLeaving, playMusic]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicPlaying) {
      audio.pause();
      setWantsMusic(false);
      setIsMusicPlaying(false);
      return;
    }

    void playMusic();
  }, [isMusicPlaying, playMusic]);

  return (
    <>
      {children}
      <audio
        ref={audioRef}
        src="/media/reflections_in_iea.mp3"
        loop
        preload="auto"
        onPause={() => setIsMusicPlaying(false)}
        onPlay={() => setIsMusicPlaying(true)}
      />

      {!hasEntered ? (
        <section
          className={styles.cover}
          data-leaving={isLeaving ? "true" : "false"}
          role="dialog"
          aria-modal="true"
          aria-labelledby="senova-entry-title"
        >
          <div className={styles.ambientGlow} aria-hidden="true" />
          <div className={styles.frame} aria-hidden="true" />
          <div className={styles.content}>
            <div className={styles.brand} aria-label="Senova by Calmora">
              <span className={styles.markShell} aria-hidden="true">
                <img src="/assets/brand/calmora-mark.png" alt="" width="256" height="190" />
              </span>
              <span className={styles.wordmark}>SENOVA</span>
              <span className={styles.byline}>by Calmora</span>
            </div>

            <span className={styles.divider} aria-hidden="true" />
            <p className={styles.eyebrow}>{text.eyebrow}</p>
            <h1 id="senova-entry-title" className={styles.title}>{text.title}</h1>
            <p className={styles.body}>{text.body}</p>

            <button
              ref={enterButtonRef}
              type="button"
              className={styles.enterButton}
              onClick={enterWebsite}
              disabled={isLeaving}
            >
              <span>{text.enter}</span>
              <ArrowRight aria-hidden="true" />
            </button>
            <p className={styles.musicNote}>
              <span className={styles.equalizer} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              {text.musicNote}
            </p>
          </div>
        </section>
      ) : null}

      {hasEntered && !suppressAudio ? (
        <button
          type="button"
          className={styles.musicToggle}
          onClick={toggleMusic}
          aria-label={isMusicPlaying ? text.disableMusic : text.enableMusic}
          title={isMusicPlaying ? text.disableMusic : text.enableMusic}
        >
          {isMusicPlaying ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
        </button>
      ) : null}
    </>
  );
}
