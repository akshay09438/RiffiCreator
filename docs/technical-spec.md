# Technical spec - Riffi creator page (as-built)

_How the page is built, as it actually exists. Updated in the same change as the code. Where this file and the code disagree, the code is right - fix this file and note why in the drift log._

## Status

**Built; not deployed (16 Sep 2026).** All nine build steps (PRD section 5, tracked in `docs/implementation-plan.md`) are done: the page pre-renders to full HTML and hydrates in the browser, it passes its own size budget and output check, and the Task 9 audit (Lighthouse mobile, every width from 320px to 1920px, keyboard-only, greyscale, and reduced motion and no-JavaScript passes) is green, with one layout-shift fix applied (see "Budgets and audit" below).

Since then, two more founder decisions landed on the same day: the output check's blind spot is fixed and `.zuko/package.json` lets Zuko's own scripts run (commit `3fe86f3`), and the founder redirected the visual design to a white-page, colour-in-the-elements "sticker" look and rewrote the hero's second line, with a second font retune to match (commit `1db5b9b`, see "Design system" and "Fonts" below). That restyle is also the founder's answer to Task 11 (PRD step 10, "cut one thing") - not a literal cut; see `docs/implementation-plan.md`. Reconfirmed 16 Sep 2026 on the restyled page: typecheck, lint, `npm run budget` and `npm run check:dist` all still pass, and 238 tests across 13 files still pass.

Two more rounds landed after that, both recorded in full in `docs/implementation-plan.md`:

- **Later the same day, 16 Sep 2026 (commit `441baba`):** the founder removed reward points from the offer entirely. Block 4 ("How you earn"), Block 5 ("The long game") and the FAQ answer to "Is this paid right now?" no longer mention points or vouchers; they say plainly that there is no money yet and that batch one is first in line for real payouts and brand deals once Riffi can pay - still a plan, not a contract. Every em dash was also removed from the page's user-facing copy, including `index.html`'s `<title>`. In the same commit, `.hero-mark` was redrawn to stop the marker sweep clipping descenders - see "Design system" below.
- **17 Sep 2026:** a ninth block, `VideoTakes`, was added between `WhatRiffiIs` and `WhyHere` - three sample cards that are pictures of the video-take format only, nothing more (see "Design system" below) - and some of Block 2's sample copy moved away from cricket (the contrast pair, two marquee takes and the category chip order).

Reconfirmed 17 Sep 2026 with both rounds applied: `npm run typecheck` and `npm run lint` both pass, and `npm run build && npm run budget` reports JavaScript 68.1KB gzipped (limit 90KB) and total page weight 203.7KB (limit 400KB) - see "Budgets and audit" below for the full breakdown and what has and has not been re-measured since the restyle.

What is left before the link goes to any creator: the founder's remaining open pre-send inputs (`npm run presend` currently lists six unconfirmed, see below), whether to leave the seat meter under "50 seats" empty or set it to a real count, a final whole-branch review, and putting the page online - which needs the founder's explicit yes. Progress lives in `docs/implementation-plan.md`.

## Stack

Vite 6.4.3; React 19.2.8 with TypeScript 6.0.3; Tailwind CSS v4.3.3 over the CSS-variable token layer in `src/styles/tokens.css`; CSS-only motion plus three small hooks (`useInView`, `useCountUp`, `useReducedMotion`); self-hosted variable fonts `@fontsource-variable/archivo` 5.3.0 and `@fontsource-variable/hanken-grotesk` 5.3.0; `lucide-react` 1.41.0 (six icons at most - one in use so far, `Plus`, on the FAQ marker); static output, not yet deployed anywhere (Vercel is the plan, PRD 5.1). Not used: Next.js, Framer Motion, UI kits, form or state libraries.

Additions beyond the PRD (each recorded in the drift log in `docs/implementation-plan.md`):

- **Vitest 4.1.11**, with `@vitest/coverage-v8` 4.1.11, for tests - the PRD does not specify tests; Zuko requires them. Coverage writes `coverage/coverage-summary.json`, which CI reads.
- **Prettier 3.9.6** as the formatter - development only, never shipped to the page.

## Design system - the sticker layer

