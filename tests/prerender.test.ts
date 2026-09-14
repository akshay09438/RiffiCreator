// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { render, siteUrl } from '../src/entry-server';

describe('the pre-rendered page (design option A)', () => {
  it('renders the page landmarks to HTML without a browser', () => {
    const html = render();
    expect(html).toContain('<header');
    expect(html).toContain('<main id="main"');
    expect(html).toContain('<footer');
  });

  it('exposes the site URL the link-preview card needs, as a bare https domain', () => {
    expect(siteUrl).toMatch(/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i);
  });
});
