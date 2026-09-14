// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Parsed with the DOM's own HTML parser, so an entity-encoded apostrophe still compares equal.
const raw = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const doc = new DOMParser().parseFromString(raw, 'text/html');
const all = (selector: string): Element[] => Array.from(doc.querySelectorAll(selector));

/** The content attribute of the one and only element matching the selector. */
function onlyContent(selector: string): string | null {
  const found = all(selector);
  expect(found, selector).toHaveLength(1);
  return found[0]?.getAttribute('content') ?? null;
}

describe('index.html: document basics', () => {
  it('starts with <!doctype html> and declares lang="en"', () => {
    // \s also matches a leading byte-order mark, so a BOM-prefixed file still passes.
    expect(raw).toMatch(/^\s*<!doctype html>/i);
    expect(doc.documentElement.getAttribute('lang')).toBe('en');
  });

  it('declares UTF-8 once, within the first 1024 bytes', () => {
    const charsets = all('meta[charset]');
    expect(charsets).toHaveLength(1);
    expect(charsets[0]?.getAttribute('charset')?.toLowerCase()).toBe('utf-8');
    const position = raw.search(/<meta\s+charset/i);
    expect(position).toBeGreaterThanOrEqual(0);
    expect(Buffer.byteLength(raw.slice(0, position), 'utf8')).toBeLessThan(1024);
  });

  it('sets the viewport for phones, including notched screens', () => {
    expect(onlyContent('meta[name="viewport"]')).toBe('width=device-width, initial-scale=1, viewport-fit=cover');
  });
});

describe('index.html: title, description and the link-preview card, exactly as PRD 5.6', () => {
  it('has the title "Riffi Creator Program — 50 seats"', () => {
    expect(all('title')).toHaveLength(1);
    expect(doc.title).toBe('Riffi Creator Program — 50 seats');
  });

  it.each([
    ['meta[name="description"]', "Riffi is India's platform for opinions. We're taking 50 creators in before launch."],
    ['meta[property="og:title"]', "On Instagram you're one of lakhs. Here you're one of 50."],
    ['meta[property="og:description"]', 'The Riffi Creator Program. 50 seats, batch one.'],
    ['meta[property="og:type"]', 'website'],
    ['meta[property="og:image"]', '__SITE_URL__/og.png'],
    ['meta[name="twitter:card"]', 'summary_large_image'],
    ['meta[name="theme-color"]', '#FFFFFF'],
  ])('has exactly one %s with the right content', (selector, expected) => {
    expect(onlyContent(selector)).toBe(expected);
  });

  it('links the SVG favicon and the apple touch icon', () => {
    const icons = all('link[rel="icon"]');
    expect(icons).toHaveLength(1);
    expect(icons[0]?.getAttribute('href')).toBe('/favicon.svg');
    expect(icons[0]?.getAttribute('type')).toBe('image/svg+xml');
    const touchIcons = all('link[rel="apple-touch-icon"]');
    expect(touchIcons).toHaveLength(1);
    expect(touchIcons[0]?.getAttribute('href')).toBe('/apple-touch-icon.png');
  });

  it('never spells the name "Rifii"', () => {
    expect(raw).not.toMatch(/rifii/i);
  });
});

describe('index.html: scripts, the pre-render slot, and what must never be here', () => {
  it('keeps the pre-render slot <div id="root"><!--app-html--></div>', () => {
    expect(raw).toContain('<div id="root"><!--app-html--></div>');
    expect(doc.getElementById('root')?.innerHTML).toBe('<!--app-html-->');
  });

  it('loads the app with exactly one module script, /src/main.tsx', () => {
    const modules = all('script[type="module"]');
    expect(modules).toHaveLength(1);
    expect(modules[0]?.getAttribute('src')).toBe('/src/main.tsx');
  });

  it('has exactly two scripts: that module and one inline, non-module script', () => {
    const scripts = all('script');
    expect(scripts).toHaveLength(2);
    const inline = scripts.filter((script) => !script.hasAttribute('src'));
    expect(inline).toHaveLength(1);
    expect(['', 'text/javascript']).toContain(inline[0]?.getAttribute('type') ?? '');
  });

  it('runs the inline script before the page content, and the script adds the class "js" to <html>', () => {
    const inline = all('script').find((script) => !script.hasAttribute('src'));
    const root = doc.getElementById('root');
    expect(inline).toBeDefined();
    expect(root).not.toBeNull();
    if (!inline || !root) return;
    expect(inline.compareDocumentPosition(root) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    document.documentElement.className = '';
    // Runs the script's own text against this test's document, as the browser would before first paint.
    new Function(inline.textContent ?? '')();
    expect(document.documentElement.classList.contains('js')).toBe(true);
  });

  it('loads nothing from another origin: no external script, stylesheet, font, preload or preconnect', () => {
    const external = /^\s*(?:https?:)?\/\//i;
    const fetching = /\b(?:stylesheet|preload|modulepreload|preconnect|dns-prefetch|prefetch|icon|apple-touch-icon|manifest)\b/i;
    const urls = [
      ...all('script[src]').map((element) => element.getAttribute('src') ?? ''),
      ...all('link[href]')
        .filter((element) => fetching.test(element.getAttribute('rel') ?? ''))
        .map((element) => element.getAttribute('href') ?? ''),
    ];
    expect(urls.filter((url) => external.test(url))).toEqual([]);
    expect(raw).not.toMatch(/@import\s+(?:url\()?\s*['"]?\s*(?:https?:)?\/\//i);
  });

  it('stays indexable: no noindex anywhere', () => {
    expect(raw).not.toMatch(/noindex/i);
  });

  it('has no <form> and no third-party embed', () => {
    expect(all('form, iframe, embed, object')).toEqual([]);
  });
});
