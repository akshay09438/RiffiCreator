# Zuko handoff - Riffi Creator Page

*The single source of truth for "where things stand" between sessions. `/handoff` rewrites this at the end of a session; `/start` and the SessionStart hook replay it at the beginning. Dangerous-surface status is written as a CLAIM to re-verify, never as a settled fact.*

## Last updated

17 Sep 2026, about 3am. The page is built, restyled twice, repositioned for reels creators, and **live on the internet** at https://riffi-creator-page.vercel.app. The whole suite is green. Four of the founder's own answers are still missing, and the live page currently shows placeholder wording in their place, so **the link must not be sent to any creator yet**.

## In flight

- Branch `feat/creator-page`, pushed to https://github.com/akshay09438/RiffiCreator (branches `main` and `feat/creator-page`). No pull request; `main` has never been merged into. The push happened at `8c7bfe8`; the handoff's own commits sit on top of it and still need pushing.
- **Nothing is half-done in code. The suite is green** (292 tests, lint, typecheck, build, budget and the output check - evidence below).
- **The live page carries four unanswered placeholders.** `npm run presend` refuses with eight problems: four `[FILL]` markers and four unconfirmed inputs.
  1. The weekly ask - the page currently says "Post three takes a week through the pre-launch period."
  2. Launch timing - "We're in build. This cohort gets in before public launch."
  3. Who owns what a creator posts - "You do. You keep the rights to your posts and you can take them anywhere." **A rights claim nobody has checked against real terms.**
  4. The footer legal / contact line - blank.
- **Three stock stills are on the live page** (`public/media/sample-one|two|three.jpg`), each behind a burned-in caption, with a line under the deck saying "Stock stills and sample takes. Nobody has posted on Riffi yet, which is the point." CLAIM to re-verify: the founder said these are stock footage and that one is their own shot; nobody has seen a licence. A fourth image the founder offered - a named photographer's promo card carrying his quote - was refused, because on a recruitment page it reads as his endorsement.

## Do first next session

1. Ask the founder for the four open answers, then update `src/content.ts`, flip each `inputsConfirmed` flag, rebuild and redeploy. Until then the live page is for the founder's eyes, not for creators.
2. Read the final adversarial review's open findings (below) and decide which to close before the link goes out.
3. Check whether GitHub Actions ran on the push, and whether it is green. CI has never executed before tonight.

## What the page is now (17 Sep 2026)

Nine blocks, video first: hero, **the reels block** ("You already shoot reels. Here it's just you, talking." - three sample cards, each a stock still with the take burned in as captions, a play mark, a sample pill and a length), the typed option ("Or type it, if that's more your thing."), why here, what creators can do, the long game, 50 seats, the FAQ, the close, then the footer.

- **The conversion is the founder's Google Form**, not an Instagram DM. All three "Claim a seat" buttons open `settings.applyFormUrl`; `src/lib/cta.ts` accepts only `forms.gle` or `docs.google.com/forms` and throws otherwise, so a mistyped link fails the build. The helper line reads "A one minute form. We reply from @get.riffi".
- **No reward points, and no payout figure.** The page says plainly there is no money yet, that a creator is backing Riffi early, and that batch one is first in line when Riffi can pay - a plan, not a contract.
- **The sticker look:** white page with a faint grid, drawn panels, 3px edges and hard offset shadows, an orange marker sweep on the hero's second line and on "Early now.".
- **No em dashes anywhere** in user-facing copy, including the page title.

## Verification evidence (which checks ran, what they returned)

Run at the end of this session, 17 Sep 2026, on `8c7bfe8`:

