// HTTP server kecil untuk Hugging Face Spaces.
// - Mendengarkan di PORT (default 7860) agar health-check Space lulus.
// - Menampilkan halaman status: QR/pair code, status koneksi, dan log ringan.
const express = require('express');
const QRCode = require('qrcode');
const config = require('../config');
const logger = require('./logger');

const state = {
  connection: 'starting',   // 'starting' | 'connecting' | 'open' | 'close'
  qr: '',                   // raw QR string (mode qr)
  pairCode: '',             // 8-char pair code (mode pair)
  userId: '',
  startedAt: Date.now(),
  lastMessage: '',
  error: '',
};

function setConnection(v)   { state.connection = v; }
function setQR(v)           { state.qr = v || ''; }
function setPairCode(v)     { state.pairCode = v || ''; }
function setUserId(v)       { state.userId = v || ''; }
function setLastMessage(v)  { state.lastMessage = v || ''; }
function setError(v)        { state.error = v || ''; }

function requireToken(req, res, next) {
  if (!config.statusToken) return next();
  if (req.query.token === config.statusToken) return next();
  return res.status(401).type('text').send('Unauthorized. Append ?token=<STATUS_TOKEN>');
}

function pageHtml(body) {
  return `<!doctype html><html><head><meta charset="utf-8"/>
<title>${config.botName}</title>
<meta http-equiv="refresh" content="5"/>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:720px;margin:32px auto;padding:0 16px;color:#222}
  h1{margin:0 0 4px}.sub{color:#666;margin-bottom:24px}
  .card{background:#f7f7f8;border:1px solid #e5e5e7;border-radius:12px;padding:20px;margin-bottom:16px}
  .ok{color:#157f3d;font-weight:600}.warn{color:#a15c00;font-weight:600}.err{color:#b91c1c;font-weight:600}
  pre{background:#111;color:#eee;padding:12px;border-radius:8px;overflow:auto;font-size:13px}
  code{background:#eee;padding:2px 6px;border-radius:4px}
  .pair{font-size:32px;letter-spacing:6px;font-weight:800;text-align:center;padding:16px;background:#fff;border:2px dashed #333;border-radius:12px}
  img{display:block;margin:0 auto;max-width:320px;width:100%;border-radius:8px}
</style></head><body>${body}
<p class="sub" style="margin-top:32px">Halaman ini auto-refresh setiap 5 detik. ${config.botName}</p>
</body></html>`;
}

function statusLabel() {
  if (state.connection === 'open') return '<span class="ok">CONNECTED</span>';
  if (state.connection === 'close') return '<span class="err">DISCONNECTED</span>';
  return '<span class="warn">CONNECTING...</span>';
}

function mountRoutes(app) {
  app.get('/', (_req, res) => {
    // Health endpoint untuk HF Spaces (HTTP 200 tanpa auth)
    res.type('text').send(`${config.botName} is running. See /status for login.`);
  });

  app.get('/healthz', (_req, res) => res.json({ ok: true, connection: state.connection }));

  app.get('/status', requireToken, async (req, res) => {
    let body = `<h1>${config.botName}</h1>
      <div class="sub">Status: ${statusLabel()}${state.userId ? ' &middot; as <code>' + state.userId + '</code>' : ''}</div>`;

    if (state.connection === 'open') {
      body += `<div class="card"><p class="ok">Bot aktif dan terhubung ke WhatsApp.</p>
        <p>Uptime: ${Math.floor((Date.now() - state.startedAt)/1000)} detik</p>
        ${state.lastMessage ? '<p>Last activity: <code>' + escapeHtml(state.lastMessage) + '</code></p>' : ''}</div>`;
    } else if (config.loginMethod === 'pair') {
      if (state.pairCode) {
        const pretty = state.pairCode.match(/.{1,4}/g)?.join('-') || state.pairCode;
        body += `<div class="card">
          <p><b>Pair Code</b> untuk nomor <code>${escapeHtml(config.pairNumber || '(dari env)')}</code>:</p>
          <div class="pair">${pretty}</div>
          <p>Di HP: WhatsApp &rarr; Perangkat Tertaut &rarr; Tautkan dengan nomor telepon &rarr; masukkan kode di atas.</p>
          <p>Kode berlaku ~60 detik. Halaman akan refresh otomatis.</p>
        </div>`;
      } else {
        body += `<div class="card"><p class="warn">Menunggu pair code dari WhatsApp...</p>
          <p>Pastikan environment variable <code>PAIR_NUMBER</code> sudah di-set dengan nomor bot (contoh: <code>6281234567890</code>).</p></div>`;
      }
    } else {
      if (state.qr) {
        const dataUrl = await QRCode.toDataURL(state.qr, { margin: 1, width: 320 });
        body += `<div class="card"><p><b>Scan QR</b> berikut dari WhatsApp (Perangkat Tertaut):</p>
          <img src="${dataUrl}" alt="QR"/></div>`;
      } else {
        body += `<div class="card"><p class="warn">Menunggu QR dari WhatsApp...</p></div>`;
      }
    }

    if (state.error) body += `<div class="card"><p class="err">Error terakhir:</p><pre>${escapeHtml(state.error)}</pre></div>`;
    res.send(pageHtml(body));
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function start() {
  const app = express();
  mountRoutes(app);
  app.listen(config.httpPort, '0.0.0.0', () => {
    logger.ok(`Web status aktif di port ${config.httpPort} — buka /status`);
  });
}

module.exports = {
  start,
  setConnection, setQR, setPairCode, setUserId, setLastMessage, setError,
  state,
};
