const store = require('../lib/store');

module.exports = {
  name: 'proses',
  aliases: ['process'],
  description: 'Tandai item sedang diproses. Pakai: #proses <id>',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    const id = parseInt(ctx.args[0], 10);
    if (!id) return ctx.reply('ID tidak valid. Contoh: #proses 2');

    const it = store.setStatus(ctx.from, id, 'proses');
    if (!it) return ctx.reply(`Item #${id} tidak ditemukan.`);
    const labels = store.getConfig(ctx.from).labels;
    await ctx.reply(`#${it.id} » ${it.text}\nStatus: ${labels.proses}`);
  },
};
