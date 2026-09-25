require('dotenv').config();

const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const apiRoutes = require('./routes/api');
const redirectRoutes = require('./routes/redirect');

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.error(
    'Missing required SESSION_SECRET environment variable. Refusing to start.\n' +
      'Generate one with `openssl rand -hex 32` and set it in your .env file — see .env.example.'
  );
  process.exit(1);
}

require('./auth'); // validates ADMIN_PASSWORD is set, exits early if not

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', process.env.TRUST_PROXY === 'true');

app.use(
  cookieSession({
    name: 'session',
    keys: [SESSION_SECRET],
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: true,
  })
);

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(authRoutes);
app.use('/api', apiRoutes);
app.use(dashboardRoutes);
app.use(redirectRoutes);

app.use((req, res) => {
  res.status(404).render('gone', { link: null });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (req.path.startsWith('/api/')) {
    return res.status(err.status || 500).json({ error: err.message || 'Internal error' });
  }
  res.status(err.status || 500).send('Something went wrong.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`sunny-thicket listening on http://localhost:${PORT}`);
});

module.exports = app;
