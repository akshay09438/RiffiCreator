// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { Seats } from '../src/components/blocks/Seats';
import { content, settings } from '../src/content';
import { ctaHref } from '../src/lib/cta';
import { EXAMPLE_FRAMING, MONEY, NUMBER_NEXT_TO_POINTS, SEAT_COUNT, URGENCY, sentencesOf } from './honesty-rules';

// ---------- helpers ----------

const normalize = (text: string | null | undefined): string => (text ?? '').replace(/\s+/g, ' ').trim();

// Order since 17 Sep 2026: video leads (Riffi is pitched to reels creators), the typed
// option (what-riffi-is) is second - reversed from the block's original PRD position.
const SECTION_IDS = [
  'hero',
  'video-takes',
  'what-riffi-is',
  'why-here',
  'how-you-earn',
  'long-game',
  'seats',
  'faq',
  'close',
];

function section(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element || element.tagName !== 'SECTION') throw new Error(`the page has no <section id="${id}">`);
  return element;
}

/** The one element matching a selector inside a container, or a clear failure. */
function only(container: ParentNode, selector: string): HTMLElement {
  const found = container.querySelectorAll<HTMLElement>(selector);
  if (found.length !== 1) throw new Error(`expected exactly one "${selector}", found ${found.length}`);
  return found[0] as HTMLElement;
}

/** The deepest elements whose whole text, whitespace-normalised, is exactly `text` (inline markup allowed). */
function byFullText(container: ParentNode, text: string): HTMLElement[] {
  const wanted = normalize(text);
  return Array.from(container.querySelectorAll<HTMLElement>('*')).filter(
    (element) =>
      normalize(element.textContent) === wanted &&
      !Array.from(element.children).some((child) => normalize(child.textContent) === wanted),
  );
}

/** The smallest element that contains both a and b. */
function commonAncestor(a: Element, b: Element): HTMLElement {
  let node: Element | null = a;
  while (node && !node.contains(b)) node = node.parentElement;
  if (!node) throw new Error('the two elements share no ancestor');
  return node as HTMLElement;
}

const comesBefore = (a: Node, b: Node): boolean =>
  Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

const hiddenFromScreenReaders = (element: Element): boolean => element.closest('[aria-hidden="true"]') !== null;

/** Everything a person or a screen reader can meet inside root: all text, plus the text-bearing attributes. */
function readableText(root: Element): string {
  const parts: string[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) parts.push(node.textContent ?? '');
  for (const element of [root, ...Array.from(root.querySelectorAll('*'))]) {
    for (const name of ['aria-label', 'aria-valuetext', 'aria-valuenow', 'title', 'alt']) {
      const value = element.getAttribute(name);
      if (value) parts.push(value);
    }
  }
  return normalize(parts.join(' '));
}

// ---------- structure ----------

describe('page structure and semantics (PRD 7)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('has one page header with the wordmark and the Batch 01 chip', () => {
    const headers = Array.from(document.querySelectorAll<HTMLElement>('header')).filter((el) => !el.closest('main'));
    expect(headers).toHaveLength(1);
    const header = headers[0] as HTMLElement;
    expect(within(header).getByText(content.nav.wordmark)).toBeInTheDocument();
    expect(within(header).getByText(content.nav.batch)).toBeInTheDocument();
  });

  it('puts exactly the eight blocks, in PRD order, inside <main id="main">', () => {
    const main = screen.getByRole('main');
    expect(main.id).toBe('main');
    expect(Array.from(main.querySelectorAll('section')).map((element) => element.id)).toEqual(SECTION_IDS);
  });

  it('has exactly one h1: the two hero title lines, each in its own span, read as one sentence', () => {
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.id).toBe('hero-heading');
    const spanTexts = Array.from(h1.querySelectorAll('span')).map((span) => normalize(span.textContent));
    for (const line of content.hero.titleLines) expect(spanTexts).toContain(line);
    expect(h1).toHaveAccessibleName(content.hero.titleLines.join(' '));
  });

  it.each(SECTION_IDS)('labels #%s by its own heading (h1 for the hero, h2 for every other block)', (id) => {
    const expectedName: Record<string, string> = {
      hero: content.hero.titleLines.join(' '),
      'what-riffi-is': content.whatRiffiIs.heading,
      'video-takes': content.videoTakes.heading,
      'why-here': content.whyHere.heading,
      'how-you-earn': content.howYouEarn.heading,
      'long-game': content.longGame.heading,
      seats: content.seats.heading,
      faq: content.faq.heading,
      close: content.close.heading,
    };
    const block = section(id);
    const heading = document.getElementById(`${id}-heading`);
    expect(block.getAttribute('aria-labelledby')).toBe(`${id}-heading`);
    expect(heading).not.toBeNull();
    expect(block.contains(heading)).toBe(true);
    expect(heading?.tagName).toBe(id === 'hero' ? 'H1' : 'H2');
    expect(block).toHaveAccessibleName(expectedName[id] ?? '(no expected name)');
  });
});

