const test = require('node:test');
const assert = require('node:assert/strict');
const { createDb } = require('../src/db');
const { createApp } = require('../src/app');

class CookieJar {
  constructor() { this.cookies = new Map(); }

  store(res) {
    for (const raw of res.headers.getSetCookie ? res.headers.getSetCookie() : []) {
      const [pair] = raw.split(';');
      const eq = pair.indexOf('=');
      this.cookies.set(pair.slice(0, eq), pair.slice(eq + 1));
    }
  }

  header() {
    return [...this.cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
  }
}

function extractCsrf(html) {
  const m = html.match(/name="_csrf" value="([^"]+)"/);
  return m ? m[1] : null;
}

async function startServer() {
  const db = createDb(':memory:');
  const app = createApp({ db, sessionSecret: 'a'.repeat(32), baseUrl: 'http://localhost' });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const { port } = server.address();
  return { server, base: `http://127.0.0.1:${port}` };
}

test('signup, add a link, and click through it on the public page', async () => {
  const { server, base } = await startServer();
  const jar = new CookieJar();

  try {
    // GET signup form to obtain a CSRF token
    let res = await fetch(`${base}/signup`);
    jar.store(res);
    let csrf = extractCsrf(await res.text());
    assert.ok(csrf);

    // Sign up
    res = await fetch(`${base}/signup`, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: jar.header() },
      body: new URLSearchParams({ _csrf: csrf, username: 'creator1', password: 'password123', confirm: 'password123' }),
    });
    jar.store(res);
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), '/dashboard');

    // Load dashboard to get a fresh CSRF token for the next POST
    res = await fetch(`${base}/dashboard`, { headers: { Cookie: jar.header() } });
    jar.store(res);
    const dashHtml = await res.text();
    csrf = extractCsrf(dashHtml);
    assert.match(dashHtml, /No links yet/);

    // Add a link
    res = await fetch(`${base}/dashboard/links`, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: jar.header() },
      body: new URLSearchParams({ _csrf: csrf, title: 'My site', url: 'https://example.com/creator1' }),
    });
    assert.equal(res.status, 302);

    // Public page shows the link
    res = await fetch(`${base}/creator1`);
    const publicHtml = await res.text();
    assert.equal(res.status, 200);
    assert.match(publicHtml, /My site/);
    const linkIdMatch = publicHtml.match(/\/l\/(\d+)/);
    assert.ok(linkIdMatch);

    // Clicking the link redirects to the destination and counts the click
    res = await fetch(`${base}/l/${linkIdMatch[1]}`, { redirect: 'manual' });
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), 'https://example.com/creator1');

    res = await fetch(`${base}/dashboard`, { headers: { Cookie: jar.header() } });
    assert.match(await res.text(), /1 clicks/);
  } finally {
    server.close();
  }
});

test('unknown username returns 404, and dashboard requires login', async () => {
  const { server, base } = await startServer();
  try {
    let res = await fetch(`${base}/nobody-here`);
    assert.equal(res.status, 404);

    res = await fetch(`${base}/dashboard`, { redirect: 'manual' });
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), '/login');
  } finally {
    server.close();
  }
});

test('wrong password is rejected on login', async () => {
  const { server, base } = await startServer();
  const jar = new CookieJar();
  try {
    let res = await fetch(`${base}/signup`);
    jar.store(res);
    let csrf = extractCsrf(await res.text());
    res = await fetch(`${base}/signup`, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: jar.header() },
      body: new URLSearchParams({ _csrf: csrf, username: 'creator2', password: 'password123', confirm: 'password123' }),
    });
    jar.store(res);

    // Fresh, logged-out client for the login attempt
    const jar2 = new CookieJar();
    res = await fetch(`${base}/login`);
    jar2.store(res);
    csrf = extractCsrf(await res.text());
    res = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: jar2.header() },
      body: new URLSearchParams({ _csrf: csrf, username: 'creator2', password: 'wrong-password' }),
    });
    assert.equal(res.status, 400);
    assert.match(await res.text(), /Wrong username or password/);
  } finally {
    server.close();
  }
});
