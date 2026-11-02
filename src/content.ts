/**
 * Every user-facing string and every page setting lives in this file (PRD 5.2, rule 2).
 *
 * Placeholders the founder must answer before the link goes to any creator carry a FILL tag in
 * square brackets on the comment line above them. `npm run presend` fails while any remain.
 * Never replace a placeholder with an invented figure.
 */

export type Settings = {
  instagramHandle: string;
  /**
   * The page's own form posts to a Google Form behind the scenes (2 Nov 2026): the creator sees a
   * designed form, the founder reads the answers in the Form's response sheet. `responseUrl` is the
   * Form's formResponse address; `fields` maps each question to its entry id.
   */
  form: {
    responseUrl: string;
    fields: Record<'name' | 'phone' | 'email' | 'handle' | 'username', string>;
  };
  siteUrl: string;
  whatsapp: { enabled: boolean; number: string; message: string };
  comparisonSplit: { instagram: number; riffi: number };
  inputsConfirmed: Record<
    | 'weeklyCommitment'
    | 'launchTiming'
    | 'contentOwnership'
    | 'footerLine'
    | 'instagramHandle'
    | 'formResponseUrl'
    | 'siteUrl',
    boolean
  >;
};

export const settings: Settings = {
  // Riffi's Instagram account, without the @. Confirmed by the founder on 17 Sep 2026.
  instagramHandle: 'get.riffi',
  // The founder's "Riffi Creator Username" Google Form, made on 2 Nov 2026. Entry ids read from the
  // form's own page: Name, Phone No., Email ID, Instagram/X Handle, Riffi Username.
  form: {
    responseUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSf1NSzQzKJUYV-DX8yS4N153xeTYsb6-FCxNST98HVcsn6RGA/formResponse',
    fields: {
      name: 'entry.1947302392',
      phone: 'entry.19523587',
      email: 'entry.1533783917',
      handle: 'entry.990724691',
      username: 'entry.1972389049',
    },
  },
  // The live domain, deployed 17 Sep 2026. The preview card Instagram shows is built from it.
  siteUrl: 'https://riffi-creator-page.vercel.app',
  whatsapp: {
    enabled: false,
    // Digits only, with the country code and no plus sign. Needed only when `enabled` is true.
    number: '',
    message: "I'm in",
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
    // Answered by the founder on 2 Nov 2026: the new form, in-page.
    formResponseUrl: true,
    siteUrl: true,
  },
};

