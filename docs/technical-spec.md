# Technical spec - Riffi creator page (as-built)

_How the page is built, as it actually exists. Updated in the same change as the code. Where this file and the code disagree, the code is right - fix this file and note why in the drift log._

## Status

**Built; not deployed (16 Sep 2026).** All nine build steps (PRD section 5, tracked in `docs/implementation-plan.md`) are done: the page pre-renders to full HTML and hydrates in the browser, it passes its own size budget and output check, and the Task 9 audit (Lighthouse mobile, every width from 320px to 1920px, keyboard-only, greyscale, and reduced motion and no-JavaScript passes) is green, with one layout-shift fix applied (see "Budgets and audit" below). What is left before the link goes to any creator: Task 11 (the founder cuts one thing, PRD 3.6), the final review, and confirming the pre-send inputs listed below. Progress lives in `docs/implementation-plan.md`.

## Stack

Vite 6.4.3; React 19.2.8 with TypeScript 6.0.3; Tailwind CSS v4.3.3 over the CSS-variable token layer in `src/styles/tokens.css`; CSS-only motion plus three small hooks (`useInView`, `useCountUp`, `useReducedMotion`); self-hosted variable fonts `@fontsource-variable/archivo` 5.3.0 and `@fontsource-variable/hanken-grotesk` 5.3.0; `lucide-react` 1.41.0 (six icons at most - one in use so far, `Plus`, on the FAQ marker); static output, not yet deployed anywhere (Vercel is the plan, PRD 5.1). Not used: Next.js, Framer Motion, UI kits, form or state libraries.

Additions beyond the PRD (each recorded in the drift log in `docs/implementation-plan.md`):

- **Vitest 4.1.11**, with `@vitest/coverage-v8` 4.1.11, for tests - the PRD does not specify tests; Zuko requires them. Coverage writes `coverage/coverage-summary.json`, which CI reads.
- **Prettier 3.9.6** as the formatter - development only, never shipped to the page.

## How the page is served

`npm run build` runs three steps: `vite build` compiles the browser bundle; `vite build --ssr src/entry-server.tsx --outDir dist-server` compiles a server-only bundle that can render `<App />` to a string outside a browser; then `node scripts/prerender.mjs` runs that render into `dist/index.html` in place of the `<!--app-html-->` placeholder, replaces every `__SITE_URL__` in the head tags with the real site URL (refusing to write anything but a bare `https://domain`), and adds a `<link rel="preload">` for each of the two hashed font files Vite just wrote to `dist/assets/`. The result is a fully-worded static page - both CTAs, every block and the FAQ - that reads with no JavaScript at all. In the browser, `src/main.tsx` hydrates that markup with `hydrateRoot` (falling back to `createRoot().render()` only when `#root` is empty, which is how the plain `vite dev` server serves it). Two class names on `<html>` track that hand-off for CSS: an inline script in `index.html` adds `js` the instant the page parses, before React has loaded; once `App` has mounted - but only if that happens within 6 seconds of navigation - an effect adds `app-ready`. The motion rules below key off both classes to fall back gracefully when a script never runs or hydration lands late.

## The two rules, enforced

**Rule 1** (every brand value lives only in `tokens.css`) is enforced by `tests/brand-rules.test.ts`: it scans every `.ts`, `.tsx` and `.css` file under `src/`, except `tokens.css` itself, for hex colours, colour functions, named colours in colour properties, non-token font names and `font-family` declarations, and Tailwind arbitrary colour or font classes - `content.ts` is exempt only where real copy has to say a colour or font word. It also checks that `index.html` allows nothing but the PRD's `#FFFFFF` theme-color hex, and that both fonts are self-hosted from Fontsource rather than Google Fonts. Separately, `global.css` sets `--color-*: initial` and `--font-*: initial` before remapping only the brand's own tokens through Tailwind's `@theme`, so Tailwind's default palette and default font stacks do not exist as utility classes at all.

