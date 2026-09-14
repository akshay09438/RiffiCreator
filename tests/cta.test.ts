// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { settings } from '../src/content';
import { ctaHref, instagramDmHref, whatsappFallbackHref, whatsappHref } from '../src/lib/cta';

describe('instagramDmHref builds the Instagram DM link (PRD 5.4, design 4)', () => {
  it('builds https://ig.me/m/<handle>', () => {
    expect(instagramDmHref('riffi')).toBe('https://ig.me/m/riffi');
  });

  it.each(['riffi.app', 'riffi_in', '_riffi_', 'Riffi2026', 'r.i.f.f.i', 'r', 'a'.repeat(30)])(
    'accepts the valid handle %j',
    (handle) => {
      expect(instagramDmHref(handle)).toBe(`https://ig.me/m/${handle}`);
    },
  );

  it.each([
    ['@riffi', 'a leading @'],
    ['riffi page', 'a space'],
    ['riffi/x', 'a slash'],
    ['', 'nothing at all'],
    ['riffi?x=1', 'a query string'],
    ['riffi#top', 'a fragment'],
    [' riffi', 'a leading space'],
    ['riffi\nevil', 'a line break'],
    ['riffi%2F..', 'an encoded slash'],
    ['.', 'a lone dot'],
    ['..', 'two dots'],
    ['riffi.', 'a trailing dot'],
    ['.riffi', 'a leading dot'],
    ['rif..fi', 'a doubled dot'],
    ['a'.repeat(31), 'more than 30 characters'],
    ['रिफ़ी', 'non-Latin letters'],
  ])('refuses %j (%s) by throwing an Error', (handle) => {
    expect(() => instagramDmHref(handle)).toThrow(Error);
  });
});

describe('whatsappHref builds the optional WhatsApp link (PRD 5.4)', () => {
  it('builds https://wa.me/<number>?text=<the message encoded with encodeURIComponent>', () => {
    // Spaces become %20 (never +); & ? # + = / the line break, the em dash and ₹ are all escaped.
    expect(whatsappHref('919800000000', "Hi, I'm in & ready? #1+1=2/yes\n— ₹")).toBe(
      "https://wa.me/919800000000?text=Hi%2C%20I'm%20in%20%26%20ready%3F%20%231%2B1%3D2%2Fyes%0A%E2%80%94%20%E2%82%B9",
    );
  });

  it.each(['12345678', '123456789012345', '919800000000'])(
    'accepts the number %j (8 to 15 digits, no leading zero)',
    (number) => {
      expect(whatsappHref(number, 'hi')).toBe(`https://wa.me/${number}?text=hi`);
    },
  );

  it.each([
    ['+919800000000', 'a plus sign'],
    ['98 0000 0000', 'spaces'],
    ['', 'nothing at all'],
    ['0919800000000', 'a leading zero'],
    ['1234567', 'fewer than 8 digits'],
    ['1234567890123456', 'more than 15 digits'],
    ['91-98000-00000', 'dashes'],
    ['919800000000\n', 'a trailing line break'],
  ])('refuses %j (%s) by throwing an Error', (number) => {
    expect(() => whatsappHref(number, 'hi')).toThrow(Error);
  });
});

describe('the links the page uses', () => {
  it('points ctaHref at the DM for the handle in settings', () => {
    expect(ctaHref).toBe(instagramDmHref(settings.instagramHandle));
    expect(ctaHref).toBe(`https://ig.me/m/${settings.instagramHandle}`);
  });

  it('has no WhatsApp fallback link while the fallback is off (the default)', () => {
    expect(settings.whatsapp.enabled).toBe(false);
    expect(whatsappFallbackHref).toBeNull();
  });
});

describe('the WhatsApp fallback link once it is switched on', () => {
  afterEach(() => {
    vi.doUnmock('../src/content');
    vi.resetModules();
  });

  it('is built from the WhatsApp number and message in settings', async () => {
    vi.resetModules();
    vi.doMock('../src/content', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../src/content')>();
      return {
        ...actual,
        settings: { ...actual.settings, whatsapp: { enabled: true, number: '919800000000', message: "Hi, I'm in" } },
      };
    });
    const fresh = await import('../src/lib/cta');
    expect(fresh.whatsappFallbackHref).toBe("https://wa.me/919800000000?text=Hi%2C%20I'm%20in");
  });
});
