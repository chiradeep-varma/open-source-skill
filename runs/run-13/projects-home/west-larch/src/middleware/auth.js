const { getUserById } = require('../models/users');

function loadUser(db) {
  return (req, res, next) => {
    if (req.session && req.session.userId) {
      req.user = getUserById(db, req.session.userId);
      if (!req.user) req.session = null;
    }
    res.locals.currentUser = req.user || null;
    next();
  };
}

function requireAuth(req, res, next) {
  if (!req.user) return res.redirect('/login');
  next();
}

module.exports = { loadUser, requireAuth };
