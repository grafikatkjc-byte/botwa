const { getImageBuffer } = require('../lib/media');

module.exports = {
  name: 'setppgc',
  description: 'Ubah foto profil grup. Reply/kirim gambar + #setppgc',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (!ctx.botIsAdmin) return ctx.reply('Bot belum admin grup.');

    const buf = await getImageBuffer(ctx);
    if (!buf) return ctx.reply('Kirim atau reply gambar dengan caption #setppgc');

    try {
      await ctx.sock.updateProfilePicture(ctx.from, buf);
      await ctx.reply('Foto profil grup diperbarui.');
    } catch (e) {
      await ctx.reply('Gagal ubah foto: ' + e.message);
    }
  },
};
