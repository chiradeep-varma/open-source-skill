const crypto = require('crypto');

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function checkPassword(candidate) {
  return timingSafeEqual(candidate || '', process.env.ADMIN_PASSWORD || '');
}

/**
 * Redirects browser requests to /login, returns 401 JSON for API requests.
 * Uses req.originalUrl (not req.path) because this middleware runs inside
 * routers mounted at a sub-path (e.g. /api/links), where req.path is
 * rewritten relative to the mount point.
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.authed) return next();
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  return res.redirect('/login');
}

module.exports = { checkPassword, requireAuth };