- `npm test` - **Test Files 13 passed (13), Tests 293 passed (293)**. The last of those closed two guards that would have passed whatever the button pointed at: the pre-rendered check and the button's own check both compared the link with the constant the page built it from, and both are pinned to `settings.applyFormUrl` now.
- `npm run typecheck` - exit 0, no output.
- `npm run lint` - exit 0, no output.
- `npm run build` - succeeded; `prerender: wrote dist/index.html with 2 font preload(s)`.
- `npm run budget` - `page weight 204.2KB - HTML 5.3KB, CSS 5.6KB, JS 68.4KB, fonts 124.8KB, favicon 0.2KB (limit 400KB)`, within both limits. **Gap: the budget script does not count the three stills (about 22-38KB each), so the real first-visit weight is higher than it reports.** They are lazy-loaded and below the fold.
- `npm run check:dist` - passed: the built page loads only its own files and links only to the allowed hosts.
- `npm run presend` - **exit 1, 8 problems**, as listed above. This is the correct behaviour, not a failure.
- Live checks against https://riffi-creator-page.vercel.app: the page returns 200, the headline is the reels one, all three buttons carry `href="https://forms.gle/chyARXHuKTiwV4Yn6"`, `/og.png` and `/media/sample-one.jpg` return 200, and `og:image` points at the live domain.
- Earlier the same day, measured in headless Edge on the built page: layout shift 0 at 320, 360, 375 and 390 on a throttled 4G cold load (budget 0.02); Lighthouse mobile 0.99 performance, 1.00 accessibility, 1.00 best practices, 1.00 SEO; "Claim a seat" above the fold at 320x640 through 1920x1080. **CLAIM to re-verify: those were measured before the reels block, the stills and the laptop layout changes. Re-run them before the link goes out.**

## Open escalations

- **The four open inputs** (above). The ownership answer needs a human who knows the real terms.
- **The final adversarial review (16 Sep) left findings open.** Its full text is in that session's transcript; the ones that still stand:
  - `npm run presend` is not part of CI and not part of the deploy path, so nothing mechanically stops a half-finished page going out. Tonight's deploy was done by hand, past that gate, with the founder's explicit yes.
  - `scripts/check-dist.mjs` accepts a placeholder domain such as `.example` in `og:image`. Moot today because the domain is real, but the hole is still there.
  - Nothing ties `og:title` or `og.png` to `content.ts`, so a copy edit can silently leave the cached DM preview showing the old sentence.
  - `target="_blank"` on the conversion has never been tested inside Instagram's in-app browser. That is still the page's single point of failure.
  - The comparison bars use the same poll device as the hero's real-looking sample, with no caption saying the split is rhetoric rather than a measurement.
- **Nobody has opened the live page on a real Android phone inside Instagram.** The vote-count tick, the marker sweep, the stills and the ₹-free copy all deserve one look there.
- **A Google Form now collects creators' details.** The page says "A one minute form" and nothing about what is collected or who holds it. Worth a line before the link goes out, and worth checking against India's DPDP rules if any applicant may be under 18.
- **Deploys are manual.** `vercel deploy --prebuilt --prod` from a `.vercel/output/static` copy of `dist/`. There is no CI/CD wiring and no custom domain.
- **Zuko harness issues found across this build** (Zuko 1.7.0; source `C:\Users\Akshay\OneDrive\Desktop\zuko-main`): the CI coverage comparison stashes the files it then reads (repaired in this repo only); the guard matches paths outside the project; the Bash write-target detection gives false positives; Zuko's own scripts could not start under `"type": "module"` until `.zuko/package.json` was added here; the in-app Browser pane reads another project's launch configuration; and this Edge build ignores `--screenshot` in headless mode, so `scripts/make-images.mjs` drives the DevTools protocol instead.
- **Incident, 15 Sep 2026:** a command meant to read Edge's version launched a real Edge under the user's own profile, which sat idle for 18 minutes before being force-closed. Rule since: headless only, scratch profile, and never close a process the run did not start.

## Backups

The work is in three places: GitHub (`akshay09438/RiffiCreator`, 46 commits on the branch), the live Vercel deployment, and `Riffi-snapshot-2026-09-17-0230.zip` on the founder's Desktop inside OneDrive.
