// Konfigurasi bot — nilai-nilai penting bisa di-override lewat environment
// variables (penting untuk deploy di Hugging Face Spaces / Docker).
function envList(name, fallback) {
  const v = process.env[name];
  if (!v) return fallback;
  return v.split(',').map(s => s.trim()).filter(Boolean);
}
function envBool(name, fallback) {
  const v = process.env[name];
  if (v === undefined) return fallback;
  return ['1', 'true', 'on', 'yes'].includes(String(v).toLowerCase());
}
function env(name, fallback) {
  const v = process.env[name];
  return (v === undefined || v === '') ? fallback : v;
}

module.exports = {
  // Nama bot
  botName: env('BOT_NAME', 'Istimewa-Bot'),

  // Prefix command. Bisa string atau array. Default: '#' dan '.'
  prefix: envList('PREFIX', ['#', '.']),

  // Kata kunci tanpa prefix (harus jadi kata pertama).
  // Contoh env: NO_PREFIX_TRIGGERS="list,menu"
  noPrefixTriggers: envList('NO_PREFIX_TRIGGERS', ['list']),

  // Nomor owner. Contoh env: OWNER="6281234567890,6281111111111"
  owner: envList('OWNER', ['6281234567890']),

  // Login: 'qr' atau 'pair'
  loginMethod: env('LOGIN_METHOD', 'pair'),

  // Nomor WA bot (untuk pair code). Wajib diisi saat deploy di HF Spaces
  // karena tidak ada terminal interaktif.
  pairNumber: env('PAIR_NUMBER', ''),

  // Port HTTP server (HF Spaces wajib 7860)
  httpPort: parseInt(env('PORT', '7860'), 10),

  // Token untuk mengakses halaman status (opsional). Jika diisi, halaman
  // /status akan minta ?token=... Biasanya di-set via HF Space Secrets.
  statusToken: env('STATUS_TOKEN', ''),

  // Direktori data (sesi + JSON). Default auto-detect:
  // - Jika ada /data yang writable (HF Persistent Storage), pakai itu.
  // - Kalau tidak, pakai folder lokal repo.
  dataDir: env('DATA_DIR', ''),

  // Fitur otomatis
  antiLink: envBool('ANTI_LINK', true),
  welcomeMessage: envBool('WELCOME', true),
  farewellMessage: envBool('FAREWELL', true),

  welcomeText: env('WELCOME_TEXT', 'Haii @user, selamat datang di *@group*! Baca deskripsi ya.'),
  farewellText: env('FAREWELL_TEXT', 'Selamat jalan @user, semoga sukses di tempat baru.'),
};
