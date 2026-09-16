import { content } from '../../content';
import { Chip, type ChipTone } from '../primitives/Chip';
import { Section } from '../primitives/Section';
import { TakeCard } from '../primitives/TakeCard';

/** Category chips cycle through the three chip colours (PRD Block 2). */
const CATEGORY_TONES: readonly ChipTone[] = ['blue', 'butter', 'coral'];

/** Block 2: make "a take" concrete, so a creator knows exactly what they would post. */
export function WhatRiffiIs() {
  const block = content.whatRiffiIs;
  return (
    <Section id="what-riffi-is" tone="paper" belowFold>
      <h2 id="what-riffi-is-heading" className="font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <p className="mt-5 max-w-[34rem] text-body-l text-ink-soft">{block.lead}</p>

      <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
        {[
          { side: block.notTake, tone: 'coral' as const },
          { side: block.take, tone: 'blue' as const },
        ].map(({ side, tone }) => (
          <div key={side.chip} className="border-t border-hairline pt-5">
            <Chip tone={tone}>{side.chip}</Chip>
            <p className="mt-4 font-display text-display-m font-bold text-ink">{side.text}</p>
            <p className="mt-3 text-body text-ink-soft">{side.caption}</p>
          </div>
        ))}
      </div>

      <ul className="mt-10 flex flex-wrap gap-2">
        {block.categories.map((category, index) => (
          <li key={category}>
            <Chip tone={CATEGORY_TONES[index % CATEGORY_TONES.length]}>{category}</Chip>
          </li>
        ))}
      </ul>

      <div data-marquee aria-hidden="true" className="marquee mt-12">
        <div className="marquee-track">
          {[...block.marqueeTakes, ...block.marqueeTakes].map((take, index) => (
            <div key={`${index}-${take}`} className="marquee-item">
              <TakeCard chip={block.marqueeChip} text={take} />
            </div>
          ))}
        </div>
      </div>
      <ul aria-label={block.marqueeLabel} className="sr-only">
        {block.marqueeTakes.map((take) => (
          <li key={take}>{take}</li>
        ))}
      </ul>
    </Section>
  );
}
