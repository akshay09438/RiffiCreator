// @vitest-environment node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { settings } from '../src/content';

// The headers Vercel sends with every page (2 Nov 2026). A wrong policy fails quietly: the page looks fine
// in development and is broken only on the live site, so these checks pin what the page needs.
type Header = { key: string; value: string };
type Rule = { source: string; headers: Header[] };

const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as { headers: Rule[] };
const rule = (source: string): Rule => {
  const found = config.headers.find((item) => item.source === source);
  if (!found) throw new Error(`vercel.json has no rule for ${source}`);
  return found;
};
const header = (source: string, key: string): string =>
  rule(source).headers.find((item) => item.key === key)?.value ?? '';
const policy = header('/(.*)', 'Content-Security-Policy');
const directive = (name: string): string =>
  policy
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name} `)) ?? '';

describe('vercel.json: the page-wide security policy', () => {
  it('only lets scripts run that come from this site, plus the one inline script by its fingerprint', () => {
    const html = readFileSync('index.html', 'utf8');
    const inline = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1] ?? '');
    expect(inline).toHaveLength(1);
    const fingerprint = `'sha256-${createHash('sha256').update(inline[0] ?? '').digest('base64')}'`;
    expect(directive('script-src')).toBe(`script-src 'self' ${fingerprint}`);
  });

  it('never allows unsafe-eval, and never allows inline scripts without a fingerprint', () => {
    expect(policy).not.toContain("'unsafe-eval'");
    expect(directive('script-src')).not.toContain("'unsafe-inline'");
    expect(directive('default-src')).toBe("default-src 'self'");
  });

  it("lets the page talk to one outside address only: the Google Form it posts to", () => {
    const google = new URL(settings.form.responseUrl).origin;
    expect(google).toBe('https://docs.google.com');
    expect(directive('connect-src')).toBe(`connect-src 'self' ${google}`);
    expect(directive('form-action')).toBe(`form-action ${google}`);
    // Nothing else may be loaded from, or sent to, anywhere outside this site.
    for (const name of ['img-src', 'font-src', 'style-src', 'script-src']) {
      expect(directive(name).replace(/'[^']*'/g, '')).not.toMatch(/https?:/);
    }
  });

  it('stops the page being shown inside another site, and being given a different base address or plug-ins', () => {
    expect(directive('frame-ancestors')).toBe("frame-ancestors 'none'");
    expect(header('/(.*)', 'X-Frame-Options')).toBe('DENY');
    expect(directive('base-uri')).toBe("base-uri 'none'");
    expect(directive('object-src')).toBe("object-src 'none'");
  });

  it('sends the other standard hardening headers', () => {
    expect(header('/(.*)', 'X-Content-Type-Options')).toBe('nosniff');
    expect(header('/(.*)', 'Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    const permissions = header('/(.*)', 'Permissions-Policy');
    for (const feature of ['camera', 'microphone', 'geolocation', 'payment']) {
      expect(permissions).toContain(`${feature}=()`);
    }
  });
});

describe('vercel.json: caching', () => {
  it('caches the fingerprinted files in /assets for a year, never changing', () => {
    expect(header('/assets/(.*)', 'Cache-Control')).toBe('public, max-age=31536000, immutable');
  });

  it("caches /media for a day only, because those file names do not change when the picture does", () => {
    expect(header('/media/(.*)', 'Cache-Control')).toBe('public, max-age=86400');
    expect(header('/media/(.*)', 'Cache-Control')).not.toContain('immutable');
  });

  it('has no redirects, rewrites or other rules than these three header rules', () => {
    expect(Object.keys(JSON.parse(readFileSync('vercel.json', 'utf8')))).toEqual(['headers']);
    expect(config.headers.map((item) => item.source)).toEqual(['/(.*)', '/assets/(.*)', '/media/(.*)']);
  });
});
