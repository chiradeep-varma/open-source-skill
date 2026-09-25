const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  validateLinkTitle, validateLinkUrl, validateTheme, THEMES,
} = require('../lib/validate');
const { updateProfile } = require('../models/users');
const {
  listLinks, createLink, updateLink, toggleActive, deleteLink, moveLink, getLink,
} = require('../models/links');

module.exports = function dashboardRoutes(db) {
  const router = express.Router();
  router.use(requireAuth);

  function render(res, extra = {}) {
    res.render('dashboard', {
      title: 'Dashboard',
      links: listLinks(db, res.locals.currentUser.id),
      themes: THEMES,
      error: null,
      ...extra,
    });
  }

  router.get('/', (req, res) => render(res));

  router.post('/profile', (req, res) => {
    const { displayName = '', bio = '', avatarUrl = '', theme = 'paper' } = req.body;
    const themeError = validateTheme(theme);
    if (themeError) return render(res, { error: themeError });

    updateProfile(db, req.user.id, {
      displayName: displayName.trim().slice(0, 80),
      bio: bio.trim().slice(0, 280),
      avatarUrl: avatarUrl.trim().slice(0, 500),
      theme,
    });
    req.user = { ...req.user, displayName };
    res.redirect('/dashboard');
  });

  router.post('/links', (req, res) => {
    const { title = '', url = '' } = req.body;
    const titleError = validateLinkTitle(title);
    const urlError = validateLinkUrl(url);
    if (titleError || urlError) return render(res, { error: titleError || urlError });

    createLink(db, req.user.id, { title, url });
    res.redirect('/dashboard');
  });

  function ownsLink(req, res, next) {
    const link = getLink(db, Number(req.params.id));
    if (!link || link.user_id !== req.user.id) {
      return res.status(404).render('error', { title: 'Not found', message: 'That link does not exist.' });
    }
    req.link = link;
    next();
  }

  router.post('/links/:id', ownsLink, (req, res) => {
    const { title = '', url = '' } = req.body;
    const titleError = validateLinkTitle(title);
    const urlError = validateLinkUrl(url);
    if (titleError || urlError) return render(res, { error: titleError || urlError });

    updateLink(db, req.link.id, { title, url });
    res.redirect('/dashboard');
  });

  router.post('/links/:id/toggle', ownsLink, (req, res) => {
    toggleActive(db, req.link.id);
    res.redirect('/dashboard');
  });

  router.post('/links/:id/delete', ownsLink, (req, res) => {
    deleteLink(db, req.link.id);
    res.redirect('/dashboard');
  });

  router.post('/links/:id/move', ownsLink, (req, res) => {
    const direction = req.body.direction === 'up' ? 'up' : 'down';
    moveLink(db, req.user.id, req.link.id, direction);
    res.redirect('/dashboard');
  });

  return router;
};
