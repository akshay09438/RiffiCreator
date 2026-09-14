# Implementation plan - Riffi creator page

_How much is done, what is in flight, what is left, and every decision that departs from the PRD. Updated in the same change as the work._

**Last updated:** 15 Sep 2026 - the founder approved the build plan, and step 0 is done: the stop-and-ask list now also guards the files that decide what ships. The page build starts with Task 1.

## Where things stand

- **Done:** Zuko harness installed (profile, stop-and-ask list, CI, review routing, handoff note); the PRD saved as `docs/functional-spec.md`; a product review of the PRD; the build design written and approved by the founder (`docs/superpowers/specs/2026-09-14-creator-page-design.md`); the step-by-step build plan (`docs/superpowers/plans/2026-09-14-creator-page.md`).
- **How the plan was checked before asking for approval:**
  - Three independent safety reviews. Their findings are fixed in the plan: a tick-list for the open inputs and a single release command that refuses while any is open, a test that every word on the page comes from the content file, a reduced-motion bug, supply-chain protections, and CI that builds the page.
  - 181 behaviour and honesty tests, written by an independent test author who never saw the code.
  - A practice run of the plan's code in a scratch folder outside the project: a clean install of the exact versions, then typecheck, lint, build, the size budgets (JavaScript 67KB of 90KB, the whole page 202KB of 400KB), the output check, the preview images, and the pre-send check (it lists the 12 open items, as it should). The lint rules and the output check were also fed deliberately bad code, and caught every planted problem.
  - A separate reviewer replayed all 231 test checks against that practice code in its own scripts: 230 held. The one that did not was a faulty pattern in the plan's own brand-rules test, which mistook the approved font setting for a hard-coded font; it is fixed in the plan and re-checked. Every test file also typechecks against the code. The tests run for real only once the founder approves creating test files.
- **In flight:** the build, task by task, following the approved plan. Step 0 is done; next is Task 1 (toolchain, content and the call-to-action link).
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

The page is built with clearly marked placeholders, but it must not be sent until everything below is settled. `npm run presend` (added in the build) fails while any `[FILL]` placeholder remains or any open input is not ticked as confirmed.

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

**From the safety reviews of the build plan (14 Sep 2026):**

13. **One way online.** The page goes online only through `npm run release`, which builds it, checks what the built page loads and links to, and refuses while any open input above is unconfirmed or the preview card still points at a placeholder address. Never deploy a bare build, and never put an early build online where it can be shared - Instagram keeps the first preview card it sees.
14. **Raise the stage at first send.** Before the first link goes out, change Zuko's stage from "before launch" to "early", and mark the content file, the link file, the page head and the preview images as not reversible: once a creator has read a promise, changing it is no longer a quiet fix.
15. **Legal check (India's DPDP Act).** Get a legal review before sending: creators under 18 need verifiable parental consent before their data is used; a privacy notice and a grievance contact may be required; and if the WhatsApp option is switched on, its number becomes public.
16. **The WhatsApp label.** "Or message us on WhatsApp" is the build's own wording, not PRD copy. The founder signs it off before WhatsApp is switched on.
17. **Known limits to accept or fix.** The ₹ sign is not in the fonts' Latin files, so it shows in the phone's own font. The styling needs iOS Safari 16.4 or newer; older iPhones get a plainer page.

Plus: the brand kit (logo, colours, typefaces) arrives separately. The swap is `tokens.css` plus one wordmark SVG.

## Decisions log

| Date | Decision | Why |
|---|---|---|
| 14 Sep 2026 | The name is spelled **Riffi** everywhere. | Founder-confirmed. The PRD spelled it "Rifii" (33 times, including the handle placeholder). |
| 14 Sep 2026 | The creator offer is built **exactly as written**: points that convert to vouchers, priority monetisation described as a plan. | Founder-confirmed. The 12 Sep team deck's wind-down of cash rewards applies to regular users, not creators. |
| 14 Sep 2026 | The project lives at `C:\Users\Akshay\Projects\Riffi`, **outside OneDrive**. | OneDrive and Windows Defender hold synced folders open on this laptop - it broke Grinder's deploys twice. |
| 14 Sep 2026 | Zuko uses the recommended options: the promise file is on the stop-and-ask list; stage "before launch"; reviewer `@akshay09438`; no Slack alerts (updates in chat); history kept locally, work on side branches. | The founder moved straight to the build without changing them. Any can be revisited. |
| 14 Sep 2026 | **Build design approved:** the page is pre-rendered to static HTML at build time and hydrated in the browser. | Everything a creator needs must show before scripts load on slow 4G, and PRD Block 1 requires the H1 to render without JS. |
| 14 Sep 2026 | The FAQ answer "Is this paid right now?" ends "That's the plan, not a contract." | Founder-approved (option A): the answer promised cash payouts without the framing PRD 2.4 requires. The reviewer's other three suggestions wait for build step 10. |
| 15 Sep 2026 | **Build plan approved** (`docs/superpowers/plans/2026-09-14-creator-page.md`). Its protected files are created one task at a time: only the current task's files are unlocked, and they are locked again after that task's commit. | Founder-approved ("Yes, start the build"). The plan was rehearsed outside the project first, and the three safety reviews' findings are fixed in it. |
| 15 Sep 2026 | **The stop-and-ask list grows** to guard the files that decide what ships: `package-lock.json`, `.npmrc`, `vite.config.*`, `src/main.tsx`, `scripts/**` and `public/**` (step 0). | Founder-approved ("Yes, protect them too"). Any of them could change the page, or switch a check off, without touching a file already on the list. |

## Drift log - where the build departs from the PRD

| Date | PRD said | Build does | Why |
|---|---|---|---|
| 14 Sep 2026 | "Rifii" | "Riffi" | Founder-confirmed spelling. |
| 14 Sep 2026 | No test tooling specified | Vitest, including tests that enforce the honesty guardrails (PRD 2.4) | Zuko requires tests with every change, and the guardrails are exactly what a test should hold. |
| 14 Sep 2026 | No formatter specified | Prettier, development only | Style is enforced by a tool, not by hand; nothing extra ships to the page. |
| 14 Sep 2026 | FAQ: "...this cohort is first in line for it." | "...this cohort is first in line for it. That's the plan, not a contract." | Founder-approved honesty fix (PRD 2.4). |
| 14 Sep 2026 | The sample poll bar animates "on mount" (5.5) | It animates with CSS from first paint | Works without JavaScript, and starts at first paint instead of after hydration on slow 4G. |