export const content = {
  nav: {
    wordmark: 'Riffi',
    batch: 'Batch 01',
  },
  cta: {
    label: 'Send your details',
    helper: `About a minute. We reply from @${settings.instagramHandle}`,
    whatsappLabel: 'Or message us on WhatsApp',
  },
  hero: {
    titleLines: ['You came in early.', 'Thank you for trusting us.'],
    subline:
      "Riffi is taking longer to launch than we planned, because we want it right before you arrive. We now expect mid-November, and the end of November at the very worst.",
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
    heading: "When the doors open, this is the whole job.",
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
    heading: "What you signed up for hasn't changed.",
    instagramLabel: 'Instagram',
    riffiLabel: 'Riffi',
    rows: [
      { label: 'Who you share the feed with', instagram: 'Lakhs', riffi: 'A small first group' },
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
    heading: 'What happens next.',
    lead: 'Four steps from here to launch day.',
    rows: [
      {
        action: 'Send your details',
        description: 'Five short fields in the form further down. About a minute.',
      },
      {
        action: 'We hold your username',
        description: 'Once your details are in, your Riffi username is reserved for you.',
      },
      {
        action: 'We announce the date',
        description: "We'll message you the exact launch date as soon as we're sure of it.",
      },
      {
        action: 'You post first',
        description: 'Your takes are already up when everyone else arrives.',
      },
    ],
    note: "Straight answer on money: not on day one. Once Riffi has enough people reading, we start paying creators for the engagement their takes get. That means you don't need a brand deal to earn. Until then, what you get is the part that gets harder to buy later. The feed points at you, your first post lands on the front page, and you help set what this place sounds like.",
  },
  badge: {
    chip: 'Sneak peek',
    heading: 'One more thing.',
    lead: "We haven't told you about this yet. It's yours for coming in early, and we think you'll like it.",
    note: "We're keeping the rest back. You'll see it when the doors open.",
    alt: 'A coin, deliberately out of focus.',
    image: '/media/badge-teaser.webp',
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
  launch: {
    // Decorative, like the big number it replaces: the heading carries the meaning.
    bigWord: 'Nov',
    heading: 'Mid-November is our estimate.',
    body: "Thank you for waiting. We've used the time to get things right, so launch day works for all of you. We'll announce the exact date as soon as we're sure of it.",
    timeline: [
      { label: 'Our estimate', value: 'Mid-November' },
      { label: 'Worst case', value: 'End of November' },
      { label: 'Exact date', value: 'To be announced' },
    ],
    framing: "These are estimates, not promises. We'd rather tell you that than a date we might miss.",
  },
  join: {
    heading: 'Send us your details.',
    lead: 'We need five things to set you up before launch. It takes about a minute.',
    fields: {
      name: { label: 'Your name', autoComplete: 'name', type: 'text', placeholder: '' },
      email: { label: 'Your email', autoComplete: 'email', type: 'email', placeholder: '' },
      phone: { label: 'Your phone number', autoComplete: 'tel', type: 'tel', placeholder: '' },
      handle: {
        label: 'Your Instagram or X handle',
        autoComplete: 'off',
        type: 'text',
        placeholder: '@yourhandle',
      },
      username: {
        label: 'The username you want on Riffi',
        autoComplete: 'off',
        type: 'text',
        placeholder: 'yourname',
      },
    },
    submit: 'Send my details',
    sending: 'Sending',
    privacy: 'We use these details to reserve your username and set up your Riffi account.',
    error: "That didn't go through. Check your connection and try again.",
    sentHeading: 'Got it. Thank you.',
    sentBody: "Your details are with us. We'll message you from @get.riffi once the launch date is fixed.",
  },
  faq: {
    heading: 'Before you ask',
    items: [
      {
        question: 'When does Riffi launch?',
        answer:
          "Our estimate is mid-November, and the worst case is the end of November. We'll announce the exact date as soon as we're sure of it.",
      },
      {
        question: 'Why has it taken longer?',
        answer:
          "We wanted to get this right before anyone arrives, so launch day isn't the day we find the problems. Thank you for trusting us while we did.",
      },
      {
        question: 'What do you need from me?',
        answer:
          "Five details: your name, your email, your phone number, your current Instagram or X handle, and the username you want on Riffi. That's all we need to set you up.",
      },
      {
        question: 'Do I have to leave Instagram?',
        answer:
          'No. Keep posting exactly where you post now. A take is a sentence, not a shoot, so it sits alongside what you already do.',
      },
      {
        question: 'Is this paid right now?',
        answer:
          "Not yet, and we won't pretend otherwise. Riffi hasn't launched. Once we have enough users, we start paying creators for the engagement their takes get, so you don't have to wait on brand deals to earn. Batch one is first in line. That's the plan, not a contract.",
      },
      {
        question: 'Who owns what I post?',
        // The founder's answer (1 Oct 2026): creators own their posts.
        answer: 'You do. You keep the rights to your posts and you can take them anywhere.',
      },
    ],
  },
  close: {
    heading: 'Thank you for being first.',
    body: "You trusted us before there was anything to see. Send your details and we'll take it from there.",
    // The footer contact line, left to Claude by the founder (1 Oct 2026). Empty shows the wordmark only.
    footerLine: 'Questions? Message @get.riffi on Instagram.',
  },
};
