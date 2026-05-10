module.exports = {
  name: 'close',
  description: 'Tutup grup (hanya admin yang bisa chat)',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (!ctx.botIsAdmin) return ctx.reply('Bot belum admin grup.');
    await ctx.sock.groupSettingUpdate(ctx.from, 'announcement');
    await ctx.reply('Grup ditutup. Hanya admin yang bisa mengirim pesan.');
  },
};
