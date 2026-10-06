# ============================================
# Stage 1: Install dependencies & build the TanStack Start app (Nitro output)
# ============================================

FROM node:lts AS builder

WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./

# Install dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  corepack enable pnpm && pnpm install --frozen-lockfile

# Copy application source code
COPY . .

ENV NODE_ENV=production

# Build (vite build && tsc --noEmit) — produces the Nitro server in .output/
RUN pnpm build

# ============================================
# Stage 2: Run the Nitro Node server
# ============================================

FROM node:lts-trixie-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Nitro output bundles the server (server/index.mjs) and static assets (public/).
# src/fonts holds the TTFs the OG image routes read from disk at runtime.
COPY --from=builder --chown=node:node /app/.output ./.output
COPY --from=builder --chown=node:node /app/src/fonts ./src/fonts

# Switch to non-root user for security best practices
USER node

# Expose port 3000 to allow HTTP traffic
EXPOSE 3000

# DATABASE_URL / REDIS_URL / VITE_BASE_URL are provided at runtime by the platform
CMD ["node", ".output/server/index.mjs"]
