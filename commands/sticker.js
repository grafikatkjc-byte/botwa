const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const config = require('../config');

module.exports = {
  name: 'sticker',
  aliases: ['s', 'stiker'],
  description: 'Konversi gambar/video pendek menjadi stiker. Kirim / reply media dengan .sticker',
  run: async (ctx) => {
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const direct = ctx.msg.message?.imageMessage || ctx.msg.message?.videoMessage;
    const qImg = quoted?.imageMessage || quoted?.videoMessage;

    const mediaMsg = direct
      ? ctx.msg
      : qImg
      ? { message: quoted, key: ctx.msg.message.extendedTextMessage.contextInfo }
      : null;

    if (!mediaMsg) return ctx.reply('Kirim/reply gambar atau video pendek dengan caption .sticker');

    await ctx.reply('Sedang membuat stiker...');
    try {
      const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {});
      const sticker = new Sticker(buffer, {
        pack: config.botName,
        author: 'botwa',
        type: StickerTypes.FULL,
        quality: 70,
      });
      const out = await sticker.toBuffer();
      await ctx.sock.sendMessage(ctx.from, { sticker: out }, { quoted: ctx.msg });
    } catch (e) {
      await ctx.reply('Gagal membuat stiker: ' + e.message);
    }
  },
};