**Rule 2** (every user-facing string lives only in `content.ts`) is enforced first by ESLint: a `no-restricted-syntax` rule scoped to `src/components/**/*.tsx` and `src/App.tsx` rejects any non-whitespace JSX text, string or template literal inside JSX, and any literal `aria-label`, `alt`, `title` or `placeholder` (every file under `src/` also blocks `dangerouslySetInnerHTML` and any read of `import.meta.env`, since the page ships no environment variables and injects no raw HTML). `tests/copy-source.test.tsx` is the complete backstop the lint rule gives fast feedback for: it renders the whole page and asserts every text node it finds is a string that exists somewhere inside `content`.

## Motion

The hero loads in one sequence: the two headline lines rise into place (`hero-rise`, transform only, so the headline is never invisible), then the sample poll's CSS fill runs (`poll-fill-in`, 900ms), then the vote count fades in and `useCountUp` ticks it upward - not on a fixed clock after navigation, but timed from the vote count's own CSS animation `startTime` (waiting on `animation.ready` if that animation is still pending, and falling back to a flat delay only if the browser reports no animation at all), so a slow 4G load delays the tick by exactly as much as it delays the fade-in, and a late hydration never rewinds a number the reader has already seen. The comparison bars and the seat meter fill the same way but on scroll: `useInView` (a one-shot `IntersectionObserver` at a 0.35 threshold) flags each bar once, and CSS staggers the fill 80ms per row. Two failsafes cover the gaps: with no script at all the bars simply render full (there is no `.js` class, so the scroll-triggered rule never applies); if the script ran but React never finished mounting, a CSS animation fills them 6 seconds after they were styled (`.js:not(.app-ready)`). The FAQ's answer height animates through `interpolate-size` and `::details-content` where the browser supports it, and just appears everywhere else - the FAQ needs no JavaScript at all. Under `prefers-reduced-motion: reduce`, one set of rules turns off every animation and transition above at once, including the FAQ's, and the page renders complete and static.

## Fonts

Both typefaces ship as the Fontsource 5.3.0 variable-font Latin subset only (`archivo-latin-wdth-normal.woff2`, `hanken-grotesk-latin-wght-normal.woff2` - no Cyrillic, Greek or Devanagari), declared in `tokens.css` and preloaded by the prerender step above. Each has a metric-matched `local('Arial')`/`local('Roboto')` fallback so the stand-in occupies the same space as the real font while it loads: `Hanken Grotesk Fallback` (size-adjust 100.94%, ascent 99.07%, descent 30.02%) for body text. Arial has no width axis, so one stand-in cannot match Archivo at two different widths: `Archivo Fallback` (106% / 82.83% / 19.81%) covers `--typeface-display` generally, and a second face, `Archivo Fallback Wide` (126% / 69.69% / 16.67%) behind `--typeface-display-wide`, covers only `.hero-title`'s 115% `font-stretch`. Both were tuned against the real font's line breaks at every width from 320px to 1440px; metrics come from `@capsizecss/metrics` against Arial, and differ from Roboto (the Android fallback) by under 0.3%.

## Tests

13 files, 238 tests, all passing (`npm test`). Five are the independent-author suite, written from the PRD without sight of the implementation, and are never edited to make code pass:

- `tests/content.test.ts` (independent author) - every honesty rule (PRD 2.4) against `content.ts`'s raw source and parsed values.
- `tests/cta.test.ts` (independent author) - `instagramDmHref` and `whatsappHref` accept every valid handle or number shape and reject every invalid one.
- `tests/presend.test.ts` (independent author) - the placeholder marker and `inputsConfirmed` gate in `scripts/presend.mjs`.
- `tests/head.test.ts` (independent author) - `index.html`'s document basics and link-preview tags.
- `tests/page.test.tsx` (independent author) - the rendered page's landmarks, section order and honesty rules against visible text, sharing `tests/honesty-rules.ts`'s patterns with `content.test.ts`.

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

`npm run images` (`scripts/make-images.mjs`) draws all three site images from the page's own tokens and copy, so none of them can drift from the brand or say something the content file does not: the 1200x630 link-preview card (`public/og.png` - the wordmark, the two-line headline at the same 115% width as `.hero-title`, and the sample poll bar with no numbers or labels, so a bare graphic makes no claim that could read as real data), the 180x180 apple touch icon, and the 32x32 SVG favicon. It builds each as a throwaway HTML page (with `tokens.css`'s Fontsource `url()`s rewritten to `node_modules`, so a `file://` page can still load the real fonts) and screenshots it with a headless copy of the Microsoft Edge already on this laptop (`EDGE_PATH` overrides the default install path). The screenshot step runs inside `try/finally`, so the temporary pages and per-shot Edge profiles are always removed, even when a render fails, with only a console warning if removal itself fails.

