// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { content, settings } from '../src/content';
import { EXAMPLE_FRAMING, MONEY, NUMBER_NEXT_TO_POINTS, URGENCY, sentencesOf } from './honesty-rules';

// Every expected string below is copied from docs/functional-spec.md (the PRD), section 4 and
// the appendix, with the founder-approved changes: the name is Riffi, and the answer to
// "Is this paid right now?" ends with "That's the plan, not a contract." On 16 Sep 2026 the
// founder removed reward points entirely: no pill, no point values, no "you earn" promise.
// Block 4 (how you earn) and Block 5 (the long game) now say plainly that there is no money
// yet and that batch one is first in line when Riffi can pay - a plan, not a contract.
// Placeholder values (PRD 8) are deliberately not pinned, except the Block 6 seat defaults.
// On 17 Sep 2026 the founder swapped the cricket sample lines for non-cricket ones (the
// not-a-take/a-take pair and two marquee takes) and moved Cricket to the end of the category
// chips, and added a new block, VideoTakes (content.videoTakes): video-style sample takes
// that are pictures of the format only - no real clip or photo - always labelled a sample.
// Later the same day the founder repositioned it: Riffi is being pitched to reels creators,
// so VideoTakes now leads (heading "You already shoot reels. Here it's just you, talking.")
// and WhatRiffiIs is the second, typed option (heading "Or type it, if that's more your
// thing."), ahead of why-here. The old Twitter-vs-Riffi framing in WhatRiffiIs is gone.
// Later still on 17 Sep 2026 the founder changed two more blocks. Block 4 ("how you earn")
// is now a feature list, not an earnings pitch: heading "What creators can do here.", a new
// `lead` field, and the five rows render as cards, not a divided list - the honest no-money
// note is unchanged. Block 5 ("the long game") no longer names a payout figure at all: the
// founder will not put a number on future payouts because it would be invented, so the
// ₹5,000-₹10,000 example and "That's an illustration, not a rate card" are gone, and so is
// the word "tipping". Its heading is now three fields - headingMark ("Early now."),
// headingRest ("First in line later.") and heading (the full sentence) - because the page's
// marker sweep now wraps only the first half; heading stays the accessible name for the
// whole h2. The money guardrail below is rewritten to match: no currency figure may appear
// anywhere, and if one is ever reintroduced its sentence must still carry example framing.
// A later round the same day made three more decisions. The conversion is now the founder's
// Google Form (settings.applyFormUrl, since replaced), not an Instagram DM: the button's helper line now reads
// "A one minute form. We reply from @<handle>" instead of "Opens a DM with @<handle>". The
// Instagram handle is real (get.riffi) and confirmed, and so - later still - is the deploy
// domain, once the page went live on Vercel: only the weekly commitment, launch timing, content
// ownership and footer line are still open [FILL] inputs. And VideoTakes now carries a stock
// still behind each caption (content.videoTakes.items[n].still, plus a stillNote said out loud
// under the deck) - a reversal of the earlier "pictures of the format only, no media reference"
// rule, made because a face on an unlabelled card would otherwise read as a real Riffi creator.

// 2 Nov 2026: the page changed audience. It no longer recruits; it thanks the creators who are
// already in, gives the launch estimate (mid-November, worst case end of November, exact date to be
// announced), asks for their details in a form on the page that posts to the founder's Google Form,
// and teases the founding creator coin without naming it. The seat count and the "Claim a seat"
// button are gone. Every honesty guardrail below still applies unchanged.

// Later on 2 Nov 2026 the page was cut down to what onboarded creators need: the reels deck, the
// "what is a take" block, the Instagram-versus-Riffi bars, the earn list and the long-game block
// were removed (they were the recruiting pitch), and so were their copy tests. The "plan, not a
// contract" honesty rule now lives in the FAQ's pay answer, which the guardrails above still pin.

const contentSource = readFileSync(fileURLToPath(new URL('../src/content.ts', import.meta.url)), 'utf8');

