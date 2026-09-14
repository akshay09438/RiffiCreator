import type { ReactNode } from 'react';

const TONES = {
  blue: 'bg-chip-blue-bg text-chip-blue-ink',
  butter: 'bg-chip-butter-bg text-chip-butter-ink',
  coral: 'bg-chip-coral-bg text-chip-coral-ink',
  neutral: 'bg-recess text-ink-soft',
} as const;

export type ChipTone = keyof typeof TONES;

type ChipProps = { tone: ChipTone; children: ReactNode };

/** A fully rounded label that carries the page's playfulness (PRD 3.2). Sentence case, never caps. */
export function Chip({ tone, children }: ChipProps) {
  return (
    <span
      data-tone={tone}
      className={`${TONES[tone]} inline-flex items-center rounded-pill px-3 py-1 text-meta font-medium`}
    >
      {children}
    </span>
  );
}
