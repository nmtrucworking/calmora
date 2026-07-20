import { useCallback, useEffect, useState } from "react";

type StoredProgress = { step: number; completed: boolean };

function readProgress(storageKey: string): StoredProgress {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? "null") as StoredProgress | null;
    if (value && Number.isInteger(value.step)) return value;
  } catch {
    // Invalid or blocked storage starts a fresh ritual.
  }
  return { step: -1, completed: false };
}

export function useRitualProgress(storageKey: string, lastStep: number) {
  const [progress, setProgress] = useState(() => readProgress(storageKey));

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // Resume support must never block the ritual.
    }
  }, [progress, storageKey]);

  const goTo = useCallback(
    (step: number) => setProgress({ step: Math.max(-1, Math.min(step, lastStep)), completed: step >= lastStep }),
    [lastStep],
  );
  const next = useCallback(
    () => setProgress((current) => ({
      step: Math.min(current.step + 1, lastStep),
      completed: current.step + 1 >= lastStep,
    })),
    [lastStep],
  );
  const previous = useCallback(
    () => setProgress((current) => ({ step: Math.max(-1, current.step - 1), completed: false })),
    [],
  );
  const restart = useCallback(() => setProgress({ step: -1, completed: false }), []);

  return { ...progress, goTo, next, previous, restart };
}
