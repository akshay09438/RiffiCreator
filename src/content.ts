/**
 * Every user-facing string and every page setting lives in this file (PRD 5.2, rule 2).
 *
 * Placeholders the founder must answer before the link goes to any creator carry a FILL tag in
 * square brackets on the comment line above them. `npm run presend` fails while any remain.
 * Never replace a placeholder with an invented figure.
 */

export type Settings = {
  instagramHandle: string;
  /** Where "Claim a seat" goes: the founder's Google Form (17 Sep 2026). */
  applyFormUrl: string;
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
    | 'applyFormUrl'
    | 'siteUrl',
    boolean
  >;
};

export const settings: Settings = {
  // Riffi's Instagram account, without the @. Confirmed by the founder on 17 Sep 2026.
  instagramHandle: 'get.riffi',
  // The founder's application form ("New creator onboarding - Riffi"), swapped in on 1 Oct 2026,
  // replacing the 17 Sep 2026 form. Every "Claim a seat" opens it.
  applyFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSeVrXx9tRYtsIjP_T9V7NnVbRJm2C-u5s5QrhlZDT4vVabY0Q/viewform',
  // The live domain, deployed 17 Sep 2026. The preview card Instagram shows is built from it.
  siteUrl: 'https://riffi-creator-page.vercel.app',
  whatsapp: {
    enabled: false,
    // Digits only, with the country code and no plus sign. Needed only when `enabled` is true.
    number: '',
    message: "I'm in",
  },
  seats: {
    total: 500,
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
    // Answered by the founder on 1 Oct 2026.
    weeklyCommitment: true,
    launchTiming: true,
    contentOwnership: true,
    footerLine: true,
    instagramHandle: true,
    applyFormUrl: true,
    siteUrl: true,
  },
};

