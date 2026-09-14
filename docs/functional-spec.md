> **Functional spec for the Riffi creator page.** Saved by `/zuko:bootstrap` on 14 Sep 2026 from `rifii-creator-landing-prd.md` (PRD v1.0, owner Zyra). This is a living document: it is updated in the same change as any decision that alters what the page does.
>
> **Changed from the original PRD, both founder-approved on 14 Sep 2026:** (1) the name is spelled **Riffi** throughout - the original spelled it "Rifii", including in the placeholder Instagram handle, which is still an open `[FILL]` input; (2) the FAQ answer "Is this paid right now?" now ends "That's the plan, not a contract.", so it meets the honesty rule in section 2.4. Nothing else was changed. Later decisions are logged in `docs/implementation-plan.md`.

---

# Riffi — Creator Program Landing Page
## Product Requirements & Technical Architecture

**For:** Claude Code
**Owner:** Zyra
**Version:** 1.0
**Status:** Ready to build, with 5 open inputs marked `[FILL]`

---

## 0. Read this first

You are building a **single static landing page**. No backend, no database, no forms, no auth, no CMS.

The page has one job: a creator who just got a DM from Zyra taps the link, reads for ninety seconds, and replies "I'm in."

That framing drives every decision below. Read Sections 1–3 before writing any code.

---

## 1. Context

### 1.1 What Riffi is

Riffi is a social platform for opinions, built for India. The thesis is a one-liner: **Twitter became the place for news. Riffi is the place for takes.**

A user posts a short opinion — a "take" — on anything: cricket, politics, films, food, campus life, money, music. Other users vote, argue, and reshare. Content is open-ended and argumentative by design. It is explicitly *not* news reporting, not headlines, not "what happened."

The platform is pre-launch. It has a wider product surface (polls, forecasting, accuracy tracking) that is **out of scope for this page**. See §1.4.

### 1.2 What the Creator Program is

Before launch, Riffi is recruiting **50 creators** to seed the platform.

They get:
- Reward points from their first post, across five earnable actions
- Points redeem into vouchers
- Priority access to every monetisation feature Riffi launches later — view-based performance payouts, brand deals, anything after that

Riffi gets: a platform that has real content and real creators on day one, and creators with a reason to stay.

### 1.3 Who lands on this page

| | |
|---|---|
| Who | Instagram creators making opinionated video content |
| Size | Under 20k followers |
| Life stage | Largely college students, early in their content journey |
| Categories | Politics, cricket, sports, entertainment, food, and adjacent |
| How they arrive | A personal Instagram DM from Zyra. **Never cold traffic.** |
| Device | Mobile, overwhelmingly. Mid-range Android. Often on 4G. |
| Browser | **Instagram's in-app browser**, not Chrome or Safari |

Three consequences you must design around:

1. **Mobile is the primary target, not the adaptation.** Design the mobile layout first and completely. Desktop is the second pass.
2. **The Instagram in-app browser is the real runtime.** It is a constrained WebView. Avoid `100vh` (use `100dvh`), avoid exotic APIs, keep JS small, test that nothing depends on browser chrome.
3. **They already got a warm intro.** The page does not need to establish awareness or trust from zero. It needs to make the offer concrete and make joining feel like a decision rather than a risk.

### 1.4 Explicitly out of scope

Do not put any of this on the page:

- Forecasting, predictions, accuracy percentages, "Top 3% in Cricket," "Called it" callouts
- The Forecaster profile card or any prediction UI
- App screenshots or device mockups of the product
- Anything about the consumer product beyond what a creator needs to know

This page is opinion-only, creator-only.

---

## 2. Strategy

### 2.1 The narrative spine

One argument, stated four ways:

> **On Instagram you are competing with lakhs of creators on an algorithm you don't control and can't see. Riffi is early enough that the algorithm is still being written — and we're pointing it at 50 people. Being early is the entire offer.**

Every section should be traceable back to that sentence. If a section isn't, cut it.

### 2.2 Objections, in the order they occur

Write the page so it answers these in sequence. This *is* the section order.

