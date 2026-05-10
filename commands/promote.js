module.exports = {
  name: 'promote',
  description: 'Jadikan member admin. Pakai: #promote @user (atau reply)',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (!ctx.botIsAdmin) return ctx.reply('Bot belum admin grup.');

    const info = ctx.msg.message?.extendedTextMessage?.contextInfo;
    const target = info?.mentionedJid?.[0] || info?.participant;
    if (!target) return ctx.reply('Mention atau reply user yang mau dijadikan admin.');

    try {
      await ctx.sock.groupParticipantsUpdate(ctx.from, [target], 'promote');
      await ctx.reply(`@${target.split('@')[0]} dipromosikan jadi admin.`);
    } catch (e) {
      await ctx.reply('Gagal promote: ' + e.message);
    }
  },
};
