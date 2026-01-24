# Quizzy Backend - Cloudflare Workers

This is a Cloudflare Workers implementation of the Quizzy backend, providing an alternative to the Inngest-based background job processing in the main application.

## Purpose

This backend uses **Cloudflare Workers Workflows** for automated quiz generation, while the main application uses **Inngest**. Both implementations provide the same functionality - generating AI-powered quiz content - but on different platforms:

- **This backend**: Cloudflare Workers Workflows (edge computing, low latency)
- **Main app (`/src/inngest`)**: Inngest (managed background job service)

## Tech Stack

- **Runtime**: Cloudflare Workers with Bun
- **Framework**: Hono for HTTP routing
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Vercel AI SDK with OpenAI-compatible models
- **Workflows**: Cloudflare Workers Workflows

## Prerequisites

- [Bun](https://bun.sh/) installed
- Cloudflare account with [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed
- PostgreSQL database
- OpenAI-compatible API credentials

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Create a `.dev.vars` file for local development:

```bash
DATABASE_URL=your_database_url_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

### 3. Set Production Secrets

For production deployment, use Wrangler secrets:

```bash
wrangler secret put DATABASE_URL
wrangler secret put OPENAI_BASE_URL
wrangler secret put OPENAI_API_KEY
wrangler secret put OPENAI_MODEL
```

## Development

### Start Local Development Server

```bash
bun run dev
```

The worker will be available at `http://localhost:8787`

### Available Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check endpoint
- `GET /categories` - List all quiz categories
- `GET /trigger` - Manually trigger the quiz generation workflow

### Generate TypeScript Types

To generate types based on your Worker configuration:

```bash
bun run cf-typegen
```

## Deployment

Deploy to Cloudflare Workers:

```bash
bun run deploy
```

## Workflow: Quiz Generation

The `GenerateQuizWorkflow` automatically generates quiz content with:

1. **Random category selection** - Picks a random category/subcategory pair
2. **Duplicate prevention** - Fetches existing titles to avoid repetition
3. **AI-powered generation** - Uses OpenAI-compatible models to generate quiz content
4. **Database storage** - Saves generated quizzes with questions, options, and explanations

The workflow is triggered via the `/trigger` endpoint or can be scheduled via Cloudflare Workers cron triggers.

## Architecture

```
src/
├── index.ts          # Main entry point with Hono routes
├── lib/
│   ├── ai-models.ts  # AI model configuration
│   └── prisma.ts     # Database client
└── workflows/
    ├── generate-quiz.ts  # Quiz generation workflow
    └── schemas/
        └── quiz-schema.ts # Zod schema for quiz validation
```

## See Also

- [Main Application Documentation](../../README.md)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono Framework](https://hono.dev/)
