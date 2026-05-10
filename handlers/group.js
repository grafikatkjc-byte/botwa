const config = require('../config');
const logger = require('../lib/logger');

// Handler saat ada update peserta grup
async function handleGroupParticipants(sock, ev) {
  const { id, participants, action } = ev;
  try {
    const meta = await sock.groupMetadata(id);

    for (const user of participants) {
      const tag = '@' + user.split('@')[0];

      if (action === 'add' && config.welcomeMessage) {
        const txt = config.welcomeText
          .replace('@user', tag)
          .replace('@group', meta.subject);
        await sock.sendMessage(id, { text: txt, mentions: [user] });
      }

      if (action === 'remove' && config.farewellMessage) {
        const txt = config.farewellText.replace('@user', tag);
        await sock.sendMessage(id, { text: txt, mentions: [user] });
      }
    }
  } catch (e) {
    logger.err('group-participants handler error:', e.message);
  }
}

module.exports = { handleGroupParticipants };