| # | What they're thinking | Section that answers it |
|---|---|---|
| 1 | What is this and is it real? | Hero |
| 2 | What would I even post? | What Riffi is |
| 3 | Why would I leave Instagram? | Why here, not there |
| 4 | Is this another full-time job? | Effort line (closes §3) |
| 5 | What do I get right now? | How you earn |
| 6 | What do I get later, actually? | The long game |
| 7 | What's expected of me? | 50 seats |
| 8 | Small edge cases | FAQ |
| 9 | How do I get in? | Close |

**Objection 4 is the most underrated.** A creator who shoots reels spends hours per post. A take on Riffi is a sentence. That is a real, honest, enormous advantage and most drafts will bury it. Give it a dedicated line in a dedicated position.

### 2.3 Tone

Direct. Confident. Low punctuation. Sentence case everywhere. Short sentences, some fragments. Indian-English register without forced slang — "lakhs" is natural, "bro" is not. No corporate voice, no exclamation marks, no emoji in body copy.

The page should sound like someone with an opinion, because that is the product.

### 2.4 Honesty guardrails — non-negotiable

Fifty creators in one cohort will compare notes with each other. A promise that slips costs more than a softer line would have earned. Build these in:

- Payout figures are labelled as **an example of the shape**, never a rate card
- Priority monetisation is described as **plan**, not contract. One explicit sentence says so.
- Reward point values are **not shown**, because they aren't final. The page says what earns points, not how many.
- **No fabricated scarcity.** No countdown timer, no "37/50 taken" unless that number is true and hand-maintained.
- No fake testimonials, no fake logos, no fake user counts
- Sample takes shown on the page are labelled as samples

This is not a compliance note. Honest framing converts better with this audience, who have been pitched by a hundred growth-hack programs already.

---

## 3. Design direction

### 3.1 The organising idea

**The poll bar is the structural device for the entire page.**

An opinion is a split. A horizontal bar divided into two weighted fills is the native visual object of this product and appears on no other landing page in this category. It does three jobs on this page:

- In the hero, it's a live sample poll that fills on load — the one orchestrated motion moment
- In the Instagram comparison, each row is a bar. The comparison *is* a vote.
- In the seats section, it's a fill meter

Do not use it decoratively anywhere else. Devices that appear everywhere stop encoding anything.

The secondary object is the **take card** — a short opinion with vote and reply counts. It is the product's atom, so it earns a consistent treatment. It appears in the hero and the marquee. **Do not put non-take content into take-shaped cards.** The comparison, the earn list, and the FAQ each get a different structural treatment.

### 3.2 Palette

Derived from the product UI (white base, pastel topic chips, black pill buttons, purple take accent). Six values, then a chip family.

```
--paper       #FFFFFF   page base
--recess      #F4F5F7   recessed bands, alternating sections
--ink         #000000   headlines, primary buttons. True black, not tinted.
--ink-soft    #5B6472   body copy, secondary text
--signal      #3B6EF3   primary brand blue, "agree" side of poll bars, links
--take        #6C4CF1   the take accent — used only on take objects
```

Chip family — these carry the playfulness and map to content categories:

```
--chip-blue-bg     #E4ECFF    --chip-blue-ink     #1B4BD1
--chip-butter-bg   #FFF0C7    --chip-butter-ink   #8A5A00
--chip-coral-bg    #FFE3DC    --chip-coral-ink    #C0392B
--hairline         #E6E8EC
```

Poll bars are `--signal` against `--chip-coral-bg` with `--chip-coral-ink` text. Two-sided, legible at small sizes, never relying on colour alone — always pair with a number or label.

**Do not** introduce: gradient meshes, glassmorphism, dark mode, a warm cream background, drop shadows on every card. One shadow token exists and is used only on the hero take card.

### 3.3 Typography

Two families, clearly distinct in role.

| Role | Family | Why |
|---|---|---|
| Display | **Archivo** variable, weight 700–800, width axis pushed to expanded on the largest lines | Placard energy. Reads like a statement being made loudly, which is the product. |
| Body / UI | **Hanken Grotesk** variable | High x-height, warm, holds up at 15px on a mid-range Android |

Both are variable fonts, both self-hosted via `@fontsource-variable`, both free.

Type rules:

- Sentence case throughout. **No all-caps labels.** No tracked-out eyebrows above headings.
- Display lines: tight leading (0.95–1.02), tight tracking (−0.02em to −0.03em)
- Body line length capped at 68 characters — enforce with `max-width: 34rem` on prose blocks
- Body: 17px mobile / 18px desktop, line-height 1.55
- Do not accent a single word in a headline with colour or italic. If a line needs emphasis, restructure the line.
- Copy is Latin-script Hinglish where natural. No Devanagari — the chosen faces don't cover it.

