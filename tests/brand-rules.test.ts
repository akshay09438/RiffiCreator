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