// ---------- block 1: hero ----------

describe('#hero (PRD Block 1)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('shows the subline', () => {
    expect(within(section('hero')).getByText(content.hero.subline)).toBeInTheDocument();
  });

  it('shows the sample take card: its chip, the take, and 71% / agree / 29% / disagree once each as readable text', () => {
    const card = only(section('hero'), 'article');
    expect(within(card).getByText(content.hero.sampleTake.chip)).toBeInTheDocument();
    expect(within(card).getByText(content.hero.sampleTake.text)).toBeInTheDocument();
    for (const text of ['71%', '29%', 'agree', 'disagree']) {
      const found = within(card).getAllByText(text);
      expect(found, text).toHaveLength(1);
      expect(hiddenFromScreenReaders(found[0] as HTMLElement), `"${text}" is hidden from screen readers`).toBe(false);
    }
  });

  it('shows the vote count once in the whole page, exactly "2,140 votes", inside the card', () => {
    const counts = screen.getAllByText('2,140 votes');
    expect(counts).toHaveLength(1);
    expect(only(section('hero'), 'article').contains(counts[0] ?? null)).toBe(true);
  });

  it('keeps take cards for takes only: the hero card is the only <article> outside the marquee', () => {
    const outsideMarquee = Array.from(document.querySelectorAll('article')).filter(
      (article) => !article.closest('[data-marquee]'),
    );
    expect(outsideMarquee).toHaveLength(1);
    expect(section('hero').contains(outsideMarquee[0] ?? null)).toBe(true);
  });
});

// ---------- the call to action ----------

describe('the call to action (PRD 5.4, design 4)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('has exactly three "Claim a seat" links: one in #hero, one in #seats, then one in #close (added to #seats so the ask and the button share a screen on a laptop)', () => {
    const links = screen.getAllByRole('link', { name: content.cta.label });
    expect(links).toHaveLength(3);
    expect(section('hero').contains(links[0] ?? null)).toBe(true);
    expect(section('seats').contains(links[1] ?? null)).toBe(true);
    expect(section('close').contains(links[2] ?? null)).toBe(true);
  });

  it('makes each one a plain <a> to the Instagram DM, opening in a new tab with noopener noreferrer', () => {
    for (const link of screen.getAllByRole('link', { name: content.cta.label })) {
      expect(link.tagName).toBe('A');
      expect(link.getAttribute('href')).toBe(ctaHref);
      expect(link.getAttribute('target')).toBe('_blank');
      expect((link.getAttribute('rel') ?? '').split(/\s+/).filter(Boolean).sort()).toEqual(['noopener', 'noreferrer']);
    }
    expect(screen.queryAllByRole('button', { name: content.cta.label })).toEqual([]);
  });

  it('has no other Instagram DM link anywhere on the page', () => {
    expect(document.querySelectorAll('a[href*="ig.me"]')).toHaveLength(3);
  });

  it.each(['hero', 'seats', 'close'])('shows the helper line in #%s, naming the same handle its link opens', (id) => {
    const block = section(id);
    const helper = within(block).getByText(content.cta.helper);
    const link = within(block).getByRole('link', { name: content.cta.label });
    const shownHandle = /@([A-Za-z0-9._]+)$/.exec(normalize(helper.textContent))?.[1];
    const linkedHandle = /^https:\/\/ig\.me\/m\/([^/?#]+)$/.exec(link.getAttribute('href') ?? '')?.[1];
    expect(shownHandle).toBe(settings.instagramHandle);
    expect(linkedHandle).toBe(settings.instagramHandle);
  });

  it('has no WhatsApp link or label while the fallback is off (the default)', () => {
    expect(settings.whatsapp.enabled).toBe(false);
    expect(document.querySelectorAll('a[href*="wa.me"]')).toHaveLength(0);
    expect(document.body.innerHTML).not.toContain('wa.me');
    expect(screen.queryByText(content.cta.whatsappLabel)).toBeNull();
  });

  it('never uses a <form>', () => {
    expect(document.querySelector('form')).toBeNull();
  });
});

