const store = require('../lib/store');

module.exports = {
  name: 'updatelist',
  description: 'Ubah teks item. Pakai: #updatelist <id> <teks baru>',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    const id = parseInt(ctx.args[0], 10);
    const newText = ctx.args.slice(1).join(' ').trim();
    if (!id || !newText) return ctx.reply('Contoh: #updatelist 2 Kaos XL hitam 5 pcs');

    const it = store.update(ctx.from, id, newText);
    if (!it) return ctx.reply(`Item #${id} tidak ditemukan.`);
    await ctx.reply(`Diperbarui #${it.id}\n» ${it.text}`);
  },
};
