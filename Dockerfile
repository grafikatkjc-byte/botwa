# Dockerfile untuk Hugging Face Spaces (Docker SDK) — VERSI v3
# Kalau log HF menampilkan "BUILD v3" di bawah, artinya commit terbaru
# sudah ter-deploy. Kalau tidak, Space masih pakai cache lama.

FROM node:20-bookworm

# Banner supaya jelas di log bahwa ini build dari Dockerfile terbaru
RUN echo "===== BUILD v3 (non-slim, git bundled) =====" \
 && which git \
 && git --version \
 && node --version \
 && npm --version

# Safety-net apt install. node:20-bookworm sudah punya git, tapi ini
# memastikan versi terbaru dan menambahkan libvips untuk sharp.
RUN apt-get update && apt-get install -y --no-install-recommends \
      git \
      libvips \
      ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && which git \
 && echo "===== apt OK ====="

# Upgrade npm (diam-diam) supaya resolver git URL lebih stabil
RUN npm install -g npm@latest --silent \
 && npm --version \
 && echo "===== npm upgraded ====="

WORKDIR /app
RUN chown -R node:node /app

USER node

# Verifikasi dari dalam user 'node' bahwa git masih accessible
RUN which git && git --version

# Copy manifest (caching layer)
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.jso[n] ./

# Install dependencies produksi
RUN npm install --omit=dev --no-audit --no-fund --loglevel=error \
 && echo "===== npm install OK ====="

# Copy sisa source
COPY --chown=node:node . .

RUN mkdir -p /app/data

ENV NODE_ENV=production \
    PORT=7860 \
    HOST=0.0.0.0

EXPOSE 7860

CMD ["node", "index.js"]