// ---------- block 2: what Riffi is ----------

describe('#what-riffi-is (PRD Block 2)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('shows the lead', () => {
    expect(within(section('what-riffi-is')).getByText(content.whatRiffiIs.lead)).toBeInTheDocument();
  });

  it('keeps each side of the contrast pair together: chip, text and caption, never mixed with the other side', () => {
    const block = within(section('what-riffi-is'));
    const { notTake, take } = content.whatRiffiIs;
    for (const [side, other] of [
      [notTake, take],
      [take, notTake],
    ] as const) {
      const group = commonAncestor(block.getByText(side.chip), block.getByText(side.text));
      expect(group.contains(block.getByText(side.caption))).toBe(true);
      expect(group.contains(block.getByText(other.text))).toBe(false);
    }
  });

  it('lists the ten categories as a real list, in order', () => {
    const lists = Array.from(section('what-riffi-is').querySelectorAll('ul')).map((list) =>
      Array.from(list.children)
        .filter((child) => child.tagName === 'LI')
        .map((item) => normalize(item.textContent)),
    );
    expect(lists).toContainEqual([...content.whatRiffiIs.categories]);
  });

  it('hides the moving marquee from screen readers and keeps anything focusable out of it', () => {
    const marquee = only(section('what-riffi-is'), '[data-marquee]');
    expect(marquee.getAttribute('aria-hidden')).toBe('true');
    expect(marquee.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')).toHaveLength(0);
  });

  it('labels every marquee card "sample take", and every card carries one of the eight takes', () => {
    const cards = Array.from(only(section('what-riffi-is'), '[data-marquee]').querySelectorAll<HTMLElement>('article'));
    const takes = content.whatRiffiIs.marqueeTakes;
    expect(cards.length).toBeGreaterThanOrEqual(takes.length);
    for (const card of cards) {
      expect(within(card).getAllByText(content.whatRiffiIs.marqueeChip)).toHaveLength(1);
      expect(takes.some((take) => normalize(card.textContent).includes(take))).toBe(true);
    }
    for (const take of takes) {
      expect(cards.some((card) => normalize(card.textContent).includes(take)), take).toBe(true);
    }
  });

  it('gives screen readers the eight takes in a list named "Sample takes", outside the marquee', () => {
    const block = section('what-riffi-is');
    const list = within(block).getByRole('list', { name: content.whatRiffiIs.marqueeLabel });
    expect(list.tagName).toBe('UL');
    expect(only(block, '[data-marquee]').contains(list)).toBe(false);
    expect(within(list).getAllByRole('listitem').map((item) => normalize(item.textContent))).toEqual([
      ...content.whatRiffiIs.marqueeTakes,
    ]);
  });
});

// ---------- video takes: now the block that leads (repositioned 17 Sep 2026) ----------

