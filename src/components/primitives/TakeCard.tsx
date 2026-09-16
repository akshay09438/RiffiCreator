import type { ReactNode } from 'react';
import { Chip } from './Chip';

type TakeCardProps = {
  chip: string;
  text: string;
  /** The hero's card carries the page's one shadow and tilts on desktop (PRD Block 1). */
  featured?: boolean;
  children?: ReactNode;
};

/** The product's atom: a short opinion, labelled, with room for its poll (PRD 3.1). */
export function TakeCard({ chip, text, featured = false, children }: TakeCardProps) {
  return (
    <article
      className={`take-card rounded-take bg-paper p-5 md:p-6 ${featured ? 'lg:-rotate-2' : ''}`}
    >
      <Chip tone="butter">{chip}</Chip>
      <p className="mt-4 font-display text-display-m font-bold text-ink">{text}</p>
      {children}
    </article>
  );
}
