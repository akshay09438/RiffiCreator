// Renders the link-preview card (public/og.png, 1200x630), the apple touch icon (180x180) and the SVG
// favicon from the page's own tokens and copy, using the Microsoft Edge already on this laptop.
// Usage: npm run images   (set EDGE_PATH to use another Chromium-based browser)
//
// Edge is driven over the DevTools protocol rather than with --screenshot: Edge 153 quietly ignores
// that flag (writing nothing, or a picture of its own error page), while the protocol is exact about
// the viewport and lets the render wait for the fonts to load.
import { spawn } from 'node:child_process';
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
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

/** Starts headless Edge on its own profile and waits for the DevTools port it writes into that profile. */
async function startEdge() {
  const profile = path.join(work, 'profile');
  mkdirSync(profile, { recursive: true });
  const child = spawn(
    edge,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      // Lets the file:// card page load the self-hosted fonts from node_modules.
      '--allow-file-access-from-files',
      `--user-data-dir=${profile}`,
      '--remote-debugging-port=0',
      'about:blank',
    ],
    { stdio: 'ignore' },
  );
  const portFile = path.join(profile, 'DevToolsActivePort');
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (existsSync(portFile)) {
      const port = Number(readFileSync(portFile, 'utf8').split('\n')[0]);
      if (port > 0) {
        try {
          const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
          return { child, port, version };
        } catch {
          // The port file is written a moment before the endpoint answers.
        }
      }
    }
    await sleep(200);
  }
  child.kill();
  throw new Error('images: Edge did not start; set EDGE_PATH if Edge is somewhere else');
}

/** The few DevTools calls this script needs, on Node's built-in WebSocket - no dependencies. */
async function connect(webSocketDebuggerUrl) {
  const ws = new WebSocket(webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', () => reject(new Error('images: could not open the DevTools connection')), {
      once: true,
    });
  });
  let nextId = 1;
  const pending = new Map();
  const listeners = new Set();
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (message.id !== undefined) {
      const call = pending.get(message.id);
      if (!call) return;
      pending.delete(message.id);
      if (message.error) call.reject(new Error(`${call.method}: ${message.error.message}`));
      else call.resolve(message.result);
      return;
    }
    for (const listener of [...listeners]) listener(message);
  });
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject, method });
      ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
    });
  const on = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return { send, on, close: () => ws.close() };
}

async function screenshot(browser, name, body, width, height) {
  const htmlFile = path.join(work, `${name}.html`);
  const output = path.join(publicDir, name);
  writeFileSync(htmlFile, page(body));
  // Remove the old image first, so a failed render can never pass off a stale card as new.
  rmSync(output, { force: true });

  // A window of exactly this size: the size is only accepted for a new window, not a tab.
  const { targetId } = await browser.send('Target.createTarget', {
    url: 'about:blank',
    width,
    height,
    newWindow: true,
  });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  const send = (method, params = {}) => browser.send(method, params, sessionId);
  try {
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    const loaded = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        off();
        reject(new Error(`images: ${name} did not finish loading`));
      }, 60_000);
      const off = browser.on((message) => {
        if (message.sessionId === sessionId && message.method === 'Page.loadEventFired') {
          clearTimeout(timer);
          off();
          resolve();
        }
      });
    });
    const navigation = await send('Page.navigate', { url: pathToFileURL(htmlFile).href });
    if (navigation.errorText) throw new Error(`images: could not open the ${name} page (${navigation.errorText})`);
    await loaded;
    // The card is type, so it is only right once the brand fonts have actually loaded.
    await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
    await sleep(300);
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(output, Buffer.from(data, 'base64'));
  } finally {
    await browser.send('Target.closeTarget', { targetId }).catch(() => undefined);
  }
  if (!existsSync(output)) throw new Error(`images: Edge did not write public/${name}`);
  console.log(`images: wrote public/${name} (${statSync(output).size} bytes)`);
}

let edgeProcess;
let browser;
try {
  mkdirSync(publicDir, { recursive: true });

  const started = await startEdge();
  edgeProcess = started.child;
  browser = await connect(started.version.webSocketDebuggerUrl);
  console.log(`images: rendering in ${started.version.Browser}`);

  const [lineOne, lineTwo] = content.hero.titleLines;
  const agree = content.hero.sampleTake.agree.percent;

  // PRD 5.6 with the 16 Sep 2026 direction: white ground, the wordmark, the headline with its marker
  // sweep on the second line, and one poll bar at 71/29 behind the page's drawn edge.
  await screenshot(
    browser,
    'og.png',
    `<div style="box-sizing:border-box;width:1200px;height:630px;padding:64px 80px;display:flex;flex-direction:column;justify-content:space-between;background:var(--paper);color:var(--ink)">
      <div style="font-family:var(--typeface-display);font-weight:800;font-size:44px;line-height:1">${escapeHtml(content.nav.wordmark)}</div>
      <div style="font-family:var(--typeface-display);font-weight:800;font-stretch:115%;font-size:54px;line-height:1.14;letter-spacing:-0.03em">
        <div style="white-space:nowrap">${escapeHtml(lineOne)}</div>
        <div><span style="background:var(--flare);border-radius:12px;padding:0.04em 0.12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">${escapeHtml(lineTwo)}</span></div>
      </div>
      <div style="display:flex;height:52px;overflow:hidden;border:var(--edge-width) solid var(--edge);border-radius:var(--corner-pill);background:var(--chip-coral-bg)">
        <div style="width:${agree}%;background:var(--signal)"></div>
      </div>
    </div>`,
    1200,
    630,
  );

  await screenshot(
    browser,
    'apple-touch-icon.png',
    `<div style="box-sizing:border-box;width:180px;height:180px;display:flex;align-items:center;justify-content:center;background:var(--ink);color:var(--paper);font-family:var(--typeface-display);font-weight:800;font-size:112px;line-height:1">${escapeHtml(content.nav.wordmark.charAt(0))}</div>`,
    180,
    180,
  );

  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${token('--ink')}"/><rect x="6" y="13" width="20" height="6" rx="3" fill="${token('--chip-coral-bg')}"/><rect x="6" y="13" width="14" height="6" rx="3" fill="${token('--signal')}"/><rect x="11" y="13" width="9" height="6" fill="${token('--signal')}"/></svg>\n`;
  writeFileSync(path.join(publicDir, 'favicon.svg'), favicon);
  console.log('images: wrote public/favicon.svg');
} finally {
  // Always close the browser and remove the temporary pages and profile, even when a render fails.
  if (browser) {
    await browser.send('Browser.close').catch(() => undefined);
    browser.close();
  }
  if (edgeProcess) {
    await sleep(500);
    if (edgeProcess.exitCode === null) edgeProcess.kill();
  }
  await sleep(500);
  try {
    rmSync(work, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  } catch (error) {
    console.warn(`images: could not remove the temporary folder ${work}: ${error.message}`);
  }
}