Founder's direction, 16 Sep 2026 - shown first as a rendered mock in a flashier, funkier style, then corrected to the founder's actual instruction: **the page itself stays white; colour lives only in the elements.** This supersedes the PRD's original section 3 design direction (calm editorial: `--paper`/`--recess` bands, one soft shadow used only on the hero take card, hairline borders, no drawn edges) - `docs/functional-spec.md` section 3 keeps that original text unedited as the historical record, with a dated note pointing here. Rationale and the decision trail are in the decisions and drift logs in `docs/implementation-plan.md`.

As built (commit `1db5b9b`):

- A faint two-line CSS grid sits behind the white page (`--grid-line #ededed`, 44px cells, a `background-image` on `body` - no image file, so it costs the page nothing).
- Each coloured section (`WhatRiffiIs`, `HowYouEarn`, `Seats`) now renders its content inside a drawn **panel** rather than colouring the whole band: `bg-lime` (`--lime #d6f84c`) with a 3px ink edge (`--edge #0b0b0b`, `--edge-width`), 32px corners (`--corner-panel`) and a hard 6px offset shadow (`--lift-sticker`). The Close section's panel is `bg-ink` instead of lime. `Hero`, `WhyHere`, `LongGame` and the FAQ stay plain white with no panel. A panel's hairline dividers switch to ink at 15% (`--hairline-on-panel`), since the page's normal hairline disappears against a coloured background.
- Every `Chip` and every `TakeCard` draw the same edge; chips get the smaller offset shadow (`--lift-sticker-sm`). Every take card now draws the edge and shadow - not only the featured (hero) one as before - and only the featured card still gets the desktop tilt (`lg:-rotate-2`). The PRD's single soft shadow token (`--lift-take`, "used only on the hero take card") is still defined in `tokens.css` but is no longer applied anywhere.
- The CTA button (`.cta-sticker`) keeps the 3px ink edge but its offset shadow is signal-blue (`--lift-cta`) instead of ink.
- Poll bar tracks (`.poll-track`) are now outlined with the same 3px ink edge.
- The hero's second line sits on an orange marker-sweep (`--flare #ff5a1f`, `.hero-mark`, `box-decoration-break: clone` so it hugs the words on every wrapped line) - see "Fonts" and the copy change below. **Redrawn 16 Sep 2026 (commit `441baba`):** the sweep was originally a padded `background-color` with a 12px `border-radius`. At `line-height: 1` that padded inline box is about 1.19em tall, so on a wrapped headline its colour painted over the descenders of the line above (the y in "you're", the comma in "first,"). It is now a fixed-height `background-image` instead (a solid-colour `linear-gradient`, `background-size: 100% 1.02em`, offset `0.04em` from the top) with no border-radius, which sits inside the line box rather than overflowing it - same tuned line breaks, same zero layout shift, no more clipping.
- Section vertical padding dropped from 72px/112px/128px to 56px/88px/104px (mobile/`lg`/`xl`), since a panel's own padding (24-48px) now supplies part of the rhythm.
- The display scale stepped down the same day (`--text-display-xl` from `clamp(2.5rem, 1.62rem + 3.913vw, 4.75rem)` to `clamp(2.25rem, 1.4675rem + 3.478vw, 4.25rem)`, roughly 40-76px to 36-68px), and the hero's own spacing tightened twice by 8px. At the old size the founder's longer second line pushed "Claim a seat" off the first screen: it ended at 706px of a 640px screen at 320x640, and 957px of 900px at 1440x900. Measured after the change it ends at 622/640, 558/640, 562/667, 566/844, 534/1024, 813/900 and 813/1080 - visible without scrolling at every width, with no horizontal overflow and the layout shift still 0.
- The footer is no longer a full-bleed black band: because Close's ink background is now an inset panel rather than a full-bleed section, the footer (a sibling of `<main>`, per the 15 Sep 2026 drift row) sits directly on the white page (`text-ink` / `text-ink-soft`) instead of `bg-ink text-paper`.

New tokens live only in `tokens.css` (`--lime`, `--flare`, `--edge`, `--grid-line`, `--hairline-on-panel`, `--edge-width`, `--corner-panel`, `--lift-sticker`, `--lift-sticker-sm`, `--lift-cta`) and are exposed as Tailwind utilities only in `global.css`'s `@theme inline` block (`--color-lime`, `--color-flare`, `--color-edge`, `--color-grid-line`, `--radius-panel`, `--shadow-sticker`, `--shadow-sticker-sm`, `--shadow-cta`). Nothing else references a new hex value or shadow directly, so Rule 1 below still holds.