Type scale (mobile → desktop):

```
display-xl   40px → 76px    hero h1
display-l    30px → 48px    section headings
display-m    22px → 28px    sub-headings, the big "50"
body-l       18px → 20px    hero subline, lead paragraphs
body         17px → 18px    everything else
meta         13px → 14px    labels, helper text, counts
```

### 3.4 Layout

**Left-aligned throughout.** A centred hero is the default choice and this brief doesn't need it. Left alignment reads faster on mobile and gives the display type a strong edge to hang on.

- Content column: `max-width 1120px`, gutters 20px mobile / 40px desktop
- Prose sub-column capped at 34rem regardless of container width
- Sections alternate `--paper` and `--recess` to create rhythm without borders everywhere
- Radii: take cards 20px, chips fully rounded, buttons fully rounded pill, poll bars 999px. Deliberately different by object type, not one radius on everything.
- Vertical rhythm: 72px section padding on mobile, 128px on desktop

### 3.5 Motion

**One orchestrated moment, two reveals, nothing else.**

1. **Hero, on load:** headline lines rise in sequence (60ms stagger), then the sample poll bar fills from 0 to its final split over 900ms with an ease-out curve, then the vote count ticks up. This is the page's one showpiece. Spend the budget here.
2. **Comparison section, on scroll into view:** the four bars fill, staggered 80ms
3. **Seats section, on scroll into view:** the seat meter fills

That's it. Do **not** add fade-and-slide-up entrances to every section — it is the single clearest tell of a generated page. Hover lift belongs only on take cards, and only on pointer devices.

All of it wrapped in `prefers-reduced-motion: reduce`, where bars render at final state instantly and nothing translates.

### 3.6 Anti-patterns — do not ship these

- Centred hero with a gradient headline
- Identical rounded cards with the same grey shadow for every piece of content
- All-caps tracked eyebrow labels above section headings
- Meta strings joined with middle dots
- An arrow appended to button text
- Numbered markers 01 / 02 / 03 on content that isn't a sequence
- Stock photography, 3D blobs, generic illustration packs
- Monospace for small labels
- Countdown timers, spinning gradients, confetti
- Placeholder Lorem ipsum anywhere — every string ships real

---

## 4. Page specification

Eight blocks. Target total copy under 1,400 words. Mobile scroll length roughly seven screens.

Copy below is **production copy** unless marked `[FILL]`. Use it as written. If you improve a line, keep it in the voice of §2.3.

---

### Block 1 — Hero

**Job:** establish what this is and make the offer concrete inside five seconds.

**Nav** (not sticky on mobile; sticky on desktop with a 1px hairline once scrolled)
- Left: `Riffi` wordmark, Archivo 800
- Right: a chip reading `Batch 01`

**Content**

- H1 — `display-xl`, two lines forced with a hard break on desktop:
  > On Instagram you're one of lakhs.
  > Here you're one of 50.

- Subline — `body-l`, `--ink-soft`, capped at 34rem:
  > Riffi is India's platform for opinions. We're taking 50 creators in before launch and pointing the feed at them.

- Primary CTA — black pill, full-width on mobile, auto on desktop:
  > Claim a seat

  Helper text directly beneath, `meta`, `--ink-soft`:
  > Opens a DM with @riffi

- Below that, the **sample poll** — a take card containing:
  - Label chip: `sample take`
  - Take text, `display-m`: *"Being early beats being good."*
  - A poll bar splitting **71% agree / 29% disagree**
  - Vote count beneath: `2,140 votes`

  This is the orchestrated load moment (§3.5). It demos the product, states the page's thesis, and is itself an opinion — which is the joke and the point.

**Layout**
- Mobile: single column, H1 → subline → CTA → poll card
- Desktop ≥1024px: two columns, 7/5 split. Text left, poll card right, card rotated −2deg with the one shadow token.

**Acceptance**
- [ ] LCP element is the H1 and it renders without waiting on JS
- [ ] Poll bar animation does not cause layout shift (reserve the height)
- [ ] CTA reachable without scrolling on a 375×667 viewport

---

### Block 2 — What Riffi is

