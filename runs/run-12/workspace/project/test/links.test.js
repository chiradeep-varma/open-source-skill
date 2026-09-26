const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

// Each test file gets its own throwaway SQLite file so tests don't share state.
const tmpDb = path.join(os.tmpdir(), `sunny-thicket-test-${process.pid}-${Date.now()}.sqlite`);
process.env.DB_PATH = tmpDb;

const {
  createLink,
  getLinkByCode,
  updateLink,
  deleteLink,
  isLive,
  recordClick,
  clickStats,
  listLinks,
} = require('../server/models/links');

test.after(() => {
  for (const suffix of ['', '-wal', '-shm']) {
    fs.rmSync(tmpDb + suffix, { force: true });
  }
});

test('createLink generates a unique code when none is given', () => {
  const link = createLink({ longUrl: 'https://example.com/a' });
  assert.match(link.code, /^[a-zA-Z0-9]{6}$/);
  assert.equal(link.long_url, 'https://example.com/a');
  assert.equal(link.disabled, 0);
});

test('createLink accepts and rejects custom codes', () => {
  const link = createLink({ longUrl: 'https://example.com/b', code: 'my-link' });
  assert.equal(link.code, 'my-link');

  assert.throws(
    () => createLink({ longUrl: 'https://example.com/c', code: 'my-link' }),
    /already taken/
  );

  assert.throws(
    () => createLink({ longUrl: 'https://example.com/d', code: 'has a space' }),
    /may only contain/
  );

  assert.throws(
    () => createLink({ longUrl: 'https://example.com/e', code: 'api' }),
    /reserved/
  );
});

test('createLink rejects invalid destination URLs', () => {
  assert.throws(() => createLink({ longUrl: 'not-a-url' }), /valid http/);
  assert.throws(() => createLink({ longUrl: '' }), /valid http/);
  assert.throws(() => createLink({ longUrl: 'javascript:alert(1)' }), /valid http/);
});

test('updateLink can disable a link and isLive reflects it', () => {
  const link = createLink({ longUrl: 'https://example.com/f', code: 'disable-me' });
  assert.equal(isLive(link), true);

  const updated = updateLink('disable-me', { disabled: true });
  assert.equal(updated.disabled, 1);
  assert.equal(isLive(updated), false);
});

test('isLive respects expires_at', () => {
  const past = new Date(Date.now() - 60_000).toISOString();
  const future = new Date(Date.now() + 60_000).toISOString();

  const expired = createLink({ longUrl: 'https://example.com/g', code: 'expired-link', expiresAt: past });
  const active = createLink({ longUrl: 'https://example.com/h', code: 'active-link', expiresAt: future });

  assert.equal(isLive(expired), false);
  assert.equal(isLive(active), true);
});

test('deleteLink removes a link and its clicks via cascade', () => {
  const link = createLink({ longUrl: 'https://example.com/i', code: 'to-delete' });
  recordClick(link.id, { referrer: 'https://ref.example', deviceType: 'desktop', browser: 'Firefox', os: 'Linux', ipHash: 'abc' });

  assert.equal(deleteLink('to-delete'), true);
  assert.equal(getLinkByCode('to-delete'), undefined);
  assert.equal(deleteLink('to-delete'), false);
});

test('clickStats aggregates totals, unique visitors, referrers and devices', () => {
  const link = createLink({ longUrl: 'https://example.com/j', code: 'stats-link' });

  recordClick(link.id, { referrer: 'https://a.example', deviceType: 'desktop', browser: 'Chrome', os: 'macOS', ipHash: 'visitor-1' });
  recordClick(link.id, { referrer: 'https://a.example', deviceType: 'mobile', browser: 'Safari', os: 'iOS', ipHash: 'visitor-2' });
  recordClick(link.id, { referrer: '', deviceType: 'desktop', browser: 'Chrome', os: 'macOS', ipHash: 'visitor-1' });

  const stats = clickStats(link.id);
  assert.equal(stats.total, 3);
  assert.equal(stats.uniqueVisitors, 2);

  const aExample = stats.byReferrer.find((r) => r.referrer === 'https://a.example');
  assert.equal(aExample.n, 2);
  const direct = stats.byReferrer.find((r) => r.referrer === 'Direct');
  assert.equal(direct.n, 1);

  const desktop = stats.byDevice.find((d) => d.device_type === 'desktop');
  assert.equal(desktop.n, 2);
});

test('listLinks includes an accurate click_count per link', () => {
  const link = createLink({ longUrl: 'https://example.com/k', code: 'counted-link' });
  recordClick(link.id, { ipHash: 'v1' });
  recordClick(link.id, { ipHash: 'v2' });

  const row = listLinks().find((l) => l.code === 'counted-link');
  assert.equal(row.click_count, 2);
});
