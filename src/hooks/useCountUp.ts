import { type RefObject, useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Ticks a number from 0 up to `target` over `durationMs`, starting `startMs` after its anchor's CSS
 * animation began - the moment the number starts to fade in. When the browser cannot report that
 * animation, the tick starts `startMs` after navigation instead.
 * The first render is the final value, so the pre-rendered page and no-JS visitors see the real number.
 * It only animates when the page hydrated before the tick was due, so a late hydration on slow 4G
 * never rewinds a number the creator has already read.
 */
export function useCountUp(
  target: number,
  startMs: number,
  durationMs: number,
  anchor?: RefObject<Element | null>,
): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (reduced) return;
    // A CSS animation delay counts from when the element was first styled, not from navigation.
    const cssStart = anchor?.current?.getAnimations?.()[0]?.startTime;
    const due = (typeof cssStart === 'number' ? cssStart : 0) + startMs;
    if (performance.now() >= due) return;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - due) / durationMs));
      setValue(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, target, startMs, durationMs, anchor]);

  return value;
}
