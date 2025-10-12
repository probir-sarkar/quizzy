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
- Real-time content scheduling with Inngest cron jobs

**Database Schema:**
- Hierarchical structure: Categories → SubCategories → Quizzes → Questions
- Many-to-many relationship between Quizzes and Tags
- Horoscope entity with zodiac sign and date indexing using `ZodiacSign` enum
- Unique constraint on zodiac sign + date combination (one horoscope per sign per day)
- Horoscope fields: description, luckyColor, luckyNumber, mood, createdAt, updatedAt
- Draft/published workflow for quiz content management

**Caching Strategy:**
- Next.js `unstable_cache` for performance optimization
- Home page data cached for 1 hour
- Category pages cached for 1 hour
- Horoscope data cached for 1 hour with date-based cache invalidation
- Selective cache invalidation patterns using cache tags

**Background Processing:**
- Inngest functions handle automated content generation
- Hourly quiz generation via cron jobs
- Daily horoscope generation with 5-minute intervals using Z.AI's GLM-4.5-flash model
- Telegram bot integration for social media sharing
- Automatic content generation with date-based scheduling and duplicate prevention

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/inngest/       # Inngest webhook endpoint
│   ├── category/          # Category listing and detail pages
│   ├── quiz/[slug]/       # Individual quiz pages
│   └── horoscope/         # Daily horoscope display
│       ├── page.tsx       # Main horoscope page with date navigation
│       ├── layout.tsx     # Horoscope page layout with metadata
│       └── opengraph-image.tsx # Social media image generation
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
│   └── horoscope.ts       # Horoscope database queries with caching
├── inngest/              # Background job functions
│   ├── horoscope/        # Daily horoscope generation
│   │   ├── index.ts      # Main horoscope generation function
│   │   └── schema.ts     # Zod schemas for horoscope validation
│   ├── geretare-quiz/    # Automated quiz generation
│   └── social-media-share/ # Telegram posting
└── generated/prisma/     # Auto-generated Prisma client (don't edit manually)

public/
└── zodiac/               # Zodiac sign SVG assets
    ├── aries.svg         # Aries symbol
    ├── taurus.svg        # Taurus symbol
    ├── gemini.svg        # Gemini symbol
    ├── cancer.svg        # Cancer symbol
    ├── leo.svg           # Leo symbol
    ├── virgo.svg         # Virgo symbol
    ├── libra.svg         # Libra symbol
    ├── scorpio.svg       # Scorpio symbol
    ├── sagittarius.svg   # Sagittarius symbol
    ├── capricorn.svg     # Capricorn symbol
    ├── aquarius.svg      # Aquarius symbol
    └── pisces.svg        # Pisces symbol
```

### Important Implementation Details

**Database Client:**
- Custom Prisma client location: `src/generated/prisma/`
- Connection pooling with PostgreSQL adapter
- Shadow database for migrations

**AI Model Configuration:**
- Multiple AI providers configured in `lib/ai-models.ts`
- Model selection based on difficulty level for quiz generation
- Z.AI's GLM-4.5-flash model for horoscope generation
- Structured generation with Zod schema validation
- Batch processing for efficient content generation

**Component Architecture:**
- Server components for optimal performance
- Client components for interactivity (theme toggle, quiz interactions)
- Atomic design principles with reusable UI components
- Horoscope cards with responsive grid layout and date navigation
- Dynamic theming with gradient effects and glass morphism design
- Zodiac sign information with symbols, elements, and color-coded accents

**Deployment:**
- Docker multi-stage builds with Bun runtime
- Standalone output configuration for container efficiency
- GitHub Actions CI/CD pipeline
- ARM64 deployment targeting

### Testing and Quality

Currently no automated tests are configured. When implementing tests, focus on:
- AI content generation validation (both quiz and horoscope content)
- Database query caching behavior with date-based invalidation
- Background job execution for scheduled horoscope generation
- Component rendering with different theme states and zodiac sign data
- Horoscope date navigation and boundary conditions
- Zod schema validation for AI-generated content

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
1. Update schemas in `lib/ai-models.ts` or `src/inngest/horoscope/schema.ts` for horoscopes
2. Modify Inngest functions in `src/inngest/`
3. Test with different AI providers
4. Validate structured output formats

**When modifying horoscope functionality:**
1. Update horoscope schemas in `src/inngest/horoscope/schema.ts`
2. Modify generation logic in `src/inngest/horoscope/index.ts`
3. Update database queries in `src/queries/horoscope.ts`
4. Refresh zodiac sign information in the main page component
5. Test date navigation and caching behavior

**Cache Management:**
- Use `unstable_cache` for expensive database queries
- Consider cache invalidation strategies for content updates
- Monitor cache hit rates in production
- Horoscope data uses date-based cache keys for efficient invalidation
- Cache tags like "horoscopes" for selective cache clearing