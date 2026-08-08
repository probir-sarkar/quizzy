# Docker preferences

- Prefers multi-stage Dockerfiles for Node.js/Next.js apps with dedicated stages (dependencies install → builder → runner). Confidence: 0.7
- Prefers Dockerfiles that are heavily documented: section divider comments, version-maintenance notes, and rationale for things like caching trade-offs and telemetry. Confidence: 0.6
- Prefers reproducible builds: install with frozen lockfiles (npm ci / yarn --frozen-lockfile / pnpm install --frozen-lockfile) and `--mount=type=cache` for package-manager caches. Confidence: 0.6
- Prefers the runtime stage to run as a non-root user (e.g., `USER node`) for security. Confidence: 0.6
- For projects using Prisma, expects the Dockerfile to include a `prisma generate` step in the build stage (before the app build) — a missing Prisma step is called out as a problem. Confidence: 0.8
- Standardizes Dockerfiles on a package-manager-agnostic install/build flow that detects the lockfile (npm/yarn/pnpm), so the container works regardless of which manager the local project uses. Confidence: 0.4
