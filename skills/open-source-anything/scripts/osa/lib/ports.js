'use strict';
const net = require('node:net');

function canListen(port, host) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.listen({ port, host, exclusive: true }, () => server.close(() => resolve(true)));
  });
}

// Free means nothing is listening on all interfaces or on 127.0.0.1. Some systems
// allow both binds at once, and an app bound to 127.0.0.1 alone would still clash.
async function isFree(port) {
  return (await canListen(port)) && canListen(port, '127.0.0.1');
}

async function findFreePort(preferred, taken = new Set()) {
  for (let port = preferred; port < preferred + 200 && port < 65536; port++) {
    if (!taken.has(port) && (await isFree(port))) return port;
  }
  throw new Error(`No free port found near ${preferred}`);
}

module.exports = { isFree, findFreePort };
