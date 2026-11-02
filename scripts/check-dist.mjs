// Output check on the production build (PRD 5.4, 5.6, 7): the built page may load only its own files,
// may link out only to Instagram and WhatsApp, has one form that posts only to a Google Form, matches the
// security headers in vercel.json, and points its preview card at a real URL.
import { createHash } from 'node:crypto';
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
// 2 Nov 2026: the page's own details form replaced the outbound form link, so the buttons now jump
// within the page ("#join"). Anything else is still a problem, not a preference.
for (const [, url] of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/gi)) {
  if (!/^(?:#join|https:\/\/(?:ig\.me|wa\.me)\/)/.test(url)) {
    problems.push(`a link goes to ${url} - only the form on this page, Instagram and WhatsApp are allowed`);
  }
}
// Stylesheets the build inlines into the page count too, and a minified @import carries no url() at all.
const inlineStyles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(([, block]) => block).join('\n');
const styles = `${css}\n${inlineStyles}`;
for (const [, url] of styles.matchAll(/url\(\s*['"]?([^'")\s]+)['"]?\s*\)/g)) {
  if (!ownFile(url) && !url.startsWith('data:')) {
    problems.push(`CSS loads ${url} - only the page's own files may load`);
  }
}
for (const [, url] of styles.matchAll(/@import\s*(?:url\(\s*)?['"]?([^'")\s;]+)/gi)) {
  if (!ownFile(url) && !url.startsWith('data:')) {
    problems.push(`CSS imports ${url} - only the page's own files may load`);
  }
}
const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/);
if (!ogImage || !/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+\/og\.png$/i.test(ogImage[1])) {
  problems.push(`og:image is "${ogImage?.[1] ?? 'missing'}" - it must be the site URL followed by /og.png`);
}
// Exactly one form, and it may post only to the response address of a Google Form: creators type
// their email and phone number into it, so a swapped address would send them to a stranger.
const forms = [...html.matchAll(/<form\b[^>]*>/gi)].map(([tag]) => tag);
if (forms.length !== 1) problems.push(`the page contains ${forms.length} <form> elements - it must have exactly one`);
for (const tag of forms) {
  const action = tag.match(/\saction="([^"]*)"/)?.[1] ?? '';
  if (!/^https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]{20,}\/formResponse$/.test(action)) {
    problems.push(`a <form> posts to "${action}" - it may post only to a Google Form's formResponse address`);
  }
}

// The security headers in vercel.json (2 Nov 2026). The policy must let the page's own inline script run
// (by fingerprint, never 'unsafe-inline') and must allow exactly one outside address: the Google Form.
// Without this check a changed inline script would be silently blocked on the live site.
try {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const everywhere = (config.headers ?? []).find((rule) => rule.source === '/(.*)');
  const header = (key) => everywhere?.headers?.find((item) => item.key === key)?.value ?? '';
  const policy = header('Content-Security-Policy');
  const directive = (name) => policy.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name} `)) ?? '';
  if (!policy) problems.push('vercel.json has no Content-Security-Policy on /(.*)');
  const scripts = directive('script-src');
  if (/'unsafe-inline'|'unsafe-eval'/.test(scripts)) problems.push("the script-src policy allows 'unsafe-inline' or 'unsafe-eval'");
  for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\ssrc=/.test(attributes)) continue;
    const fingerprint = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
    if (!scripts.includes(fingerprint)) {
      problems.push(`an inline <script> has fingerprint ${fingerprint}, which vercel.json's script-src does not allow - the live site would block it`);
    }
  }
  if (/\son[a-z]+\s*=\s*["']/i.test(html)) problems.push('the built page has an inline event handler, which the security policy blocks');
  if (!/connect-src 'self' https:\/\/docs\.google\.com$/.test(directive('connect-src'))) problems.push("connect-src must be exactly 'self' and https://docs.google.com");
  if (directive('form-action') !== 'form-action https://docs.google.com') problems.push('form-action must be exactly https://docs.google.com');
  if (directive('frame-ancestors') !== "frame-ancestors 'none'") problems.push("frame-ancestors must be 'none'");
  if (header('X-Content-Type-Options') !== 'nosniff') problems.push('vercel.json must send X-Content-Type-Options: nosniff');
} catch (error) {
  problems.push(`vercel.json could not be read as JSON: ${error.message}`);
}

if (problems.length > 0) {
  console.error(`check:dist: ${problems.length} problem(s) in the built page:`);
  for (const problem of problems) console.error(problem);
  process.exit(1);
}
console.log('check:dist: the built page loads only its own files, links only within itself, Instagram or WhatsApp, and its one form posts only to a Google Form');
