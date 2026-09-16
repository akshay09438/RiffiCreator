import type { ReactNode } from 'react';

/**
 * The page stays white; a section's colour arrives as a drawn panel inside it (founder's direction,
 * 16 Sep 2026). `paper` sections have no panel, so the white page itself carries them.
 */
const TONES = {
  paper: { section: 'text-ink', panel: '' },
  recess: { section: 'text-ink', panel: 'panel bg-lime p-6 md:p-10 lg:p-12' },
  ink: { section: 'text-paper', panel: 'panel bg-ink p-6 md:p-10 lg:p-12' },
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
      className={`${TONES[tone].section} ${belowFold ? 'below-fold' : ''} py-[56px] lg:py-[88px] xl:py-[104px]`}
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 md:px-8 lg:px-10">
        <div className={TONES[tone].panel}>{children}</div>
      </div>
    </section>
  );
}
