const express = require('express');
const db = require('../db');

const router = express.Router();

function getLinkOr404(req, res) {
  const link = db.prepare('SELECT * FROM links WHERE slug = ?').get(req.params.slug);
  if (!link) {
    res.status(404).json({ error: 'not found' });
    return null;
  }
  return link;
}

function topN(rows, key, n = 10) {
  const counts = new Map();
  for (const row of rows) {
    const k = row[key] || 'Unknown';
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

// JSON stats for a single link.
router.get('/:slug', (req, res) => {
  const link = getLinkOr404(req, res);
  if (!link) return;

  const clicks = db.prepare('SELECT * FROM clicks WHERE link_id = ? ORDER BY clicked_at ASC').all(link.id);

  const byDay = new Map();
  for (const c of clicks) {
    const day = c.clicked_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) || 0) + 1);
  }

  res.json({
    slug: link.slug,
    long_url: link.long_url,
    total_clicks: clicks.length,
    clicks_by_day: [...byDay.entries()].map(([date, count]) => ({ date, count })),
    top_referrers: topN(clicks, 'referrer'),
    top_browsers: topN(clicks, 'browser'),
    top_os: topN(clicks, 'os'),
    top_devices: topN(clicks, 'device_type'),
    top_countries: topN(clicks, 'country'),
  });
});

// CSV export of raw click rows for a link.
router.get('/:slug/export.csv', (req, res) => {
  const link = getLinkOr404(req, res);
  if (!link) return;

  const clicks = db.prepare('SELECT * FROM clicks WHERE link_id = ? ORDER BY clicked_at ASC').all(link.id);
  const header = 'clicked_at,referrer,browser,os,device_type,country\n';
  const rows = clicks.map((c) =>
    [c.clicked_at, c.referrer, c.browser, c.os, c.device_type, c.country]
      .map((v) => `"${(v ?? '').toString().replace(/"/g, '""')}"`)
      .join(',')
  );

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${link.slug}-clicks.csv"`);
  res.send(header + rows.join('\n'));
});

module.exports = router;
