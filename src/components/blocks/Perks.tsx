import { content } from '../../content';
import { Chip } from '../primitives/Chip';
import { Section } from '../primitives/Section';

/**
 * What waits for creators who came in early. Three perks arrive at launch, two are a plan ("Soon"),
 * and the framing line says so. No number, no payout figure, no promise of money.
 */
export function Perks() {
  const block = content.perks;
  return (
    <Section id="perks" tone="recess" belowFold>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-5">
          <h2 id="perks-heading" className="font-display text-display-l font-bold">
            {block.heading}
          </h2>
          <p className="mt-4 max-w-[34rem] text-body-l text-ink">{block.lead}</p>
          <p className="mt-4 max-w-[34rem] text-meta text-ink-soft">{block.framing}</p>
        </div>
        <ul className="grid gap-3 lg:col-span-7">
          {block.items.map((item) => (
            <li
              key={item.label}
              className="feature-card flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
            >
              <span className="font-display text-body-l font-bold text-ink">{item.label}</span>
              <Chip tone={item.when === 'Soon' ? 'neutral' : 'blue'}>{item.when}</Chip>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
