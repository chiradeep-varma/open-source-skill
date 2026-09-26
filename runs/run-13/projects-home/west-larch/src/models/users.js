const bcrypt = require('bcryptjs');

function createUser(db, { username, password, displayName }) {
  const passwordHash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(`
    INSERT INTO users (username, password_hash, display_name)
    VALUES (?, ?, ?)
  `);
  const info = stmt.run(username.trim().toLowerCase(), passwordHash, displayName || username);
  return getUserById(db, info.lastInsertRowid);
}

function getUserById(db, id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function getUserByUsername(db, username) {
  return db.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE').get(username.trim());
}

function verifyPassword(user, password) {
  return bcrypt.compareSync(password, user.password_hash);
}

function updateProfile(db, userId, { displayName, bio, avatarUrl, theme }) {
  db.prepare(`
    UPDATE users SET display_name = ?, bio = ?, avatar_url = ?, theme = ?
    WHERE id = ?
  `).run(displayName, bio, avatarUrl, theme, userId);
  return getUserById(db, userId);
}

function recordPageView(db, userId) {
  db.prepare('UPDATE users SET page_views = page_views + 1 WHERE id = ?').run(userId);
}

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  verifyPassword,
  updateProfile,
  recordPageView,
};
