'use strict';
const net = require('node:net');

function isFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.listen({ port, exclusive: true }, () => server.close(() => resolve(true)));
  });
}

async function findFreePort(preferred, taken = new Set()) {
  for (let port = preferred; port < preferred + 200 && port < 65536; port++) {
    if (!taken.has(port) && (await isFree(port))) return port;
  }
  throw new Error(`No free port found near ${preferred}`);
}

module.exports = { isFree, findFreePort };
