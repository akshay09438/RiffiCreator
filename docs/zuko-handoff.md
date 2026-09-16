# Zuko handoff - Riffi Creator Page

*The single source of truth for "where things stand" between sessions. `/handoff` rewrites this at the end of a session; `/start` and the SessionStart hook replay it at the beginning. Dangerous-surface status is written as a CLAIM to re-verify, never as a settled fact.*

## Last updated

16 Sep 2026 - the page is built, restyled to the founder's new direction, and green on every check. Nothing is online, there is no GitHub repository and no pull request. Six of the founder's own answers are still missing, and the page refuses to go online without them.

## In flight

- Branch `feat/creator-page`, 17 commits, working tree clean at `c116e4f`. Never merged; `main` is untouched.
- A final adversarial review of the whole branch was dispatched on 16 Sep (honesty, the DM link, the restyle's contrast, what the tests cannot see, the preview card). Read its findings before anything else.
- Waiting on the founder:
  1. The six open inputs `npm run presend` lists (see below).
  2. Whether to hide the empty seat meter under "50 seats" until there is a real number - it can read as "nobody has joined".
  3. Explicit permission before any outward-facing step (a GitHub repository, a pull request, a deploy).

## Do first next session

Run `/zuko:start`, read the final review's findings, then ask the founder for the six open inputs. Do not put anything online, create a repository, or open a pull request without an explicit yes in chat. `npm run release` is the only deploy path, and it refuses while any input is unconfirmed.

## What was built (16 Sep 2026)

The eight blocks, the nav and the footer, pre-rendered at build time and hydrated; the Instagram DM link as the only conversion; CSS-only motion (the hero rise, the sample poll fill, two scroll reveals, a marquee) with a complete static page under reduced motion and with scripts off; the link-preview card, touch icon and favicon drawn from the page's own tokens.

On 16 Sep the founder redirected the design: the page stays white and the colour lives in the pieces - drawn panels (lime, or ink for the close), cards and chips with a 3px edge and hard offset shadows, a black button with a signal-blue shadow, outlined poll bars, a faint CSS grid, and an orange marker sweep through the hero's second line. The same day the hero's second line became "Here you're one of the first, with almost no competition."

## Verification evidence (which checks ran, what they returned)

16 Sep 2026, on the built page served from a static copy of `dist/`, in headless Edge 153 (the in-app Browser pane reads another project's launch configuration, so it is not used):

- `npm test` 238 tests in 13 files, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run budget`, `npm run check:dist`: all pass.
- Sizes: JavaScript 67.6KB gzipped (limit 90KB); page weight 202.5KB (limit 400KB).
- Lighthouse mobile, pinned 13.4.1, three runs: Performance 0.99, Accessibility 1.00, Best practices 1.00, SEO 1.00; CLS 0; TBT 0ms; FCP 1.20-1.28s; LCP 1.95s / 2.11s / 2.11s - the simulated LCP is marginally over the PRD's 2s target and was 1.95s before the restyle. CLAIM to re-verify on a real phone.
- Layout shift on a throttled 4G cold first load, three loads per width: 0 at 320, 360, 375 and 390 (budget 0.02). Before the headline's stand-in font was tuned it was 0.034-0.060.
- Widths 320-1920: no sideways scrolling, "Claim a seat" above the fold at every phone size. Keyboard: 8 stops in document order with a visible focus ring. Greyscale: every poll bar's values are also text. Reduced motion and scripts-off: the page renders complete.
- CLAIM to re-verify: nothing has been opened on a real Android phone inside Instagram's in-app browser. The vote-count tick, the marker sweep, the drawn shadows and the ₹ glyph are all worth looking at there.

## Open inputs (from `npm run presend`, 13 problems)

1. Riffi's real Instagram handle, without the @ (the button currently opens a placeholder account).
2. The deploy domain, with https:// and no trailing slash (the preview card uses it).
3. The actual weekly commitment asked of creators.
4. Launch timing, which must agree with that commitment.
5. Content ownership - the honest answer, or remove the question.
6. The footer legal / contact line, or leave it empty.

## Open escalations

- **Zuko harness issues found in this build** (Zuko 1.7.0; its source is `C:\Users\Akshay\OneDrive\Desktop\zuko-main`):
  1. *The CI coverage comparison checks nothing* as scaffolded: the base-branch step stashes the files the comparison reads. Repaired in this repo (the files move to `$RUNNER_TEMP`); the template upstream still has it.
  2. *The guard blocks paths outside the project*: an outside path becomes `../../...` and a leading `**/` matches it.
  3. *The Bash write-target detection gives false positives*: a command that merely mentions a protected path in a string was blocked.
  4. *Zuko's own scripts could not start* under the project's `"type": "module"`. Fixed here by `.zuko/package.json` (`{"type":"commonjs"}`), founder-approved on 16 Sep; the harness upstream still ships without it.
  5. *The in-app Browser pane* reads the launch configuration of the folder the chat session started in, not the project's. On 15 Sep it started the Grinder-MIXY project's server; it was stopped within about 40 seconds, nothing in that folder changed, and no page was opened. All page checks since run in a separate headless Edge.
- **Incident, 15 Sep 2026:** a command meant to read Edge's version number launched a real Edge under the user's own profile, which sat idle from 15:40 to 15:58 before the audit force-closed it. Nothing was browsed in it. Rule added for every later run: headless only, with a scratch profile, and never close a process the run did not start.
- **Environment:** this Edge build ignores `--screenshot` in headless mode, writing nothing or a picture of its own error page. `scripts/make-images.mjs` now drives Edge over the DevTools protocol instead.

## Not done, on purpose

No GitHub repository, no pull request, no deploy, no analytics. The final review's findings, the founder's six answers and the seat-meter decision all come before any of that.
