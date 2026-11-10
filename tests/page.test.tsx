// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { TRAP_FIELD, cleanUsername } from '../src/components/blocks/Join';
import { content, settings } from '../src/content';
import { ctaHref, formAction, formFields } from '../src/lib/cta';
import { EXAMPLE_FRAMING, MONEY, NUMBER_NEXT_TO_POINTS, SEAT_COUNT, URGENCY, sentencesOf } from './honesty-rules';

// ---------- helpers ----------

const normalize = (text: string | null | undefined): string => (text ?? '').replace(/\s+/g, ' ').trim();

// Order since 2 Nov 2026: the page was cut down for onboarded creators - the recruiting blocks
// (reels deck, what a take is, the Instagram comparison, the earn list, the long game) are gone.
const SECTION_IDS = [
  'hero',
  'badge',
  'perks',
  'join',
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

  it('puts exactly the six blocks, in order, inside <main id="main">', () => {
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
      badge: content.badge.heading,
      perks: content.perks.heading,
      join: content.join.heading,
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

  it('has exactly two "Send your details" links: one in #hero, then one in #close', () => {
    const links = screen.getAllByRole('link', { name: content.cta.label });
    expect(links).toHaveLength(2);
    expect(section('hero').contains(links[0] ?? null)).toBe(true);
    expect(section('close').contains(links[1] ?? null)).toBe(true);
  });

  it('makes each one a plain in-page <a> that jumps to the form, with no new tab', () => {
    for (const link of screen.getAllByRole('link', { name: content.cta.label })) {
      expect(link.tagName).toBe('A');
      expect(link.getAttribute('href')).toBe('#join');
      expect(link.getAttribute('href')).toBe(ctaHref);
      expect(link.getAttribute('target')).toBeNull();
    }
    expect(document.getElementById('join')).not.toBeNull();
    expect(screen.queryAllByRole('button', { name: content.cta.label })).toEqual([]);
  });

  // 2 Nov 2026: the conversion is the page's own form. No Instagram DM link and no outbound link
  // is left on the page: every link jumps within it.
  it('has no Instagram DM link anywhere on the page', () => {
    expect(document.querySelectorAll('a[href*="ig.me"]')).toHaveLength(0);
  });

  it('sends every link on the page to the form on the same page, and nowhere else', () => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
    expect(links.length).toBe(2);
    for (const link of links) expect(link.getAttribute('href')).toBe('#join');
  });

  it.each(['hero', 'close'])(
    'shows the helper line in #%s, naming no account, next to the link that leads to the form',
    (id) => {
      const block = section(id);
      const helper = within(block).getByText(content.cta.helper);
      const link = within(block).getByRole('link', { name: content.cta.label });
      expect(normalize(helper.textContent)).toBe('About a minute.');
      expect(normalize(helper.textContent)).not.toContain('@');
      expect(link.getAttribute('href')).toBe('#join');
    },
  );

  it('has no WhatsApp link or label while the fallback is off (the default)', () => {
    expect(settings.whatsapp.enabled).toBe(false);
    expect(document.querySelectorAll('a[href*="wa.me"]')).toHaveLength(0);
    expect(document.body.innerHTML).not.toContain('wa.me');
    expect(screen.queryByText(content.cta.whatsappLabel)).toBeNull();
  });

  it('has exactly one <form>, and it posts only to the founder\'s Google Form', () => {
    const forms = document.querySelectorAll('form');
    expect(forms).toHaveLength(1);
    expect(forms[0]?.getAttribute('action')).toBe(settings.form.responseUrl);
    expect(forms[0]?.getAttribute('action')).toBe(formAction);
    expect(forms[0]?.getAttribute('method')?.toLowerCase()).toBe('post');
  });
});

// ---------- the badge ----------

