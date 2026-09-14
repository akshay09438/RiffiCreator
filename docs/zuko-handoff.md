# Zuko handoff - Riffi Creator Page

*The single source of truth for "where things stand" between sessions. `/handoff` rewrites this at the end of a session; `/start` and the SessionStart hook replay it at the beginning. Dangerous-surface status is written as a CLAIM to re-verify, never as a settled fact.*

## Last updated

14 Sep 2026 - the build plan for the creator page is written, rehearsed outside the project, and waiting for the founder's approval. No page code or test file exists in the project yet.

## In flight

- `/zuko:build` of the creator page, on the heavy path (it creates stop-and-ask files). Branch `feat/creator-page`.
- Design approved by the founder: option A, the page pre-rendered at build time (`docs/superpowers/specs/2026-09-14-creator-page-design.md`).
- Build plan: `docs/superpowers/plans/2026-09-14-creator-page.md` (Tasks 0-11), with the independent test author's files inside it.
- Waiting on the founder: (1) approval to create the stop-and-ask files the plan lists; (2) whether to extend the stop-and-ask list (plan Task 0).

## Do first next session

Run `/start`, then re-read the plan's "Stop-and-ask files" section. If the founder has given a clear yes in chat: record the approval with `node .zuko/approve.js` for exactly those files (a time limit covering the build, the plan's sha256 in the reason, the founder's own words as the acknowledgement), execute the plan with superpowers:subagent-driven-development, and clear the approval when done. Without a clear yes, present the approval request again - do not start Task 1.

## Verification evidence (which checks ran, what they returned)

- Bootstrap scaffolded: hooks, CI, CODEOWNERS, branch-protection notes, the constitution, and this doc set.
- 14 Sep 2026, practice run of the plan's own code in the session scratch folder (never in the project):
  - `npm install --before=2026-09-07` of the pinned versions: 374 packages, 0 vulnerabilities, install scripts off, the ARM64 native builds present, and the Linux builds CI needs recorded in the lockfile.
  - Typecheck, lint and build pass. JavaScript 67.4KB gzipped (limit 90KB); page weight 201.9KB (limit 400KB). `check:dist` passes.
  - `presend` lists the 12 expected open items, and `npm run release` refuses.
  - The preview card renders in the brand fonts.
  - All 14 test files (the independent author's 181 tests and the plan's own 50) typecheck and lint against that code, held in memory.
  - Negative checks: the lint rules reported all 8 kinds of planted violation (a rule switched off by a comment stays on, because inline config is disabled), and `check:dist` reported all 8 planted problems in a deliberately bad built page.
  - A separate reviewer replayed all 231 test checks against the practice code in its own scripts, not Vitest: 230 held. The plan's own brand-rules pattern for font-family over-matched `font-family: var(...)`; the plan now uses `/font-family\s*:(?!\s*var\()/i`, re-checked against good and bad samples and the practice source.
- CLAIM to re-verify: no test has been executed under Vitest yet. Test files cannot be created before approval, so the first real run is Task 1 of the build.

## Open escalations

- **Founder approval of the build plan** (see In flight).
- **Zuko harness issues found in this session** (Zuko 1.7.0; its source is `C:\Users\Akshay\OneDrive\Desktop\zuko-main`):
  1. *The CI coverage comparison checks nothing.* In `templates/ci/ci.yml`, the base-branch step runs `git stash --include-untracked`, which sweeps `head-summary.json` and `changed-files.txt` out of the working tree before the Compare step reads them, and `zuko-coverage-check.mjs` treats missing files as empty - so every run reports "0 changed file(s) checked". This repo's copy is repaired in plan Task 9 (the files move to `$RUNNER_TEMP`).
  2. *The stop-and-ask guard blocks paths outside the project.* `hooks/lib/paths.js` turns an outside path into `../../...`, and `hooks/lib/match.js` compiles a leading `**/` to `(?:.*/)?`, which also swallows the `../` segments - so `**/*.test.*` blocked the test author from writing drafts in the session scratch folder. Work went on without writing any test file anywhere. A fix must not open a hole when the session starts in a subfolder of the repo.
- **Incident, resolved:** at 21:06 on 14 Sep a practice-install command ran npm's blank-template setup in the project root instead of the scratch folder, creating an untracked `package.json` (a stop-and-ask file). It held only npm's empty template and was never committed; it was moved out to the session scratch folder the same evening. Later practice commands confirm their folder before running.
