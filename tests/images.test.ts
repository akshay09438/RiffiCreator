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

  it('has an SVG favicon that wraps the badge picture and loads nothing from elsewhere', () => {
    const svg = readFileSync('public/favicon.svg', 'utf8');
    expect(svg).toMatch(/^<svg[^>]+viewBox="0 0 32 32"/);
    expect(svg).toMatch(/<image[^>]+href="data:image\/png;base64,/);
    // The only address in it is the data: picture and the two XML namespaces.
    const addresses = [...svg.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1] ?? '');
    for (const address of addresses) expect(address.startsWith('data:image/png;base64,')).toBe(true);
    expect(svg).not.toMatch(/<script|onload=|https?:\/\/(?!www\.w3\.org)/i);
    expect(Buffer.byteLength(svg)).toBeLessThan(30_000);
  });

  // 2 Nov 2026: browsers without SVG favicon support (Safari, older ones) ask for /favicon.ico by
  // themselves, with no <link> needed, so the file has to exist and be a real icon.
  it('has a /favicon.ico holding real 16, 32 and 48 pixel pictures', () => {
    const ico = readFileSync('public/favicon.ico');
    expect(ico.readUInt16LE(0)).toBe(0); // reserved
    expect(ico.readUInt16LE(2)).toBe(1); // type: icon
    const count = ico.readUInt16LE(4);
    expect(count).toBe(3);
    const sizes: number[] = [];
    for (let index = 0; index < count; index++) {
      const entry = 6 + 16 * index;
      const size = ico.readUInt8(entry);
      const length = ico.readUInt32LE(entry + 8);
      const offset = ico.readUInt32LE(entry + 12);
      const image = ico.subarray(offset, offset + length);
      expect(image.subarray(1, 4).toString('latin1')).toBe('PNG');
      expect({ width: image.readUInt32BE(16), height: image.readUInt32BE(20) }).toEqual({ width: size, height: size });
      sizes.push(size);
    }
    expect(sizes).toEqual([16, 32, 48]);
  });

  it('keeps every icon small enough to cost a phone nothing', () => {
    expect(readFileSync('public/favicon.ico').length).toBeLessThan(20_000);
    expect(readFileSync('public/apple-touch-icon.png').length).toBeLessThan(60_000);
  });
});
