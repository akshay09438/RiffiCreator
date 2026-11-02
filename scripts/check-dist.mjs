// Output check on the production build (PRD 5.4, 5.6, 7): the built page may load only its own files,
// may link out only to Instagram and WhatsApp, has one form that posts only to a Google Form, and points its preview card at a real URL.
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

if (problems.length > 0) {
  console.error(`check:dist: ${problems.length} problem(s) in the built page:`);
  for (const problem of problems) console.error(problem);
  process.exit(1);
}
console.log('check:dist: the built page loads only its own files, links only within itself, Instagram or WhatsApp, and its one form posts only to a Google Form');
