const crypto = require('crypto');

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const API_TOKEN = process.env.API_TOKEN;

if (!ADMIN_PASSWORD) {
  console.error(
    'Missing required ADMIN_PASSWORD environment variable. Refusing to start with no admin credential.\n' +
      'Set ADMIN_PASSWORD (and optionally ADMIN_USER) in your .env file — see .env.example.'
  );
  process.exit(1);
}

function timingSafeEquals(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function checkCredentials(username, password) {
  return timingSafeEquals(username, ADMIN_USER) && timingSafeEquals(password, ADMIN_PASSWORD);
}

function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();

  const authHeader = req.headers.authorization || '';
  if (API_TOKEN && authHeader.startsWith('Bearer ') && timingSafeEquals(authHeader.slice(7), API_TOKEN)) {
    return next();
  }

  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
}

module.exports = { checkCredentials, requireAuth, ADMIN_USER };
