const express = require('express');
const db = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const links = db
    .prepare(
      `SELECT links.*, (SELECT COUNT(*) FROM clicks WHERE clicks.link_id = links.id) AS click_count
       FROM links ORDER BY created_at DESC`
    )
    .all();
  res.render('dashboard', { links, baseUrl: process.env.BASE_URL });
});

router.get('/dashboard/:slug', requireAuth, (req, res) => {
  const link = db.prepare('SELECT * FROM links WHERE slug = ?').get(req.params.slug);
  if (!link) return res.status(404).render('not-found', { slug: req.params.slug });
  res.render('link', { link, baseUrl: process.env.BASE_URL });
});

module.exports = router;
