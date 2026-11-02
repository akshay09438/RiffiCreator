# Zuko handoff - Riffi Creator Page

*The single source of truth for "where things stand" between sessions. `/handoff` rewrites this at the end of a session; `/start` and the SessionStart hook replay it at the beginning. Dangerous-surface status is written as a CLAIM to re-verify, never as a settled fact.*

## Last updated

2 Nov 2026. The page was rewritten for creators who are already onboarded (see "What the page is now"). Typecheck, lint, 293 tests, build, `check:dist`, budget and `presend` all pass locally. **Not yet deployed or pushed to `main`; the form has not had a real test submission.**

## In flight

- Branch `claude/peaceful-planck-bn65fr`. Nothing is half-done in code. The founder sent the privacy line back verbatim on 2 Nov 2026, read as confirmation.
- **The details form is new and personal data now flows through it** (email, phone). Before any creator gets the link: submit one real test entry on the built page and confirm it lands in the Google Form's responses. The form is "Riffi Creator Username"; its entry ids were read from the form's own page on 2 Nov 2026. If the form is ever edited or re-created, the ids in `settings.form.fields` change.
- **The Form must stay open to everyone** (not "limited to users in your organisation", no sign-in required) or posts will silently fail: Google gives the page no reply to read.
- **Open promise:** the thank-you says "Once the launch date is fixed, we'll send you an email." No address is named (founder's direction, 2 Nov 2026). The founder must actually email the creators from the form's responses.
- `CLAUDE.md` now lists `src/lib/submit.ts` in the danger list, but `.zuko/config.json` is generated from it and was **not** regenerated here; regenerate it before relying on the hooks.
- The Task 9 audit (Lighthouse, widths, keyboard, greyscale, reduced motion, no-JS) has not been re-run on this version.

## Do first next session

1. Run a real test submission and check the response sheet.
2. Confirm the privacy line and the "we'll message you" promise with the founder.
3. Regenerate `.zuko/config.json`, then deploy via `npm run release`.

## What the page is now (2 Nov 2026)

Short, and speaks only to onboarded creators: a thank-you hero with the launch estimate in its line (mid-November; end of November at worst), the Founding Creator badge shown clearly, a "What's waiting for you." block of five perks (three "At launch", two "Soon"), a details form that posts to the founder's Google Form (the badge is shown beside it too), a three-question FAQ and a closing thank-you. No seat count and no "Claim a seat" any more. The notes below describe the 17 Sep 2026 version and are kept where still true (design, honesty rules, no points, no payout figure).

### Earlier: the 17 Sep 2026 page

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
