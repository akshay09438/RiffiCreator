import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Ticks a number from 0 up to `target`, starting `startMs` after navigation and lasting `durationMs`.
 * The first render is the final value, so the pre-rendered page and no-JS visitors see the real number.
 * It only animates when the page hydrated before the tick was due, so a late hydration on slow 4G
 * never rewinds a number the creator has already read.
 */
export function useCountUp(target: number, startMs: number, durationMs: number): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (reduced || performance.now() >= startMs) return;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - startMs) / durationMs));
      setValue(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, target, startMs, durationMs]);

  return value;
}
