// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { content, settings } from '../src/content';
import { EXAMPLE_FRAMING, MONEY, NUMBER_NEXT_TO_POINTS, URGENCY, sentencesOf } from './honesty-rules';

// Every expected string below is copied from docs/functional-spec.md (the PRD), section 4 and
// the appendix, with the founder-approved changes: the name is Riffi, and the answer to
// "Is this paid right now?" ends with "That's the plan, not a contract."
// Placeholder values (PRD 8) are deliberately not pinned, except the Block 6 seat defaults.

const contentSource = readFileSync(fileURLToPath(new URL('../src/content.ts', import.meta.url)), 'utf8');

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

  it('has no digits at all in the earn rows or the earn note, so no point value can hide there', () => {
    const earnCopy = collectStrings(content.howYouEarn, 'content.howYouEarn');
    expect(earnCopy.filter(({ text }) => /\d/.test(text))).toEqual([]);
  });

  it('frames every payout figure as an example inside the very sentence it appears in', () => {
    const moneySentences = allCopy.flatMap(({ path, text }) =>
      sentencesOf(text)
        .filter((sentence) => MONEY.test(sentence))
        .map((sentence) => ({ path, sentence })),
    );
    expect(moneySentences.length).toBeGreaterThan(0);
    expect(moneySentences.filter(({ sentence }) => !EXAMPLE_FRAMING.test(sentence))).toEqual([]);
  });

  it('says "That\'s an illustration, not a rate card" alongside the payout figure', () => {
    const payouts = content.longGame.items.find((item) => MONEY.test(item.body));
    expect(payouts?.body).toContain("That's an illustration, not a rate card");
  });

  it('frames the long game as "plan, not a contract"', () => {
    expect(content.longGame.framing).toContain('plan, not a contract');
  });

  it('frames the answer to "Is this paid right now?" as "plan, not a contract"', () => {
    const paid = content.faq.items.find((item) => item.question === 'Is this paid right now?');
    expect(paid?.answer).toContain('plan, not a contract');
  });

  it('labels every sample take as a sample: the hero chip, the marquee chip and the hidden list label', () => {
    expect(content.hero.sampleTake.chip).toBe('sample take');
    expect(content.whatRiffiIs.marqueeChip).toBe('sample take');
    expect(content.whatRiffiIs.marqueeLabel).toBe('Sample takes');
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

  it('builds the helper line from the same handle the link uses', () => {
    expect(content.cta.helper).toBe(`Opens a DM with @${settings.instagramHandle}`);
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

  it('what Riffi is: heading, lead and the contrast pair', () => {
    expect(content.whatRiffiIs.heading).toBe("Twitter took news. We're taking opinions.");
    expect(content.whatRiffiIs.lead).toBe(
      'Riffi is built for one thing: what you think. Not what happened, not who said it. Your take, and whether the room agrees.',
    );
    expect(content.whatRiffiIs.notTake).toEqual({
      chip: 'not a take',
      text: 'India won by 6 wickets in Chennai.',
      caption: "That's news. It's already everywhere.",
    });
    expect(content.whatRiffiIs.take).toEqual({
      chip: 'a take',
      text: "Chasing in Chennai got easier and everyone's pretending it didn't.",
      caption: "That's yours. Nobody else posted it.",
    });
  });

  it('what Riffi is: the ten category chips, in order', () => {
    expect(content.whatRiffiIs.categories).toEqual([
      'Cricket',
      'Politics',
      'Movies',
      'Food',
      'Campus',
      'Money',
      'Music',
      'Startups',
      'Sports',
      'Fashion',
    ]);
  });

  it('what Riffi is: the eight marquee takes, in order', () => {
    expect(content.whatRiffiIs.marqueeTakes).toEqual([
      'Test cricket is the only format that still tells the truth.',
      "Bengaluru traffic isn't an infrastructure problem, it's a scheduling one.",
      'Every biopic in the last five years is an ad for its subject.',
      "Filter coffee beats any third-wave pour over and it isn't close.",
      'Hostel mess food built more resilience than any gym ever will.',
      'Reels killed the Indian meme page.',
      'Paneer is overrated and we all know it.',
      "The best captain of this generation isn't the one you're thinking of.",
    ]);
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

  it('how you earn: heading, the points pill, the five rows and the note', () => {
    expect(content.howYouEarn.heading).toBe('You earn from post one.');
    expect(content.howYouEarn.pill).toBe('points');
    expect(content.howYouEarn.rows).toEqual([
      { action: 'Post a take', description: 'The opinion itself. Every one counts.' },
      { action: 'Write the long version', description: 'When a take needs more than a line, write it out.' },
      { action: 'Add images', description: 'Screenshots, stills, memes, whatever makes the point land.' },
      { action: 'Drop a story', description: 'Short-lived posts, same as you already do.' },
      { action: 'Get the room talking', description: 'Votes, replies and reshares on your take earn on top.' },
    ]);
    expect(content.howYouEarn.note).toBe(
      "Points convert to vouchers. Exact values go live with the app — we're still tuning them, and we'd rather publish them once than change them on you.",
    );
  });

  it('the long game: heading, the three items and the framing line', () => {
    expect(content.longGame.heading).toBe('Points now. Priority later.');
    expect(content.longGame.items).toEqual([
      {
        title: 'Performance payouts',
        body: "When we switch on view-based payouts, this cohort is in the first batch. To give you the shape of it: a post crossing a lakh views lands somewhere in the ₹5,000–10,000 band. That's an illustration, not a rate card — we'll publish real slabs before it goes live.",
      },
      {
        title: 'Brand deals',
        body: "Brands reach a platform through its top creators. On a platform with 50 creators, that's a much shorter list than the one you're on now.",
      },
      {
        title: 'Whatever comes after',
        body: "Subscriptions, tipping, whatever we build — this cohort gets it before anyone else. That's the deal for being here first.",
      },
    ]);
    expect(content.longGame.framing).toBe(
      "All of this is our plan, not a contract. We'd rather you come in knowing exactly that.",
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
      'No. Keep posting exactly where you post now. A take is a sentence, not a shoot — this sits alongside what you already do.',
      "No. We're picking for takes, not reach. Most of this cohort is under 20k and that's deliberate.",
      "You earn points from your first post and points convert to vouchers. Cash payouts arrive with monetisation, and this cohort is first in line for it. That's the plan, not a contract.",
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

  it('has exactly six marker lines: inputs 1 to 4 once each, and input 5 twice (handle and domain)', () => {
    expect(markers.map(({ input }) => input).sort()).toEqual(['1', '2', '3', '4', '5', '5']);
  });

  it('uses "[FILL" nowhere except those six marker lines', () => {
    expect((contentSource.match(/\[\s*FILL\b/gi) ?? []).length).toBe(6);
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

  it('marks input 5 directly above both the Instagram handle and the site URL', () => {
    const keys = markersFor('5').map(({ index }) => /\b(instagramHandle|siteUrl)\b/.exec(nextLine(index))?.[1]);
    expect(keys.sort()).toEqual(['instagramHandle', 'siteUrl']);
  });
});

describe('TODAY: none of the six open inputs is confirmed yet - flip each to true only once the founder has answered it (PRD 8)', () => {
  it('has settings.inputsConfirmed with exactly the six open inputs, every one still false', () => {
    expect(Object.keys(settings.inputsConfirmed).sort()).toEqual([
      'contentOwnership',
      'footerLine',
      'instagramHandle',
      'launchTiming',
      'siteUrl',
      'weeklyCommitment',
    ]);
    expect(settings.inputsConfirmed).toStrictEqual({
      weeklyCommitment: false,
      launchTiming: false,
      contentOwnership: false,
      footerLine: false,
      instagramHandle: false,
      siteUrl: false,
    });
  });
});
