const express = require('express');
const { validateUsername, validatePassword } = require('../lib/validate');
const { createUser, getUserByUsername, verifyPassword } = require('../models/users');
const { rateLimit } = require('../middleware/rateLimit');

const authLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 20 });

module.exports = function authRoutes(db) {
  const router = express.Router();

  router.get('/signup', (req, res) => {
    if (req.user) return res.redirect('/dashboard');
    res.render('signup', { title: 'Create an account', error: null, values: {} });
  });

  router.post('/signup', authLimiter, (req, res) => {
    const { username = '', password = '', confirm = '' } = req.body;
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError) {
      return res.status(400).render('signup', { title: 'Create an account', error: usernameError, values: { username } });
    }
    if (passwordError) {
      return res.status(400).render('signup', { title: 'Create an account', error: passwordError, values: { username } });
    }
    if (password !== confirm) {
      return res.status(400).render('signup', { title: 'Create an account', error: 'Passwords do not match.', values: { username } });
    }

    let user;
    try {
      user = createUser(db, { username, password, displayName: username });
    } catch (err) {
      if (String(err.message).includes('UNIQUE')) {
        return res.status(400).render('signup', { title: 'Create an account', error: 'That username is taken. Try another.', values: { username } });
      }
      throw err;
    }

    req.session.userId = user.id;
    res.redirect('/dashboard');
  });

  router.get('/login', (req, res) => {
    if (req.user) return res.redirect('/dashboard');
    res.render('login', { title: 'Log in', error: null, values: {} });
  });

  router.post('/login', authLimiter, (req, res) => {
    const { username = '', password = '' } = req.body;
    const user = getUserByUsername(db, username);
    if (!user || !verifyPassword(user, password)) {
      return res.status(400).render('login', { title: 'Log in', error: 'Wrong username or password.', values: { username } });
    }
    req.session.userId = user.id;
    res.redirect('/dashboard');
  });

  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });

  return router;
};
