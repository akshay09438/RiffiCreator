import { content, settings } from '../../content';
import { PollBar } from '../primitives/PollBar';
import { Section } from '../primitives/Section';

/** Block 3: the emotional core. Each comparison is itself a vote, Instagram against Riffi. */
export function WhyHere() {
  const block = content.whyHere;
  const split = settings.comparisonSplit;
  return (
    <Section id="why-here" tone="paper" belowFold>
      <h2 id="why-here-heading" className="font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <div className="mt-10 grid gap-10">
        {block.rows.map((row, index) => (
          <div key={row.label}>
            <p className="mb-3 text-body-l font-semibold text-ink">{row.label}</p>
            {/* Riffi leads the bar (17 Sep 2026): the blue fill starts at the left edge and the
                hollow Instagram side follows it. */}
            <PollBar
              variant="comparison"
              animateOnView
              fill="left"
              index={index}
              left={{ label: block.riffiLabel, value: row.riffi, weight: split.riffi }}
              right={{ label: block.instagramLabel, value: row.instagram, weight: split.instagram }}
            />
          </div>
        ))}
      </div>
      <p className="my-12 max-w-[40rem] font-display text-display-m font-bold">{block.closer}</p>
    </Section>
  );
}
