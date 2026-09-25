import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = process.env.DATA_PATH || path.join(__dirname, '..', 'data', 'rustic-fjord.db');

openDb(dataPath);
console.log(`Database ready at ${dataPath}`);
