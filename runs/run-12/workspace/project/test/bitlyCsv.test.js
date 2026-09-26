const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const tmpDb = path.join(os.tmpdir(), `sunny-thicket-test-csv-${process.pid}-${Date.now()}.sqlite`);
process.env.DB_PATH = tmpDb;

const { importBitlyCsv, parseCsv } = require('../server/import/bitlyCsv');
const { getLinkByCode, listLinks } = require('../server/models/links');

test.after(() => {
  for (const suffix of ['', '-wal', '-shm']) {
    fs.rmSync(tmpDb + suffix, { force: true });
  }
});

test('parseCsv handles quoted fields with embedded commas', () => {
  const rows = parseCsv('a,b,c\n"hello, world",2,"line with ""quotes"""');
  assert.deepEqual(rows, [
    ['a', 'b', 'c'],
    ['hello, world', '2', 'line with "quotes"'],
  ]);
});

test('importBitlyCsv imports rows and reuses the short code from the bitlink column', () => {
  const csv = [
    'long_url,link,title,created_at,archived',
    'https://example.com/one,https://bit.ly/one-code,First page,2024-01-01T00:00:00Z,false',
    'https://example.com/two,https://bit.ly/two-code,Second page,2024-01-02T00:00:00Z,false',
  ].join('\n');

  const result = importBitlyCsv(csv);
  assert.equal(result.imported.length, 2);
  assert.equal(result.skipped.length, 0);

  assert.ok(getLinkByCode('one-code'));
  assert.equal(getLinkByCode('one-code').long_url, 'https://example.com/one');
  assert.ok(getLinkByCode('two-code'));
});

test('importBitlyCsv skips rows with no long_url and falls back when the code collides', () => {
  const csv = [
    'long_url,link,title',
    ',https://bit.ly/blank,No destination',
    'https://example.com/dup,https://bit.ly/dup-code,First',
    'https://example.com/dup2,https://bit.ly/dup-code,Second (code collision)',
  ].join('\n');

  const result = importBitlyCsv(csv);
  assert.equal(result.skipped.length, 1);
  assert.equal(result.skipped[0].reason, 'missing long_url');

  // Both dup rows import: the second one gets an auto-generated code
  // instead of being dropped, since the destination is still valid.
  assert.equal(result.imported.length, 2);
  const links = listLinks();
  const dupCodeLinks = links.filter((l) => l.long_url.startsWith('https://example.com/dup'));
  assert.equal(dupCodeLinks.length, 2);
  assert.notEqual(dupCodeLinks[0].code, dupCodeLinks[1].code);
});

test('importBitlyCsv requires a long_url column', () => {
  const csv = 'short,dest\nhttps://bit.ly/x,https://example.com';
  assert.throws(() => importBitlyCsv(csv), /long_url/);
});
