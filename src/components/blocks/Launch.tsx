import { content } from '../../content';
import { Section } from '../primitives/Section';

/**
 * Block 6: when it launches. Honest dates only: an estimate, a worst case and a date still to be
 * announced. Nothing here counts down, and nothing is stated as a promise.
 */
export function Launch() {
  const block = content.launch;
  return (
    <Section id="launch" tone="recess" belowFold>
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <p
          aria-hidden="true"
          className="seats-number font-display font-extrabold text-ink lg:col-span-5"
        >
          {block.bigWord}
        </p>
        <div className="lg:col-span-7">
          <h2 id="launch-heading" className="font-display text-display-l font-bold">
            {block.heading}
          </h2>
          <dl className="mt-8 grid max-w-[34rem] gap-3">
            {block.timeline.map((row) => (
              <div
                key={row.label}
                className="feature-card flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
              >
                <dt className="text-meta text-ink-soft">{row.label}</dt>
                <dd className="font-display text-body-l font-bold text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-[34rem] text-meta text-ink-soft">{block.framing}</p>
        </div>
      </div>
    </Section>
  );
}
