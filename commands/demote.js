module.exports = {
  name: 'demote',
  description: 'Turunkan admin jadi member. Pakai: #demote @user (atau reply)',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (!ctx.botIsAdmin) return ctx.reply('Bot belum admin grup.');

    const info = ctx.msg.message?.extendedTextMessage?.contextInfo;
    const target = info?.mentionedJid?.[0] || info?.participant;
    if (!target) return ctx.reply('Mention atau reply admin yang mau diturunkan.');

    try {
      await ctx.sock.groupParticipantsUpdate(ctx.from, [target], 'demote');
      await ctx.reply(`@${target.split('@')[0]} diturunkan dari admin.`);
    } catch (e) {
      await ctx.reply('Gagal demote: ' + e.message);
    }
  },
};
