const express = require('express');
const { getLinkByCode, isLive, recordClick } = require('../models/links');
const { hashIp, clientIp, parseUserAgent } = require('../lib/clickMeta');

const router = express.Router();

router.get('/:code', (req, res, next) => {
  const link = getLinkByCode(req.params.code);
  if (!link) return next();

  if (!isLive(link)) {
    return res.status(404).render('gone', { link });
  }

  const { browser, os, deviceType } = parseUserAgent(req.headers['user-agent']);
  recordClick(link.id, {
    referrer: req.headers['referer'] || req.headers['referrer'] || '',
    deviceType,
    browser,
    os,
    ipHash: hashIp(clientIp(req)),
  });

  res.redirect(302, link.long_url);
});

module.exports = router;
