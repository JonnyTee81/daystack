# DayStack - Build Plan

## Phase 1: Project Foundation & Setup
**Goal: Get the development environment and core infrastructure running**

1. **Set up Docker services**
   - Create docker-compose.yml with PostgreSQL and Redis
   - Test database connectivity
   - Create .env.local with connection strings

2. **Install and configure core dependencies**
   - Tailwind CSS with custom configuration
   - shadcn/ui components setup
   - next-themes for dark mode
   - Initial color palette and CSS variables

3. **Set up Prisma**
   - Initialize Prisma with PostgreSQL
   - Create complete schema (User, DailyMetric, Habit, HabitLog)
   - Run initial migration
   - Generate Prisma client

4. **Configure tRPC**
   - Set up tRPC with App Router
   - Create context with Prisma client
   - Basic router structure
   - Type-safe API client setup

## Phase 2: Authentication System
**Goal: Complete auth flow with protected routes**

1. **NextAuth.js setup**
   - Install and configure NextAuth with Google OAuth
   - Set up Google Cloud Console credentials
   - Create auth API routes
   - Session provider wrapper

2. **Auth UI components**
   - Sign-in page with Google button
   - Loading states
   - Error handling
   - Redirect logic after auth

3. **Protected route middleware**
   - Middleware for protecting dashboard routes
   - Redirect unauthenticated users to sign-in
   - Create useUser hook for client components

4. **User profile initialization**
   - Create user record on first sign-in
   - Set default preferences
   - Timezone detection

## Phase 3: Layout & Navigation Structure
**Goal: Responsive shell with navigation and theme switching**

1. **Base layout components**
   - Root layout with theme provider
   - Navigation bar with user menu
   - Responsive sidebar (desktop)
   - Mobile bottom navigation
   - Theme toggle component

2. **Dashboard layout**
   - Main content area container
   - Responsive grid system
   - Loading skeletons
   - Empty states

3. **Common UI components**
   - Button, Card, Modal components from shadcn/ui
   - Custom Tooltip component
   - Form components (inputs, sliders)
   - Toast notifications setup

## Phase 4: Daily Metrics Feature
**Goal: Complete daily check-in flow**

1. **Metrics API endpoints (tRPC)**
   - `metrics.createOrUpdate` - Upsert daily metrics
   - `metrics.getDay` - Get specific day's data
   - `metrics.getRange` - Get date range data
   - Input validation with Zod

2. **Daily check-in modal**
   - Modal/drawer component (responsive)
   - Metric sliders (Mood, Energy, Productivity)
   - Visual feedback (emojis, colors)
   - Daily note textarea
   - Form validation

3. **Quick add button**
   - Floating action button (mobile)
   - Sidebar quick add (desktop)
   - Check if today is already logged
   - Success animation on save

## Phase 5: Habit Management System
**Goal: Full CRUD for habits**

1. **Habits API endpoints**
   - `habits.create` - Create new habit
   - `habits.update` - Edit habit
   - `habits.delete` - Soft delete/archive
   - `habits.reorder` - Update display order
   - `habits.getAll` - Fetch user's habits

2. **Habit management page**
   - List view of all habits
   - Add habit form (name, type, color, target)
   - Edit habit modal
   - Delete confirmation
   - Archive/restore functionality

3. **Drag-and-drop reordering**
   - Install @dnd-kit/sortable
   - Draggable habit list
   - Optimistic updates
   - Touch-friendly handles

## Phase 6: Integrated Daily Check-in
**Goal: Combine metrics and habits into single flow**

1. **Enhanced check-in modal**
   - Add habits section to daily modal
   - Checkbox list for boolean habits
   - Counter components for quantity habits
   - Progress indicators

2. **Combined data saving**
   - Single transaction for metrics + habits
   - `daily.upsert` endpoint
   - Optimistic UI updates
   - Error recovery

3. **Today's status indicator**
   - Dashboard widget showing completion
   - Quick view of uncompleted habits
   - Edit today's entry button

## Phase 7: GitHub-Style Heatmap Visualization
**Goal: Core visualization component**

1. **Heatmap data endpoint**
   - `dashboard.getYearData` - Fetch 365 days
   - Efficient query with single DB call
   - Calculate momentum scores
   - Cache with Redis

2. **Heatmap grid component**
   - SVG-based grid (53 weeks × 7 days)
   - Color intensity mapping
   - Responsive sizing
   - Month labels and day labels

3. **Heatmap interactivity**
   - Hover tooltips with day details
   - Click to view/edit day
   - Today indicator (pulsing border)
   - Empty day styling

4. **Color themes**
   - Light/dark mode palettes
   - Color scale legend
   - Colorblind-friendly option

## Phase 8: Statistics & Analytics
**Goal: Streak tracking and basic stats**

