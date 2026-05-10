module.exports = {
  name: 'setnamegc',
  description: 'Ubah nama grup. Pakai: #setnamegc <nama baru>',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (!ctx.botIsAdmin) return ctx.reply('Bot belum admin grup.');
    if (!ctx.text) return ctx.reply('Nama kosong.');
    await ctx.sock.groupUpdateSubject(ctx.from, ctx.text);
    await ctx.reply('Nama grup diperbarui menjadi: ' + ctx.text);
  },
};
