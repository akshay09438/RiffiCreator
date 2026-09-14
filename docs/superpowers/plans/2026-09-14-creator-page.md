# Riffi Creator Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Riffi Creator Program landing page exactly as `docs/functional-spec.md` (the PRD) specifies - pre-rendered so every word works before JavaScript, with automatic checks that hold the page's honesty rules.

**Architecture:** Vite + React + TypeScript, pre-rendered at build time (design option A, `docs/superpowers/specs/2026-09-14-creator-page-design.md`). `vite build` makes the browser bundle, `vite build --ssr` builds `src/entry-server.tsx`, and `scripts/prerender.mjs` writes the rendered page into `dist/index.html`, which `src/main.tsx` hydrates. All copy and settings live in `src/content.ts`; all brand values live in `src/styles/tokens.css`. Motion is CSS-first, with three small hooks for the scroll reveals and the vote tick.

**Tech Stack:** Vite 6.4.3, React 19.2.8, TypeScript 6.0.3, Tailwind CSS 4.3.3 (`@tailwindcss/vite`), Vitest 4.1.11 with jsdom 29.1.1 and Testing Library, ESLint 10.10.0 with typescript-eslint 8.69.0, Prettier 3.9.6, Fontsource variable fonts 5.3.0, Lucide React 1.41.0, Lighthouse 13.4.1. Microsoft Edge (already installed at `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`) renders the preview images and runs Lighthouse.

## Global Constraints

- Machine: Windows 11 on ARM64, Node 24.14, npm 11.9. Run every command from `C:\Users\Akshay\Projects\Riffi` in Git Bash, on branch `feat/creator-page`.
- Versions are pinned exactly as in Task 1's `package.json`. jsdom stays at 29.1.1 (30.x requires Node 24.15+). TypeScript stays below 6.1 (typescript-eslint 8.69 supports `>=4.8.4 <6.1.0`).
- The name is **Riffi**. Never write "Rifii".
- Every user-facing string lives in `src/content.ts`. Components contain no literal copy; ESLint enforces this in `src/components/**` and `src/App.tsx`.
- Every hex colour, colour function and font name lives in `src/styles/tokens.css` only. No Tailwind arbitrary colour classes. `tests/brand-rules.test.ts` enforces this.
- Motion is exactly three moments (PRD 3.5): the hero load (headline rise, then the sample poll fills over 900ms, then the vote count ticks), the comparison bars on scroll (80ms stagger) and the seat meter on scroll. No fade-and-slide entrances anywhere else. Under `prefers-reduced-motion: reduce` the page renders complete and static. Hover lift only on take cards, only on pointer devices.
- Progressive enhancement: with JavaScript off, all copy, both CTAs, the FAQ and every poll bar at its final split are in the HTML.
- Budgets (PRD 7): JS under 90KB gzipped; page weight under 400KB; LCP under 2.0s on simulated 4G; CLS under 0.02; Lighthouse mobile Performance ≥ 95, Accessibility 100, Best Practices ≥ 95.
- Layout (PRD 3.4, 6): mobile-first from 320px; no horizontal overflow from 320px to 1920px; content column max 1120px; gutters 20px / 32px (md) / 40px (lg); prose max 34rem; section padding 72px / 112px (lg) / 128px (xl); `100dvh`, never `100vh`; tap targets at least 44×44px; left-aligned throughout; sentence case, no all-caps labels.
- Honesty (PRD 2.4): no reward point values; no invented seat count; the ₹ figure framed as an example in the same sentence it appears (PRD Block 5 acceptance); "a plan, not a contract" said explicitly; sample takes labelled as samples; no countdowns, fake testimonials, logos or user counts.
- Accessibility (PRD 7): `header`/`main`/`footer` landmarks; one `h1`; each section labelled by its heading; visible 2px `--signal` focus ring with 2px offset; text contrast ≥ 4.5:1 (≥ 3:1 for large display). Text on a `--signal` fill is never used; `--signal` is never used for small text; text on `--take` is white.
- Colour contrast fix: `--chip-coral-ink` is `#BC382A`, because the PRD's `#C0392B` measures 4.47:1 on `--chip-coral-bg` (drift log).
- No `<form>`, no email capture, no third-party requests, no analytics.
- Supply chain: every pinned version was published at least 7 days before approval; `npm install --before=2026-09-07` resolves the whole dependency tree the same way; `.npmrc` sets `ignore-scripts=true`, so no package runs code at install time.
- The page goes online only through `npm run release` (build, output check, pre-send check) - never a bare build.
- Open inputs ship as placeholders under comment lines marked `[FILL] <n>` in `src/content.ts`; `npm run presend` fails while any remain.
- `npm test` runs once and exits. Tests live in `tests/`. A test file that needs no DOM starts with `// @vitest-environment node`.
- Commit at the end of each task, ending the message with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

## Stop-and-ask files: founder approval before execution

Zuko's guard blocks every write to these paths until the founder approves and the controller records it with `node .zuko/approve.js`. The complete list this plan creates:

`package.json`, `eslint.config.js`, `vitest.config.ts`, `index.html`, `src/content.ts`, `src/lib/cta.ts`, `tests/setup.ts`, `tests/honesty-rules.ts`, `tests/content.test.ts`, `tests/cta.test.ts`, `tests/presend.test.ts`, `tests/head.test.ts`, `tests/prerender.test.ts`, `tests/brand-rules.test.ts`, `tests/hooks.test.tsx`, `tests/primitives.test.tsx`, `tests/poll-bar.test.tsx`, `tests/page.test.tsx`, `tests/images.test.ts`, `tests/copy-source.test.tsx`, `.github/workflows/ci.yml`

If the founder also approves extending the stop-and-ask list (Task 0), these become guarded as well and are covered by the same approval: `CLAUDE.md` and `.github/CODEOWNERS` (Task 0 itself), `.npmrc`, `package-lock.json`, `vite.config.ts`, `src/main.tsx`, `scripts/prerender.mjs`, `scripts/presend.mjs`, `scripts/budget.mjs`, `scripts/make-images.mjs`, `scripts/check-dist.mjs`, `public/og.png`, `public/apple-touch-icon.png`, `public/favicon.svg`.

`CLAUDE.md` is edited again in Task 10 (the architecture map); the controller asks the founder separately when Task 10 is reached.

The controller unlocks these files one task at a time. Just before a task starts, it records an approval for only that task's protected files: `node .zuko/approve.js --files "<that task's protected files>" --ttl-min 120 --reason "Build plan <sha256 prefix>, Task <n>" --ack "<the founder's own words>"`. Right after the task's commit it clears the approval with `node .zuko/approve.js --clear`. So no task can edit another task's protected files - in particular, no later task can touch an earlier task's tests. If a task outlasts the two hours, the controller records the same task's files again under the same approval and says so in the chat. A protected file that a task does not list - for example, a fix the Task 9 audit calls for - needs the founder's yes first.

If the guard blocks any write, stop and report it. Never work around it (no shell redirects, no renamed files).

`tests/content.test.ts`, `tests/cta.test.ts`, `tests/presend.test.ts`, `tests/head.test.ts` and `tests/page.test.tsx` were written by an independent test author from the PRD. Never edit them to make code pass. If one looks wrong, stop and report it.

## File Structure

```
Riffi/
├─ .gitattributes              LF line endings on every machine
├─ .gitignore                  (modify) also ignore dist-server/
├─ .prettierrc.json            formatter settings
├─ .prettierignore             keeps the formatter off docs and the Zuko harness
├─ .npmrc                      no install scripts, exact versions
├─ package.json                pinned dependencies and scripts
├─ tsconfig.json               one strict config for src, tests and the two configs
├─ vite.config.ts              React and Tailwind plugins
├─ vitest.config.ts            jsdom, the setup file, the coverage summary CI reads
├─ eslint.config.js            TypeScript and React hooks rules; no literal copy in components
├─ index.html                  PRD 5.6 head tags, the `js` class script, the pre-render placeholder
├─ scripts/
│  ├─ prerender.mjs            writes the rendered page into dist/index.html, fills the site URL, preloads fonts
│  ├─ presend.mjs              fails while any [FILL] placeholder remains
│  ├─ budget.mjs               checks the JS and page-weight budgets on dist/
│  ├─ check-dist.mjs           fails if the built page loads anything but its own files, or links anywhere but Instagram or WhatsApp
│  └─ make-images.mjs          renders public/og.png, apple-touch-icon.png and favicon.svg with Edge
├─ public/                     og.png, apple-touch-icon.png, favicon.svg (generated, committed)
├─ src/
│  ├─ main.tsx                 hydrates the pre-rendered page
│  ├─ entry-server.tsx         render() and siteUrl for the pre-render step
│  ├─ App.tsx                  header, the eight sections in order, footer - nothing else
│  ├─ content.ts               ALL copy and settings
│  ├─ lib/cta.ts               the DM link and the WhatsApp fallback link
│  ├─ styles/tokens.css        ALL brand values
│  ├─ styles/global.css        Tailwind theme mapping, type scale, base, component and motion CSS
│  ├─ hooks/                   useReducedMotion.ts, useInView.ts, useCountUp.ts
│  └─ components/
│     ├─ primitives/           Section, Chip, CtaButton, TakeCard, Wordmark, PollBar
│     └─ blocks/               Nav, Hero, WhatRiffiIs, WhyHere, HowYouEarn, LongGame, Seats, Faq, Close, Footer
└─ tests/                      setup.ts, honesty-rules.ts (shared honesty patterns) and the test files named in each task
```

---

### Task 0: Extend the stop-and-ask list (controller, founder decision)

User job: the checks that keep the page honest, and the files that decide what ships, cannot be changed quietly. Skip this task if the founder declines it.

**Files:**
- Modify: `CLAUDE.md` (Part B prose and the `zuko:config` block), `.github/CODEOWNERS`

**Interfaces:**
- Produces: `.zuko/config.json` regenerated from `CLAUDE.md` by the next hook run, with 21 dangerous globs.

- [ ] **Step 1: Record the founder's approval for exactly these two files**

Run: `node .zuko/approve.js --files "CLAUDE.md,.github/CODEOWNERS" --reason "Guard the build's safety net and supply chain" --ack "<the founder's own words>"`
Expected: `Approved 2 file(s) for 30 min:` followed by both paths.

- [ ] **Step 2: Add the globs to `CLAUDE.md`**

In `CLAUDE.md`, replace:

```
    ".zuko/config.json"
  ],
```

with:

```
    ".zuko/config.json",
    "package-lock.json",
    ".npmrc",
    "vite.config.*",
    "src/main.tsx",
    "scripts/**",
    "public/**"
  ],
```

Then replace:

```
      ".zuko/config.json": {
        "sensitivity": "auth",
        "reversibilityClass": "reversible"
      }
```

with:

```
      ".zuko/config.json": {
        "sensitivity": "auth",
        "reversibilityClass": "reversible"
      },
      "package-lock.json": {
        "sensitivity": "internal",
        "reversibilityClass": "reversible"
      },
      ".npmrc": {
        "sensitivity": "internal",
        "reversibilityClass": "reversible"
      },
      "vite.config.*": {
        "sensitivity": "internal",
        "reversibilityClass": "reversible"
      },
      "src/main.tsx": {
        "sensitivity": "internal",
        "reversibilityClass": "reversible"
      },
      "scripts/**": {
        "sensitivity": "internal",
        "reversibilityClass": "reversible"
      },
      "public/**": {
        "sensitivity": "user-data",
        "reversibilityClass": "reversible"
      }
```

Then, in the prose list above the config block, after the bullet that starts `- **The rulebook itself**`, add:

```
- **What decides what ships** (`package-lock.json`, `.npmrc`, `vite.config.*`, `src/main.tsx`, `scripts/**`, `public/**`) - the exact library versions, the build and pre-render steps, the pre-send and output checks, and the link-preview image Instagram caches. Changing any of these can put something on the page, or switch a check off, without touching another file on this list.
```

- [ ] **Step 3: Add the owners to `.github/CODEOWNERS`**

In `.github/CODEOWNERS`, replace:

```
.zuko/config.json @akshay09438
```

with:

```
.zuko/config.json @akshay09438
package-lock.json @akshay09438
.npmrc @akshay09438
vite.config.* @akshay09438
src/main.tsx @akshay09438
scripts/** @akshay09438
public/** @akshay09438
```

- [ ] **Step 4: Confirm the guard reads the new list, clear the approval, commit**

Run: `node -e "console.log(require('./.zuko/config.json').dangerousGlobs.length)"`
Expected: `21`.

```bash
node .zuko/approve.js --clear
git add CLAUDE.md .github/CODEOWNERS .zuko/config.json
git commit -m "chore: guard the build's safety net and supply chain" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 1: Toolchain, content and the call-to-action link

User job: every word a creator reads, and the one button they tap, come from one checked source - so no promise on the page can drift and the DM always reaches Riffi's account.

**Files:**
- Create: `.gitattributes`, `.prettierrc.json`, `.prettierignore`, `.npmrc`, `package.json`, `package-lock.json` (generated), `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, `tests/setup.ts`, `src/content.ts`, `src/lib/cta.ts`, `scripts/presend.mjs`
- Test: `tests/content.test.ts`, `tests/cta.test.ts`, `tests/presend.test.ts` (independent test author - copy verbatim), with `tests/honesty-rules.ts`, the honesty patterns they share with Task 7

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `src/content.ts`: `export type Settings`; `export const settings: Settings`; `export const content` (shape as written in Step 5).
  - `src/lib/cta.ts`: `instagramDmHref(handle: string): string`; `whatsappHref(number: string, message: string): string`; `ctaHref: string`; `whatsappFallbackHref: string | null`.
  - CLI: `node scripts/presend.mjs [file]` - exit 1 listing `<file>:<line>: <text>` for each line matching `/\[\s*FILL\b/i` and each `false` entry in the file's `inputsConfirmed` block, else exit 0 printing `presend: no [FILL] placeholders left.` With no argument it checks `src/content.ts`, and also fails if `dist/index.html` exists and still contains `__SITE_URL__` or a `.example` domain.
  - npm scripts: `dev`, `build`, `preview`, `typecheck`, `lint`, `test`, `coverage`, `format`, `presend`, `budget`, `images`, `check:dist`, `release`.

- [ ] **Step 1: Create the toolchain files**

`.gitattributes`:

```
* text=auto eol=lf
*.png binary
*.woff2 binary
```

`.prettierrc.json`:

```json
{
  "singleQuote": true,
  "printWidth": 100
}
```

`.prettierignore`:

```
dist
dist-server
coverage
public
package-lock.json
docs
CLAUDE.md
AGENTS.md
.zuko
.github
```

`.npmrc`:

```
ignore-scripts=true
save-exact=true
```

`package.json`:

```json
{
  "name": "riffi-creator-page",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "engines": {
    "node": ">=24"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build && vite build --ssr src/entry-server.tsx --outDir dist-server && node scripts/prerender.mjs",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "lint": "eslint .",
    "test": "vitest run",
    "coverage": "vitest run --coverage",
    "format": "prettier --write .",
    "presend": "node scripts/presend.mjs",
    "budget": "node scripts/budget.mjs",
    "images": "node scripts/make-images.mjs",
    "check:dist": "node scripts/check-dist.mjs",
    "release": "npm run build && npm run check:dist && npm run presend"
  },
  "dependencies": {
    "@fontsource-variable/archivo": "5.3.0",
    "@fontsource-variable/hanken-grotesk": "5.3.0",
    "lucide-react": "1.41.0",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@eslint/js": "10.0.1",
    "@tailwindcss/vite": "4.3.3",
    "@testing-library/dom": "10.4.1",
    "@testing-library/jest-dom": "7.0.1",
    "@testing-library/react": "16.3.3",
    "@types/node": "24.13.3",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.7",
    "@vitejs/plugin-react": "5.2.0",
    "@vitest/coverage-v8": "4.1.11",
    "eslint": "10.10.0",
    "eslint-plugin-react-hooks": "7.1.1",
    "globals": "17.12.0",
    "jsdom": "29.1.1",
    "lighthouse": "13.4.1",
    "prettier": "3.9.6",
    "tailwindcss": "4.3.3",
    "typescript": "6.0.3",
    "typescript-eslint": "8.69.0",
    "vite": "6.4.3",
    "vitest": "4.1.11"
  }
}
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client", "node"]
  },
  "include": ["src", "tests", "vite.config.ts", "vitest.config.ts"]
}
```

`vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { target: 'es2020' },
});
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx'],
      reporter: ['text', 'json-summary'],
      reportsDirectory: 'coverage',
    },
  },
});
```

`eslint.config.js`:

```js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'dist-server', 'coverage', 'public', '.zuko', '.github']),
  // No eslint-disable comments: a rule changes here, in review, or not at all.
  { linterOptions: { noInlineConfig: true } },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    // The page sends nothing anywhere and reads no build-time secrets (PRD 5.1, 5.4).
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'The page makes no network requests.' },
        { name: 'XMLHttpRequest', message: 'The page makes no network requests.' },
        { name: 'WebSocket', message: 'The page makes no network requests.' },
        { name: 'EventSource', message: 'The page makes no network requests.' },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'navigator', property: 'sendBeacon', message: 'The page makes no network requests.' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.type='MetaProperty'][property.name='env']",
          message: 'The page reads no environment variables: anything in VITE_ ships publicly.',
        },
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'No raw HTML: every string renders as text from src/content.ts.',
        },
      ],
    },
  },
  {
    // PRD 5.2, rule 2: every user-facing string lives in src/content.ts. tests/copy-source.test.tsx is
    // the complete check; this rule gives fast feedback while editing. It repeats the two rules above
    // because a later no-restricted-syntax setting replaces an earlier one for the same files.
    files: ['src/components/**/*.tsx', 'src/App.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.type='MetaProperty'][property.name='env']",
          message: 'The page reads no environment variables: anything in VITE_ ships publicly.',
        },
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'No raw HTML: every string renders as text from src/content.ts.',
        },
        { selector: 'JSXText[value=/\\S/]', message: 'User-facing text belongs in src/content.ts.' },
        {
          selector: ':matches(JSXElement, JSXFragment) > JSXExpressionContainer > Literal[value=/\\S/]',
          message: 'User-facing text belongs in src/content.ts.',
        },
        {
          selector:
            ':matches(JSXElement, JSXFragment) > JSXExpressionContainer > TemplateLiteral > TemplateElement[value.raw=/\\S/]',
          message: 'User-facing text belongs in src/content.ts.',
        },
        {
          selector: 'JSXAttribute[name.name=/^(aria-label|alt|title|placeholder)$/] Literal',
          message: 'Accessible text belongs in src/content.ts.',
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: { globals: { ...globals.node } },
  },
]);
```

`tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());
```

- [ ] **Step 2: Install and confirm the native pieces for ARM64**

Run: `npm install --before=2026-09-07`
Expected: ends with `added <n> packages` and creates `package-lock.json`; no `ERESOLVE` error. `--before` resolves every transitive package to a release that was at least a week old at approval, and `.npmrc` stops any install script from running.

Run: `ls -d node_modules/@rollup/rollup-win32-arm64-msvc node_modules/@esbuild/win32-arm64 node_modules/lightningcss-win32-arm64-msvc node_modules/@tailwindcss/oxide-win32-arm64-msvc`
Expected: all four paths print, with no "No such file" error.

- [ ] **Step 3: Write the failing tests (copy the independent test author's files verbatim)**

The shared honesty patterns come first. They are not a test file: this task's content test and Task 7's page test both import them, so the check on the copy and the check on the rendered page cannot drift apart.

`tests/honesty-rules.ts`:

```ts
// Honesty patterns shared by content.test.ts and page.test.tsx (PRD 2.4, design 5).
// One copy, so the check on the copy and the check on the rendered page cannot drift apart.

/** A number (digits or a spelled-out number) directly before or after "points" / "pts". */
export const NUMBER_NEXT_TO_POINTS = new RegExp(
  [
    String.raw`\d[\d,.]*\s*[+x×*-]?\s*(?:points?|pts)\b`,
    String.raw`\b(?:one|two|three|four|five|six|seven|eight|nine|ten|twenty|fifty|hundred|thousand|lakhs?)\s+(?:points?|pts)\b`,
    String.raw`\b(?:points?|pts)\s*[:=+x×*-]?\s*\d`,
  ].join('|'),
  'i',
);

/** A payout figure. */
export const MONEY = /₹|\bRs\.?\s?\d|\bINR\b/;

/** Words that frame a figure as an example of the shape, never a rate card. */
export const EXAMPLE_FRAMING = /\b(?:example|shape|illustration|illustrative|for instance)\b/i;

