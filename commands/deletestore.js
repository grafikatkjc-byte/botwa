const store = require('../lib/store');

module.exports = {
  name: 'deletestore',
  description: 'Reset semua data toko (daftar, nama, logo)',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (ctx.args[0] !== 'confirm') {
      return ctx.reply(
        'Aksi ini menghapus SEMUA data toko di grup ini (daftar, nama, logo, label).\n' +
        'Untuk konfirmasi, ketik: *#deletestore confirm*'
      );
    }
    store.deleteStore(ctx.from);
    await ctx.reply('Semua data toko di grup ini telah dihapus.');
  },
};
