const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const dbFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'trimly-test-')), 'test.db');
process.env.DATABASE_PATH = dbFile;
process.env.ADMIN_PASSWORD = 'test-password';
process.env.SESSION_SECRET = 'test-secret';
process.env.BASE_URL = 'http://localhost:0'; // overwritten below once we know the real port

const { createApp } = require('../src/app');

let server;
let baseUrl;
let sessionCookie;

test.before(async () => {
  const app = createApp();
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => {
  server.close();
  fs.rmSync(path.dirname(dbFile), { recursive: true, force: true });
});

test('rejects unauthenticated API access', async () => {
  const res = await fetch(`${baseUrl}/api/links`);
  assert.equal(res.status, 401);
});

test('logs in with the admin password and receives a session cookie', async () => {
  const res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'password=test-password',
    redirect: 'manual',
  });
  assert.equal(res.status, 302);
  // cookie-session sets two cookies (session + signature); both are needed.
  sessionCookie = res.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
  assert.ok(sessionCookie);
});

test('rejects the wrong password', async () => {
  const res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'password=nope',
  });
  assert.equal(res.status, 401);
});

test('creates a link, then redirecting it records a click and updates stats', async () => {
  const createRes = await fetch(`${baseUrl}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({ long_url: 'https://example.com/some/page', slug: 'my-test-link' }),
  });
  assert.equal(createRes.status, 201);
  const link = await createRes.json();
  assert.equal(link.slug, 'my-test-link');
  assert.equal(link.click_count, 0);

  const redirectRes = await fetch(`${baseUrl}/my-test-link`, { redirect: 'manual' });
  assert.equal(redirectRes.status, 302);
  assert.equal(redirectRes.headers.get('location'), 'https://example.com/some/page');

  const statsRes = await fetch(`${baseUrl}/api/stats/my-test-link`, {
    headers: { Cookie: sessionCookie },
  });
  const stats = await statsRes.json();
  assert.equal(stats.total_clicks, 1);
  assert.equal(stats.clicks_by_day.length, 1);
});

test('rejects a duplicate custom slug', async () => {
  const res = await fetch(`${baseUrl}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({ long_url: 'https://example.com/other', slug: 'my-test-link' }),
  });
  assert.equal(res.status, 409);
});

test('rejects a non-http(s) long_url', async () => {
  const res = await fetch(`${baseUrl}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({ long_url: 'javascript:alert(1)' }),
  });
  assert.equal(res.status, 400);
});

test('404s on an unknown slug', async () => {
  const res = await fetch(`${baseUrl}/does-not-exist`);
  assert.equal(res.status, 404);
});

test('deleting a link removes it and its clicks', async () => {
  const del = await fetch(`${baseUrl}/api/links/my-test-link`, {
    method: 'DELETE',
    headers: { Cookie: sessionCookie },
  });
  assert.equal(del.status, 204);

  const redirectRes = await fetch(`${baseUrl}/my-test-link`, { redirect: 'manual' });
  assert.equal(redirectRes.status, 404);
});
