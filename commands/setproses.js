const store = require('../lib/store');

module.exports = {
  name: 'setproses',
  description: 'Ubah label status PROSES. Pakai: #setproses <label baru>',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    const label = ctx.text.trim();
    if (!label) return ctx.reply('Contoh: #setproses Sedang Dikerjakan');
    store.setLabel(ctx.from, 'proses', label);
    await ctx.reply(`Label untuk status PROSES diubah ke: ${label}`);
  },
};
