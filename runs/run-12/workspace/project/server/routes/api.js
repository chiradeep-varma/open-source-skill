const express = require('express');
const QRCode = require('qrcode');
const {
  createLink,
  getLinkByCode,
  listLinks,
  updateLink,
  deleteLink,
  clickStats,
  allLinksWithClicks,
} = require('../models/links');
const { requireAuth } = require('../auth');
const { importBitlyCsv } = require('../import/bitlyCsv');

const router = express.Router();

router.use(express.json({ limit: '2mb' }));
router.use(express.text({ type: ['text/csv', 'text/plain'], limit: '10mb' }));

router.get('/links', requireAuth, (req, res) => {
  res.json({ links: listLinks() });
});

router.post('/links', requireAuth, (req, res) => {
  try {
    const { url, code, title, expiresAt } = req.body || {};
    const link = createLink({ longUrl: url, code, title, expiresAt });
    res.status(201).json({ link });
  } catch (e) {
    res.status(e.status || 400).json({ error: e.message });
  }
});

router.get('/links/:code', requireAuth, (req, res) => {
  const link = getLinkByCode(req.params.code);
  if (!link) return res.status(404).json({ error: 'Link not found' });
  res.json({ link, stats: clickStats(link.id) });
});

router.patch('/links/:code', requireAuth, (req, res) => {
  try {
    const { url, title, disabled, expiresAt } = req.body || {};
    const link = updateLink(req.params.code, { longUrl: url, title, disabled, expiresAt });
    if (!link) return res.status(404).json({ error: 'Link not found' });
    res.json({ link });
  } catch (e) {
    res.status(e.status || 400).json({ error: e.message });
  }
});

router.delete('/links/:code', requireAuth, (req, res) => {
  const ok = deleteLink(req.params.code);
  if (!ok) return res.status(404).json({ error: 'Link not found' });
  res.status(204).end();
});

router.get('/links/:code/qrcode.png', requireAuth, async (req, res) => {
  const link = getLinkByCode(req.params.code);
  if (!link) return res.status(404).json({ error: 'Link not found' });
  const base = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const shortUrl = `${base}/${link.code}`;
  res.type('png');
  QRCode.toFileStream(res, shortUrl, { width: 320, margin: 1 });
});

router.get('/export', requireAuth, (req, res) => {
  const data = allLinksWithClicks();
  res.setHeader('Content-Disposition', 'attachment; filename="sunny-thicket-export.json"');
  res.json({ exportedAt: new Date().toISOString(), ...data });
});

router.post('/import/bitly-csv', requireAuth, (req, res) => {
  const csvText = typeof req.body === 'string' ? req.body : req.body?.csv;
  if (!csvText) {
    return res.status(400).json({ error: 'Send the CSV file content as the request body (text/csv) or as { "csv": "..." } JSON.' });
  }
  try {
    const result = importBitlyCsv(csvText);
    res.json(result);
  } catch (e) {
    res.status(e.status || 400).json({ error: e.message });
  }
});

module.exports = router;
