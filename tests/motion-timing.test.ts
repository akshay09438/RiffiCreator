// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { COUNT_START_MS } from '../src/components/blocks/Hero';

// The hero's one motion moment lives in two places: CSS runs the fill and the fade, JavaScript ticks the number.
const css = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');

function animationTimes(selector: string): number[] {
  const start = css.indexOf(`${selector} {`);
  expect(start).toBeGreaterThan(-1);
  const rule = css.slice(start, css.indexOf('}', start));
  const declaration = rule.match(/animation:\s*([^;]+);/);
  expect(declaration).not.toBeNull();
  return [...(declaration?.[1] ?? '').matchAll(/(\d+)ms/g)].map((match) => Number(match[1]));
}

describe('hero motion timing (PRD 3.5)', () => {
  it('starts the vote count exactly when the sample poll has filled', () => {
    const [duration, delay] = animationTimes(".poll[data-motion='load'] .poll-fill");
    expect(delay + duration).toBe(COUNT_START_MS);
  });

  it('fades the vote count in at the moment its number starts to tick', () => {
    const [, delay] = animationTimes('.vote-count');
    expect(delay).toBe(COUNT_START_MS);
  });
});
