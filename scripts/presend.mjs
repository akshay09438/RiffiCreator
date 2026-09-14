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
