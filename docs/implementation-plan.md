# Implementation plan - Riffi creator page

_How much is done, what is in flight, what is left, and every decision that departs from the PRD. Updated in the same change as the work._

**Last updated:** 14 Sep 2026 - Zuko installed; build design written and awaiting sign-off; the page build has not started.

## Where things stand

- **Done:** Zuko harness installed (profile, stop-and-ask list, CI, review routing, handoff note); the PRD saved as `docs/functional-spec.md`; a product review of the PRD; the build design written (`docs/superpowers/specs/2026-09-14-creator-page-design.md`).
- **In flight:** founder sign-off on the build design.
- **Left:** the whole page - the ten build steps below.

## Build order (PRD section 9)

| # | Step | Status |
|---|---|---|
| 1 | Scaffold Vite + React + TS + Tailwind v4; dev server runs | Not started |
| 2 | `tokens.css` complete and mapped through Tailwind v4 `@theme`; `global.css` | Not started |
| 3 | Both variable fonts installed, wired and rendering | Not started |
| 4 | `content.ts` in full, every `[FILL]` placeholder commented | Not started |
| 5 | Primitives: Section, Chip, CtaButton, TakeCard, then PollBar | Not started |
| 6 | Blocks 1-8 in page order, each checked at 320px | Not started |
| 7 | The three motion moments, each verified under reduced motion | Not started |
| 8 | `og.png`, favicon set, head tags | Not started |
| 9 | Audit: Lighthouse mobile, 320px overflow, keyboard-only, greyscale | Not started |
| 10 | Self-critique against PRD 3.6; cut one thing | Not started |

The definition of done is PRD section 10.

## Before the link goes to any creator

The page is built with clearly marked placeholders, but it must not be sent until everything below is settled. `npm run presend` (added in the build) fails while any `[FILL]` placeholder remains.

**Open inputs (PRD section 8):**

1. The weekly commitment asked of creators (Block 6).
2. The launch-timing answer (Block 7, FAQ).
3. The content-ownership answer, confirmed against the terms (Block 7, FAQ) - or remove the question.
4. The footer legal / contact line (Block 8). Does not block sending.
5. The Instagram handle the button opens, and the deploy domain. The placeholder is `riffi`; it must be confirmed as Riffi's real account.

**Questions from the product review (14 Sep 2026):**

6. **Which inbox.** Do Zyra's outreach DMs come from the same account as the button's handle? If not, yeses split across two inboxes, and DMs from the button may land in message requests.
7. **Preview card.** Set the domain before the first send - the card needs it, and Instagram caches previews.
8. **Commitment vs launch.** Inputs 1 and 2 must agree, and must say where creators can post before launch and what happens after "I'm in".
9. **The 51st yes.** "Claim a seat" meets the FAQ's "we're picking for takes". Decide what an over-subscribed yes hears, and what the page says when batch one is full.
10. **"The front page."** Block 3 promises every first post the front page - it must be true for all 50.
11. **End-to-end proof.** DM the final link to a test account that does not follow Zyra, on a real Android and a real iPhone, through to a sent "I'm in".
12. **Did it help.** From the first send, log every link sent, every "I'm in" and every question asked. The yes-rate is the signal; a question that keeps coming up is a gap on the page.

Plus: the brand kit (logo, colours, typefaces) arrives separately. The swap is `tokens.css` plus one wordmark SVG.

## Decisions log

| Date | Decision | Why |
|---|---|---|
| 14 Sep 2026 | The name is spelled **Riffi** everywhere. | Founder-confirmed. The PRD spelled it "Rifii" (33 times, including the handle placeholder). |
| 14 Sep 2026 | The creator offer is built **exactly as written**: points that convert to vouchers, priority monetisation described as a plan. | Founder-confirmed. The 12 Sep team deck's wind-down of cash rewards applies to regular users, not creators. |
| 14 Sep 2026 | The project lives at `C:\Users\Akshay\Projects\Riffi`, **outside OneDrive**. | OneDrive and Windows Defender hold synced folders open on this laptop - it broke Grinder's deploys twice. |
| 14 Sep 2026 | Zuko uses the recommended options: the promise file is on the stop-and-ask list; stage "before launch"; reviewer `@akshay09438`; no Slack alerts (updates in chat); history kept locally, work on side branches. | The founder moved straight to the build without changing them. Any can be revisited. |

## Drift log - where the build departs from the PRD

| Date | PRD said | Build does | Why |
|---|---|---|---|
| 14 Sep 2026 | "Rifii" | "Riffi" | Founder-confirmed spelling. |
| 14 Sep 2026 | No test tooling specified | Vitest, including tests that enforce the honesty guardrails (PRD 2.4) | Zuko requires tests with every change, and the guardrails are exactly what a test should hold. |
| 14 Sep 2026 | No formatter specified | Prettier, development only | Style is enforced by a tool, not by hand; nothing extra ships to the page. |