describe('#video-takes (added 17 Sep 2026, repositioned the same day to lead ahead of #what-riffi-is)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('sits exactly once, directly between #hero and #what-riffi-is', () => {
    expect(document.querySelectorAll('#video-takes')).toHaveLength(1);
    const main = screen.getByRole('main');
    const ids = Array.from(main.querySelectorAll('section')).map((element) => element.id);
    const at = ids.indexOf('video-takes');
    expect(at).toBeGreaterThan(-1);
    expect(ids[at - 1]).toBe('hero');
    expect(ids[at + 1]).toBe('what-riffi-is');
  });

  it('shows its own heading, lead, badge and footer line', () => {
    const block = section('video-takes');
    expect(within(block).getByRole('heading', { level: 2, name: content.videoTakes.heading })).toBeInTheDocument();
    expect(within(block).getByText(content.videoTakes.lead)).toBeInTheDocument();
    expect(within(block).getByText(content.videoTakes.badge)).toBeInTheDocument();
    expect(within(block).getByText(content.videoTakes.footer)).toBeInTheDocument();
  });

  it('shows the three items as a real list, each with its take text, its length, and a sample label reachable outside the hidden frame', () => {
    const block = section('video-takes');
    const cards = Array.from(only(block, 'ul').children) as HTMLElement[];
    expect(cards).toHaveLength(content.videoTakes.items.length);
    content.videoTakes.items.forEach((item, index) => {
      const card = within(cards[index] as HTMLElement);
      expect(card.getByText(item.text)).toBeInTheDocument();
      expect(card.getByText(item.length)).toBeInTheDocument();
      // The frame's own "sample" pill is decorative (aria-hidden); a reachable one must exist too.
      const reachableSample = card
        .getAllByText(content.videoTakes.chip)
        .filter((element) => !hiddenFromScreenReaders(element));
      expect(reachableSample.length).toBeGreaterThan(0);
    });
  });

  it('keeps every card frame decorative and hidden from screen readers, including the play mark', () => {
    const block = section('video-takes');
    const frames = Array.from(block.querySelectorAll<HTMLElement>('.video-frame'));
    expect(frames.length).toBe(content.videoTakes.items.length);
    for (const frame of frames) expect(frame.getAttribute('aria-hidden')).toBe('true');
    const icons = Array.from(block.querySelectorAll('svg'));
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) expect(hiddenFromScreenReaders(icon)).toBe(true);
  });

  it('has no interactive element in the deck, so nothing can be tapped to play', () => {
    const deck = only(section('video-takes'), 'ul');
    expect(
      deck.querySelectorAll('a[href], button, [role="button"], input, select, textarea, [tabindex]'),
    ).toHaveLength(0);
  });

  it('is a picture of the format only: no <video>, <iframe>, <source> or <img> anywhere on the page', () => {
    expect(document.querySelectorAll('video, iframe, source, img')).toHaveLength(0);
    // Same principle, a bit further: none of the page's other file-loading elements either.
    expect(document.querySelectorAll('embed, object, picture, audio, track')).toHaveLength(0);
  });

  it('carries no file reference on any element in the block: no src/href/poster/srcset attribute and no url() in an inline style', () => {
    const block = section('video-takes');
    const FILE_LIKE =
      /\.(?:mp4|webm|mov|m4v|ogg|ogv|jpe?g|png|gif|webp|avif|svg|bmp|ico)(?:[?#]|$)|^(?:https?:)?\/\/|^data:|^blob:/i;
    const MEDIA_ATTRS = ['src', 'href', 'poster', 'srcset', 'data-src', 'data-poster', 'background'];
    for (const element of [block, ...Array.from(block.querySelectorAll<HTMLElement>('*'))]) {
      for (const attr of MEDIA_ATTRS) {
        expect(element.hasAttribute(attr), `<${element.tagName.toLowerCase()}> has a "${attr}" attribute`).toBe(
          false,
        );
      }
      expect(element.getAttribute('style') ?? '').not.toMatch(/url\(/i);
      for (const attribute of Array.from(element.attributes)) {
        expect(
          FILE_LIKE.test(attribute.value),
          `<${element.tagName.toLowerCase()} ${attribute.name}="${attribute.value}">`,
        ).toBe(false);
      }
    }
  });

  it('draws every video-takes rule in the stylesheet from colour tokens only, never a background file', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');
    const videoRules = [...css.matchAll(/\.video-[a-z-]+(?:\[[^\]]*\])?[^{]*\{[^}]*\}/g)].map((match) => match[0]);
    expect(videoRules.length).toBeGreaterThan(0);
    for (const rule of videoRules) expect(rule).not.toMatch(/url\(/i);
  });
});

