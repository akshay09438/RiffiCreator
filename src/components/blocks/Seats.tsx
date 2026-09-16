import { content, type Settings } from '../../content';
import { CtaButton } from '../primitives/CtaButton';
import { PollBar } from '../primitives/PollBar';
import { Section } from '../primitives/Section';

type SeatsProps = { seats: Settings['seats'] };

/** Block 6: the commitment and the scarcity in one breath - and never an invented number (PRD 2.4). */
export function Seats({ seats }: SeatsProps) {
  const block = content.seats;
  const taken = seats.show && seats.taken !== null ? seats.taken : null;
  return (
    <Section id="seats" tone="recess" belowFold>
      <p aria-hidden="true" className="seats-number font-display font-extrabold text-ink">
        {String(seats.total)}
      </p>
      <h2 id="seats-heading" className="mt-2 font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <p className="mt-5 max-w-[34rem] text-body text-ink-soft">{block.body}</p>
      <div data-seat-meter className="mt-10 max-w-[34rem]">
        <PollBar
          variant="meter"
          animateOnView
          left={{ label: '', value: '', weight: taken ?? 0 }}
          right={{ label: '', value: '', weight: seats.total - (taken ?? 0) }}
        />
        <p className="mt-3 text-meta text-ink-soft">
          {taken === null ? block.meterLabel : block.takenLabel(taken, seats.total)}
        </p>
      </div>
      {/* The page is long on a laptop: the ask and the button belong in the same breath. */}
      <div className="mt-8">
        <CtaButton variant="dark" />
      </div>
    </Section>
  );
}
