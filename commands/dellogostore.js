const store = require('../lib/store');

module.exports = {
  name: 'dellogostore',
  description: 'Hapus logo toko',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    store.delLogo(ctx.from);
    await ctx.reply('Logo toko dihapus.');
  },
};
