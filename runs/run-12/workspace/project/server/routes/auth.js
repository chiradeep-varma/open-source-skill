const express = require('express');
const { checkCredentials, ADMIN_USER } = require('../auth');

const router = express.Router();

router.get('/login', (req, res) => {
  if (req.session && req.session.authenticated) return res.redirect('/');
  res.render('login', { error: null, next: req.query.next || '/', adminUser: ADMIN_USER });
});

router.post('/login', express.urlencoded({ extended: false }), (req, res) => {
  const { username, password, next } = req.body;
  if (checkCredentials(username, password)) {
    req.session.authenticated = true;
    return res.redirect(next && next.startsWith('/') ? next : '/');
  }
  res.status(401).render('login', {
    error: 'Incorrect username or password.',
    next: next || '/',
    adminUser: ADMIN_USER,
  });
});

router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

module.exports = router;
