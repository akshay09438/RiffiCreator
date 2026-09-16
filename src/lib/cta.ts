import { settings } from '../content';

// Instagram's rules: 1-30 letters, numbers, dots and underscores, with no leading, trailing or doubled
// dot. Without them a handle of ".." would turn https://ig.me/m/.. into https://ig.me/.
const INSTAGRAM_HANDLE = /^(?!\.)(?!.*\.\.)(?!.*\.$)[A-Za-z0-9._]{1,30}$/;
const WHATSAPP_NUMBER = /^[1-9]\d{7,14}$/;

/** The Instagram DM deep link. From inside Instagram's in-app browser it opens the thread (PRD 5.4). */
export function instagramDmHref(handle: string): string {
  if (!INSTAGRAM_HANDLE.test(handle)) {
    throw new Error(
      `Invalid Instagram handle "${handle}": use 1-30 letters, numbers, dots and underscores, without the @ and with no leading, trailing or doubled dot.`,
    );
  }
  return `https://ig.me/m/${handle}`;
}

/** The optional WhatsApp fallback, with the reply already typed. */
export function whatsappHref(number: string, message: string): string {
  if (!WHATSAPP_NUMBER.test(number)) {
    throw new Error(
      `Invalid WhatsApp number "${number}": digits only, with the country code and no plus sign.`,
    );
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * The founder's application form (17 Sep 2026). Only Google's own form hosts are accepted, so a
 * mistyped or swapped link fails the build rather than sending creators to a stranger's form.
 */
const FORM_HOST = /^https:\/\/(?:forms\.gle\/[A-Za-z0-9_-]{4,}|docs\.google\.com\/forms\/[\w./?=&-]+)$/;

export function applyFormHref(url: string): string {
  if (!FORM_HOST.test(url)) {
    throw new Error(
      `Invalid application form link "${url}": it must be an https link to forms.gle or docs.google.com/forms.`,
    );
  }
  return url;
}

/** Where every "Claim a seat" button goes. A bad link fails the build instead of shipping. */
export const ctaHref = applyFormHref(settings.applyFormUrl);

/** Riffi's Instagram account, still used for the reply we promise in the helper line. */
export const instagramHref = instagramDmHref(settings.instagramHandle);

export const whatsappFallbackHref: string | null = settings.whatsapp.enabled
  ? whatsappHref(settings.whatsapp.number, settings.whatsapp.message)
  : null;
