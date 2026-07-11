# ========================================
# Build Stage
# ========================================
FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable
RUN corepack use pnpm@latest-11

COPY . .

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

RUN pnpm run prisma:generate

RUN pnpm build

# ============================================
# Stage 3: Run Next.js application
# ============================================

FROM node:24-alpine AS runner

# Set working directory
WORKDIR /app

ARG BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$BASE_URL
# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"


# Copy production assets
COPY --from=builder  /app/public ./public


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder  /app/.next/standalone ./
COPY --from=builder  /app/.next/static ./.next/static

# Expose port 3000 to allow HTTP traffic
EXPOSE 3000

# Start Next.js standalone server with Bun
CMD ["node", "server.js"]