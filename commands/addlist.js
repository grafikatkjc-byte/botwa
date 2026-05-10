const store = require('../lib/store');

module.exports = {
  name: 'addlist',
  aliases: ['add_list'],
  description: 'Tambah item ke daftar. Pakai: #addlist <teks>',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    const text = ctx.text.trim();
    if (!text) return ctx.reply('Teks kosong. Contoh: #addlist 10 kaos lengan panjang');

    const item = store.add(ctx.from, text, ctx.sender);
    const labels = store.getConfig(ctx.from).labels;
    await ctx.reply(
      `Ditambahkan #${item.id}\n` +
      `» ${item.text}\n` +
      `Status: ${labels.pending}\n\n` +
      `Ketik *#list* untuk lihat semua.`
    );
  },
};
