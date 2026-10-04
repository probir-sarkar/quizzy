<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Quizzy

AI-free quiz site: categories → sub-categories → quizzes → questions, plus this-day-in-history events.

## Stack

- **Next.js 16.3** App Router + Turbopack (default), React 19, TypeScript 5.9, Tailwind v4
- **Package manager: pnpm** (single Next.js app at the repo root — there is no `apps/` monorepo)
- **Database:** PostgreSQL via **Prisma 8 (Prisma Next)**, contract-first — author `prisma/contract.prisma`, then run `pnpm prisma:contract:emit`; artifacts land in `src/generated/prisma8` (committed)
- **API layer:** oRPC router (`src/server/router.ts`) served at `/rpc`; server components call it in-process via `client` from `src/lib/orpc.ts`
- **Caching:** Redis-backed oRPC cache middleware (`src/server/cache.ts`); bypassed in dev, JSON-round-trips output on every path

## Commands

```bash
pnpm dev                    # dev server (Turbopack)
pnpm build                  # production build (runs type validation — do not bypass)
pnpm lint                   # eslint (flat config, native — no FlatCompat)
pnpm prisma:contract:emit   # regenerate src/generated/prisma8 after editing the contract
pnpm prisma:migrate         # apply migrations
node --run prisma/seed.ts   # or: pnpm exec tsx prisma/seed.ts
```

## Prisma 8 gotchas (see `@prisma/orm-postgres/skills/prisma-8/` for the full API reference)

- Query with `db.orm.public.<Model>` (fluent: `.where((m) => m.field.eq(v)).orderBy(...).offset/.limit`, terminal `.all()`/`.first()`). Counts: `.aggregate((agg) => ({ count: agg.count() }))` — there is no bare `.count()` terminal.
- Timestamp columns decode to `Temporal.PlainDateTime`. `src/lib/prisma.ts` installs `temporal-polyfill/global` and exports `asTimestamp(date)` for writing/filtering. Never pass raw `Date` objects into queries.
- `Temporal` values cannot cross the Server → Client Component boundary — the cache middleware JSON-round-trips oRPC output for this reason; keep new procedures behind it (or return plain data).
- The contract was inferred from the live DB: `Quiz.id`, `Question.id` and `updatedAt` have **no defaults** — supply them (e.g. `randomUUID()`) on create.
- N:M relations are not supported by the ORM lane. Quiz↔Tag goes through the `QuizTag` junction relation (`quizTags` → `tag` includes), and writes create junction rows explicitly.
- Server-side result shapes are kept v7-compatible (`_count.questions`, `tags[].tag.name`) via explicit mapping in `src/server/quiz.ts` — components depend on those shapes.
- Enums (`QuizDifficulty`, `EventCategory`) live in `src/lib/enums.ts` — Prisma 8 generates no enum objects.
