FROM node:22-slim AS base
WORKDIR /app
RUN corepack enable

# ---- deps: install once, reused by build and (via node_modules copy) runtime tooling
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ---- build: compile the Next.js app
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- runtime: minimal image with only what's needed to run
FROM base AS runtime
ENV NODE_ENV=production
RUN groupadd --system --gid 1001 corkboard \
  && useradd --system --uid 1001 --gid corkboard corkboard

COPY --from=build /app/public ./public
COPY --from=build --chown=corkboard:corkboard /app/.next/standalone ./
COPY --from=build --chown=corkboard:corkboard /app/.next/static ./.next/static
COPY --from=build /app/prisma ./prisma
# The Next standalone build only traces the query-engine bits reachable at
# request time; `prisma migrate deploy` (run at container start, not at
# request time) needs the CLI and schema-engine binary too, so those are
# copied in explicitly rather than relying on tracing to find them.
COPY --from=build /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=build /app/node_modules/prisma ./node_modules/prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/tsx ./node_modules/tsx
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER corkboard
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
