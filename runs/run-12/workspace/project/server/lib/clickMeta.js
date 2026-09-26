const crypto = require('crypto');
const { UAParser } = require('ua-parser-js');

const SALT = process.env.IP_HASH_SALT || crypto.randomBytes(16).toString('hex');
if (!process.env.IP_HASH_SALT) {
  console.warn(
    'IP_HASH_SALT is not set — using a random salt generated at startup. ' +
      'Unique-visitor counts will reset on restart. Set IP_HASH_SALT in .env for stable hashing.'
  );
}

function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(SALT + ip).digest('hex').slice(0, 32);
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || null;
}

function parseUserAgent(uaString) {
  const parser = new UAParser(uaString || '');
  const result = parser.getResult();
  return {
    browser: result.browser.name || 'Unknown',
    os: result.os.name || 'Unknown',
    deviceType: result.device.type || 'desktop',
  };
}

module.exports = { hashIp, clientIp, parseUserAgent };
