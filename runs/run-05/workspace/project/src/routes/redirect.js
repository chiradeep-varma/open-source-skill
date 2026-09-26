const express = require('express');
const db = require('../db');
const { deriveClickMeta } = require('../lib/click-meta');

const router = express.Router();

router.get('/:slug', (req, res, next) => {
  const link = db.prepare('SELECT * FROM links WHERE slug = ?').get(req.params.slug);
  if (!link) return next(); // fall through to 404

  const meta = deriveClickMeta(req, process.env.SESSION_SECRET);
  db.prepare(
    `INSERT INTO clicks (link_id, referrer, browser, os, device_type, country, ip_hash)
     VALUES (@link_id, @referrer, @browser, @os, @device_type, @country, @ip_hash)`
  ).run({ link_id: link.id, ...meta });

  res.redirect(302, link.long_url);
});

module.exports = router;
