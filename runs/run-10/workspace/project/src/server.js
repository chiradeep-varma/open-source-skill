require('dotenv').config();
const path = require('node:path');
const express = require('express');
const session = require('express-session');

require('./db'); // ensures schema + admin seed run before the app starts serving

const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(
  session({
    name: 'formstead.sid',
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  })
);

app.get('/', (req, res) => res.redirect('/admin'));
app.use('/admin', adminRoutes);
app.use('/f', publicRoutes);

app.use((req, res) => res.status(404).send('Not found'));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[formstead] listening on port ${port}`);
});
