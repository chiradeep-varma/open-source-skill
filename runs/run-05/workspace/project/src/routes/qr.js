const express = require('express');
const QRCode = require('qrcode');
const db = require('../db');

const router = express.Router();

router.get('/:slug.png', async (req, res) => {
  const link = db.prepare('SELECT * FROM links WHERE slug = ?').get(req.params.slug);
  if (!link) return res.status(404).end();

  const shortUrl = `${process.env.BASE_URL}/${link.slug}`;
  res.setHeader('Content-Type', 'image/png');
  QRCode.toFileStream(res, shortUrl, { width: 320, margin: 1 });
});

module.exports = router;