Copy, same commit: the hero's second line is now "Here you're one of the first, with almost no competition." (the founder's own words), replacing "Here you're one of 50." - carried through `index.html`'s `og:title` and the DM preview card (`public/og.png`, see "Images"), where the second line gets the same marker-sweep treatment.

**The video-takes block, added 17 Sep 2026.** `VideoTakes.tsx` sits between `WhatRiffiIs` and `WhyHere` in `App.tsx`'s render order, inside a new `sky` `Section` tone (`TONES.sky` in `Section.tsx`) - a pale blue drawn panel, styled exactly like the lime and ink panels elsewhere (`panel`, the same edge and offset shadow). It reuses the existing chip token `--chip-blue-bg` for that panel rather than adding a new brand colour, and its own rules in `global.css` (under "Video takes") reuse the sticker layer's existing tokens throughout - `--edge`, `--edge-width`, `--corner-pill`, `--corner-take`, `--lift-sticker`, `--lift-sticker-sm`, `--flare`, `--lime`, `--chip-butter-bg`, `--chip-coral-bg` - so the block adds **zero new entries to `tokens.css`** and Rule 1 still holds.

- `.video-badge`: a small pill in `--flare` with white text, rotated -3deg, holding the content module's `badge` string ("40 seconds, one opinion").
- `.video-deck`: a flex row with `overflow-x: auto` and `scrollbar-width: none`, so the three cards scroll sideways on touch or drag without a visible scrollbar; nothing inside it is focusable, so it adds no keyboard stop and cannot trap scroll.
- `.video-card`: one per sample take, each rotated a different amount via a `data-index` attribute (-2deg, 1.5deg, -1deg for cards 0-2), drawn with the same edge and offset shadow as every other card on the page.
- `.video-frame`: a fixed-height (214px) coloured rectangle standing in for a video frame - butter, coral or lime background by card index - holding a centred `.video-play` circle (a plain inline `<svg>` triangle written directly in `VideoTakes.tsx`, not a Lucide import, so it does not count against the six-icon budget) and two small pill labels pinned to opposite corners: `.video-tag` (the word "sample") and `.video-length` (the clip length, e.g. "0:38").
- The entire `.video-frame` carries `aria-hidden="true"` - none of it is real information, since no clip loads and nothing plays on tap regardless of what a reader does. The take's own text sits below the frame as plain, real text, preceded by a visually-hidden (`sr-only`) span that repeats the word "sample", so a screen reader gets the same label a sighted reader sees drawn on the frame.
- The block **loads nothing**: no `<video>` or `<img>` element, no network request, no new dependency, and no client-side logic of its own (no state, no event handler) - every visual is CSS and the one inline SVG path already in the component. That is consistent with the small size-budget delta below: the block's own weight is markup, static content strings and CSS rules, nothing else.

Content, same round: `content.videoTakes` holds the block's heading, lead, badge, its three `{ text, length }` sample items and the footer line - new keys inside the same `content.ts` file, so Rule 2 still holds too. Three of Block 2's existing strings changed the same day - the contrast pair and two marquee takes moved away from cricket, and the category chip order changed - `docs/functional-spec.md`'s Block 2 has the exact before/after text.

## How the page is served

`npm run build` runs three steps: `vite build` compiles the browser bundle; `vite build --ssr src/entry-server.tsx --outDir dist-server` compiles a server-only bundle that can render `<App />` to a string outside a browser; then `node scripts/prerender.mjs` runs that render into `dist/index.html` in place of the `<!--app-html-->` placeholder, replaces every `__SITE_URL__` in the head tags with the real site URL (refusing to write anything but a bare `https://domain`), and adds a `<link rel="preload">` for each of the two hashed font files Vite just wrote to `dist/assets/`. The result is a fully-worded static page - both CTAs, every block and the FAQ - that reads with no JavaScript at all. In the browser, `src/main.tsx` hydrates that markup with `hydrateRoot` (falling back to `createRoot().render()` only when `#root` is empty, which is how the plain `vite dev` server serves it). Two class names on `<html>` track that hand-off for CSS: an inline script in `index.html` adds `js` the instant the page parses, before React has loaded; once `App` has mounted - but only if that happens within 6 seconds of navigation - an effect adds `app-ready`. The motion rules below key off both classes to fall back gracefully when a script never runs or hydration lands late.

