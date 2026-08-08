# Tooling preferences

- Works on Windows with Git Bash (MINGW64) as the shell; path handling should account for Windows-style paths (e.g., `C:\Program Files\nodejs\...`). Confidence: 0.9
- Uses / is standardizing on pnpm as the package manager — actively ran `pnpm i` on a project that was previously Bun-based (with `bun.lock`), and explicitly requested pnpm-only tooling in the Dockerfile ("clean and only pnpm"). Confidence: 0.8
