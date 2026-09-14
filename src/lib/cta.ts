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

/** Where both "Claim a seat" buttons go. A bad handle fails the build instead of shipping. */
export const ctaHref = instagramDmHref(settings.instagramHandle);

export const whatsappFallbackHref: string | null = settings.whatsapp.enabled
  ? whatsappHref(settings.whatsapp.number, settings.whatsapp.message)
  : null;
