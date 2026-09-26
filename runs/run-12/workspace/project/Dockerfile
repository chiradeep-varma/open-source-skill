FROM node:20-slim AS base
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY server ./server

RUN useradd --uid 1001 --create-home appuser \
  && mkdir -p /app/data \
  && chown -R appuser:appuser /app
USER appuser

ENV NODE_ENV=production
ENV DB_PATH=/app/data/sunny-thicket.sqlite
EXPOSE 3000

CMD ["node", "server/index.js"]
