const config = require('../config');
const commands = require('../commands');
const logger = require('./logger');
const store = require('./store');

function getText(msg) {
  const m = msg.message || {};
  return m.conversation
    || m.extendedTextMessage?.text
    || m.imageMessage?.caption
    || m.videoMessage?.caption
    || '';
}

async function isAdmin(sock, jid, userJid) {
  try {
    const meta = await sock.groupMetadata(jid);
    const p = meta.participants.find(x => x.id === userJid);
    return p && (p.admin === 'admin' || p.admin === 'superadmin');
  } catch { return false; }
}

async function botIsAdmin(sock, jid) {
  try {
    const meta = await sock.groupMetadata(jid);
    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const p = meta.participants.find(x => x.id === botJid);
    return p && (p.admin === 'admin' || p.admin === 'superadmin');
  } catch { return false; }
}

function matchPrefix(text) {
  const list = Array.isArray(config.prefix) ? config.prefix : [config.prefix];
  for (const p of list) if (text.startsWith(p)) return p;
  return null;
}

async function handleMessage(sock, msg) {
  if (!msg.message || msg.key.fromMe) return;

  const from = msg.key.remoteJid;
  const isGroup = from.endsWith('@g.us');
  const sender = isGroup ? msg.key.participant : from;
  const text = getText(msg).trim();

  // ANTI-LINK
  if (isGroup && config.antiLink && /(https?:\/\/|www\.|chat\.whatsapp\.com\/)/i.test(text)) {
    const senderIsAdmin = await isAdmin(sock, from, sender);
    const meAdmin = await botIsAdmin(sock, from);
    if (!senderIsAdmin && meAdmin) {
      await sock.sendMessage(from, {
        text: `Link terdeteksi. @${sender.split('@')[0]} dikeluarkan.`,
        mentions: [sender],
      });
      try { await sock.groupParticipantsUpdate(from, [sender], 'remove'); } catch (e) { logger.err('Gagal kick:', e.message); }
      return;
    }
  }

  // Routing command — cek prefix dulu, lalu fallback ke no-prefix triggers
  let body;
  const pfx = matchPrefix(text);
  if (pfx) {
    body = text.slice(pfx.length).trim();
  } else {
    // Cek apakah kata pertama cocok dengan noPrefixTriggers
    const firstWord = text.split(/\s+/)[0].toLowerCase();
    const triggers = (config.noPrefixTriggers || []).map(t => t.toLowerCase());
    if (!triggers.includes(firstWord)) return;
    body = text;
  }

  const [cmdName, ...args] = body.split(/\s+/);
  const cmdKey = (cmdName || '').toLowerCase();
  const cmd = commands[cmdKey];
  if (!cmd) return;

  const isOwner = config.owner.includes(sender.split('@')[0]);

  // BOT ENABLE / DISABLE per grup — hanya 'enable' yang lolos saat disabled
  if (isGroup && !store.isBotEnabled(from) && cmdKey !== 'enable' && !isOwner) return;

  const ctx = {
    sock, msg, from, sender, isGroup, args,
    text: args.join(' '),
    isAdmin: isGroup ? await isAdmin(sock, from, sender) : false,
    botIsAdmin: isGroup ? await botIsAdmin(sock, from) : false,
    isOwner,
    reply: (t) => sock.sendMessage(from, { text: t }, { quoted: msg }),
  };

  try {
    logger.info(`CMD ${pfx || '(no-pfx)'}${cmdKey} from ${sender}`);
    await cmd.run(ctx);
  } catch (e) {
    logger.err(`Error cmd ${cmdKey}:`, e.message);
    await ctx.reply('Terjadi error: ' + e.message);
  }
}

module.exports = { handleMessage };
