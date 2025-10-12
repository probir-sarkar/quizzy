# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
bun dev              # Start development server with Turbopack
bun run prisma:generate  # Generate Prisma client after schema changes

# Production
bun build            # Build for production with Turbopack
bun start            # Start production server

# Code Quality
bun lint             # Run ESLint
```

## Architecture Overview

Quizzy is an AI-powered quiz platform built with Next.js 15, React 19, and TypeScript. The application automatically generates quiz content and horoscopes using multiple AI providers.

### Core Technology Stack
- **Framework**: Next.js 15.5.4 with App Router and Turbopack
- **Database**: PostgreSQL with Prisma ORM (custom client generation in `src/generated/prisma/`)
- **AI Providers**: Groq, Google AI, Z.AI with Vercel AI SDK
- **Background Jobs**: Inngest for cron jobs and event-driven functions
- **Styling**: Tailwind CSS v4 with Shadcn/ui components
- **Package Manager**: Bun

### Key Architectural Patterns

**AI Content Generation Pipeline:**
- Automated quiz generation using Groq models with random difficulty selection
- Daily horoscope generation for all 12 zodiac signs using Z.AI's GLM model
- Structured output validation with Zod schemas
- Batch generation with duplicate prevention

**Database Schema:**
- Hierarchical structure: Categories → SubCategories → Quizzes → Questions
- Many-to-many relationship between Quizzes and Tags
- Horoscope entity with zodiac sign and date indexing
- Draft/published workflow for quiz content management

**Caching Strategy:**
- Next.js `unstable_cache` for performance optimization
- Home page data cached for 1 hour
- Category pages cached for 1 hour
- Selective cache invalidation patterns

**Background Processing:**
- Inngest functions handle automated content generation
- Hourly quiz generation via cron jobs
- Daily horoscope generation with 5-minute intervals
- Telegram bot integration for social media sharing

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/inngest/       # Inngest webhook endpoint
│   ├── category/          # Category listing and detail pages
│   ├── quiz/[slug]/       # Individual quiz pages
│   └── horoscope/         # Daily horoscope display
├── components/
│   ├── ui/                # Shadcn/ui base components
│   ├── common/            # Shared components (navbar, share buttons)
│   ├── home-page/         # Homepage-specific components
│   ├── category/          # Category page components
│   └── quiz-page/         # Quiz taking components
├── lib/
│   ├── prisma.ts          # Database client with connection pooling
│   ├── ai-models.ts       # AI provider configurations
│   ├── constants.ts       # Application constants
│   └── utils.ts           # Utility functions
├── queries/               # Database query functions with caching
├── inngest/              # Background job functions
│   ├── horoscope/        # Daily horoscope generation
│   ├── geretare-quiz/    # Automated quiz generation
│   └── social-media-share/ # Telegram posting
└── generated/prisma/     # Auto-generated Prisma client (don't edit manually)
```

### Important Implementation Details

**Database Client:**
- Custom Prisma client location: `src/generated/prisma/`
- Connection pooling with PostgreSQL adapter
- Shadow database for migrations

**AI Model Configuration:**
- Multiple AI providers configured in `lib/ai-models.ts`
- Model selection based on difficulty level
- Structured generation with Zod schema validation

**Component Architecture:**
- Server components for optimal performance
- Client components for interactivity (theme toggle, quiz interactions)
- Atomic design principles with reusable UI components

**Deployment:**
- Docker multi-stage builds with Bun runtime
- Standalone output configuration for container efficiency
- GitHub Actions CI/CD pipeline
- ARM64 deployment targeting

### Testing and Quality

Currently no automated tests are configured. When implementing tests, focus on:
- AI content generation validation
- Database query caching behavior
- Background job execution
- Component rendering with different theme states

### Environment Variables Required

Key environment variables for development:
- Database connection strings
- AI provider API keys (Groq, Google AI, Z.AI)
- Inngest event key
- Telegram bot token
- GTM container ID for analytics

### Common Patterns

**When adding new quiz categories:**
1. Add category/subcategory to database schema
2. Update category listing components
3. Ensure AI generation includes new categories
4. Add corresponding page routes

**When modifying AI generation:**
1. Update schemas in `lib/ai-models.ts`
2. Modify Inngest functions in `src/inngest/`
3. Test with different AI providers
4. Validate structured output formats

**Cache Management:**
- Use `unstable_cache` for expensive database queries
- Consider cache invalidation strategies for content updates
- Monitor cache hit rates in production