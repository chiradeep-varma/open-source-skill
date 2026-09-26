const express = require('express');
const { checkPassword } = require('../auth');

const router = express.Router();

router.get('/login', (req, res) => {
  if (req.session && req.session.authed) return res.redirect('/');
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (checkPassword(password)) {
    req.session.authed = true;
    return res.redirect('/');
  }
  res.status(401).render('login', { error: 'Wrong password.' });
});

router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

module.exports = router;
