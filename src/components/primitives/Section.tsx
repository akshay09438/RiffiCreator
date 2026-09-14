import type { ReactNode } from 'react';

const TONES = {
  paper: 'bg-paper text-ink',
  recess: 'bg-recess text-ink',
  ink: 'bg-ink text-paper',
} as const;

type SectionProps = {
  id: string;
  tone: keyof typeof TONES;
  /** Below-the-fold sections skip rendering work until they are near the viewport (PRD 7). */
  belowFold?: boolean;
  children: ReactNode;
};

/** A page section: its background band, the vertical rhythm and the content column (PRD 3.4). */
export function Section({ id, tone, belowFold = false, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`${TONES[tone]} ${belowFold ? 'below-fold' : ''} py-[72px] lg:py-[112px] xl:py-[128px]`}
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 md:px-8 lg:px-10">{children}</div>
    </section>
  );
}
