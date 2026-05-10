module.exports = {
  name: 'setdeskgc',
  description: 'Ubah deskripsi grup. Pakai: #setdeskgc <teks>',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (!ctx.botIsAdmin) return ctx.reply('Bot belum admin grup.');
    if (!ctx.text) return ctx.reply('Teks kosong. Contoh: #setdeskgc Grup ini untuk komunitas X.');
    await ctx.sock.groupUpdateDescription(ctx.from, ctx.text);
    await ctx.reply('Deskripsi grup diperbarui.');
  },
};
