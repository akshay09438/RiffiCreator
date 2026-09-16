> **Functional spec for the Riffi creator page.** Saved by `/zuko:bootstrap` on 14 Sep 2026 from `rifii-creator-landing-prd.md` (PRD v1.0, owner Zyra). This is a living document: it is updated in the same change as any decision that alters what the page does.
>
> **Changed from the original PRD, both founder-approved on 14 Sep 2026:** (1) the name is spelled **Riffi** throughout - the original spelled it "Rifii", including in the placeholder Instagram handle, which is still an open `[FILL]` input; (2) the FAQ answer "Is this paid right now?" now ends "That's the plan, not a contract.", so it meets the honesty rule in section 2.4. Nothing else was changed. Later decisions are logged in `docs/implementation-plan.md`.
>
> **Changed again, both founder-decided on 16 Sep 2026:** (3) the hero's second line (Block 1, section 5.6 and the Appendix) now reads "Here you're one of the first, with almost no competition." (the founder's own words), replacing "Here you're one of 50." - carried through `index.html`'s `og:title` and the DM preview card; (4) **section 3's design direction is superseded.** The founder saw the built page, first asked for a flashier, funkier look, then corrected that to: the page itself stays white and colour lives only in the elements - drawn panels behind each coloured section, a 3px edge and a hard offset shadow on every card, chip and the button, outlined poll bars, a faint grid behind the page. Section 3 below is kept exactly as the original PRD wrote it, as the historical record of the direction this page was built to before the founder redirected it - see the note at the top of that section for what replaced it, and `docs/technical-spec.md` ("Design system - the sticker layer") for the as-built detail. Rationale and dates for both changes are in the decisions and drift logs in `docs/implementation-plan.md`.
>
> **Changed again, founder-decided 16 Sep 2026, later the same day (commit `441baba`):** (5) **reward points are gone from the offer.** Section 1.2, section 2.4's honesty guardrails, Block 4 ("How you earn"), Block 5 ("The long game") and the FAQ answer to "Is this paid right now?" all said a creator earns points from post one and that points convert to vouchers. None of that is true any more: the page now says plainly that there is no money yet, that joining batch one means backing Riffi early, and that batch one is first in line for real payouts and brand deals once Riffi can pay - still a plan, not a contract, never a promise. Each section below is rewritten to match, with a dated note; the original points-based offer is kept alongside it as the historical record. (6) **No em dash appears anywhere in the page's copy any more**, including `index.html`'s `<title>`, which changed from "Riffi Creator Program — 50 seats" to "Riffi Creator Program: 50 seats". Rationale and the full before/after text for both changes are in the decisions and drift logs in `docs/implementation-plan.md`.
>
> **Changed again, founder-decided 17 Sep 2026:** (7) **a ninth block, "Or just say it to camera," was added** between Block 2 ("What Riffi is") and Block 3 ("Why here, not there") - see Block 1a, below (it has since moved; see the next paragraph). It answers the same objection as Block 2, in video form: a take can be spoken instead of typed. Its three sample cards are pictures of the format only - no clip loads and nothing plays on tap, and no photograph of a real person appears in any of them; the founder's offer of frames pulled from other people's Instagram reels was turned down for this page, because those people never agreed to appear here and using their frames would wrongly suggest they post on Riffi. *(Superseded later the same day - see point (13) below: three licensed stock stills were added behind the cards' captions.)* (8) **Some of Block 2's sample copy moved away from cricket:** the news-versus-take contrast pair, two of the eight marquee takes, and the order of the category chips (Cricket now sits last, not first) - cricket previously anchored the contrast pair, the lead chip and two marquee lines all at once. Rationale and the full before/after text are in the decisions and drift logs in `docs/implementation-plan.md`.
>
> **Changed again, founder-decided 17 Sep 2026, shortly after the block above was added:** (9) **the video block now leads.** Riffi is pitching creators who already shoot reels, so the page opens on video, not text: the block from point (7) is renamed **Block 1a** and moves to sit directly after the Hero and before Block 2, with a new heading ("You already shoot reels. Here it's just you, talking."), a new lead and footer, and the lime drawn panel that Block 2 used to have. Block 2 ("What Riffi is") becomes the second, typed option - new heading "Or type it, if that's more your thing.", new lead, and it gives up its lime panel for plain white. Its original heading, "Twitter took news. We're taking opinions.", is gone from the page entirely (it is not carried anywhere else). See Block 1a and Block 2, below, and the decisions and drift logs in `docs/implementation-plan.md`.
>
> **Changed again, founder-decided 17 Sep 2026, after a review of the running page:** (10) **Block 4 is now a feature list, not an earnings pitch.** New heading "What creators can do here." and a new lead line, "Five ways to put an opinion out. Pick whichever suits the take."; the same five rows now render as bordered cards, two columns wide on a laptop, instead of a divided list. (11) **Block 5 drops its payout figure entirely.** The founder will not put a number on future payouts because today it would be invented: the ₹5,000-10,000 illustration, its "not a rate card" framing, and the word "tipping" are all gone. "Performance payouts" now says plainly that batch one is first in line once Riffi can pay for views, and that the real numbers arrive before anyone posts for them. Its heading is split into two fields so the marker-sweep treatment (§3 update, 16 Sep 2026) can wrap only "Early now.", while the full sentence "Early now. First in line later." stays the heading's accessible name for a screen reader. See Blocks 4 and 5, below, and the decisions and drift logs in `docs/implementation-plan.md`.
>
> **Changed again, founder-decided 17 Sep 2026, from a review on a laptop screen:** (12) **Five layout and honesty fixes.** The comparison bars in Block 3 now lead with Riffi - the blue fill starts at the left edge and the smaller, hollow Instagram side follows - reversed from the original Instagram-first order. The seat meter in Block 6 now draws its track only once a real count exists; with the default settings (`seats.taken` still `null`) no track appears at all, because an empty track is a picture of zero. Block 6 also gains a two-column layout on a laptop (the big 50 beside the ask) and a third "Claim a seat" button, so the primary button now appears three times on the page - hero, seats and close - not two. Block 5's heading and closing line, and Block 7's heading and question list, centre themselves on a laptop instead of hugging the content column's left edge. And Block 1a's sample cards now carry their take as a burned-in caption low in the frame, the way a real reel does, alongside the play mark, the sample pill and the length. (13) **Three licensed stock stills sit behind those captions** (`/media/sample-one.jpg`, `-two`, `-three`), one per card, lazy-loaded and sized so nothing shifts - reversing point (7) above, the block is no longer photo-free. A line under the deck says so plainly: "Stock stills and sample takes. Nobody has posted on Riffi yet, which is the point." A fourth image the founder offered, a named photographer's own promo card carrying his quote, was turned down for this page: on a creator-recruitment page it would read as his personal endorsement of the program, which a stock licence does not grant. See Blocks 1a, 3 and 6, below, and the decisions and drift logs in `docs/implementation-plan.md`.
>
> **Changed again, founder-decided 17 Sep 2026, later the same day:** (14) **The conversion is a Google Form, not an Instagram DM.** Every "Claim a seat" button - hero, seats and close - now opens the founder's form; `settings.applyFormUrl` holds the link, and the build refuses outright unless that URL is a genuine `forms.gle` or `docs.google.com/forms` address. The helper line beneath every button now reads "A one minute form. We reply from @get.riffi" in place of "Opens a DM with @riffi". See Blocks 1, 6 and 8, and §5.4, below. (15) **Three of the five open inputs (§8) are now answered:** the Instagram handle is real (`get.riffi`), the application form is real, and the page is deployed and live at `https://riffi-creator-page.vercel.app` - `settings.siteUrl` is that address, and the DM-preview card Instagram shows is built from it. The weekly commitment, launch timing, content ownership and footer line remain open. (16) The repository is now hosted on GitHub at `github.com/akshay09438/RiffiCreator` (branches `main` and `feat/creator-page`). Rationale and full before/after text for all of the above: `docs/implementation-plan.md`.

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

They got, in the original PRD *(superseded 16 Sep 2026 - see below and the note at the top of this document)*:
- Reward points from their first post, across five earnable actions
- Points redeem into vouchers
- Priority access to every monetisation feature Riffi launches later — view-based performance payouts, brand deals, anything after that

**Superseded 16 Sep 2026.** The founder removed reward points from the offer entirely, rather than publish point values that weren't final. What batch one actually gets now, described honestly as available today with no money attached: the feed pointed at them, their first post on the front page, and a hand in setting what the platform sounds like. What may come later, still a plan and never a contract: first in line for view-based performance payouts and brand deals, once Riffi can pay. See Block 4 and Block 5 below for the production copy, and `docs/implementation-plan.md` for the full reasoning.

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

*(Added 17 Sep 2026, then repositioned the same day: a ninth block, "You already shoot reels. Here it's just you, talking." - Block 1a, below - now sits between rows 1 and 2, and answers row 2's objection first, in video; the typed block (Block 2, "Or type it, if that's more your thing.") answers it second. Neither gets a numbered row of its own above, because video-first isn't a new objection - it's the same "what would I even post?" answered twice.)*

**Objection 4 is the most underrated.** A creator who shoots reels spends hours per post. A take on Riffi is a sentence. That is a real, honest, enormous advantage and most drafts will bury it. Give it a dedicated line in a dedicated position.

### 2.3 Tone

Direct. Confident. Low punctuation. Sentence case everywhere. Short sentences, some fragments. Indian-English register without forced slang — "lakhs" is natural, "bro" is not. No corporate voice, no exclamation marks, no emoji in body copy.

The page should sound like someone with an opinion, because that is the product.

### 2.4 Honesty guardrails — non-negotiable

Fifty creators in one cohort will compare notes with each other. A promise that slips costs more than a softer line would have earned. Build these in:

- Payout figures are labelled as **an example of the shape**, never a rate card. *(Tightened further 17 Sep 2026: the founder decided even a labelled illustration was still a number he'd be making up, so the one payout example on the page (Block 5, "Performance payouts") was removed rather than kept and labelled. No currency figure of any kind appears on the page today; this bullet's framing rule stays enforced in case one is ever reintroduced - see Block 5 and `docs/implementation-plan.md`.)*
- Priority monetisation is described as **plan**, not contract. One explicit sentence says so.
- Reward point values are **not shown**, because they aren't final. The page says what earns points, not how many. *(Superseded 16 Sep 2026: reward points were removed from the offer entirely rather than published unfinished - see section 1.2 and `docs/implementation-plan.md`. The rule this bullet enforced now reads: no money is claimed to exist today, anywhere on the page.)*
- **No fabricated scarcity.** No countdown timer, no "37/50 taken" unless that number is true and hand-maintained.
- No fake testimonials, no fake logos, no fake user counts
- Sample takes shown on the page are labelled as samples

This is not a compliance note. Honest framing converts better with this audience, who have been pitched by a hundred growth-hack programs already.

---

## 3. Design direction

> **Superseded 16 Sep 2026.** Sections 3.1-3.6 below are the *original* PRD direction and are kept exactly as written, as the historical record - they are no longer what the page looks like. The founder redirected the visual design after seeing the built page (first shown a flashier, funkier mock, then corrected to this instruction): **the page itself stays white; colour lives only in the elements.** In practice: each coloured section (`WhatRiffiIs`, `HowYouEarn`, `Seats`, and `Close` in ink) now renders as a drawn panel - a 3px ink edge, 32px corners and a hard offset shadow - rather than a full-bleed coloured band; every card, chip and the button carry the same drawn edge, with the button's shadow in signal blue instead of ink; poll bars are outlined; a faint grid sits behind the white page; and the hero's second line sits on an orange marker sweep. Two specific 3.2 rules no longer hold: the palette gains four values for this (`--lime`, `--flare`, `--edge`, `--grid-line`), and the "one shadow token, used only on the hero take card" rule is gone - every take card now draws an edge and a shadow. 3.4's vertical rhythm also changed (72/112/128px of section padding, mobile to desktop, is now 56/88/104px, since a panel supplies part of the rhythm itself). Full as-built detail: `docs/technical-spec.md`. Rationale and date: `docs/implementation-plan.md`.

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

Nine blocks *(a ninth was added 17 Sep 2026, then repositioned the same day to lead on video - see Block 1a, below, and the note at the top of this document)*. Target total copy under 1,400 words and mobile scroll length roughly seven screens are the PRD's original estimates for eight blocks and have not been re-measured against the ninth.

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
  > Here you're one of the first, with almost no competition.

  *(Founder's rewrite of the second line, 16 Sep 2026 - see the note at the top of this document. It carries the orange marker-sweep treatment described in the section 3 update above.)*

- Subline — `body-l`, `--ink-soft`, capped at 34rem:
  > Riffi is India's platform for opinions. We're taking 50 creators in before launch and pointing the feed at them.

- Primary CTA — black pill, full-width on mobile, auto on desktop:
  > Claim a seat

  Helper text directly beneath, `meta`, `--ink-soft`:
  > Opens a DM with @riffi

  *(Superseded 17 Sep 2026 - see the note at the top of this document. The button now opens the founder's application form, not a DM, and the helper line reads "A one minute form. We reply from @get.riffi". See §5.4, below, for the as-built link.)*

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

### Block 1a — You already shoot reels. Here it's just you, talking. *(added 17 Sep 2026, moved here the same day)*

**Job:** open on video, not text, because Riffi is pitching creators who already shoot reels - so the format they already use comes first, and the typed option (Block 2) comes second. Answers "what would I even post?" before Block 2 answers it a second way, in text.

*(This block was first added later than Hero, between Block 2 and Block 3, under the heading "Or just say it to camera." - see the note at the top of this document. The founder repositioned it ahead of Block 2 the same day, gave it a new heading and footer, and moved it from the pale-blue `sky` panel to the lime panel Block 2 used to have. The original heading, lead, footer and position are recorded in the Appendix.)*

Background: `--recess` - the lime drawn panel (see `docs/technical-spec.md`, "Design system"). Block 2, below, gives up this panel and goes plain white in exchange.

- H2 — `display-l`:
  > You already shoot reels. Here it's just you, talking.

- Lead — `body-l`, 34rem cap:
  > No hook, no thumbnail, no four hour edit. Point the phone at yourself, say what you actually think, and post it. The room votes on the opinion, not the edit.

- A small tilted orange badge:
  > 40 seconds, one opinion

- **Three sample cards**, equal height, tilted at a slightly different angle each, in a row that scrolls sideways on mobile and becomes three equal columns on a laptop (`lg`, added 17 Sep 2026). Each card is a **picture of the format**, not a real clip:
  - A coloured frame (a different pastel per card) standing in for video, with a decorative play-button mark in the middle that does nothing on tap
  - *(Added 17 Sep 2026)* A licensed **stock still** filling the frame behind everything else, lazy-loaded, sized so nothing shifts, and carrying no alt text of its own - the caption below is the only content a screen reader needs
  - A `sample` pill in one corner of the frame and the clip's length (for example `0:38`) in the opposite corner
  - *(Changed 17 Sep 2026)* The take's text as a **burned-in caption inside the frame**, low and centred on an ink block with paper text, the way a real reel carries it - not underneath the frame as plain text any more

  Sample takes and lengths shown, each now paired with its own still:
  1. "Every biopic in the last five years is an ad for its subject." - 0:38 - `/media/sample-one.jpg`
  2. "Bengaluru traffic is a scheduling problem, not a road problem." - 0:41 - `/media/sample-two.jpg`
  3. "Hostel mess food built more resilience than any gym ever will." - 0:29 - `/media/sample-three.jpg`

  **No real clip is loaded and nothing plays when a card is tapped.** *(Superseded in part, 17 Sep 2026 - see below.)* ~~No photograph of any real person appears in these cards, sample or otherwise.~~ The founder offered frames pulled from other people's Instagram reels for this block; they were turned down because the people in them never agreed to appear on this page, and using their frames would wrongly imply they already post on Riffi. Real frames are only ever added later, and only once Riffi owns the clip or the creator in it has agreed - see `docs/implementation-plan.md` for the decision.

  **17 Sep 2026, later the same day:** the founder asked for the cards to look less blank, so each frame now carries a **licensed stock still** behind its caption - a stand-in for the video image, exactly as the coloured frame always stood in for the video itself. A line under the deck says so out loud, so nobody reads a face on the card as a real Riffi creator:
  > Stock stills and sample takes. Nobody has posted on Riffi yet, which is the point.

  A fourth image the founder offered for this deck - a named photographer's own promotional card, carrying his quote - was turned down: on a page recruiting creators, using it would read as his personal endorsement of the program, which is not what a stock licence grants. See the decisions log in `docs/implementation-plan.md`.

- Footer line, `meta`, `--ink-soft` - the one rule that keeps this block honest about what belongs on Riffi, regardless of format:
  > One rule, whatever you shoot: it has to be your opinion, not the news.

**Acceptance**
- [ ] The frame's decorative parts - the still image, the play mark, the sample pill and the length - are hidden from assistive technology; the caption itself, and the word "sample" repeated inside it, stay reachable by a screen reader on every card
- [ ] No video actually loads and no clip plays on tap, anywhere in this block
- [ ] Every still is a licensed stock image, served only from this site, lazy-loaded and sized so it causes no layout shift; the line naming them as stock stills is present and visible
- [ ] Cards scroll sideways on mobile without trapping vertical page scroll on touch, and lay out as three equal columns on a laptop
- [ ] Sits directly between Block 1 (Hero) and Block 2 (What Riffi is) in the rendered page

---

### Block 2 — What Riffi is

**Job:** make "a take" concrete so they know what they'd post - now the second answer to that question, after Block 1a's video-first framing.

Background: `--paper` *(changed 17 Sep 2026; was `--recess`, the lime panel - Block 1a has it now, so the hierarchy reads video-first at a glance)*

- H2 — `display-l`:
  > Or type it, if that's more your thing.

  *(Rewritten 17 Sep 2026; was "Twitter took news. We're taking opinions." - recorded in the Appendix.)*

- Lead — `body-l`, 34rem cap:
  > Same forty seconds either way. What matters is that the post is your opinion, not the news.

  *(Rewritten 17 Sep 2026; was "Riffi is built for one thing: what you think. Not what happened, not who said it. Your take, and whether the room agrees." - recorded in the Appendix.)*

- **The contrast pair.** Two blocks side by side on desktop, stacked on mobile. This is the clearest thing on the page — most creators genuinely don't know what "opinion content, not news" means until they see it.

  *(Rewritten 17 Sep 2026 - see the note at the top of this document. The original pair used a cricket example; it's recorded in the Appendix.)*

  | Left | Right |
  |---|---|
  | Chip: `not a take` (coral) | Chip: `a take` (blue) |
  | "The new season dropped on Friday." | "Every season after the third is just fan service with a budget." |
  | Caption: That's news. It's already everywhere. | Caption: That's yours. Nobody else posted it. |

- **Category chips**, wrapped, cycling the three chip colours. Reordered 17 Sep 2026 so Cricket no longer leads - it was both the first chip and both sides of the contrast pair above; it's now the last chip:
  `Movies` `Politics` `Food` `Campus` `Money` `Music` `Startups` `Fashion` `Sports` `Cricket`

- **Marquee** — a single horizontal scrolling row of take cards, CSS-animated, paused on hover and under reduced-motion. Sample takes *(two replaced 17 Sep 2026, the same day the contrast pair and chip order above also moved away from cricket; both replaced lines were cricket takes and are recorded in the Appendix)*:
  - "Your favourite startup is a spreadsheet with a good logo."
  - "Bengaluru traffic isn't an infrastructure problem, it's a scheduling one."
  - "Every biopic in the last five years is an ad for its subject."
  - "Filter coffee beats any third-wave pour over and it isn't close."
  - "Hostel mess food built more resilience than any gym ever will."
  - "Reels killed the Indian meme page."
  - "Paneer is overrated and we all know it."
  - "Every playlist app ends up playing the same six songs."

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

- **Four comparison rows, each rendered as a poll bar.** Row anatomy: a label above, then a bar split between a Riffi side (signal blue, large) and an Instagram side (coral, small), with the two values as text. *(Reversed 17 Sep 2026: Riffi originally sat on the right with the fill growing from the right - see the drift log, 15 Sep 2026. The founder asked for Riffi to lead instead, so the blue fill now starts at the left edge and the smaller, hollow Instagram side follows it.)*

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

**Job:** show what a creator can actually do on Riffi, now that there is no money yet to pitch instead.

*(Rewritten 16 Sep 2026 — see the note at the top of this document. The heading, the row descriptions and the note below replace the original points-based versions; the right-hand `points` pill is gone entirely. Rewritten again 17 Sep 2026, after a founder review of the running page: it reads as a feature list now, not an earnings pitch - new heading, a new lead line, and the rows render as bordered cards rather than a divided list. The original heading and note are recorded in the Appendix, alongside section 1.2's original offer.)*

Background: `--recess`

- H2 — `display-l`:
  > What creators can do here.

  *(Rewritten 17 Sep 2026; was "What you get for going first" - recorded in the Appendix.)*

- Lead — `body-l`, ink, 34rem cap *(added 17 Sep 2026)*:
  > Five ways to put an opinion out. Pick whichever suits the take.

- **Five feature cards**, in a `<ul>` of bordered `<li>` cards - two columns on a laptop, one on mobile. *(Changed 17 Sep 2026; was a plain list with hairline dividers, explicitly "not five cards" - the founder's review reversed that.)* Each card: action name (`body-l`, bold, ink) then a one-line description (`body`, ink-soft) beneath. There is no pill on the card - it used to read `points`, and points no longer exist.

  1. **Post a take** — One opinion, one line. That's the whole format.
  2. **Write the long version** — Some takes need a paragraph. Write it out when they do.
  3. **Add images** — Screenshots, stills, memes. Whatever makes the point land.
  4. **Drop a story** — Short-lived posts, the same as you already do.
  5. **Get the room talking** — Votes, replies and reshares. That's how you find out if the room agrees.

- **Honest note** below the cards, `meta`, `--ink-soft` (unchanged since 16 Sep 2026):
  > Straight answer on money: there isn't any yet. Riffi hasn't launched, so anything we paid you today would be made up. What you get now is the part that gets harder to buy later. The feed points at you, your first post lands on the front page, and you help set what this place sounds like.

**Acceptance**
- [ ] No numeric point values anywhere in the DOM
- [ ] Cards are a semantic list (`<ul>`/`<li>`), not bare `<div>`s
- [ ] No present-tense claim of payment ("you earn", "we pay", "is/are paid") anywhere in the block - only a plan for later

---

### Block 5 — The long game

**Job:** answer "what does this actually turn into" without overpromising - and, since 17 Sep 2026, without inventing a number to do it.

*(Rewritten 16 Sep 2026 — see the note at the top of this document. The heading and framing line replaced the original points-based versions, recorded in the Appendix. Rewritten again 17 Sep 2026: the payout figure and its "example, not a rate card" framing, kept unchanged in substance through the 16 Sep pass, are now removed entirely, along with the word "tipping" - see below.)*

Background: `--paper`

- H2 — `display-l`, centred on a laptop *(centred 17 Sep 2026, alongside Block 7's; previously left-aligned like every other heading)*. Split into two spans so the marker-sweep treatment (§3 update, 16 Sep 2026) wraps only the first sentence, while the two together remain one accessible heading for a screen reader:
  > **Early now.** First in line later.

- **Three items**, stacked on mobile, three columns on `md` and up *(added 17 Sep 2026; previously always stacked)*, each with a heading (`display-m`) and two lines of body:

  1. **Performance payouts**
     When we can pay for views, batch one is in the first group. We are not putting a number on it today, because we would be making it up. You will see the real numbers before you post for them.

     *(Rewritten 17 Sep 2026; was: "When we switch on view-based payouts, batch one is in the first group. To give you the shape of it: a post crossing a lakh views lands somewhere in the ₹5,000 to ₹10,000 band. That's an illustration, not a rate card. We'll publish the real slabs before any of it goes live." The founder decided a made-up illustration was itself a small dishonesty the honesty guardrails (§2.4) should catch - so the guardrail was extended: no currency figure of any kind may appear on the page at all, not even a labelled example.)*

  2. **Brand deals**
     Brands reach a platform through its top creators. On a platform with 50 creators, that list is a lot shorter than the one you're on now.

  3. **Whatever comes after**
     Subscriptions, and anything else we build. Batch one gets it before anyone else.

     *(Reworded 17 Sep 2026; was "Subscriptions, tipping, anything else we build." The word "tipping" is gone.)*

- **Honest framing line**, set apart with a hairline above, `body`, `--ink-soft`, centred on a laptop *(centred 17 Sep 2026)*:
  > All of this is our plan, not a contract. You're backing us early, and we'd rather you do it knowing exactly that.

**Acceptance**
- [ ] No rupee sign, "Rs.", "INR" or any other currency figure appears anywhere in the block - or anywhere else on the page *(rewritten 17 Sep 2026; previously required only that a ₹ figure, if present, be framed as an example)*
- [ ] If a payout figure is ever reintroduced, its sentence still carries explicit example framing ("example", "shape", "illustration", "illustrative", "for instance") - the rule the removed ₹ figure used to satisfy stays enforced against that day
- [ ] No em dash anywhere in the block's text
- [ ] The heading's two spans read as one sentence, "Early now. First in line later.", to a screen reader

---

### Block 6 — 50 seats

**Job:** state the commitment and the scarcity in the same breath, so scarcity reads as a standard rather than a trick.

*(Laid out in two columns on a laptop, 17 Sep 2026 - see below - and gains a third "Claim a seat" button, so the ask and the button share a screen without scrolling.)*

Background: `--recess`

- A very large `50` — Archivo 800, expanded width, `clamp(96px, 22vw, 200px)`. On mobile it sits flush left against the gutter above the heading; on a laptop (`lg`, changed 17 Sep 2026) it moves into a 12-column grid beside the heading and body, roughly a 5/7 split, vertically centred against them. The one moment of pure typographic scale on the page.

- H2 beside or beneath it, `display-l`:
  > 50 seats. Here's what we ask.

- Body, 34rem cap:
  > `[FILL — commitment]` *Placeholder: Post three takes a week through the pre-launch period. That's the whole ask. No calls, no contracts, no exclusivity — keep posting wherever else you post.*

- **Seat meter** — a poll-bar-shaped fill showing seats taken. Controlled by config:
  ```ts
  seats: { total: 50, taken: null, show: false }
  ```
  When `taken` is `null` or `show` is `false`, **no track renders at all** - not even empty. *(Changed 17 Sep 2026: the original design rendered an empty outlined bar in this case, labelled `50 seats in batch one`; the founder judged an empty track to be "a picture of zero" and asked for it to disappear entirely rather than show empty. The label itself still renders on its own, without a bar above it.)* **Never render an invented figure.** If Zyra sets a real number and turns `show` on, the track appears and displays it.

- **A third "Claim a seat" button**, directly beneath the meter *(added 17 Sep 2026)*. The page is long on a laptop; the founder asked for the ask and the button to land in the same breath rather than making a laptop reader scroll back up or down to the nearest button.

**Acceptance**
- [ ] With default config, no seat count and no seat-meter track appears anywhere - only the label
- [ ] The `50` does not overflow at 320px, and sits beside (not above) the heading from `lg` up
- [ ] A "Claim a seat" link exists inside this block, in addition to the ones in Hero and Close

---

### Block 7 — FAQ

**Job:** clear the last small doubts. Six questions, accordion, first one open by default.

Background: `--paper`

- H2 — `display-l`, centred on a laptop *(centred 17 Sep 2026: a narrow question list hugging the left edge of the full 1120px column read as a mistake at that width; unchanged below `lg`)*:
  > Before you ask

| Q | A |
|---|---|
| Do I have to leave Instagram? | No. Keep posting exactly where you post now. A take is a sentence, not a shoot, so it sits alongside what you already do. |
| My following is small. Does that matter? | No. We're picking for takes, not reach. Most of this cohort is under 20k and that's deliberate. |
| Is this paid right now? | No, and we won't pretend otherwise. Riffi hasn't launched, so there's no money in it yet. You're putting takes in early, and when we can pay creators, batch one is first in line for payouts and brand deals. That's the plan, not a contract. *(Rewritten 16 Sep 2026 to drop the points-based answer below - see the note at the top of this document.)* |
| What can I post about? | Anything you have a real opinion on. Cricket, politics, films, food, campus, money. Opinions, not news reports. |
| When does Riffi launch? | `[FILL — launch timing]` |
| Who owns what I post? | `[FILL — confirm against terms]` *Placeholder: You do. You keep the rights to your posts and you can take them anywhere.* |

*(The original answer to "Is this paid right now?", live from 14 Sep to 16 Sep 2026: "You earn points from your first post and points convert to vouchers. Cash payouts arrive with monetisation, and this cohort is first in line for it. That's the plan, not a contract." The em dash in "Do I have to leave Instagram?"'s answer was also removed 16 Sep 2026, in the same no-em-dash pass covered at the top of this document.)*

**Accordion requirements:** native `<details>`/`<summary>` styled, or a button-based implementation with `aria-expanded` and `aria-controls`. Animate height on open. 44px minimum tap target on the summary row.

---

### Block 8 — Close

**Job:** the decision.

Background: `--ink` (black), white text. The only inverted section on the page — the page ends where the primary button has been all along. *(This is now the page's third "Claim a seat" button, not its second - Block 6 gained one on 17 Sep 2026.)*

- H2 — `display-l`, white:
  > 50 seats. Batch one.

- Body, white at 70% opacity, 34rem cap:
  > If you've got opinions and you're tired of shouting them into a feed that doesn't know you, take one.

- CTA — white pill, black text:
  > Claim a seat

  Helper beneath, `meta`, white at 60%:
  > Opens a DM with @riffi

  *(Superseded 17 Sep 2026 - see the note at the top of this document and §5.4, below. Every helper line, including this one, now reads "A one minute form. We reply from @get.riffi".)*

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
   │     ├─ VideoTakes.tsx      added 17 Sep 2026; moved here, ahead of WhatRiffiIs, the same day
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

> **Superseded 17 Sep 2026.** The sub-heading and first line below are the *original* PRD direction, kept as the historical record: the founder has since made the conversion a Google Form, not a DM. This is not the `<form>` element the PRD meant to rule out — the built page still has none, and `scripts/check-dist.mjs` still fails the build if one appears — it is a plain link, exactly like the DM link it replaces, just pointed at a different address. See the as-built description below the original text. Rationale and date: `docs/implementation-plan.md`.

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

**As built, 17 Sep 2026:** every "Claim a seat" button now opens the founder's Google Form, held in `settings.applyFormUrl`. `src/lib/cta.ts` gained `applyFormHref(url)`, which accepts only an `https://forms.gle/...` or `https://docs.google.com/forms/...` address and throws otherwise - so a mistyped or swapped link fails the build instead of quietly sending fifty creators to a stranger's form. `ctaHref` (still the name every button reads) is now `applyFormHref(settings.applyFormUrl)`. The old builder, `instagramDmHref`, is unchanged and still exported as `instagramHref`, built from the same `instagramHandle` setting - it is validated and tested but, as of this change, not linked from any button; it exists because the button's helper line still promises a reply from that account. The optional WhatsApp fallback (`whatsappHref`, behind `settings.whatsapp.enabled`) is untouched. `target="_blank"` and `rel="noopener noreferrer"` still apply to every link. `scripts/check-dist.mjs`'s allowed-link check grew to match: a built page may link only to `ig.me`, `wa.me`, `forms.gle` or `docs.google.com/forms` - still an exact host list, not a pattern.

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
- The line: *On Instagram you're one of lakhs. Here you're one of the first, with almost no competition.* - the second line carries the same orange marker sweep as the on-page headline (section 3 update, 16 Sep 2026)
- One poll bar at 71/29, outlined with the page's drawn edge (section 3 update, 16 Sep 2026)

Head tags in `index.html`:

```html
<title>Riffi Creator Program — 50 seats</title>
<meta name="description" content="Riffi is India's platform for opinions. We're taking 50 creators in before launch.">
<meta property="og:title" content="On Instagram you're one of lakhs. Here you're one of the first, with almost no competition.">
<meta property="og:description" content="The Riffi Creator Program. 50 seats, batch one.">
<meta property="og:image" content="https://<domain>/og.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FFFFFF">
```

Leave the page indexable. Add `noindex` only if Zyra asks.

**As built, 17 Sep 2026:** `settings.siteUrl` is no longer a placeholder - the page is deployed and live at `https://riffi-creator-page.vercel.app`, so `og:image` and every other `<domain>` reference resolve to that real address, and the card Instagram shows in the DM thread is built from it. Since Instagram caches the first preview it renders for a link, this card should be treated as already "sent" from this point on - see `docs/implementation-plan.md`.

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

Five items originally needed Zyra's answer. Put every one in `content.ts` with a clear placeholder and a `// [FILL]` comment so they're greppable. Build the page complete with placeholders rather than blocking.

| # | Where | What's needed | Placeholder in place | Status |
|---|---|---|---|---|
| 1 | Block 6 | The actual weekly commitment asked of creators | "Post three takes a week through the pre-launch period" | Still open |
| 2 | Block 7 | Launch timing answer | "We're in build. This cohort gets in before public launch." | Still open |
| 3 | Block 7 | Content ownership answer, confirmed against terms | "You do. You keep the rights to your posts." | Still open |
| 4 | Block 8 | Footer legal / contact line | Wordmark only | Still open |
| 5 | Global | Instagram handle for the DM link, and the deploy domain | `riffi` | **Confirmed 17 Sep 2026** - handle is `get.riffi`, domain is `https://riffi-creator-page.vercel.app` (live) |

**Added 17 Sep 2026, answered the same day it appeared:** a sixth setting, `applyFormUrl` (the founder's Google Form), was never itself a `[FILL]` placeholder - the founder supplied and confirmed the real link (`https://forms.gle/chyARXHuKTiwV4Yn6`) the same day the conversion changed from a DM to a form (§5.4). `npm run presend` now lists four open items (1-4 above, each still both a `[FILL]` comment and an unconfirmed `inputsConfirmed` flag) rather than the original five.

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

- [ ] All eight blocks built, real copy, zero Lorem *(a ninth was added 17 Sep 2026, then repositioned the same day to lead the page - see §4, Block 1a)*
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
- H1: `On Instagram you're one of lakhs. Here you're one of the first, with almost no competition.` (rewritten by the founder 16 Sep 2026; was `Here you're one of 50.`)
- Sub: `Riffi is India's platform for opinions. We're taking 50 creators in before launch and pointing the feed at them.`
- CTA: `Claim a seat` / helper: `A one minute form. We reply from @get.riffi` (rewritten 17 Sep 2026, the conversion changed from a DM to a form; was `Opens a DM with @riffi`)
- Sample take: `Being early beats being good.` — chip `sample take`, 71% agree / 29% disagree, `2,140 votes`

**You already shoot reels. Here it's just you, talking.** *(added 17 Sep 2026 as "Or just say it to camera," between "What Riffi is" and "Why here, not there"; repositioned and renamed the same day to lead the page, directly after Hero)*
- H2: `You already shoot reels. Here it's just you, talking.` (was `Or just say it to camera.`)
- Lead: `No hook, no thumbnail, no four hour edit. Point the phone at yourself, say what you actually think, and post it. The room votes on the opinion, not the edit.` (was `A take does not have to be typed. Point the phone at yourself, say the thing, post it. The room still votes.`)
- Badge: `40 seconds, one opinion`
- Three sample cards as listed in Block 1a, each labelled `sample`, each since 17 Sep 2026 carrying a burned-in caption over a licensed stock still (`/media/sample-one.jpg`, `-two`, `-three`)
- Still note (added 17 Sep 2026): `Stock stills and sample takes. Nobody has posted on Riffi yet, which is the point.`
- Footer: `One rule, whatever you shoot: it has to be your opinion, not the news.` (was `Same forty seconds either way. Type it or say it, the vote is the same.`)

**What Riffi is**
- H2: `Or type it, if that's more your thing.` (rewritten 17 Sep 2026; was `Twitter took news. We're taking opinions.`)
- Lead: `Same forty seconds either way. What matters is that the post is your opinion, not the news.` (rewritten 17 Sep 2026; was `Riffi is built for one thing: what you think. Not what happened, not who said it. Your take, and whether the room agrees.`)
- Not a take: `The new season dropped on Friday.` (rewritten 17 Sep 2026; was `India won by 6 wickets in Chennai.`) / `That's news. It's already everywhere.`
- A take: `Every season after the third is just fan service with a budget.` (rewritten 17 Sep 2026; was `Chasing in Chennai got easier and everyone's pretending it didn't.`) / `That's yours. Nobody else posted it.`
- Chips: `Movies` `Politics` `Food` `Campus` `Money` `Music` `Startups` `Fashion` `Sports` `Cricket` (reordered 17 Sep 2026 so Cricket is last, not first; was `Cricket` `Politics` `Movies` `Food` `Campus` `Money` `Music` `Startups` `Sports` `Fashion`)
- Marquee: the eight takes listed in Block 2 (two replaced 17 Sep 2026: `Your favourite startup is a spreadsheet with a good logo.` and `Every playlist app ends up playing the same six songs.` replaced two cricket takes, `Test cricket is the only format that still tells the truth.` and `The best captain of this generation isn't the one you're thinking of.`)

**Why here, not there**
- H2: `You're not early on Instagram. You're early here.`
- Rows as tabulated in Block 3, rendered Riffi-first since 17 Sep 2026 (blue fill leading from the left; was Instagram-first, fill from the right)
- Closer: `And a reel costs you four hours. A take costs you forty seconds.`

**What creators can do here.** *(heading and framing rewritten 17 Sep 2026, on top of the 16 Sep 2026 no-points rewrite; was "What you get for going first.")*
- H2: `What creators can do here.` (16 Sep 2026: `What you get for going first.`; originally `You earn from post one.`)
- Lead (added 17 Sep 2026): `Five ways to put an opinion out. Pick whichever suits the take.`
- Five rows as written in Block 4, rendered as bordered cards since 17 Sep 2026 (each row's one-line description was reworded 16 Sep 2026, and the row's right-hand `points` pill was removed the same day)
- Note: `Straight answer on money: there isn't any yet. Riffi hasn't launched, so anything we paid you today would be made up. What you get now is the part that gets harder to buy later. The feed points at you, your first post lands on the front page, and you help set what this place sounds like.` (rewritten 16 Sep 2026; was `Points convert to vouchers. Exact values go live with the app — we're still tuning them, and we'd rather publish them once than change them on you.`; unchanged since)

**The long game**
- H2: two fields since 17 Sep 2026 - `headingMark`: `Early now.`, `headingRest`: `First in line later.`, concatenated as the accessible `heading`: `Early now. First in line later.` (rewritten 16 Sep 2026; was `Points now. Priority later.`)
- Three items as written in Block 5. **Rewritten again 17 Sep 2026:** "Performance payouts" no longer names a ₹ figure at all (was: "...a post crossing a lakh views lands somewhere in the ₹5,000 to ₹10,000 band. That's an illustration, not a rate card. We'll publish the real slabs before any of it goes live."); "Whatever comes after" drops the word "tipping" (was "Subscriptions, tipping, anything else we build.")
- Framing: `All of this is our plan, not a contract. You're backing us early, and we'd rather you do it knowing exactly that.` (rewritten 16 Sep 2026; was `All of this is our plan, not a contract. We'd rather you come in knowing exactly that.`)

**Seats**
- `50`
- H2: `50 seats. Here's what we ask.`
- Body: `[FILL]`
- Meter label: `50 seats in batch one` (since 17 Sep 2026, the only thing that renders when there is no real count - no empty track alongside it)
- A third `Claim a seat` / helper button, added 17 Sep 2026

**FAQ**
- H2: `Before you ask` (centred on a laptop since 17 Sep 2026)
- Six Q&As as tabulated in Block 7 (the "Is this paid right now?" answer was rewritten 16 Sep 2026 to drop points language; the original is recorded beneath Block 7's table)

**Close**
- H2: `50 seats. Batch one.`
- Body: `If you've got opinions and you're tired of shouting them into a feed that doesn't know you, take one.`
- CTA: `Claim a seat` / helper: `A one minute form. We reply from @get.riffi` (rewritten 17 Sep 2026; was `Opens a DM with @riffi`)
