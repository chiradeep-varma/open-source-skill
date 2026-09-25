require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');

const { createDb } = require('./db');
const { loadUser } = require('./middleware/auth');
const { csrf } = require('./middleware/csrf');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const publicRoutes = require('./routes/public');

function createApp({ db, sessionSecret, baseUrl }) {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.disable('x-powered-by');

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieSession({
    name: 'session',
    secret: sessionSecret,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    httpOnly: true,
  }));

  app.use(loadUser(db));
  app.use(csrf);

  app.use((req, res, next) => {
    res.locals.baseUrl = baseUrl;
    next();
  });

  app.use(authRoutes(db));
  app.use('/dashboard', dashboardRoutes(db));
  app.use(publicRoutes(db, baseUrl));

  app.use((req, res) => {
    res.status(404).render('error', { title: 'Page not found', message: "There's nothing here." });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', { title: 'Something went wrong', message: 'An unexpected error occurred.' });
  });

  return app;
}

function main() {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret || sessionSecret.length < 16) {
    console.error(
      '\nSESSION_SECRET is missing or too short.\n'
      + 'Set it in .env (see .env.example). Generate one with:\n'
      + '  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"\n',
    );
    process.exit(1);
  }

  const port = Number(process.env.PORT) || 3000;
  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'west-larch.db');

  const db = createDb(dbPath);
  const app = createApp({ db, sessionSecret, baseUrl });

  app.listen(port, () => {
    console.log(`west-larch listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  main();
}

module.exports = { createApp };
