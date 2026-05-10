const autoClose = require('../lib/autoClose');

// Parse durasi: "30m", "2h", "1d", atau angka (menit)
function parseDuration(s) {
  if (!s) return 0;
  s = s.toLowerCase().trim();
  if (s === 'off' || s === '0') return -1;
  const m = s.match(/^(\d+)\s*(m|menit|min|h|j|jam|d|hari)?$/);
  if (!m) return 0;
  const n = parseInt(m[1], 10);
  const unit = m[2] || 'm';
  const mult = { m: 60, menit: 60, min: 60, h: 3600, j: 3600, jam: 3600, d: 86400, hari: 86400 }[unit] || 60;
  return n * mult * 1000;
}

module.exports = {
  name: 'setautoclose',
  description: 'Jadwalkan grup ditutup otomatis. Pakai: #setautoclose 30m | 2h | 1d | off',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (!ctx.botIsAdmin) return ctx.reply('Bot belum admin grup.');

    const arg = ctx.args[0];
    if (!arg) return ctx.reply('Contoh: #setautoclose 2h | 30m | 1d | off');
    const d = parseDuration(arg);
    if (d === -1) { autoClose.cancel(ctx.from); return ctx.reply('Auto-close dibatalkan.'); }
    if (d <= 0) return ctx.reply('Format salah. Contoh: 30m, 2h, 1d.');

    const ts = Date.now() + d;
    autoClose.schedule(ctx.sock, ctx.from, ts);
    await ctx.reply(`Grup akan otomatis ditutup pada:\n${new Date(ts).toLocaleString('id-ID')}`);
  },
};
