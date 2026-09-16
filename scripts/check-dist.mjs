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
if (/<form\b/i.test(html)) problems.push('the page contains a <form> - the only conversion is a DM link');

if (problems.length > 0) {
  console.error(`check:dist: ${problems.length} problem(s) in the built page:`);
  for (const problem of problems) console.error(problem);
  process.exit(1);
}
console.log('check:dist: the built page loads only its own files and links only to Instagram or WhatsApp');