// ---------- block 3: why here, not there ----------

describe('#why-here (PRD Block 3)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it.each(content.whyHere.rows)('shows the row "$label" as readable text: its label, then both sides with their values', (row) => {
    const block = within(section('why-here'));
    const label = block.getByText(row.label);
    const instagramValue = block.getByText(row.instagram);
    const riffiValue = block.getByText(row.riffi);
    expect(label.tagName).toBe('P');
    expect(comesBefore(label, instagramValue) && comesBefore(label, riffiValue)).toBe(true);
    const rowElement = commonAncestor(label, riffiValue);
    expect(rowElement.contains(instagramValue)).toBe(true);
    expect(within(rowElement).getAllByText(content.whyHere.instagramLabel)).toHaveLength(1);
    expect(within(rowElement).getAllByText(content.whyHere.riffiLabel)).toHaveLength(1);
    for (const other of content.whyHere.rows.filter((candidate) => candidate.label !== row.label)) {
      expect(normalize(rowElement.textContent)).not.toContain(other.label);
    }
    const sideLabels = [
      within(rowElement).getByText(content.whyHere.instagramLabel),
      within(rowElement).getByText(content.whyHere.riffiLabel),
    ];
    for (const element of [label, instagramValue, riffiValue, ...sideLabels]) {
      expect(hiddenFromScreenReaders(element)).toBe(false);
    }
  });

  it('sets the closer apart as its own paragraph, not inside a card or a list', () => {
    const closer = within(section('why-here')).getByText(content.whyHere.closer);
    expect(closer.closest('p')).not.toBeNull();
    expect(closer.closest('article, li')).toBeNull();
  });

  it('shows no percentages, so the illustrative splits never read as measurements', () => {
    expect(readableText(section('why-here'))).not.toMatch(/\d\s*%/);
  });
});

// ---------- block 4: how you earn ----------

describe('#how-you-earn (PRD Block 4)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('shows the lead (17 Sep 2026: a feature list, not an earnings pitch)', () => {
    expect(within(section('how-you-earn')).getByText(content.howYouEarn.lead)).toBeInTheDocument();
  });

  it('lists the five earn rows as a real list, each with its action and description, and renders no "points" pill (16 Sep 2026: points removed)', () => {
    const items = Array.from(only(section('how-you-earn'), 'ul').children) as HTMLElement[];
    expect(items.map((item) => item.tagName)).toEqual(['LI', 'LI', 'LI', 'LI', 'LI']);
    content.howYouEarn.rows.forEach((row, index) => {
      const item = within(items[index] as HTMLElement);
      expect(item.getByText(row.action)).toBeInTheDocument();
      expect(item.getByText(row.description)).toBeInTheDocument();
    });
    expect(within(section('how-you-earn')).queryByText('points')).toBeNull();
  });

  it('puts the honest note after the list, outside it', () => {
    const block = section('how-you-earn');
    const list = only(block, 'ul');
    const note = within(block).getByText(content.howYouEarn.note);
    expect(list.contains(note)).toBe(false);
    expect(comesBefore(list, note)).toBe(true);
  });
});

// ---------- block 5: the long game ----------