export const content = {
  nav: {
    wordmark: 'Riffi',
    batch: 'Batch 01',
  },
  cta: {
    label: 'Claim a seat',
    helper: `A one minute form. We reply from @${settings.instagramHandle}`,
    whatsappLabel: 'Or message us on WhatsApp',
  },
  hero: {
    titleLines: [
      "On Instagram you're one of lakhs.",
      "Here you're one of the first, with almost no competition.",
    ],
    subline:
      "Riffi is India's platform for opinions. We're taking 500 creators in before launch and pointing the feed at them.",
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
    heading: "Or type it, if that's more your thing.",
    lead: 'Same forty seconds either way. What matters is that the post is your opinion, not the news.',
    notTake: {
      chip: 'not a take',
      text: 'The new season dropped on Friday.',
      caption: "That's news. It's already everywhere.",
    },
    take: {
      chip: 'a take',
      text: 'Every season after the third is just fan service with a budget.',
      caption: "That's yours. Nobody else posted it.",
    },
    categories: [
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
    ],
    marqueeLabel: 'Sample takes',
    marqueeChip: 'sample take',
    marqueeTakes: [
      'Your favourite startup is a spreadsheet with a good logo.',
      "Bengaluru traffic isn't an infrastructure problem, it's a scheduling one.",
      'Every biopic in the last five years is an ad for its subject.',
      "Filter coffee beats any third-wave pour over and it isn't close.",
      'Hostel mess food built more resilience than any gym ever will.',
      'Reels killed the Indian meme page.',
      'Paneer is overrated and we all know it.',
      'Every playlist app ends up playing the same six songs.',
    ],
  },
  videoTakes: {
    heading: "You already shoot reels. Here it's just you, talking.",
    lead: 'No hook, no thumbnail, no four hour edit. Point the phone at yourself, say what you actually think, and post it. The room votes on the opinion, not the edit.',
    badge: '40 seconds, one opinion',
    chip: 'sample',
    items: [
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
    ],
    // Said out loud on the page, because a face on a card otherwise reads as a Riffi creator.
    stillNote: 'Stock stills and sample takes. Nobody has posted on Riffi yet, which is the point.',
    // The stills are decoration behind the caption, so they carry no alternative text of their own.
    stillAlt: '',
    // Pictures of the format, never a real post: no clip loads and nothing plays on tap.
    footer: 'One rule, whatever you shoot: it has to be your opinion, not the news.',
  },
  whyHere: {
    heading: "You're not early on Instagram. You're early here.",
    instagramLabel: 'Instagram',
    riffiLabel: 'Riffi',
    rows: [
      { label: "Creators you're up against", instagram: 'Lakhs', riffi: '499' },
      {
        label: 'Who decides your reach',
        instagram: 'A feed tuned for watch time',
        riffi: "A feed we're still writing",
      },
      { label: 'What your first post gets', instagram: 'Buried', riffi: 'The front page' },
      {
        label: "How you'll earn",
        instagram: 'Brand deals, if one finds you',
        riffi: "Engagement, once we're big enough",
      },
      {
        label: 'What you own at the end',
        instagram: 'Followers on rented land',
        riffi: 'A position on a platform still being built',
      },
    ],
    closer: 'And a reel costs you four hours. A take costs you forty seconds.',
  },
  howYouEarn: {
    heading: 'What creators can do here.',
    lead: 'Five ways to put an opinion out. Pick whichever suits the take.',
    rows: [
      { action: 'Post a take', description: "One opinion, one line. That's the whole format." },
      {
        action: 'Write the long version',
        description: 'Some takes need a paragraph. Write it out when they do.',
      },
      {
        action: 'Add images',
        description: 'Screenshots, stills, memes. Whatever makes the point land.',
      },
      { action: 'Drop a story', description: 'Short-lived posts, the same as you already do.' },
      {
        action: 'Get the room talking',
        description: "Votes, replies and reshares. That's how you find out if the room agrees.",
      },
    ],
    note: "Straight answer on money: not on day one. Once Riffi has enough people reading, we start paying creators for the engagement their takes get. That means you don't need a brand deal to earn. Until then, what you get is the part that gets harder to buy later. The feed points at you, your first post lands on the front page, and you help set what this place sounds like.",
  },
  longGame: {
    // Two halves so the first can carry the marker sweep, the way the hero's second line does.
    headingMark: 'Early now.',
    headingRest: 'Paid for engagement later.',
    heading: 'Early now. Paid for engagement later.',
    items: [
      {
        title: 'Paid for engagement',
        body: "On Instagram, your views earn the platform money, not you. On Riffi, once we have enough users, we'll pay creators for the engagement their takes get: the votes, replies and reshares. We won't put a number on it today, because we'd be making it up. You'll see how it works before it starts.",
      },
      {
        title: 'No brand deal needed',
        body: "Most creators only earn once a brand picks them. Here, your takes can earn on their own. Brand deals are a bonus, not the only way in.",
      },
      {
        title: 'Batch one goes first',
        body: "When payments start, the creators who were here before launch are in the first group.",
      },
    ],
    framing:
      "All of this is our plan, not a contract. You're backing us early, and we'd rather you do it knowing exactly that.",
  },
  seats: {
    heading: "500 seats. Here's what we ask.",
    // The founder's answer (1 Oct 2026): no fixed ask, three or more takes a week appreciated.
    body: "No fixed number. Post as often as you like. If you can manage three or more takes a week before launch, that helps us a lot. No calls, no contracts, no exclusivity. Keep posting wherever else you post.",
    meterLabel: '500 seats in batch one',
    takenLabel: (taken: number, total: number) => `${taken} of ${total} seats taken`,
  },
  faq: {
    heading: 'Before you ask',
    items: [
      {
        question: 'Do I have to leave Instagram?',
        answer:
          'No. Keep posting exactly where you post now. A take is a sentence, not a shoot, so it sits alongside what you already do.',
      },
      {
        question: 'My following is small. Does that matter?',
        answer:
          "No. We're picking for takes, not reach. Most of this cohort is under 20k and that's deliberate.",
      },
      {
        question: 'Is this paid right now?',
        answer:
          "Not yet, and we won't pretend otherwise. Riffi hasn't launched. Once we have enough users, we start paying creators for the engagement their takes get, so you don't have to wait on brand deals to earn. Batch one is first in line. That's the plan, not a contract.",
      },
      {
        question: 'What can I post about?',
        answer:
          'Anything you have a real opinion on. Cricket, politics, films, food, campus, money. Opinions, not news reports.',
      },
      {
        question: 'When does Riffi launch?',
        // The founder's answer (1 Oct 2026): the last week of October. A target, so "aiming for".
        answer:
          "We're aiming for the last week of October. This cohort gets in before that, so your takes are already up when everyone else arrives.",
      },
      {
        question: 'Who owns what I post?',
        // The founder's answer (1 Oct 2026): creators own their posts.
        answer: 'You do. You keep the rights to your posts and you can take them anywhere.',
      },
    ],
  },
  close: {
    heading: '500 seats. Batch one.',
    body: "If you've got opinions and you're tired of shouting them into a feed that doesn't know you, take one.",
    // The footer contact line, left to Claude by the founder (1 Oct 2026). Empty shows the wordmark only.
    footerLine: 'Questions? Message @get.riffi on Instagram.',
  },
};
