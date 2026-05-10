// Scheduler auto-close grup. Menjadwalkan setting 'announcement' pada
// waktu yang tersimpan di store, dan mampu me-restore timer saat restart.
const store = require('./store');
const logger = require('./logger');

const timers = new Map(); // jid -> Timeout

async function closeNow(sock, jid) {
  try {
    await sock.groupSettingUpdate(jid, 'announcement');
    await sock.sendMessage(jid, { text: 'Grup otomatis ditutup (hanya admin yang bisa chat).' });
    logger.ok(`Auto-close dieksekusi: ${jid}`);
  } catch (e) {
    logger.err(`Auto-close gagal (${jid}):`, e.message);
  } finally {
    store.setAutoCloseAt(jid, 0);
    timers.delete(jid);
  }
}

function schedule(sock, jid, ts) {
  // batalkan timer lama jika ada
  if (timers.has(jid)) { clearTimeout(timers.get(jid)); timers.delete(jid); }
  const delay = Math.max(0, ts - Date.now());
  if (delay === 0) { closeNow(sock, jid); return; }
  const t = setTimeout(() => closeNow(sock, jid), delay);
  timers.set(jid, t);
  store.setAutoCloseAt(jid, ts);
}

function cancel(jid) {
  if (timers.has(jid)) { clearTimeout(timers.get(jid)); timers.delete(jid); }
  store.setAutoCloseAt(jid, 0);
}

function restoreAll(sock) {
  const now = Date.now();
  for (const jid of store.allGroups()) {
    const ts = store.getAutoCloseAt(jid);
    if (!ts) continue;
    if (ts <= now) closeNow(sock, jid);
    else schedule(sock, jid, ts);
  }
}

module.exports = { schedule, cancel, restoreAll };
