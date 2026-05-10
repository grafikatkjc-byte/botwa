module.exports = {
  name: 'tagall',
  aliases: ['everyone'],
  description: 'Mention semua anggota grup (admin only)',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Perintah hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');

    const meta = await ctx.sock.groupMetadata(ctx.from);
    const members = meta.participants.map(p => p.id);
    const note = ctx.text || 'Kumpul, semuanya!';

    let body = `*Pengumuman*\n${note}\n\n`;
    for (const m of members) body += `@${m.split('@')[0]}\n`;

    await ctx.sock.sendMessage(ctx.from, {
      text: body.trim(),
      mentions: members,
    }, { quoted: ctx.msg });
  },
};