// A present-tense claim that someone is paid today - "you earn", "we pay", "is/are/gets paid" -
// as opposed to a future plan ("first in line", "when we can pay creators"). A modal verb such as
// "can" or "will" sitting between the subject and the verb correctly falls outside this pattern:
// it turns the sentence into a plan, not a promise of payment now (16 Sep 2026: points removed).
const PRESENT_TENSE_PAYMENT =
  /\b(?:you|creators?)\s+earns?\b|\b(?:we|riffi)\s+pays?\b|\b(?:is|are|get|gets)\s+paid\b/i;

const VALID_HANDLE = /^(?!\.)(?!.*\.\.)(?!.*\.$)[A-Za-z0-9._]{1,30}$/;

type Found = { path: string; text: string };

function collectStrings(value: unknown, path: string): Found[] {
  if (typeof value === 'string') return [{ path, text: value }];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStrings(item, `${path}[${index}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => collectStrings(item, `${path}.${key}`));
  }
  return [];
}

// Every piece of text the content module can put in front of a creator,
// including what takenLabel produces for a real count.
const allCopy: Found[] = [
  ...collectStrings(content, 'content'),
  ...collectStrings(settings.whatsapp.message, 'settings.whatsapp.message'),
];

const offending = (pattern: RegExp): Found[] => allCopy.filter(({ text }) => pattern.test(text));

describe('honesty guardrails in the content (PRD 2.4, design 5)', () => {
  it('never puts a number next to the word "points" or "pts"', () => {
    expect(offending(NUMBER_NEXT_TO_POINTS)).toEqual([]);
  });

  it('never promises present-tense payment ("you earn", "we pay", "is/are paid") - only a plan for later (16 Sep 2026: points removed)', () => {
    expect(offending(PRESENT_TENSE_PAYMENT)).toEqual([]);
  });

  it('has no digits in the pay answer, so no point value or payout figure can hide there', () => {
    const paid = content.faq.items.find((item) => item.question === 'Is this paid right now?');
    expect(paid?.answer).toBeTruthy();
    expect(paid?.answer).not.toMatch(/\d/);
  });

  it('names no rupee or currency figure anywhere in the copy (17 Sep 2026: the founder will not invent a payout number)', () => {
    expect(offending(MONEY)).toEqual([]);
  });

  it('would still require example framing on any sentence naming a payout figure, if one is ever reintroduced', () => {
    // Today this list is empty - the guardrail above is what keeps it that way. This test's job
    // is to keep guarding the sentence-level framing rule if a figure ever comes back regardless.
    const moneySentences = allCopy.flatMap(({ path, text }) =>
      sentencesOf(text)
        .filter((sentence) => MONEY.test(sentence))
        .map((sentence) => ({ path, sentence })),
    );
    expect(moneySentences.filter(({ sentence }) => !EXAMPLE_FRAMING.test(sentence))).toEqual([]);
  });

  it('frames the answer to "Is this paid right now?" as "plan, not a contract"', () => {
    const paid = content.faq.items.find((item) => item.question === 'Is this paid right now?');
    expect(paid?.answer).toContain('plan, not a contract');
  });

  it('labels the one sample take on the page as a sample', () => {
    expect(content.hero.sampleTake.chip).toBe('sample take');
  });

  it('uses no countdown, deadline or urgency language', () => {
    expect(offending(URGENCY)).toEqual([]);
  });

  it('never spells the name "Rifii", in any value or anywhere in the file', () => {
    expect(offending(/rifii/i)).toEqual([]);
    expect(contentSource).not.toMatch(/rifii/i);
  });

  it('never puts a [FILL marker inside a value a creator could see', () => {
    expect(offending(/\[\s*FILL\b/i)).toEqual([]);
  });
});

describe('settings', () => {
  it('has an Instagram handle that is a valid handle (no @, spaces, slashes, or stray dots)', () => {
    expect(settings.instagramHandle).toMatch(VALID_HANDLE);
  });

  it('has an https site URL with no trailing slash, so "__SITE_URL__/og.png" becomes a clean absolute URL', () => {
    const url = new URL(settings.siteUrl);
    expect(url.protocol).toBe('https:');
    expect(settings.siteUrl).toBe(settings.siteUrl.trim());
    expect(settings.siteUrl.endsWith('/')).toBe(false);
    expect(url.search).toBe('');
    expect(url.hash).toBe('');
  });

  it('keeps the WhatsApp fallback switched off by default', () => {
    expect(settings.whatsapp.enabled).toBe(false);
    expect(typeof settings.whatsapp.number).toBe('string');
    expect(typeof settings.whatsapp.message).toBe('string');
  });

  it('ships no seat count at all: the page no longer recruits, so there is nothing to count', () => {
    expect(settings).not.toHaveProperty('seats');
    expect(content).not.toHaveProperty('seats');
  });
});

describe('the call-to-action copy', () => {
  it('labels the button "Send your details"', () => {
    expect(content.cta.label).toBe('Send your details');
  });

  // 2 Nov 2026: the button scrolls to the form. The founder asked for the helper line to name no
  // account, so it only says how long the form takes.
  it('says only how long the form takes, and names no account', () => {
    expect(content.cta.helper).toBe('About a minute.');
    expect(content.cta.helper).not.toMatch(/@|\.com|get\.riffi/i);
  });

  it('labels the WhatsApp fallback "Or message us on WhatsApp"', () => {
    expect(content.cta.whatsappLabel).toBe('Or message us on WhatsApp');
  });
});

describe('copy matches the PRD word for word', () => {
  it('nav: the Riffi wordmark and the Batch 01 chip', () => {
    expect(content.nav).toEqual({ wordmark: 'Riffi', batch: 'Batch 01' });
  });

  it('hero: the two title lines and the subline', () => {
    expect(content.hero.titleLines).toEqual(['You came in early.', 'Thank you for trusting us.']);
    expect(content.hero.subline).toBe(
      'Launch is taking longer because we want it right. New estimate: mid-November, end of November at the very worst.',
    );
  });

  it('hero: the sample take, 71% agree / 29% disagree, 2,140 votes', () => {
    expect(content.hero.sampleTake).toEqual({
      chip: 'sample take',
      text: 'Being early beats being good.',
      agree: { label: 'agree', percent: 71 },
      disagree: { label: 'disagree', percent: 29 },
      votes: 2140,
      votesLabel: 'votes',
    });
  });

  it('perks: three at launch and two soon, in the founder\'s own words, framed as a plan', () => {
    expect(content.perks.heading).toBe("What's waiting for you.");
    expect(content.perks.lead).toBe('Everything below comes with being first in.');
    expect(content.perks.items).toEqual([
      { label: 'Boosted reach on your posts', when: 'At launch' },
      { label: 'A direct line to the Riffi team', when: 'At launch' },
      { label: 'Early access to new features', when: 'At launch' },
      { label: 'First pick of the brand deals', when: 'Soon' },
      { label: 'First in line for creator earnings', when: 'Soon' },
    ]);
    expect(content.perks.framing).toBe('"Soon" is our plan, not a contract.');
    // Riffi has not launched, so nothing may be called "Live" (the app's own word for it).
    expect(JSON.stringify(content.perks)).not.toMatch(/\blive\b/i);
    expect(JSON.stringify(content.perks)).not.toMatch(/\d/);
  });

  it('the exact launch dates now live only in the hero and the FAQ, not in a block of their own', () => {
    expect(content).not.toHaveProperty('launch');
    expect(content.hero.subline).toContain('mid-November');
    expect(content.faq.items[0]?.answer).toContain('mid-November');
  });

  // 2 Nov 2026: the badge went from a blurred teaser to a clear picture, because the founder wanted
  // it understood. It still names no perk, number or date: the only claim is that early creators get
  // one when Riffi launches.
  it('badge: shown clearly, named once, with no perk, number or date, and a real image on this site', () => {
    expect(content.badge.heading).toBe('Your Founding Creator badge.');
    expect(content.badge.lead).toBe("Everyone who came in early gets one. It's yours when we launch.");
    expect(content.badge.image).toMatch(/^\/media\/[a-z0-9-]+\.(?:jpg|png|webp|avif)$/);
    expect(existsSync(fileURLToPath(new URL(`../public${content.badge.image}`, import.meta.url)))).toBe(true);
    const claims = [content.badge.heading, content.badge.lead, content.join.badgeNote].join(' ');
    expect(claims).not.toMatch(/\d/);
    expect(claims).not.toMatch(/perk|reward|voucher|points?\b|worth|rare|limited/i);
  });

  it('join: the five details the founder needs, the privacy line and every state of the form', () => {
    expect(Object.keys(content.join.fields)).toEqual(['name', 'email', 'phone', 'handle', 'username']);
    expect(content.join.heading).toBe('Your details.');
    expect(content.join.lead).toBe('Five fields. About a minute.');
    expect(content.join.badgeNote).toBe('Your Founding Creator badge is waiting.');
    expect(content.join.submit).toBe('Send my details');
    expect(content.join.privacy).toBe(
      'We use these details to reserve your username and set up your Riffi account.',
    );
    // 10 Nov 2026: permission to show their Instagram content on their own Riffi profile. It says they
    // keep ownership (so it agrees with the FAQ answer) and that they can ask for takedown.
    expect(content.join.consent).toBe(
      "I agree that Riffi can upload pieces of my own Instagram content (like my reels and posts) to my Riffi profile, for the username I'm reserving here. I keep ownership of my content, and I can ask Riffi to take any of it down.",
    );
    expect(content.join.consent).toContain('I keep ownership');
    expect(content.join.consent).toContain('take any of it down');
    expect(content.faq.items.find((item) => item.question === 'Who owns what I post?')?.answer).toContain(
      'You keep the rights',
    );
    expect(content.join.error).toBe("That didn't go through. Check your connection and try again.");
    expect(content.join.sentHeading).toBe('Got it. Thank you.');
    // 2 Nov 2026: the founder asked for no address to be named - only that an email will come.
    expect(content.join.sentBody).toBe(
      "Your details are with us. Once the launch date is fixed, we'll send you an email.",
    );
    expect(content.join.sentBody).not.toMatch(/@|\.com|\bget\.riffi\b/i);
    // Their own username is read back to them, and nothing else is invented around it.
    expect(content.join.sentHolding('riffi_fan')).toBe("We're holding @riffi_fan for you.");
  });

  it('FAQ: heading and the three questions, in order', () => {
    expect(content.faq.heading).toBe('Before you ask');
    expect(content.faq.items.map((item) => item.question)).toEqual([
      'When does Riffi launch?',
      'Is this paid right now?',
      'Who owns what I post?',
    ]);
  });

  it('FAQ: all three answers, including the launch estimate (2 Nov 2026) and the ownership answer (1 Oct 2026)', () => {
    expect(content.faq.items.map((item) => item.answer)).toEqual([
      "Our estimate is mid-November, and the worst case is the end of November. We'll announce the exact date as soon as we're sure of it.",
      "Not yet, and we won't pretend otherwise. Riffi hasn't launched. Once we have enough users, we start paying creators for the engagement their takes get, so you don't have to wait on brand deals to earn. Batch one is first in line. That's the plan, not a contract.",
      'You do. You keep the rights to your posts and you can take them anywhere.',
    ]);
    for (const item of content.faq.items) expect(item.answer.trim()).not.toBe('');
  });

  it('close: heading, body and the footer contact line (PRD input 4, answered 1 Oct 2026)', () => {
    expect(content.close.heading).toBe('Thank you for being first.');
    expect(content.close.body).toBe("Send your details and we'll take it from there.");
    expect(content.close.footerLine).toBe('Questions? Message @get.riffi on Instagram.');
    // The footer names the same account the helper line promises a reply from.
    expect(content.close.footerLine).toContain(`@${settings.instagramHandle}`);
  });
});

describe('TODAY: every open input is answered and no [FILL] marker is left (PRD 8 and 10)', () => {
  const lines = contentSource.split(/\r?\n/);
  const markers = lines
    .map((text, index) => ({ text, index, input: /\[FILL\]\s+(\d+)/.exec(text)?.[1] }))
    .filter(({ text }) => /\[\s*FILL\b/i.test(text));

  // 1 Oct 2026: the founder answered inputs 1 to 4 (input 5 and the form link on 17 Sep 2026), so
  // every marker is gone. A new marker would need a new input here, added deliberately.
  it('has no marker lines left', () => {
    expect(markers).toEqual([]);
  });

  it('uses "[FILL" nowhere in the content file', () => {
    expect((contentSource.match(/\[\s*FILL\b/gi) ?? []).length).toBe(0);
  });

  it('has real text, not an empty string, behind every answered input', () => {
    expect(content.perks.framing.trim()).not.toBe('');
    expect(content.faq.items.find((item) => item.question === 'When does Riffi launch?')?.answer.trim()).toBeTruthy();
    expect(content.faq.items.find((item) => item.question === 'Who owns what I post?')?.answer.trim()).toBeTruthy();
    expect(content.close.footerLine.trim()).not.toBe('');
  });

  // Keyed by input number rather than by looking for the settings key on the line below the
  // marker: three of the four markers sit above `body:` or `answer:`, so a name-matching version
  // of this rule would quietly pass for them however they were set.
  it('ties every input number to its settings keys: confirmed only once its numbered marker is gone', () => {
    const KEYS_FOR_INPUT: Record<string, string[]> = {
      '1': ['weeklyCommitment'],
      '2': ['launchTiming'],
      '3': ['contentOwnership'],
      '4': ['footerLine'],
      '5': ['instagramHandle', 'siteUrl'],
    };
    const markerNumbers = new Set(markers.map(({ input }) => input));
    for (const [number, keys] of Object.entries(KEYS_FOR_INPUT)) {
      for (const key of keys) {
        const confirmed = settings.inputsConfirmed[key as keyof typeof settings.inputsConfirmed];
        expect(markerNumbers.has(number), `input ${number} (${key})`).toBe(!confirmed);
      }
    }
  });
});

describe('the open inputs: all seven settled - three on 17 Sep 2026, four on 1 Oct 2026 (PRD 8)', () => {
  it('has settings.inputsConfirmed with exactly the seven inputs the page depends on', () => {
    expect(Object.keys(settings.inputsConfirmed).sort()).toEqual([
      'contentOwnership',
      'footerLine',
      'formResponseUrl',
      'instagramHandle',
      'launchTiming',
      'siteUrl',
      'weeklyCommitment',
    ]);
  });

  it('marks every input confirmed, now that the founder has answered all of them', () => {
    expect(settings.inputsConfirmed).toStrictEqual({
      weeklyCommitment: true,
      launchTiming: true,
      contentOwnership: true,
      footerLine: true,
      instagramHandle: true,
      formResponseUrl: true,
      siteUrl: true,
    });
  });

  it('keeps every confirmed value real: no placeholder domain, no placeholder handle, a live form address', () => {
    expect(settings.siteUrl).toMatch(/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+$/);
    expect(settings.siteUrl).not.toMatch(/\.(?:example|invalid|test|localhost)\b/);
    expect(settings.instagramHandle).not.toBe('riffi');
    // The Google Form's own formResponse address (2 Nov 2026), never the example id the
    // link-builder tests use.
    expect(settings.form.responseUrl).toMatch(
      /^https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]{20,}\/formResponse$/,
    );
    expect(settings.form.responseUrl).not.toMatch(/EXAMPLE/i);
  });
});