**Job:** make "a take" concrete so they know what they'd post.

Background: `--recess`

- H2 — `display-l`:
  > Twitter took news. We're taking opinions.

- Lead — `body-l`, 34rem cap:
  > Riffi is built for one thing: what you think. Not what happened, not who said it. Your take, and whether the room agrees.

- **The contrast pair.** Two blocks side by side on desktop, stacked on mobile. This is the clearest thing on the page — most creators genuinely don't know what "opinion content, not news" means until they see it.

  | Left | Right |
  |---|---|
  | Chip: `not a take` (coral) | Chip: `a take` (blue) |
  | "India won by 6 wickets in Chennai." | "Chasing in Chennai got easier and everyone's pretending it didn't." |
  | Caption: That's news. It's already everywhere. | Caption: That's yours. Nobody else posted it. |

- **Category chips**, wrapped, cycling the three chip colours:
  `Cricket` `Politics` `Movies` `Food` `Campus` `Money` `Music` `Startups` `Sports` `Fashion`

- **Marquee** — a single horizontal scrolling row of take cards, CSS-animated, paused on hover and under reduced-motion. Sample takes:
  - "Test cricket is the only format that still tells the truth."
  - "Bengaluru traffic isn't an infrastructure problem, it's a scheduling one."
  - "Every biopic in the last five years is an ad for its subject."
  - "Filter coffee beats any third-wave pour over and it isn't close."
  - "Hostel mess food built more resilience than any gym ever will."
  - "Reels killed the Indian meme page."
  - "Paneer is overrated and we all know it."
  - "The best captain of this generation isn't the one you're thinking of."

  Marquee must be `aria-hidden` with the takes also present in a visually-hidden list, and must not trap scroll on touch.

**Acceptance**
- [ ] Marquee loops seamlessly with no visible seam or jump
- [ ] Marquee is static under `prefers-reduced-motion`
- [ ] Contrast pair readable without horizontal scroll at 320px

---

### Block 3 — Why here, not there

**Job:** the emotional core. This is the section that converts.

Background: `--paper`

- H2 — `display-l`:
  > You're not early on Instagram. You're early here.

- **Four comparison rows, each rendered as a poll bar.** Row anatomy: a label above, then a bar split between an Instagram side (coral, small) and a Riffi side (signal blue, large), with the two values as text.

  | Label | Instagram | Riffi |
  |---|---|---|
  | Creators you're up against | Lakhs | 49 |
  | Who decides your reach | A feed tuned for watch time | A feed we're still writing |
  | What your first post gets | Buried | The front page |
  | What you own at the end | Followers on rented land | A position on a platform still being built |

  The bars fill on scroll-into-view, staggered (§3.5). The split proportions are illustrative and should be visually obvious as rhetoric, not data — keep the splits dramatic and identical in shape across rows so nobody reads them as measurements.

- **Closing line**, `display-m`, given its own breathing room with 48px of space above and below:
  > And a reel costs you four hours. A take costs you forty seconds.

  This is objection 4 (§2.2) and it is doing more work than it looks like. Do not fold it into a list.

**Acceptance**
- [ ] Bars are legible in greyscale — values are in text, never conveyed by colour alone
- [ ] Closing line is not inside a card

---

### Block 4 — How you earn

**Job:** show that earning starts immediately, without publishing numbers that aren't final.

Background: `--recess`

- H2 — `display-l`:
  > You earn from post one.

- **Five earn rows.** A plain list with hairline dividers — *not* five cards. Each row: action name (`body-l`, ink) on the left, one-line description (`body`, ink-soft) beneath, and on the right a small pill reading `points`.

  1. **Post a take** — The opinion itself. Every one counts.
  2. **Write the long version** — When a take needs more than a line, write it out.
  3. **Add images** — Screenshots, stills, memes, whatever makes the point land.
  4. **Drop a story** — Short-lived posts, same as you already do.
  5. **Get the room talking** — Votes, replies and reshares on your take earn on top.

- **Honest note** below the list, `meta`, `--ink-soft`:
  > Points convert to vouchers. Exact values go live with the app — we're still tuning them, and we'd rather publish them once than change them on you.

**Acceptance**
- [ ] No numeric point values anywhere in the DOM
- [ ] Rows are a semantic list, not divs

---

### Block 5 — The long game

