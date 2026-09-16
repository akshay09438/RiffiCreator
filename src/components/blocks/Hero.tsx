import { useRef } from 'react';
import { content } from '../../content';
import { useCountUp } from '../../hooks/useCountUp';
import { CtaButton } from '../primitives/CtaButton';
import { PollBar } from '../primitives/PollBar';
import { Section } from '../primitives/Section';
import { TakeCard } from '../primitives/TakeCard';

/** The tick starts once the sample poll has filled: a 420ms delay plus the 900ms fill. The vote count's
 *  CSS fade-in waits the same 1320ms; tests/motion-timing.test.ts keeps the numbers in step. */
export const COUNT_START_MS = 1320;
const COUNT_DURATION_MS = 600;

/** Block 1: what this is and the offer, inside five seconds - and the page's one showpiece motion. */
export function Hero() {
  const { titleLines, subline, sampleTake } = content.hero;
  const voteCount = useRef<HTMLParagraphElement>(null);
  const votes = useCountUp(sampleTake.votes, COUNT_START_MS, COUNT_DURATION_MS, voteCount);

  return (
    <Section id="hero" tone="paper">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <h1 id="hero-heading" className="hero-title text-display-xl font-extrabold">
            <span className="hero-line block">{titleLines[0]}</span>{' '}
            <span className="hero-line block">
              <span className="hero-mark">{titleLines[1]}</span>
            </span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-body-l text-ink-soft">{subline}</p>
          <div className="mt-6">
            <CtaButton variant="dark" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <TakeCard chip={sampleTake.chip} text={sampleTake.text} featured>
            <div className="mt-6">
              <PollBar
                variant="sample"
                showPercent
                left={{
                  label: sampleTake.agree.label,
                  value: `${sampleTake.agree.percent}%`,
                  weight: sampleTake.agree.percent,
                }}
                right={{
                  label: sampleTake.disagree.label,
                  value: `${sampleTake.disagree.percent}%`,
                  weight: sampleTake.disagree.percent,
                }}
              />
            </div>
            <p ref={voteCount} className="vote-count mt-4 text-meta text-take">
              {/* One text node, so the server HTML reads "2,140 votes" with no React text separators. */}
              {`${votes.toLocaleString('en-IN')} ${sampleTake.votesLabel}`}
            </p>
          </TakeCard>
        </div>
      </div>
    </Section>
  );
}
