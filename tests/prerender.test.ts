// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { render, siteUrl } from '../src/entry-server';
import { content, settings } from '../src/content';
import { ctaHref } from '../src/lib/cta';

const html = render();

/** The form a string takes in React's server output. */
function escaped(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');
}

function count(needle: string): number {
  return html.split(needle).length - 1;
}

describe('the pre-rendered page (design option A)', () => {
  it('renders the page landmarks to HTML without a browser', () => {
    expect(html).toContain('<header');
    expect(html).toContain('<main id="main"');
    expect(html).toContain('<footer');
  });

  it('exposes the site URL the link-preview card needs, as a bare https domain', () => {
    expect(siteUrl).toMatch(/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i);
  });

  it('has every heading, all three buttons and every FAQ answer before any script runs', () => {
    const headings = [
      ...content.hero.titleLines,
      content.videoTakes.heading,
      content.whatRiffiIs.heading,
      content.whyHere.heading,
      content.howYouEarn.heading,
      // headingMark/headingRest: the long-game h2 now renders as two <span>s, so the full
      // sentence never sits as one unbroken run in raw HTML - checked as one accessible name
      // in tests/page.test.tsx (#long-game) instead.
      content.longGame.headingMark,
      content.longGame.headingRest,
      content.seats.heading,
      content.faq.heading,
      content.close.heading,
    ];
    for (const text of headings) expect(html).toContain(escaped(text));
    for (const item of content.faq.items) expect(html).toContain(escaped(item.answer));
    // Pinned to the value in settings, not to ctaHref itself: comparing the link with the constant
    // the page built it from would pass no matter where the button actually pointed.
    expect(ctaHref).toBe(settings.applyFormUrl);
    expect(count(`href="${settings.applyFormUrl}"`)).toBe(3);
    expect(count(escaped(content.cta.helper))).toBe(3);
    expect(html).not.toContain('ig.me');
  });

  it('pre-renders every card still as a sized, lazy image from this site', () => {
    const stills = content.videoTakes.items.flatMap((item) => ('still' in item ? [item.still] : []));
    expect(stills.length).toBeGreaterThan(0);
    for (const still of stills) expect(count(`src="${still}"`)).toBe(1);
    expect(count('width="360"')).toBe(stills.length);
    expect(count('height="640"')).toBe(stills.length);
    expect(count('loading="lazy"')).toBe(stills.length);
    expect(html).not.toMatch(/<img[^>]+src="(?:https?:)?\/\//i);
  });

  it('works the FAQ without JavaScript: six native disclosures, the first one open', () => {
    expect(count('<details')).toBe(6);
    expect(count('<details open=""')).toBe(1);
  });

  it('draws every poll bar at its final split in the HTML', () => {
    const { instagram, riffi } = settings.comparisonSplit;
    const riffiShare = Math.round((riffi / (instagram + riffi)) * 100);
    expect(html).toContain('--fill:71%');
    expect(count(`--fill:${riffiShare}%`)).toBe(content.whyHere.rows.length);
    expect(html).not.toContain('data-in-view="true"');
  });

  it("shows the sample take's vote count in the HTML", () => {
    expect(html).toContain(escaped(`2,140 ${content.hero.sampleTake.votesLabel}`));
  });
});