describe('#long-game (PRD Block 5)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('gives its h2 one accessible name for the whole sentence, even though the marker sweep splits it into two spans (17 Sep 2026: headingMark/headingRest)', () => {
    const heading = only(section('long-game'), 'h2');
    expect(heading).toHaveAccessibleName(content.longGame.heading);
  });

  it('shows the three items as h3 titles, each followed by its own body, then the framing line', () => {
    const block = section('long-game');
    const titles = Array.from(block.querySelectorAll('h3'));
    expect(titles.map((title) => normalize(title.textContent))).toEqual(content.longGame.items.map((item) => item.title));
    const bodies = content.longGame.items.map((item) => {
      const found = byFullText(block, item.body);
      expect(found, item.title).toHaveLength(1);
      return found[0] as HTMLElement;
    });
    bodies.forEach((body, index) => {
      expect(comesBefore(titles[index] as HTMLElement, body)).toBe(true);
    });
    bodies.slice(0, -1).forEach((body, index) => {
      expect(comesBefore(body, titles[index + 1] as HTMLElement)).toBe(true);
    });
    const framing = byFullText(block, content.longGame.framing);
    expect(framing).toHaveLength(1);
    expect((framing[0] as HTMLElement).closest('p')).not.toBeNull();
    expect(comesBefore(bodies[bodies.length - 1] as HTMLElement, framing[0] as HTMLElement)).toBe(true);
  });
});

// ---------- block 6: 50 seats ----------

const meterIn = (container: ParentNode): HTMLElement => only(container, '[data-seat-meter]');
const digitsIn = (text: string): string[] => text.match(/\d+/g) ?? [];

describe('#seats and the seat meter (PRD Block 6, design 5)', () => {
  it('shows the big 50 as decoration, then the heading, the body and a seat meter', () => {
    render(<App />);
    const block = section('seats');
    const bigNumbers = Array.from(block.querySelectorAll('p[aria-hidden="true"]')).filter(
      (element) => normalize(element.textContent) === String(settings.seats.total),
    );
    expect(bigNumbers).toHaveLength(1);
    expect(within(block).getByRole('heading', { level: 2, name: content.seats.heading })).toBeInTheDocument();
    expect(within(block).getByText(content.seats.body)).toBeInTheDocument();
    expect(meterIn(block)).toBeInTheDocument();
  });

  it('with the default settings, shows only "50 seats in batch one" in the meter and no seat count anywhere', () => {
    expect(settings.seats).toEqual({ total: 50, taken: null, show: false });
    render(<App />);
    const meter = meterIn(section('seats'));
    expect(normalize(meter.textContent)).toBe(content.seats.meterLabel);
    const allowedDigits = digitsIn(content.seats.meterLabel);
    expect(digitsIn(readableText(meter)).filter((digits) => !allowedDigits.includes(digits))).toEqual([]);
    expect(readableText(document.body)).not.toMatch(SEAT_COUNT);
  });

  it.each([
    { taken: null, show: false, when: 'taken is null and show is false' },
    { taken: 37, show: false, when: 'a real count exists but show is false' },
    { taken: null, show: true, when: 'show is true but taken is null' },
  ])('shows only the meter label, and no count, when $when', ({ taken, show }) => {
    render(<Seats seats={{ total: 50, taken, show }} />);
    const block = section('seats');
    expect(normalize(meterIn(block).textContent)).toBe(content.seats.meterLabel);
    const allowedDigits = digitsIn(content.seats.meterLabel);
    expect(digitsIn(readableText(meterIn(block))).filter((digits) => !allowedDigits.includes(digits))).toEqual([]);
    expect(readableText(block)).not.toContain('37');
    expect(readableText(block)).not.toMatch(SEAT_COUNT);
  });

  it.each([37, 0])('shows the real count (%i) once show is true and taken is a number', (taken) => {
    render(<Seats seats={{ total: 50, taken, show: true }} />);
    const meterText = normalize(meterIn(section('seats')).textContent);
    expect(meterText).toContain(normalize(content.seats.takenLabel(taken, 50)));
    expect(meterText).toContain(String(taken));
  });
});

// ---------- block 7: FAQ ----------

describe('#faq (PRD Block 7)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('is six native <details>: the question in the <summary>, the answer as a <p> in the same <details>', () => {
    const allDetails = Array.from(section('faq').querySelectorAll<HTMLElement>('details'));
    expect(allDetails).toHaveLength(6);
    content.faq.items.forEach((item, index) => {
      const details = allDetails[index] as HTMLElement;
      const summary = only(details, 'summary');
      expect(normalize(summary.textContent)).toBe(item.question);
      for (const icon of Array.from(summary.querySelectorAll('svg'))) {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
      }
      const answer = within(details).getByText(item.answer);
      expect(answer.tagName).toBe('P');
      expect(summary.contains(answer)).toBe(false);
    });
  });

  it('opens only the first question by default', () => {
    const open = Array.from(section('faq').querySelectorAll('details')).map((details) => details.hasAttribute('open'));
    expect(open).toEqual([true, false, false, false, false, false]);
  });
});

