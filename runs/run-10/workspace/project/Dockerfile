FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production
ENV DATA_DIR=/data
VOLUME ["/data"]

EXPOSE 3000

CMD ["node", "src/server.js"]
