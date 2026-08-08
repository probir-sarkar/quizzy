# Docker preferences

- Prefers multi-stage Dockerfiles for Node.js/Next.js apps with a combined install+build stage (builder) followed by a runner stage — explicitly asked to merge separate `dependencies` and `builder` stages into one step rather than keeping a dedicated dependency-install stage. Confidence: 0.8
- Prefers Dockerfiles that are clean and minimal: no unused ARGs (e.g., a `NODE_VERSION` ARG never referenced by a `FROM`) and no verbose explanatory comment blocks — asked for a "clean" Dockerfile, and the assistant's stripping of cruft was accepted without pushback. Confidence: 0.5
- Prefers reproducible builds: install with frozen lockfiles (npm ci / yarn --frozen-lockfile / pnpm install --frozen-lockfile) and `--mount=type=cache` for package-manager caches. Confidence: 0.6
- Prefers the runtime stage to run as a non-root user (e.g., `USER node`) for security. Confidence: 0.6
- For projects using Prisma, expects the Dockerfile to include a `prisma generate` step in the build stage (before the app build) — a missing Prisma step is called out as a problem. Confidence: 0.8
- Prefers Dockerfiles to be pnpm-only: uses `corepack enable pnpm && pnpm install --frozen-lockfile` and `pnpm build`, and explicitly asked to drop npm/yarn fallback branches and lockfile-detection logic ("clean and only pnpm"). Confidence: 0.9