// ---------- block 8: close, and the footer ----------

describe('#close (PRD Block 8)', () => {
  it('shows its heading, body and a CTA', () => {
    render(<App />);
    const block = within(section('close'));
    expect(block.getByRole('heading', { level: 2, name: content.close.heading })).toBeInTheDocument();
    expect(block.getByText(content.close.body)).toBeInTheDocument();
    expect(block.getByRole('link', { name: content.cta.label })).toBeInTheDocument();
  });
});

type ContentModule = typeof import('../src/content');

/** Renders a freshly imported App against the content module with some values swapped. No file changes. */
async function renderAppWith(swap: (actual: ContentModule) => Partial<ContentModule>): Promise<void> {
  vi.resetModules();
  vi.doMock('../src/content', async (importOriginal) => {
    const actual = await importOriginal<ContentModule>();
    return { ...actual, ...swap(actual) };
  });
  const { default: FreshApp } = await import('../src/App');
  render(<FreshApp />);
}

function pageFooter(): HTMLElement {
  const footers = Array.from(document.querySelectorAll<HTMLElement>('footer')).filter((el) => !el.closest('main'));
  if (footers.length !== 1) throw new Error(`expected one page footer, found ${footers.length}`);
  return footers[0] as HTMLElement;
}

describe('the footer (PRD Block 8, open input 4)', () => {
  afterEach(() => {
    vi.doUnmock('../src/content');
    vi.resetModules();
  });

  it('shows only the wordmark while the footer line is empty', async () => {
    await renderAppWith((actual) => ({
      content: { ...actual.content, close: { ...actual.content.close, footerLine: '' } },
    }));
    expect(normalize(pageFooter().textContent)).toBe(content.nav.wordmark);
  });

  it('shows the footer line beside the wordmark once it is filled in', async () => {
    const line = 'Made for creators across India';
    await renderAppWith((actual) => ({
      content: { ...actual.content, close: { ...actual.content.close, footerLine: line } },
    }));
    const footer = within(pageFooter());
    expect(footer.getByText(content.nav.wordmark)).toBeInTheDocument();
    expect(footer.getByText(line)).toBeInTheDocument();
  });
});

describe('the WhatsApp fallback once it is switched on', () => {
  afterEach(() => {
    vi.doUnmock('../src/content');
    vi.resetModules();
  });

  it('adds "Or message us on WhatsApp" links to wa.me that open safely in a new tab, and keeps all three CTAs', async () => {
    await renderAppWith((actual) => ({
      settings: { ...actual.settings, whatsapp: { enabled: true, number: '919800000000', message: "Hi, I'm in" } },
    }));
    const links = screen.getAllByRole('link', { name: 'Or message us on WhatsApp' });
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.getAttribute('href')).toBe("https://wa.me/919800000000?text=Hi%2C%20I'm%20in");
      expect(link.getAttribute('target')).toBe('_blank');
      expect((link.getAttribute('rel') ?? '').split(/\s+/).filter(Boolean).sort()).toEqual(['noopener', 'noreferrer']);
    }
    expect(screen.getAllByRole('link', { name: content.cta.label })).toHaveLength(3);
  });
});

// ---------- honesty on the rendered page ----------

