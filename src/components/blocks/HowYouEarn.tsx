import { content } from '../../content';
import { Section } from '../primitives/Section';

/** Block 4: earning starts at post one - what earns points, never how many (PRD 2.4). */
export function HowYouEarn() {
  const block = content.howYouEarn;
  return (
    <Section id="how-you-earn" tone="recess" belowFold>
      <h2 id="how-you-earn-heading" className="font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
        {block.rows.map((row) => (
          <li
            key={row.action}
            className="flex flex-col gap-3 py-5 md:flex-row md:items-start md:justify-between md:gap-6"
          >
            <div className="max-w-[34rem]">
              <p className="text-body-l font-semibold text-ink">{row.action}</p>
              <p className="mt-1 text-body text-ink-soft">{row.description}</p>
            </div>
            <span className="self-start rounded-pill bg-paper px-3 py-1 text-meta font-medium text-ink-soft">
              {block.pill}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-[34rem] text-meta text-ink-soft">{block.note}</p>
    </Section>
  );
}