## The two rules, enforced

**Rule 1** (every brand value lives only in `tokens.css`) is enforced by `tests/brand-rules.test.ts`: it scans every `.ts`, `.tsx` and `.css` file under `src/`, except `tokens.css` itself, for hex colours, colour functions, named colours in colour properties, non-token font names and `font-family` declarations, and Tailwind arbitrary colour or font classes - `content.ts` is exempt only where real copy has to say a colour or font word. It also checks that `index.html` allows nothing but the PRD's `#FFFFFF` theme-color hex, and that both fonts are self-hosted from Fontsource rather than Google Fonts. Separately, `global.css` sets `--color-*: initial` and `--font-*: initial` before remapping only the brand's own tokens through Tailwind's `@theme`, so Tailwind's default palette and default font stacks do not exist as utility classes at all.

**Rule 2** (every user-facing string lives only in `content.ts`) is enforced first by ESLint: a `no-restricted-syntax` rule scoped to `src/components/**/*.tsx` and `src/App.tsx` rejects any non-whitespace JSX text, string or template literal inside JSX, and any literal `aria-label`, `alt`, `title` or `placeholder` (every file under `src/` also blocks `dangerouslySetInnerHTML` and any read of `import.meta.env`, since the page ships no environment variables and injects no raw HTML). `tests/copy-source.test.tsx` is the complete backstop the lint rule gives fast feedback for: it renders the whole page and asserts every text node it finds is a string that exists somewhere inside `content`.

## Motion

The hero loads in one sequence: the two headline lines rise into place (`hero-rise`, transform only, so the headline is never invisible), then the sample poll's CSS fill runs (`poll-fill-in`, 900ms), then the vote count fades in and `useCountUp` ticks it upward - not on a fixed clock after navigation, but timed from the vote count's own CSS animation `startTime` (waiting on `animation.ready` if that animation is still pending, and falling back to a flat delay only if the browser reports no animation at all), so a slow 4G load delays the tick by exactly as much as it delays the fade-in, and a late hydration never rewinds a number the reader has already seen. The comparison bars and the seat meter fill the same way but on scroll: `useInView` (a one-shot `IntersectionObserver` at a 0.35 threshold) flags each bar once, and CSS staggers the fill 80ms per row. Two failsafes cover the gaps: with no script at all the bars simply render full (there is no `.js` class, so the scroll-triggered rule never applies); if the script ran but React never finished mounting, a CSS animation fills them 6 seconds after they were styled (`.js:not(.app-ready)`). The FAQ's answer height animates through `interpolate-size` and `::details-content` where the browser supports it, and just appears everywhere else - the FAQ needs no JavaScript at all. Under `prefers-reduced-motion: reduce`, one set of rules turns off every animation and transition above at once, including the FAQ's, and the page renders complete and static.

## Fonts

Both typefaces ship as the Fontsource 5.3.0 variable-font Latin subset only (`archivo-latin-wdth-normal.woff2`, `hanken-grotesk-latin-wght-normal.woff2` - no Cyrillic, Greek or Devanagari), declared in `tokens.css` and preloaded by the prerender step above. Each has a metric-matched `local('Arial')`/`local('Roboto')` fallback so the stand-in occupies the same space as the real font while it loads: `Hanken Grotesk Fallback` (size-adjust 100.94%, ascent 99.07%, descent 30.02%) for body text. Arial has no width axis, so one stand-in cannot match Archivo at two different widths: `Archivo Fallback` (106% / 82.83% / 19.81%) covers `--typeface-display` generally, and a second face, `Archivo Fallback Wide`, behind `--typeface-display-wide`, covers only `.hero-title`'s 115% `font-stretch`. Both were tuned against the real font's line breaks at every width from 320px to 1440px; metrics come from `@capsizecss/metrics` against Arial, and differ from Roboto (the Android fallback) by under 0.3%.

`Archivo Fallback Wide` has been retuned once since it was introduced: 126%/69.69%/16.67% at the audit fix on 15 Sep 2026 (commit `8bb9008`, for "Here you're one of 50."), then 129%/68.07%/16.28% on 16 Sep 2026 (commit `1db5b9b`) to match the new, longer second line ("Here you're one of the first, with almost no competition."). Each retune was measured over the same 320-1440px line-break sweep; see "Budgets and audit" below for the layout-shift numbers.

## Tests

