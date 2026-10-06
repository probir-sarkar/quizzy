# Quizzy

AI-free quiz broadsheet: thousands of hand-curated questions across categories → sub-categories → quizzes, plus a this-day-in-history archive. Monochrome editorial design, no accounts, no AI slop.

## Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (SSR on Nitro) + TanStack Router file routes
- **Build:** Vite 8, React 19, TypeScript 5.9, Tailwind CSS v4
- **Database:** PostgreSQL via Prisma 8 (contract-first, `prisma/contract.prisma`)
- **API:** oRPC router served at `/rpc`, Redis-cached (1h TTL) via oRPC cache middleware
- **Package manager:** pnpm

## Development

```bash
pnpm install
pnpm dev                    # dev server on http://localhost:3001 (3000 is reserved locally)
```

Environment (`.env`):

- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis for the oRPC cache (e.g. `redis://localhost:6379`)
- `VITE_BASE_URL` — public base URL used for canonicals/sitemap (defaults to the production URL)

Other commands:

```bash
pnpm build                  # vite build && tsc --noEmit (type-checked build)
pnpm start                  # run the Nitro production server from .output/
pnpm lint                   # eslint (typescript-eslint + react-hooks)
pnpm prisma:contract:emit   # regenerate the Prisma 8 client after editing prisma/contract.prisma
pnpm prisma:migrate         # apply migrations
pnpm exec tsx prisma/seed.ts
```

## Structure

- `src/routes/` — TanStack Router file routes (`__root.tsx` is the document shell; `rpc.$.ts`, `sitemap[.]xml.ts`, `robots[.]txt.ts` are server routes; `routeTree.gen.ts` is generated)
- `src/server/` — oRPC procedures (quiz, category, past-event) behind the Redis cache middleware
- `src/lib/orpc.ts` — isomorphic oRPC client (in-process during SSR, `RPCLink` → `/rpc` in the browser)
- `src/components/` — UI (shadcn-style primitives, editorial layout, motion helpers)

See `AGENTS.md` for framework conventions and Prisma 8 gotchas.
