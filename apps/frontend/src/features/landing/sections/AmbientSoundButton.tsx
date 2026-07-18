import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@app/providers/LanguageContext";
import { luxuryMotion } from "@shared/styles/luxuryEffects";
import { cx } from "@shared/utils/classNames";

const BACKGROUND_MUSIC_SRC = "/media/reflections_in_iea.mp3";
const BACKGROUND_MUSIC_VOLUME = 0.28;

type AmbientSoundButtonProps = {
  className?: string;
  compact?: boolean;
};

export function AmbientSoundButton({ className, compact = false }: AmbientSoundButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { language } = useLanguage();
  const copy = {
    vi: {
      on: "Đang phát",
      off: "Âm thanh",
      turnOn: "Bật nhạc nền",
      turnOff: "Tắt nhạc nền",
    },
    en: {
      on: "Playing",
      off: "Sound",
      turnOn: "Turn background music on",
      turnOff: "Turn background music off",
    },
  }[language];

  const stop = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const start = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = BACKGROUND_MUSIC_VOLUME;

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      // Browsers may reject playback when the click no longer counts as a user gesture.
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      audio?.pause();
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src={BACKGROUND_MUSIC_SRC} loop preload="metadata" />
      <button
        type="button"
        className={cx(
          compact
            ? "inline-flex h-9 w-9 cursor-pointer items-center justify-center border text-inherit [backdrop-filter:blur(18px)] [&_svg]:h-4 [&_svg]:w-4"
            : "inline-flex cursor-pointer items-center gap-[0.55rem] rounded-full border border-border bg-surface-strong px-[0.9rem] py-[0.52rem] text-[0.82rem] font-[700] text-text [backdrop-filter:blur(18px)] hover:border-border-strong hover:bg-surface hover:text-primary aria-pressed:border-primary aria-pressed:text-primary max-[767px]:p-[0.48rem] max-[767px]:[&_span]:hidden",
          luxuryMotion.button,
          className,
        )}
        onClick={() => {
          if (isPlaying) {
            stop();
          } else {
            void start();
          }
        }}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? copy.turnOff : copy.turnOn}
        title={isPlaying ? copy.turnOff : copy.turnOn}
      >
        {isPlaying ? <Volume2 className="h-4 w-4 flex-none" /> : <VolumeX className="h-4 w-4 flex-none" />}
        <span className={compact ? "sr-only" : undefined}>{isPlaying ? copy.on : copy.off}</span>
      </button>
    </>
  );
}
