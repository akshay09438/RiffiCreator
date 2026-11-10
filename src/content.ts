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
    fields: Record<'name' | 'phone' | 'email' | 'handle' | 'username' | 'consent', string>;
  };
  siteUrl: string;
  whatsapp: { enabled: boolean; number: string; message: string };
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
  // form's own page: Name, Phone No., Email ID, Instagram/X Handle, Riffi Username, and (10 Nov 2026)
  // "Permission given (recorded by the page)", a short-answer question that receives the permission sentence.
  form: {
    responseUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSf1NSzQzKJUYV-DX8yS4N153xeTYsb6-FCxNST98HVcsn6RGA/formResponse',
    fields: {
      name: 'entry.1947302392',
      phone: 'entry.19523587',
      email: 'entry.1533783917',
      handle: 'entry.990724691',
      username: 'entry.1972389049',
      consent: 'entry.271629296',
    },
  },
  // The live domain: the short address riffi-creators.vercel.app, added in Vercel on 2 Nov 2026 (the old
  // riffi-creator-page.vercel.app still works). The preview card Instagram shows is built from it.
  siteUrl: 'https://riffi-creators.vercel.app',
  whatsapp: {
    enabled: false,
    // Digits only, with the country code and no plus sign. Needed only when `enabled` is true.
    number: '',
    message: "I'm in",
  },
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
    // No account is named here (founder's direction, 2 Nov 2026).
    helper: 'About a minute.',
    whatsappLabel: 'Or message us on WhatsApp',
  },
  hero: {
    titleLines: ['You came in early.', 'Thank you for trusting us.'],
    subline:
      'Launch is taking longer because we want it right. New estimate: mid-November, end of November at the very worst.',
    sampleTake: {
      chip: 'sample take',
      text: 'Being early beats being good.',
      agree: { label: 'agree', percent: 71 },
      disagree: { label: 'disagree', percent: 29 },
      votes: 2140,
      votesLabel: 'votes',
    },
  },
  // What is waiting for them (2 Nov 2026). The wording is the founder's own, from the creator
  // screen in the app. "At launch" and "Soon" are used instead of the app's "Live" and "Soon",
  // because the page says Riffi has not launched. Nothing here is a number, a payout or a promise
  // of money: the two "Soon" perks are named as a plan, in the framing line.
  perks: {
    heading: "What's waiting for you.",
    lead: 'Everything below comes with being first in.',
    items: [
      { label: 'Boosted reach on your posts', when: 'At launch' },
      { label: 'A direct line to the Riffi team', when: 'At launch' },
      { label: 'Early access to new features', when: 'At launch' },
      { label: 'First pick of the brand deals', when: 'Soon' },
      { label: 'First in line for creator earnings', when: 'Soon' },
    ],
    framing: '"Soon" is our plan, not a contract.',
  },
  badge: {
    heading: 'Your Founding Creator badge.',
    lead: "Everyone who came in early gets one. It's yours when we launch.",
    alt: 'The Riffi Founding Creator badge: a bronze coin with the Riffi R.',
    image: '/media/badge.webp',
  },
  join: {
    heading: 'Your details.',
    lead: 'Five fields. About a minute.',
    // Said next to the small coin beside the form; the coin itself is decorative there.
    badgeNote: 'Your Founding Creator badge is waiting.',
    // Empty on purpose: the coin beside the form is decorative, the note next to it says it in words.
    badgeAlt: '',
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
    // The permission line (10 Nov 2026), shown beside a required tick box that is never pre-ticked. It
    // asks for permission to show their content on their own Riffi profile, not to own it, so it agrees
    // with the FAQ ("You keep the rights to your posts"). The take-down promise is the founder's to keep.
    consent:
      "I agree that Riffi can upload pieces of my own Instagram content (like my reels and posts) to my Riffi profile, for the username I'm reserving here. I keep ownership of my content, and I can ask Riffi to take any of it down.",
    error: "That didn't go through. Check your connection and try again.",
    sentHeading: 'Got it. Thank you.',
    // No address named on purpose (founder, 2 Nov 2026): only that an email will come.
    sentBody: "Your details are with us. Once the launch date is fixed, we'll send you an email.",
    // Their own username, read back to them (2 Nov 2026). Only ever shown to the person who typed it.
    sentHolding: (username: string) => `We're holding @${username} for you.`,
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
    body: "Send your details and we'll take it from there.",
    // The footer contact line, left to Claude by the founder (1 Oct 2026). Empty shows the wordmark only.
    footerLine: 'Questions? Message @get.riffi on Instagram.',
  },
};
