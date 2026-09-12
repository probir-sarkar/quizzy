# ============================================
# Stage 1: Install Dependencies & Build Next.js application in standalone mode
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

# Generate Prisma clients (v7 and v8 side-by-side)
RUN pnpm exec prisma7 generate


# Build Next.js application (standalone output mode)
RUN pnpm build

# ============================================
# Stage 2: Run Next.js application
# ============================================

FROM node:lts-trixie-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Disable Next.js telemetry at runtime
ENV NEXT_TELEMETRY_DISABLED=1

# Copy production assets
COPY --from=builder --chown=node:node /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown node:node .next

# Leverage output traces to reduce image size
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Switch to non-root user for security best practices
USER node

# Expose port 3000 to allow HTTP traffic
EXPOSE 3000

# Start Next.js standalone server
CMD ["node", "server.js"]
