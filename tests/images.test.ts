// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function pngSize(file: string): { width: number; height: number } {
  const bytes = readFileSync(file);
  expect(bytes.subarray(1, 4).toString('latin1')).toBe('PNG');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe('the link-preview card and icons (PRD 5.6)', () => {
  it('has a 1200x630 preview card', () => {
    expect(pngSize('public/og.png')).toEqual({ width: 1200, height: 630 });
  });

  it('keeps the preview card light enough to load quickly inside a DM', () => {
    expect(readFileSync('public/og.png').length).toBeLessThan(300_000);
  });

  it('has a 180x180 apple touch icon', () => {
    expect(pngSize('public/apple-touch-icon.png')).toEqual({ width: 180, height: 180 });
  });

  it('has an SVG favicon', () => {
    expect(readFileSync('public/favicon.svg', 'utf8')).toMatch(/^<svg[^>]+viewBox="0 0 32 32"/);
  });
});
