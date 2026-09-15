import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../src/App';
import { content, settings } from '../src/content';

/** Every string anywhere inside `content`, including inside arrays and nested objects. */
function strings(value: unknown, into: Set<string>): Set<string> {
  if (typeof value === 'string') into.add(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, into));
  else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => strings(item, into));
  }
  return into;
}

describe('where the words come from (PRD 5.2, rule 2)', () => {
  it('renders no text and no accessible label that does not come from content.ts', () => {
    const allowed = strings(content, new Set<string>());
    const { sampleTake } = content.hero;
    // Values the page formats from content and settings rather than copying.
    allowed.add(String(settings.seats.total));
    allowed.add(`${sampleTake.agree.percent}%`);
    allowed.add(`${sampleTake.disagree.percent}%`);
    allowed.add(`${sampleTake.votes.toLocaleString('en-IN')} ${sampleTake.votesLabel}`);

    const { container } = render(<App />);
    const stray: string[] = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent?.trim() ?? '';
      if (text && !allowed.has(text)) stray.push(text);
    }
    for (const element of container.querySelectorAll('[aria-label], [alt], [title], [placeholder]')) {
      for (const name of ['aria-label', 'alt', 'title', 'placeholder']) {
        const value = element.getAttribute(name);
        if (value && !allowed.has(value)) stray.push(`${name}="${value}"`);
      }
    }
    expect(stray).toEqual([]);
  });
});
