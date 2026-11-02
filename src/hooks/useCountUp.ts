import { type RefObject, useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Ticks a number from 0 up to `target` over `durationMs`, starting `startMs` after its anchor's CSS
 * animation began - the moment the number starts to fade in. If that animation is still waiting for its
 * first frame, the tick waits for its real start time; if the browser reports no animation at all, the
 * tick starts `startMs` after navigation instead.
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
    let frame = 0;
    let cancelled = false;

    const tickFrom = (origin: number) => {
      const due = origin + startMs;
      if (performance.now() >= due) return;
      const tick = (now: number) => {
        const progress = Math.min(1, Math.max(0, (now - due) / durationMs));
        setValue(Math.round(target * (1 - (1 - progress) ** 3)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    // A CSS animation delay counts from when the element was first styled, not from navigation.
    // Transitions are listed before animations, so pick the CSS animation itself.
    const reveal = anchor?.current?.getAnimations?.().find((animation) => 'animationName' in animation);
    if (!reveal) {
      tickFrom(0);
    } else if (typeof reveal.startTime === 'number') {
      tickFrom(reveal.startTime);
    } else {
      // Still pending: its start time is set on the frame it begins, which cannot be past its delay.
      reveal.ready.then(
        (started) => {
          if (!cancelled && typeof started.startTime === 'number') tickFrom(started.startTime);
        },
        () => undefined,
      );
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [reduced, target, startMs, durationMs, anchor]);

  return value;
}