describe('#badge: the Founding Creator badge, shown clearly', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('shows the heading, the lead and one clear image from this site', () => {
    const block = within(section('badge'));
    expect(block.getByRole('heading', { level: 2, name: content.badge.heading })).toBeInTheDocument();
    expect(block.getByText(content.badge.lead)).toBeInTheDocument();
    const image = block.getByRole('img', { name: content.badge.alt });
    expect(image.getAttribute('src')).toBe(content.badge.image);
    expect(image.getAttribute('src')).not.toMatch(/^(?:https?:)?\/\//);
    expect(image.getAttribute('width')).toBe('400');
    expect(image.getAttribute('height')).toBe('400');
    expect(image.getAttribute('loading')).toBe('lazy');
    // Clear means clear: no blur or fade is applied to it in code.
    expect(image.getAttribute('style')).toBeNull();
  });

  it('names no perk, number or date in the section', () => {
    const text = readableText(section('badge'));
    expect(text).not.toMatch(/\d/);
    expect(text).not.toMatch(/perk|reward|voucher|points?\b|worth|rare|limited/i);
  });

  it('shows the badge again, small and decorative, beside the form, with a note that says it in words', () => {
    const form = section('join');
    const small = form.querySelector('img');
    expect(small).not.toBeNull();
    expect(small?.getAttribute('src')).toBe(content.badge.image);
    expect(small?.getAttribute('alt')).toBe('');
    expect(within(form).getByText(content.join.badgeNote)).toBeInTheDocument();
  });

  it('is the only image on the page, used twice, and always from this site', () => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
    expect(images).toHaveLength(2);
    for (const image of images) {
      expect(image.getAttribute('src')).toBe(content.badge.image);
      expect(image.getAttribute('loading')).toBe('lazy');
    }
    expect(document.querySelectorAll('video, iframe, source, embed, object, picture, audio, track')).toHaveLength(0);
  });
});

// ---------- what is waiting for them ----------

describe('#perks: what is waiting for creators who came in early (2 Nov 2026)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('shows the heading, the lead, the framing line and every perk with when it comes', () => {
    const block = section('perks');
    expect(within(block).getByRole('heading', { level: 2, name: content.perks.heading })).toBeInTheDocument();
    expect(within(block).getByText(content.perks.lead)).toBeInTheDocument();
    expect(within(block).getByText(content.perks.framing)).toBeInTheDocument();
    const items = Array.from(only(block, 'ul').children) as HTMLElement[];
    expect(items).toHaveLength(content.perks.items.length);
    content.perks.items.forEach((perk, index) => {
      const item = within(items[index] as HTMLElement);
      expect(items[index]?.tagName).toBe('LI');
      expect(item.getByText(perk.label)).toBeInTheDocument();
      expect(item.getByText(perk.when)).toBeInTheDocument();
    });
  });

  it('says plainly that the later perks are a plan, and that the page has no number, date or money in it', () => {
    const text = readableText(section('perks'));
    expect(text).toContain('plan, not a contract');
    expect(text).not.toMatch(/\d/);
    expect(text).not.toMatch(MONEY);
    expect(text).not.toMatch(URGENCY);
    expect(text).not.toMatch(NUMBER_NEXT_TO_POINTS);
  });

  it('never calls anything "Live", because Riffi has not launched', () => {
    expect(readableText(section('perks'))).not.toMatch(/\blive\b/i);
  });

  it('shows no seat count or countdown anywhere on the page', () => {
    expect(readableText(document.body)).not.toMatch(SEAT_COUNT);
    expect(document.querySelectorAll('[role="timer"]')).toHaveLength(0);
  });
});

// ---------- the details form ----------

