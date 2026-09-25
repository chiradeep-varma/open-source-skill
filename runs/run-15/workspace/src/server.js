'use strict';

require('dotenv').config();

const { openDb } = require('./db');
const { createApp } = require('./app');

const config = {
  siteTitle: process.env.SITE_TITLE || 'Project Status',
  siteDescription: process.env.SITE_DESCRIPTION || 'Live status and incident history.',
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  sessionSecret: process.env.SESSION_SECRET,
  cookieSecure: process.env.COOKIE_SECURE === 'true',
};

const db = openDb();
const app = createApp(db, config);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`velvet-acorn listening on http://localhost:${port}`);
});
