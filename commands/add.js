// Tambahkan nomor ke grup. Pakai: #add 6281234567890 [62...]
function toJid(num) {
  const n = String(num).replace(/[^0-9]/g, '');
  return n ? `${n}@s.whatsapp.net` : null;
}

module.exports = {
  name: 'add',
  description: 'Tambah member. Pakai: #add 6281234567890',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (!ctx.botIsAdmin) return ctx.reply('Bot belum admin grup.');

    const jids = ctx.args.map(toJid).filter(Boolean);
    if (!jids.length) return ctx.reply('Nomor tidak valid. Contoh: #add 6281234567890');

    try {
      const res = await ctx.sock.groupParticipantsUpdate(ctx.from, jids, 'add');
      const lines = res.map(r => `• ${r.jid.split('@')[0]} → ${r.status === '200' ? 'OK' : 'GAGAL (' + r.status + ')'}`);
      await ctx.reply('Hasil tambah member:\n' + lines.join('\n'));
    } catch (e) {
      await ctx.reply('Gagal tambah: ' + e.message);
    }
  },
};
