const fs = require('fs');
const store = require('../lib/store');

const ICON = { pending: '⏳', proses: '🔄', done: '✅' };

module.exports = {
  name: 'list',
  aliases: ['setlist', 'showlist'],
  description: 'Tampilkan daftar toko',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    const cfg = store.getConfig(ctx.from);
    const items = store.list(ctx.from);

    const bucket = { pending: [], proses: [], done: [] };
    for (const it of items) (bucket[it.status] || bucket.pending).push(it);

    let header = '';
    if (cfg.name) header += `*${cfg.name}*\n`;
    if (cfg.tagline) header += `_${cfg.tagline}_\n`;
    if (header) header += '────────────────\n';

    let body = header;
    if (!items.length) {
      body += 'Daftar kosong.\nTambah dengan: #addlist <teks>';
    } else {
      body += `Total: ${items.length}  |  ${cfg.labels.pending}: ${bucket.pending.length}  ${cfg.labels.proses}: ${bucket.proses.length}  ${cfg.labels.done}: ${bucket.done.length}\n\n`;
      for (const key of ['proses', 'pending', 'done']) {
        if (!bucket[key].length) continue;
        body += `*${cfg.labels[key]}*\n`;
        for (const it of bucket[key]) body += `${ICON[key]} #${it.id}  ${it.text}\n`;
        body += '\n';
      }
      body += 'Perintah: #addlist | #proses <id> | #done <id> | #updatelist <id> <teks> | #deletelist <id>';
    }

    // Kirim dengan logo jika ada
    if (cfg.logoPath && fs.existsSync(cfg.logoPath)) {
      try {
        const buf = fs.readFileSync(cfg.logoPath);
        return ctx.sock.sendMessage(ctx.from, { image: buf, caption: body.trim() }, { quoted: ctx.msg });
      } catch (_) { /* fallback ke teks */ }
    }
    await ctx.reply(body.trim());
  },
};
