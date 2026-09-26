const express = require('express');
const { listLinks, getLinkByCode, clickStats } = require('../models/links');
const { requireAuth } = require('../auth');

const router = express.Router();

function baseUrl(req) {
  return process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
}

router.get('/', requireAuth, (req, res) => {
  const links = listLinks();
  res.render('dashboard', { links, baseUrl: baseUrl(req), error: null });
});

router.get('/links/:code', requireAuth, (req, res, next) => {
  const link = getLinkByCode(req.params.code);
  if (!link) return next();
  const stats = clickStats(link.id);
  res.render('link', { link, stats, baseUrl: baseUrl(req) });
});

module.exports = router;
