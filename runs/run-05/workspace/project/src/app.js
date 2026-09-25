const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');

require('./db'); // ensures schema exists before anything else runs

for (const required of ['ADMIN_PASSWORD', 'SESSION_SECRET', 'BASE_URL']) {
  if (!process.env[required]) {
    throw new Error(`Missing required env var ${required}. Copy .env.example to .env and fill it in.`);
  }
}

const { requireAuth } = require('./auth');
const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const linkRoutes = require('./routes/links');
const statsRoutes = require('./routes/stats');
const qrRoutes = require('./routes/qr');
const redirectRoutes = require('./routes/redirect');

function createApp() {
  const app = express();
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(
    cookieSession({
      name: 'trimly.sess',
      secret: process.env.SESSION_SECRET,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    })
  );

  // Public: auth pages, and the QR image for any existing slug.
  app.use('/', authRoutes);
  app.use('/qr', qrRoutes);

  // Everything that manages links requires the admin session
  // (the auth check lives inside pageRoutes so it doesn't shadow public routes mounted after it).
  app.use('/', pageRoutes);
  app.use('/api/links', requireAuth, linkRoutes);
  app.use('/api/stats', requireAuth, statsRoutes);

  // Public redirect handler — registered last so it only catches
  // single-segment paths not already matched above (e.g. not /api/*, /dashboard/*).
  app.use('/', redirectRoutes);

  app.use((req, res) => {
    res.status(404).render('not-found', { slug: req.path.replace(/^\//, '') });
  });

  return app;
}

module.exports = { createApp };
