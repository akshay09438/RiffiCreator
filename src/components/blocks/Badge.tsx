import { content } from '../../content';
import { Section } from '../primitives/Section';

/**
 * The Founding Creator badge, shown clearly (2 Nov 2026, after a first, deliberately blurred
 * teaser). The coin is the real design; the copy says only that early creators get one when Riffi
 * launches, and names no perk, number or date.
 */
export function Badge() {
  const block = content.badge;
  return (
    <Section id="badge" tone="sky" belowFold>
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <h2 id="badge-heading" className="font-display text-display-l font-bold">
            {block.heading}
          </h2>
          <p className="mt-4 max-w-[34rem] text-body-l text-ink">{block.lead}</p>
        </div>
        <div className="flex justify-center md:col-span-5">
          <img
            src={block.image}
            alt={block.alt}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            className="badge-coin"
          />
        </div>
      </div>
    </Section>
  );
}
