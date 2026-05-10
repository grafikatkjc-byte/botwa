module.exports = {
  name: 'open',
  description: 'Buka grup (semua member bisa chat)',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (!ctx.botIsAdmin) return ctx.reply('Bot belum admin grup.');
    await ctx.sock.groupSettingUpdate(ctx.from, 'not_announcement');
    await ctx.reply('Grup dibuka. Semua member bisa mengirim pesan.');
  },
};
