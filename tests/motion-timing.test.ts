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

describe('the badge swish after the form is sent (2 Nov 2026)', () => {
  it('plays once, in about a second, and never loops', () => {
    const [duration] = animationTimes('.coin-swipe');
    expect(duration).toBeGreaterThanOrEqual(800);
    expect(duration).toBeLessThanOrEqual(1600);
    const start = css.indexOf('.coin-swipe {');
    const rule = css.slice(start, css.indexOf('}', start));
    expect(rule).not.toMatch(/infinite/);
  });

  it('moves with transform and opacity only, so it never reflows the page', () => {
    const start = css.indexOf('@keyframes coin-swipe');
    expect(start).toBeGreaterThan(-1);
    const end = css.indexOf('\n  }\n', css.indexOf('to {', start));
    const frames = css.slice(start, end);
    const properties = [...frames.matchAll(/^\s+([a-z-]+):/gm)].map((match) => match[1]);
    expect(properties.length).toBeGreaterThan(0);
    for (const property of properties) expect(['opacity', 'transform']).toContain(property);
  });

  it('stands still for anyone who asks for reduced motion', () => {
    const start = css.indexOf('@media (prefers-reduced-motion: reduce) {\n    .hero-line');
    expect(start).toBeGreaterThan(-1);
    const block = css.slice(start, css.indexOf('}', start));
    expect(block).toContain('.coin-swipe');
    expect(block).toContain('animation: none');
  });
});

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
