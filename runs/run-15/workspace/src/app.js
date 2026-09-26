'use strict';

const path = require('path');
const express = require('express');
const session = require('express-session');
const { createPublicRouter } = require('./routes/public');
const { createAdminRouter } = require('./routes/admin');

function createApp(db, config) {
  if (!config.sessionSecret) {
    throw new Error('SESSION_SECRET is not set. Refusing to start without one — set it in your .env file.');
  }

  const app = express();
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.disable('x-powered-by');

  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      name: 'velvet_acorn_sid',
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.cookieSecure,
        maxAge: 1000 * 60 * 60 * 12,
      },
    })
  );

  app.use('/admin', createAdminRouter(db, config));
  app.use('/', createPublicRouter(db, config));

  app.use((req, res) => {
    res.status(404).render('public/not-found', {
      pageTitle: 'Not found',
      siteTitle: config.siteTitle,
      siteDescription: config.siteDescription,
      isAdmin: Boolean(req.session && req.session.userId),
    });
  });

  return app;
}

module.exports = { createApp };
