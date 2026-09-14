# Technical spec - Riffi creator page (as-built)

_How the page is built, as it actually exists. Updated in the same change as the code. Where this file and the code disagree, the code is right - fix this file and note why in the drift log._

## Status

**Nothing is built yet (14 Sep 2026).** Only the Zuko harness is installed. The planned build is PRD section 5 (in `docs/functional-spec.md`); each section below becomes as-built as the matching build step lands. Progress lives in `docs/implementation-plan.md`.

## Stack (planned)

As PRD section 5.1: Vite, React 19 + TypeScript, Tailwind CSS v4 over a CSS-variable token layer, CSS-only motion with a small `useInView` hook, self-hosted variable fonts (`@fontsource-variable/archivo`, `@fontsource-variable/hanken-grotesk`), Lucide React icons (six at most), static deploy to Vercel. Not used: Next.js, Framer Motion, UI kits, form or state libraries.

Additions beyond the PRD (each recorded in the drift log in `docs/implementation-plan.md`):

- **Vitest** for tests - the PRD does not specify tests; Zuko requires them. Coverage writes `coverage/coverage-summary.json`, which CI reads.
- **Prettier** as the formatter - development only, never shipped to the page.

Exact versions are chosen at build step 1 and recorded here.

## The two rules (PRD 5.2)

1. Every brand value lives only in `src/styles/tokens.css`.
2. Every user-facing string lives only in `src/content.ts`.

How each rule is enforced mechanically is recorded here once built.

## Commands

The npm scripts are created at build step 1. Until then none of these run.

| Purpose | Command |
|---|---|
| Install | `npm ci` |
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Tests | `npm test` (runs once and exits) |
| Coverage | `npm run coverage` |
| Format | `npm run format` |

## Safety net

- **Zuko** (`.zuko/`, `CLAUDE.md` Part B): the stop-and-ask list, time-boxed approvals, the risk scorer.
- **CI** (`.github/workflows/ci.yml`): install, typecheck, lint, tests, secret scan (gitleaks), static analysis (semgrep), coverage no-regression, and the goodnight merge gate. It will be red until build step 1 creates `package.json`. There is no GitHub repository yet, so CI has never run.

## Deploy

Not set up. Planned: Vercel static hosting (PRD 5.1). Deploying is an outward-facing step and needs the founder's explicit yes.

## Known limits

None yet.
