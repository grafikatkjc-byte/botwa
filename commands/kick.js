module.exports = {
  name: 'kick',
  description: 'Keluarkan member. Pakai: .kick @user (atau reply pesan target)',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Perintah hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');
    if (!ctx.botIsAdmin) return ctx.reply('Bot belum admin grup.');

    const ctxInfo = ctx.msg.message?.extendedTextMessage?.contextInfo;
    let target = ctxInfo?.mentionedJid?.[0] || ctxInfo?.participant;

    if (!target) return ctx.reply('Mention atau reply pesan user yang mau dikick.');

    try {
      await ctx.sock.groupParticipantsUpdate(ctx.from, [target], 'remove');
      await ctx.reply('Berhasil mengeluarkan @' + target.split('@')[0]);
    } catch (e) {
      await ctx.reply('Gagal kick: ' + e.message);
    }
  },
};