1. **Stats API endpoints**
   - `metrics.getStats` - Aggregated statistics
   - `metrics.getStreak` - Current and longest streaks
   - Efficient SQL queries with Prisma

2. **Stats panel component**
   - Current streak display
   - Best streak badge
   - Completion percentage
   - Average scores (7-day, 30-day, all-time)

3. **Habit success rates**
   - Per-habit completion rates
   - Mini sparkline charts
   - Trend indicators (up/down arrows)

## Phase 9: Habit Grid Visualization
**Goal: Individual habit heatmaps**

1. **Habit heatmap data**
   - Fetch per-habit completion data
   - Binary vs quantity visualization logic
   - Color coding per habit

2. **Habit grid component**
   - Collapsible section
   - Mini heatmap per habit
   - Completion percentage
   - Last 30 days sparkline

3. **Interactive features**
   - Expand/collapse all
   - Filter by habit
   - Sort by completion rate

## Phase 10: Polish & Optimization
**Goal: Production-ready application**

1. **Performance optimization**
   - Implement React Query caching strategy
   - Add loading states everywhere
   - Optimize database queries with indexes
   - Lazy load heavy components
   - Image optimization for icons

2. **Error handling**
   - Global error boundary
   - Form validation messages
   - API error toasts
   - Offline state handling
   - Retry logic for failed requests

3. **Mobile optimization**
   - Touch gestures for sliders
   - Pull-to-refresh
   - Responsive modals → drawers
   - Mobile-specific navigation
   - Viewport meta tags

4. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Focus management
   - Screen reader testing
   - Color contrast validation

5. **PWA features (optional)**
   - Service worker setup
   - Offline capability
   - Install prompt
   - App icons

## Phase 11: Future AI Integration Preparation
**Goal: Design space for Chrome AI**

1. **UI placeholders**
   - Insights panel skeleton
   - "Ask about your data" button (disabled)
   - Natural language input field (coming soon state)

2. **Data structure preparation**
   - Ensure notes field is indexed
   - Add metadata columns for future AI processing
   - Design correlation detection queries

3. **Feature flags setup**
   - Environment variable for AI features
   - Conditional rendering of AI UI
   - Gradual rollout capability

## Development Approach

### For each phase:
1. **Start with the API/backend** - Get data flow working
2. **Build minimal UI** - Function over form initially  
3. **Add interactivity** - User actions and feedback
4. **Polish the design** - Styling, animations, responsive behavior
5. **Test the flow** - Ensure it works end-to-end

### Best practices for AI-assisted development:
- Build and test incrementally - one feature at a time
- Use console.log liberally to debug
- Test on mobile viewport early and often
- Commit working code before adding complexity
- Keep components small and focused
- Use TypeScript strictly for better AI assistance

### Order of implementation priority:
1. **Critical path first**: Auth → Check-in → Heatmap
2. **Enhancement features**: Habits → Stats → Polish
3. **Nice-to-haves**: PWA → Advanced analytics

## Database Schema (Prisma)

```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  name          String?
  image         String?
  emailVerified DateTime?
  accounts      Account[]
  sessions      Session[]
  metrics       DailyMetric[]
  habits        Habit[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model DailyMetric {
  id           String      @id @default(cuid())
  userId       String
  date         DateTime    @db.Date
  mood         Int         // 1-10
  energy       Int         // 1-10
  productivity Int         // 1-10
  note         String?     @db.Text
  momentum     Float       // Calculated score
  habitLogs    HabitLog[]
  user         User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@unique([userId, date])
  @@index([userId, date])
}

model Habit {
  id        String      @id @default(cuid())
  userId    String
  name      String
  type      String      @default("boolean") // "boolean" or "quantity"
  target    Int?        // For quantity types
  color     String      @default("#10B981")
  isActive  Boolean     @default(true)
  order     Int         @default(0)
  logs      HabitLog[]
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@index([userId])
}

model HabitLog {
  id          String      @id @default(cuid())
  habitId     String
  metricId    String
  completed   Boolean     @default(false)
  value       Int?        // For quantity tracking
  habit       Habit       @relation(fields: [habitId], references: [id], onDelete: Cascade)
  dailyMetric DailyMetric @relation(fields: [metricId], references: [id], onDelete: Cascade)
  createdAt   DateTime    @default(now())

  @@unique([habitId, metricId])
  @@index([metricId])
}
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://daystack:localdev@localhost:5432/daystack?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: Email (for future magic links)
EMAIL_FROM="noreply@daystack.app"
EMAIL_SERVER="smtp://..."
```

## Docker Compose Configuration

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: daystack-db
    environment:
      POSTGRES_DB: daystack
      POSTGRES_USER: daystack
      POSTGRES_PASSWORD: localdev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U daystack"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: daystack-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```