13 files, all passing (`npm test`). The count has grown with each round: 231 at the last full audit (15 Sep 2026), 238 after the sticker restyle (commit `1db5b9b`), 239 after commit `441baba` removed reward points, and 249 after the video-takes block and its own coverage landed (commit `0cf6402`). Five files are the independent-author suite, written from the PRD without sight of the implementation, and are never edited to make code pass:

- `tests/content.test.ts` (independent author) - every honesty rule (PRD 2.4) against `content.ts`'s raw source and parsed values; since 17 Sep 2026, also the video-takes block's copy and the "What Riffi is" copy that moved away from cricket, against `docs/functional-spec.md`'s text.
- `tests/cta.test.ts` (independent author) - `instagramDmHref` and `whatsappHref` accept every valid handle or number shape and reject every invalid one.
- `tests/presend.test.ts` (independent author) - the placeholder marker and `inputsConfirmed` gate in `scripts/presend.mjs`.
- `tests/head.test.ts` (independent author) - `index.html`'s document basics and link-preview tags.
- `tests/page.test.tsx` (independent author) - the rendered page's landmarks, section order and honesty rules against visible text, sharing `tests/honesty-rules.ts`'s patterns with `content.test.ts`; since 17 Sep 2026, also that `#video-takes` sits exactly once, directly between `#what-riffi-is` and `#why-here`, and a guard that the rendered page loads no `<video>`, `<iframe>`, `<source>` or `<img>` element anywhere - the block is markup and CSS only.

The other eight, written alongside the code:

- `tests/prerender.test.ts` - the server-rendered HTML carries the page's landmarks and exposes `siteUrl` as a bare domain.
- `tests/brand-rules.test.ts` - the two rules enforced above.
- `tests/hooks.test.tsx` - `useCountUp`, `useInView` and `useReducedMotion` in isolation.
- `tests/primitives.test.tsx` - `Section`, `Chip`, `CtaButton`, `TakeCard` and `Wordmark`.
- `tests/poll-bar.test.tsx` - `PollBar`'s fill share, its text fallback and its `aria-hidden` drawn bar.
- `tests/copy-source.test.tsx` - rule 2's backstop: every rendered text node traces back to `content.ts`.
- `tests/motion-timing.test.ts` - the vote-count timing agreement described under "Motion".
- `tests/images.test.ts` - `public/og.png`, `apple-touch-icon.png` and `favicon.svg` exist at the right size and weight.

## Images

`npm run images` (`scripts/make-images.mjs`) draws all three site images from the page's own tokens and copy, so none of them can drift from the brand or say something the content file does not: the 1200x630 link-preview card (`public/og.png` - the wordmark, the two-line headline at the same 115% width as `.hero-title`, with the second line's orange marker sweep, and the sample poll bar - outlined with the page's own drawn edge - with no numbers or labels, so a bare graphic makes no claim that could read as real data), the 180x180 apple touch icon, and the 32x32 SVG favicon. It builds each as a throwaway HTML page, with `tokens.css`'s Fontsource `url()`s rewritten to `node_modules` so a `file://` page can still load the real fonts.

Since 16 Sep 2026 (commit `1db5b9b`) the script drives Edge over the DevTools protocol instead of Edge's `--screenshot` flag: this Edge build (153) silently ignores that flag in headless mode, writing nothing or a picture of its own error page. It spawns one shared headless Edge on its own profile (`--remote-debugging-port=0`), waits for the `DevToolsActivePort` file Edge writes into that profile, and connects over Node's built-in `WebSocket` - no new dependency. For each image it opens a new target window at the exact output size (`Target.createTarget`), navigates to the throwaway page, waits for `Page.loadEventFired` and then for `document.fonts.ready` (so a card is only captured once the brand fonts have actually loaded, not just the fallback), and captures with `Page.captureScreenshot`. `EDGE_PATH` still overrides the default install path. Startup, page load and each capture are all bounded by their own timeouts, so a hang fails the script rather than the command line. The browser, its process, and the temporary pages and profile are always closed and removed in a `finally` block, even when a render fails, with only a console warning if removal itself fails.

## Before anything goes online

