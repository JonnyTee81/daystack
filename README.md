# DayStack 📊

A modern habit tracking and daily metrics application that helps you visualize your progress with beautiful GitHub-style heatmaps. Track your daily mood, energy, productivity, and custom habits with powerful insights and analytics.

## ✨ Features

- **Daily Metrics Tracking** - Monitor mood, energy, and productivity levels (1-10 scale)
- **Custom Habit Management** - Create and track boolean or quantity-based habits
- **GitHub-Style Heatmaps** - Visualize your consistency with beautiful calendar heatmaps
- **Streak Tracking** - Monitor current and best streaks across all metrics
- **Analytics Dashboard** - View trends, completion rates, and detailed statistics
- **Dark/Light Mode** - Beautiful UI that adapts to your preference
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **API**: tRPC for type-safe APIs
- **Authentication**: NextAuth.js with Google OAuth
- **UI**: Tailwind CSS + shadcn/ui components
- **Caching**: Redis
- **State Management**: TanStack Query (React Query)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd daystack
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   # Database
   DATABASE_URL="postgresql://daystack:localdev@localhost:5432/daystack?schema=public"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-here"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

3. **Start the database services**
   ```bash
   docker-compose up -d
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions
├── server/                # Backend code
│   ├── api/               # tRPC routers
│   ├── auth.ts            # NextAuth configuration  
│   └── db.ts              # Database connection
└── trpc/                  # tRPC client setup
```

## 🔑 Authentication Setup

1. **Create a Google Cloud Console project**
2. **Enable Google+ API**
3. **Create OAuth 2.0 credentials**
4. **Add authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
5. **Update environment variables** with your client ID and secret

## 🐳 Docker Services

The application uses Docker Compose for local development:

- **PostgreSQL** - Main database (port 5432)
- **Redis** - Caching and session storage (port 6379)

```bash
# Start services
docker-compose up -d

# Stop services  
docker-compose down

# View logs
docker-compose logs -f
```

## 📊 Database Schema

Key models:
- **User** - Authentication and profile data
- **DailyMetric** - Daily mood, energy, productivity scores
- **Habit** - Custom habit definitions
- **HabitLog** - Daily habit completion records

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Operations

```bash
npx prisma studio              # Open database browser
npx prisma generate           # Generate Prisma client
npx prisma db push           # Push schema changes
npx prisma migrate dev       # Create and run migrations
```

## 🚀 Deployment

1. **Set up production database** (PostgreSQL + Redis)
2. **Configure environment variables** for production
3. **Deploy to your platform** (Vercel, Railway, etc.)
4. **Run database migrations** in production

## 📈 Development Roadmap

- [x] **Phase 1**: Project foundation and database setup
- [ ] **Phase 2**: Authentication system with Google OAuth
- [ ] **Phase 3**: Layout and navigation structure  
- [ ] **Phase 4**: Daily metrics tracking
- [ ] **Phase 5**: Habit management system
- [ ] **Phase 6**: Integrated daily check-in flow
- [ ] **Phase 7**: GitHub-style heatmap visualization
- [ ] **Phase 8**: Statistics and analytics
- [ ] **Phase 9**: Habit grid visualizations
- [ ] **Phase 10**: Polish and optimization
- [ ] **Phase 11**: AI insights integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
