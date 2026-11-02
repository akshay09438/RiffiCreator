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
 * The Google Form that receives the creators' details (2 Nov 2026). Only the exact formResponse
 * address of a Google Form is accepted, so a mistyped or swapped link fails the build rather than
 * sending creators' phone numbers and emails somewhere else.
 */
const FORM_RESPONSE =
  /^https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]{20,}\/formResponse$/;
const ENTRY_ID = /^entry\.\d{1,12}$/;

export function formResponseHref(url: string): string {
  if (!FORM_RESPONSE.test(url)) {
    throw new Error(
      `Invalid form address "${url}": it must be the https://docs.google.com/forms/d/e/<id>/formResponse address of a Google Form.`,
    );
  }
  return url;
}

export function formEntryId(id: string): string {
  if (!ENTRY_ID.test(id)) {
    throw new Error(`Invalid form field id "${id}": it must look like entry.123456789.`);
  }
  return id;
}

/** Where the details go. A bad address fails the build instead of shipping. */
export const formAction = formResponseHref(settings.form.responseUrl);

/** Each question's field name in the Google Form, checked once at build time. */
export const formFields = {
  name: formEntryId(settings.form.fields.name),
  phone: formEntryId(settings.form.fields.phone),
  email: formEntryId(settings.form.fields.email),
  handle: formEntryId(settings.form.fields.handle),
  username: formEntryId(settings.form.fields.username),
} as const;

/** The page's one conversion: every button scrolls to the details form (the #join section). */
export const ctaHref = '#join';

/** Riffi's Instagram account, still used for the reply we promise in the helper line. */
export const instagramHref = instagramDmHref(settings.instagramHandle);

export const whatsappFallbackHref: string | null = settings.whatsapp.enabled
  ? whatsappHref(settings.whatsapp.number, settings.whatsapp.message)
  : null;
