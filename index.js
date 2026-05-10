const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
} = require('@whiskeysockets/baileys');
const pino = require('pino');

const logger = require('./lib/logger');
const { handleMessage } = require('./lib/messageHandler');
const { handleGroupParticipants } = require('./handlers/group');
const autoClose = require('./lib/autoClose');
const web = require('./lib/webServer');
const { AUTH_DIR, DATA_DIR } = require('./lib/paths');
const config = require('./config');

// Start HTTP server ASAP agar health-check HF Space lulus
web.start();
logger.info(`Data dir: ${DATA_DIR}`);

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const usePair = config.loginMethod === 'pair' && !state.creds.registered;
  logger.info(`WA Web v${version.join('.')} | login=${usePair ? 'PAIR CODE' : 'QR/SESSION'}`);

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    browser: Browsers.appropriate('Chrome'),
    logger: pino({ level: 'silent' }),
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: false,
  });

  sock.ev.on('creds.update', saveCreds);

  // PAIR CODE (non-interaktif; ambil nomor dari env PAIR_NUMBER)
  if (usePair) {
    const phone = (config.pairNumber || '').replace(/[^0-9]/g, '');
    if (!phone) {
      const msg = 'PAIR_NUMBER tidak di-set. Isi environment variable PAIR_NUMBER dengan nomor WA bot (contoh 6281234567890), lalu restart.';
      logger.err(msg); web.setError(msg);
    } else {
      setTimeout(async () => {
        try {
          const code = await sock.requestPairingCode(phone);
          const pretty = code?.match(/.{1,4}/g)?.join('-') || code;
          web.setPairCode(code);
          logger.ok(`PAIR CODE: ${pretty}  (nomor: ${phone})`);
          logger.info('Buka /status di web Space untuk tampilan kode.');
        } catch (e) {
          logger.err('Gagal meminta pair code:', e.message);
          web.setError('Gagal meminta pair code: ' + e.message);
        }
      }, 3000);
    }
  }

  sock.ev.on('connection.update', (u) => {
    const { connection, lastDisconnect, qr } = u;

    if (qr) { web.setQR(qr); if (!usePair) logger.info('QR tersedia di /status'); }
    if (connection) web.setConnection(connection);

    if (connection === 'open') {
      web.setUserId(sock.user?.id || '');
      web.setQR(''); web.setPairCode(''); web.setError('');
      logger.ok(`${config.botName} terhubung sebagai ${sock.user?.id}`);
      try { autoClose.restoreAll(sock); } catch (e) { logger.err('autoClose restore:', e.message); }
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      logger.warn(`Koneksi terputus (code=${code}). Reconnect=${shouldReconnect}`);
      web.setError(`Disconnected, code=${code}`);
      if (shouldReconnect) setTimeout(start, 2000);
      else logger.err('Logged out. Hapus folder auth_info di data dir lalu restart untuk login baru.');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      web.setLastMessage((msg.key.remoteJid || '') + ' @ ' + new Date().toISOString());
      handleMessage(sock, msg).catch(e => logger.err('handler error:', e.message));
    }
  });

  sock.ev.on('group-participants.update', (ev) => {
    handleGroupParticipants(sock, ev).catch(e => logger.err('grp handler error:', e.message));
  });
}

start().catch(e => {
  logger.err('Fatal error:', e);
  web.setError(String(e?.stack || e?.message || e));
  // Jangan exit — biar HTTP server tetap hidup dan menampilkan error.
  setTimeout(start, 5000);
});

process.on('unhandledRejection', (e) => {
  logger.err('unhandledRejection:', e?.message || e);
  web.setError('unhandledRejection: ' + (e?.message || e));
});
