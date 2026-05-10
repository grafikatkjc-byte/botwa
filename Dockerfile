# Dockerfile untuk Hugging Face Spaces (Docker SDK)
# - Harus listen di port 7860
# - User default uid 1000 (HF convention)
# - Filesystem root read-only kecuali /tmp dan /data (Persistent Storage)

# Pakai image Node 20 full (bukan -slim). Image ini SUDAH TERMASUK git,
# python3, dan build tools — menghindari error "spawn git ENOENT" saat
# npm menarik dependency dari git URL (sub-deps Baileys seperti libsignal).
FROM node:20-bookworm

# Safety net: pastikan git & libvips tetap ada (untuk sharp/sticker).
# Sekaligus upgrade npm ke versi terbaru agar resolver lebih pintar.
RUN apt-get update && apt-get install -y --no-install-recommends \
      git \
      libvips \
      ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && git --version \
    && npm install -g npm@latest

# HF Space wants uid 1000. Image 'node' sudah punya user 'node' (uid 1000).
WORKDIR /app
RUN chown -R node:node /app

USER node

# Copy manifest dulu (caching layer)
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.jso[n] ./

# Install dependencies produksi.
# --unsafe-perm dihindari; user 'node' sudah punya HOME writable.
RUN npm install --omit=dev --no-audit --no-fund --loglevel=error

# Copy sisa source
COPY --chown=node:node . .

# Fallback data dir kalau /data (Persistent Storage) tidak ter-mount
RUN mkdir -p /app/data

ENV NODE_ENV=production \
    PORT=7860 \
    HOST=0.0.0.0

EXPOSE 7860

CMD ["node", "index.js"]
