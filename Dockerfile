# Dockerfile untuk Hugging Face Spaces (Docker SDK)
# HF Spaces:
#   - container harus listen di port 7860
#   - user default non-root (uid 1000)
#   - filesystem root read-only kecuali /tmp dan /data (jika Persistent Storage aktif)
FROM node:20-bookworm-slim

# Dependencies yang dibutuhkan sharp (libvips) dan untuk build native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates \
      libvips \
    && rm -rf /var/lib/apt/lists/*

# Folder aplikasi (owned oleh user 1000 — sesuai rekomendasi HF)
RUN mkdir -p /app && chown -R 1000:1000 /app
WORKDIR /app

# Copy manifest dulu untuk cache layer install
COPY --chown=1000:1000 package.json ./
# Kalau ada lockfile, akan ikut ke-copy
COPY --chown=1000:1000 package-lock.jso[n] ./

USER 1000

# Install dependencies produksi
RUN npm install --omit=dev --no-audit --no-fund

# Copy sisa source
COPY --chown=1000:1000 . .

# Fallback data dir kalau /data (persistent storage) tidak tersedia
RUN mkdir -p /app/data

ENV NODE_ENV=production \
    PORT=7860 \
    HOST=0.0.0.0

EXPOSE 7860

CMD ["node", "index.js"]
