const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const SLUG_RE = /^[a-zA-Z0-9_-]{1,64}$/;
const RESERVED = new Set(['api', 'login', 'logout', 'static', 'favicon.ico']);

function randomCode(length = 6) {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

function isValidSlug(slug) {
  return SLUG_RE.test(slug) && !RESERVED.has(slug.toLowerCase());
}

module.exports = { randomCode, isValidSlug, RESERVED };
