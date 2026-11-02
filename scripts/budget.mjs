// Budget check on the production build (PRD 7): JavaScript under 90KB gzipped, and the weight a visitor
// downloads - HTML, CSS, JavaScript, the two preloaded fonts and the favicon - under 400KB.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = 'dist';
const assets = readdirSync(path.join(dist, 'assets'));
const asset = (file) => path.join(dist, 'assets', file);
const gzipped = (file) => gzipSync(readFileSync(file), { level: 9 }).length;
const kb = (bytes) => `${(bytes / 1000).toFixed(1)}KB`;
const sum = (files, measure) => files.reduce((total, file) => total + measure(file), 0);

const js = sum(assets.filter((f) => f.endsWith('.js')).map(asset), gzipped);
const css = sum(assets.filter((f) => f.endsWith('.css')).map(asset), gzipped);
const fonts = sum(
  assets
    .filter((f) => /^(archivo-latin-wdth-normal|hanken-grotesk-latin-wght-normal)-.*\.woff2$/.test(f))
    .map(asset),
  (file) => readFileSync(file).length,
);
const html = gzipped(path.join(dist, 'index.html'));
const favicon = gzipped(path.join(dist, 'favicon.svg'));
const total = html + css + js + fonts + favicon;

console.log(`budget: JavaScript ${kb(js)} gzipped (limit 90KB)`);
console.log(
  `budget: page weight ${kb(total)} - HTML ${kb(html)}, CSS ${kb(css)}, JS ${kb(js)}, fonts ${kb(fonts)}, favicon ${kb(favicon)} (limit 400KB)`,
);

const failures = [];
if (js >= 90_000) failures.push('JavaScript is over 90KB gzipped');
if (total >= 400_000) failures.push('page weight is over 400KB');
if (failures.length > 0) {
  console.error(`budget: FAILED - ${failures.join('; ')}`);
  process.exit(1);
}
console.log('budget: within both limits');
