// Penyimpanan JSON per-grup. Menyimpan:
// - items       : daftar task/order
// - store       : { name, tagline, logoPath, labels: { pending, proses, done } }
// - botEnabled  : bot aktif di grup ini
// - autoCloseAt : timestamp untuk auto-close grup
const fs = require('fs');
const path = require('path');
const { DATA_DIR, LOGO_DIR, LISTS_FILE } = require('./paths');

const FILE = LISTS_FILE;

function ensureFs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LOGO_DIR)) fs.mkdirSync(LOGO_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '{}');
}

function readAll() {
  ensureFs();
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8') || '{}'); } catch { return {}; }
}
function writeAll(data) { ensureFs(); fs.writeFileSync(FILE, JSON.stringify(data, null, 2)); }

function defaultGroup() {
  return {
    nextId: 1,
    items: [],
    store: {
      name: '',
      tagline: '',
      logoPath: '',
      labels: { pending: 'PENDING', proses: 'PROSES', done: 'DONE' },
    },
    botEnabled: true,
    autoCloseAt: 0,
  };
}

function getGroup(jid) {
  const all = readAll();
  if (!all[jid]) all[jid] = defaultGroup();
  // migrasi data lama
  all[jid].store ||= defaultGroup().store;
  all[jid].store.labels ||= defaultGroup().store.labels;
  if (typeof all[jid].botEnabled !== 'boolean') all[jid].botEnabled = true;
  return { all, group: all[jid] };
}

function safeFileName(jid) { return jid.replace(/[^a-z0-9]/gi, '_'); }

const store = {
  // ---- items ----
  add(jid, text, by, customerName = '') {
    const { all, group } = getGroup(jid);
    const item = { id: group.nextId++, text, status: 'pending', by, customerName, at: Date.now() };
    group.items.push(item); writeAll(all); return item;
  },
  remove(jid, id) {
    const { all, group } = getGroup(jid);
    const idx = group.items.findIndex(x => x.id === id);
    if (idx < 0) return null;
    const [r] = group.items.splice(idx, 1); writeAll(all); return r;
  },
  update(jid, id, text) {
    const { all, group } = getGroup(jid);
    const it = group.items.find(x => x.id === id);
    if (!it) return null;
    it.text = text; writeAll(all); return it;
  },
  setStatus(jid, id, status) {
    const { all, group } = getGroup(jid);
    const it = group.items.find(x => x.id === id);
    if (!it) return null;
    it.status = status; writeAll(all); return it;
  },
  list(jid) { return getGroup(jid).group.items.slice(); },
  clearItems(jid) {
    const { all, group } = getGroup(jid);
    group.items = []; group.nextId = 1; writeAll(all);
  },

  // ---- store config ----
  getConfig(jid) { return getGroup(jid).group.store; },
  setStoreName(jid, name) {
    const { all, group } = getGroup(jid);
    group.store.name = name; writeAll(all);
  },
  setTagline(jid, t) {
    const { all, group } = getGroup(jid);
    group.store.tagline = t; writeAll(all);
  },
  setLabel(jid, status, label) {
    const { all, group } = getGroup(jid);
    if (!group.store.labels[status]) return false;
    group.store.labels[status] = label; writeAll(all); return true;
  },
  setLogo(jid, buffer, ext = 'jpg') {
    ensureFs();
    const file = path.join(LOGO_DIR, `${safeFileName(jid)}.${ext}`);
    fs.writeFileSync(file, buffer);
    const { all, group } = getGroup(jid);
    group.store.logoPath = file; writeAll(all); return file;
  },
  delLogo(jid) {
    const { all, group } = getGroup(jid);
    if (group.store.logoPath && fs.existsSync(group.store.logoPath)) {
      try { fs.unlinkSync(group.store.logoPath); } catch (_) {}
    }
    group.store.logoPath = ''; writeAll(all);
  },
  deleteStore(jid) {
    const all = readAll();
    // hapus logo file juga
    const lp = all[jid]?.store?.logoPath;
    if (lp && fs.existsSync(lp)) { try { fs.unlinkSync(lp); } catch (_) {} }
    all[jid] = defaultGroup(); writeAll(all);
  },

  // ---- bot enable ----
  isBotEnabled(jid) { return getGroup(jid).group.botEnabled; },
  setBotEnabled(jid, v) {
    const { all, group } = getGroup(jid);
    group.botEnabled = !!v; writeAll(all);
  },

  // ---- auto-close ----
  setAutoCloseAt(jid, ts) {
    const { all, group } = getGroup(jid);
    group.autoCloseAt = ts || 0; writeAll(all);
  },
  getAutoCloseAt(jid) { return getGroup(jid).group.autoCloseAt || 0; },
  allGroups() { return Object.keys(readAll()); },
};

module.exports = store;
