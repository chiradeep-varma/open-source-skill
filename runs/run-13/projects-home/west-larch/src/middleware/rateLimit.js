/** Minimal in-memory rate limiter for auth endpoints — fine for a single-process self-hosted app. */
function rateLimit({ windowMs, max }) {
  const hits = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now - entry.start > windowMs) {
      hits.set(key, { start: now, count: 1 });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      return res.status(429).render('error', {
        title: 'Too many attempts',
        message: 'Slow down and try again in a few minutes.',
      });
    }
    next();
  };
}

module.exports = { rateLimit };
