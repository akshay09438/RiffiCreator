import { content } from '../../content';
import { Section } from '../primitives/Section';

/** Block 5: what this turns into, without overpromising - a plan, not a contract. */
export function LongGame() {
  const block = content.longGame;
  return (
    <Section id="long-game" tone="paper" belowFold>
      <h2 id="long-game-heading" className="font-display text-display-l font-bold">
        <span className="hero-mark">{block.headingMark}</span>{' '}
        <span>{block.headingRest}</span>
      </h2>
      <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
        {block.items.map((item) => (
          <div key={item.title} className="max-w-[34rem]">
            <h3 className="font-display text-display-m font-bold">{item.title}</h3>
            <p className="mt-3 text-body text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-12 max-w-[34rem] border-t border-hairline pt-6 text-body text-ink-soft">
        {block.framing}
      </p>
    </Section>
  );
}
