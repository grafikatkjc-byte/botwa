// Helper pusat untuk menentukan direktori penyimpanan data.
// Prioritas:
//   1. config.dataDir (env DATA_DIR)
//   2. /data (HF Persistent Storage) jika writable
//   3. <repo>/data (lokal)
const fs = require('fs');
const path = require('path');
const config = require('../config');

function canWrite(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch { return false; }
}

function resolveDataDir() {
  if (config.dataDir) {
    fs.mkdirSync(config.dataDir, { recursive: true });
    return config.dataDir;
  }
  if (canWrite('/data')) return '/data';
  const local = path.join(__dirname, '..', 'data');
  fs.mkdirSync(local, { recursive: true });
  return local;
}

const DATA_DIR = resolveDataDir();
const AUTH_DIR = path.join(DATA_DIR, 'auth_info');
const LOGO_DIR = path.join(DATA_DIR, 'logos');
const LISTS_FILE = path.join(DATA_DIR, 'lists.json');

for (const d of [AUTH_DIR, LOGO_DIR]) fs.mkdirSync(d, { recursive: true });

module.exports = { DATA_DIR, AUTH_DIR, LOGO_DIR, LISTS_FILE };
