const store = require('../lib/store');

module.exports = {
  name: 'setdone',
  description: 'Ubah label status DONE. Pakai: #setdone <label baru>',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    const label = ctx.text.trim();
    if (!label) return ctx.reply('Contoh: #setdone Sudah Dikirim');
    store.setLabel(ctx.from, 'done', label);
    await ctx.reply(`Label untuk status DONE diubah ke: ${label}`);
  },
};
