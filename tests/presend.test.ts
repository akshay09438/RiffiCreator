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