## Before anything goes online

The page goes online only through `npm run release`, never a bare `npm run build`: it builds, then runs `npm run check:dist` (the built page loads only its own files, links only to `ig.me`/`wa.me`, has no `<form>`, and points `og:image` at a real domain) and `npm run presend` (fails while any `[FILL]` marker remains in `content.ts`, or while any of the six `inputsConfirmed` flags - `weeklyCommitment`, `launchTiming`, `contentOwnership`, `footerLine`, `instagramHandle`, `siteUrl` - is still `false`, or while the built `dist/index.html` still carries the placeholder `__SITE_URL__` or an `.example` domain). All six flags are `false` today, so a release build currently refuses at the last of these checks; deleting a `[FILL]` comment without also setting its flag still fails it.

## Budgets and audit

Measured 15-16 Sep 2026 on the built page, served from a static copy of `dist/`, in headless Edge 153 (the in-app Browser pane was found to be reading another project's launch configuration, so it was not used for this audit):

- **Sizes:** JavaScript 67.5KB gzipped (limit 90KB); page weight 202.1KB total - HTML 4.7KB, CSS 4.9KB, JS 67.5KB, fonts 124.8KB, favicon 0.2KB (limit 400KB).
- **Lighthouse mobile** (pinned 13.4.1, simulated 4G and 4x CPU slowdown, three runs, all identical): Performance 0.99, Accessibility 1.00, Best Practices 1.00, SEO 1.00; LCP 1.95s, CLS 0, TBT 0ms, FCP 1.20s. No failing audits; the remaining notes (caching, the request chain, render-blocking requests, about 29KB of unused JavaScript) are informational only.
- **Layout shift**, throttled 4G cold first load, 3 loads per width, measured directly in the engine: 0 at 320, 360 and 375px, 0.0001 at 390px (budget 0.02). Before the fix below, the same measurement read 0.0342 / 0.0388 / 0.0604 / 0.0349.
- Also checked and passing: no horizontal overflow and the hero CTA above the fold at 320, 360, 375, 390, 768, 1440 and 1920px; 8 keyboard stops in document order (the hero CTA, the six FAQ questions, the close CTA) with a visible 2px focus ring, and Enter opens a closed FAQ answer; every poll bar's values readable as plain text under greyscale; a seamless 60-second marquee loop; scroll reveals firing once on entry and staying filled; a fully static page under reduced motion, with the same final state when every script is removed (the marquee and the header hairline are CSS-only).

The one audit fix: the headline's stand-in font. `tokens.css` originally carried a single `Archivo Fallback` face, matched to Archivo at its normal width - but `.hero-title` renders at `font-stretch: 115%`, which Arial and Roboto cannot reproduce, so the headline re-wrapped when the real font arrived and pushed the hero down about 40px. That mismatch is the 0.03-0.06 layout shift measured above. The fix (commit `8bb9008`) added the second stand-in described under "Fonts" (`Archivo Fallback Wide` behind `--typeface-display-wide`) and removed a `font-display` utility class in `Hero.tsx` that had been overriding `.hero-title`'s font-family, so the new rule can actually apply. Both stand-ins were tuned against the real font's line breaks at every width from 320 to 1440px, and the finished page is pixel-identical to before the fix once the real font loads.

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
- The Zuko approval scripts in `.zuko/*.js` are CommonJS, but `package.json` sets `"type": "module"`, so `node .zuko/approve.js` and CI's goodnight-gate job cannot start as written. Approvals during this build were recorded with a byte-verified `.cjs` copy instead. The durable fix - a `.zuko/package.json` with `{"type": "commonjs"}` - is a founder decision, not made in this build.
- The in-app Browser pane reads a different project's (Grinder's) launch configuration rather than this repo's `.claude/launch.json`; the Task 9 audit numbers above were taken in headless Edge instead.