The page goes online only through `npm run release`, never a bare `npm run build`: it builds, then runs `npm run check:dist` (the built page loads only its own files - checked in both `url()` and, since 16 Sep 2026, a minified `@import`, in the built CSS and any inlined `<style>` block - links only to `ig.me`/`wa.me`, has no `<form>`, and points `og:image` at a real domain) and `npm run presend` (fails while any `[FILL]` marker remains in `content.ts`, or while any of the six `inputsConfirmed` flags - `weeklyCommitment`, `launchTiming`, `contentOwnership`, `footerLine`, `instagramHandle`, `siteUrl` - is still `false`, or while the built `dist/index.html` still carries the placeholder `__SITE_URL__` or an `.example` domain). All six flags are `false` today, so a release build currently refuses at the last of these checks; deleting a `[FILL]` comment without also setting its flag still fails it.

## Budgets and audit

Measured 15-16 Sep 2026 on the built page, served from a static copy of `dist/`, in headless Edge 153 (the in-app Browser pane was found to be reading another project's launch configuration, so it was not used for this audit). The numbers below are from 16 Sep 2026, after the sticker restyle and the hero-line change (commit `1db5b9b`); where the restyle moved a number, the pre-restyle figure is given alongside it.

- **Sizes, re-measured 17 Sep 2026** (`npm run build && npm run budget`, with both the no-reward-points/no-em-dash copy pass and the new video-takes block applied): JavaScript 68.1KB gzipped (limit 90KB); page weight 203.7KB total - HTML 5.1KB, CSS 5.5KB, JS 68.1KB, fonts 124.8KB, favicon 0.2KB (limit 400KB). Previously (16 Sep 2026, sticker layer only): JS 67.6KB, page weight 202.5KB total - HTML 4.7KB, CSS 5.2KB, JS 67.6KB. The video-takes block's own weight is markup, static content strings and CSS rules only - no script logic, no image, no font - consistent with the small size of the delta (JS +0.5KB, CSS +0.3KB, HTML +0.4KB).
  - *(The Lighthouse, LCP, layout-shift and keyboard-stop numbers below are from 15-16 Sep 2026 and predate both this round's copy pass and the video-takes block - only the size budget above has been re-measured since. The video-takes block adds no new keyboard stop of its own: it has no link, button or other focusable element, consistent with "nothing plays on tap." A fresh full audit pass is still owed before the link is sent - see "Known limits".)*
- **Lighthouse mobile** (pinned 13.4.1, simulated 4G and 4x CPU slowdown), three runs: Performance 0.99, Accessibility 1.00, Best Practices 1.00, SEO 1.00; CLS 0; TBT 0ms; FCP 1.20-1.28s across the three runs. No failing audits; the remaining notes (caching, the request chain, render-blocking requests, about 29KB of unused JavaScript) are informational only.
  - **LCP, recorded honestly:** 1.95s, 2.11s and 2.11s across the three runs - no longer a single steady number as it was before the restyle (1.95s). The PRD's target is under 2s, so Lighthouse's simulated median (2.1s) now sits at the boundary, even though it fails no audit. The layout-shift measurement directly below, taken under the same throttling but measured directly in the engine rather than Lighthouse's simulation, shows the page's first paint under a second. Re-check this LCP number once more before the link is sent (see "Known limits").
- **Layout shift**, throttled 4G cold first load, 3 loads per width, measured directly in the engine: 0 at 320, 360, 375 and now 390px too (budget 0.02) - the second font retune below took the last 0.0001 at 390px to zero. Before the first fix (commit `8bb9008`), the same measurement read 0.0342 / 0.0388 / 0.0604 / 0.0349.
- Also checked and passing: no horizontal overflow and the hero CTA above the fold at 320, 360, 375, 390, 768, 1440 and 1920px; 8 keyboard stops in document order (the hero CTA, the six FAQ questions, the close CTA) with a visible 2px focus ring, and Enter opens a closed FAQ answer; every poll bar's values readable as plain text under greyscale; a seamless 60-second marquee loop; scroll reveals firing once on entry and staying filled; a fully static page under reduced motion, with the same final state when every script is removed (the marquee and the header hairline are CSS-only).

The one audit fix (15 Sep 2026): the headline's stand-in font. `tokens.css` originally carried a single `Archivo Fallback` face, matched to Archivo at its normal width - but `.hero-title` renders at `font-stretch: 115%`, which Arial and Roboto cannot reproduce, so the headline re-wrapped when the real font arrived and pushed the hero down about 40px. That mismatch is the 0.03-0.06 layout shift measured above. The fix (commit `8bb9008`) added the second stand-in described under "Fonts" (`Archivo Fallback Wide` behind `--typeface-display-wide`) and removed a `font-display` utility class in `Hero.tsx` that had been overriding `.hero-title`'s font-family, so the new rule can actually apply. Both stand-ins were tuned against the real font's line breaks at every width from 320 to 1440px, and the finished page is pixel-identical to before the fix once the real font loads.

A second retune followed on 16 Sep 2026 (commit `1db5b9b`): the founder's new, longer second line ("Here you're one of the first, with almost no competition.") needed `Archivo Fallback Wide` re-matched again - size-adjust 126% to 129%, ascent 69.69% to 68.07%, descent 16.67% to 16.28% - chosen from the same 320-1440px line-break sweep. Measured over 3 cold 4G loads per width after the retune: layout shift 0 at 320, 360, 375 and 390px, an improvement on the 0.0001 at 390px measured for the previous line.

## Commands

All created at build step 1 and in use since (`package.json`):

| Purpose | Command |
|---|---|
| Install | `npm ci` |
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Local preview of the build | `npm run preview` |
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Tests | `npm test` (runs once and exits) |
| Coverage | `npm run coverage` |
| Format | `npm run format` |
| Size budget check | `npm run budget` |
| Built-page output check | `npm run check:dist` |
| Pre-send placeholder check | `npm run presend` |
| Generate `og.png`, the apple touch icon and the favicon | `npm run images` |
| Build, then both checks above - the only way the page goes online | `npm run release` |

## Safety net

- **Zuko** (`.zuko/`, `CLAUDE.md` Part B): the stop-and-ask list, time-boxed approvals, the risk scorer.
- **CI** (`.github/workflows/ci.yml`): install, typecheck, lint and tests, then a build plus the `budget` and `check:dist` scripts above (Task 9); a separate job re-runs coverage on touched files and fails on any drop against the base branch; secret scan (gitleaks) and static analysis (semgrep) run on every push; and a goodnight merge-gate job checks that every dangerous-path file in a pull request's diff carries a recorded approval. All of it is written and ready, but there is still no GitHub repository for this project, so CI has never actually run.

## Deploy

Not set up. Planned: Vercel static hosting (PRD 5.1). Deploying is an outward-facing step and needs the founder's explicit yes.

## Known limits

- `npm run images` needs Microsoft Edge at its default Windows install path, or `EDGE_PATH` set to point at another Chromium-based browser.
- The ₹ sign renders in the phone's own system font, not Archivo or Hanken Grotesk, because the Latin-only subset carries no ₹ glyph.
- The Roboto fallback depends on the visiting phone exposing Roboto to `local()`; a phone that does not falls back further, to the OS default sans-serif.
- The header's hairline only exists at 1024px and up (`min-width: 64rem`); below that there is no hairline at all. At that width and up, it appears on scroll where the browser supports CSS scroll-driven animations (`animation-timeline: scroll()`); where it does not, the hairline is simply always there instead.
- **Fixed 16 Sep 2026** (commit `3fe86f3`, founder-approved): the Zuko approval scripts in `.zuko/*.js` are CommonJS, and `package.json` sets `"type": "module"` - previously this stopped `node .zuko/approve.js` and CI's goodnight-gate job starting as written, and approvals during the build were recorded with a byte-verified `.cjs` copy instead. `.zuko/package.json` (`{"type": "commonjs"}`) now scopes CommonJS to that folder, so the scripts start correctly; nothing about which files are protected changed.
- The in-app Browser pane reads a different project's (Grinder's) launch configuration rather than this repo's `.claude/launch.json`; the Task 9 audit numbers above were taken in headless Edge instead.
- **To re-check before the link is sent:** Lighthouse's simulated-4G LCP was a steady 1.95s before the 16 Sep 2026 restyle; across three runs afterward it read 1.95s, 2.11s and 2.11s - no audit fails, but the simulated median (2.1s) now sits right at the PRD's under-2s target, while a direct measurement under the same throttling shows the page's first paint well under a second. **Neither that pass, nor the layout-shift and keyboard-stop numbers above, have been re-run since** - both predate the no-reward-points/no-em-dash copy pass and the video-takes block (16-17 Sep 2026). Only the size budget has been re-measured against those two rounds (see "Sizes" above). Worth one full audit pass before the page goes to any creator.
