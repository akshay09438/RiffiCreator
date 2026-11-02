import { content } from '../../content';
import { Chip } from '../primitives/Chip';
import { Section } from '../primitives/Section';

/**
 * A curiosity, not a reveal: the founding creator's coin, softened at the source so the lettering
 * and detail cannot be recovered from the file. Creators were not told about it; the copy says
 * only that something is waiting. No perks, number or date appear here.
 */
export function Badge() {
  const block = content.badge;
  return (
    <Section id="badge" tone="sky" belowFold>
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <Chip tone="butter">{block.chip}</Chip>
          <h2 id="badge-heading" className="mt-4 font-display text-display-l font-bold">
            {block.heading}
          </h2>
          <p className="mt-4 max-w-[34rem] text-body-l text-ink">{block.lead}</p>
          <p className="mt-4 max-w-[34rem] text-meta text-ink-soft">{block.note}</p>
        </div>
        <div className="flex justify-center md:col-span-5">
          <img
            src={block.image}
            alt={block.alt}
            width={200}
            height={200}
            loading="lazy"
            decoding="async"
            className="badge-coin"
          />
        </div>
      </div>
    </Section>
  );
}