**Job:** answer "what does this actually turn into" without overpromising.

Background: `--paper`

- H2 — `display-l`:
  > Points now. Priority later.

- **Three items**, stacked, each with a heading (`display-m`) and two lines of body:

  1. **Performance payouts**
     When we switch on view-based payouts, this cohort is in the first batch. To give you the shape of it: a post crossing a lakh views lands somewhere in the ₹5,000–10,000 band. That's an illustration, not a rate card — we'll publish real slabs before it goes live.

  2. **Brand deals**
     Brands reach a platform through its top creators. On a platform with 50 creators, that's a much shorter list than the one you're on now.

  3. **Whatever comes after**
     Subscriptions, tipping, whatever we build — this cohort gets it before anyone else. That's the deal for being here first.

- **Honest framing line**, set apart with a hairline above, `body`, `--ink-soft`:
  > All of this is our plan, not a contract. We'd rather you come in knowing exactly that.

**Acceptance**
- [ ] The ₹ figure is visually and grammatically framed as an example in the same sentence it appears

---

### Block 6 — 50 seats

**Job:** state the commitment and the scarcity in the same breath, so scarcity reads as a standard rather than a trick.

Background: `--recess`

- A very large `50` — Archivo 800, expanded width, `clamp(96px, 22vw, 200px)`, sitting flush left against the gutter. The one moment of pure typographic scale on the page.

- H2 beside or beneath it, `display-l`:
  > 50 seats. Here's what we ask.

- Body, 34rem cap:
  > `[FILL — commitment]` *Placeholder: Post three takes a week through the pre-launch period. That's the whole ask. No calls, no contracts, no exclusivity — keep posting wherever else you post.*

- **Seat meter** — a poll-bar-shaped fill showing seats taken. Controlled by config:
  ```ts
  seats: { total: 50, taken: null, show: false }
  ```
  When `taken` is `null` or `show` is `false`, render the bar empty with the label `50 seats in batch one` and no number. **Never render an invented figure.** If Zyra sets a real number, it displays.

**Acceptance**
- [ ] With default config, no seat count appears anywhere
- [ ] The `50` does not overflow at 320px

---

### Block 7 — FAQ

**Job:** clear the last small doubts. Six questions, accordion, first one open by default.

Background: `--paper`

- H2 — `display-l`:
  > Before you ask

| Q | A |
|---|---|
| Do I have to leave Instagram? | No. Keep posting exactly where you post now. A take is a sentence, not a shoot — this sits alongside what you already do. |
| My following is small. Does that matter? | No. We're picking for takes, not reach. Most of this cohort is under 20k and that's deliberate. |
| Is this paid right now? | You earn points from your first post and points convert to vouchers. Cash payouts arrive with monetisation, and this cohort is first in line for it. That's the plan, not a contract. |
| What can I post about? | Anything you have a real opinion on. Cricket, politics, films, food, campus, money. Opinions, not news reports. |
| When does Riffi launch? | `[FILL — launch timing]` |
| Who owns what I post? | `[FILL — confirm against terms]` *Placeholder: You do. You keep the rights to your posts and you can take them anywhere.* |

**Accordion requirements:** native `<details>`/`<summary>` styled, or a button-based implementation with `aria-expanded` and `aria-controls`. Animate height on open. 44px minimum tap target on the summary row.

---

### Block 8 — Close

**Job:** the decision.

Background: `--ink` (black), white text. The only inverted section on the page — the page ends where the primary button has been all along.

- H2 — `display-l`, white:
  > 50 seats. Batch one.

- Body, white at 70% opacity, 34rem cap:
  > If you've got opinions and you're tired of shouting them into a feed that doesn't know you, take one.

- CTA — white pill, black text:
  > Claim a seat

  Helper beneath, `meta`, white at 60%:
  > Opens a DM with @riffi

- Footer row, `meta`: `Riffi` wordmark left, `[FILL — any legal/contact line]` right.

---

## 5. Technical architecture

### 5.1 Stack

