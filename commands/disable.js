const store = require('../lib/store');

module.exports = {
  name: 'disable',
  description: 'Nonaktifkan bot di grup ini',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    store.setBotEnabled(ctx.from, false);
    await ctx.reply('Bot dinonaktifkan di grup ini. Ketik #enable untuk mengaktifkan kembali.');
  },
};