/** Countdown, deadline or pressure language. */
export const URGENCY =
  /\b(?:countdown|deadline|hurry|last chance|act now|don'?t miss|limited time|closing soon|ends? (?:today|tonight|soon)|expires?|only \d+|\d+\s*(?:seats?\s+)?(?:left|remaining)|(?:hours?|days?|minutes?|mins?)\s+(?:left|remaining|to go))\b/i;

/** A seat count such as "37/50", "37 of 50", "13 left" or "taken: 37". */
export const SEAT_COUNT =
  /\b\d+\s*(?:\/|of|out of)\s*\d+\b|\b\d+\s+(?:seats?\s+)?(?:taken|left|remaining|claimed|filled|gone)\b|\b(?:taken|claimed|filled)\s*:?\s*\d/i;

export const sentencesOf = (text: string): string[] => text.split(/(?<=[.!?])\s+/);
```

`tests/content.test.ts`:

```ts
// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { content, settings } from '../src/content';
import { EXAMPLE_FRAMING, MONEY, NUMBER_NEXT_TO_POINTS, URGENCY, sentencesOf } from './honesty-rules';

// Every expected string below is copied from docs/functional-spec.md (the PRD), section 4 and
// the appendix, with the founder-approved changes: the name is Riffi, and the answer to
// "Is this paid right now?" ends with "That's the plan, not a contract."
// Placeholder values (PRD 8) are deliberately not pinned, except the Block 6 seat defaults.

const contentSource = readFileSync(fileURLToPath(new URL('../src/content.ts', import.meta.url)), 'utf8');

const VALID_HANDLE = /^(?!\.)(?!.*\.\.)(?!.*\.$)[A-Za-z0-9._]{1,30}$/;

type Found = { path: string; text: string };

function collectStrings(value: unknown, path: string): Found[] {
  if (typeof value === 'string') return [{ path, text: value }];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStrings(item, `${path}[${index}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => collectStrings(item, `${path}.${key}`));
  }
  return [];
}

// Every piece of text the content module can put in front of a creator,
// including what takenLabel produces for a real count.
const allCopy: Found[] = [
  ...collectStrings(content, 'content'),
  ...collectStrings(settings.whatsapp.message, 'settings.whatsapp.message'),
  { path: 'content.seats.takenLabel(37, 50)', text: content.seats.takenLabel(37, 50) },
];

const offending = (pattern: RegExp): Found[] => allCopy.filter(({ text }) => pattern.test(text));

describe('honesty guardrails in the content (PRD 2.4, design 5)', () => {
  it('never puts a number next to the word "points" or "pts"', () => {
    expect(offending(NUMBER_NEXT_TO_POINTS)).toEqual([]);
  });

  it('has no digits at all in the earn rows or the earn note, so no point value can hide there', () => {
    const earnCopy = collectStrings(content.howYouEarn, 'content.howYouEarn');
    expect(earnCopy.filter(({ text }) => /\d/.test(text))).toEqual([]);
  });

  it('frames every payout figure as an example inside the very sentence it appears in', () => {
    const moneySentences = allCopy.flatMap(({ path, text }) =>
      sentencesOf(text)
        .filter((sentence) => MONEY.test(sentence))
        .map((sentence) => ({ path, sentence })),
    );
    expect(moneySentences.length).toBeGreaterThan(0);
    expect(moneySentences.filter(({ sentence }) => !EXAMPLE_FRAMING.test(sentence))).toEqual([]);
  });

  it('says "That\'s an illustration, not a rate card" alongside the payout figure', () => {
    const payouts = content.longGame.items.find((item) => MONEY.test(item.body));
    expect(payouts?.body).toContain("That's an illustration, not a rate card");
  });

  it('frames the long game as "plan, not a contract"', () => {
    expect(content.longGame.framing).toContain('plan, not a contract');
  });

  it('frames the answer to "Is this paid right now?" as "plan, not a contract"', () => {
    const paid = content.faq.items.find((item) => item.question === 'Is this paid right now?');
    expect(paid?.answer).toContain('plan, not a contract');
  });

  it('labels every sample take as a sample: the hero chip, the marquee chip and the hidden list label', () => {
    expect(content.hero.sampleTake.chip).toBe('sample take');
    expect(content.whatRiffiIs.marqueeChip).toBe('sample take');
    expect(content.whatRiffiIs.marqueeLabel).toBe('Sample takes');
  });

  it('uses no countdown, deadline or urgency language', () => {
    expect(offending(URGENCY)).toEqual([]);
  });

  it('never spells the name "Rifii", in any value or anywhere in the file', () => {
    expect(offending(/rifii/i)).toEqual([]);
    expect(contentSource).not.toMatch(/rifii/i);
  });

  it('never puts a [FILL marker inside a value a creator could see', () => {
    expect(offending(/\[\s*FILL\b/i)).toEqual([]);
  });
});

describe('settings', () => {
  it('has an Instagram handle that is a valid handle (no @, spaces, slashes, or stray dots)', () => {
    expect(settings.instagramHandle).toMatch(VALID_HANDLE);
  });

  it('has an https site URL with no trailing slash, so "__SITE_URL__/og.png" becomes a clean absolute URL', () => {
    const url = new URL(settings.siteUrl);
    expect(url.protocol).toBe('https:');
    expect(settings.siteUrl).toBe(settings.siteUrl.trim());
    expect(settings.siteUrl.endsWith('/')).toBe(false);
    expect(url.search).toBe('');
    expect(url.hash).toBe('');
  });

  it('keeps the WhatsApp fallback switched off by default', () => {
    expect(settings.whatsapp.enabled).toBe(false);
    expect(typeof settings.whatsapp.number).toBe('string');
    expect(typeof settings.whatsapp.message).toBe('string');
  });

  it('ships with no invented seat count: total 50, taken null, show false (PRD Block 6)', () => {
    expect(settings.seats).toEqual({ total: 50, taken: null, show: false });
  });

  it('uses one split for every comparison row, with the Instagram side smaller than the Riffi side', () => {
    const { instagram, riffi } = settings.comparisonSplit;
    expect(Number.isFinite(instagram) && instagram > 0).toBe(true);
    expect(Number.isFinite(riffi) && riffi > instagram).toBe(true);
    for (const row of content.whyHere.rows) {
      expect(Object.keys(row).sort()).toEqual(['instagram', 'label', 'riffi']);
    }
  });
});

describe('the call-to-action copy', () => {
  it('labels the button "Claim a seat"', () => {
    expect(content.cta.label).toBe('Claim a seat');
  });

  it('builds the helper line from the same handle the link uses', () => {
    expect(content.cta.helper).toBe(`Opens a DM with @${settings.instagramHandle}`);
  });

  it('labels the WhatsApp fallback "Or message us on WhatsApp"', () => {
    expect(content.cta.whatsappLabel).toBe('Or message us on WhatsApp');
  });
});

describe('copy matches the PRD word for word', () => {
  it('nav: the Riffi wordmark and the Batch 01 chip', () => {
    expect(content.nav).toEqual({ wordmark: 'Riffi', batch: 'Batch 01' });
  });

  it('hero: the two title lines and the subline', () => {
    expect(content.hero.titleLines).toEqual(["On Instagram you're one of lakhs.", "Here you're one of 50."]);
    expect(content.hero.subline).toBe(
      "Riffi is India's platform for opinions. We're taking 50 creators in before launch and pointing the feed at them.",
    );
  });

  it('hero: the sample take, 71% agree / 29% disagree, 2,140 votes', () => {
    expect(content.hero.sampleTake).toEqual({
      chip: 'sample take',
      text: 'Being early beats being good.',
      agree: { label: 'agree', percent: 71 },
      disagree: { label: 'disagree', percent: 29 },
      votes: 2140,
      votesLabel: 'votes',
    });
  });

  it('what Riffi is: heading, lead and the contrast pair', () => {
    expect(content.whatRiffiIs.heading).toBe("Twitter took news. We're taking opinions.");
    expect(content.whatRiffiIs.lead).toBe(
      'Riffi is built for one thing: what you think. Not what happened, not who said it. Your take, and whether the room agrees.',
    );
    expect(content.whatRiffiIs.notTake).toEqual({
      chip: 'not a take',
      text: 'India won by 6 wickets in Chennai.',
      caption: "That's news. It's already everywhere.",
    });
    expect(content.whatRiffiIs.take).toEqual({
      chip: 'a take',
      text: "Chasing in Chennai got easier and everyone's pretending it didn't.",
      caption: "That's yours. Nobody else posted it.",
    });
  });

  it('what Riffi is: the ten category chips, in order', () => {
    expect(content.whatRiffiIs.categories).toEqual([
      'Cricket',
      'Politics',
      'Movies',
      'Food',
      'Campus',
      'Money',
      'Music',
      'Startups',
      'Sports',
      'Fashion',
    ]);
  });

  it('what Riffi is: the eight marquee takes, in order', () => {
    expect(content.whatRiffiIs.marqueeTakes).toEqual([
      'Test cricket is the only format that still tells the truth.',
      "Bengaluru traffic isn't an infrastructure problem, it's a scheduling one.",
      'Every biopic in the last five years is an ad for its subject.',
      "Filter coffee beats any third-wave pour over and it isn't close.",
      'Hostel mess food built more resilience than any gym ever will.',
      'Reels killed the Indian meme page.',
      'Paneer is overrated and we all know it.',
      "The best captain of this generation isn't the one you're thinking of.",
    ]);
  });

  it('why here: heading, side labels, the four comparison rows and the closer', () => {
    expect(content.whyHere.heading).toBe("You're not early on Instagram. You're early here.");
    expect(content.whyHere.instagramLabel).toBe('Instagram');
    expect(content.whyHere.riffiLabel).toBe('Riffi');
    expect(content.whyHere.rows).toEqual([
      { label: "Creators you're up against", instagram: 'Lakhs', riffi: '49' },
      { label: 'Who decides your reach', instagram: 'A feed tuned for watch time', riffi: "A feed we're still writing" },
      { label: 'What your first post gets', instagram: 'Buried', riffi: 'The front page' },
      {
        label: 'What you own at the end',
        instagram: 'Followers on rented land',
        riffi: 'A position on a platform still being built',
      },
    ]);
    expect(content.whyHere.closer).toBe('And a reel costs you four hours. A take costs you forty seconds.');
  });

  it('how you earn: heading, the points pill, the five rows and the note', () => {
    expect(content.howYouEarn.heading).toBe('You earn from post one.');
    expect(content.howYouEarn.pill).toBe('points');
    expect(content.howYouEarn.rows).toEqual([
      { action: 'Post a take', description: 'The opinion itself. Every one counts.' },
      { action: 'Write the long version', description: 'When a take needs more than a line, write it out.' },
      { action: 'Add images', description: 'Screenshots, stills, memes, whatever makes the point land.' },
      { action: 'Drop a story', description: 'Short-lived posts, same as you already do.' },
      { action: 'Get the room talking', description: 'Votes, replies and reshares on your take earn on top.' },
    ]);
    expect(content.howYouEarn.note).toBe(
      "Points convert to vouchers. Exact values go live with the app — we're still tuning them, and we'd rather publish them once than change them on you.",
    );
  });

  it('the long game: heading, the three items and the framing line', () => {
    expect(content.longGame.heading).toBe('Points now. Priority later.');
    expect(content.longGame.items).toEqual([
      {
        title: 'Performance payouts',
        body: "When we switch on view-based payouts, this cohort is in the first batch. To give you the shape of it: a post crossing a lakh views lands somewhere in the ₹5,000–10,000 band. That's an illustration, not a rate card — we'll publish real slabs before it goes live.",
      },
      {
        title: 'Brand deals',
        body: "Brands reach a platform through its top creators. On a platform with 50 creators, that's a much shorter list than the one you're on now.",
      },
      {
        title: 'Whatever comes after',
        body: "Subscriptions, tipping, whatever we build — this cohort gets it before anyone else. That's the deal for being here first.",
      },
    ]);
    expect(content.longGame.framing).toBe(
      "All of this is our plan, not a contract. We'd rather you come in knowing exactly that.",
    );
  });

  it('50 seats: heading and meter label, with the commitment body present as real text', () => {
    expect(content.seats.heading).toBe("50 seats. Here's what we ask.");
    expect(content.seats.meterLabel).toBe('50 seats in batch one');
    expect(content.seats.body.trim()).not.toBe('');
  });

  it('50 seats: the taken label shows the real count it is given', () => {
    expect(content.seats.takenLabel(37, 50)).toContain('37');
    expect(content.seats.takenLabel(12, 50)).toContain('12');
  });

  it('FAQ: heading and the six questions, in order', () => {
    expect(content.faq.heading).toBe('Before you ask');
    expect(content.faq.items.map((item) => item.question)).toEqual([
      'Do I have to leave Instagram?',
      'My following is small. Does that matter?',
      'Is this paid right now?',
      'What can I post about?',
      'When does Riffi launch?',
      'Who owns what I post?',
    ]);
  });

  it('FAQ: the four answers that are not open inputs, and real text for the two that are', () => {
    expect(content.faq.items.slice(0, 4).map((item) => item.answer)).toEqual([
      'No. Keep posting exactly where you post now. A take is a sentence, not a shoot — this sits alongside what you already do.',
      "No. We're picking for takes, not reach. Most of this cohort is under 20k and that's deliberate.",
      "You earn points from your first post and points convert to vouchers. Cash payouts arrive with monetisation, and this cohort is first in line for it. That's the plan, not a contract.",
      'Anything you have a real opinion on. Cricket, politics, films, food, campus, money. Opinions, not news reports.',
    ]);
    for (const item of content.faq.items) expect(item.answer.trim()).not.toBe('');
  });

  it('close: heading and body, with the footer line as text (empty until PRD input 4 is answered)', () => {
    expect(content.close.heading).toBe('50 seats. Batch one.');
    expect(content.close.body).toBe(
      "If you've got opinions and you're tired of shouting them into a feed that doesn't know you, take one.",
    );
    expect(typeof content.close.footerLine).toBe('string');
  });
});

describe('TODAY: open inputs 1 to 5 are still marked [FILL] - update deliberately, one input at a time, as the founder answers each (PRD 8 and 10)', () => {
  const lines = contentSource.split(/\r?\n/);
  const markers = lines
    .map((text, index) => ({ text, index, input: /\[FILL\]\s+(\d+)/.exec(text)?.[1] }))
    .filter(({ text }) => /\[\s*FILL\b/i.test(text));
  const markersFor = (input: string) => markers.filter((marker) => marker.input === input);
  const nextLine = (index: number): string => lines.slice(index + 1).find((line) => line.trim() !== '') ?? '';
  const around = (index: number): string => lines.slice(Math.max(0, index - 3), index + 4).join('\n');

  it('has exactly six marker lines: inputs 1 to 4 once each, and input 5 twice (handle and domain)', () => {
    expect(markers.map(({ input }) => input).sort()).toEqual(['1', '2', '3', '4', '5', '5']);
  });

  it('uses "[FILL" nowhere except those six marker lines', () => {
    expect((contentSource.match(/\[\s*FILL\b/gi) ?? []).length).toBe(6);
  });

  it('puts every marker in a comment line, never inside a value', () => {
    for (const { text } of markers) expect(text.trim()).toMatch(/^(?:\/\/|\/\*|\*)/);
  });

  it('marks input 1 directly above the seat commitment body', () => {
    const [marker] = markersFor('1');
    expect(marker).toBeDefined();
    const index = marker?.index ?? -1;
    expect(nextLine(index)).toMatch(/\bbody\b/);
    const opening = content.seats.body.split(/['"`\\]/)[0]?.slice(0, 16) ?? '';
    expect(lines.slice(index + 1, index + 4).join('\n')).toContain(opening);
  });

  it('marks input 2 directly above the answer to "When does Riffi launch?"', () => {
    const [marker] = markersFor('2');
    expect(marker).toBeDefined();
    expect(nextLine(marker?.index ?? -1)).toMatch(/\banswer\b/);
    expect(around(marker?.index ?? 0)).toContain('When does Riffi launch?');
  });

  it('marks input 3 directly above the answer to "Who owns what I post?"', () => {
    const [marker] = markersFor('3');
    expect(marker).toBeDefined();
    expect(nextLine(marker?.index ?? -1)).toMatch(/\banswer\b/);
    expect(around(marker?.index ?? 0)).toContain('Who owns what I post?');
  });

  it('marks input 4 directly above the footer line', () => {
    const [marker] = markersFor('4');
    expect(marker).toBeDefined();
    expect(nextLine(marker?.index ?? -1)).toMatch(/\bfooterLine\b/);
  });

  it('marks input 5 directly above both the Instagram handle and the site URL', () => {
    const keys = markersFor('5').map(({ index }) => /\b(instagramHandle|siteUrl)\b/.exec(nextLine(index))?.[1]);
    expect(keys.sort()).toEqual(['instagramHandle', 'siteUrl']);
  });
});

describe('TODAY: none of the six open inputs is confirmed yet - flip each to true only once the founder has answered it (PRD 8)', () => {
  it('has settings.inputsConfirmed with exactly the six open inputs, every one still false', () => {
    expect(Object.keys(settings.inputsConfirmed).sort()).toEqual([
      'contentOwnership',
      'footerLine',
      'instagramHandle',
      'launchTiming',
      'siteUrl',
      'weeklyCommitment',
    ]);
    expect(settings.inputsConfirmed).toStrictEqual({
      weeklyCommitment: false,
      launchTiming: false,
      contentOwnership: false,
      footerLine: false,
      instagramHandle: false,
      siteUrl: false,
    });
  });
});
```

`tests/cta.test.ts`:

```ts
// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { settings } from '../src/content';
import { ctaHref, instagramDmHref, whatsappFallbackHref, whatsappHref } from '../src/lib/cta';

describe('instagramDmHref builds the Instagram DM link (PRD 5.4, design 4)', () => {
  it('builds https://ig.me/m/<handle>', () => {
    expect(instagramDmHref('riffi')).toBe('https://ig.me/m/riffi');
  });

  it.each(['riffi.app', 'riffi_in', '_riffi_', 'Riffi2026', 'r.i.f.f.i', 'r', 'a'.repeat(30)])(
    'accepts the valid handle %j',
    (handle) => {
      expect(instagramDmHref(handle)).toBe(`https://ig.me/m/${handle}`);
    },
  );

  it.each([
    ['@riffi', 'a leading @'],
    ['riffi page', 'a space'],
    ['riffi/x', 'a slash'],
    ['', 'nothing at all'],
    ['riffi?x=1', 'a query string'],
    ['riffi#top', 'a fragment'],
    [' riffi', 'a leading space'],
    ['riffi\nevil', 'a line break'],
    ['riffi%2F..', 'an encoded slash'],
    ['.', 'a lone dot'],
    ['..', 'two dots'],
    ['riffi.', 'a trailing dot'],
    ['.riffi', 'a leading dot'],
    ['rif..fi', 'a doubled dot'],
    ['a'.repeat(31), 'more than 30 characters'],
    ['रिफ़ी', 'non-Latin letters'],
  ])('refuses %j (%s) by throwing an Error', (handle) => {
    expect(() => instagramDmHref(handle)).toThrow(Error);
  });
});

describe('whatsappHref builds the optional WhatsApp link (PRD 5.4)', () => {
  it('builds https://wa.me/<number>?text=<the message encoded with encodeURIComponent>', () => {
    // Spaces become %20 (never +); & ? # + = / the line break, the em dash and ₹ are all escaped.
    expect(whatsappHref('919800000000', "Hi, I'm in & ready? #1+1=2/yes\n— ₹")).toBe(
      "https://wa.me/919800000000?text=Hi%2C%20I'm%20in%20%26%20ready%3F%20%231%2B1%3D2%2Fyes%0A%E2%80%94%20%E2%82%B9",
    );
  });

  it.each(['12345678', '123456789012345', '919800000000'])(
    'accepts the number %j (8 to 15 digits, no leading zero)',
    (number) => {
      expect(whatsappHref(number, 'hi')).toBe(`https://wa.me/${number}?text=hi`);
    },
  );

  it.each([
    ['+919800000000', 'a plus sign'],
    ['98 0000 0000', 'spaces'],
    ['', 'nothing at all'],
    ['0919800000000', 'a leading zero'],
    ['1234567', 'fewer than 8 digits'],
    ['1234567890123456', 'more than 15 digits'],
    ['91-98000-00000', 'dashes'],
    ['919800000000\n', 'a trailing line break'],
  ])('refuses %j (%s) by throwing an Error', (number) => {
    expect(() => whatsappHref(number, 'hi')).toThrow(Error);
  });
});

describe('the links the page uses', () => {
  it('points ctaHref at the DM for the handle in settings', () => {
    expect(ctaHref).toBe(instagramDmHref(settings.instagramHandle));
    expect(ctaHref).toBe(`https://ig.me/m/${settings.instagramHandle}`);
  });

  it('has no WhatsApp fallback link while the fallback is off (the default)', () => {
    expect(settings.whatsapp.enabled).toBe(false);
    expect(whatsappFallbackHref).toBeNull();
  });
});

describe('the WhatsApp fallback link once it is switched on', () => {
  afterEach(() => {
    vi.doUnmock('../src/content');
    vi.resetModules();
  });

  it('is built from the WhatsApp number and message in settings', async () => {
    vi.resetModules();
    vi.doMock('../src/content', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../src/content')>();
      return {
        ...actual,
        settings: { ...actual.settings, whatsapp: { enabled: true, number: '919800000000', message: "Hi, I'm in" } },
      };
    });
    const fresh = await import('../src/lib/cta');
    expect(fresh.whatsappFallbackHref).toBe("https://wa.me/919800000000?text=Hi%2C%20I'm%20in");
  });
});
```

`tests/presend.test.ts`:

```ts
// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const script = fileURLToPath(new URL('../scripts/presend.mjs', import.meta.url));

const SUCCESS = 'presend: no [FILL] placeholders left.';
const DIST_PROBLEM =
  'dist/index.html: the link-preview tags still use a placeholder site URL - rebuild after setting the real domain';
const header = (problems: number): string =>
  `presend: ${problems} problem(s) must be fixed before the link is sent:`;

// Stands in for a finished content file: no markers, a real-looking handle and domain.
const CLEAN_CONTENT = "export const settings = { instagramHandle: 'riffi_in', siteUrl: 'https://riffi.in' };\n";

const INPUT_KEYS = ['weeklyCommitment', 'launchTiming', 'contentOwnership', 'footerLine', 'instagramHandle', 'siteUrl'];
const inputProblem = (file: string, key: string): string => `${file}: open input "${key}" is not confirmed`;
const allConfirmed = (): Record<string, boolean> => Object.fromEntries(INPUT_KEYS.map((key) => [key, true]));

/**
 * A content file with no markers, laid out the way Prettier writes it, whose inputsConfirmed block holds the given
 * values. It also carries false values OUTSIDE the block (whatsapp.enabled, seats.show), which must never count.
 */
function settingsFile(confirmed: Record<string, boolean>): string {
  return (
    [
      'export const settings = {',
      "  instagramHandle: 'riffi_in',",
      '  whatsapp: { enabled: false, number: "", message: "" },',
      '  seats: { total: 50, taken: null, show: false },',
      '  inputsConfirmed: {',
      ...Object.entries(confirmed).map(([key, value]) => `    ${key}: ${String(value)},`),
      '  },',
      '};',
    ].join('\n') + '\n'
  );
}

const workspaces: string[] = [];

/** A throwaway working folder in the OS temp directory, holding the given files. */
function workspace(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), 'riffi-presend-'));
  workspaces.push(dir);
  for (const [name, text] of Object.entries(files)) {
    const file = join(dir, name);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text, 'utf8');
  }
  return dir;
}

afterAll(() => {
  for (const dir of workspaces) rmSync(dir, { recursive: true, force: true });
});

/** Runs presend the way the CLI does, from the given working folder. */
function presend(cwd: string, ...args: string[]) {
  const run = spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
  return {
    status: run.status,
    stdout: run.stdout,
    // Split on \n only, so an untrimmed \r from a CRLF file shows up as a mismatch.
    stderrLines: run.stderr.split('\n').filter((line) => line !== ''),
  };
}

describe('presend on a named file (PRD 8, design 5)', () => {
  it('exists at scripts/presend.mjs', () => {
    expect(existsSync(script)).toBe(true);
  });

  it('passes a file with no placeholder markers and says so', () => {
    const run = presend(workspace({ 'clean.ts': CLEAN_CONTENT }), 'clean.ts');
    expect(run.status).toBe(0);
    expect(run.stdout.trim()).toBe(SUCCESS);
  });

  it('fails a file with markers: a header with the count, then "<file>:<line>: <trimmed text>" for each', () => {
    const cwd = workspace({
      'markers.ts':
        [
          '// [FILL] 1 the weekly commitment',
          "export const a = 'x';",
          '',
          '    // [FILL — launch timing]   ',
          "export const b = 'y';",
          "const c = '[FILL]';",
        ].join('\n') + '\n',
    });
    const run = presend(cwd, 'markers.ts');
    expect(run.status).toBe(1);
    expect(run.stderrLines).toEqual([
      header(3),
      'markers.ts:1: // [FILL] 1 the weekly commitment',
      'markers.ts:4: // [FILL — launch timing]',
      "markers.ts:6: const c = '[FILL]';",
    ]);
    expect(run.stdout).not.toContain(SUCCESS);
  });

  it('does not count look-alikes such as "[FILLER]" or a bare "FILL"', () => {
    const run = presend(workspace({ 'lookalike.ts': "const a = '[FILLER]';\nconst b = 'FILL in later';\n" }), 'lookalike.ts');
    expect(run.status).toBe(0);
    expect(run.stdout.trim()).toBe(SUCCESS);
  });

  it('catches markers in any case and with inner spaces, such as "[fill]" and "[ FILL — footer ]"', () => {
    const cwd = workspace({ 'loose.ts': "const a = 1;\n// [fill] 4 footer line\n// [ FILL — footer ]\nconst b = '[Fill]';\n" });
    const run = presend(cwd, 'loose.ts');
    expect(run.status).toBe(1);
    expect(run.stderrLines).toEqual([
      header(3),
      'loose.ts:2: // [fill] 4 footer line',
      'loose.ts:3: // [ FILL — footer ]',
      "loose.ts:4: const b = '[Fill]';",
    ]);
  });

  it('reports clean line numbers and text for a file with Windows (CRLF) line endings', () => {
    const run = presend(workspace({ 'crlf.ts': 'const a = 1;\r\n  // [FILL] 4 footer line\r\nconst b = 2;\r\n' }), 'crlf.ts');
    expect(run.status).toBe(1);
    expect(run.stderrLines).toEqual([header(1), 'crlf.ts:2: // [FILL] 4 footer line']);
  });

  it('never passes a file it cannot read', () => {
    const run = presend(workspace({}), 'missing.ts');
    expect(run.status).not.toBe(0);
    expect(run.stdout).not.toContain(SUCCESS);
  });

  it('checks only the named file, so a local dist/ build can never change the result', () => {
    const cwd = workspace({
      'src/content.ts': CLEAN_CONTENT,
      'dist/index.html': '<meta property="og:image" content="__SITE_URL__/og.png" />\n',
    });
    const run = presend(cwd, 'src/content.ts');
    expect(run.status).toBe(0);
    expect(run.stdout.trim()).toBe(SUCCESS);
  });
});

