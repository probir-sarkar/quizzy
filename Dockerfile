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
FROM base AS runner
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

# For Prisma
# RUN apt-get update -y && apt-get install -y openssl

USER nextjs

EXPOSE 3000

# Run the Next.js standalone server with Bun
CMD ["bun", "./apps/web/server.js"]
