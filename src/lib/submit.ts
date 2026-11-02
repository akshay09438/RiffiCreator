import { formAction } from './cta';

/**
 * The page's one network request (2 Nov 2026): the details form's answers, posted to the founder's
 * Google Form. Google does not let a page on another site read its reply, so the request is
 * "no-cors" and its result is opaque: this resolves once the browser has delivered the post and
 * rejects only when the network itself fails. The eslint exception for `fetch` covers this file
 * only; tests/submit.test.ts pins that no other file uses it.
 */
export async function submitDetails(answers: URLSearchParams): Promise<void> {
  await fetch(formAction, { method: 'POST', mode: 'no-cors', body: answers });
}
