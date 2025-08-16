# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DayStack is a habit tracking and daily metrics application that helps users visualize their progress with beautiful GitHub-style heatmaps. Users can track daily mood, energy, productivity levels (1-10 scale) and custom habits with powerful insights and analytics.

**Current Status**: Phase 1 Complete - Full foundation and infrastructure implemented

## Key Technologies & Architecture

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Database**: PostgreSQL with Prisma ORM (fully configured)
- **API**: tRPC for type-safe APIs (implemented)
- **Authentication**: NextAuth.js with Google OAuth (configured)
- **UI**: Tailwind CSS v4 + shadcn/ui components
- **Caching**: Redis (running via Docker)
- **State Management**: TanStack Query (React Query)
- **Path Mapping**: `@/*` maps to `./src/*`

## Development Commands

```bash
# Start database services
docker-compose up -d

# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database operations
npx prisma studio              # Database browser
npx prisma generate           # Generate client
npx prisma db push           # Push schema changes
npx prisma migrate dev       # Create migrations
```

## Current Project Structure

```
src/
├── app/                       # Next.js App Router
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth.js routes
│   │   └── trpc/[trpc]/          # tRPC API routes
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   └── ui/                       # shadcn/ui components
├── lib/
│   └── utils.ts                  # Utility functions
├── server/
│   ├── api/
│   │   ├── routers/
│   │   │   ├── metrics.ts        # Daily metrics tRPC router
│   │   │   └── habits.ts         # Habits tRPC router
│   │   ├── root.ts               # Main tRPC router
│   │   └── trpc.ts               # tRPC configuration
│   ├── auth.ts                   # NextAuth configuration
│   └── db.ts                     # Prisma database client
├── trpc/
│   ├── client.tsx                # Client-side tRPC setup
│   └── server.ts                 # Server-side tRPC helpers
prisma/
└── schema.prisma                 # Database schema
```

## Database Schema

**Implemented Models:**
- `User` - Authentication and profile data
- `Account` + `Session` - NextAuth.js tables
- `DailyMetric` - Daily mood, energy, productivity scores with notes
- `Habit` - Custom habit definitions (boolean/quantity types)
- `HabitLog` - Daily habit completion records

**Key Features:**
- Full relational structure with proper indexes
- Soft delete support for habits
- Momentum calculation for metrics
- Support for both boolean and quantity habits

## Authentication Setup

- NextAuth.js configured with Google OAuth provider
- Prisma adapter for database sessions
- Protected procedures in tRPC
- Ready for Google Cloud Console integration

**Required Environment Variables:**
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_SECRET="your-secret-here"
```

## tRPC API Structure

**Metrics Router** (`/api/trpc/metrics`):
- `createOrUpdate` - Upsert daily metrics
- `getDay` - Get specific day's data
- `getRange` - Get date range data

**Habits Router** (`/api/trpc/habits`):
- `getAll` - Fetch user's active habits
- `create` - Create new habit
- `update` - Edit existing habit
- `delete` - Soft delete habit
- `reorder` - Update habit display order

## Development Notes

- **Docker Services**: PostgreSQL (5432) and Redis (6379) running locally
- **Type Safety**: End-to-end with tRPC and Prisma
- **Development**: Hot reload with Turbopack enabled
- **Build**: Production build tested and working
- **Database**: Connected and tested with sample operations

## Current Implementation Status

✅ **Phase 1 Complete**: Foundation & Infrastructure
- Docker services (PostgreSQL, Redis)
- Complete database schema and migrations  
- tRPC API with authentication
- shadcn/ui component library
- Development environment fully configured

🟡 **Next Phase**: Authentication System (Phase 2)
- Google OAuth integration
- Sign-in/sign-out flow
- Protected route middleware
- User profile initialization

## Code Style & Conventions

- TypeScript strict mode enabled
- ESLint with Next.js rules
- Tailwind CSS utility classes
- shadcn/ui component patterns
- tRPC for all API interactions
- Prisma for database operations
- React Server Components where appropriate