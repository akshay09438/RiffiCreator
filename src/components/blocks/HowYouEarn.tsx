import { content } from '../../content';
import { Section } from '../primitives/Section';

/** Block 4: what a creator gets for going first, and the straight answer that there is no money yet. */
export function HowYouEarn() {
  const block = content.howYouEarn;
  return (
    <Section id="how-you-earn" tone="recess" belowFold>
      <h2 id="how-you-earn-heading" className="font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <p className="mt-4 max-w-[34rem] text-body-l text-ink">{block.lead}</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:gap-5">
        {block.rows.map((row) => (
          <li key={row.action} className="feature-card">
            <p className="font-display text-body-l font-bold text-ink">{row.action}</p>
            <p className="mt-2 text-body text-ink-soft">{row.description}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-[34rem] text-meta text-ink-soft">{block.note}</p>
    </Section>
  );
}
