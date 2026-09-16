/**
 * Every user-facing string and every page setting lives in this file (PRD 5.2, rule 2).
 *
 * Placeholders the founder must answer before the link goes to any creator carry a FILL tag in
 * square brackets on the comment line above them. `npm run presend` fails while any remain.
 * Never replace a placeholder with an invented figure.
 */

export type Settings = {
  instagramHandle: string;
  siteUrl: string;
  whatsapp: { enabled: boolean; number: string; message: string };
  seats: { total: number; taken: number | null; show: boolean };
  comparisonSplit: { instagram: number; riffi: number };
  inputsConfirmed: Record<
    | 'weeklyCommitment'
    | 'launchTiming'
    | 'contentOwnership'
    | 'footerLine'
    | 'instagramHandle'
    | 'siteUrl',
    boolean
  >;
};

export const settings: Settings = {
  // [FILL] 5 - Riffi's real Instagram handle, without the @. Confirm Riffi owns this exact account.
  instagramHandle: 'riffi',
  // [FILL] 5 - the deploy domain, with https:// and no trailing slash. The preview card uses it.
  siteUrl: 'https://riffi-creators.example',
  whatsapp: {
    enabled: false,
    // Digits only, with the country code and no plus sign. Needed only when `enabled` is true.
    number: '',
    message: "I'm in",
  },
  seats: {
    total: 50,
    // A real, hand-counted number. Leave null to show no number at all.
    taken: null,
    // Turn on only when `taken` is real and kept up to date by hand.
    show: false,
  },
  // Rhetoric, not data: every comparison row uses the same dramatic split (PRD Block 3).
  comparisonSplit: { instagram: 12, riffi: 88 },
  // Flip each to true only once the founder has answered that open input (PRD section 8).
  // `npm run presend` fails while any is false - deleting a placeholder comment is not an answer.
  inputsConfirmed: {
    weeklyCommitment: false,
    launchTiming: false,
    contentOwnership: false,
    footerLine: false,
    instagramHandle: false,
    siteUrl: false,
  },
};

export const content = {
  nav: {
    wordmark: 'Riffi',
    batch: 'Batch 01',
  },
  cta: {
    label: 'Claim a seat',
    helper: `Opens a DM with @${settings.instagramHandle}`,
    whatsappLabel: 'Or message us on WhatsApp',
  },
  hero: {
    titleLines: [
      "On Instagram you're one of lakhs.",
      "Here you're one of the first, with almost no competition.",
    ],
    subline:
      "Riffi is India's platform for opinions. We're taking 50 creators in before launch and pointing the feed at them.",
    sampleTake: {
      chip: 'sample take',
      text: 'Being early beats being good.',
      agree: { label: 'agree', percent: 71 },
      disagree: { label: 'disagree', percent: 29 },
      votes: 2140,
      votesLabel: 'votes',
    },
  },
  whatRiffiIs: {
    heading: "Twitter took news. We're taking opinions.",
    lead: 'Riffi is built for one thing: what you think. Not what happened, not who said it. Your take, and whether the room agrees.',
    notTake: {
      chip: 'not a take',
      text: 'India won by 6 wickets in Chennai.',
      caption: "That's news. It's already everywhere.",
    },
    take: {
      chip: 'a take',
      text: "Chasing in Chennai got easier and everyone's pretending it didn't.",
      caption: "That's yours. Nobody else posted it.",
    },
    categories: [
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
    ],
    marqueeLabel: 'Sample takes',
    marqueeChip: 'sample take',
    marqueeTakes: [
      'Test cricket is the only format that still tells the truth.',
      "Bengaluru traffic isn't an infrastructure problem, it's a scheduling one.",
      'Every biopic in the last five years is an ad for its subject.',
      "Filter coffee beats any third-wave pour over and it isn't close.",
      'Hostel mess food built more resilience than any gym ever will.',
      'Reels killed the Indian meme page.',
      'Paneer is overrated and we all know it.',
      "The best captain of this generation isn't the one you're thinking of.",
    ],
  },
  whyHere: {
    heading: "You're not early on Instagram. You're early here.",
    instagramLabel: 'Instagram',
    riffiLabel: 'Riffi',
    rows: [
      { label: "Creators you're up against", instagram: 'Lakhs', riffi: '49' },
      {
        label: 'Who decides your reach',
        instagram: 'A feed tuned for watch time',
        riffi: "A feed we're still writing",
      },
      { label: 'What your first post gets', instagram: 'Buried', riffi: 'The front page' },
      {
        label: 'What you own at the end',
        instagram: 'Followers on rented land',
        riffi: 'A position on a platform still being built',
      },
    ],
    closer: 'And a reel costs you four hours. A take costs you forty seconds.',
  },
  howYouEarn: {
    heading: 'You earn from post one.',
    pill: 'points',
    rows: [
      { action: 'Post a take', description: 'The opinion itself. Every one counts.' },
      {
        action: 'Write the long version',
        description: 'When a take needs more than a line, write it out.',
      },
      {
        action: 'Add images',
        description: 'Screenshots, stills, memes, whatever makes the point land.',
      },
      { action: 'Drop a story', description: 'Short-lived posts, same as you already do.' },
      {
        action: 'Get the room talking',
        description: 'Votes, replies and reshares on your take earn on top.',
      },
    ],
    note: "Points convert to vouchers. Exact values go live with the app — we're still tuning them, and we'd rather publish them once than change them on you.",
  },
  longGame: {
    heading: 'Points now. Priority later.',
    items: [
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
    ],
    framing:
      "All of this is our plan, not a contract. We'd rather you come in knowing exactly that.",
  },
  seats: {
    heading: "50 seats. Here's what we ask.",
    // [FILL] 1 - the actual weekly commitment asked of creators.
    body: "Post three takes a week through the pre-launch period. That's the whole ask. No calls, no contracts, no exclusivity — keep posting wherever else you post.",
    meterLabel: '50 seats in batch one',
    takenLabel: (taken: number, total: number) => `${taken} of ${total} seats taken`,
  },
  faq: {
    heading: 'Before you ask',
    items: [
      {
        question: 'Do I have to leave Instagram?',
        answer:
          'No. Keep posting exactly where you post now. A take is a sentence, not a shoot — this sits alongside what you already do.',
      },
      {
        question: 'My following is small. Does that matter?',
        answer:
          "No. We're picking for takes, not reach. Most of this cohort is under 20k and that's deliberate.",
      },
      {
        question: 'Is this paid right now?',
        answer:
          "You earn points from your first post and points convert to vouchers. Cash payouts arrive with monetisation, and this cohort is first in line for it. That's the plan, not a contract.",
      },
      {
        question: 'What can I post about?',
        answer:
          'Anything you have a real opinion on. Cricket, politics, films, food, campus, money. Opinions, not news reports.',
      },
      {
        question: 'When does Riffi launch?',
        // [FILL] 2 - launch timing. It must agree with the weekly commitment in the seats block.
        answer: "We're in build. This cohort gets in before public launch.",
      },
      {
        question: 'Who owns what I post?',
        // [FILL] 3 - content ownership, confirmed against the real terms, or remove this question.
        answer: 'You do. You keep the rights to your posts and you can take them anywhere.',
      },
    ],
  },
  close: {
    heading: '50 seats. Batch one.',
    body: "If you've got opinions and you're tired of shouting them into a feed that doesn't know you, take one.",
    // [FILL] 4 - the footer legal / contact line. Leave empty to show the wordmark only.
    footerLine: '',
  },
};
