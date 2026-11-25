const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

function readEntry(directory) {
  const html = fs.readFileSync(path.join(directory, 'index.html'), 'utf8');
  const script = html.match(/<script\b[^>]*\bsrc="([^"]+)"/i);
  assert.ok(script, `Missing script tag in ${directory}`);
  const entry = path.resolve(directory, script[1]);
  return { entry, source: fs.readFileSync(entry, 'utf8') };
}

for (const [driver, directory] of [['v5', root], ['v4', path.join(root, 'v4')]]) {
  const { entry, source } = readEntry(directory);
  const catalog = JSON.parse(fs.readFileSync(path.join(directory, 'supported-devices.json'), 'utf8'));
  assert.equal(catalog.driver, driver);
  assert.ok(catalog.devices.length && catalog.interfaces.length, `Empty ${driver} catalog`);

  // Each driver also consults its bundled legacy-device catalog before routing.
  const legacyRef = source.match(/new URL\("([^"]*webdriver-supported-devices[^"]+\.json)"/);
  assert.ok(legacyRef, `Missing legacy catalog reference in ${entry}`);
  const legacyFile = path.resolve(path.dirname(entry), legacyRef[1]);
  const legacy = JSON.parse(fs.readFileSync(legacyFile, 'utf8'));
  assert.equal(legacy.driver, 'webdriver');
  assert.ok(legacy.devices.length, `Empty legacy catalog in ${legacyFile}`);
}

const legacyDir = path.join(root, 'legacy');
const { source } = readEntry(legacyDir);
// Webpack emits a public-path expression for each bundled media asset.
const media = new Set(Array.from(source.matchAll(/\b\w+\.p\+"(static\/[^"\n]+)"/g), match => match[1]));
assert.ok(media.size, 'Missing legacy media references');
const sample = Buffer.alloc(1);
for (const file of media) {
  const fd = fs.openSync(path.join(legacyDir, file), 'r');
  try {
    assert.equal(fs.readSync(fd, sample, 0, 1, 0), 1, `Empty legacy asset ${file}`);
  } finally {
    fs.closeSync(fd);
  }
}
console.log(`Verified three driver entries, their device catalogs and ${media.size} legacy assets.`);
