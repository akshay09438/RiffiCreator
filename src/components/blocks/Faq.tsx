import { Plus } from 'lucide-react';
import { content } from '../../content';
import { Section } from '../primitives/Section';

/** Block 7: clear the last small doubts - native disclosures, the first one open (PRD Block 7). */
export function Faq() {
  const block = content.faq;
  return (
    <Section id="faq" tone="paper" belowFold>
      <h2 id="faq-heading" className="font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <div className="faq mt-10 max-w-[44rem] border-t border-hairline">
        {block.items.map((item, index) => (
          <details key={item.question} open={index === 0} className="border-b border-hairline">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-4 text-body-l font-semibold text-ink">
              {item.question}
              <Plus aria-hidden="true" className="faq-icon size-5 shrink-0" />
            </summary>
            <p className="max-w-[34rem] pb-5 text-body text-ink-soft">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
