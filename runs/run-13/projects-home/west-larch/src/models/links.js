function listLinks(db, userId, { activeOnly = false } = {}) {
  const sql = activeOnly
    ? 'SELECT * FROM links WHERE user_id = ? AND is_active = 1 ORDER BY position ASC'
    : 'SELECT * FROM links WHERE user_id = ? ORDER BY position ASC';
  return db.prepare(sql).all(userId);
}

function getLink(db, id) {
  return db.prepare('SELECT * FROM links WHERE id = ?').get(id);
}

function createLink(db, userId, { title, url }) {
  const row = db.prepare('SELECT COALESCE(MAX(position), -1) AS maxPos FROM links WHERE user_id = ?').get(userId);
  const position = row.maxPos + 1;
  const info = db.prepare(`
    INSERT INTO links (user_id, title, url, position) VALUES (?, ?, ?, ?)
  `).run(userId, title.trim(), url.trim(), position);
  return getLink(db, info.lastInsertRowid);
}

function updateLink(db, id, { title, url }) {
  db.prepare('UPDATE links SET title = ?, url = ? WHERE id = ?').run(title.trim(), url.trim(), id);
}

function toggleActive(db, id) {
  db.prepare('UPDATE links SET is_active = CASE is_active WHEN 1 THEN 0 ELSE 1 END WHERE id = ?').run(id);
}

function deleteLink(db, id) {
  db.prepare('DELETE FROM links WHERE id = ?').run(id);
}

/** Swap a link's position with its neighbor above ('up') or below ('down'). */
function moveLink(db, userId, id, direction) {
  const links = listLinks(db, userId);
  const index = links.findIndex((l) => l.id === id);
  if (index === -1) return;
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= links.length) return;

  const a = links[index];
  const b = links[swapWith];
  const tx = db.transaction(() => {
    db.prepare('UPDATE links SET position = ? WHERE id = ?').run(b.position, a.id);
    db.prepare('UPDATE links SET position = ? WHERE id = ?').run(a.position, b.id);
  });
  tx();
}

/** Atomic increment — safe under concurrent requests. */
function registerClick(db, id) {
  db.prepare('UPDATE links SET clicks = clicks + 1 WHERE id = ?').run(id);
}

module.exports = {
  listLinks,
  getLink,
  createLink,
  updateLink,
  toggleActive,
  deleteLink,
  moveLink,
  registerClick,
};
