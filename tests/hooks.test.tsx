import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCountUp } from '../src/hooks/useCountUp';
import { useInView } from '../src/hooks/useInView';
import { useReducedMotion } from '../src/hooks/useReducedMotion';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

/** Stubs window.matchMedia for the reduced-motion query and returns a way to flip the setting. */
function stubReducedMotion(initial: boolean): (next: boolean) => void {
  const listeners = new Set<() => void>();
  const list = {
    matches: initial,
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  };
  vi.stubGlobal('matchMedia', () => list);
  return (next) => {
    list.matches = next;
    listeners.forEach((listener) => listener());
  };
}

function InViewProbe() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return <div ref={ref} data-testid="probe" data-in-view={inView} />;
}

describe('useReducedMotion', () => {
  it('is false when the browser cannot report a motion preference', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('follows the device setting, including a live change', () => {
    const setPreference = stubReducedMotion(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
    act(() => setPreference(false));
    expect(result.current).toBe(false);
  });
});

describe('useInView', () => {
  it('reports in view on the next tick when IntersectionObserver is missing', () => {
    vi.useFakeTimers();
    render(<InViewProbe />);
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'false');
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true');
  });

  it('reports in view once the element intersects, then stops observing', () => {
    let notify: (entries: Array<{ isIntersecting: boolean }>) => void = () => {};
    const disconnectSpy = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: (entries: Array<{ isIntersecting: boolean }>) => void) {
          notify = callback;
        }
        observe() {}
        disconnect = disconnectSpy;
      },
    );
    render(<InViewProbe />);
    act(() => notify([{ isIntersecting: false }]));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'false');
    act(() => notify([{ isIntersecting: true }]));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true');
    expect(disconnectSpy).toHaveBeenCalled();
  });
});

describe('useCountUp', () => {
  it('starts at the real number, so the pre-rendered page is never wrong', () => {
    const { result } = renderHook(() => useCountUp(2140, 1320, 600));
    expect(result.current).toBe(2140);
  });

  it('never rewinds a number when the page hydrates after the tick was due', () => {
    vi.spyOn(performance, 'now').mockReturnValue(5000);
    const requestFrame = vi.fn();
    vi.stubGlobal('requestAnimationFrame', requestFrame);
    const { result } = renderHook(() => useCountUp(2140, 1320, 600));
    expect(result.current).toBe(2140);
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it('ticks from zero up to the target when the page hydrated early', () => {
    vi.spyOn(performance, 'now').mockReturnValue(200);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const { result } = renderHook(() => useCountUp(2140, 1320, 600));
    act(() => frames.shift()?.(1000));
    expect(result.current).toBe(0);
    act(() => frames.shift()?.(1620));
    expect(result.current).toBe(1873);
    act(() => frames.shift()?.(1920));
    expect(result.current).toBe(2140);
    expect(frames).toHaveLength(0);
  });

  it('holds the real number when the visitor prefers reduced motion', () => {
    stubReducedMotion(true);
    vi.spyOn(performance, 'now').mockReturnValue(200);
    const requestFrame = vi.fn();
    vi.stubGlobal('requestAnimationFrame', requestFrame);
    const { result } = renderHook(() => useCountUp(2140, 1320, 600));
    expect(result.current).toBe(2140);
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it("ticks from the moment the anchor's CSS fade-in starts, not from navigation", () => {
    vi.spyOn(performance, 'now').mockReturnValue(1000);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const element = document.createElement('p');
    element.getAnimations = (() => [
      { animationName: 'vote-count-in', startTime: 600 },
    ]) as unknown as Element['getAnimations'];
    // Built once, outside renderHook: the same object identity on every render, the way useRef() is.
    const anchor = { current: element };
    const { result } = renderHook(() => useCountUp(2140, 1320, 600, anchor));
    act(() => frames.shift()?.(1920));
    expect(result.current).toBe(0);
    act(() => frames.shift()?.(2220));
    expect(result.current).toBe(1873);
    act(() => frames.shift()?.(2520));
    expect(result.current).toBe(2140);
    expect(frames).toHaveLength(0);
  });

  it("never rewinds when the anchor's fade-in started before the page hydrated", () => {
    vi.spyOn(performance, 'now').mockReturnValue(2000);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const element = document.createElement('p');
    element.getAnimations = (() => [
      { animationName: 'vote-count-in', startTime: 600 },
    ]) as unknown as Element['getAnimations'];
    const anchor = { current: element };
    const { result } = renderHook(() => useCountUp(2140, 1320, 600, anchor));
    act(() => frames.shift()?.(2000));
    expect(result.current).toBe(2140);
  });

  it("waits for a pending CSS animation's real start before ticking", async () => {
    vi.spyOn(performance, 'now').mockReturnValue(1000);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const animation: { animationName: string; startTime: number | null; ready: Promise<{ startTime: number | null }> } = {
      animationName: 'vote-count-in',
      startTime: null,
      ready: Promise.resolve({ startTime: null as number | null }),
    };
    animation.ready = Promise.resolve().then(() => {
      animation.startTime = 600;
      return animation;
    });
    const element = document.createElement('p');
    element.getAnimations = (() => [animation]) as unknown as Element['getAnimations'];
    const anchor = { current: element };
    const { result } = renderHook(() => useCountUp(2140, 1320, 600, anchor));
    expect(frames).toHaveLength(0);
    await act(async () => {
      await animation.ready;
    });
    expect(frames).toHaveLength(1);
    act(() => frames.shift()?.(1920));
    expect(result.current).toBe(0);
    act(() => frames.shift()?.(2220));
    expect(result.current).toBe(1873);
    act(() => frames.shift()?.(2520));
    expect(result.current).toBe(2140);
    expect(frames).toHaveLength(0);
  });

  it('ticks when hydration lands after 1320ms but before the fade-in starts', () => {
    vi.spyOn(performance, 'now').mockReturnValue(1500);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const element = document.createElement('p');
    element.getAnimations = (() => [
      { animationName: 'vote-count-in', startTime: 600 },
    ]) as unknown as Element['getAnimations'];
    const anchor = { current: element };
    const { result } = renderHook(() => useCountUp(2140, 1320, 600, anchor));
    expect(frames).toHaveLength(1);
    act(() => frames.shift()?.(1920));
    expect(result.current).toBe(0);
    act(() => frames.shift()?.(2220));
    expect(result.current).toBe(1873);
    act(() => frames.shift()?.(2520));
    expect(result.current).toBe(2140);
    expect(frames).toHaveLength(0);
  });

  it('does not tick if the page unmounts before the animation starts', async () => {
    vi.spyOn(performance, 'now').mockReturnValue(1000);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const animation: { animationName: string; startTime: number | null; ready: Promise<{ startTime: number | null }> } = {
      animationName: 'vote-count-in',
      startTime: null,
      ready: Promise.resolve({ startTime: null as number | null }),
    };
    animation.ready = Promise.resolve().then(() => {
      animation.startTime = 600;
      return animation;
    });
    const element = document.createElement('p');
    element.getAnimations = (() => [animation]) as unknown as Element['getAnimations'];
    const anchor = { current: element };
    const { unmount } = renderHook(() => useCountUp(2140, 1320, 600, anchor));
    unmount();
    await act(async () => {
      await animation.ready;
    });
    expect(frames).toHaveLength(0);
  });
});