describe('honesty on the rendered page (PRD 2.4, design 5)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('never shows a number next to "points" or "pts", in text or accessible attributes', () => {
    expect(readableText(document.body)).not.toMatch(NUMBER_NEXT_TO_POINTS);
  });

  it('shows no digits anywhere in #how-you-earn, so no point value can appear there', () => {
    expect(readableText(section('how-you-earn'))).not.toMatch(/\d/);
  });

  it('shows no rupee or currency figure anywhere on the rendered page (17 Sep 2026: no payout number is named)', () => {
    expect(readableText(document.body)).not.toMatch(MONEY);
  });

  it('would still require example framing on any rendered sentence naming a payout figure, if one is ever reintroduced', () => {
    // Today moneyBlocks is empty - the guardrail above is what keeps it that way. This test's job
    // is to keep guarding sentence-level framing if a figure is ever rendered again regardless.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const moneyBlocks: Element[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || !MONEY.test(node.textContent ?? '')) continue;
      moneyBlocks.push(parent.closest('p, li, dd, td, blockquote, figcaption, h1, h2, h3, h4, h5, h6') ?? parent);
    }
    for (const block of moneyBlocks) {
      const moneySentences = sentencesOf(normalize(block.textContent)).filter((sentence) => MONEY.test(sentence));
      for (const sentence of moneySentences) expect(sentence).toMatch(EXAMPLE_FRAMING);
    }
  });

  it('frames the long game, and the answer to "Is this paid right now?", as "plan, not a contract"', () => {
    const framing = byFullText(section('long-game'), content.longGame.framing);
    expect(normalize(framing[0]?.textContent)).toContain('plan, not a contract');
    const paid = Array.from(section('faq').querySelectorAll('details')).find(
      (details) => normalize(details.querySelector('summary')?.textContent) === 'Is this paid right now?',
    );
    expect(normalize(paid?.textContent)).toContain('plan, not a contract');
  });

  it('labels every sample take a sample: the hero card, every marquee card, the hidden list, and every video-takes card', () => {
    expect(within(only(section('hero'), 'article')).getByText('sample take')).toBeInTheDocument();
    const cards = Array.from(only(section('what-riffi-is'), '[data-marquee]').querySelectorAll<HTMLElement>('article'));
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) expect(within(card).getByText('sample take')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Sample takes' })).toBeInTheDocument();

    // Each video-takes card labels itself "sample" for screen readers too, not only inside the
    // aria-hidden frame (the frame's own pill is decorative).
    const videoCards = Array.from(only(section('video-takes'), 'ul').children) as HTMLElement[];
    expect(videoCards).toHaveLength(content.videoTakes.items.length);
    for (const card of videoCards) {
      const reachableSample = within(card)
        .getAllByText(content.videoTakes.chip)
        .filter((element) => !hiddenFromScreenReaders(element));
      expect(reachableSample.length).toBeGreaterThan(0);
    }
  });

  it('uses no countdown, deadline or urgency language, and no timer', () => {
    expect(readableText(document.body)).not.toMatch(URGENCY);
    expect(document.querySelectorAll('[role="timer"]')).toHaveLength(0);
  });

  it('never shows the old spelling "Rifii", in text or attributes', () => {
    expect(document.body.innerHTML).not.toMatch(/rifii/i);
  });

  it('never shows a [FILL marker to a creator', () => {
    expect(document.body.innerHTML).not.toMatch(/\[\s*FILL\b/i);
  });
});

// ---------- before any JavaScript runs ----------

describe('the pre-rendered HTML, before any JavaScript runs (design 2 and 3)', () => {
  it('already holds the headline, all three CTAs as plain links, the final vote count, the meter label and the first FAQ open', () => {
    const doc = new DOMParser().parseFromString(renderToString(<App />), 'text/html');
    const h1s = doc.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    const spanTexts = Array.from(h1s[0]?.querySelectorAll('span') ?? []).map((span) => normalize(span.textContent));
    for (const line of content.hero.titleLines) expect(spanTexts).toContain(line);
    const ctas = Array.from(doc.querySelectorAll('a')).filter((link) => normalize(link.textContent) === content.cta.label);
    expect(ctas.map((link) => link.getAttribute('href'))).toEqual([ctaHref, ctaHref, ctaHref]);
    expect(byFullText(doc.body, '2,140 votes')).toHaveLength(1);
    expect(normalize(doc.querySelector('[data-seat-meter]')?.textContent)).toBe(content.seats.meterLabel);
    expect(Array.from(doc.querySelectorAll('details')).map((details) => details.hasAttribute('open'))).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
    ]);
  });
});
