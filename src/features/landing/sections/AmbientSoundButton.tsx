import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "../SenovaLandingPage.module.css";

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

type AmbientEngine = {
  context: AudioContext;
  intervalId: number;
  master: GainNode;
  oscillators: OscillatorNode[];
};

function createOscillator(context: AudioContext, master: GainNode, frequency: number, type: OscillatorType) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  oscillator.detune.value = -5 + Math.random() * 10;
  gain.gain.value = 0.034;
  filter.type = "lowpass";
  filter.frequency.value = 1180;
  filter.Q.value = 0.7;

  oscillator.connect(gain);
  gain.connect(filter);
  filter.connect(master);
  oscillator.start();

  return oscillator;
}

function playBell(context: AudioContext, master: GainNode, frequency: number) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const now = context.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.006, now + 1.1);
  filter.type = "bandpass";
  filter.frequency.value = frequency * 2.4;
  filter.Q.value = 3.2;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.095, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.55);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  oscillator.start(now);
  oscillator.stop(now + 1.7);
}

export function AmbientSoundButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const engineRef = useRef<AmbientEngine | null>(null);

  const stop = () => {
    const engine = engineRef.current;

    if (!engine) return;

    window.clearInterval(engine.intervalId);
    engine.master.gain.setTargetAtTime(0.0001, engine.context.currentTime, 0.08);

    window.setTimeout(() => {
      engine.oscillators.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch {
          // The oscillator may already be stopped after browser audio suspension.
        }
      });
      void engine.context.close();
    }, 360);

    engineRef.current = null;
    setIsPlaying(false);
  };

  const start = async () => {
    if (engineRef.current) return;

    const AudioContextClass = (window as AudioWindow).AudioContext ?? (window as AudioWindow).webkitAudioContext;

    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const baseNotes = [174.61, 220, 261.63, 329.63];
    const bellNotes = [523.25, 587.33, 659.25, 783.99, 880];
    let noteIndex = 0;

    master.gain.value = 0.0001;
    master.connect(compressor);
    compressor.connect(context.destination);
    await context.resume();

    const oscillators = [
      createOscillator(context, master, baseNotes[0], "sine"),
      createOscillator(context, master, baseNotes[1], "triangle"),
      createOscillator(context, master, baseNotes[2], "sine"),
      createOscillator(context, master, baseNotes[3], "triangle"),
    ];

    master.gain.exponentialRampToValueAtTime(0.24, context.currentTime + 1.2);
    playBell(context, master, bellNotes[0]);

    const intervalId = window.setInterval(() => {
      playBell(context, master, bellNotes[noteIndex % bellNotes.length]);
      noteIndex += 1;
    }, 2300);

    engineRef.current = {
      context,
      intervalId,
      master,
      oscillators,
    };
    setIsPlaying(true);
  };

  useEffect(() => stop, []);

  return (
    <button
      type="button"
      className={styles.soundToggle}
      onClick={() => {
        if (isPlaying) {
          stop();
        } else {
          void start();
        }
      }}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
      title={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
    >
      {isPlaying ? <Volume2 className={styles.soundIcon} /> : <VolumeX className={styles.soundIcon} />}
      <span>{isPlaying ? "Đang phát" : "Âm thanh"}</span>
    </button>
  );
}
