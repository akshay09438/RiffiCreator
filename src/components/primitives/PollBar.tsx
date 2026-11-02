import type { CSSProperties } from 'react';
import { useInView } from '../../hooks/useInView';

export type PollSide = { label: string; value: string; weight: number };

type Variant = 'sample' | 'comparison' | 'meter';

type PollBarProps = {
  left: PollSide;
  right: PollSide;
  variant: Variant;
  /** Fill when scrolled into view (comparison rows, seat meter) instead of on page load. */
  animateOnView?: boolean;
  /** In the sample legend, show each side's value (for example "71%") before its label. */
  showPercent?: boolean;
  /** Position in a staggered group: each step delays the fill by 80ms (PRD 3.5). */
  index?: number;
  /** Which side is drawn as the fill. `right` grows the fill from the right edge. */
  fill?: 'left' | 'right';
};

type LegendProps = { side: PollSide; variant: Variant; showPercent: boolean; end: boolean };

function Legend({ side, variant, showPercent, end }: LegendProps) {
  const align = end ? 'text-right' : 'text-left';
  if (variant === 'comparison') {
    return (
      <div className={align}>
        <p className="text-meta text-ink-soft">{side.label}</p>
        <p className="font-semibold text-ink">{side.value}</p>
      </div>
    );
  }
  return (
    <p className={`${align} text-ink`}>
      {showPercent ? (
        <>
          <span className="font-semibold">{side.value}</span>{' '}
        </>
      ) : null}
      <span>{side.label}</span>
    </p>
  );
}

/**
 * The page's structural device - an opinion is a split (PRD 3.1, 5.5). The drawn bar is decoration;
 * both sides always exist as text, so the meaning never rests on colour or motion. The track has a
 * fixed height, so the fill animation causes no layout shift.
 */
export function PollBar({
  left,
  right,
  variant,
  animateOnView = false,
  showPercent = false,
  index = 0,
  fill = 'left',
}: PollBarProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const total = left.weight + right.weight;
  const filled = fill === 'left' ? left.weight : right.weight;
  const share = total > 0 ? Math.round((filled / total) * 100) : 0;
  const motion = animateOnView ? 'view' : variant === 'sample' ? 'load' : 'none';
  const style = { '--fill': `${share}%`, '--stagger': `${index * 80}ms` } as CSSProperties;

  return (
    <div
      ref={ref}
      className="poll"
      data-variant={variant}
      data-motion={motion}
      data-fill={fill}
      data-in-view={inView}
      style={style}
    >
      <div className="poll-track" aria-hidden="true">
        <div className="poll-fill" />
      </div>
      {variant === 'meter' ? null : (
        <div className="mt-3 grid grid-cols-2 gap-4">
          <Legend side={left} variant={variant} showPercent={showPercent} end={false} />
          <Legend side={right} variant={variant} showPercent={showPercent} end />
        </div>
      )}
    </div>
  );
}
