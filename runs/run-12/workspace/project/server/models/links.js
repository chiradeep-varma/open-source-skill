const db = require('../db');
const { randomCode, isValidSlug } = require('../lib/codes');

function codeExists(code) {
  return !!db.prepare('SELECT 1 FROM links WHERE code = ?').get(code);
}

function generateUniqueCode() {
  for (let i = 0; i < 20; i++) {
    const code = randomCode(6);
    if (!codeExists(code)) return code;
  }
  throw new Error('Could not generate a unique short code');
}

function createLink({ longUrl, code, title, expiresAt }) {
  if (!longUrl || !/^https?:\/\/.+/i.test(longUrl)) {
    const err = new Error('A valid http(s) URL is required.');
    err.status = 400;
    throw err;
  }

  let finalCode = code ? code.trim() : null;
  if (finalCode) {
    if (!isValidSlug(finalCode)) {
      const err = new Error('Custom codes may only contain letters, numbers, "-" and "_" (max 64 chars), and can\'t use a reserved word.');
      err.status = 400;
      throw err;
    }
    if (codeExists(finalCode)) {
      const err = new Error('That short code is already taken. Try another one.');
      err.status = 409;
      throw err;
    }
  } else {
    finalCode = generateUniqueCode();
  }

  const stmt = db.prepare(
    'INSERT INTO links (code, long_url, title, expires_at) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(finalCode, longUrl, title || null, expiresAt || null);
  return getLinkById(info.lastInsertRowid);
}

function getLinkById(id) {
  return db.prepare('SELECT * FROM links WHERE id = ?').get(id);
}

function getLinkByCode(code) {
  return db.prepare('SELECT * FROM links WHERE code = ?').get(code);
}

function listLinks() {
  return db
    .prepare(
      `SELECT links.*,
              (SELECT COUNT(*) FROM clicks WHERE clicks.link_id = links.id) AS click_count
       FROM links
       ORDER BY links.created_at DESC`
    )
    .all();
}

function updateLink(code, { longUrl, title, disabled, expiresAt }) {
  const link = getLinkByCode(code);
  if (!link) return null;

  if (longUrl !== undefined && !/^https?:\/\/.+/i.test(longUrl)) {
    const err = new Error('A valid http(s) URL is required.');
    err.status = 400;
    throw err;
  }

  db.prepare(
    `UPDATE links SET
      long_url = COALESCE(?, long_url),
      title = COALESCE(?, title),
      disabled = COALESCE(?, disabled),
      expires_at = ?
     WHERE code = ?`
  ).run(
    longUrl ?? null,
    title ?? null,
    disabled === undefined ? null : disabled ? 1 : 0,
    expiresAt === undefined ? link.expires_at : expiresAt,
    code
  );
  return getLinkByCode(code);
}

function deleteLink(code) {
  const info = db.prepare('DELETE FROM links WHERE code = ?').run(code);
  return info.changes > 0;
}

function isLive(link) {
  if (!link || link.disabled) return false;
  if (link.expires_at && new Date(link.expires_at).getTime() < Date.now()) return false;
  return true;
}

function recordClick(linkId, { referrer, deviceType, browser, os, ipHash }) {
  db.prepare(
    `INSERT INTO clicks (link_id, referrer, device_type, browser, os, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(linkId, referrer || null, deviceType || null, browser || null, os || null, ipHash || null);
}

function clickStats(linkId) {
  const total = db
    .prepare('SELECT COUNT(*) AS n FROM clicks WHERE link_id = ?')
    .get(linkId).n;

  const uniqueVisitors = db
    .prepare(
      'SELECT COUNT(DISTINCT ip_hash) AS n FROM clicks WHERE link_id = ? AND ip_hash IS NOT NULL'
    )
    .get(linkId).n;

  const byDay = db
    .prepare(
      `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS n
       FROM clicks WHERE link_id = ?
       GROUP BY day ORDER BY day ASC`
    )
    .all(linkId);

  const byReferrer = db
    .prepare(
      `SELECT COALESCE(NULLIF(referrer, ''), 'Direct') AS referrer, COUNT(*) AS n
       FROM clicks WHERE link_id = ?
       GROUP BY referrer ORDER BY n DESC LIMIT 10`
    )
    .all(linkId);

  const byDevice = db
    .prepare(
      `SELECT COALESCE(NULLIF(device_type, ''), 'desktop') AS device_type, COUNT(*) AS n
       FROM clicks WHERE link_id = ?
       GROUP BY device_type ORDER BY n DESC`
    )
    .all(linkId);

  const byBrowser = db
    .prepare(
      `SELECT COALESCE(browser, 'Unknown') AS browser, COUNT(*) AS n
       FROM clicks WHERE link_id = ?
       GROUP BY browser ORDER BY n DESC LIMIT 8`
    )
    .all(linkId);

  return { total, uniqueVisitors, byDay, byReferrer, byDevice, byBrowser };
}

function allLinksWithClicks() {
  const links = db.prepare('SELECT * FROM links').all();
  const clicks = db.prepare('SELECT * FROM clicks').all();
  return { links, clicks };
}

module.exports = {
  createLink,
  getLinkById,
  getLinkByCode,
  listLinks,
  updateLink,
  deleteLink,
  isLive,
  recordClick,
  clickStats,
  allLinksWithClicks,
  generateUniqueCode,
};
