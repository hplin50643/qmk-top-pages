const fs = require('node:fs');
const path = require('node:path');

// Browsers cache ES modules by their full URL, including the query string.
// The entry and the lazy chunks must therefore import the same React instance.
const root = path.join(__dirname, '..', 'v4');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const match = html.match(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/i);
if (!match) throw new Error('V4 module entry was not found');

const base = 'https://example.test/qmk-top-pages/v4/';
const entry = new URL(match[1], base).href;
const scripts = path.join(root, 'js');
let references = 0;
// Check every device and layout chunk, including files renamed by a new build.
const chunks = new Set(fs.readdirSync(scripts).filter(file => file.endsWith('.js')));
for (const file of chunks) {
  const source = fs.readFileSync(path.join(scripts, file), 'utf8');
  const pattern = /["']\.\/([^/"'\\?#]+\.js)([?#][^"']*)?["']/g;
  for (const ref of source.matchAll(pattern)) {
    const [, target, suffix = ''] = ref;
    if (!chunks.has(target)) throw new Error(`${file} references missing chunk ${target}`);
    if (!target.startsWith('index.')) continue;
    const resolved = new URL(target + suffix, new URL(`js/${file}`, base));
    references++;
    if (resolved.href !== entry) {
      throw new Error(`${file} imports ${resolved.href}, but HTML loads ${entry}`);
    }
  }
}
if (!references) throw new Error('No lazy chunk references to the V4 entry were found');
console.log(`Checked local JS references in ${chunks.size} V4 files. All ${references} entry references resolve to ${entry}.`);
