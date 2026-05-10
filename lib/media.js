// Helper: ambil buffer media dari pesan atau pesan yang di-reply.
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

async function getImageBuffer(ctx) {
  const msg = ctx.msg;
  const m = msg.message || {};
  const quoted = m.extendedTextMessage?.contextInfo?.quotedMessage;

  const direct = m.imageMessage;
  const qImg = quoted?.imageMessage;

  if (direct) {
    return await downloadMediaMessage(msg, 'buffer', {});
  }
  if (qImg) {
    const fake = { message: quoted, key: msg.message.extendedTextMessage.contextInfo };
    return await downloadMediaMessage(fake, 'buffer', {});
  }
  return null;
}

module.exports = { getImageBuffer };
