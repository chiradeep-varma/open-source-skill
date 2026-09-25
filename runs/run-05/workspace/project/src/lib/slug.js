const crypto = require('crypto');

const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/l/I
const SLUG_RESERVED = new Set(['api', 'login', 'logout', 'dashboard', 'static', 'assets', 'favicon.ico']);

function randomSlug(length = 7) {
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

function isValidCustomSlug(slug) {
  return typeof slug === 'string' && /^[a-zA-Z0-9_-]{3,64}$/.test(slug) && !SLUG_RESERVED.has(slug);
}

module.exports = { randomSlug, isValidCustomSlug };