| Layer | Choice | Rationale |
|---|---|---|
| Build | **Vite 6** | Fast, static output, zero config overhead for one page |
| Framework | **React 19 + TypeScript** | Component structure makes copy iteration cheap; Zyra will iterate a lot |
| Styling | **Tailwind CSS v4** with a CSS-variable token layer | v4's `@theme` maps cleanly onto the token system in §3.2 |
| Animation | **CSS only**, plus a ~20-line `useInView` hook over `IntersectionObserver` | The page has one showpiece and two reveals. A 40KB animation library cannot be justified against a 4G Android budget. |
| Fonts | `@fontsource-variable/archivo`, `@fontsource-variable/hanken-grotesk` | Self-hosted, no third-party round trip, works in constrained WebViews |
| Icons | **Lucide React**, tree-shaken, max 6 icons imported | |
| Deploy | **Vercel** or **Cloudflare Pages**, static output | |
| Analytics | Optional. **Plausible** or **Umami** only — cookieless, so no consent banner. Off by default. | |

**Explicitly not used:** Next.js (no routing, no SSR need), Framer Motion, any UI kit, any form library, any state management library.

### 5.2 Two rules that matter more than the rest

**Rule 1 — every brand decision lives in `src/styles/tokens.css`.**
The brand kit is arriving after this build. When it does, the swap must be editing one file: colours, font families, radii, shadow. No hex value and no font name appears anywhere else in the codebase. No Tailwind arbitrary colour values like `bg-[#3B6EF3]`.

**Rule 2 — every string lives in `src/content.ts`.**
Zyra will rewrite copy repeatedly without touching components. Components read from the content module and render. No hardcoded user-facing string in any `.tsx` file. This also makes the `[FILL]` items a single findable list.

### 5.3 File tree

```
riffi-creator/
├─ index.html
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
├─ public/
│  ├─ og.png                    1200×630, see §5.6
│  ├─ favicon.svg
│  └─ apple-touch-icon.png      180×180
└─ src/
   ├─ main.tsx
   ├─ App.tsx                   composes blocks in order, nothing else
   ├─ content.ts                ALL copy + config. Single source of truth.
   ├─ styles/
   │  ├─ tokens.css             ALL brand values. Single source of truth.
   │  └─ global.css             resets, base type, @theme mapping
   ├─ hooks/
   │  ├─ useInView.ts
   │  └─ useReducedMotion.ts
   ├─ components/
   │  ├─ primitives/
   │  │  ├─ Section.tsx         wrapper: background variant + vertical rhythm
   │  │  ├─ Chip.tsx            variant: blue | butter | coral | neutral
   │  │  ├─ PollBar.tsx         THE structural device. See §5.5.
   │  │  ├─ TakeCard.tsx        the product atom
   │  │  └─ CtaButton.tsx       variant: dark | light
   │  └─ blocks/
   │     ├─ Nav.tsx
   │     ├─ Hero.tsx
   │     ├─ WhatRiffiIs.tsx
   │     ├─ WhyHere.tsx
   │     ├─ HowYouEarn.tsx
   │     ├─ LongGame.tsx
   │     ├─ Seats.tsx
   │     ├─ Faq.tsx
   │     └─ Close.tsx
   └─ lib/
      └─ cta.ts                 builds the DM link, see §5.4
```

### 5.4 The CTA — no form, no backend

The only conversion action is opening a DM. Implement in `src/lib/cta.ts`:

```ts
// Instagram DM deep link. Works in-app and on web.
// From inside Instagram's own browser this opens the thread directly.
export const ctaHref = `https://ig.me/m/${config.instagramHandle}`;
```

Requirements:
- `target="_blank"` with `rel="noopener noreferrer"`
- Handle configurable in `content.ts` as `instagramHandle`
- Optional WhatsApp fallback behind a config flag: `https://wa.me/<number>?text=<encoded>`
- **No `<form>`, no email capture, no third-party embed.** If a future version needs a form, it gets added then.

### 5.5 `PollBar` — the one component to get right

This carries the page. Spec it precisely.

```ts
interface PollBarProps {
  left:  { label: string; value: string; weight: number }
  right: { label: string; value: string; weight: number }
  variant: 'sample' | 'comparison' | 'meter'
  animateOnView?: boolean
  showPercent?: boolean
}
```

- Fills animate via a CSS custom property transition on `width`, not JS per-frame
- Animation triggers on `useInView` for `comparison` and `meter`, on mount for `sample`
- Under reduced motion, renders at final width with no transition
- Both sides' text values always present in the DOM — the bar is never the only carrier of meaning
- Bar height: 44px mobile, 52px desktop. Radius 999px. Labels sit inside the fill when there's room, outside when there isn't.
- Container has a fixed height so animation causes zero CLS

