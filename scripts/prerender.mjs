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
