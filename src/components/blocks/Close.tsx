import { content } from '../../content';
import { CtaButton } from '../primitives/CtaButton';
import { Section } from '../primitives/Section';

/** Block 8: the decision. The only inverted section; the page ends where the button has been all along. */
export function Close() {
  const block = content.close;
  return (
    <Section id="close" tone="ink" belowFold>
      <h2 id="close-heading" className="font-display text-display-l font-bold text-paper">
        {block.heading}
      </h2>
      <p className="mt-5 max-w-[34rem] text-body-l text-on-ink-body">{block.body}</p>
      <div className="mt-8">
        <CtaButton variant="light" />
      </div>
    </Section>
  );
}
