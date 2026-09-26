const express = require('express');
const db = require('../db');
const { randomSlug, isValidCustomSlug } = require('../lib/slug');

const router = express.Router();

function linkWithCount(link) {
  const { count } = db
    .prepare('SELECT COUNT(*) AS count FROM clicks WHERE link_id = ?')
    .get(link.id);
  return { ...link, click_count: count, short_url: `${process.env.BASE_URL}/${link.slug}` };
}

// List all links, most recent first.
router.get('/', (req, res) => {
  const links = db.prepare('SELECT * FROM links ORDER BY created_at DESC').all();
  res.json(links.map(linkWithCount));
});

// Create a link.
router.post('/', (req, res) => {
  const { long_url, slug, title } = req.body || {};

  if (!long_url || typeof long_url !== 'string') {
    return res.status(400).json({ error: 'long_url is required' });
  }
  let parsed;
  try {
    parsed = new URL(long_url);
  } catch {
    return res.status(400).json({ error: 'long_url must be a valid, absolute URL' });
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({ error: 'long_url must use http or https' });
  }

  let finalSlug = slug ? slug.trim() : '';
  if (finalSlug) {
    if (!isValidCustomSlug(finalSlug)) {
      return res.status(400).json({ error: 'slug must be 3-64 chars: letters, numbers, - or _, and not reserved' });
    }
    const existing = db.prepare('SELECT id FROM links WHERE slug = ?').get(finalSlug);
    if (existing) return res.status(409).json({ error: 'slug already taken' });
  } else {
    do {
      finalSlug = randomSlug();
    } while (db.prepare('SELECT id FROM links WHERE slug = ?').get(finalSlug));
  }

  const info = db
    .prepare('INSERT INTO links (slug, long_url, title) VALUES (?, ?, ?)')
    .run(finalSlug, parsed.toString(), title ? String(title).slice(0, 256) : null);

  const link = db.prepare('SELECT * FROM links WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(linkWithCount(link));
});

// Delete a link (and its clicks, via FK cascade).
router.delete('/:slug', (req, res) => {
  const link = db.prepare('SELECT id FROM links WHERE slug = ?').get(req.params.slug);
  if (!link) return res.status(404).json({ error: 'not found' });
  db.prepare('DELETE FROM links WHERE id = ?').run(link.id);
  res.status(204).end();
});

module.exports = router;
