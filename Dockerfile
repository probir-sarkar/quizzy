# -----------------------------------------------------------------------------
# This Dockerfile is configured for a Bun monorepo structure
# The web application is located in apps/web
# Prisma package is located in packages/prisma
# -----------------------------------------------------------------------------

# Use Bun's official image
FROM oven/bun:1-alpine AS base

WORKDIR /app

# Install dependencies with bun (monorepo workspaces)
FROM base AS deps
COPY package.json bun.lock* ./
COPY apps/web/package.json ./apps/web/
COPY packages/prisma/package.json ./packages/prisma/
RUN bun install --no-save --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma Generate - run from the prisma package directory
WORKDIR /app/packages/prisma
RUN bun run generate

# Set working directory to web app for build commands
WORKDIR /app/apps/web


ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

# Production image, copy all the files and run next
FROM chainguard/node:latest AS runner
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"


COPY --from=builder /app/apps/web/public ./public

# 1. Copy the standalone folder to the root
# This creates /app/apps/web/server.js and /app/node_modules
COPY --from=builder /app/apps/web/.next/standalone ./

# 2. FIX: Copy static files to the correct nested location
# Next.js expects these relative to the "apps/web" folder now
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# 3. FIX: Copy public files to the correct nested location
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

# Run the Next.js standalone server with Bun
CMD ["node", "./apps/web/server.js"]
