# Riffi creator page - build design

**Date:** 14 Sep 2026
**Status:** approved by the founder on 14 Sep 2026 (option A)
**What the page says and looks like:** `docs/functional-spec.md` (the PRD) is the source of truth. This document records only how the build meets it, and the decisions the PRD leaves open.

## 1. Scope

Build exactly the PRD: the eight blocks of section 4 in order, the production copy from the appendix, the design direction of section 3, the stack of section 5, and the responsive, performance and accessibility floors of sections 6 and 7. The name is spelled Riffi. The five `[FILL]` inputs ship as clearly marked placeholders (section 8).

Not in this build: deploying, a GitHub repository, analytics, turning on the WhatsApp fallback, answering the `[FILL]` inputs, the brand kit.

## 2. Approach - how the page reaches the phone

| Option | What it means | Verdict |
|---|---|---|
| **A. Pre-rendered React** | At build time the whole page is rendered to static HTML. In the browser, React hydrates it to add motion and interaction. | **Chosen.** Everything a creator needs is in the HTML before any script runs. Meets Block 1's acceptance (the H1 renders without waiting on JS) and survives slow 4G. |
| B. Client-rendered React (the Vite default) | The browser builds the page from JavaScript. | Rejected. Blank until the JS arrives and runs; fails Block 1's acceptance. |
| C. A static-first framework (e.g. Astro) | A different toolkit with interactive islands. | Rejected. Fast, but departs from the PRD's chosen stack. |

Implementation: a small build script renders `App` with React's server renderer into `index.html`; `main.tsx` hydrates the same tree. No new runtime dependency.

## 3. Progressive enhancement

- **HTML alone:** all copy, both CTAs as plain links, the FAQ as native `<details>`/`<summary>` (first one open), the take cards, and every poll bar at its final split.
- **CSS adds:** the hero headline rise and the hero poll fill on load, and the marquee. The rise is transform-based, so the H1 is never invisible and LCP is not delayed. This differs from PRD 5.5, which triggers the sample bar "on mount": a CSS load animation starts at first paint and needs no JavaScript, whereas "on mount" would wait for hydration on slow 4G.
- **JavaScript adds:** the two scroll-into-view fills (comparison rows, seat meter), the vote-count tick, and the FAQ's height animation. A tiny inline script marks the document as JS-capable before first paint, so only below-the-fold bars start empty and nothing visible jumps.
- **`prefers-reduced-motion: reduce`:** everything renders at its final state; nothing moves.

## 4. The call to action

- One setting, `instagramHandle` in `src/content.ts`, feeds both the link (`https://ig.me/m/<handle>`) and the visible "Opens a DM with @<handle>" line under both buttons, so the label and the link cannot disagree. If the deep link lands on a login screen, the visible handle is the fallback a creator can search for.
- Opens in a new tab with `rel="noopener noreferrer"`.
- The WhatsApp fallback (`wa.me`) exists behind a flag, off by default.

## 5. Honesty and quality, held by automatic checks

Tests (Vitest + Testing Library) fail if:

- a number appears next to the word "points" anywhere on the page (point values are not final);
- a seat count appears while `seats.taken` is null or `seats.show` is false;
- the ₹ figure is not framed as an example in the sentence it appears in (Block 5 acceptance);
- the "plan, not a contract" sentence is missing;
- a sample take is not labelled `sample take`;
- the visible handle and the link's handle differ;
- a hex value or font name appears outside `src/styles/tokens.css`;
- required semantics break: one `h1`, each `section` labelled by its `h2`, the earn rows as a real list, an accessible accordion.

An automatic check forbids literal strings in components, so copy can only come from `content.ts`.

**Pre-send check** (`npm run presend`) fails while any `[FILL]` placeholder remains. The page can be finished with placeholders; it cannot be declared ready to send with them.

## 6. Look, fonts and motion

- Every brand value lives in `tokens.css`, mapped through Tailwind v4 `@theme`; no arbitrary colour classes.
- Both variable fonts are self-hosted (Latin subset), preloaded and `font-display: swap`, with size-matched fallback faces so a slow font neither moves the button nor overflows at 320px.
- Exactly the PRD's three motion moments. `useInView` over `IntersectionObserver`, about twenty lines.

## 7. Verification before done

- **Automated:** typecheck, lint, tests, coverage, and the JS and page-weight budgets.
- **Real browser on this laptop:** 320px, 360x640, 375x667, 390x844, 768x1024 and 1440x900 with no horizontal overflow; reduced motion; keyboard-only; greyscale; the page with JavaScript off.
- **Lighthouse mobile:** Performance ≥ 95, Accessibility 100, Best Practices ≥ 95.
- **Needs the page online, so it is a pre-send step with the founder's yes:** the real Instagram in-app browser on a real Android and a real iPhone, and the DM preview card.

## 8. Versions

The PRD names Vite 6; the current release is Vite 8. Use the PRD's versions where they work together with current Vitest and TypeScript on this ARM64 laptop, and log any substitution, with its reason, in the drift log.

## 9. Product review (14 Sep 2026)

A product-manager review found that the page fits its job. Its build-time findings are folded into sections 3 to 6. Its questions that must be settled before the link goes to any creator are tracked in `docs/implementation-plan.md`.

**Founder decision (14 Sep 2026, option A):** the FAQ answer "Is this paid right now?" now ends "That's the plan, not a contract.", so it no longer promises cash payouts without the framing PRD 2.4 requires. Applied to `docs/functional-spec.md`.

**Deferred to build step 10 ("cut one thing"):** cut the marquee; hide the seat meter until there is a real number; add "just say I'm in" to the helper line.
