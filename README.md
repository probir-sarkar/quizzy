# Quizzy - AI-Powered Quiz Platform

Quizzy is an intelligent quiz platform that automatically generates engaging quiz content and daily horoscopes using multiple AI providers. Built with modern web technologies for optimal performance and user experience.

## ✨ Features

### 🧠 AI-Powered Content Generation
- **Automated Quiz Generation**: Creates diverse quiz questions using Groq AI models
- **Daily Horoscopes**: Generates personalized horoscopes for all 12 zodiac signs using Z.AI's GLM model
- **Multiple AI Providers**: Integrates Groq, Google AI, and Z.AI for robust content creation
- **Structured Output Validation**: Ensures quality with Zod schema validation

### 🎯 Enhanced User Experience
- **Responsive Design**: Optimized for all devices with mobile-first approach
- **Instant Feedback**: Color-coded answers without text labels for cleaner interface
- **Fast Animations**: Reduced delays and smoother transitions for better responsiveness
- **Dark Mode Support**: Full theme support with seamless switching
- **Progressive Web App**: Modern PWA capabilities

### 📊 Content Management
- **Hierarchical Structure**: Categories → SubCategories → Quizzes → Questions
- **Tag System**: Flexible tagging for better content organization
- **Draft/Published Workflow**: Content staging before publication
- **Batch Generation**: Efficient bulk content creation

### ⚡ Performance & Architecture
- **Next.js 15**: Latest framework with App Router and Turbopack
- **Caching Strategy**: Intelligent caching with 1-hour TTL for optimal performance
- **Background Jobs**: Scheduled content generation using Inngest
- **TypeScript**: Full type safety throughout the application

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4 with Shadcn/ui components
- **Animations**: Framer Motion
- **AI Integration**: Vercel AI SDK
- **Background Jobs**: Inngest
- **Package Manager**: Bun

## 🎨 Recent UI/UX Optimizations

### Quiz Component Enhancements
- **Cleaner Interface**: Removed "Correct/Incorrect" text labels, using color-coded feedback only
- **Mobile Optimization**: Improved responsive design with better spacing and typography
- **Faster Feedback**: Reduced animation delays from 350ms to 100ms for instant visual feedback
- **Performance**: Optimized transition durations (200ms) and staggered animations
- **Layout Stability**: Fixed mobile layout shifting with responsive padding and sizing

### Visual Improvements
- **Color-Coded Answers**: Green for correct, red for incorrect selections
- **Smooth Animations**: Optimized hover states and micro-interactions
- **Better Typography**: Responsive text sizing across all viewports
- **Consistent Spacing**: Improved margin and padding systems

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Bun (recommended) or npm/yarn
- PostgreSQL database

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/quizzy.git
   cd quizzy
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following environment variables:
   - Database connection strings
   - AI provider API keys (Groq, Google AI, Z.AI)
   - Inngest event key
   - Telegram bot token (optional)

4. **Database setup**
   ```bash
   bun run prisma:generate
   bun run prisma:push
   ```

5. **Start development server**
   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Commands

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

## 🏗️ Architecture Overview

### Background Processing Options

This project includes **two alternative implementations** for background job processing:

1. **Main Application (Recommended)**: Uses **Inngest** for managed background job processing
   - Located in `/src/inngest`
   - Easier to set up and manage
   - Better for development and most production use cases

2. **Alternative**: Uses **Cloudflare Workers Workflows** for edge computing
   - Located in `/backend` folder
   - Lower latency, edge deployment
   - See [backend/README.md](backend/README.md) for details

Both implementations share the same database schema and provide the same AI-powered quiz generation functionality.

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
│   ├── common/            # Shared components
│   ├── home-page/         # Homepage components
│   ├── category/          # Category page components
│   └── quiz-page/         # Quiz taking components
├── lib/                   # Utilities and configurations
├── queries/               # Database queries with caching
├── inngest/              # Background job functions
└── generated/prisma/     # Auto-generated Prisma client

backend/                   # Alternative Cloudflare Workers implementation
├── src/                  # Cloudflare Workers backend code
├── workflows/            # Workflows for background processing
└── lib/                  # Backend utilities
```

### Key Components

- **Quiz Component**: Optimized question cards with instant color feedback
- **Horoscope System**: Daily generation with zodiac sign integration
- **AI Pipeline**: Structured content generation with validation
- **Caching Layer**: Performance optimization with selective invalidation

## 🤖 AI Integration

### Content Generation Pipeline
- **Quiz Creation**: Automatic question generation with difficulty-based model selection
- **Horoscope Generation**: Daily horoscopes for all zodiac signs
- **Validation**: Structured output with Zod schemas
- **Scheduling**: Cron-based generation with Inngest

### Supported AI Providers
- **Groq**: Primary quiz content generation
- **Google AI**: Alternative content generation
- **Z.AI**: GLM-4.5-flash model for horoscopes

## 📱 Mobile Optimization

The application features a mobile-first design approach with:
- Responsive layouts that adapt to all screen sizes
- Touch-friendly interactions and gestures
- Optimized animations for mobile performance
- Improved typography and spacing for smaller screens
- Fixed layout shifting issues with stable component sizing

## 🚀 Deployment

### Docker Deployment
```bash
docker build -t quizzy .
docker run -p 3000:3000 quizzy
```

### Environment Variables
Key environment variables for production:
- Database connection strings
- AI provider API keys
- Inngest event key
- GTM container ID for analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

- [ ] User authentication and profiles
- [ ] Quiz creation interface for users
- [ ] Social sharing features
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Offline PWA capabilities

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.