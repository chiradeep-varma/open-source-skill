const express = require('express');
const QRCode = require('qrcode');
const { getUserByUsername, recordPageView } = require('../models/users');
const { listLinks, getLink, registerClick } = require('../models/links');
const { RESERVED_USERNAMES } = require('../lib/validate');

module.exports = function publicRoutes(db, baseUrl) {
  const router = express.Router();

  router.get('/', (req, res) => {
    if (req.user) return res.redirect('/dashboard');
    res.render('landing', { title: 'west-larch' });
  });

  router.get('/l/:id', (req, res) => {
    const link = getLink(db, Number(req.params.id));
    if (!link || !link.is_active) {
      return res.status(404).render('error', { title: 'Link not found', message: "This link doesn't exist or was removed." });
    }
    registerClick(db, link.id);
    res.redirect(link.url);
  });

  router.get('/:username/qr', (req, res, next) => {
    const username = req.params.username.toLowerCase();
    if (RESERVED_USERNAMES.has(username)) return next();
    const user = getUserByUsername(db, username);
    if (!user) return res.status(404).end();

    QRCode.toBuffer(`${baseUrl}/${user.username}`, { width: 320, margin: 1 }, (err, buffer) => {
      if (err) return res.status(500).end();
      res.type('png').send(buffer);
    });
  });

  router.get('/:username', (req, res, next) => {
    const username = req.params.username.toLowerCase();
    if (RESERVED_USERNAMES.has(username)) return next();

    const user = getUserByUsername(db, username);
    if (!user) {
      return res.status(404).render('error', { title: 'Page not found', message: "There's no page at this address." });
    }
    recordPageView(db, user.id);
    const links = listLinks(db, user.id, { activeOnly: true });
    res.render('public', { title: user.display_name || user.username, profile: user, links });
  });

  return router;
};
