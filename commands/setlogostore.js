const { getImageBuffer } = require('../lib/media');
const store = require('../lib/store');

module.exports = {
  name: 'setlogostore',
  description: 'Simpan logo toko. Reply/kirim gambar + #setlogostore',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    const buf = await getImageBuffer(ctx);
    if (!buf) return ctx.reply('Kirim atau reply gambar dengan caption #setlogostore');
    store.setLogo(ctx.from, buf, 'jpg');
    await ctx.reply('Logo toko disimpan. Akan tampil di header saat #list.');
  },
};