describe('#join: the details form', () => {
  const fieldKeys = ['name', 'email', 'phone', 'handle', 'username'] as const;

  // A valid value for every field: the form now refuses an invalid email (the browser's own check).
  const valueFor = (key: (typeof fieldKeys)[number]): string =>
    key === 'email' ? 'creator@example.com' : `value-${key}`;

  const consentBox = (): HTMLInputElement => screen.getByLabelText(content.join.consent) as HTMLInputElement;

  /** Fills the five fields, and ticks the permission box unless told not to. */
  function fill(value: (key: (typeof fieldKeys)[number]) => string, options: { consent?: boolean } = {}) {
    for (const key of fieldKeys) {
      fireEvent.change(screen.getByLabelText(content.join.fields[key].label), { target: { value: value(key) } });
    }
    if (options.consent !== false) fireEvent.click(consentBox());
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks for exactly the five details, each required and wired to its Google Form entry id', () => {
    render(<App />);
    const form = within(section('join'));
    for (const key of fieldKeys) {
      const input = form.getByLabelText(content.join.fields[key].label) as HTMLInputElement;
      expect(input.name).toBe(formFields[key]);
      expect(input.type).toBe(content.join.fields[key].type);
      expect(input.required).toBe(true);
    }
    // Five text fields, plus the permission tick box (checked separately below).
    expect(section('join').querySelectorAll('input:not([type="checkbox"]):not([aria-hidden] input)')).toHaveLength(5);
    expect(form.getByText(content.join.privacy)).toBeInTheDocument();
    expect(form.getByRole('button', { name: content.join.submit })).toBeInTheDocument();
  });

  it('hides a trap field from people and keyboards', () => {
    render(<App />);
    const trap = section('join').querySelector<HTMLInputElement>(`input[name="${TRAP_FIELD}"]`);
    expect(trap).not.toBeNull();
    expect(trap?.tabIndex).toBe(-1);
    expect(trap?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('posts the details to the Google Form without leaving the page, then says thank you', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);
    fill((key) => valueFor(key));
    fireEvent.submit(section('join').querySelector('form') as HTMLFormElement);
    await waitFor(() => expect(screen.getByText(content.join.sentHeading)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(formAction);
    expect(init.method).toBe('POST');
    expect(init.mode).toBe('no-cors');
    const sent = new URLSearchParams(String(init.body));
    for (const key of fieldKeys) expect(sent.get(formFields[key])).toBe(valueFor(key));
    expect(sent.has(TRAP_FIELD)).toBe(false);
    expect(screen.getByText(content.join.sentBody)).toBeInTheDocument();
  });

  // 10 Nov 2026: the permission to show their Instagram content on their Riffi profile. A required tick box,
  // never pre-ticked, that is not posted anywhere; ticking it is what lets Send work.
  it('shows the permission line beside a required tick box that starts unticked', () => {
    render(<App />);
    const box = consentBox();
    expect(box.type).toBe('checkbox');
    expect(box.required).toBe(true);
    expect(box.checked).toBe(false);
    expect(within(section('join')).getByText(content.join.consent)).toBeInTheDocument();
    // The whole line is one label, so tapping the words ticks the box.
    expect(box.closest('label')).toHaveTextContent(content.join.consent);
  });

  it('does not post the tick box anywhere: it has no field name, so it is not in what is sent', () => {
    render(<App />);
    expect(consentBox().getAttribute('name')).toBeNull();
    const form = section('join').querySelector('form') as HTMLFormElement;
    fill((key) => valueFor(key));
    expect([...new FormData(form).keys()].sort()).toEqual([...Object.values(formFields), TRAP_FIELD].sort());
  });

  it('will not let the form be sent until the box is ticked, even with every field filled in', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);
    fill((key) => valueFor(key), { consent: false });
    const form = section('join').querySelector('form') as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    fireEvent.submit(form);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText(content.join.sentHeading)).toBeNull();
    fireEvent.click(consentBox());
    expect(form.checkValidity()).toBe(true);
    fireEvent.submit(form);
    await waitFor(() => expect(screen.getByText(content.join.sentHeading)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('names its bot trap something browser autofill does not know, so a real creator can never fill it by accident', () => {
    expect(TRAP_FIELD).not.toMatch(/website|url|site|web|homepage|fax|phone|email|name|address|company|nickname/i);
    expect(Object.values(formFields)).not.toContain(TRAP_FIELD);
  });

  it('brings the thank-you into view and moves focus onto it, so a phone user does not miss it', async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null)));
    render(<App />);
    fill((key) => valueFor(key));
    fireEvent.submit(section('join').querySelector('form') as HTMLFormElement);
    await waitFor(() => expect(screen.getByText(content.join.sentHeading)).toBeInTheDocument());
    const panel = only(section('join'), '[role="status"]');
    expect(document.activeElement).toBe(panel);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    // @ts-expect-error - removes the stand-in so other tests see jsdom's own (missing) method
    delete Element.prototype.scrollIntoView;
  });

  it('reads their own username back to them in the thank-you, without a doubled @', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null)));
    render(<App />);
    fill((key) => (key === 'username' ? '  @@riffi_fan  ' : valueFor(key)));
    fireEvent.submit(section('join').querySelector('form') as HTMLFormElement);
    await waitFor(() => expect(screen.getByText(content.join.sentHeading)).toBeInTheDocument());
    expect(within(section('join')).getByText(content.join.sentHolding('riffi_fan'))).toBeInTheDocument();
    expect(readableText(section('join'))).not.toContain('@@');
  });

  it('shows a hostile username as plain text only, never as markup', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null)));
    render(<App />);
    fill((key) => (key === 'username' ? '<img src=x onerror=alert(1)>' : valueFor(key)));
    fireEvent.submit(section('join').querySelector('form') as HTMLFormElement);
    await waitFor(() => expect(screen.getByText(content.join.sentHeading)).toBeInTheDocument());
    const block = section('join');
    expect(block.querySelectorAll('img')).toHaveLength(1);
    expect(readableText(block)).toContain('<img src=x onerror=alert(1)>');
  });

  it('turns the whole green panel into the thank-you, with the badge swishing in and no form left', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null)));
    render(<App />);
    fill((key) => valueFor(key));
    fireEvent.submit(section('join').querySelector('form') as HTMLFormElement);
    await waitFor(() => expect(screen.getByText(content.join.sentHeading)).toBeInTheDocument());
    const block = section('join');
    expect(block.querySelector('form')).toBeNull();
    expect(block.querySelectorAll('input')).toHaveLength(0);
    // The one coin in the panel carries the swish, is the real badge from this site, and is
    // decorative: the message beside it says everything in words.
    const coin = only(block, 'img');
    expect(coin.className).toContain('coin-swipe');
    expect(coin.getAttribute('src')).toBe(content.badge.image);
    expect(coin.getAttribute('alt')).toBe('');
    expect(only(block, '[role="status"]')).toHaveTextContent(content.join.sentHeading);
    // Apart from their own username read back to them, no email address or handle is named.
    const withoutTheirOwn = readableText(block).replace(content.join.sentHolding('value-username'), '');
    expect(withoutTheirOwn).not.toMatch(/@|\.com/);
  });

  it('says so, keeps what was typed, and lets them try again when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    render(<App />);
    fill((key) => valueFor(key));
    fireEvent.submit(section('join').querySelector('form') as HTMLFormElement);
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(content.join.error));
    expect(screen.queryByText(content.join.sentHeading)).toBeNull();
    expect((screen.getByLabelText(content.join.fields.name.label) as HTMLInputElement).value).toBe('value-name');
    expect(screen.getByRole('button', { name: content.join.submit })).toBeEnabled();
  });

  it('sends nothing when the hidden trap field is filled, but still looks like it worked', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);
    fill((key) => valueFor(key));
    const trap = section('join').querySelector(`input[name="${TRAP_FIELD}"]`) as HTMLInputElement;
    fireEvent.change(trap, { target: { value: 'https://spam.example' } });
    fireEvent.submit(section('join').querySelector('form') as HTMLFormElement);
    await waitFor(() => expect(screen.getByText(content.join.sentHeading)).toBeInTheDocument());
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