describe('presend with no argument: src/content.ts, plus the built page head when dist/ exists', () => {
  it('passes when src/content.ts is clean and nothing has been built', () => {
    const run = presend(workspace({ 'src/content.ts': CLEAN_CONTENT }));
    expect(run.status).toBe(0);
    expect(run.stdout.trim()).toBe(SUCCESS);
  });

  it('checks src/content.ts in the working folder and reports it by that path', () => {
    const run = presend(workspace({ 'src/content.ts': 'const a = 1;\n// [FILL] 2 launch timing\n' }));
    expect(run.status).toBe(1);
    expect(run.stderrLines).toEqual([header(1), 'src/content.ts:2: // [FILL] 2 launch timing']);
  });

  it('fails while dist/index.html still holds the __SITE_URL__ token', () => {
    const run = presend(
      workspace({
        'src/content.ts': CLEAN_CONTENT,
        'dist/index.html': '<meta property="og:image" content="__SITE_URL__/og.png" />\n',
      }),
    );
    expect(run.status).toBe(1);
    expect(run.stderrLines).toEqual([header(1), DIST_PROBLEM]);
  });

  it('fails while dist/index.html still points at a placeholder .example domain', () => {
    const run = presend(
      workspace({
        'src/content.ts': CLEAN_CONTENT,
        'dist/index.html': '<meta property="og:image" content="https://riffi.example/og.png" />\n',
      }),
    );
    expect(run.status).toBe(1);
    expect(run.stderrLines).toEqual([header(1), DIST_PROBLEM]);
  });

  it('passes once dist/index.html uses a real domain', () => {
    const run = presend(
      workspace({
        'src/content.ts': CLEAN_CONTENT,
        'dist/index.html': '<meta property="og:image" content="https://riffi.in/og.png" />\n',
      }),
    );
    expect(run.status).toBe(0);
    expect(run.stdout.trim()).toBe(SUCCESS);
  });

  it('counts marker lines and the placeholder site URL together in one header', () => {
    const run = presend(
      workspace({
        'src/content.ts': "// [FILL] 5 handle\nconst handle = 'riffi_in';\n",
        'dist/index.html': '<meta property="og:image" content="__SITE_URL__/og.png" />\n',
      }),
    );
    expect(run.status).toBe(1);
    expect(run.stderrLines[0]).toBe(header(2));
    expect(run.stderrLines.slice(1).sort()).toEqual([DIST_PROBLEM, 'src/content.ts:1: // [FILL] 5 handle'].sort());
  });
});

describe('presend and settings.inputsConfirmed: deleting a marker is not an answer', () => {
  it('passes a file with no markers once all six inputs are confirmed', () => {
    const run = presend(workspace({ 'confirmed.ts': settingsFile(allConfirmed()) }), 'confirmed.ts');
    expect(run.status).toBe(0);
    expect(run.stdout.trim()).toBe(SUCCESS);
  });

  it('fails a file whose markers are gone while one input is still unconfirmed', () => {
    const run = presend(
      workspace({ 'confirm.ts': settingsFile({ ...allConfirmed(), launchTiming: false }) }),
      'confirm.ts',
    );
    expect(run.status).toBe(1);
    expect(run.stderrLines).toEqual([header(1), inputProblem('confirm.ts', 'launchTiming')]);
  });

  it('reports one problem per unconfirmed input, and ignores false values outside the block', () => {
    const noneConfirmed = Object.fromEntries(INPUT_KEYS.map((key) => [key, false]));
    const run = presend(workspace({ 'none.ts': settingsFile(noneConfirmed) }), 'none.ts');
    expect(run.status).toBe(1);
    expect(run.stderrLines[0]).toBe(header(6));
    expect(run.stderrLines.slice(1).sort()).toEqual(INPUT_KEYS.map((key) => inputProblem('none.ts', key)).sort());
  });

  it('reads an inputsConfirmed block written on a single line too', () => {
    const run = presend(
      workspace({ 'inline.ts': 'export const settings = { inputsConfirmed: { footerLine: false, siteUrl: true } };\n' }),
      'inline.ts',
    );
    expect(run.status).toBe(1);
    expect(run.stderrLines).toEqual([header(1), inputProblem('inline.ts', 'footerLine')]);
  });

  it('counts marker lines and unconfirmed inputs together in one header', () => {
    const file = '// [FILL] 2 launch timing\n' + settingsFile({ ...allConfirmed(), launchTiming: false, siteUrl: false });
    const run = presend(workspace({ 'both.ts': file }), 'both.ts');
    expect(run.status).toBe(1);
    expect(run.stderrLines[0]).toBe(header(3));
    expect(run.stderrLines.slice(1).sort()).toEqual(
      [
        'both.ts:1: // [FILL] 2 launch timing',
        inputProblem('both.ts', 'launchTiming'),
        inputProblem('both.ts', 'siteUrl'),
      ].sort(),
    );
  });

  it('checks the inputs in src/content.ts when run with no argument', () => {
    const run = presend(workspace({ 'src/content.ts': settingsFile({ ...allConfirmed(), siteUrl: false }) }));
    expect(run.status).toBe(1);
    expect(run.stderrLines).toEqual([header(1), inputProblem('src/content.ts', 'siteUrl')]);
  });
});

