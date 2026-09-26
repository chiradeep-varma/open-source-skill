const crypto = require('crypto');

/** Lightweight session-bound CSRF protection, no extra dependency. */
function csrf(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(24).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;

  if (req.method === 'POST') {
    const submitted = req.body && req.body._csrf;
    if (!submitted || submitted !== req.session.csrfToken) {
      return res.status(403).render('error', {
        title: 'Request rejected',
        message: 'Your session expired or the form was resubmitted. Go back and try again.',
      });
    }
  }
  next();
}

module.exports = { csrf };
