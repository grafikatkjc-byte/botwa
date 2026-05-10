module.exports = {
  name: 'revoke',
  description: 'Reset / ganti link invite grup',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (!ctx.botIsAdmin) return ctx.reply('Bot belum admin grup.');
    const code = await ctx.sock.groupRevokeInvite(ctx.from);
    await ctx.reply(`Link grup di-reset.\nLink baru: https://chat.whatsapp.com/${code}`);
  },
};
