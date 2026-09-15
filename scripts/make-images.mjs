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
