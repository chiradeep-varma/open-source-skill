const crypto = require('crypto');
const { UAParser } = require('ua-parser-js');
const geoip = require('geoip-lite');

/**
 * Derives everything we store about a click from the raw request,
 * without ever persisting the visitor's raw IP address.
 */
function deriveClickMeta(req, sessionSecret) {
  const ua = new UAParser(req.headers['user-agent'] || '').getResult();
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const geo = ip ? geoip.lookup(ip) : null;

  return {
    referrer: (req.headers['referer'] || req.headers['referrer'] || null)?.slice(0, 512) || null,
    browser: ua.browser.name || 'Unknown',
    os: ua.os.name || 'Unknown',
    device_type: ua.device.type || 'desktop',
    country: geo?.country || 'Unknown',
    ip_hash: ip ? hashIp(ip, sessionSecret) : null,
  };
}

function hashIp(ip, secret) {
  return crypto.createHmac('sha256', secret).update(ip).digest('hex');
}

module.exports = { deriveClickMeta };