### 5.6 Meta and the OG image

**The OG image is part of the pitch.** When Zyra pastes this link into an Instagram DM, Instagram renders a preview card. That card is seen before the page is. Treat it as a first impression, not an afterthought.

`public/og.png`, 1200×630, designed to the same system:
- White ground
- `Riffi` wordmark
- The line: *On Instagram you're one of lakhs. Here you're one of 50.*
- One poll bar at 71/29

Head tags in `index.html`:

```html
<title>Riffi Creator Program — 50 seats</title>
<meta name="description" content="Riffi is India's platform for opinions. We're taking 50 creators in before launch.">
<meta property="og:title" content="On Instagram you're one of lakhs. Here you're one of 50.">
<meta property="og:description" content="The Riffi Creator Program. 50 seats, batch one.">
<meta property="og:image" content="https://<domain>/og.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FFFFFF">
```

Leave the page indexable. Add `noindex` only if Zyra asks.

---

## 6. Responsive specification

Mobile-first. Write base styles for 360px and layer up.

| Breakpoint | Width | What changes |
|---|---|---|
| base | 320–767 | Single column. Full-width CTAs. 20px gutters. Poll card below hero text. Contrast pair stacked. Nav not sticky. |
| `md` | 768–1023 | 32px gutters. Contrast pair goes side by side. Earn rows get right-aligned pills. |
| `lg` | 1024–1279 | Hero splits 7/5 with rotated poll card. Nav becomes sticky. 40px gutters. Section padding to 112px. |
| `xl` | 1280+ | Container caps at 1120px and centres. Display type reaches max scale. Section padding 128px. |

Hard requirements:

- **Nothing breaks at 320px.** Test explicitly.
- **No horizontal overflow at any width.** The `50` and the marquee are the two likely offenders — constrain both.
- Use `100dvh` not `100vh`. The IG in-app browser's chrome changes height on scroll.
- Tap targets minimum 44×44px
- Type scales via `clamp()` rather than breakpoint jumps, so intermediate widths look intentional
- Test at 360×640 (common Android), 375×667 (small iPhone), 390×844, 768×1024, 1440×900

---

## 7. Performance, accessibility, quality floor

### Performance budget

| Metric | Target |
|---|---|
| LCP on simulated 4G | < 2.0s |
| CLS | < 0.02 |
| Total JS, gzipped | < 90KB |
| Total page weight | < 400KB |
| Lighthouse Performance, mobile | ≥ 95 |

How to hit it:
- Font subsetting to Latin only; `font-display: swap`; preload the two variable font files
- No images above the fold except the wordmark (SVG, inlined)
- `content-visibility: auto` on below-fold sections
- Zero render-blocking third-party requests

### Accessibility

- Semantic landmarks: `header`, `main`, `footer`, `section` with `aria-labelledby`
- One `h1`, then correctly nested `h2` per block
- Contrast ≥ 4.5:1 for body, ≥ 3:1 for large display. **Check `--ink-soft` on `--recess` explicitly** — it's the one pairing likely to fail.
- Visible focus rings, 2px `--signal` with 2px offset. Never `outline: none` without a replacement.
- `prefers-reduced-motion: reduce` honoured everywhere, including the marquee
- Accordion: proper `aria-expanded` / `aria-controls`, keyboard operable
- Marquee `aria-hidden` with a visually-hidden equivalent list
- Lighthouse Accessibility ≥ 100

---

## 8. Open inputs — `[FILL]`

Five items need Zyra's answer. Put every one in `content.ts` with a clear placeholder and a `// [FILL]` comment so they're greppable. Build the page complete with placeholders rather than blocking.

| # | Where | What's needed | Placeholder in place |
|---|---|---|---|
| 1 | Block 6 | The actual weekly commitment asked of creators | "Post three takes a week through the pre-launch period" |
| 2 | Block 7 | Launch timing answer | "We're in build. This cohort gets in before public launch." |
| 3 | Block 7 | Content ownership answer, confirmed against terms | "You do. You keep the rights to your posts." |
| 4 | Block 8 | Footer legal / contact line | Wordmark only |
| 5 | Global | Instagram handle for the DM link, and the deploy domain | `riffi` |

