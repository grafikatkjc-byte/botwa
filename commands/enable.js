const store = require('../lib/store');

module.exports = {
  name: 'enable',
  description: 'Aktifkan bot di grup ini',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    store.setBotEnabled(ctx.from, true);
    await ctx.reply('Bot aktif kembali di grup ini.');
  },
};
