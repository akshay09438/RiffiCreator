// Renders the link-preview card (public/og.png, 1200x630) from the page's own tokens and copy, and the
// icons (favicon.svg, favicon.ico, apple-touch-icon.png) from the Founding Creator badge, using the
// Microsoft Edge already on this laptop.
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

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };

function escapeHtml(text) {
  return text.replace(/[&<>]/g, (character) => HTML_ESCAPES[character]);
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

/** Renders the body at exactly width x height and returns the PNG bytes. `transparent` leaves the page background clear. */
async function render(browser, name, body, width, height, transparent = false) {
  const htmlFile = path.join(work, `${name}.html`);
  writeFileSync(htmlFile, page(body));

  // A window of exactly this size: the size is only accepted for a new window, not a tab. Browsers will
  // not make a window smaller than about 180px, so a small icon is drawn in a bigger window and only
  // its top-left corner is captured.
  const windowWidth = Math.max(width, 180);
  const windowHeight = Math.max(height, 180);
  const { targetId } = await browser.send('Target.createTarget', {
    url: 'about:blank',
    width: windowWidth,
    height: windowHeight,
    newWindow: true,
  });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  const send = (method, params = {}) => browser.send(method, params, sessionId);
  try {
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: windowWidth,
      height: windowHeight,
      deviceScaleFactor: 1,
      mobile: false,
    });
    if (transparent) {
      await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    }
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
    const { data } = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width, height, scale: 1 },
    });
    return Buffer.from(data, 'base64');
  } finally {
    await browser.send('Target.closeTarget', { targetId }).catch(() => undefined);
  }
}

async function screenshot(browser, name, body, width, height) {
  const output = path.join(publicDir, name);
  // Remove the old image first, so a failed render can never pass off a stale card as new.
  rmSync(output, { force: true });
  writeFileSync(output, await render(browser, name, body, width, height));
  if (!existsSync(output)) throw new Error(`images: Edge did not write public/${name}`);
  console.log(`images: wrote public/${name} (${statSync(output).size} bytes)`);
}

/** A .ico file holding PNG images (every current browser reads that form): a 6-byte header, one 16-byte entry per size, then the images. */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
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

  // The icons are the Founding Creator badge (public/media/badge.webp, a transparent square with the coin
  // centred in it), so the tab, the home screen and the badge on the page all match.
  const coin = pathToFileURL(path.join(publicDir, 'media', 'badge.webp')).href;
  const coinAt = (size) =>
    `<div style="width:${size}px;height:${size}px"><img src="${coin}" width="${size}" height="${size}" style="display:block"></div>`;

  // iOS fills a transparent icon with black, so the home-screen icon sits on the page's lime panel.
  await screenshot(
    browser,
    'apple-touch-icon.png',
    `<div style="box-sizing:border-box;width:180px;height:180px;display:flex;align-items:center;justify-content:center;background:var(--lime)">${coinAt(136)}</div>`,
    180,
    180,
  );

  const png = (size) => render(browser, `icon-${size}.png`, coinAt(size), size, size, true);
  // One at a time: each render opens its own window, and several at once can stall the browser.
  const small = await png(16);
  const medium = await png(32);
  const large = await png(48);
  const retina = await png(64);

  // The SVG favicon wraps the 64px coin, so modern browsers show the same art, sharp on dense screens.
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><image width="32" height="32" xlink:href="data:image/png;base64,${retina.toString('base64')}"/></svg>\n`;
  writeFileSync(path.join(publicDir, 'favicon.svg'), favicon);
  console.log(`images: wrote public/favicon.svg (${Buffer.byteLength(favicon)} bytes)`);

  // Safari and older browsers ask for /favicon.ico on their own, with no <link> needed.
  const ico = buildIco([
    { size: 16, png: small },
    { size: 32, png: medium },
    { size: 48, png: large },
  ]);
  writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
  console.log(`images: wrote public/favicon.ico (${ico.length} bytes)`);
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
