// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { settings } from '../src/content';
import {
  applyFormHref,
  ctaHref,
  instagramDmHref,
  instagramHref,
  whatsappFallbackHref,
  whatsappHref,
} from '../src/lib/cta';

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

describe('applyFormHref builds the application form link (PRD 5.4, 17 Sep 2026: the conversion moved from a DM to a form)', () => {
  it('builds the link by returning the URL unchanged once it passes the host check', () => {
    expect(applyFormHref('https://forms.gle/chyARXHuKTiwV4Yn6')).toBe('https://forms.gle/chyARXHuKTiwV4Yn6');
  });

  it.each([
    'https://forms.gle/AbCd',
    'https://forms.gle/AbC_-9x',
    'https://docs.google.com/forms/d/e/1FAIpQLSc-EXAMPLE_ID1234567890/viewform',
    'https://docs.google.com/forms/d/e/1FAIpQLSc-EXAMPLE_ID1234567890/viewform?usp=sf_link',
  ])('accepts the valid form link %j', (url) => {
    expect(applyFormHref(url)).toBe(url);
  });

  it.each([
    ['http://forms.gle/chyARXHuKTiwV4Yn6', 'http instead of https'],
    ['https://airtable.com/chyARXHuKTiwV4Yn6', 'a different host entirely'],
    ['https://evil.com/forms.gle/chyARXHuKTiwV4Yn6', 'the real host moved into the path'],
    ['https://forms.gle.evil.com/chyARXHuKTiwV4Yn6', 'a look-alike subdomain (forms.gle.evil.com)'],
    ['https://docs.google.com.evil.com/forms/x', 'a look-alike docs.google.com subdomain'],
    ['https://forms.gle/../chyARXHuKTiwV4Yn6', 'a path-traversal attempt in the id'],
    ['https://forms.gle/', 'an empty id'],
    ['https://forms.gle/abc', 'an id shorter than 4 characters'],
    ['https://docs.google.com/spreadsheets/d/abc', 'a Google link that is not a form'],
    ['https://docs.google.com/forms/', 'a docs.google.com form link with nothing after /forms/'],
    ['https://docs.google.com/forms', 'docs.google.com/forms with no trailing slash at all'],
    ['https://forms.gle/chyARXHuKTiwV4Yn6/', 'a trailing slash after the id'],
    ['https://forms.gle/chyARXHuKTiwV4Yn6?usp=sf_link', 'a query string on a forms.gle short link'],
    ['https://forms.gle/chyARXHuKTiwV4Yn6 https://evil.com', 'a second link smuggled in after a space'],
    ['https://FORMS.GLE/chyARXHuKTiwV4Yn6', 'an uppercase host'],
    ['forms.gle/chyARXHuKTiwV4Yn6', 'no scheme at all'],
    ['', 'nothing at all'],
  ])('refuses %j (%s) by throwing an Error naming it an invalid application form link', (url) => {
    expect(() => applyFormHref(url)).toThrow(/application form link/i);
  });

  // Confirmed against the real pattern (17 Sep 2026): a URL cannot change host by adding ".." to a
  // path, since a browser resolves ".." within the same origin - so this stays on docs.google.com
  // and is not the "stranger's form" risk the forms.gle branch above blocks outright by excluding
  // "." and "/" from the id. Pinned here so a future tightening of the pattern is a deliberate,
  // visible edit rather than a silent behaviour change.
  it('currently accepts dot-dot path segments on docs.google.com, because they cannot leave that host', () => {
    expect(applyFormHref('https://docs.google.com/forms/../../etc/passwd')).toBe(
      'https://docs.google.com/forms/../../etc/passwd',
    );
  });
});

describe('the links the page uses', () => {
  // 17 Sep 2026: the conversion became the founder's Google Form. The Instagram link stays built
  // from the same handle, because the helper line promises a reply from that account, even though
  // no button on the page opens it any more.
  it('points ctaHref at the application form in settings, and nowhere near Instagram', () => {
    expect(ctaHref).toBe(applyFormHref(settings.applyFormUrl));
    expect(ctaHref).toBe(settings.applyFormUrl);
    expect(ctaHref).toBe('https://forms.gle/chyARXHuKTiwV4Yn6');
    expect(ctaHref).not.toMatch(/ig\.me/);
  });

  it('still builds instagramHref from the handle in settings, separately from ctaHref', () => {
    expect(instagramHref).toBe(instagramDmHref(settings.instagramHandle));
    expect(instagramHref).toBe(`https://ig.me/m/${settings.instagramHandle}`);
    expect(instagramHref).not.toBe(ctaHref);
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
