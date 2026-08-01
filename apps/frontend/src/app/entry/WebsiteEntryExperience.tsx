import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Film, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
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
    watchTvc: "Thưởng thức TVC",
    skipTvc: "Bỏ qua TVC",
    tvcEyebrow: "Thước phim di sản · Senova",
    tvcTitle: "Hương sen đọng giữa thời gian",
    musicNote: "Âm nhạc sẽ tự động phát khi vào trang",
    enableMusic: "Bật nhạc nền",
    disableMusic: "Tắt nhạc nền",
    tvcPlay: "Phát TVC",
    tvcPause: "Tạm dừng TVC",
    tvcMute: "Tắt tiếng TVC",
    tvcUnmute: "Bật tiếng TVC",
  },
  en: {
    eyebrow: "Lotus tea · A quiet pause",
    title: "Slow down, and let tea lead the way.",
    body: "A quiet ritual for the moments that bring you back to yourself.",
    enter: "Enter Senova",
    watchTvc: "Watch TVC Presentation",
    skipTvc: "Skip TVC",
    tvcEyebrow: "Heritage Film · Senova",
    tvcTitle: "Lotus fragrance held in time",
    musicNote: "Background music will begin on entry",
    enableMusic: "Turn on background music",
    disableMusic: "Turn off background music",
    tvcPlay: "Play TVC",
    tvcPause: "Pause TVC",
    tvcMute: "Mute TVC sound",
    tvcUnmute: "Unmute TVC sound",
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const enterButtonRef = useRef<HTMLButtonElement>(null);
  const exitTimerRef = useRef<number | undefined>(undefined);

  const [hasEntered, setHasEntered] = useState(() => suppressAudio);
  const [isLeaving, setIsLeaving] = useState(false);
  const [wantsMusic, setWantsMusic] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Before-access layer mode: "WELCOME" | "TVC"
  const [entryMode, setEntryMode] = useState<"WELCOME" | "TVC">("WELCOME");
  const [isTvcPlaying, setIsTvcPlaying] = useState(false);
  const [isTvcMuted, setIsTvcMuted] = useState(false);
  const [tvcProgress, setTvcProgress] = useState(0);
  const [tvcCurrentTime, setTvcCurrentTime] = useState(0);
  const [tvcDuration, setTvcDuration] = useState(0);

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

  const pauseMusic = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsMusicPlaying(false);
    }
  }, []);

  const enterWebsite = useCallback(() => {
    if (isLeaving) return;

    if (videoRef.current) {
      videoRef.current.pause();
      setIsTvcPlaying(false);
    }

    setIsLeaving(true);
    void playMusic();
    exitTimerRef.current = window.setTimeout(() => setHasEntered(true), EXIT_DURATION_MS);
  }, [isLeaving, playMusic]);

  const startTvcExperience = useCallback(() => {
    pauseMusic();
    setEntryMode("TVC");
    setIsTvcPlaying(true);
    window.setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        void videoRef.current.play().catch(() => setIsTvcPlaying(false));
      }
    }, 100);
  }, [pauseMusic]);

  const toggleTvcPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isTvcPlaying) {
      video.pause();
      setIsTvcPlaying(false);
    } else {
      void video.play().then(() => setIsTvcPlaying(true)).catch(() => setIsTvcPlaying(false));
    }
  }, [isTvcPlaying]);

  const toggleTvcMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsTvcMuted(video.muted);
  }, []);

  const handleTvcTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setTvcCurrentTime(video.currentTime);
    if (video.duration) {
      setTvcDuration(video.duration);
      setTvcProgress((video.currentTime / video.duration) * 100);
    }
  }, []);

  const handleTvcEnded = useCallback(() => {
    enterWebsite();
  }, [enterWebsite]);

  useEffect(() => {
    if (hasEntered) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    enterButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (entryMode === "TVC") {
        if (event.key === "Escape") {
          event.preventDefault();
          enterWebsite();
        } else if (event.key === " ") {
          event.preventDefault();
          toggleTvcPlayback();
        } else if (event.key === "m" || event.key === "M") {
          event.preventDefault();
          toggleTvcMute();
        }
        return;
      }

      if (event.key !== "Tab") return;
      event.preventDefault();
      enterButtonRef.current?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [entryMode, enterWebsite, hasEntered, toggleTvcMute, toggleTvcPlayback]);

  useEffect(() => () => window.clearTimeout(exitTimerRef.current), []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (suppressAudio || entryMode === "TVC") {
      audio.pause();
      return;
    }

    if (hasEntered && wantsMusic) {
      void audio.play().catch(() => undefined);
    }
  }, [entryMode, hasEntered, suppressAudio, wantsMusic]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

          {entryMode === "WELCOME" ? (
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

              <div className={styles.actionGroup}>
                <button
                  type="button"
                  className={styles.tvcButton}
                  onClick={startTvcExperience}
                  disabled={isLeaving}
                >
                  <Film size={16} aria-hidden="true" />
                  <span>{text.watchTvc}</span>
                </button>

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
              </div>

              <p className={styles.musicNote}>
                <span className={styles.equalizer} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                {text.musicNote}
              </p>
            </div>
          ) : (
            <div className={styles.tvcLayer}>
              <header className={styles.tvcHeader}>
                <div className={styles.tvcInfo}>
                  <span className={styles.tvcEyebrow}>{text.tvcEyebrow}</span>
                  <h2 className={styles.tvcTitle}>{text.tvcTitle}</h2>
                </div>
                <button
                  type="button"
                  className={styles.skipButton}
                  onClick={enterWebsite}
                  aria-label={text.skipTvc}
                  title={text.skipTvc}
                >
                  <span>{text.skipTvc}</span>
                  <X size={16} aria-hidden="true" />
                </button>
              </header>

              <div className={styles.tvcViewport} onClick={toggleTvcPlayback}>
                <video
                  ref={videoRef}
                  src="/media/tvc.mp4"
                  className={styles.tvcVideo}
                  playsInline
                  onTimeUpdate={handleTvcTimeUpdate}
                  onEnded={handleTvcEnded}
                  onPlay={() => setIsTvcPlaying(true)}
                  onPause={() => setIsTvcPlaying(false)}
                />

                {!isTvcPlaying ? (
                  <button
                    type="button"
                    className={styles.tvcOverlayPlay}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTvcPlayback();
                    }}
                    aria-label={text.tvcPlay}
                  >
                    <Play size={28} />
                  </button>
                ) : null}
              </div>

              <footer className={styles.tvcFooter}>
                <div className={styles.tvcControls}>
                  <button
                    type="button"
                    className={styles.tvcControlBtn}
                    onClick={toggleTvcPlayback}
                    aria-label={isTvcPlaying ? text.tvcPause : text.tvcPlay}
                  >
                    {isTvcPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  <button
                    type="button"
                    className={styles.tvcControlBtn}
                    onClick={toggleTvcMute}
                    aria-label={isTvcMuted ? text.tvcUnmute : text.tvcMute}
                  >
                    {isTvcMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>

                  <div className={styles.tvcTimeDisplay}>
                    <span>{formatTime(tvcCurrentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(tvcDuration || 0)}</span>
                  </div>
                </div>

                <div className={styles.tvcProgressTrack}>
                  <div
                    className={styles.tvcProgressBar}
                    style={{ width: `${tvcProgress}%` }}
                  />
                </div>
              </footer>
            </div>
          )}
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
