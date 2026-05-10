---
title: Botwa Istimewa
emoji: 💬
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
short_description: Bot WhatsApp grup berbasis Baileys (Node.js)
---

# Botwa Istimewa

Bot WhatsApp grup berbasis [Baileys](https://github.com/WhiskeySockets/Baileys), didesain agar bisa langsung dideploy ke **Hugging Face Spaces (Docker SDK)**.

## Fitur utama
- Auto welcome / farewell anggota grup
- Anti-link (auto kick pengirim link; non-admin)
- Sticker maker (`#sticker` pada gambar/video pendek)
- 12 command GROUP: open/close, enable/disable, revoke, setautoclose, setnamegc, setdeskgc, setppgc, add/kick/promote/demote
- 13 command STORE: nama/logo toko, addlist/updatelist/deletelist, list, proses/done + label kustom, deletestore
- Multi-prefix (`#` dan `.`) dan kata tanpa prefix (default: `list`)
- Login via **Pair Code** (tanpa scan QR) — cocok untuk deploy server
- Web UI di `/status` untuk menampilkan pair code / QR saat pertama login

## Deploy ke Hugging Face Spaces

### 1. Buat Space
- Tipe: **Docker**
- Hardware: **CPU basic** cukup
- (Disarankan) Aktifkan **Persistent Storage** (Settings → Persistent Storage → Small) supaya sesi WA dan data JSON tidak hilang saat Space restart. HF akan mount di `/data` — bot otomatis mendeteksi path ini.

### 2. Push kode
Hubungkan repo ini ke Space atau clone Space-nya lalu salin seluruh isi folder ini ke sana. File yang **wajib** ada di root Space: `Dockerfile`, `package.json`, `index.js`, `config.js`, `lib/`, `handlers/`, `commands/`, `README.md` (ini).

### 3. Set Space Secrets / Variables
Buka **Settings → Variables and secrets**, tambahkan:

| Nama | Wajib | Contoh / default | Keterangan |
|---|---|---|---|
| `PAIR_NUMBER` | ya (jika pakai pair) | `6281234567890` | Nomor WA bot, tanpa `+` dan spasi |
| `OWNER` | sangat disarankan | `6281234567890,6289999999999` | Nomor owner (bisa banyak, koma) |
| `LOGIN_METHOD` | tidak | `pair` | `pair` atau `qr` |
| `BOT_NAME` | tidak | `Istimewa-Bot` | Nama yang muncul di menu |
| `PREFIX` | tidak | `#,.` | Prefix command |
| `NO_PREFIX_TRIGGERS` | tidak | `list` | Kata kunci tanpa prefix |
| `ANTI_LINK` | tidak | `true` | `true`/`false` |
| `WELCOME` / `FAREWELL` | tidak | `true` | Toggle pesan welcome/farewell |
| `WELCOME_TEXT` / `FAREWELL_TEXT` | tidak | lihat default | Placeholder: `@user`, `@group` |
| `STATUS_TOKEN` | disarankan | `rahasia123` | Token untuk proteksi halaman `/status` |

Simpan semua sebagai **Secret** (bukan Variable) supaya tidak terbaca publik.

### 4. Build & login pertama kali
- Space akan build Docker image lalu jalan.
- Buka URL Space → akan muncul halaman "running". Lalu buka **`/status?token=<STATUS_TOKEN>`**.
- Kalau `LOGIN_METHOD=pair`: halaman akan menampilkan **pair code 8 digit**. Di HP kamu: WhatsApp → Perangkat Tertaut → Tautkan dengan nomor telepon → masukkan kode.
- Kalau `LOGIN_METHOD=qr`: halaman menampilkan gambar QR untuk di-scan.
- Setelah status berubah menjadi **CONNECTED**, bot siap dipakai di grup WA.

> **Penting**: Tanpa Persistent Storage, setiap kali Space di-restart kamu harus login ulang karena folder `auth_info/` ikut terhapus.

### 5. Mengubah konfigurasi
Cukup ubah Secrets di Settings → Factory rebuild (atau restart). Bot akan pakai nilai baru.

## Menjalankan secara lokal (opsional)
```bash
npm install
export PAIR_NUMBER=6281234567890 OWNER=6281234567890
npm start
```
Buka `http://localhost:7860/status` untuk lihat pair code.

Data lokal disimpan di `./data/`. Jangan commit folder ini (sudah di `.gitignore`).

## Daftar Command

### GROUP (admin)
| Command | Fungsi |
|---|---|
| `#open` / `#close` | Buka / tutup grup |
| `#enable` / `#disable` | Aktifkan / matikan bot di grup ini |
| `#revoke` | Reset link invite grup |
| `#setautoclose 2h\|30m\|1d\|off` | Jadwalkan auto-close |
| `#setnamegc <nama>` | Ubah nama grup |
| `#setdeskgc <teks>` | Ubah deskripsi grup |
| `#setppgc` (reply gambar) | Ubah foto profil grup |
| `#add <nomor>` | Tambah member |
| `#kick @user` / `#promote @user` / `#demote @user` | Kelola member |
| `#tagall [pesan]` | Mention semua |
| `#antilink on\|off` | Toggle anti-link |

### STORE
| Command | Fungsi |
|---|---|
| `#setname` / `#setnamestore <nama>` | Set nama toko |
| `#setlogostore` (reply gambar) / `#dellogostore` | Logo toko |
| `#addlist <teks>` | Tambah item |
| `#updatelist <id> <teks>` | Edit item |
| `#deletelist <id>` | Hapus item |
| `#deletestore confirm` | Reset data toko |
| `#list` atau cukup ketik `list` | Tampilkan daftar |
| `#proses <id>` / `#done <id>` | Ubah status item |
| `#setproses <label>` / `#setdone <label>` | Ubah label status |

### Lain
`#menu`, `#ping`, `#sticker`

## Catatan
- WhatsApp melarang automasi tidak resmi. Gunakan untuk grup pribadi / komunitas kecil.
- Sesi dan data tersimpan di `/data` (HF) atau `./data` (lokal). Backup file `lists.json` secara berkala jika penting.
