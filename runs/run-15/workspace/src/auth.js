'use strict';

const bcrypt = require('bcryptjs');
const { findUser } = require('./models');

function verifyLogin(db, username, password) {
  const user = findUser(db, username);
  if (!user) return null;
  const ok = bcrypt.compareSync(password, user.password_hash);
  return ok ? user : null;
}

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect('/admin/login');
}

module.exports = { verifyLogin, requireAuth };