Plus: the **brand kit** (logo, colours, typefaces) arrives separately. Build to §3 now. The swap is `tokens.css` plus one wordmark SVG.

---

## 9. Build order

Work in this sequence. Do not jump ahead — the token and content layers must exist before any block is written, or strings and hex values will leak into components.

1. Scaffold Vite + React + TS + Tailwind v4. Verify the dev server runs.
2. Write `tokens.css` completely, mapped through Tailwind v4 `@theme`. Write `global.css` with resets and base type.
3. Install and wire both variable fonts. Confirm they render before proceeding.
4. Write `content.ts` in full, including all `[FILL]` placeholders with comments.
5. Build primitives: `Section`, `Chip`, `CtaButton`, `TakeCard`, and `PollBar`. **Build `PollBar` last of these and build it carefully** — §5.5 is the spec.
6. Build blocks in page order, 1 through 8. Check each at 320px before moving to the next.
7. Wire the three motion moments. Verify each under `prefers-reduced-motion`.
8. Produce `og.png` and the favicon set. Wire head tags.
9. Audit pass: Lighthouse mobile, 320px overflow check, keyboard-only pass, greyscale pass.
10. Self-critique against §3.6. Cut one thing.

---

## 10. Definition of done

- [ ] All eight blocks built, real copy, zero Lorem
- [ ] Zero hex values or font names outside `tokens.css`
- [ ] Zero user-facing strings outside `content.ts`
- [ ] No horizontal overflow between 320px and 1920px
- [ ] Works in the Instagram in-app browser on both iOS and Android
- [ ] Lighthouse mobile: Performance ≥ 95, Accessibility 100, Best Practices ≥ 95
- [ ] `prefers-reduced-motion` renders a complete, static, correct page
- [ ] Keyboard-only navigation reaches both CTAs and operates the accordion
- [ ] Page readable and comprehensible in greyscale
- [ ] No point values, no fabricated seat counts, no countdown, no guaranteed-earnings language
- [ ] OG preview renders correctly when the link is pasted into an Instagram DM
- [ ] All five `[FILL]` items present as greppable placeholders
- [ ] Total JS under 90KB gzipped

---

## Appendix — copy reference

Every user-facing string, for `content.ts`.

**Nav:** `Riffi` · `Batch 01`

**Hero**
- H1: `On Instagram you're one of lakhs. Here you're one of 50.`
- Sub: `Riffi is India's platform for opinions. We're taking 50 creators in before launch and pointing the feed at them.`
- CTA: `Claim a seat` / helper: `Opens a DM with @riffi`
- Sample take: `Being early beats being good.` — chip `sample take`, 71% agree / 29% disagree, `2,140 votes`

**What Riffi is**
- H2: `Twitter took news. We're taking opinions.`
- Lead: `Riffi is built for one thing: what you think. Not what happened, not who said it. Your take, and whether the room agrees.`
- Not a take: `India won by 6 wickets in Chennai.` / `That's news. It's already everywhere.`
- A take: `Chasing in Chennai got easier and everyone's pretending it didn't.` / `That's yours. Nobody else posted it.`
- Chips: `Cricket` `Politics` `Movies` `Food` `Campus` `Money` `Music` `Startups` `Sports` `Fashion`
- Marquee: the eight takes listed in Block 2

**Why here, not there**
- H2: `You're not early on Instagram. You're early here.`
- Rows as tabulated in Block 3
- Closer: `And a reel costs you four hours. A take costs you forty seconds.`

**How you earn**
- H2: `You earn from post one.`
- Five rows as written in Block 4
- Note: `Points convert to vouchers. Exact values go live with the app — we're still tuning them, and we'd rather publish them once than change them on you.`

**The long game**
- H2: `Points now. Priority later.`
- Three items as written in Block 5
- Framing: `All of this is our plan, not a contract. We'd rather you come in knowing exactly that.`

**Seats**
- `50`
- H2: `50 seats. Here's what we ask.`
- Body: `[FILL]`
- Meter label: `50 seats in batch one`

**FAQ**
- H2: `Before you ask`
- Six Q&As as tabulated in Block 7

**Close**
- H2: `50 seats. Batch one.`
- Body: `If you've got opinions and you're tired of shouting them into a feed that doesn't know you, take one.`
- CTA: `Claim a seat` / helper: `Opens a DM with @riffi`
