'use strict';
// Where projects live. One predictable folder that people don't otherwise touch,
// so the launcher can find every project without any configuration.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const FOLDER_NAME = 'open-source-anything';

function projectsHome(env = process.env) {
  if (env.OSA_HOME) return path.resolve(env.OSA_HOME);
  const home = os.homedir();
  const documents = path.join(home, 'Documents');
  return path.join(fs.existsSync(documents) ? documents : home, FOLDER_NAME);
}

module.exports = { projectsHome, FOLDER_NAME };
