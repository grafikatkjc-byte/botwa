const store = require('../lib/store');

module.exports = {
  name: 'setnamestore',
  aliases: ['setname'],
  description: 'Ubah nama toko. Pakai: #setnamestore <nama>',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    const name = ctx.text.trim();
    if (!name) return ctx.reply('Contoh: #setnamestore Istimewa Store');
    store.setStoreName(ctx.from, name);
    await ctx.reply(`Nama toko diubah ke: ${name}`);
  },
};
