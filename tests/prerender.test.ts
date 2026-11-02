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

  it('has every heading, both buttons, the form and every FAQ answer before any script runs', () => {
    const headings = [
      ...content.hero.titleLines,
      content.perks.heading,
      content.badge.heading,
      content.join.heading,
      content.faq.heading,
      content.close.heading,
    ];
    for (const text of headings) expect(html).toContain(escaped(text));
    for (const item of content.faq.items) expect(html).toContain(escaped(item.answer));
    // Pinned to the value in settings, not to ctaHref itself: comparing the link with the constant
    // the page built it from would pass no matter where the button actually pointed.
    expect(ctaHref).toBe('#join');
    expect(count('href="#join"')).toBe(2);
    expect(count(`action="${settings.form.responseUrl}"`)).toBe(1);
    // The exact helper line under each button; the form's own lead also contains the same words.
    expect(count(`>${escaped(content.cta.helper)}<`)).toBe(2);
    expect(html).not.toContain('ig.me');
  });

  it('pre-renders the badge as a sized, lazy image from this site, once large and once small', () => {
    expect(count(`src="${content.badge.image}"`)).toBe(2);
    expect(count('width="400"')).toBe(2);
    expect(count('height="400"')).toBe(2);
    expect(count('loading="lazy"')).toBe(2);
    expect(html).not.toMatch(/<img[^>]+src="(?:https?:)?\/\//i);
  });

  it('works the FAQ without JavaScript: three native disclosures, the first one open', () => {
    expect(count('<details')).toBe(3);
    expect(count('<details open=""')).toBe(1);
  });

  it('draws the sample poll bar at its final split in the HTML', () => {
    expect(html).toContain('--fill:71%');
    expect(html).not.toContain('data-in-view="true"');
  });

  it("shows the sample take's vote count in the HTML", () => {
    expect(html).toContain(escaped(`2,140 ${content.hero.sampleTake.votesLabel}`));
  });
});
