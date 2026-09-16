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
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <p
          aria-hidden="true"
          className="seats-number font-display font-extrabold text-ink lg:col-span-5"
        >
          {String(seats.total)}
        </p>
        <div className="lg:col-span-7">
          <h2 id="seats-heading" className="font-display text-display-l font-bold">
            {block.heading}
          </h2>
          <p className="mt-5 max-w-[34rem] text-body text-ink-soft">{block.body}</p>
          {/* The meter is drawn only when a real count exists: an empty track is a picture of zero
              (17 Sep 2026). With no count, the label carries the batch size on its own. */}
          <div data-seat-meter className="mt-8 max-w-[34rem]">
            {taken === null ? null : (
              <PollBar
                variant="meter"
                animateOnView
                left={{ label: '', value: '', weight: taken }}
                right={{ label: '', value: '', weight: seats.total - taken }}
              />
            )}
            <p className={`text-meta text-ink-soft ${taken === null ? '' : 'mt-3'}`}>
              {taken === null ? block.meterLabel : block.takenLabel(taken, seats.total)}
            </p>
          </div>
          {/* The page is long on a laptop: the ask and the button belong in the same breath. */}
          <div className="mt-8">
            <CtaButton variant="dark" />
          </div>
        </div>
      </div>
    </Section>
  );
}
