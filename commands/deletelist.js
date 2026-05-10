const store = require('../lib/store');

module.exports = {
  name: 'deletelist',
  aliases: ['dellist', 'del'],
  description: 'Hapus item. Pakai: #deletelist <id>',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');

    const id = parseInt(ctx.args[0], 10);
    if (!id) return ctx.reply('ID tidak valid. Contoh: #deletelist 3');

    const r = store.remove(ctx.from, id);
    if (!r) return ctx.reply(`Item #${id} tidak ditemukan.`);
    await ctx.reply(`Dihapus #${r.id}\n» ${r.text}`);
  },
};
