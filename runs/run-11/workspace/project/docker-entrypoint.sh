#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set — refusing to start. See .env.example." >&2
  exit 1
fi
if [ -z "$AUTH_SECRET" ]; then
  echo "AUTH_SECRET is not set — refusing to start without a session secret. See .env.example." >&2
  exit 1
fi

echo "Applying database migrations..."
./node_modules/.bin/prisma migrate deploy

if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "Ensuring admin account exists..."
  ./node_modules/.bin/tsx prisma/seed.ts
fi

exec "$@"