// ---------- block 7: FAQ ----------

describe('#faq (PRD Block 7)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('is three native <details>: the question in the <summary>, the answer as a <p> in the same <details>', () => {
    const allDetails = Array.from(section('faq').querySelectorAll<HTMLElement>('details'));
    expect(allDetails).toHaveLength(3);
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
    expect(open).toEqual([true, false, false]);
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

  it('adds "Or message us on WhatsApp" links to wa.me that open safely in a new tab, and keeps both CTAs', async () => {
    await renderAppWith((actual) => ({
      settings: { ...actual.settings, whatsapp: { enabled: true, number: '919800000000', message: "Hi, I'm in" } },
    }));
    const links = screen.getAllByRole('link', { name: 'Or message us on WhatsApp' });
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link.getAttribute('href')).toBe("https://wa.me/919800000000?text=Hi%2C%20I'm%20in");
      expect(link.getAttribute('target')).toBe('_blank');
      expect((link.getAttribute('rel') ?? '').split(/\s+/).filter(Boolean).sort()).toEqual(['noopener', 'noreferrer']);
    }
    expect(screen.getAllByRole('link', { name: content.cta.label })).toHaveLength(2);
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

  it('shows no digits in the pay answer, so no point value or payout figure can appear there', () => {
    const paid = Array.from(section('faq').querySelectorAll('details')).find(
      (details) => normalize(details.querySelector('summary')?.textContent) === 'Is this paid right now?',
    );
    expect(paid).toBeDefined();
    expect(readableText(paid as HTMLElement)).not.toMatch(/\d/);
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

  it('frames the answer to "Is this paid right now?" as "plan, not a contract"', () => {
    const paid = Array.from(section('faq').querySelectorAll('details')).find(
      (details) => normalize(details.querySelector('summary')?.textContent) === 'Is this paid right now?',
    );
    expect(normalize(paid?.textContent)).toContain('plan, not a contract');
  });

  it('labels the one sample take on the page a sample', () => {
    expect(within(only(section('hero'), 'article')).getByText('sample take')).toBeInTheDocument();
    expect(document.querySelectorAll('article')).toHaveLength(1);
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
  it('already holds the headline, both CTAs as plain links, the final vote count, the perks, the form and the first FAQ open', () => {
    const doc = new DOMParser().parseFromString(renderToString(<App />), 'text/html');
    const h1s = doc.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    const spanTexts = Array.from(h1s[0]?.querySelectorAll('span') ?? []).map((span) => normalize(span.textContent));
    for (const line of content.hero.titleLines) expect(spanTexts).toContain(line);
    const ctas = Array.from(doc.querySelectorAll('a')).filter((link) => normalize(link.textContent) === content.cta.label);
    expect(ctas.map((link) => link.getAttribute('href'))).toEqual([ctaHref, ctaHref]);
    expect(byFullText(doc.body, '2,140 votes')).toHaveLength(1);
    expect(normalize(doc.querySelector('#perks li')?.textContent)).toContain(content.perks.items[0]?.label);
    expect(doc.querySelector('form')?.getAttribute('action')).toBe(formAction);
    expect(Array.from(doc.querySelectorAll('details')).map((details) => details.hasAttribute('open'))).toEqual([
      true,
      false,
      false,
    ]);
  });
});

describe('cleanUsername', () => {
  it.each([
    ['riffi', 'riffi'],
    ['@riffi', 'riffi'],
    ['  @@riffi  ', 'riffi'],
    ['@ riffi', 'riffi'],
    ['', ''],
    ['@', ''],
    ['a'.repeat(60), 'a'.repeat(40)],
  ])('turns %j into %j', (raw, expected) => {
    expect(cleanUsername(raw)).toBe(expected);
  });
});
