# ============================================
# Stage 1: Dependencies Installation Stage
# ===========================================
# This Dockerfile is configured for Bun projects
# Multi-stage build for optimized image size

FROM oven/bun:1 AS dependencies

# Set working directory
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json bun.lock* ./

# Install all dependencies (including devDependencies needed for build)
# Use --frozen-lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile


# ============================================
# Stage 2: Build Next.js application in standalone mode
# ============================================

FROM oven/bun:1 AS builder

WORKDIR /app

# Copy project dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source files
COPY . .

# Set build environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client (requires devDependencies with Prisma CLI)
RUN bun run prisma generate

# Build Next.js application in standalone mode
RUN bun run build

# ============================================
# Stage 3: Run Next.js application
# ============================================

FROM oven/bun:1 AS runner

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Copy public assets
COPY --from=builder --chown=bun:bun /app/public ./public

# Create and set permissions for Next.js cache
RUN mkdir .next
RUN chown bun:bun .next

# Copy standalone output and static files
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

# Switch to non-root user for security best practices
USER bun

# Expose port 3000 to allow HTTP traffic
EXPOSE 3000



# Start Next.js standalone server with Bun
CMD ["bun", "server.js"]