describe('TODAY: presend on the real src/content.ts - update deliberately, one input at a time, as the founder answers each (PRD 8 and 10)', () => {
  it('fails with 12 problems: six [FILL] marker lines (inputs 1 to 5, input 5 twice) and six unconfirmed inputs', () => {
    const run = presend(projectRoot, 'src/content.ts');
    const source = readFileSync(join(projectRoot, 'src', 'content.ts'), 'utf8').split(/\r?\n/);
    const markerLines = source.flatMap((text, index) =>
      /\[\s*FILL\b/i.test(text) ? [`src/content.ts:${index + 1}: ${text.trim()}`] : [],
    );
    expect(markerLines.map((line) => /\[FILL\]\s+(\d+)/.exec(line)?.[1]).sort()).toEqual(['1', '2', '3', '4', '5', '5']);
    expect(run.status).toBe(1);
    expect(run.stderrLines[0]).toBe(header(12));
    expect(run.stderrLines.slice(1).sort()).toEqual(
      [...markerLines, ...INPUT_KEYS.map((key) => inputProblem('src/content.ts', key))].sort(),
    );
    // Marker lines come in file order, whichever kind of problem is reported first.
    expect(run.stderrLines.filter((line) => /^src\/content\.ts:\d+: /.test(line))).toEqual(markerLines);
  });
});
```

- [ ] **Step 4: Run the tests to confirm they fail**

Run: `npm test`
Expected: FAIL - `tests/content.test.ts` and `tests/cta.test.ts` cannot resolve `../src/content` / `../src/lib/cta`, and `tests/presend.test.ts` cannot find `scripts/presend.mjs`.

- [ ] **Step 5: Write `src/content.ts`**

```ts
/**
 * Every user-facing string and every page setting lives in this file (PRD 5.2, rule 2).
 *
 * Placeholders the founder must answer before the link goes to any creator carry a FILL tag in
 * square brackets on the comment line above them. `npm run presend` fails while any remain.
 * Never replace a placeholder with an invented figure.
 */

export type Settings = {
  instagramHandle: string;
  siteUrl: string;
  whatsapp: { enabled: boolean; number: string; message: string };
  seats: { total: number; taken: number | null; show: boolean };
  comparisonSplit: { instagram: number; riffi: number };
  inputsConfirmed: Record<
    | 'weeklyCommitment'
    | 'launchTiming'
    | 'contentOwnership'
    | 'footerLine'
    | 'instagramHandle'
    | 'siteUrl',
    boolean
  >;
};

export const settings: Settings = {
  // [FILL] 5 - Riffi's real Instagram handle, without the @. Confirm Riffi owns this exact account.
  instagramHandle: 'riffi',
  // [FILL] 5 - the deploy domain, with https:// and no trailing slash. The preview card uses it.
  siteUrl: 'https://riffi-creators.example',
  whatsapp: {
    enabled: false,
    // Digits only, with the country code and no plus sign. Needed only when `enabled` is true.
    number: '',
    message: "I'm in",
  },
  seats: {
    total: 50,
    // A real, hand-counted number. Leave null to show no number at all.
    taken: null,
    // Turn on only when `taken` is real and kept up to date by hand.
    show: false,
  },
  // Rhetoric, not data: every comparison row uses the same dramatic split (PRD Block 3).
  comparisonSplit: { instagram: 12, riffi: 88 },
  // Flip each to true only once the founder has answered that open input (PRD section 8).
  // `npm run presend` fails while any is false - deleting a placeholder comment is not an answer.
  inputsConfirmed: {
    weeklyCommitment: false,
    launchTiming: false,
    contentOwnership: false,
    footerLine: false,
    instagramHandle: false,
    siteUrl: false,
  },
};

export const content = {
  nav: {
    wordmark: 'Riffi',
    batch: 'Batch 01',
  },
  cta: {
    label: 'Claim a seat',
    helper: `Opens a DM with @${settings.instagramHandle}`,
    whatsappLabel: 'Or message us on WhatsApp',
  },
  hero: {
    titleLines: ["On Instagram you're one of lakhs.", "Here you're one of 50."],
    subline:
      "Riffi is India's platform for opinions. We're taking 50 creators in before launch and pointing the feed at them.",
    sampleTake: {
      chip: 'sample take',
      text: 'Being early beats being good.',
      agree: { label: 'agree', percent: 71 },
      disagree: { label: 'disagree', percent: 29 },
      votes: 2140,
      votesLabel: 'votes',
    },
  },
  whatRiffiIs: {
    heading: "Twitter took news. We're taking opinions.",
    lead: 'Riffi is built for one thing: what you think. Not what happened, not who said it. Your take, and whether the room agrees.',
    notTake: {
      chip: 'not a take',
      text: 'India won by 6 wickets in Chennai.',
      caption: "That's news. It's already everywhere.",
    },
    take: {
      chip: 'a take',
      text: "Chasing in Chennai got easier and everyone's pretending it didn't.",
      caption: "That's yours. Nobody else posted it.",
    },
    categories: [
      'Cricket',
      'Politics',
      'Movies',
      'Food',
      'Campus',
      'Money',
      'Music',
      'Startups',
      'Sports',
      'Fashion',
    ],
    marqueeLabel: 'Sample takes',
    marqueeChip: 'sample take',
    marqueeTakes: [
      'Test cricket is the only format that still tells the truth.',
      "Bengaluru traffic isn't an infrastructure problem, it's a scheduling one.",
      'Every biopic in the last five years is an ad for its subject.',
      "Filter coffee beats any third-wave pour over and it isn't close.",
      'Hostel mess food built more resilience than any gym ever will.',
      'Reels killed the Indian meme page.',
      'Paneer is overrated and we all know it.',
      "The best captain of this generation isn't the one you're thinking of.",
    ],
  },
  whyHere: {
    heading: "You're not early on Instagram. You're early here.",
    instagramLabel: 'Instagram',
    riffiLabel: 'Riffi',
    rows: [
      { label: "Creators you're up against", instagram: 'Lakhs', riffi: '49' },
      {
        label: 'Who decides your reach',
        instagram: 'A feed tuned for watch time',
        riffi: "A feed we're still writing",
      },
      { label: 'What your first post gets', instagram: 'Buried', riffi: 'The front page' },
      {
        label: 'What you own at the end',
        instagram: 'Followers on rented land',
        riffi: 'A position on a platform still being built',
      },
    ],
    closer: 'And a reel costs you four hours. A take costs you forty seconds.',
  },
  howYouEarn: {
    heading: 'You earn from post one.',
    pill: 'points',
    rows: [
      { action: 'Post a take', description: 'The opinion itself. Every one counts.' },
      {
        action: 'Write the long version',
        description: 'When a take needs more than a line, write it out.',
      },
      {
        action: 'Add images',
        description: 'Screenshots, stills, memes, whatever makes the point land.',
      },
      { action: 'Drop a story', description: 'Short-lived posts, same as you already do.' },
      {
        action: 'Get the room talking',
        description: 'Votes, replies and reshares on your take earn on top.',
      },
    ],
    note: "Points convert to vouchers. Exact values go live with the app — we're still tuning them, and we'd rather publish them once than change them on you.",
  },
  longGame: {
    heading: 'Points now. Priority later.',
    items: [
      {
        title: 'Performance payouts',
        body: "When we switch on view-based payouts, this cohort is in the first batch. To give you the shape of it: a post crossing a lakh views lands somewhere in the ₹5,000–10,000 band. That's an illustration, not a rate card — we'll publish real slabs before it goes live.",
      },
      {
        title: 'Brand deals',
        body: "Brands reach a platform through its top creators. On a platform with 50 creators, that's a much shorter list than the one you're on now.",
      },
      {
        title: 'Whatever comes after',
        body: "Subscriptions, tipping, whatever we build — this cohort gets it before anyone else. That's the deal for being here first.",
      },
    ],
    framing:
      "All of this is our plan, not a contract. We'd rather you come in knowing exactly that.",
  },
  seats: {
    heading: "50 seats. Here's what we ask.",
    // [FILL] 1 - the actual weekly commitment asked of creators.
    body: "Post three takes a week through the pre-launch period. That's the whole ask. No calls, no contracts, no exclusivity — keep posting wherever else you post.",
    meterLabel: '50 seats in batch one',
    takenLabel: (taken: number, total: number) => `${taken} of ${total} seats taken`,
  },
  faq: {
    heading: 'Before you ask',
    items: [
      {
        question: 'Do I have to leave Instagram?',
        answer:
          'No. Keep posting exactly where you post now. A take is a sentence, not a shoot — this sits alongside what you already do.',
      },
      {
        question: 'My following is small. Does that matter?',
        answer:
          "No. We're picking for takes, not reach. Most of this cohort is under 20k and that's deliberate.",
      },
      {
        question: 'Is this paid right now?',
        answer:
          "You earn points from your first post and points convert to vouchers. Cash payouts arrive with monetisation, and this cohort is first in line for it. That's the plan, not a contract.",
      },
      {
        question: 'What can I post about?',
        answer:
          'Anything you have a real opinion on. Cricket, politics, films, food, campus, money. Opinions, not news reports.',
      },
      {
        question: 'When does Riffi launch?',
        // [FILL] 2 - launch timing. It must agree with the weekly commitment in the seats block.
        answer: "We're in build. This cohort gets in before public launch.",
      },
      {
        question: 'Who owns what I post?',
        // [FILL] 3 - content ownership, confirmed against the real terms, or remove this question.
        answer: 'You do. You keep the rights to your posts and you can take them anywhere.',
      },
    ],
  },
  close: {
    heading: '50 seats. Batch one.',
    body: "If you've got opinions and you're tired of shouting them into a feed that doesn't know you, take one.",
    // [FILL] 4 - the footer legal / contact line. Leave empty to show the wordmark only.
    footerLine: '',
  },
};
```

- [ ] **Step 6: Write `src/lib/cta.ts`**

```ts
import { settings } from '../content';

// Instagram's rules: 1-30 letters, numbers, dots and underscores, with no leading, trailing or doubled
// dot. Without them a handle of ".." would turn https://ig.me/m/.. into https://ig.me/.
const INSTAGRAM_HANDLE = /^(?!\.)(?!.*\.\.)(?!.*\.$)[A-Za-z0-9._]{1,30}$/;
const WHATSAPP_NUMBER = /^[1-9]\d{7,14}$/;

/** The Instagram DM deep link. From inside Instagram's in-app browser it opens the thread (PRD 5.4). */
export function instagramDmHref(handle: string): string {
  if (!INSTAGRAM_HANDLE.test(handle)) {
    throw new Error(
      `Invalid Instagram handle "${handle}": use 1-30 letters, numbers, dots and underscores, without the @ and with no leading, trailing or doubled dot.`,
    );
  }
  return `https://ig.me/m/${handle}`;
}

/** The optional WhatsApp fallback, with the reply already typed. */
export function whatsappHref(number: string, message: string): string {
  if (!WHATSAPP_NUMBER.test(number)) {
    throw new Error(
      `Invalid WhatsApp number "${number}": digits only, with the country code and no plus sign.`,
    );
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Where both "Claim a seat" buttons go. A bad handle fails the build instead of shipping. */
export const ctaHref = instagramDmHref(settings.instagramHandle);

export const whatsappFallbackHref: string | null = settings.whatsapp.enabled
  ? whatsappHref(settings.whatsapp.number, settings.whatsapp.message)
  : null;
```

- [ ] **Step 7: Write `scripts/presend.mjs`**

```js
// Pre-send check: fails while any placeholder remains, so the page is never sent to a creator with a
// placeholder promise on it. Usage: node scripts/presend.mjs [file]
// With no file argument it checks src/content.ts, and also the built dist/index.html if one exists.
import { existsSync, readFileSync } from 'node:fs';

// Matches "[FILL]", the PRD's own spelling such as "[FILL — launch timing]", and any letter case.
const MARKER = /\[\s*FILL\b/i;
const PLACEHOLDER_URL = /__SITE_URL__|\.example\b/;
const explicitFile = process.argv[2];
const file = explicitFile ?? 'src/content.ts';

const source = readFileSync(file, 'utf8');
const problems = source
  .split(/\r?\n/)
  .map((text, index) => ({ line: index + 1, text: text.trim() }))
  .filter(({ text }) => MARKER.test(text))
  .map(({ line, text }) => `${file}:${line}: ${text}`);

// Every open input must also be confirmed by hand: a deleted comment is not an answer.
const confirmations = source.match(/inputsConfirmed\s*:\s*\{([^}]*)\}/);
if (confirmations) {
  for (const [, key] of confirmations[1].matchAll(/(\w+)\s*:\s*false\b/g)) {
    problems.push(`${file}: open input "${key}" is not confirmed`);
  }
}

const built = 'dist/index.html';
if (!explicitFile && existsSync(built) && PLACEHOLDER_URL.test(readFileSync(built, 'utf8'))) {
  problems.push(
    `${built}: the link-preview tags still use a placeholder site URL - rebuild after setting the real domain`,
  );
}

if (problems.length > 0) {
  console.error(`presend: ${problems.length} problem(s) must be fixed before the link is sent:`);
  for (const problem of problems) console.error(problem);
  process.exit(1);
}

console.log('presend: no [FILL] placeholders left.');
```

- [ ] **Step 8: Run the checks**

Run: `npm test`
Expected: PASS - `Test Files  3 passed (3)`.

Run: `npm run presend; echo "exit $?"`
Expected: `presend: 12 problem(s) must be fixed before the link is sent:` followed by six `src/content.ts:<line>: // [FILL] ...` lines (inputs 5, 5, 1, 2, 3, 4) and six `src/content.ts: open input "<name>" is not confirmed` lines, then `exit 1`. No `dist/` exists yet, so the built-page check does not run.

Run: `npm run typecheck && npm run lint && echo "checks ok"`
Expected: `checks ok`.

- [ ] **Step 9: Commit**

```bash
git add .gitattributes .prettierrc.json .prettierignore .npmrc package.json package-lock.json tsconfig.json vite.config.ts vitest.config.ts eslint.config.js tests/setup.ts tests/honesty-rules.ts tests/content.test.ts tests/cta.test.ts tests/presend.test.ts src/content.ts src/lib/cta.ts scripts/presend.mjs
git commit -m "feat: toolchain, page content and the call-to-action link" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Page shell and the pre-render step

User job: on a slow 4G phone inside Instagram, the creator sees the page the moment the HTML arrives, and the link-preview card in the DM points at the real page.

**Files:**
- Create: `index.html`, `src/App.tsx`, `src/entry-server.tsx`, `src/main.tsx`, `scripts/prerender.mjs`
- Modify: `.gitignore`
- Test: `tests/head.test.ts` (independent test author - copy verbatim), `tests/prerender.test.ts`

**Interfaces:**
- Consumes: `settings` from `src/content.ts`.
- Produces: `render(): string` and `siteUrl: string` from `src/entry-server.tsx`; the default export `App` from `src/App.tsx` (Task 7 fills it); the class `js` on `<html>` before first paint and the class `app-ready` once the page has hydrated within its first 6 seconds; `npm run build` writes the pre-rendered `dist/index.html`.

- [ ] **Step 1: Write the failing tests**

Written by the independent test author from the PRD and the approved design - copy verbatim.

Changed during the build (15 Sep 2026, founder-approved: "Yes, fix that line"): the test author changed lines 3 and 7 so the file reads `index.html` from the project root. Vite 6 rewrites `new URL('../index.html', import.meta.url)` in jsdom test files, so the original line could not load. Every check is unchanged.

`tests/head.test.ts`:

```ts
// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Parsed with the DOM's own HTML parser, so an entity-encoded apostrophe still compares equal.
const raw = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const doc = new DOMParser().parseFromString(raw, 'text/html');
const all = (selector: string): Element[] => Array.from(doc.querySelectorAll(selector));

/** The content attribute of the one and only element matching the selector. */
function onlyContent(selector: string): string | null {
  const found = all(selector);
  expect(found, selector).toHaveLength(1);
  return found[0]?.getAttribute('content') ?? null;
}

describe('index.html: document basics', () => {
  it('starts with <!doctype html> and declares lang="en"', () => {
    // \s also matches a leading byte-order mark, so a BOM-prefixed file still passes.
    expect(raw).toMatch(/^\s*<!doctype html>/i);
    expect(doc.documentElement.getAttribute('lang')).toBe('en');
  });

  it('declares UTF-8 once, within the first 1024 bytes', () => {
    const charsets = all('meta[charset]');
    expect(charsets).toHaveLength(1);
    expect(charsets[0]?.getAttribute('charset')?.toLowerCase()).toBe('utf-8');
    const position = raw.search(/<meta\s+charset/i);
    expect(position).toBeGreaterThanOrEqual(0);
    expect(Buffer.byteLength(raw.slice(0, position), 'utf8')).toBeLessThan(1024);
  });

  it('sets the viewport for phones, including notched screens', () => {
    expect(onlyContent('meta[name="viewport"]')).toBe('width=device-width, initial-scale=1, viewport-fit=cover');
  });
});

describe('index.html: title, description and the link-preview card, exactly as PRD 5.6', () => {
  it('has the title "Riffi Creator Program — 50 seats"', () => {
    expect(all('title')).toHaveLength(1);
    expect(doc.title).toBe('Riffi Creator Program — 50 seats');
  });

  it.each([
    ['meta[name="description"]', "Riffi is India's platform for opinions. We're taking 50 creators in before launch."],
    ['meta[property="og:title"]', "On Instagram you're one of lakhs. Here you're one of 50."],
    ['meta[property="og:description"]', 'The Riffi Creator Program. 50 seats, batch one.'],
    ['meta[property="og:type"]', 'website'],
    ['meta[property="og:image"]', '__SITE_URL__/og.png'],
    ['meta[name="twitter:card"]', 'summary_large_image'],
    ['meta[name="theme-color"]', '#FFFFFF'],
  ])('has exactly one %s with the right content', (selector, expected) => {
    expect(onlyContent(selector)).toBe(expected);
  });

  it('links the SVG favicon and the apple touch icon', () => {
    const icons = all('link[rel="icon"]');
    expect(icons).toHaveLength(1);
    expect(icons[0]?.getAttribute('href')).toBe('/favicon.svg');
    expect(icons[0]?.getAttribute('type')).toBe('image/svg+xml');
    const touchIcons = all('link[rel="apple-touch-icon"]');
    expect(touchIcons).toHaveLength(1);
    expect(touchIcons[0]?.getAttribute('href')).toBe('/apple-touch-icon.png');
  });

  it('never spells the name "Rifii"', () => {
    expect(raw).not.toMatch(/rifii/i);
  });
});

describe('index.html: scripts, the pre-render slot, and what must never be here', () => {
  it('keeps the pre-render slot <div id="root"><!--app-html--></div>', () => {
    expect(raw).toContain('<div id="root"><!--app-html--></div>');
    expect(doc.getElementById('root')?.innerHTML).toBe('<!--app-html-->');
  });

  it('loads the app with exactly one module script, /src/main.tsx', () => {
    const modules = all('script[type="module"]');
    expect(modules).toHaveLength(1);
    expect(modules[0]?.getAttribute('src')).toBe('/src/main.tsx');
  });

  it('has exactly two scripts: that module and one inline, non-module script', () => {
    const scripts = all('script');
    expect(scripts).toHaveLength(2);
    const inline = scripts.filter((script) => !script.hasAttribute('src'));
    expect(inline).toHaveLength(1);
    expect(['', 'text/javascript']).toContain(inline[0]?.getAttribute('type') ?? '');
  });

  it('runs the inline script before the page content, and the script adds the class "js" to <html>', () => {
    const inline = all('script').find((script) => !script.hasAttribute('src'));
    const root = doc.getElementById('root');
    expect(inline).toBeDefined();
    expect(root).not.toBeNull();
    if (!inline || !root) return;
    expect(inline.compareDocumentPosition(root) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    document.documentElement.className = '';
    // Runs the script's own text against this test's document, as the browser would before first paint.
    new Function(inline.textContent ?? '')();
    expect(document.documentElement.classList.contains('js')).toBe(true);
  });

  it('loads nothing from another origin: no external script, stylesheet, font, preload or preconnect', () => {
    const external = /^\s*(?:https?:)?\/\//i;
    const fetching = /\b(?:stylesheet|preload|modulepreload|preconnect|dns-prefetch|prefetch|icon|apple-touch-icon|manifest)\b/i;
    const urls = [
      ...all('script[src]').map((element) => element.getAttribute('src') ?? ''),
      ...all('link[href]')
        .filter((element) => fetching.test(element.getAttribute('rel') ?? ''))
        .map((element) => element.getAttribute('href') ?? ''),
    ];
    expect(urls.filter((url) => external.test(url))).toEqual([]);
    expect(raw).not.toMatch(/@import\s+(?:url\()?\s*['"]?\s*(?:https?:)?\/\//i);
  });

  it('stays indexable: no noindex anywhere', () => {
    expect(raw).not.toMatch(/noindex/i);
  });

  it('has no <form> and no third-party embed', () => {
    expect(all('form, iframe, embed, object')).toEqual([]);
  });
});
```

`tests/prerender.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { render, siteUrl } from '../src/entry-server';

describe('the pre-rendered page (design option A)', () => {
  it('renders the page landmarks to HTML without a browser', () => {
    const html = render();
    expect(html).toContain('<header');
    expect(html).toContain('<main id="main"');
    expect(html).toContain('<footer');
  });

  it('exposes the site URL the link-preview card needs, as a bare https domain', () => {
    expect(siteUrl).toMatch(/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i);
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

Run: `npm test -- tests/head.test.ts tests/prerender.test.ts`
Expected: FAIL - `index.html` is missing (ENOENT) and `../src/entry-server` cannot be resolved.

- [ ] **Step 3: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Riffi Creator Program — 50 seats</title>
    <meta
      name="description"
      content="Riffi is India's platform for opinions. We're taking 50 creators in before launch."
    />
    <meta property="og:title" content="On Instagram you're one of lakhs. Here you're one of 50." />
    <meta property="og:description" content="The Riffi Creator Program. 50 seats, batch one." />
    <meta property="og:image" content="__SITE_URL__/og.png" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#FFFFFF" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <script>
      document.documentElement.classList.add('js');
    </script>
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Write the app shell, the server entry and the browser entry**

`src/App.tsx` (landmarks only; Task 7 fills them):

```tsx
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Hydration is done, so scroll reveals may wait for the reader. After 6 seconds the CSS failsafe
    // has already filled the bars, so leave it in charge rather than empty them again.
    if (performance.now() < 6000) document.documentElement.classList.add('app-ready');
  }, []);

  return (
    <>
      <header />
      <main id="main" />
      <footer />
    </>
  );
}
```

`src/entry-server.tsx`:

```tsx
import { renderToString } from 'react-dom/server';
import App from './App';
import { settings } from './content';

/** The site URL the pre-render step writes into the link-preview tags. */
export const siteUrl = settings.siteUrl;

/** Renders the whole page to static HTML (design option A). */
export function render(): string {
  return renderToString(<App />);
}
```

`src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');

if (root) {
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );
  // The built page arrives pre-rendered, so hydrate it; the dev server serves an empty shell, so render.
  if (root.firstElementChild) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
```

- [ ] **Step 5: Write `scripts/prerender.mjs` and ignore the server build**

`scripts/prerender.mjs`:

```js
// Post-build step (design option A): writes the rendered page into dist/index.html so every word,
// both buttons and the FAQ exist before any script runs, fills in the site URL for the preview
// card, and preloads the two Latin font files.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const entry = pathToFileURL(path.join(root, 'dist-server', 'entry-server.js')).href;
const { render, siteUrl } = await import(entry);

// A bare https domain - letters, digits, dots and hyphens only - so nothing but a domain reaches the head tags.
if (!/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(siteUrl)) {
  throw new Error(`prerender: siteUrl must be https://domain with no path or trailing slash, got "${siteUrl}"`);
}

const templatePath = path.join(dist, 'index.html');
const template = await readFile(templatePath, 'utf8');
if (!template.includes('<!--app-html-->')) {
  throw new Error('prerender: the <!--app-html--> placeholder is missing from dist/index.html');
}

const fontFile = /^(archivo-latin-wdth-normal|hanken-grotesk-latin-wght-normal)-[\w-]+\.woff2$/;
const fonts = (await readdir(path.join(dist, 'assets'))).filter((file) => fontFile.test(file));
const preloads = fonts
  .map((file) => `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin>`)
  .join('\n    ');

const html = template
  .replace('<!--app-html-->', () => render()) // a function, so "$&" in any copy stays literal
  .replaceAll('__SITE_URL__', siteUrl)
  .replace('</title>', preloads ? `</title>\n    ${preloads}` : '</title>');

await writeFile(templatePath, html);
console.log(`prerender: wrote dist/index.html with ${fonts.length} font preload(s)`);
```

In `.gitignore`, replace:

```
dist/
coverage/
```

with:

```
dist/
dist-server/
coverage/
```

- [ ] **Step 6: Run the tests to confirm they pass**

Run: `npm test`
Expected: PASS - `Test Files  5 passed (5)`.

- [ ] **Step 7: Build and inspect the pre-rendered page**

Run: `npm run build`
Expected: the output ends with `prerender: wrote dist/index.html with 0 font preload(s)` (the fonts arrive in Task 3).

Run: `grep -c "__SITE_URL__" dist/index.html; grep -o 'property="og:image" content="[^"]*"' dist/index.html; grep -o '<main id="main"></main>' dist/index.html`
Expected:

```
0
property="og:image" content="https://riffi-creators.example/og.png"
<main id="main"></main>
```

- [ ] **Step 8: Run typecheck and lint**

Run: `npm run typecheck && npm run lint && echo "checks ok"`
Expected: `checks ok`.

- [ ] **Step 9: Commit**

```bash
git add index.html src/App.tsx src/entry-server.tsx src/main.tsx scripts/prerender.mjs .gitignore tests/head.test.ts tests/prerender.test.ts
git commit -m "feat: page shell and the pre-render step" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Brand layer - tokens, fonts and the type scale

User job: the page looks like Riffi on the creator's own phone - legible, fast, and ready for the brand kit to be swapped in with one file.

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Modify: `src/main.tsx`, `scripts/prerender.mjs`
- Test: `tests/brand-rules.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties `--paper`, `--recess`, `--ink`, `--ink-soft`, `--signal`, `--take`, `--chip-blue-bg`, `--chip-blue-ink`, `--chip-butter-bg`, `--chip-butter-ink`, `--chip-coral-bg`, `--chip-coral-ink`, `--hairline`, `--on-ink-body`, `--on-ink-meta`, `--typeface-display`, `--typeface-body`, `--corner-take`, `--corner-pill`, `--lift-take`. Tailwind utilities: colours `bg-*`/`text-*`/`border-*` for `paper`, `recess`, `ink`, `ink-soft`, `signal`, `take`, `chip-blue-bg`, `chip-blue-ink`, `chip-butter-bg`, `chip-butter-ink`, `chip-coral-bg`, `chip-coral-ink`, `hairline`, `on-ink-body`, `on-ink-meta`; fonts `font-display`, `font-body`; sizes `text-display-xl`, `text-display-l`, `text-display-m`, `text-body-l`, `text-body`, `text-meta`; `rounded-take`, `rounded-pill`, `shadow-take`. Tailwind's default colour palette and font families do not exist.

- [ ] **Step 1: Write the failing test**

`tests/brand-rules.test.ts`:

```ts
// @vitest-environment node
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const TOKENS = path.join(SRC, 'styles', 'tokens.css');

/** Every .ts, .tsx and .css file under src/ except the tokens file itself. */
function guardedFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: 'utf8' })
    .map((entry) => path.join(SRC, entry))
    .filter((file) => /\.(ts|tsx|css)$/.test(file) && path.resolve(file) !== path.resolve(TOKENS));
}

const CONTENT = path.join(SRC, 'content.ts');

/** [what is kept out, the pattern, whether content.ts is exempt because real copy may say it] */
const RULES: ReadonlyArray<readonly [string, RegExp, boolean]> = [
  ['hex colours', /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/, true],
  [
    'colour functions',
    /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color-mix|color|light-dark)\(/,
    false,
  ],
  [
    'named colours in colour properties',
    /\b(?:color|backgroundColor|background(?:-color)?|borderColor|border(?:-[a-z]+)?-color|fill|stroke|outlineColor|outline-color)\s*:\s*['"]?(?!var\(|transparent|currentColor|inherit|initial|unset|none)[a-z]/i,
    false,
  ],
  [
    'font names',
    /\b(?:archivo|hanken|arial|roboto|helvetica|georgia|times|inter|poppins|system-ui|sans-serif|serif|monospace)\b/i,
    true,
  ],
  // The lookahead sits right after the colon and allows the space inside it: with `\s*` before the
  // lookahead, backtracking lets `font-family: var(...)` slip past the "not var(" check and match.
  ['font-family declarations that are not a token', /font-family\s*:(?!\s*var\()/i, false],
  ['Tailwind arbitrary font classes', /\bfont-\[/, false],
  [
    'Tailwind arbitrary colour classes',
    /\b(?:bg|text|border|fill|stroke|ring|outline|decoration|accent|caret|shadow|from|via|to)-\[(?:#|rgb|hsl|oklch|color:|var\()/,
    false,
  ],
];

const BRAND_COLOURS = [
  '--paper',
  '--recess',
  '--ink',
  '--ink-soft',
  '--signal',
  '--take',
  '--chip-blue-bg',
  '--chip-blue-ink',
  '--chip-butter-bg',
  '--chip-butter-ink',
  '--chip-coral-bg',
  '--chip-coral-ink',
  '--hairline',
];

describe('brand rules (PRD 5.2, rule 1)', () => {
  it('scans the source files it guards', () => {
    expect(guardedFiles().length).toBeGreaterThan(0);
  });

  for (const [name, pattern, contentExempt] of RULES) {
    it(`keeps ${name} out of every source file except tokens.css`, () => {
      const offenders = guardedFiles()
        .filter((file) => !(contentExempt && path.resolve(file) === path.resolve(CONTENT)))
        .filter((file) => pattern.test(readFileSync(file, 'utf8')));
      expect(offenders.map((file) => path.relative(SRC, file))).toEqual([]);
    });
  }

  it('allows only the PRD theme-color hex in index.html, and no font names there', () => {
    const html = readFileSync(fileURLToPath(new URL('../index.html', import.meta.url)), 'utf8');
    const hexes = html.match(/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g) ?? [];
    expect(hexes).toEqual(['#FFFFFF']);
    expect(html).toContain('<meta name="theme-color" content="#FFFFFF" />');
    expect(html).not.toMatch(RULES[3][1]);
  });

  it('defines every PRD brand colour in tokens.css', () => {
    const tokens = readFileSync(TOKENS, 'utf8');
    for (const token of BRAND_COLOURS) {
      expect(tokens).toMatch(new RegExp(`${token}:\\s*#[0-9a-fA-F]{6};`));
    }
  });

  it('self-hosts both variable fonts from Fontsource, Latin subset only', () => {
    const tokens = readFileSync(TOKENS, 'utf8');
    expect(tokens).toContain(
      "url('@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')",
    );
    expect(tokens).toContain(
      "url('@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2')",
    );
    expect(tokens).not.toMatch(/fonts\.googleapis|fonts\.gstatic/);
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `npm test -- tests/brand-rules.test.ts`
Expected: FAIL - `ENOENT: no such file or directory` for `src/styles/tokens.css`.

- [ ] **Step 3: Write `src/styles/tokens.css`**

```css
/*
 * Every brand decision lives in this file (PRD 5.2, rule 1): colours, typefaces, radii and the one
 * shadow. The brand-kit swap is an edit here plus one wordmark SVG. No hex value, colour function
 * or font name may appear anywhere else under src/ - tests/brand-rules.test.ts enforces it. The one
 * named exception outside src/ is the theme-color meta tag in index.html, which PRD 5.6 specifies.
 */

/* Self-hosted variable fonts, Latin subset only (PRD 7). Declarations as shipped by Fontsource 5.3.0. */
@font-face {
  font-family: 'Archivo Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  font-stretch: 62% 125%;
  src: url('@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')
    format('woff2-variations');
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
    U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Hanken Grotesk Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url('@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2')
    format('woff2-variations');
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
    U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/*
 * Size-matched stand-ins shown while the fonts load, so the swap barely moves the page (CLS < 0.02).
 * Metrics from @capsizecss/metrics against Arial; against Roboto (Android) they differ by under 0.3%.
 */
@font-face {
  font-family: 'Archivo Fallback';
  src: local('Arial'), local('Roboto');
  size-adjust: 98.7%;
  ascent-override: 88.96%;
  descent-override: 21.28%;
  line-gap-override: 0%;
}

@font-face {
  font-family: 'Hanken Grotesk Fallback';
  src: local('Arial'), local('Roboto');
  size-adjust: 100.94%;
  ascent-override: 99.07%;
  descent-override: 30.02%;
  line-gap-override: 0%;
}

:root {
  /* Surfaces and text (PRD 3.2) */
  --paper: #ffffff;
  --recess: #f4f5f7;
  --ink: #000000;
  --ink-soft: #5b6472;
  --signal: #3b6ef3;
  --take: #6c4cf1;

  /* Chip family */
  --chip-blue-bg: #e4ecff;
  --chip-blue-ink: #1b4bd1;
  --chip-butter-bg: #fff0c7;
  --chip-butter-ink: #8a5a00;
  --chip-coral-bg: #ffe3dc;
  /* The PRD's #C0392B measures 4.47:1 on --chip-coral-bg; darkened 2% to 4.62:1 to pass WCAG AA. */
  --chip-coral-ink: #bc382a;
  --hairline: #e6e8ec;

  /* Text on the inverted close section: white at 70% and 60% over --ink (PRD Block 8). */
  --on-ink-body: #b3b3b3;
  --on-ink-meta: #999999;

  /* Typefaces (PRD 3.3) */
  --typeface-display: 'Archivo Variable', 'Archivo Fallback', sans-serif;
  --typeface-body: 'Hanken Grotesk Variable', 'Hanken Grotesk Fallback', sans-serif;

  /* Radii differ by object type on purpose (PRD 3.4) */
  --corner-take: 20px;
  --corner-pill: 999px;

  /* The one shadow token, used only on the hero take card (PRD 3.2) */
  --lift-take: 0 24px 48px -20px rgb(0 0 0 / 0.28);
}
```

- [ ] **Step 4: Write `src/styles/global.css`**

```css
@import 'tailwindcss' source('../');
@import './tokens.css';

/* Only the brand's own colours and typefaces exist as utilities, so there is no stray palette. */
@theme {
  --color-*: initial;
  --font-*: initial;
}

@theme inline {
  --color-paper: var(--paper);
  --color-recess: var(--recess);
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-signal: var(--signal);
  --color-take: var(--take);
  --color-chip-blue-bg: var(--chip-blue-bg);
  --color-chip-blue-ink: var(--chip-blue-ink);
  --color-chip-butter-bg: var(--chip-butter-bg);
  --color-chip-butter-ink: var(--chip-butter-ink);
  --color-chip-coral-bg: var(--chip-coral-bg);
  --color-chip-coral-ink: var(--chip-coral-ink);
  --color-hairline: var(--hairline);
  --color-on-ink-body: var(--on-ink-body);
  --color-on-ink-meta: var(--on-ink-meta);

  --default-font-family: var(--typeface-body);
  --font-display: var(--typeface-display);
  --font-body: var(--typeface-body);

  --radius-take: var(--corner-take);
  --radius-pill: var(--corner-pill);
  --shadow-take: var(--lift-take);
}

/* Type scale from 360px to 1280px through clamp(), so in-between widths look intentional (PRD 3.3). */
@theme {
  --text-display-xl: clamp(2.5rem, 1.62rem + 3.913vw, 4.75rem);
  --text-display-xl--line-height: 1;
  --text-display-xl--letter-spacing: -0.03em;
  --text-display-l: clamp(1.875rem, 1.435rem + 1.957vw, 3rem);
  --text-display-l--line-height: 1.02;
  --text-display-l--letter-spacing: -0.02em;
  --text-display-m: clamp(1.375rem, 1.228rem + 0.652vw, 1.75rem);
  --text-display-m--line-height: 1.02;
  --text-display-m--letter-spacing: -0.02em;
  --text-body-l: clamp(1.125rem, 1.076rem + 0.217vw, 1.25rem);
  --text-body-l--line-height: 1.55;
  --text-body: clamp(1.0625rem, 1.038rem + 0.109vw, 1.125rem);
  --text-body--line-height: 1.55;
  --text-meta: clamp(0.8125rem, 0.788rem + 0.109vw, 0.875rem);
  --text-meta--line-height: 1.4;
}

@layer base {
  html {
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    min-height: 100dvh;
    background-color: var(--paper);
    color: var(--ink);
    font-family: var(--typeface-body);
    font-size: var(--text-body);
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    touch-action: manipulation;
  }

  /* PRD 7: a visible 2px --signal focus ring with a 2px offset, never removed. */
  :focus-visible {
    outline: 2px solid var(--signal);
    outline-offset: 2px;
  }
}
```

- [ ] **Step 5: Load the styles and require both font preloads**

In `src/main.tsx`, replace:

```tsx
import App from './App';
```

with:

```tsx
import App from './App';
import './styles/global.css';
```

In `scripts/prerender.mjs`, replace:

```js
const fonts = (await readdir(path.join(dist, 'assets'))).filter((file) => fontFile.test(file));
```

with:

```js
const fonts = (await readdir(path.join(dist, 'assets'))).filter((file) => fontFile.test(file));
if (fonts.length !== 2) {
  throw new Error(`prerender: expected the two Latin font files in dist/assets, found ${fonts.length}`);
}
```

- [ ] **Step 6: Run the tests to confirm they pass**

Run: `npm test`
Expected: PASS - `Test Files  6 passed (6)`.

- [ ] **Step 7: Build and confirm the fonts ship once, Latin only**

Run: `npm run build`
Expected: the output lists `archivo-latin-wdth-normal-<hash>.woff2` and `hanken-grotesk-latin-wght-normal-<hash>.woff2` (and no `vietnamese` or `latin-ext` font files), and ends with `prerender: wrote dist/index.html with 2 font preload(s)`.

Run: `grep -c 'rel="preload"' dist/index.html`
Expected: `2`.

Run: `node -e "const fs=require('fs');const bs=String.fromCharCode(92);for(const f of fs.readdirSync('dist/assets').filter(x=>x.endsWith('.css'))){const c=fs.readFileSync('dist/assets/'+f,'utf8');console.log('arbitrary hex classes:',c.split('['+bs+'#').length-1,'| text-body token present:',c.includes('--text-body:clamp'))}"`
Expected: `arbitrary hex classes: 0 | text-body token present: true`.

Changed during the build (15 Sep 2026, founder-approved "Yes, fix it"): Tailwind builds utilities only from `src/` (`source('../')` on the import). Without it, Tailwind scanned the whole repository and put classes that exist only in the documents into the stylesheet, including the banned `bg-[#3B6EF3]` that the project profile quotes as a forbidden example. The old check looked for a `.bg-paper` rule, which only appears once a component uses that class.

- [ ] **Step 8: Run typecheck and lint**

Run: `npm run typecheck && npm run lint && echo "checks ok"`
Expected: `checks ok`.

- [ ] **Step 9: Commit**

```bash
git add src/styles/tokens.css src/styles/global.css src/main.tsx scripts/prerender.mjs tests/brand-rules.test.ts
git commit -m "feat: brand tokens, self-hosted fonts and the type scale" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```


---

### Task 4: Motion hooks

User job: the page moves only where it helps a creator read it - it never rewinds a number they already saw, and never animates for someone who asked their phone not to.

**Files:**
- Create: `src/hooks/useReducedMotion.ts`, `src/hooks/useInView.ts`, `src/hooks/useCountUp.ts`
- Test: `tests/hooks.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `useReducedMotion(): boolean` - true when the device asks for reduced motion; false on the server and when `window.matchMedia` is missing.
  - `useInView<T extends Element>(threshold?: number): { ref: RefObject<T | null>; inView: boolean }` - `threshold` defaults to `0.35`; `inView` turns true once and observation stops; without `IntersectionObserver` it turns true on the next tick.
  - `useCountUp(target: number, startMs: number, durationMs: number): number` - the first render returns `target`; it counts from 0 to `target` (ease-out cubic) between `startMs` and `startMs + durationMs` after navigation, but only when `performance.now() < startMs` at mount and motion is not reduced.

- [ ] **Step 1: Write the failing test**

`tests/hooks.test.tsx`:

```tsx
import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCountUp } from '../src/hooks/useCountUp';
import { useInView } from '../src/hooks/useInView';
import { useReducedMotion } from '../src/hooks/useReducedMotion';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

/** Stubs window.matchMedia for the reduced-motion query and returns a way to flip the setting. */
function stubReducedMotion(initial: boolean): (next: boolean) => void {
  const listeners = new Set<() => void>();
  const list = {
    matches: initial,
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  };
  vi.stubGlobal('matchMedia', () => list);
  return (next) => {
    list.matches = next;
    listeners.forEach((listener) => listener());
  };
}

function InViewProbe() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return <div ref={ref} data-testid="probe" data-in-view={inView} />;
}

describe('useReducedMotion', () => {
  it('is false when the browser cannot report a motion preference', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('follows the device setting, including a live change', () => {
    const setPreference = stubReducedMotion(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
    act(() => setPreference(false));
    expect(result.current).toBe(false);
  });
});

describe('useInView', () => {
  it('reports in view on the next tick when IntersectionObserver is missing', () => {
    vi.useFakeTimers();
    render(<InViewProbe />);
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'false');
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true');
  });

  it('reports in view once the element intersects, then stops observing', () => {
    let notify: (entries: Array<{ isIntersecting: boolean }>) => void = () => {};
    const disconnectSpy = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: (entries: Array<{ isIntersecting: boolean }>) => void) {
          notify = callback;
        }
        observe() {}
        disconnect = disconnectSpy;
      },
    );
    render(<InViewProbe />);
    act(() => notify([{ isIntersecting: false }]));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'false');
    act(() => notify([{ isIntersecting: true }]));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true');
    expect(disconnectSpy).toHaveBeenCalled();
  });
});

describe('useCountUp', () => {
  it('starts at the real number, so the pre-rendered page is never wrong', () => {
    const { result } = renderHook(() => useCountUp(2140, 1320, 600));
    expect(result.current).toBe(2140);
  });

  it('never rewinds a number when the page hydrates after the tick was due', () => {
    vi.spyOn(performance, 'now').mockReturnValue(5000);
    const requestFrame = vi.fn();
    vi.stubGlobal('requestAnimationFrame', requestFrame);
    const { result } = renderHook(() => useCountUp(2140, 1320, 600));
    expect(result.current).toBe(2140);
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it('ticks from zero up to the target when the page hydrated early', () => {
    vi.spyOn(performance, 'now').mockReturnValue(200);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const { result } = renderHook(() => useCountUp(2140, 1320, 600));
    act(() => frames.shift()?.(1000));
    expect(result.current).toBe(0);
    act(() => frames.shift()?.(1620));
    expect(result.current).toBe(1873);
    act(() => frames.shift()?.(1920));
    expect(result.current).toBe(2140);
    expect(frames).toHaveLength(0);
  });

  it('holds the real number when the visitor prefers reduced motion', () => {
    stubReducedMotion(true);
    vi.spyOn(performance, 'now').mockReturnValue(200);
    const requestFrame = vi.fn();
    vi.stubGlobal('requestAnimationFrame', requestFrame);
    const { result } = renderHook(() => useCountUp(2140, 1320, 600));
    expect(result.current).toBe(2140);
    expect(requestFrame).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `npm test -- tests/hooks.test.tsx`
Expected: FAIL - cannot resolve `../src/hooks/useCountUp`.

- [ ] **Step 3: Write `src/hooks/useReducedMotion.ts`**

```ts
import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const list = window.matchMedia(QUERY);
  list.addEventListener('change', onChange);
  return () => list.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/** True when the visitor has asked their device for reduced motion. Always false on the server. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

- [ ] **Step 4: Write `src/hooks/useInView.ts`**

```ts
import { useEffect, useRef, useState } from 'react';

/** Reports once when the element first scrolls into view, then stops observing. */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    if (typeof IntersectionObserver === 'undefined') {
      // A browser this old reveals on the next tick rather than never.
      const timer = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}
```

- [ ] **Step 5: Write `src/hooks/useCountUp.ts`**

```ts
import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Ticks a number from 0 up to `target`, starting `startMs` after navigation and lasting `durationMs`.
 * The first render is the final value, so the pre-rendered page and no-JS visitors see the real number.
 * It only animates when the page hydrated before the tick was due, so a late hydration on slow 4G
 * never rewinds a number the creator has already read.
 */
export function useCountUp(target: number, startMs: number, durationMs: number): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (reduced || performance.now() >= startMs) return;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - startMs) / durationMs));
      setValue(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, target, startMs, durationMs]);

  return value;
}
```

- [ ] **Step 6: Run the tests to confirm they pass**

Run: `npm test`
Expected: PASS - `Test Files  7 passed (7)`.

- [ ] **Step 7: Run typecheck and lint**

Run: `npm run typecheck && npm run lint && echo "checks ok"`
Expected: `checks ok` (the React hooks rules, including the compiler checks, report nothing).

- [ ] **Step 8: Commit**

```bash
git add src/hooks tests/hooks.test.tsx
git commit -m "feat: motion hooks for reduced motion, scroll reveals and the vote tick" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Primitives - section, chip, button, take card, wordmark

User job: the same few pieces carry every block, so the page reads as one voice and "Claim a seat" behaves identically wherever a creator taps it.

**Files:**
- Create: `src/components/primitives/Section.tsx`, `src/components/primitives/Chip.tsx`, `src/components/primitives/CtaButton.tsx`, `src/components/primitives/TakeCard.tsx`, `src/components/primitives/Wordmark.tsx`
- Modify: `src/styles/global.css` (append)
- Test: `tests/primitives.test.tsx`

**Interfaces:**
- Consumes: `content` from `src/content.ts`; `ctaHref`, `whatsappFallbackHref` from `src/lib/cta.ts`.
- Produces:
  - `Section({ id, tone, belowFold, children }: { id: string; tone: 'paper' | 'recess' | 'ink'; belowFold?: boolean; children: ReactNode })` - renders `<section id={id} aria-labelledby={`${id}-heading`}>` with the background band, vertical rhythm and the content column. The caller renders the heading with `id={`${id}-heading`}`.
  - `type ChipTone = 'blue' | 'butter' | 'coral' | 'neutral'`; `Chip({ tone, children }: { tone: ChipTone; children: ReactNode })` - a `<span data-tone={tone}>`.
  - `CtaButton({ variant }: { variant: 'dark' | 'light' })` - the DM link (`content.cta.label`, `href={ctaHref}`, `target="_blank"`, `rel="noopener noreferrer"`), the helper line `content.cta.helper`, and the WhatsApp link only when `whatsappFallbackHref` is not null. `dark` sits on light sections; `light` sits on the ink section.
  - `TakeCard({ chip, text, featured, children }: { chip: string; text: string; featured?: boolean; children?: ReactNode })` - an `<article class="take-card">` with a neutral chip and the take; `featured` adds `shadow-take` and the desktop tilt.
  - `Wordmark({ small }: { small?: boolean })` - the wordmark text `content.nav.wordmark` in Archivo 800; `small` sets it at body-large size for the footer row.

- [ ] **Step 1: Write the failing test**

`tests/primitives.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Chip } from '../src/components/primitives/Chip';
import { CtaButton } from '../src/components/primitives/CtaButton';
import { Section } from '../src/components/primitives/Section';
import { TakeCard } from '../src/components/primitives/TakeCard';
import { Wordmark } from '../src/components/primitives/Wordmark';
import { content } from '../src/content';
import { ctaHref } from '../src/lib/cta';

describe('Section', () => {
  it('is a region labelled by the heading inside it', () => {
    render(
      <Section id="demo" tone="recess">
        <h2 id="demo-heading">Demo heading</h2>
      </Section>,
    );
    expect(screen.getByRole('region', { name: 'Demo heading' })).toHaveAttribute('id', 'demo');
  });
});

describe('Chip', () => {
  it.each(['blue', 'butter', 'coral', 'neutral'] as const)(
    'renders a %s chip as sentence-case text',
    (tone) => {
      render(<Chip tone={tone}>sample take</Chip>);
      const chip = screen.getByText('sample take');
      expect(chip).toHaveAttribute('data-tone', tone);
      expect(chip.className).not.toMatch(/uppercase/);
    },
  );
});

describe('CtaButton', () => {
  it.each(['dark', 'light'] as const)(
    'the %s button opens the DM in a new tab and names the handle',
    (variant) => {
      render(<CtaButton variant={variant} />);
      const link = screen.getByRole('link', { name: content.cta.label });
      expect(link).toHaveAttribute('href', ctaHref);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(screen.getByText(content.cta.helper)).toBeInTheDocument();
    },
  );

  it('shows no WhatsApp link while the fallback is switched off', () => {
    render(<CtaButton variant="dark" />);
    expect(screen.queryByRole('link', { name: content.cta.whatsappLabel })).toBeNull();
  });
});

describe('TakeCard', () => {
  it('is an article that shows its label chip and the take', () => {
    render(<TakeCard chip="sample take" text="Being early beats being good." />);
    const card = screen.getByRole('article');
    expect(within(card).getByText('sample take')).toBeInTheDocument();
    expect(within(card).getByText('Being early beats being good.')).toBeInTheDocument();
  });

  it('uses the one shadow only when featured', () => {
    const { rerender } = render(<TakeCard chip="sample take" text="A take." />);
    expect(screen.getByRole('article').className).not.toContain('shadow-take');
    rerender(<TakeCard chip="sample take" text="A take." featured />);
    expect(screen.getByRole('article').className).toContain('shadow-take');
  });
});

describe('Wordmark', () => {
  it('shows the Riffi wordmark', () => {
    render(<Wordmark />);
    expect(screen.getByText(content.nav.wordmark)).toBeInTheDocument();
  });

  it('has a smaller size for the footer row', () => {
    const { rerender } = render(<Wordmark />);
    expect(screen.getByText(content.nav.wordmark).className).toContain('text-display-m');
    rerender(<Wordmark small />);
    expect(screen.getByText(content.nav.wordmark).className).toContain('text-body-l');
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `npm test -- tests/primitives.test.tsx`
Expected: FAIL - cannot resolve `../src/components/primitives/Chip`.

- [ ] **Step 3: Write `src/components/primitives/Section.tsx`**

```tsx
import type { ReactNode } from 'react';

const TONES = {
  paper: 'bg-paper text-ink',
  recess: 'bg-recess text-ink',
  ink: 'bg-ink text-paper',
} as const;

type SectionProps = {
  id: string;
  tone: keyof typeof TONES;
  /** Below-the-fold sections skip rendering work until they are near the viewport (PRD 7). */
  belowFold?: boolean;
  children: ReactNode;
};

/** A page section: its background band, the vertical rhythm and the content column (PRD 3.4). */
export function Section({ id, tone, belowFold = false, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`${TONES[tone]} ${belowFold ? 'below-fold' : ''} py-[72px] lg:py-[112px] xl:py-[128px]`}
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 md:px-8 lg:px-10">{children}</div>
    </section>
  );
}
```

- [ ] **Step 4: Write `src/components/primitives/Chip.tsx`**

```tsx
import type { ReactNode } from 'react';

const TONES = {
  blue: 'bg-chip-blue-bg text-chip-blue-ink',
  butter: 'bg-chip-butter-bg text-chip-butter-ink',
  coral: 'bg-chip-coral-bg text-chip-coral-ink',
  neutral: 'bg-recess text-ink-soft',
} as const;

export type ChipTone = keyof typeof TONES;

type ChipProps = { tone: ChipTone; children: ReactNode };

/** A fully rounded label that carries the page's playfulness (PRD 3.2). Sentence case, never caps. */
export function Chip({ tone, children }: ChipProps) {
  return (
    <span
      data-tone={tone}
      className={`${TONES[tone]} inline-flex items-center rounded-pill px-3 py-1 text-meta font-medium`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 5: Write `src/components/primitives/CtaButton.tsx`**

```tsx
import { content } from '../../content';
import { ctaHref, whatsappFallbackHref } from '../../lib/cta';

const VARIANTS = {
  dark: { button: 'bg-ink text-paper', helper: 'text-ink-soft', fallback: 'text-ink' },
  light: { button: 'bg-paper text-ink', helper: 'text-on-ink-meta', fallback: 'text-paper' },
} as const;

type CtaButtonProps = { variant: keyof typeof VARIANTS };

/** The page's only conversion: open a DM with Riffi's Instagram account (PRD 5.4). */
export function CtaButton({ variant }: CtaButtonProps) {
  const styles = VARIANTS[variant];
  return (
    <div className="flex flex-col items-stretch lg:items-start">
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.button} inline-flex min-h-11 items-center justify-center rounded-pill px-8 py-3 text-body-l font-semibold`}
      >
        {content.cta.label}
      </a>
      <p className={`${styles.helper} mt-3 text-meta`}>{content.cta.helper}</p>
      {whatsappFallbackHref ? (
        <a
          href={whatsappFallbackHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.fallback} inline-flex min-h-11 items-center text-meta underline underline-offset-4`}
        >
          {content.cta.whatsappLabel}
        </a>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 6: Write `src/components/primitives/TakeCard.tsx` and `src/components/primitives/Wordmark.tsx`**

`src/components/primitives/TakeCard.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Chip } from './Chip';

type TakeCardProps = {
  chip: string;
  text: string;
  /** The hero's card carries the page's one shadow and tilts on desktop (PRD Block 1). */
  featured?: boolean;
  children?: ReactNode;
};

/** The product's atom: a short opinion, labelled, with room for its poll (PRD 3.1). */
export function TakeCard({ chip, text, featured = false, children }: TakeCardProps) {
  return (
    <article
      className={`take-card rounded-take border border-hairline bg-paper p-5 md:p-6 ${featured ? 'shadow-take lg:-rotate-2' : ''}`}
    >
      <Chip tone="neutral">{chip}</Chip>
      <p className="mt-4 font-display text-display-m font-bold text-ink">{text}</p>
      {children}
    </article>
  );
}
```

`src/components/primitives/Wordmark.tsx`:

```tsx
import { content } from '../../content';

type WordmarkProps = {
  /** The footer row sets the wordmark smaller than the header does (PRD Block 8). */
  small?: boolean;
};

/** The Riffi wordmark: the display face at weight 800 until the brand kit supplies an SVG (PRD 8). */
export function Wordmark({ small = false }: WordmarkProps) {
  return (
    <span className={`font-display font-extrabold ${small ? 'text-body-l' : 'text-display-m'}`}>
      {content.nav.wordmark}
    </span>
  );
}
```

- [ ] **Step 7: Append the primitives' CSS to `src/styles/global.css`**

```css
@layer components {
  /* Below-the-fold sections skip rendering work until they near the viewport (PRD 7). */
  .below-fold {
    content-visibility: auto;
    contain-intrinsic-size: auto 900px;
  }

  /* Hover lift belongs only to take cards, and only on pointer devices (PRD 3.5). */
  .take-card {
    transition: transform 200ms ease-out;
  }

  @media (hover: hover) and (pointer: fine) {
    .take-card:hover {
      transform: translateY(-4px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .take-card {
      transition: none;
    }

    .take-card:hover {
      transform: none;
    }
  }
}
```

- [ ] **Step 8: Run the tests to confirm they pass**

Run: `npm test`
Expected: PASS - `Test Files  8 passed (8)`.

- [ ] **Step 9: Run typecheck and lint**

Run: `npm run typecheck && npm run lint && echo "checks ok"`
Expected: `checks ok` (no `no-restricted-syntax` errors: the primitives hold no literal copy).

- [ ] **Step 10: Commit**

```bash
git add src/components/primitives src/styles/global.css tests/primitives.test.tsx
git commit -m "feat: section, chip, button, take card and wordmark primitives" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: PollBar - the structural device

User job: a creator sees an opinion as a split at a glance, and still gets every number from the words when colour or motion is missing.

**Files:**
- Create: `src/components/primitives/PollBar.tsx`
- Modify: `src/styles/global.css` (append)
- Test: `tests/poll-bar.test.tsx`

**Interfaces:**
- Consumes: `useInView` from `src/hooks/useInView.ts`.
- Produces:
  - `type PollSide = { label: string; value: string; weight: number }`
  - `PollBar({ left, right, variant, animateOnView, showPercent, index, fill }: { left: PollSide; right: PollSide; variant: 'sample' | 'comparison' | 'meter'; animateOnView?: boolean; showPercent?: boolean; index?: number; fill?: 'left' | 'right' })` - renders `<div class="poll" data-variant data-motion="load|view|none" data-fill="left|right" data-in-view style="--fill: <filled side's share>%; --stagger: <index × 80>ms">`, a `div.poll-track[aria-hidden="true"]` holding `div.poll-fill`, and, except for `meter`, a two-column legend: `sample` shows `<value> <label>` when `showPercent` (label only otherwise); `comparison` shows each label above its value. Every label and value is in its own element. The filled side is drawn in `--signal` and the other side in `--chip-coral-bg`; `fill` defaults to `left`, and `right` grows the fill from the right edge.

- [ ] **Step 1: Write the failing test**

`tests/poll-bar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PollBar } from '../src/components/primitives/PollBar';

const agree = { label: 'agree', value: '71%', weight: 71 };
const disagree = { label: 'disagree', value: '29%', weight: 29 };

function pollElement(container: HTMLElement): HTMLElement {
  const element = container.querySelector<HTMLElement>('.poll');
  if (!element) throw new Error('the poll bar did not render');
  return element;
}

describe('PollBar', () => {
  it('draws the left side at its share of the total', () => {
    const { container } = render(
      <PollBar left={agree} right={disagree} variant="sample" showPercent />,
    );
    expect(pollElement(container).style.getPropertyValue('--fill')).toBe('71%');
  });

  it('carries both sides as text, so the meaning never depends on colour', () => {
    render(<PollBar left={agree} right={disagree} variant="sample" showPercent />);
    for (const text of ['71%', 'agree', '29%', 'disagree']) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it('hides the drawn bar itself from assistive technology', () => {
    const { container } = render(
      <PollBar left={agree} right={disagree} variant="sample" showPercent />,
    );
    expect(container.querySelector('.poll-track')).toHaveAttribute('aria-hidden', 'true');
  });

  it('fills on load for the hero sample and on scroll for the other bars', () => {
    const { container, rerender } = render(
      <PollBar left={agree} right={disagree} variant="sample" showPercent />,
    );
    expect(pollElement(container)).toHaveAttribute('data-motion', 'load');
    rerender(<PollBar left={agree} right={disagree} variant="comparison" animateOnView />);
    expect(pollElement(container)).toHaveAttribute('data-motion', 'view');
  });

  it('staggers scroll reveals by 80ms per row', () => {
    const { container } = render(
      <PollBar left={agree} right={disagree} variant="comparison" animateOnView index={3} />,
    );
    expect(pollElement(container).style.getPropertyValue('--stagger')).toBe('240ms');
  });

  it('can draw the fill from the right, sized by the right side', () => {
    const { container } = render(
      <PollBar
        left={{ label: 'Instagram', value: 'Lakhs', weight: 12 }}
        right={{ label: 'Riffi', value: '49', weight: 88 }}
        variant="comparison"
        animateOnView
        fill="right"
      />,
    );
    expect(pollElement(container)).toHaveAttribute('data-fill', 'right');
    expect(pollElement(container).style.getPropertyValue('--fill')).toBe('88%');
  });

  it('shows each comparison side as its label and its value', () => {
    render(
      <PollBar
        left={{ label: 'Instagram', value: 'Lakhs', weight: 12 }}
        right={{ label: 'Riffi', value: '49', weight: 88 }}
        variant="comparison"
        animateOnView
      />,
    );
    for (const text of ['Instagram', 'Lakhs', 'Riffi', '49']) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it('draws an empty meter with no text when there is no real number', () => {
    const { container } = render(
      <PollBar
        left={{ label: '', value: '', weight: 0 }}
        right={{ label: '', value: '', weight: 50 }}
        variant="meter"
        animateOnView
      />,
    );
    expect(pollElement(container).style.getPropertyValue('--fill')).toBe('0%');
    expect(container.textContent).toBe('');
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `npm test -- tests/poll-bar.test.tsx`
Expected: FAIL - cannot resolve `../src/components/primitives/PollBar`.

- [ ] **Step 3: Write `src/components/primitives/PollBar.tsx`**

```tsx
import type { CSSProperties } from 'react';
import { useInView } from '../../hooks/useInView';

export type PollSide = { label: string; value: string; weight: number };

type Variant = 'sample' | 'comparison' | 'meter';

type PollBarProps = {
  left: PollSide;
  right: PollSide;
  variant: Variant;
  /** Fill when scrolled into view (comparison rows, seat meter) instead of on page load. */
  animateOnView?: boolean;
  /** In the sample legend, show each side's value (for example "71%") before its label. */
  showPercent?: boolean;
  /** Position in a staggered group: each step delays the fill by 80ms (PRD 3.5). */
  index?: number;
  /** Which side is drawn as the fill. `right` grows the fill from the right edge. */
  fill?: 'left' | 'right';
};

type LegendProps = { side: PollSide; variant: Variant; showPercent: boolean; end: boolean };

function Legend({ side, variant, showPercent, end }: LegendProps) {
  const align = end ? 'text-right' : 'text-left';
  if (variant === 'comparison') {
    return (
      <div className={align}>
        <p className="text-meta text-ink-soft">{side.label}</p>
        <p className="font-semibold text-ink">{side.value}</p>
      </div>
    );
  }
  return (
    <p className={`${align} text-ink`}>
      {showPercent ? (
        <>
          <span className="font-semibold">{side.value}</span>{' '}
        </>
      ) : null}
      <span>{side.label}</span>
    </p>
  );
}

/**
 * The page's structural device - an opinion is a split (PRD 3.1, 5.5). The drawn bar is decoration;
 * both sides always exist as text, so the meaning never rests on colour or motion. The track has a
 * fixed height, so the fill animation causes no layout shift.
 */
export function PollBar({
  left,
  right,
  variant,
  animateOnView = false,
  showPercent = false,
  index = 0,
  fill = 'left',
}: PollBarProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const total = left.weight + right.weight;
  const filled = fill === 'left' ? left.weight : right.weight;
  const share = total > 0 ? Math.round((filled / total) * 100) : 0;
  const motion = animateOnView ? 'view' : variant === 'sample' ? 'load' : 'none';
  const style = { '--fill': `${share}%`, '--stagger': `${index * 80}ms` } as CSSProperties;

  return (
    <div
      ref={ref}
      className="poll"
      data-variant={variant}
      data-motion={motion}
      data-fill={fill}
      data-in-view={inView}
      style={style}
    >
      <div className="poll-track" aria-hidden="true">
        <div className="poll-fill" />
      </div>
      {variant === 'meter' ? null : (
        <div className="mt-3 grid grid-cols-2 gap-4">
          <Legend side={left} variant={variant} showPercent={showPercent} end={false} />
          <Legend side={right} variant={variant} showPercent={showPercent} end />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Append the poll bar's CSS and its three motion rules to `src/styles/global.css`**

```css
@layer components {
  .poll-track {
    display: flex;
    height: 44px;
    overflow: hidden;
    border-radius: var(--corner-pill);
    background-color: var(--chip-coral-bg);
  }

  @media (min-width: 64rem) {
    .poll-track {
      height: 52px;
    }
  }

  .poll-fill {
    width: var(--fill);
    height: 100%;
    background-color: var(--signal);
  }

  /* A right-side fill grows from the right edge: the comparison rows' Riffi side (PRD Block 3). */
  .poll[data-fill='right'] .poll-track {
    flex-direction: row-reverse;
  }

  /* The seat meter's empty track is an outline on the recess band, not a coral "no" side. */
  .poll[data-variant='meter'] .poll-track {
    background-color: var(--paper);
    box-shadow: inset 0 0 0 1px var(--hairline);
  }

  /* Motion moment 1 (PRD 3.5): the hero sample fills from zero once the headline has risen. */
  @keyframes poll-fill-in {
    from {
      width: 0;
    }
  }

  .poll[data-motion='load'] .poll-fill {
    animation: poll-fill-in 900ms cubic-bezier(0.22, 1, 0.36, 1) 420ms both;
  }

  /*
   * Moments 2 and 3: the comparison rows and the seat meter fill when scrolled into view. With no
   * JavaScript at all there is no `js` class, so the bars simply render full. If the inline script
   * ran but the bundle never did (no `app-ready`), a failsafe fills them after 6 seconds.
   */
  .js .poll[data-motion='view'] .poll-fill {
    width: 0;
    transition: width 900ms cubic-bezier(0.22, 1, 0.36, 1) var(--stagger);
  }

  .js .poll[data-motion='view'][data-in-view='true'] .poll-fill {
    width: var(--fill);
  }

  @keyframes poll-failsafe {
    to {
      width: var(--fill);
    }
  }

  .js:not(.app-ready) .poll[data-motion='view'] .poll-fill {
    animation: poll-failsafe 1ms linear 6s forwards;
  }

  /* One selector per motion rule, each at least as specific as the rule it switches off. */
  @media (prefers-reduced-motion: reduce) {
    .poll .poll-fill,
    .poll[data-motion='load'] .poll-fill,
    .js .poll[data-motion='view'] .poll-fill,
    .js:not(.app-ready) .poll[data-motion='view'] .poll-fill {
      width: var(--fill);
      animation: none;
      transition: none;
    }
  }
}
```

- [ ] **Step 5: Run the tests to confirm they pass**

Run: `npm test`
Expected: PASS - `Test Files  9 passed (9)`.

- [ ] **Step 6: Run typecheck and lint, and build**

Run: `npm run typecheck && npm run lint && npm run build && grep -c "poll-fill-in" dist/assets/*.css`
Expected: the build ends with `prerender: wrote dist/index.html with 2 font preload(s)`, then `1`.

- [ ] **Step 7: Commit**

```bash
git add src/components/primitives/PollBar.tsx src/styles/global.css tests/poll-bar.test.tsx
git commit -m "feat: the poll bar, with load, scroll and reduced-motion behaviour" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```


---

### Task 7: The eight blocks and the full page

User job: the whole argument, answered in the order a creator's objections come up (PRD 2.2), ending in one action - and nothing on it that would turn out untrue.

**Files:**
- Create: `src/components/blocks/Nav.tsx`, `src/components/blocks/Hero.tsx`, `src/components/blocks/WhatRiffiIs.tsx`, `src/components/blocks/WhyHere.tsx`, `src/components/blocks/HowYouEarn.tsx`, `src/components/blocks/LongGame.tsx`, `src/components/blocks/Seats.tsx`, `src/components/blocks/Faq.tsx`, `src/components/blocks/Close.tsx`, `src/components/blocks/Footer.tsx`
- Modify: `src/App.tsx`, `src/styles/global.css` (append), `tests/prerender.test.ts`
- Test: `tests/page.test.tsx` (independent test author - copy verbatim), `tests/prerender.test.ts`, `tests/copy-source.test.tsx`

**Interfaces:**
- Consumes: `content`, `settings`, `type Settings` from `src/content.ts`; `Section`, `Chip`, `type ChipTone`, `CtaButton`, `TakeCard`, `Wordmark`, `PollBar` from `src/components/primitives/`; `useCountUp` from `src/hooks/useCountUp.ts`.
- Produces: `App` (default export of `src/App.tsx`) rendering `<header>`, `<main id="main">` with the sections `#hero`, `#what-riffi-is`, `#why-here`, `#how-you-earn`, `#long-game`, `#seats`, `#faq`, `#close` in that order, and `<footer>`; the named export `Seats({ seats }: { seats: Settings['seats'] })`. Every block is a named export taking no props, except `Seats`.

- [ ] **Step 1: Write the failing tests**

Written by the independent test author from the PRD and the approved design - copy verbatim.

`tests/page.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { Seats } from '../src/components/blocks/Seats';
import { content, settings } from '../src/content';
import { ctaHref } from '../src/lib/cta';
import { EXAMPLE_FRAMING, MONEY, NUMBER_NEXT_TO_POINTS, SEAT_COUNT, URGENCY, sentencesOf } from './honesty-rules';

// ---------- helpers ----------

const normalize = (text: string | null | undefined): string => (text ?? '').replace(/\s+/g, ' ').trim();

const SECTION_IDS = ['hero', 'what-riffi-is', 'why-here', 'how-you-earn', 'long-game', 'seats', 'faq', 'close'];

function section(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element || element.tagName !== 'SECTION') throw new Error(`the page has no <section id="${id}">`);
  return element;
}

/** The one element matching a selector inside a container, or a clear failure. */
function only(container: ParentNode, selector: string): HTMLElement {
  const found = container.querySelectorAll<HTMLElement>(selector);
  if (found.length !== 1) throw new Error(`expected exactly one "${selector}", found ${found.length}`);
  return found[0] as HTMLElement;
}

/** The deepest elements whose whole text, whitespace-normalised, is exactly `text` (inline markup allowed). */
function byFullText(container: ParentNode, text: string): HTMLElement[] {
  const wanted = normalize(text);
  return Array.from(container.querySelectorAll<HTMLElement>('*')).filter(
    (element) =>
      normalize(element.textContent) === wanted &&
      !Array.from(element.children).some((child) => normalize(child.textContent) === wanted),
  );
}

/** The smallest element that contains both a and b. */
function commonAncestor(a: Element, b: Element): HTMLElement {
  let node: Element | null = a;
  while (node && !node.contains(b)) node = node.parentElement;
  if (!node) throw new Error('the two elements share no ancestor');
  return node as HTMLElement;
}

const comesBefore = (a: Node, b: Node): boolean =>
  Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

const hiddenFromScreenReaders = (element: Element): boolean => element.closest('[aria-hidden="true"]') !== null;

/** Everything a person or a screen reader can meet inside root: all text, plus the text-bearing attributes. */
function readableText(root: Element): string {
  const parts: string[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) parts.push(node.textContent ?? '');
  for (const element of [root, ...Array.from(root.querySelectorAll('*'))]) {
    for (const name of ['aria-label', 'aria-valuetext', 'aria-valuenow', 'title', 'alt']) {
      const value = element.getAttribute(name);
      if (value) parts.push(value);
    }
  }
  return normalize(parts.join(' '));
}

// ---------- structure ----------

describe('page structure and semantics (PRD 7)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('has one page header with the wordmark and the Batch 01 chip', () => {
    const headers = Array.from(document.querySelectorAll<HTMLElement>('header')).filter((el) => !el.closest('main'));
    expect(headers).toHaveLength(1);
    const header = headers[0] as HTMLElement;
    expect(within(header).getByText(content.nav.wordmark)).toBeInTheDocument();
    expect(within(header).getByText(content.nav.batch)).toBeInTheDocument();
  });

  it('puts exactly the eight blocks, in PRD order, inside <main id="main">', () => {
    const main = screen.getByRole('main');
    expect(main.id).toBe('main');
    expect(Array.from(main.querySelectorAll('section')).map((element) => element.id)).toEqual(SECTION_IDS);
  });

  it('has exactly one h1: the two hero title lines, each in its own span, read as one sentence', () => {
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.id).toBe('hero-heading');
    const spanTexts = Array.from(h1.querySelectorAll('span')).map((span) => normalize(span.textContent));
    for (const line of content.hero.titleLines) expect(spanTexts).toContain(line);
    expect(h1).toHaveAccessibleName(content.hero.titleLines.join(' '));
  });

  it.each(SECTION_IDS)('labels #%s by its own heading (h1 for the hero, h2 for every other block)', (id) => {
    const expectedName: Record<string, string> = {
      hero: content.hero.titleLines.join(' '),
      'what-riffi-is': content.whatRiffiIs.heading,
      'why-here': content.whyHere.heading,
      'how-you-earn': content.howYouEarn.heading,
      'long-game': content.longGame.heading,
      seats: content.seats.heading,
      faq: content.faq.heading,
      close: content.close.heading,
    };
    const block = section(id);
    const heading = document.getElementById(`${id}-heading`);
    expect(block.getAttribute('aria-labelledby')).toBe(`${id}-heading`);
    expect(heading).not.toBeNull();
    expect(block.contains(heading)).toBe(true);
    expect(heading?.tagName).toBe(id === 'hero' ? 'H1' : 'H2');
    expect(block).toHaveAccessibleName(expectedName[id] ?? '(no expected name)');
  });
});

// ---------- block 1: hero ----------

describe('#hero (PRD Block 1)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('shows the subline', () => {
    expect(within(section('hero')).getByText(content.hero.subline)).toBeInTheDocument();
  });

  it('shows the sample take card: its chip, the take, and 71% / agree / 29% / disagree once each as readable text', () => {
    const card = only(section('hero'), 'article');
    expect(within(card).getByText(content.hero.sampleTake.chip)).toBeInTheDocument();
    expect(within(card).getByText(content.hero.sampleTake.text)).toBeInTheDocument();
    for (const text of ['71%', '29%', 'agree', 'disagree']) {
      const found = within(card).getAllByText(text);
      expect(found, text).toHaveLength(1);
      expect(hiddenFromScreenReaders(found[0] as HTMLElement), `"${text}" is hidden from screen readers`).toBe(false);
    }
  });

  it('shows the vote count once in the whole page, exactly "2,140 votes", inside the card', () => {
    const counts = screen.getAllByText('2,140 votes');
    expect(counts).toHaveLength(1);
    expect(only(section('hero'), 'article').contains(counts[0] ?? null)).toBe(true);
  });

  it('keeps take cards for takes only: the hero card is the only <article> outside the marquee', () => {
    const outsideMarquee = Array.from(document.querySelectorAll('article')).filter(
      (article) => !article.closest('[data-marquee]'),
    );
    expect(outsideMarquee).toHaveLength(1);
    expect(section('hero').contains(outsideMarquee[0] ?? null)).toBe(true);
  });
});

// ---------- the call to action ----------

describe('the call to action (PRD 5.4, design 4)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('has exactly two "Claim a seat" links: one in #hero, then one in #close', () => {
    const links = screen.getAllByRole('link', { name: content.cta.label });
    expect(links).toHaveLength(2);
    expect(section('hero').contains(links[0] ?? null)).toBe(true);
    expect(section('close').contains(links[1] ?? null)).toBe(true);
  });

  it('makes each one a plain <a> to the Instagram DM, opening in a new tab with noopener noreferrer', () => {
    for (const link of screen.getAllByRole('link', { name: content.cta.label })) {
      expect(link.tagName).toBe('A');
      expect(link.getAttribute('href')).toBe(ctaHref);
      expect(link.getAttribute('target')).toBe('_blank');
      expect((link.getAttribute('rel') ?? '').split(/\s+/).filter(Boolean).sort()).toEqual(['noopener', 'noreferrer']);
    }
    expect(screen.queryAllByRole('button', { name: content.cta.label })).toEqual([]);
  });

  it('has no other Instagram DM link anywhere on the page', () => {
    expect(document.querySelectorAll('a[href*="ig.me"]')).toHaveLength(2);
  });

  it.each(['hero', 'close'])('shows the helper line in #%s, naming the same handle its link opens', (id) => {
    const block = section(id);
    const helper = within(block).getByText(content.cta.helper);
    const link = within(block).getByRole('link', { name: content.cta.label });
    const shownHandle = /@([A-Za-z0-9._]+)$/.exec(normalize(helper.textContent))?.[1];
    const linkedHandle = /^https:\/\/ig\.me\/m\/([^/?#]+)$/.exec(link.getAttribute('href') ?? '')?.[1];
    expect(shownHandle).toBe(settings.instagramHandle);
    expect(linkedHandle).toBe(settings.instagramHandle);
  });

  it('has no WhatsApp link or label while the fallback is off (the default)', () => {
    expect(settings.whatsapp.enabled).toBe(false);
    expect(document.querySelectorAll('a[href*="wa.me"]')).toHaveLength(0);
    expect(document.body.innerHTML).not.toContain('wa.me');
    expect(screen.queryByText(content.cta.whatsappLabel)).toBeNull();
  });

  it('never uses a <form>', () => {
    expect(document.querySelector('form')).toBeNull();
  });
});

// ---------- block 2: what Riffi is ----------

describe('#what-riffi-is (PRD Block 2)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('shows the lead', () => {
    expect(within(section('what-riffi-is')).getByText(content.whatRiffiIs.lead)).toBeInTheDocument();
  });

  it('keeps each side of the contrast pair together: chip, text and caption, never mixed with the other side', () => {
    const block = within(section('what-riffi-is'));
    const { notTake, take } = content.whatRiffiIs;
    for (const [side, other] of [
      [notTake, take],
      [take, notTake],
    ] as const) {
      const group = commonAncestor(block.getByText(side.chip), block.getByText(side.text));
      expect(group.contains(block.getByText(side.caption))).toBe(true);
      expect(group.contains(block.getByText(other.text))).toBe(false);
    }
  });

  it('lists the ten categories as a real list, in order', () => {
    const lists = Array.from(section('what-riffi-is').querySelectorAll('ul')).map((list) =>
      Array.from(list.children)
        .filter((child) => child.tagName === 'LI')
        .map((item) => normalize(item.textContent)),
    );
    expect(lists).toContainEqual([...content.whatRiffiIs.categories]);
  });

  it('hides the moving marquee from screen readers and keeps anything focusable out of it', () => {
    const marquee = only(section('what-riffi-is'), '[data-marquee]');
    expect(marquee.getAttribute('aria-hidden')).toBe('true');
    expect(marquee.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')).toHaveLength(0);
  });

  it('labels every marquee card "sample take", and every card carries one of the eight takes', () => {
    const cards = Array.from(only(section('what-riffi-is'), '[data-marquee]').querySelectorAll<HTMLElement>('article'));
    const takes = content.whatRiffiIs.marqueeTakes;
    expect(cards.length).toBeGreaterThanOrEqual(takes.length);
    for (const card of cards) {
      expect(within(card).getAllByText(content.whatRiffiIs.marqueeChip)).toHaveLength(1);
      expect(takes.some((take) => normalize(card.textContent).includes(take))).toBe(true);
    }
    for (const take of takes) {
      expect(cards.some((card) => normalize(card.textContent).includes(take)), take).toBe(true);
    }
  });

  it('gives screen readers the eight takes in a list named "Sample takes", outside the marquee', () => {
    const block = section('what-riffi-is');
    const list = within(block).getByRole('list', { name: content.whatRiffiIs.marqueeLabel });
    expect(list.tagName).toBe('UL');
    expect(only(block, '[data-marquee]').contains(list)).toBe(false);
    expect(within(list).getAllByRole('listitem').map((item) => normalize(item.textContent))).toEqual([
      ...content.whatRiffiIs.marqueeTakes,
    ]);
  });
});

// ---------- block 3: why here, not there ----------

describe('#why-here (PRD Block 3)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it.each(content.whyHere.rows)('shows the row "$label" as readable text: its label, then both sides with their values', (row) => {
    const block = within(section('why-here'));
    const label = block.getByText(row.label);
    const instagramValue = block.getByText(row.instagram);
    const riffiValue = block.getByText(row.riffi);
    expect(label.tagName).toBe('P');
    expect(comesBefore(label, instagramValue) && comesBefore(label, riffiValue)).toBe(true);
    const rowElement = commonAncestor(label, riffiValue);
    expect(rowElement.contains(instagramValue)).toBe(true);
    expect(within(rowElement).getAllByText(content.whyHere.instagramLabel)).toHaveLength(1);
    expect(within(rowElement).getAllByText(content.whyHere.riffiLabel)).toHaveLength(1);
    for (const other of content.whyHere.rows.filter((candidate) => candidate.label !== row.label)) {
      expect(normalize(rowElement.textContent)).not.toContain(other.label);
    }
    const sideLabels = [
      within(rowElement).getByText(content.whyHere.instagramLabel),
      within(rowElement).getByText(content.whyHere.riffiLabel),
    ];
    for (const element of [label, instagramValue, riffiValue, ...sideLabels]) {
      expect(hiddenFromScreenReaders(element)).toBe(false);
    }
  });

  it('sets the closer apart as its own paragraph, not inside a card or a list', () => {
    const closer = within(section('why-here')).getByText(content.whyHere.closer);
    expect(closer.closest('p')).not.toBeNull();
    expect(closer.closest('article, li')).toBeNull();
  });

  it('shows no percentages, so the illustrative splits never read as measurements', () => {
    expect(readableText(section('why-here'))).not.toMatch(/\d\s*%/);
  });
});

// ---------- block 4: how you earn ----------

describe('#how-you-earn (PRD Block 4)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('lists the five earn rows as a real list, each with its action, description and a "points" pill', () => {
    const items = Array.from(only(section('how-you-earn'), 'ul').children) as HTMLElement[];
    expect(items.map((item) => item.tagName)).toEqual(['LI', 'LI', 'LI', 'LI', 'LI']);
    content.howYouEarn.rows.forEach((row, index) => {
      const item = within(items[index] as HTMLElement);
      expect(item.getByText(row.action)).toBeInTheDocument();
      expect(item.getByText(row.description)).toBeInTheDocument();
      expect(item.getByText(content.howYouEarn.pill)).toBeInTheDocument();
    });
  });

  it('puts the honest note after the list, outside it', () => {
    const block = section('how-you-earn');
    const list = only(block, 'ul');
    const note = within(block).getByText(content.howYouEarn.note);
    expect(list.contains(note)).toBe(false);
    expect(comesBefore(list, note)).toBe(true);
  });
});

// ---------- block 5: the long game ----------

describe('#long-game (PRD Block 5)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('shows the three items as h3 titles, each followed by its own body, then the framing line', () => {
    const block = section('long-game');
    const titles = Array.from(block.querySelectorAll('h3'));
    expect(titles.map((title) => normalize(title.textContent))).toEqual(content.longGame.items.map((item) => item.title));
    const bodies = content.longGame.items.map((item) => {
      const found = byFullText(block, item.body);
      expect(found, item.title).toHaveLength(1);
      return found[0] as HTMLElement;
    });
    bodies.forEach((body, index) => {
      expect(comesBefore(titles[index] as HTMLElement, body)).toBe(true);
    });
    bodies.slice(0, -1).forEach((body, index) => {
      expect(comesBefore(body, titles[index + 1] as HTMLElement)).toBe(true);
    });
    const framing = byFullText(block, content.longGame.framing);
    expect(framing).toHaveLength(1);
    expect((framing[0] as HTMLElement).closest('p')).not.toBeNull();
    expect(comesBefore(bodies[bodies.length - 1] as HTMLElement, framing[0] as HTMLElement)).toBe(true);
  });
});

// ---------- block 6: 50 seats ----------

const meterIn = (container: ParentNode): HTMLElement => only(container, '[data-seat-meter]');
const digitsIn = (text: string): string[] => text.match(/\d+/g) ?? [];

describe('#seats and the seat meter (PRD Block 6, design 5)', () => {
  it('shows the big 50 as decoration, then the heading, the body and a seat meter', () => {
    render(<App />);
    const block = section('seats');
    const bigNumbers = Array.from(block.querySelectorAll('p[aria-hidden="true"]')).filter(
      (element) => normalize(element.textContent) === String(settings.seats.total),
    );
    expect(bigNumbers).toHaveLength(1);
    expect(within(block).getByRole('heading', { level: 2, name: content.seats.heading })).toBeInTheDocument();
    expect(within(block).getByText(content.seats.body)).toBeInTheDocument();
    expect(meterIn(block)).toBeInTheDocument();
  });

  it('with the default settings, shows only "50 seats in batch one" in the meter and no seat count anywhere', () => {
    expect(settings.seats).toEqual({ total: 50, taken: null, show: false });
    render(<App />);
    const meter = meterIn(section('seats'));
    expect(normalize(meter.textContent)).toBe(content.seats.meterLabel);
    const allowedDigits = digitsIn(content.seats.meterLabel);
    expect(digitsIn(readableText(meter)).filter((digits) => !allowedDigits.includes(digits))).toEqual([]);
    expect(readableText(document.body)).not.toMatch(SEAT_COUNT);
  });

  it.each([
    { taken: null, show: false, when: 'taken is null and show is false' },
    { taken: 37, show: false, when: 'a real count exists but show is false' },
    { taken: null, show: true, when: 'show is true but taken is null' },
  ])('shows only the meter label, and no count, when $when', ({ taken, show }) => {
    render(<Seats seats={{ total: 50, taken, show }} />);
    const block = section('seats');
    expect(normalize(meterIn(block).textContent)).toBe(content.seats.meterLabel);
    const allowedDigits = digitsIn(content.seats.meterLabel);
    expect(digitsIn(readableText(meterIn(block))).filter((digits) => !allowedDigits.includes(digits))).toEqual([]);
    expect(readableText(block)).not.toContain('37');
    expect(readableText(block)).not.toMatch(SEAT_COUNT);
  });

  it.each([37, 0])('shows the real count (%i) once show is true and taken is a number', (taken) => {
    render(<Seats seats={{ total: 50, taken, show: true }} />);
    const meterText = normalize(meterIn(section('seats')).textContent);
    expect(meterText).toContain(normalize(content.seats.takenLabel(taken, 50)));
    expect(meterText).toContain(String(taken));
  });
});

// ---------- block 7: FAQ ----------

describe('#faq (PRD Block 7)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('is six native <details>: the question in the <summary>, the answer as a <p> in the same <details>', () => {
    const allDetails = Array.from(section('faq').querySelectorAll<HTMLElement>('details'));
    expect(allDetails).toHaveLength(6);
    content.faq.items.forEach((item, index) => {
      const details = allDetails[index] as HTMLElement;
      const summary = only(details, 'summary');
      expect(normalize(summary.textContent)).toBe(item.question);
      for (const icon of Array.from(summary.querySelectorAll('svg'))) {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
      }
      const answer = within(details).getByText(item.answer);
      expect(answer.tagName).toBe('P');
      expect(summary.contains(answer)).toBe(false);
    });
  });

  it('opens only the first question by default', () => {
    const open = Array.from(section('faq').querySelectorAll('details')).map((details) => details.hasAttribute('open'));
    expect(open).toEqual([true, false, false, false, false, false]);
  });
});

// ---------- block 8: close, and the footer ----------

describe('#close (PRD Block 8)', () => {
  it('shows its heading, body and a CTA', () => {
    render(<App />);
    const block = within(section('close'));
    expect(block.getByRole('heading', { level: 2, name: content.close.heading })).toBeInTheDocument();
    expect(block.getByText(content.close.body)).toBeInTheDocument();
    expect(block.getByRole('link', { name: content.cta.label })).toBeInTheDocument();
  });
});

type ContentModule = typeof import('../src/content');

/** Renders a freshly imported App against the content module with some values swapped. No file changes. */
async function renderAppWith(swap: (actual: ContentModule) => Partial<ContentModule>): Promise<void> {
  vi.resetModules();
  vi.doMock('../src/content', async (importOriginal) => {
    const actual = await importOriginal<ContentModule>();
    return { ...actual, ...swap(actual) };
  });
  const { default: FreshApp } = await import('../src/App');
  render(<FreshApp />);
}

function pageFooter(): HTMLElement {
  const footers = Array.from(document.querySelectorAll<HTMLElement>('footer')).filter((el) => !el.closest('main'));
  if (footers.length !== 1) throw new Error(`expected one page footer, found ${footers.length}`);
  return footers[0] as HTMLElement;
}

describe('the footer (PRD Block 8, open input 4)', () => {
  afterEach(() => {
    vi.doUnmock('../src/content');
    vi.resetModules();
  });

  it('shows only the wordmark while the footer line is empty', async () => {
    await renderAppWith((actual) => ({
      content: { ...actual.content, close: { ...actual.content.close, footerLine: '' } },
    }));
    expect(normalize(pageFooter().textContent)).toBe(content.nav.wordmark);
  });

  it('shows the footer line beside the wordmark once it is filled in', async () => {
    const line = 'Made for creators across India';
    await renderAppWith((actual) => ({
      content: { ...actual.content, close: { ...actual.content.close, footerLine: line } },
    }));
    const footer = within(pageFooter());
    expect(footer.getByText(content.nav.wordmark)).toBeInTheDocument();
    expect(footer.getByText(line)).toBeInTheDocument();
  });
});

describe('the WhatsApp fallback once it is switched on', () => {
  afterEach(() => {
    vi.doUnmock('../src/content');
    vi.resetModules();
  });

  it('adds "Or message us on WhatsApp" links to wa.me that open safely in a new tab, and keeps both CTAs', async () => {
    await renderAppWith((actual) => ({
      settings: { ...actual.settings, whatsapp: { enabled: true, number: '919800000000', message: "Hi, I'm in" } },
    }));
    const links = screen.getAllByRole('link', { name: 'Or message us on WhatsApp' });
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.getAttribute('href')).toBe("https://wa.me/919800000000?text=Hi%2C%20I'm%20in");
      expect(link.getAttribute('target')).toBe('_blank');
      expect((link.getAttribute('rel') ?? '').split(/\s+/).filter(Boolean).sort()).toEqual(['noopener', 'noreferrer']);
    }
    expect(screen.getAllByRole('link', { name: content.cta.label })).toHaveLength(2);
  });
});

// ---------- honesty on the rendered page ----------

describe('honesty on the rendered page (PRD 2.4, design 5)', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('never shows a number next to "points" or "pts", in text or accessible attributes', () => {
    expect(readableText(document.body)).not.toMatch(NUMBER_NEXT_TO_POINTS);
  });

  it('shows no digits anywhere in #how-you-earn, so no point value can appear there', () => {
    expect(readableText(section('how-you-earn'))).not.toMatch(/\d/);
  });

  it('frames the ₹ figure as an example inside the very sentence it appears in', () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const moneyBlocks: Element[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || !MONEY.test(node.textContent ?? '')) continue;
      moneyBlocks.push(parent.closest('p, li, dd, td, blockquote, figcaption, h1, h2, h3, h4, h5, h6') ?? parent);
    }
    expect(moneyBlocks.length).toBeGreaterThan(0);
    for (const block of moneyBlocks) {
      const moneySentences = sentencesOf(normalize(block.textContent)).filter((sentence) => MONEY.test(sentence));
      expect(moneySentences.length).toBeGreaterThan(0);
      for (const sentence of moneySentences) expect(sentence).toMatch(EXAMPLE_FRAMING);
    }
  });

  it('says "That\'s an illustration, not a rate card" in the long game', () => {
    expect(normalize(section('long-game').textContent)).toContain("That's an illustration, not a rate card");
  });

  it('frames the long game, and the answer to "Is this paid right now?", as "plan, not a contract"', () => {
    const framing = byFullText(section('long-game'), content.longGame.framing);
    expect(normalize(framing[0]?.textContent)).toContain('plan, not a contract');
    const paid = Array.from(section('faq').querySelectorAll('details')).find(
      (details) => normalize(details.querySelector('summary')?.textContent) === 'Is this paid right now?',
    );
    expect(normalize(paid?.textContent)).toContain('plan, not a contract');
  });

  it('labels every sample take a sample: the hero card, every marquee card, and the hidden list', () => {
    expect(within(only(section('hero'), 'article')).getByText('sample take')).toBeInTheDocument();
    const cards = Array.from(only(section('what-riffi-is'), '[data-marquee]').querySelectorAll<HTMLElement>('article'));
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) expect(within(card).getByText('sample take')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Sample takes' })).toBeInTheDocument();
  });

  it('uses no countdown, deadline or urgency language, and no timer', () => {
    expect(readableText(document.body)).not.toMatch(URGENCY);
    expect(document.querySelectorAll('[role="timer"]')).toHaveLength(0);
  });

  it('never shows the old spelling "Rifii", in text or attributes', () => {
    expect(document.body.innerHTML).not.toMatch(/rifii/i);
  });

  it('never shows a [FILL marker to a creator', () => {
    expect(document.body.innerHTML).not.toMatch(/\[\s*FILL\b/i);
  });
});

// ---------- before any JavaScript runs ----------

describe('the pre-rendered HTML, before any JavaScript runs (design 2 and 3)', () => {
  it('already holds the headline, both CTAs as plain links, the final vote count, the meter label and the first FAQ open', () => {
    const doc = new DOMParser().parseFromString(renderToString(<App />), 'text/html');
    const h1s = doc.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    const spanTexts = Array.from(h1s[0]?.querySelectorAll('span') ?? []).map((span) => normalize(span.textContent));
    for (const line of content.hero.titleLines) expect(spanTexts).toContain(line);
    const ctas = Array.from(doc.querySelectorAll('a')).filter((link) => normalize(link.textContent) === content.cta.label);
    expect(ctas.map((link) => link.getAttribute('href'))).toEqual([ctaHref, ctaHref]);
    expect(byFullText(doc.body, '2,140 votes')).toHaveLength(1);
    expect(normalize(doc.querySelector('[data-seat-meter]')?.textContent)).toBe(content.seats.meterLabel);
    expect(Array.from(doc.querySelectorAll('details')).map((details) => details.hasAttribute('open'))).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
    ]);
  });
});
```

`tests/copy-source.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../src/App';
import { content, settings } from '../src/content';

/** Every string anywhere inside `content`, including inside arrays and nested objects. */
function strings(value: unknown, into: Set<string>): Set<string> {
  if (typeof value === 'string') into.add(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, into));
  else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => strings(item, into));
  }
  return into;
}

describe('where the words come from (PRD 5.2, rule 2)', () => {
  it('renders no text and no accessible label that does not come from content.ts', () => {
    const allowed = strings(content, new Set<string>());
    const { sampleTake } = content.hero;
    // Values the page formats from content and settings rather than copying.
    allowed.add(String(settings.seats.total));
    allowed.add(`${sampleTake.agree.percent}%`);
    allowed.add(`${sampleTake.disagree.percent}%`);
    allowed.add(`${sampleTake.votes.toLocaleString('en-IN')} ${sampleTake.votesLabel}`);

    const { container } = render(<App />);
    const stray: string[] = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent?.trim() ?? '';
      if (text && !allowed.has(text)) stray.push(text);
    }
    for (const element of container.querySelectorAll('[aria-label], [alt], [title], [placeholder]')) {
      for (const name of ['aria-label', 'alt', 'title', 'placeholder']) {
        const value = element.getAttribute(name);
        if (value && !allowed.has(value)) stray.push(`${name}="${value}"`);
      }
    }
    expect(stray).toEqual([]);
  });
});
```

Replace the whole of `tests/prerender.test.ts` with:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { render, siteUrl } from '../src/entry-server';
import { content, settings } from '../src/content';
import { ctaHref } from '../src/lib/cta';

const html = render();

/** The form a string takes in React's server output. */
function escaped(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');
}

function count(needle: string): number {
  return html.split(needle).length - 1;
}

describe('the pre-rendered page (design option A)', () => {
  it('renders the page landmarks to HTML without a browser', () => {
    expect(html).toContain('<header');
    expect(html).toContain('<main id="main"');
    expect(html).toContain('<footer');
  });

  it('exposes the site URL the link-preview card needs, as a bare https domain', () => {
    expect(siteUrl).toMatch(/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i);
  });

  it('has every heading, both buttons and every FAQ answer before any script runs', () => {
    const headings = [
      ...content.hero.titleLines,
      content.whatRiffiIs.heading,
      content.whyHere.heading,
      content.howYouEarn.heading,
      content.longGame.heading,
      content.seats.heading,
      content.faq.heading,
      content.close.heading,
    ];
    for (const text of headings) expect(html).toContain(escaped(text));
    for (const item of content.faq.items) expect(html).toContain(escaped(item.answer));
    expect(count(`href="${ctaHref}"`)).toBe(2);
    expect(count(escaped(content.cta.helper))).toBe(2);
  });

  it('works the FAQ without JavaScript: six native disclosures, the first one open', () => {
    expect(count('<details')).toBe(6);
    expect(count('<details open=""')).toBe(1);
  });

  it('draws every poll bar at its final split in the HTML', () => {
    const { instagram, riffi } = settings.comparisonSplit;
    const riffiShare = Math.round((riffi / (instagram + riffi)) * 100);
    expect(html).toContain('--fill:71%');
    expect(count(`--fill:${riffiShare}%`)).toBe(content.whyHere.rows.length);
    expect(html).not.toContain('data-in-view="true"');
  });

  it("shows the sample take's vote count in the HTML", () => {
    expect(html).toContain(escaped(`2,140 ${content.hero.sampleTake.votesLabel}`));
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

Run: `npm test -- tests/page.test.tsx tests/prerender.test.ts tests/copy-source.test.tsx`
Expected: FAIL - the page test cannot find the sections (the shell renders empty landmarks), and the pre-render test finds no headings. The copy-source test already passes (the shell renders no text) and must keep passing.

- [ ] **Step 3: Write the header, hero, "what Riffi is" and "why here" blocks**

`src/components/blocks/Nav.tsx`:

```tsx
import { content } from '../../content';
import { Chip } from '../primitives/Chip';
import { Wordmark } from '../primitives/Wordmark';

/** Wordmark left, the batch chip right; sticky from desktop up, with a hairline once scrolled (Block 1). */
export function Nav() {
  return (
    <header className="nav top-0 z-10 bg-paper lg:sticky">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-4 md:px-8 lg:px-10">
        <Wordmark />
        <Chip tone="blue">{content.nav.batch}</Chip>
      </div>
    </header>
  );
}
```

`src/components/blocks/Hero.tsx`:

```tsx
import { content } from '../../content';
import { useCountUp } from '../../hooks/useCountUp';
import { CtaButton } from '../primitives/CtaButton';
import { PollBar } from '../primitives/PollBar';
import { Section } from '../primitives/Section';
import { TakeCard } from '../primitives/TakeCard';

/** The tick starts once the sample poll has filled: a 420ms delay plus the 900ms fill. */
const COUNT_START_MS = 1320;
const COUNT_DURATION_MS = 600;

/** Block 1: what this is and the offer, inside five seconds - and the page's one showpiece motion. */
export function Hero() {
  const { titleLines, subline, sampleTake } = content.hero;
  const votes = useCountUp(sampleTake.votes, COUNT_START_MS, COUNT_DURATION_MS);

  return (
    <Section id="hero" tone="paper">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <h1 id="hero-heading" className="hero-title font-display text-display-xl font-extrabold">
            <span className="hero-line block">{titleLines[0]}</span>{' '}
            <span className="hero-line block">{titleLines[1]}</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-body-l text-ink-soft">{subline}</p>
          <div className="mt-8">
            <CtaButton variant="dark" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <TakeCard chip={sampleTake.chip} text={sampleTake.text} featured>
            <div className="mt-6">
              <PollBar
                variant="sample"
                showPercent
                left={{
                  label: sampleTake.agree.label,
                  value: `${sampleTake.agree.percent}%`,
                  weight: sampleTake.agree.percent,
                }}
                right={{
                  label: sampleTake.disagree.label,
                  value: `${sampleTake.disagree.percent}%`,
                  weight: sampleTake.disagree.percent,
                }}
              />
            </div>
            <p className="vote-count mt-4 text-meta text-take">
              {/* One text node, so the server HTML reads "2,140 votes" with no React text separators. */}
              {`${votes.toLocaleString('en-IN')} ${sampleTake.votesLabel}`}
            </p>
          </TakeCard>
        </div>
      </div>
    </Section>
  );
}
```

`src/components/blocks/WhatRiffiIs.tsx`:

```tsx
import { content } from '../../content';
import { Chip, type ChipTone } from '../primitives/Chip';
import { Section } from '../primitives/Section';
import { TakeCard } from '../primitives/TakeCard';

/** Category chips cycle through the three chip colours (PRD Block 2). */
const CATEGORY_TONES: readonly ChipTone[] = ['blue', 'butter', 'coral'];

/** Block 2: make "a take" concrete, so a creator knows exactly what they would post. */
export function WhatRiffiIs() {
  const block = content.whatRiffiIs;
  return (
    <Section id="what-riffi-is" tone="recess" belowFold>
      <h2 id="what-riffi-is-heading" className="font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <p className="mt-5 max-w-[34rem] text-body-l text-ink-soft">{block.lead}</p>

      <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
        {[
          { side: block.notTake, tone: 'coral' as const },
          { side: block.take, tone: 'blue' as const },
        ].map(({ side, tone }) => (
          <div key={side.chip} className="border-t border-hairline pt-5">
            <Chip tone={tone}>{side.chip}</Chip>
            <p className="mt-4 font-display text-display-m font-bold text-ink">{side.text}</p>
            <p className="mt-3 text-body text-ink-soft">{side.caption}</p>
          </div>
        ))}
      </div>

      <ul className="mt-10 flex flex-wrap gap-2">
        {block.categories.map((category, index) => (
          <li key={category}>
            <Chip tone={CATEGORY_TONES[index % CATEGORY_TONES.length]}>{category}</Chip>
          </li>
        ))}
      </ul>

      <div data-marquee aria-hidden="true" className="marquee mt-12">
        <div className="marquee-track">
          {[...block.marqueeTakes, ...block.marqueeTakes].map((take, index) => (
            <div key={`${index}-${take}`} className="marquee-item">
              <TakeCard chip={block.marqueeChip} text={take} />
            </div>
          ))}
        </div>
      </div>
      <ul aria-label={block.marqueeLabel} className="sr-only">
        {block.marqueeTakes.map((take) => (
          <li key={take}>{take}</li>
        ))}
      </ul>
    </Section>
  );
}
```

`src/components/blocks/WhyHere.tsx`:

```tsx
import { content, settings } from '../../content';
import { PollBar } from '../primitives/PollBar';
import { Section } from '../primitives/Section';

/** Block 3: the emotional core. Each comparison is itself a vote, Instagram against Riffi. */
export function WhyHere() {
  const block = content.whyHere;
  const split = settings.comparisonSplit;
  return (
    <Section id="why-here" tone="paper" belowFold>
      <h2 id="why-here-heading" className="font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <div className="mt-10 grid gap-10">
        {block.rows.map((row, index) => (
          <div key={row.label}>
            <p className="mb-3 text-body-l font-semibold text-ink">{row.label}</p>
            <PollBar
              variant="comparison"
              animateOnView
              fill="right"
              index={index}
              left={{ label: block.instagramLabel, value: row.instagram, weight: split.instagram }}
              right={{ label: block.riffiLabel, value: row.riffi, weight: split.riffi }}
            />
          </div>
        ))}
      </div>
      <p className="my-12 max-w-[40rem] font-display text-display-m font-bold">{block.closer}</p>
    </Section>
  );
}
```

- [ ] **Step 4: Write the "how you earn", "long game", seats, FAQ, close and footer blocks**

`src/components/blocks/HowYouEarn.tsx`:

```tsx
import { content } from '../../content';
import { Section } from '../primitives/Section';

/** Block 4: earning starts at post one - what earns points, never how many (PRD 2.4). */
export function HowYouEarn() {
  const block = content.howYouEarn;
  return (
    <Section id="how-you-earn" tone="recess" belowFold>
      <h2 id="how-you-earn-heading" className="font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
        {block.rows.map((row) => (
          <li
            key={row.action}
            className="flex flex-col gap-3 py-5 md:flex-row md:items-start md:justify-between md:gap-6"
          >
            <div className="max-w-[34rem]">
              <p className="text-body-l font-semibold text-ink">{row.action}</p>
              <p className="mt-1 text-body text-ink-soft">{row.description}</p>
            </div>
            <span className="self-start rounded-pill bg-paper px-3 py-1 text-meta font-medium text-ink-soft">
              {block.pill}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-[34rem] text-meta text-ink-soft">{block.note}</p>
    </Section>
  );
}
```

`src/components/blocks/LongGame.tsx`:

```tsx
import { content } from '../../content';
import { Section } from '../primitives/Section';

/** Block 5: what this turns into, without overpromising - a plan, not a contract. */
export function LongGame() {
  const block = content.longGame;
  return (
    <Section id="long-game" tone="paper" belowFold>
      <h2 id="long-game-heading" className="font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <div className="mt-10 grid gap-10">
        {block.items.map((item) => (
          <div key={item.title} className="max-w-[34rem]">
            <h3 className="font-display text-display-m font-bold">{item.title}</h3>
            <p className="mt-3 text-body text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-12 max-w-[34rem] border-t border-hairline pt-6 text-body text-ink-soft">
        {block.framing}
      </p>
    </Section>
  );
}
```

`src/components/blocks/Seats.tsx`:

```tsx
import { content, type Settings } from '../../content';
import { PollBar } from '../primitives/PollBar';
import { Section } from '../primitives/Section';

type SeatsProps = { seats: Settings['seats'] };

/** Block 6: the commitment and the scarcity in one breath - and never an invented number (PRD 2.4). */
export function Seats({ seats }: SeatsProps) {
  const block = content.seats;
  const taken = seats.show && seats.taken !== null ? seats.taken : null;
  return (
    <Section id="seats" tone="recess" belowFold>
      <p aria-hidden="true" className="seats-number font-display font-extrabold text-ink">
        {String(seats.total)}
      </p>
      <h2 id="seats-heading" className="mt-2 font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <p className="mt-5 max-w-[34rem] text-body text-ink-soft">{block.body}</p>
      <div data-seat-meter className="mt-10 max-w-[34rem]">
        <PollBar
          variant="meter"
          animateOnView
          left={{ label: '', value: '', weight: taken ?? 0 }}
          right={{ label: '', value: '', weight: seats.total - (taken ?? 0) }}
        />
        <p className="mt-3 text-meta text-ink-soft">
          {taken === null ? block.meterLabel : block.takenLabel(taken, seats.total)}
        </p>
      </div>
    </Section>
  );
}
```

`src/components/blocks/Faq.tsx`:

```tsx
import { Plus } from 'lucide-react';
import { content } from '../../content';
import { Section } from '../primitives/Section';

/** Block 7: clear the last small doubts - native disclosures, the first one open (PRD Block 7). */
export function Faq() {
  const block = content.faq;
  return (
    <Section id="faq" tone="paper" belowFold>
      <h2 id="faq-heading" className="font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <div className="faq mt-10 max-w-[44rem] border-t border-hairline">
        {block.items.map((item, index) => (
          <details key={item.question} open={index === 0} className="border-b border-hairline">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-4 text-body-l font-semibold text-ink">
              {item.question}
              <Plus aria-hidden="true" className="faq-icon size-5 shrink-0" />
            </summary>
            <p className="max-w-[34rem] pb-5 text-body text-ink-soft">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
```

`src/components/blocks/Close.tsx`:

```tsx
import { content } from '../../content';
import { CtaButton } from '../primitives/CtaButton';
import { Section } from '../primitives/Section';

/** Block 8: the decision. The only inverted section; the page ends where the button has been all along. */
export function Close() {
  const block = content.close;
  return (
    <Section id="close" tone="ink" belowFold>
      <h2 id="close-heading" className="font-display text-display-l font-bold text-paper">
        {block.heading}
      </h2>
      <p className="mt-5 max-w-[34rem] text-body-l text-on-ink-body">{block.body}</p>
      <div className="mt-8">
        <CtaButton variant="light" />
      </div>
    </Section>
  );
}
```

`src/components/blocks/Footer.tsx`:

```tsx
import { content } from '../../content';
import { Wordmark } from '../primitives/Wordmark';

/** The footer row: the wordmark, and the legal / contact line once the founder supplies it (PRD 8). */
export function Footer() {
  const { footerLine } = content.close;
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-4 px-5 pb-10 md:px-8 lg:px-10">
        <Wordmark small />
        {footerLine ? <p className="text-meta text-on-ink-meta">{footerLine}</p> : null}
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Compose the page in `src/App.tsx`**

Replace the whole file with:

```tsx
import { useEffect } from 'react';
import { Close } from './components/blocks/Close';
import { Faq } from './components/blocks/Faq';
import { Footer } from './components/blocks/Footer';
import { Hero } from './components/blocks/Hero';
import { HowYouEarn } from './components/blocks/HowYouEarn';
import { LongGame } from './components/blocks/LongGame';
import { Nav } from './components/blocks/Nav';
import { Seats } from './components/blocks/Seats';
import { WhatRiffiIs } from './components/blocks/WhatRiffiIs';
import { WhyHere } from './components/blocks/WhyHere';
import { settings } from './content';

/** The page: the eight blocks in the order a creator's objections come up (PRD 2.2) - nothing else. */
export default function App() {
  useEffect(() => {
    // Hydration is done, so scroll reveals may wait for the reader. After 6 seconds the CSS failsafe
    // has already filled the bars, so leave it in charge rather than empty them again.
    if (performance.now() < 6000) document.documentElement.classList.add('app-ready');
  }, []);

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <WhatRiffiIs />
        <WhyHere />
        <HowYouEarn />
        <LongGame />
        <Seats seats={settings.seats} />
        <Faq />
        <Close />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Append the blocks' CSS to `src/styles/global.css`**

```css
@layer components {
  /* The header's hairline appears once the page scrolls, where the browser supports scroll timelines. */
  @keyframes nav-hairline {
    to {
      box-shadow: 0 1px 0 var(--hairline);
    }
  }

  @media (min-width: 64rem) {
    @supports (animation-timeline: scroll()) {
      .nav {
        animation: nav-hairline linear both;
        animation-timeline: scroll();
        animation-range: 0 48px;
      }
    }

    @supports not (animation-timeline: scroll()) {
      .nav {
        box-shadow: 0 1px 0 var(--hairline);
      }
    }
  }

  /* The headline is pushed toward the expanded end of the display face's width axis (PRD 3.3).
     115% keeps "On Instagram" on one line in the desktop text column. */
  .hero-title {
    font-stretch: 115%;
  }

  /* Motion moment 1 (PRD 3.5): the headline lines rise in sequence. Transform only, so the
     headline is never invisible and LCP is not delayed. */
  @keyframes hero-rise {
    from {
      transform: translateY(0.32em);
    }
  }

  .hero-line {
    animation: hero-rise 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .hero-line + .hero-line {
    animation-delay: 60ms;
  }

  /* The vote count appears once the sample poll has filled; JavaScript ticks its number up. */
  @keyframes vote-count-in {
    from {
      opacity: 0;
    }
  }

  .vote-count {
    animation: vote-count-in 240ms ease-out 1320ms both;
  }

  /* The marquee: one CSS-animated row, repeated once so the loop has no seam (PRD Block 2).
     Items carry their own spacing, so exactly half the track is one full set. */
  .marquee {
    overflow: hidden;
  }

  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee-scroll 60s linear infinite;
  }

  .marquee-item {
    width: 18rem;
    flex: none;
    padding-inline-end: 1rem;
  }

  .marquee:hover .marquee-track {
    animation-play-state: paused;
  }

  @keyframes marquee-scroll {
    to {
      transform: translateX(-50%);
    }
  }

  /* The one moment of pure typographic scale on the page (PRD Block 6). */
  .seats-number {
    font-size: clamp(96px, 22vw, 200px);
    font-stretch: 125%;
    line-height: 0.9;
    letter-spacing: -0.03em;
  }

  /* FAQ: native disclosures with the marker replaced by a rotating plus. */
  .faq summary::-webkit-details-marker {
    display: none;
  }

  .faq-icon {
    transition: rotate 200ms ease-out;
  }

  .faq details[open] .faq-icon {
    rotate: 45deg;
  }

  /* The answer's height animates where the browser supports it; elsewhere it simply appears. */
  @supports (interpolate-size: allow-keywords) {
    .faq details {
      interpolate-size: allow-keywords;
    }

    .faq details::details-content {
      block-size: 0;
      overflow: clip;
      transition:
        block-size 240ms ease-out,
        content-visibility 240ms allow-discrete;
    }

    .faq details[open]::details-content {
      block-size: auto;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-line,
    .vote-count,
    .marquee-track {
      animation: none;
    }

    @media (min-width: 64rem) {
      .nav {
        animation: none;
        box-shadow: 0 1px 0 var(--hairline);
      }
    }

    .faq-icon,
    .faq details::details-content {
      transition: none;
    }
  }
}
```

- [ ] **Step 7: Run the tests to confirm they pass**

Run: `npm test`
Expected: PASS - `Test Files  11 passed (11)`.

- [ ] **Step 8: Run typecheck, lint and the build**

Run: `npm run typecheck && npm run lint && npm run build && echo "checks ok"`
Expected: `checks ok`, after the build prints `prerender: wrote dist/index.html with 2 font preload(s)`. Lint must report no `no-restricted-syntax` error: every visible string comes from `content.ts`.

- [ ] **Step 9: Commit**

```bash
git add src/components/blocks src/App.tsx src/styles/global.css tests/page.test.tsx tests/prerender.test.ts
git commit -m "feat: the eight blocks and the full page" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: The link-preview card and the icons

User job: Instagram shows the preview card inside the DM before the page ever opens, so the card itself has to make the offer.

**Files:**
- Create: `scripts/make-images.mjs`, `public/og.png` (generated), `public/apple-touch-icon.png` (generated), `public/favicon.svg` (generated)
- Test: `tests/images.test.ts`

**Interfaces:**
- Consumes: `content` from `src/content.ts` (imported directly by Node 24's TypeScript type stripping); the tokens in `src/styles/tokens.css`; Microsoft Edge (override with `EDGE_PATH`).
- Produces: `npm run images` writes `public/og.png` (1200×630), `public/apple-touch-icon.png` (180×180) and `public/favicon.svg` (32×32 viewBox).

- [ ] **Step 1: Write the failing test**

`tests/images.test.ts`:

```ts
// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function pngSize(file: string): { width: number; height: number } {
  const bytes = readFileSync(file);
  expect(bytes.subarray(1, 4).toString('latin1')).toBe('PNG');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe('the link-preview card and icons (PRD 5.6)', () => {
  it('has a 1200x630 preview card', () => {
    expect(pngSize('public/og.png')).toEqual({ width: 1200, height: 630 });
  });

  it('keeps the preview card light enough to load quickly inside a DM', () => {
    expect(readFileSync('public/og.png').length).toBeLessThan(300_000);
  });

  it('has a 180x180 apple touch icon', () => {
    expect(pngSize('public/apple-touch-icon.png')).toEqual({ width: 180, height: 180 });
  });

  it('has an SVG favicon', () => {
    expect(readFileSync('public/favicon.svg', 'utf8')).toMatch(/^<svg[^>]+viewBox="0 0 32 32"/);
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `npm test -- tests/images.test.ts`
Expected: FAIL - `ENOENT: no such file or directory, open 'public/og.png'`.

- [ ] **Step 3: Write `scripts/make-images.mjs`**

```js
// Renders the link-preview card (public/og.png, 1200x630), the apple touch icon (180x180) and the SVG
// favicon from the page's own tokens and copy, using the Microsoft Edge already on this laptop.
// Usage: npm run images   (set EDGE_PATH to use another Chromium-based browser)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { content } from '../src/content.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const tokensCss = readFileSync(path.join(root, 'src', 'styles', 'tokens.css'), 'utf8');
const edge =
  process.env.EDGE_PATH ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const work = mkdtempSync(path.join(tmpdir(), 'riffi-images-'));

/** tokens.css with its Fontsource URLs pointed at node_modules, so a file:// page can load the fonts. */
const tokensForFilePage = tokensCss.replaceAll(
  /url\('(@fontsource-variable\/[^']+)'\)/g,
  (_match, specifier) => `url('${pathToFileURL(path.join(root, 'node_modules', specifier)).href}')`,
);

function token(name) {
  const match = tokensCss.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`images: ${name} is not defined in tokens.css`);
  return match[1];
}

function escapeHtml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function page(body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${tokensForFilePage}
html, body { margin: 0; }
</style></head><body>${body}</body></html>`;
}

function screenshot(name, body, width, height) {
  const htmlFile = path.join(work, `${name}.html`);
  const output = path.join(publicDir, name);
  writeFileSync(htmlFile, page(body));
  // Remove the old image first, so a failed render can never pass off a stale card as new.
  rmSync(output, { force: true });
  execFileSync(
    edge,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      // Lets the file:// card page load the self-hosted fonts from node_modules.
      '--allow-file-access-from-files',
      // A fresh profile per screenshot: Edge started on a profile another Edge still holds exits without one.
      `--user-data-dir=${path.join(work, `profile-${name}`)}`,
      `--window-size=${width},${height}`,
      '--virtual-time-budget=4000',
      `--screenshot=${output}`,
      pathToFileURL(htmlFile).href,
    ],
    { stdio: 'ignore', timeout: 90_000 },
  );
  if (!existsSync(output)) throw new Error(`images: Edge did not write public/${name}`);
  console.log(`images: wrote public/${name} (${statSync(output).size} bytes)`);
}

mkdirSync(publicDir, { recursive: true });

const [lineOne, lineTwo] = content.hero.titleLines;
const agree = content.hero.sampleTake.agree.percent;

// PRD 5.6: white ground, the wordmark, the one-of-50 line, one poll bar at 71/29.
screenshot(
  'og.png',
  `<div style="box-sizing:border-box;width:1200px;height:630px;padding:64px 80px;display:flex;flex-direction:column;justify-content:space-between;background:var(--paper);color:var(--ink)">
    <div style="font-family:var(--typeface-display);font-weight:800;font-size:44px;line-height:1">${escapeHtml(content.nav.wordmark)}</div>
    <div style="font-family:var(--typeface-display);font-weight:800;font-stretch:125%;font-size:64px;line-height:1;letter-spacing:-0.03em">
      <div>${escapeHtml(lineOne)}</div><div>${escapeHtml(lineTwo)}</div>
    </div>
    <div style="display:flex;height:52px;overflow:hidden;border-radius:var(--corner-pill);background:var(--chip-coral-bg)">
      <div style="width:${agree}%;background:var(--signal)"></div>
    </div>
  </div>`,
  1200,
  630,
);

screenshot(
  'apple-touch-icon.png',
  `<div style="box-sizing:border-box;width:180px;height:180px;display:flex;align-items:center;justify-content:center;background:var(--ink);color:var(--paper);font-family:var(--typeface-display);font-weight:800;font-size:112px;line-height:1">${escapeHtml(content.nav.wordmark.charAt(0))}</div>`,
  180,
  180,
);

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${token('--ink')}"/><rect x="6" y="13" width="20" height="6" rx="3" fill="${token('--chip-coral-bg')}"/><rect x="6" y="13" width="14" height="6" rx="3" fill="${token('--signal')}"/><rect x="11" y="13" width="9" height="6" fill="${token('--signal')}"/></svg>\n`;
writeFileSync(path.join(publicDir, 'favicon.svg'), favicon);
console.log('images: wrote public/favicon.svg');
try {
  rmSync(work, { recursive: true, force: true });
} catch {
  // Edge can hold its profile for a moment after exiting; the system clears temp files later.
}
```

- [ ] **Step 4: Generate the images**

Run: `npm run images`
Expected (Node may also print an ExperimentalWarning about type stripping):

```
images: wrote public/og.png (<n> bytes)
images: wrote public/apple-touch-icon.png (<n> bytes)
images: wrote public/favicon.svg
```

- [ ] **Step 5: Look at the preview card**

Open `public/og.png` with the Read tool. Expected: white ground; "Riffi" at top left in Archivo; the two headline lines in expanded Archivo (not a fallback sans-serif); one blue-and-coral bar split about 71/29 along the bottom; nothing clipped. If the headline shows a fallback font, raise `--virtual-time-budget` to `8000` in Step 3 and repeat Step 4.

- [ ] **Step 6: Run the tests and the build**

Run: `npm test && npm run build && ls dist/og.png dist/apple-touch-icon.png dist/favicon.svg`
Expected: `Test Files  12 passed (12)`, the build succeeds, and all three files are listed.

- [ ] **Step 7: Commit**

```bash
git add scripts/make-images.mjs public/og.png public/apple-touch-icon.png public/favicon.svg tests/images.test.ts
git commit -m "feat: link-preview card, apple touch icon and favicon" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Budgets, output checks, CI and the audit

User job: before anyone sends the link, the page proves it is fast, accessible and unbreakable on the phone a creator actually uses.

**Files:**
- Create: `scripts/budget.mjs`, `scripts/check-dist.mjs`, `.claude/launch.json`
- Modify: `.gitignore`, `.github/workflows/ci.yml`, and whatever the audit shows must change
- Test: the existing suite; the checks in Steps 3 to 8 are recorded as evidence

**Interfaces:**
- Consumes: `dist/` from `npm run build`.
- Produces: `npm run budget` (exit 1 when over budget); `npm run check:dist` (exit 1 when the built page loads or links to anything unexpected); CI that builds the page and runs both; the `riffi-preview` launch configuration on port 4173; an audit record for Task 10.

Not verifiable on this laptop, because it needs the page online: the real Instagram in-app browser on iOS and Android, and the preview card inside a DM (PRD 10). Both stay on the pre-send list in `docs/implementation-plan.md` (items 7 and 11) and are not part of this task.

- [ ] **Step 1: Write `scripts/budget.mjs` and `scripts/check-dist.mjs`**

`scripts/budget.mjs`:

```js
// Budget check on the production build (PRD 7): JavaScript under 90KB gzipped, and the weight a visitor
// downloads - HTML, CSS, JavaScript, the two preloaded fonts and the favicon - under 400KB.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = 'dist';
const assets = readdirSync(path.join(dist, 'assets'));
const asset = (file) => path.join(dist, 'assets', file);
const gzipped = (file) => gzipSync(readFileSync(file), { level: 9 }).length;
const kb = (bytes) => `${(bytes / 1000).toFixed(1)}KB`;
const sum = (files, measure) => files.reduce((total, file) => total + measure(file), 0);

const js = sum(assets.filter((f) => f.endsWith('.js')).map(asset), gzipped);
const css = sum(assets.filter((f) => f.endsWith('.css')).map(asset), gzipped);
const fonts = sum(
  assets
    .filter((f) => /^(archivo-latin-wdth-normal|hanken-grotesk-latin-wght-normal)-.*\.woff2$/.test(f))
    .map(asset),
  (file) => readFileSync(file).length,
);
const html = gzipped(path.join(dist, 'index.html'));
const favicon = gzipped(path.join(dist, 'favicon.svg'));
const total = html + css + js + fonts + favicon;

console.log(`budget: JavaScript ${kb(js)} gzipped (limit 90KB)`);
console.log(
  `budget: page weight ${kb(total)} - HTML ${kb(html)}, CSS ${kb(css)}, JS ${kb(js)}, fonts ${kb(fonts)}, favicon ${kb(favicon)} (limit 400KB)`,
);

const failures = [];
if (js >= 90_000) failures.push('JavaScript is over 90KB gzipped');
if (total >= 400_000) failures.push('page weight is over 400KB');
if (failures.length > 0) {
  console.error(`budget: FAILED - ${failures.join('; ')}`);
  process.exit(1);
}
console.log('budget: within both limits');
```

`scripts/check-dist.mjs`:

```js
// Output check on the production build (PRD 5.4, 5.6, 7): the built page may load only its own files,
// may link out only to Instagram and WhatsApp, has no form, and points its preview card at a real URL.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const dist = 'dist';
const html = readFileSync(path.join(dist, 'index.html'), 'utf8');
const css = readdirSync(path.join(dist, 'assets'))
  .filter((file) => file.endsWith('.css'))
  .map((file) => readFileSync(path.join(dist, 'assets', file), 'utf8'))
  .join('\n');

const problems = [];
const ownFile = (url) => url.startsWith('/') && !url.startsWith('//');

for (const [, tag, url] of html.matchAll(
  /<(script|link|img|iframe|source|video|audio|embed|object)\b[^>]*?\s(?:src|href|data)="([^"]*)"/gi,
)) {
  if (!ownFile(url)) problems.push(`<${tag}> loads ${url} - only the page's own files may load`);
}
for (const [, url] of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/gi)) {
  if (!/^https:\/\/(?:ig\.me|wa\.me)\//.test(url)) {
    problems.push(`a link goes to ${url} - only Instagram and WhatsApp DMs are allowed`);
  }
}
for (const [, url] of css.matchAll(/url\(\s*['"]?([^'")\s]+)['"]?\s*\)/g)) {
  if (!ownFile(url) && !url.startsWith('data:')) {
    problems.push(`CSS loads ${url} - only the page's own files may load`);
  }
}
const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/);
if (!ogImage || !/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+\/og\.png$/i.test(ogImage[1])) {
  problems.push(`og:image is "${ogImage?.[1] ?? 'missing'}" - it must be the site URL followed by /og.png`);
}
if (/<form\b/i.test(html)) problems.push('the page contains a <form> - the only conversion is a DM link');

if (problems.length > 0) {
  console.error(`check:dist: ${problems.length} problem(s) in the built page:`);
  for (const problem of problems) console.error(problem);
  process.exit(1);
}
console.log('check:dist: the built page loads only its own files and links only to Instagram or WhatsApp');
```

- [ ] **Step 2: Build and check the budget**

Run: `npm run build && npm run budget && npm run check:dist`
Expected: `budget: within both limits`, then `check:dist: the built page loads only its own files and links only to Instagram or WhatsApp`. Record both measured numbers for Task 10. If a limit is exceeded, stop and report - do not remove features to fit.

- [ ] **Step 3: Add the preview server for the Browser pane, and ignore audit reports**

`.claude/launch.json`:

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "riffi-preview",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "preview", "--", "--port", "4173", "--strictPort"],
      "port": 4173
    }
  ]
}
```

In `.gitignore`, replace:

```
# Deploy tool state
.vercel/
```

with:

```
# Deploy tool state
.vercel/

# Audit reports
lighthouse-*.json
audit-*.png
```

`.github/workflows/ci.yml` is on the stop-and-ask list, so its two edits below are covered by the founder's approval like the other protected files.

In `.github/workflows/ci.yml`, replace:

```
      - name: Tests
        run: npm test
```

with:

```
      - name: Tests
        run: npm test
      - name: Build, budget and output check
        run: |
          npm run build
          npm run budget
          npm run check:dist
```

In `.github/workflows/ci.yml`, replace:

```
      - name: Changed files
        run: |
          git fetch origin "${{ github.base_ref }}" --depth=1
          git diff --name-only "origin/${{ github.base_ref }}...HEAD" > changed-files.txt
          echo "Changed files:" && cat changed-files.txt

      - name: Coverage on PR head
        run: |
          npm ci
          npm run coverage
          cp coverage/coverage-summary.json head-summary.json

      - name: Coverage on base branch
        run: |
          git stash --include-untracked || true
          git checkout "origin/${{ github.base_ref }}"
          npm ci
          npm run coverage || true
          cp coverage/coverage-summary.json base-summary.json || echo '{}' > base-summary.json
          git checkout -

      - name: Compare
        run: |
          node .github/scripts/zuko-coverage-check.mjs \
            --base base-summary.json \
            --head head-summary.json \
            --changed changed-files.txt
```

with:

```
      - name: Changed files
        run: |
          git fetch origin "${{ github.base_ref }}" --depth=1
          git diff --name-only "origin/${{ github.base_ref }}...HEAD" > "$RUNNER_TEMP/changed-files.txt"
          echo "Changed files:" && cat "$RUNNER_TEMP/changed-files.txt"

      - name: Coverage on PR head
        run: |
          npm ci
          npm run coverage
          cp coverage/coverage-summary.json "$RUNNER_TEMP/head-summary.json"

      - name: Coverage on base branch
        run: |
          git stash --include-untracked || true
          rm -rf coverage
          git checkout "origin/${{ github.base_ref }}"
          if [ -f package.json ]; then npm ci && (npm run coverage || true); fi
          cp coverage/coverage-summary.json "$RUNNER_TEMP/base-summary.json" || echo '{}' > "$RUNNER_TEMP/base-summary.json"
          git checkout -

      - name: Compare
        run: |
          node .github/scripts/zuko-coverage-check.mjs \
            --base "$RUNNER_TEMP/base-summary.json" \
            --head "$RUNNER_TEMP/head-summary.json" \
            --changed "$RUNNER_TEMP/changed-files.txt"
```

The first change makes CI build the page and run both output checks. The second repairs the coverage comparison, which as scaffolded checked nothing: its stash step swept the pull request's own coverage numbers and changed-file list out of the folder before the comparison read them, and the comparison treats missing files as "nothing changed", so every run passed with "0 changed file(s) checked". Those files now live in the runner's temp folder, outside the working tree. It also lets the comparison pass on the first pull request, when the base branch has no `package.json` yet, and removes the pull request's `coverage/` folder before switching branches, so it cannot be compared with itself.

- [ ] **Step 4: Check every width for overflow, and the hero button above the fold (controller, Browser pane)**

Start the preview with `preview_start` (`riffi-preview`). For each size 320×640, 360×640, 375×667, 390×844, 768×1024, 1440×900 and 1920×1080: `resize_window`, reload, scroll to the bottom and back, then run in `javascript_tool`:

```js
({
  overflow: document.documentElement.scrollWidth > window.innerWidth,
  heroButtonBottom: Math.round(document.querySelector('#hero a').getBoundingClientRect().bottom),
  viewportHeight: window.innerHeight,
})
```

Expected at every size: `overflow: false`. At 375×667: `heroButtonBottom` ≤ `667`. Take a screenshot at 320×640 and at 1440×900. Reset with `resize_window` preset `desktop` when done.

- [ ] **Step 5: Keyboard-only and greyscale passes (controller, Browser pane)**

Keyboard: click the page background, then press `Tab` repeatedly, running `document.activeElement.outerHTML.slice(0, 80)` after each press. Expected: focus reaches the hero "Claim a seat" link, each of the six FAQ `summary` elements and the closing "Claim a seat" link, in page order, with a visible blue ring in the screenshot. Pressing `Enter` on a closed `summary` opens it.

Greyscale: run `document.documentElement.style.filter = 'grayscale(1)'` and screenshot the hero and the comparison section. Expected: every poll value and label is still readable as text. Clear the filter afterwards.

Marquee seam: at 1440×900, run:

```js
(() => {
  const track = document.querySelector('.marquee-track');
  const items = [...track.children];
  const oneSet = items
    .slice(0, items.length / 2)
    .reduce((width, item) => width + item.getBoundingClientRect().width, 0);
  return { trackHalf: track.scrollWidth / 2, oneSet, seamless: Math.abs(track.scrollWidth / 2 - oneSet) < 1 };
})()
```

Expected: `seamless: true` - the animation's -50% shift lands exactly on the start of the repeated set.

- [ ] **Step 6: Reduced motion and JavaScript off (Edge headless)**

With the `riffi-preview` server from Step 4 still running on port 4173 (it serves files added to `dist/` after it started), run:

```bash
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
# Each run gets a fresh profile. "JavaScript off" is a copy of the built page with every script removed,
# because Edge's scriptEnabled=false setting stops headless screenshots from being written at all.
node -e "const fs=require('fs');fs.writeFileSync('dist/no-js.html',fs.readFileSync('dist/index.html','utf8').replace(/<script[\s\S]*?<\/script>/g,''))"
"$EDGE" --headless=new --disable-gpu --hide-scrollbars --no-first-run --user-data-dir="$(cygpath -w "$(mktemp -d)")" --force-prefers-reduced-motion --window-size=1280,2400 --virtual-time-budget=4000 --screenshot="$(pwd -W)/audit-reduced-motion.png" http://localhost:4173/
"$EDGE" --headless=new --disable-gpu --hide-scrollbars --no-first-run --user-data-dir="$(cygpath -w "$(mktemp -d)")" --window-size=1280,2400 --virtual-time-budget=4000 --screenshot="$(pwd -W)/audit-no-js.png" http://localhost:4173/no-js.html
node -e "require('fs').rmSync('dist/no-js.html')"
# Reduced motion must leave no animation running at all - not just finished ones.
node -e "const fs=require('fs');fs.writeFileSync('dist/motion-check.html','<!doctype html><iframe id=\"f\" src=\"/\" style=\"width:1280px;height:2400px\"></iframe><pre id=\"out\">waiting</pre><script>f.onload=()=>setTimeout(()=>{out.textContent=\"running-animations=\"+f.contentDocument.getAnimations().filter((a)=>a.playState===\"running\").length},200)</script>')"
"$EDGE" --headless=new --disable-gpu --no-first-run --user-data-dir="$(cygpath -w "$(mktemp -d)")" --force-prefers-reduced-motion --window-size=1280,2400 --virtual-time-budget=4000 --dump-dom http://localhost:4173/motion-check.html | grep -o 'running-animations=[0-9]*'
node -e "require('fs').rmSync('dist/motion-check.html')"
```

Open both PNGs with the Read tool. Expected in both: the full hero with the sample poll at its final split and "2,140 votes" visible, and the comparison bars full. The motion check must print `running-animations=0`. Delete both PNGs after recording what they showed. Narrow widths are checked in the Browser pane in Step 4, because Edge headless will not lay a page out narrower than about 500px.

- [ ] **Step 7: Lighthouse, mobile (Edge)**

With the same server still running, run:

```bash
CHROME_PATH="C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" npx --no lighthouse http://localhost:4173/ --only-categories=performance,accessibility,best-practices --output=json --output-path=./lighthouse-mobile.json --chrome-flags="--headless=new" --no-enable-error-reporting --quiet
node -e "const r=require('./lighthouse-mobile.json');const c=r.categories,a=r.audits;console.log({performance:c.performance.score,accessibility:c.accessibility.score,bestPractices:c['best-practices'].score,lcpMs:Math.round(a['largest-contentful-paint'].numericValue),cls:a['cumulative-layout-shift'].numericValue})"
```

Expected: `performance` ≥ 0.95, `accessibility` = 1, `bestPractices` ≥ 0.95, `lcpMs` < 2000, `cls` < 0.02. Lighthouse's default is mobile emulation with simulated 4G throttling.

- [ ] **Step 8: Fix what the audit found**

For each failure from Steps 2 and 4 to 7: find the cause, change the smallest thing that fixes it, and re-run the check that failed and then `npm test`. If the fix changes behaviour, write or extend a test first. If the fix needs a stop-and-ask file, stop and report to the controller. Record every finding and fix for Task 10.

- [ ] **Step 9: Commit**

```bash
git add scripts/budget.mjs scripts/check-dist.mjs .claude/launch.json .gitignore .github/workflows/ci.yml
git commit -m "chore: budget check, preview server and the audit" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

If Step 8 changed source files, add them to this commit.

---

### Task 10: Bring the living documents up to date

User job: whoever opens this project next - the founder, Zyra or an agent - can see what was built, how, and what is still open, without reading code.

**Files:**
- Modify: `docs/technical-spec.md`, `docs/implementation-plan.md`, `CLAUDE.md` (Part B architecture map - a stop-and-ask file needing its own founder approval)

**Interfaces:**
- Consumes: the finished page, and the numbers and findings recorded in Task 9.
- Produces: documents that match the code.

- [ ] **Step 1: Rewrite `docs/technical-spec.md` as-built**

Replace the "Status" section with the build date and "Built; not deployed". Replace "Stack (planned)" with "Stack" listing the exact versions from `package.json`. Add these sections, in this order, each a few plain sentences:
- **How the page is served** - the three build commands, `scripts/prerender.mjs`, the `__SITE_URL__` replacement, the two font preloads, hydration in `src/main.tsx`, and the `js` and `app-ready` classes.
- **The two rules, enforced** - the ESLint `no-restricted-syntax` rule for copy, `tests/brand-rules.test.ts` for brand values, and Tailwind's default palette and fonts removed in `global.css`.
- **Motion** - the hero rise, the CSS sample fill, the vote tick (`useCountUp` and its early-hydration rule), the scroll reveals (`useInView`, the 80ms stagger, the 6-second failsafe), the FAQ height animation in CSS where supported, and reduced motion.
- **Fonts** - Latin-only files, preloads, and the metric-matched fallbacks with their numbers.
- **Tests** - one line per test file, marking the five written by the independent test author.
- **Images** - `npm run images` and what it draws.
- **Before anything goes online** - `npm run release` (build, `check:dist`, `presend`), the `inputsConfirmed` checklist, and the rule that deploys use nothing else.
- **Budgets and audit** - the measured JS and page weight, the Lighthouse scores, LCP and CLS from Task 9, with the date.

Keep "Deploy" as not set up, and fill "Known limits": Edge must be at its default path or `EDGE_PATH` set; the ₹ sign renders in the phone's system font because the Latin subset has no ₹ glyph; the Roboto fallback depends on the phone exposing Roboto to `local()`; the header hairline appears on scroll only where scroll timelines are supported.

- [ ] **Step 2: Update `docs/implementation-plan.md`**

Set "Last updated" to the finish date. In "Where things stand", move the page to "Done" and set "In flight" to the Task 11 decision. Mark build steps 1 to 9 "Done" in the table. Append to the drift log, one row each, writing the date this task runs (for example `15 Sep 2026`) wherever `(date)` appears:

| Date | PRD said | Build does | Why |
|---|---|---|---|
| (date) | `--chip-coral-ink: #C0392B` | `#BC382A` | 4.47:1 on `--chip-coral-bg` fails WCAG AA for chip text; 2% darker passes at 4.62:1. |
| (date) | Poll labels inside the fill when there is room (5.5) | Values and labels sit in a legend under every bar | They never fit inside at 320px, and one legend keeps every value as plain text. |
| (date) | Comparison bar sides unspecified | Instagram on the left in coral, Riffi on the right in blue (the fill grows from the right) | Matches the table's reading order, Instagram then Riffi. |
| (date) | FAQ height animated (design: in JavaScript) | Animated in CSS where the browser supports it; otherwise the answer simply appears | No script needed; the FAQ works without JavaScript. |
| (date) | No WhatsApp label copy | "Or message us on WhatsApp" (shown only if the fallback is switched on) | The optional fallback needs a label. |
| (date) | Footer row inside Block 8 | A separate `<footer>` landmark after `<main>` | A proper landmark for assistive technology. |
| (date) | Preview card: one poll bar at 71/29 | The bar without numbers or labels | A bare graphic makes no claim that could read as real data. |
| (date) | React 19.3.0, lucide-react 1.46.0 and other just-released versions | The newest versions published at least 7 days before approval, installed with `--before` and no install scripts | Supply-chain safety: a fresh release has had no time for a bad publish to be caught. |
| (date) | Placeholders marked in comments only | Also an `inputsConfirmed` checklist in `settings`, checked by `npm run presend`; the page goes online only through `npm run release` | Deleting a comment is not an answer, and the check runs on every deploy. |
| (date) | The width axis "pushed to expanded" on the largest lines | The headline at 115% width; the big 50 at 125% | At 125%, "On Instagram" breaks onto two lines in the desktop column. |
| (date) | No output checks | `npm run check:dist`, and a test that every rendered string comes from `content.ts` | The safety review showed the lint rule alone can be bypassed. |
| (date) | The coverage comparison as scaffolded | Its files kept in the runner's temp folder; a base branch without `package.json` allowed | As scaffolded, the stash step removed the files before the comparison read them, so it silently checked nothing. |

Add one row per audit fix recorded in Task 9 Step 8.

- [ ] **Step 3: Update the architecture map in `CLAUDE.md` (controller, after founder approval)**

This file is on the stop-and-ask list. The controller explains the change to the founder in plain words, records the approval with `node .zuko/approve.js --files "CLAUDE.md"`, then, in Part B, replaces the line `_Planned from the PRD (section 5.3) - nothing is built yet. This map becomes as-built as each build step lands._` with `_As built on (date)._` (writing the date this task runs), adds `Footer` to the blocks line, and adds `scripts/` and `public/` lines matching the File Structure in this plan. Clear the approval afterwards with `node .zuko/approve.js --clear`.

- [ ] **Step 4: Commit**

```bash
git add docs/technical-spec.md docs/implementation-plan.md CLAUDE.md
git commit -m "docs: technical spec and implementation plan as built" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11: Self-critique and "cut one thing" - the founder's decision

User job: the page ships leaner, exactly as the PRD's last build step asks, with the founder choosing what goes.

**Files:**
- Modify: depends on the founder's choice (see Step 3)

**Interfaces:**
- Consumes: the finished page and PRD 3.6.
- Produces: one cut, applied.

- [ ] **Step 1: Self-critique against PRD 3.6 (controller, Browser pane)**

At 390×844 and 1440×900, check each anti-pattern and record pass or fail with a screenshot: centred hero or gradient headline; identical cards with the same shadow everywhere; all-caps or tracked eyebrow labels; meta strings joined with middle dots; an arrow on button text; 01/02/03 markers on non-sequences; stock photos, 3D blobs or illustration packs; monospace labels; countdowns, spinning gradients or confetti; any Lorem ipsum. Also confirm the motion is only the three moments in Global Constraints.

- [ ] **Step 2: Put the choice to the founder (controller)**

Present the Step 1 findings, then the candidate cuts in plain words, with the recommendation first:
1. Cut the marquee - the contrast pair already shows what a take is, and an endlessly moving row is the hardest piece to keep calm and accessible.
2. Hide the seat meter until there is a real number - an empty bar can read as "nobody has joined".
3. Add "just say I'm in" to the helper line - the DM opens empty, and this removes the pause.
Ask the founder to pick one (or name something else).

- [ ] **Step 3: Apply the chosen cut**

- **Marquee:** delete the marquee `div` and the hidden list from `WhatRiffiIs.tsx`, delete `marqueeLabel`, `marqueeChip` and `marqueeTakes` from `content.ts`, and delete the marquee CSS. `src/content.ts` and `tests/page.test.tsx` are stop-and-ask files: the controller gets the founder's approval, and the independent test author updates the page test's marquee assertions.
- **Seat meter:** in `Seats.tsx`, render the meter `PollBar` only when `taken !== null`, keeping the label. Add a `tests/page.test.tsx` expectation that the default page has no poll track inside `[data-seat-meter]` - through the independent test author, with approval.
- **Helper line:** change `helper` in `content.ts` to `` `Opens a DM with @${settings.instagramHandle} - just say I'm in` `` with the founder's approval, and let the test author confirm the page test still matches.

Then run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` and `npm run budget`. Expected: all green.

- [ ] **Step 4: Record the decision and commit**

Add the cut to the decisions log in `docs/implementation-plan.md`, mark build step 10 "Done", then:

```bash
git add src tests docs/implementation-plan.md
git commit -m "feat: cut one thing - (the founder's choice)" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

