// @vitest-environment node
import { readFileSync } from 'node:fs';
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
// Google Form (settings.applyFormUrl), not an Instagram DM: the button's helper line now reads
// "A one minute form. We reply from @<handle>" instead of "Opens a DM with @<handle>". The
// Instagram handle is real (get.riffi) and confirmed, and so - later still - is the deploy
// domain, once the page went live on Vercel: only the weekly commitment, launch timing, content
// ownership and footer line are still open [FILL] inputs. And VideoTakes now carries a stock
// still behind each caption (content.videoTakes.items[n].still, plus a stillNote said out loud
// under the deck) - a reversal of the earlier "pictures of the format only, no media reference"
// rule, made because a face on an unlabelled card would otherwise read as a real Riffi creator.

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
  { path: 'content.seats.takenLabel(37, 50)', text: content.seats.takenLabel(37, 50) },
];

const offending = (pattern: RegExp): Found[] => allCopy.filter(({ text }) => pattern.test(text));

describe('honesty guardrails in the content (PRD 2.4, design 5)', () => {
  it('never puts a number next to the word "points" or "pts"', () => {
    expect(offending(NUMBER_NEXT_TO_POINTS)).toEqual([]);
  });

  it('never promises present-tense payment ("you earn", "we pay", "is/are paid") - only a plan for later (16 Sep 2026: points removed)', () => {
    expect(offending(PRESENT_TENSE_PAYMENT)).toEqual([]);
  });

  it('has no digits at all in the earn rows or the earn note, so no point value can hide there', () => {
    const earnCopy = collectStrings(content.howYouEarn, 'content.howYouEarn');
    expect(earnCopy.filter(({ text }) => /\d/.test(text))).toEqual([]);
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

  it('frames the long game as "plan, not a contract"', () => {
    expect(content.longGame.framing).toContain('plan, not a contract');
  });

  it('frames the answer to "Is this paid right now?" as "plan, not a contract"', () => {
    const paid = content.faq.items.find((item) => item.question === 'Is this paid right now?');
    expect(paid?.answer).toContain('plan, not a contract');
  });

  it('labels every sample take as a sample: the hero chip, the marquee chip, the hidden list label and the video-takes chip', () => {
    expect(content.hero.sampleTake.chip).toBe('sample take');
    expect(content.whatRiffiIs.marqueeChip).toBe('sample take');
    expect(content.whatRiffiIs.marqueeLabel).toBe('Sample takes');
    expect(content.videoTakes.chip).toBe('sample');
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

  it('ships with no invented seat count: total 50, taken null, show false (PRD Block 6)', () => {
    expect(settings.seats).toEqual({ total: 50, taken: null, show: false });
  });

  it('uses one split for every comparison row, with the Instagram side smaller than the Riffi side', () => {
    const { instagram, riffi } = settings.comparisonSplit;
    expect(Number.isFinite(instagram) && instagram > 0).toBe(true);
    expect(Number.isFinite(riffi) && riffi > instagram).toBe(true);
    for (const row of content.whyHere.rows) {
      expect(Object.keys(row).sort()).toEqual(['instagram', 'label', 'riffi']);
    }
  });
});

describe('the call-to-action copy', () => {
  it('labels the button "Claim a seat"', () => {
    expect(content.cta.label).toBe('Claim a seat');
  });

  // 17 Sep 2026: the button opens the form, and the helper line names the account that replies.
  it('builds the helper line from the handle in settings, and promises the form the button opens', () => {
    expect(content.cta.helper).toBe(
      `A one minute form. We reply from @${settings.instagramHandle}`,
    );
    expect(content.cta.helper).toContain(`@${settings.instagramHandle}`);
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
    expect(content.hero.titleLines).toEqual([
      "On Instagram you're one of lakhs.",
      "Here you're one of the first, with almost no competition.",
    ]);
    expect(content.hero.subline).toBe(
      "Riffi is India's platform for opinions. We're taking 50 creators in before launch and pointing the feed at them.",
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

  it('what Riffi is: heading, lead and the contrast pair (the typed option, second since 17 Sep 2026)', () => {
    expect(content.whatRiffiIs.heading).toBe("Or type it, if that's more your thing.");
    expect(content.whatRiffiIs.lead).toBe(
      'Same forty seconds either way. What matters is that the post is your opinion, not the news.',
    );
    expect(content.whatRiffiIs.notTake).toEqual({
      chip: 'not a take',
      text: 'The new season dropped on Friday.',
      caption: "That's news. It's already everywhere.",
    });
    expect(content.whatRiffiIs.take).toEqual({
      chip: 'a take',
      text: 'Every season after the third is just fan service with a budget.',
      caption: "That's yours. Nobody else posted it.",
    });
  });

  it('what Riffi is: the ten category chips, in order', () => {
    expect(content.whatRiffiIs.categories).toEqual([
      'Movies',
      'Politics',
      'Food',
      'Campus',
      'Money',
      'Music',
      'Startups',
      'Fashion',
      'Sports',
      'Cricket',
    ]);
  });

  it('what Riffi is: the eight marquee takes, in order', () => {
    expect(content.whatRiffiIs.marqueeTakes).toEqual([
      'Your favourite startup is a spreadsheet with a good logo.',
      "Bengaluru traffic isn't an infrastructure problem, it's a scheduling one.",
      'Every biopic in the last five years is an ad for its subject.',
      "Filter coffee beats any third-wave pour over and it isn't close.",
      'Hostel mess food built more resilience than any gym ever will.',
      'Reels killed the Indian meme page.',
      'Paneer is overrated and we all know it.',
      'Every playlist app ends up playing the same six songs.',
    ]);
  });

  it('video takes: heading, lead, badge, chip, the three items in order, and the footer (rewritten to lead the page, 17 Sep 2026)', () => {
    expect(content.videoTakes.heading).toBe("You already shoot reels. Here it's just you, talking.");
    expect(content.videoTakes.lead).toBe(
      'No hook, no thumbnail, no four hour edit. Point the phone at yourself, say what you actually think, and post it. The room votes on the opinion, not the edit.',
    );
    expect(content.videoTakes.badge).toBe('40 seconds, one opinion');
    expect(content.videoTakes.chip).toBe('sample');
    expect(content.videoTakes.items).toEqual([
      {
        text: 'Every biopic in the last five years is an ad for its subject.',
        length: '0:38',
        still: '/media/sample-one.jpg',
      },
      {
        text: 'Bengaluru traffic is a scheduling problem, not a road problem.',
        length: '0:41',
        still: '/media/sample-two.jpg',
      },
      {
        text: 'Hostel mess food built more resilience than any gym ever will.',
        length: '0:29',
        still: '/media/sample-three.jpg',
      },
    ]);
    expect(content.videoTakes.footer).toBe(
      'One rule, whatever you shoot: it has to be your opinion, not the news.',
    );
  });

  // 17 Sep 2026: each card carries a stock still. The rule is no longer "no media at all" but
  // "only a still, only from this site". A clip, a poster or a remote URL still fails.
  it('video takes: a still is the only media a card may name, and only from this site', () => {
    expect(Object.keys(content.videoTakes).sort()).toEqual([
      'badge',
      'chip',
      'footer',
      'heading',
      'items',
      'lead',
      'stillAlt',
      'stillNote',
    ]);
    const seenStills = new Set<string>();
    for (const item of content.videoTakes.items) {
      expect(Object.keys(item).sort()).toEqual(['length', 'still', 'text']);
      expect(item.still).toMatch(/^\/media\/[a-z0-9-]+\.(?:jpg|png|webp|avif)$/);
      expect(item.still).not.toMatch(/^https?:|^\/\//);
      // Each card gets its own picture, and the file the path names must actually be on disk -
      // a path that merely looks right would otherwise ship as a silently broken image (empty
      // alt means nothing would even announce the failure to a screen reader).
      expect(seenStills.has(item.still), `${item.still} is reused by more than one card`).toBe(false);
      seenStills.add(item.still);
      const onDisk = fileURLToPath(new URL(`../public${item.still}`, import.meta.url));
      expect(existsSync(onDisk), `no file on disk at public${item.still}`).toBe(true);
    }
  });

  it('video takes: says out loud that the stills are stock and nobody has posted yet', () => {
    expect(content.videoTakes.stillNote).toBe(
      'Stock stills and sample takes. Nobody has posted on Riffi yet, which is the point.',
    );
    expect(content.videoTakes.stillAlt).toBe('');
  });

  it('why here: heading, side labels, the four comparison rows and the closer', () => {
    expect(content.whyHere.heading).toBe("You're not early on Instagram. You're early here.");
    expect(content.whyHere.instagramLabel).toBe('Instagram');
    expect(content.whyHere.riffiLabel).toBe('Riffi');
    expect(content.whyHere.rows).toEqual([
      { label: "Creators you're up against", instagram: 'Lakhs', riffi: '49' },
      { label: 'Who decides your reach', instagram: 'A feed tuned for watch time', riffi: "A feed we're still writing" },
      { label: 'What your first post gets', instagram: 'Buried', riffi: 'The front page' },
      {
        label: 'What you own at the end',
        instagram: 'Followers on rented land',
        riffi: 'A position on a platform still being built',
      },
    ]);
    expect(content.whyHere.closer).toBe('And a reel costs you four hours. A take costs you forty seconds.');
  });

  it('how you earn: heading, lead, the five rows and the honest no-money-yet note - no pill (17 Sep 2026: a feature list, not an earnings pitch)', () => {
    expect(content.howYouEarn).not.toHaveProperty('pill');
    expect(Object.keys(content.howYouEarn).sort()).toEqual(['heading', 'lead', 'note', 'rows']);
    expect(content.howYouEarn.heading).toBe('What creators can do here.');
    expect(content.howYouEarn.lead).toBe('Five ways to put an opinion out. Pick whichever suits the take.');
    expect(content.howYouEarn.rows).toEqual([
      { action: 'Post a take', description: "One opinion, one line. That's the whole format." },
      { action: 'Write the long version', description: 'Some takes need a paragraph. Write it out when they do.' },
      { action: 'Add images', description: 'Screenshots, stills, memes. Whatever makes the point land.' },
      { action: 'Drop a story', description: 'Short-lived posts, the same as you already do.' },
      {
        action: 'Get the room talking',
        description: "Votes, replies and reshares. That's how you find out if the room agrees.",
      },
    ]);
    expect(content.howYouEarn.note).toBe(
      "Straight answer on money: there isn't any yet. Riffi hasn't launched, so anything we paid you today would be made up. What you get now is the part that gets harder to buy later. The feed points at you, your first post lands on the front page, and you help set what this place sounds like.",
    );
  });

  it('the long game: heading in three parts (for the marker sweep and the accessible name), the three items and the framing line (17 Sep 2026: no payout number is named)', () => {
    expect(content.longGame.headingMark).toBe('Early now.');
    expect(content.longGame.headingRest).toBe('First in line later.');
    expect(content.longGame.heading).toBe('Early now. First in line later.');
    // The rendered h2 splits headingMark and headingRest into two spans (for the marker sweep);
    // heading must stay their exact join so a screen reader still hears it as one sentence.
    expect(content.longGame.heading).toBe(`${content.longGame.headingMark} ${content.longGame.headingRest}`);
    expect(content.longGame.items).toEqual([
      {
        title: 'Performance payouts',
        body: 'When we can pay for views, batch one is in the first group. We are not putting a number on it today, because we would be making it up. You will see the real numbers before you post for them.',
      },
      {
        title: 'Brand deals',
        body: "Brands reach a platform through its top creators. On a platform with 50 creators, that list is a lot shorter than the one you're on now.",
      },
      {
        title: 'Whatever comes after',
        body: 'Subscriptions, and anything else we build. Batch one gets it before anyone else.',
      },
    ]);
    expect(content.longGame.framing).toBe(
      "All of this is our plan, not a contract. You're backing us early, and we'd rather you do it knowing exactly that.",
    );
  });

  it('50 seats: heading and meter label, with the commitment body present as real text', () => {
    expect(content.seats.heading).toBe("50 seats. Here's what we ask.");
    expect(content.seats.meterLabel).toBe('50 seats in batch one');
    expect(content.seats.body.trim()).not.toBe('');
  });

  it('50 seats: the taken label shows the real count it is given', () => {
    expect(content.seats.takenLabel(37, 50)).toContain('37');
    expect(content.seats.takenLabel(12, 50)).toContain('12');
  });

  it('FAQ: heading and the six questions, in order', () => {
    expect(content.faq.heading).toBe('Before you ask');
    expect(content.faq.items.map((item) => item.question)).toEqual([
      'Do I have to leave Instagram?',
      'My following is small. Does that matter?',
      'Is this paid right now?',
      'What can I post about?',
      'When does Riffi launch?',
      'Who owns what I post?',
    ]);
  });

  it('FAQ: the four answers that are not open inputs, and real text for the two that are', () => {
    expect(content.faq.items.slice(0, 4).map((item) => item.answer)).toEqual([
      'No. Keep posting exactly where you post now. A take is a sentence, not a shoot, so it sits alongside what you already do.',
      "No. We're picking for takes, not reach. Most of this cohort is under 20k and that's deliberate.",
      "No, and we won't pretend otherwise. Riffi hasn't launched, so there's no money in it yet. You're putting takes in early, and when we can pay creators, batch one is first in line for payouts and brand deals. That's the plan, not a contract.",
      'Anything you have a real opinion on. Cricket, politics, films, food, campus, money. Opinions, not news reports.',
    ]);
    for (const item of content.faq.items) expect(item.answer.trim()).not.toBe('');
  });

  it('close: heading and body, with the footer line as text (empty until PRD input 4 is answered)', () => {
    expect(content.close.heading).toBe('50 seats. Batch one.');
    expect(content.close.body).toBe(
      "If you've got opinions and you're tired of shouting them into a feed that doesn't know you, take one.",
    );
    expect(typeof content.close.footerLine).toBe('string');
  });
});

describe('TODAY: open inputs 1 to 5 are still marked [FILL] - update deliberately, one input at a time, as the founder answers each (PRD 8 and 10)', () => {
  const lines = contentSource.split(/\r?\n/);
  const markers = lines
    .map((text, index) => ({ text, index, input: /\[FILL\]\s+(\d+)/.exec(text)?.[1] }))
    .filter(({ text }) => /\[\s*FILL\b/i.test(text));
  const markersFor = (input: string) => markers.filter((marker) => marker.input === input);
  const nextLine = (index: number): string => lines.slice(index + 1).find((line) => line.trim() !== '') ?? '';
  const around = (index: number): string => lines.slice(Math.max(0, index - 3), index + 4).join('\n');

  // 17 Sep 2026: input 5 (the handle and the live domain) and the new form link are answered, so
  // their markers are gone. Four remain, and the rule below ties each marker to its own input.
  it('has exactly four marker lines left: inputs 1 to 4, once each', () => {
    expect(markers.map(({ input }) => input).sort()).toEqual(['1', '2', '3', '4']);
  });

  it('uses "[FILL" nowhere except those four marker lines', () => {
    expect((contentSource.match(/\[\s*FILL\b/gi) ?? []).length).toBe(4);
  });

  it('puts every marker in a comment line, never inside a value', () => {
    for (const { text } of markers) expect(text.trim()).toMatch(/^(?:\/\/|\/\*|\*)/);
  });

  it('marks input 1 directly above the seat commitment body', () => {
    const [marker] = markersFor('1');
    expect(marker).toBeDefined();
    const index = marker?.index ?? -1;
    expect(nextLine(index)).toMatch(/\bbody\b/);
    const opening = content.seats.body.split(/['"`\\]/)[0]?.slice(0, 16) ?? '';
    expect(lines.slice(index + 1, index + 4).join('\n')).toContain(opening);
  });

  it('marks input 2 directly above the answer to "When does Riffi launch?"', () => {
    const [marker] = markersFor('2');
    expect(marker).toBeDefined();
    expect(nextLine(marker?.index ?? -1)).toMatch(/\banswer\b/);
    expect(around(marker?.index ?? 0)).toContain('When does Riffi launch?');
  });

  it('marks input 3 directly above the answer to "Who owns what I post?"', () => {
    const [marker] = markersFor('3');
    expect(marker).toBeDefined();
    expect(nextLine(marker?.index ?? -1)).toMatch(/\banswer\b/);
    expect(around(marker?.index ?? 0)).toContain('Who owns what I post?');
  });

  it('marks input 4 directly above the footer line', () => {
    const [marker] = markersFor('4');
    expect(marker).toBeDefined();
    expect(nextLine(marker?.index ?? -1)).toMatch(/\bfooterLine\b/);
  });

  // Input 5 (the handle and the domain) was answered on 17 Sep 2026, so its markers are gone.
  it('leaves no marker for an input that is already confirmed', () => {
    const confirmed = Object.entries(settings.inputsConfirmed)
      .filter(([, done]) => done)
      .map(([key]) => key);
    expect(confirmed.length).toBeGreaterThan(0);
    for (const key of confirmed) {
      const markerAbove = markers.some(({ index }) => new RegExp(`\\b${key}\\b`).test(nextLine(index)));
      expect(markerAbove).toBe(false);
    }
  });
});

describe('the open inputs: four still unanswered, three settled on 17 Sep 2026 (PRD 8)', () => {
  it('has settings.inputsConfirmed with exactly the seven inputs the page depends on', () => {
    expect(Object.keys(settings.inputsConfirmed).sort()).toEqual([
      'applyFormUrl',
      'contentOwnership',
      'footerLine',
      'instagramHandle',
      'launchTiming',
      'siteUrl',
      'weeklyCommitment',
    ]);
  });

  it('marks as confirmed only what the founder actually answered: the handle, the form and the live domain', () => {
    expect(settings.inputsConfirmed).toStrictEqual({
      weeklyCommitment: false,
      launchTiming: false,
      contentOwnership: false,
      footerLine: false,
      instagramHandle: true,
      applyFormUrl: true,
      siteUrl: true,
    });
  });

  it('keeps every confirmed value real: no placeholder domain, no placeholder handle, a live form link', () => {
    expect(settings.siteUrl).toMatch(/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+$/);
    expect(settings.siteUrl).not.toMatch(/\.(?:example|invalid|test|localhost)\b/);
    expect(settings.instagramHandle).not.toBe('riffi');
    expect(settings.applyFormUrl).toMatch(/^https:\/\/forms\.gle\/[A-Za-z0-9_-]{4,}$/);
  });
});
