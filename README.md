# Watersports Job Board

A modern, full-stack job board platform dedicated to the watersports industry. Built with React, Node.js, Express, tRPC, and MySQL.

![Watersports Job Board](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌊 Overview

This platform connects watersports professionals with companies worldwide, featuring three distinct user roles:

- **Job Seekers**: Create profiles, build resumes, apply to jobs, save searches
- **Recruiters**: Post jobs, manage company profiles, review applications, find talent
- **Admins**: Moderate content, manage users, approve jobs/resumes, access analytics

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling with OKLCH color space
- **Wouter** - Lightweight routing
- **tRPC React Query** - Type-safe API client
- **shadcn/ui** - Component library
- **Lucide Icons** - Icon system
- **Sonner** - Toast notifications

### Backend
- **Node.js 22** - Runtime environment
- **Express 4** - Web framework
- **tRPC 11** - End-to-end typesafe APIs
- **Drizzle ORM** - TypeScript ORM
- **MySQL/TiDB** - Database
- **Superjson** - JSON serialization with Date support
- **Zod** - Schema validation

### Development Tools
- **Vite** - Build tool and dev server
- **pnpm** - Package manager
- **TypeScript** - Language
- **ESLint** - Linting

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your Mac/Linux system:

### Required Software

1. **Node.js (v22.x or higher)**
   ```bash
   # Mac (using Homebrew)
   brew install node@22
   
   # Linux (using nvm - recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc  # or ~/.zshrc
   nvm install 22
   nvm use 22
   
   # Verify installation
   node --version  # Should show v22.x.x
   ```

2. **pnpm (Package Manager)**
   ```bash
   # Install pnpm globally
   npm install -g pnpm
   
   # Verify installation
   pnpm --version
   ```

3. **Git**
   ```bash
   # Mac
   brew install git
   
   # Linux (Debian/Ubuntu)
   sudo apt-get update
   sudo apt-get install git
   
   # Linux (Fedora)
   sudo dnf install git
   
   # Verify installation
   git --version
   ```

4. **MySQL (v8.0 or higher)** - For local development
   ```bash
   # Mac
   brew install mysql
   brew services start mysql
   
   # Linux (Debian/Ubuntu)
   sudo apt-get update
   sudo apt-get install mysql-server
   sudo systemctl start mysql
   sudo systemctl enable mysql
   
   # Linux (Fedora)
   sudo dnf install mysql-server
   sudo systemctl start mysqld
   sudo systemctl enable mysqld
   
   # Secure your MySQL installation
   sudo mysql_secure_installation
   ```

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd watersports-job-board
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all required packages for both frontend and backend.

### 3. Database Setup

#### Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE watersports_job_board;

# Create a user (optional but recommended)
CREATE USER 'jobboard_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON watersports_job_board.* TO 'jobboard_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your database connection string:

```env
# Database
DATABASE_URL=mysql://jobboard_user:your_secure_password@localhost:3306/watersports_job_board

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OAuth Configuration (for Manus OAuth - optional for local dev)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# App Configuration
VITE_APP_TITLE=Watersports Job Board
VITE_APP_LOGO=/logo.png

# Owner Configuration (set your own OpenID after first login)
OWNER_OPEN_ID=your-openid-here
OWNER_NAME=Admin User
```

#### Run Database Migrations

```bash
pnpm db:push
```

This command will:
1. Generate migration files from your schema
2. Apply migrations to your database
3. Create all necessary tables

### 4. Start Development Server

```bash
pnpm dev
```

This will start:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (Express server with tRPC)

The frontend will proxy API requests to the backend automatically.

## 📁 Project Structure

```
watersports-job-board/
├── client/                    # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── _core/           # Core utilities and hooks
│   │   ├── components/      # Reusable UI components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/            # Library configurations
│   │   │   └── trpc.ts     # tRPC client setup
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Jobs.tsx
│   │   │   └── JobDetail.tsx
│   │   ├── App.tsx         # Main app component with routes
│   │   ├── main.tsx        # App entry point
│   │   └── index.css       # Global styles
│   └── index.html
│
├── server/                   # Backend Node.js application
│   ├── _core/               # Core server utilities
│   │   ├── context.ts      # tRPC context
│   │   ├── trpc.ts         # tRPC router setup
│   │   └── index.ts        # Express server
│   ├── db.ts               # Database query helpers
│   ├── routers.ts          # tRPC API routes
│   └── storage.ts          # S3 storage helpers
│
├── drizzle/                 # Database schema and migrations
│   ├── schema.ts           # Database schema definitions
│   └── [migrations]/       # Generated migration files
│
├── shared/                  # Shared code between client/server
│   └── const.ts            # Shared constants
│
├── drizzle.config.ts       # Drizzle ORM configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## 🗄️ Database Schema

The application uses 8 main tables:

1. **users** - User accounts with roles (job_seeker, recruiter, admin)
2. **companies** - Company profiles created by recruiters
3. **jobs** - Job postings with status workflow
4. **resumes** - Job seeker profiles with visibility settings
5. **applications** - Job applications with pipeline tracking
6. **savedJobs** - Jobs bookmarked by job seekers
7. **savedSearches** - Saved search queries
8. **savedCandidates** - Candidates bookmarked by recruiters

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server (frontend + backend)
pnpm dev:client       # Start only frontend dev server
pnpm dev:server       # Start only backend dev server

# Database
pnpm db:push          # Generate and apply database migrations
pnpm db:studio        # Open Drizzle Studio (database GUI)

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build locally

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking
```

## 🌐 API Architecture

This project uses **tRPC** for type-safe API communication:

- **No REST endpoints** - All API calls are tRPC procedures
- **End-to-end type safety** - TypeScript types flow from server to client
- **Automatic serialization** - Dates and complex types work seamlessly
- **React Query integration** - Built-in caching and state management

### Example API Usage

```typescript
// Server (server/routers.ts)
export const appRouter = router({
  job: router({
    getActive: publicProcedure
      .input(z.object({ search: z.string().optional() }))
      .query(async ({ input }) => {
        return await db.getActiveJobs(input);
      }),
  }),
});

// Client (client/src/pages/Jobs.tsx)
const { data: jobs, isLoading } = trpc.job.getActive.useQuery({
  search: searchQuery || undefined,
});
```

## 🔐 Authentication

The application uses **Manus OAuth** for authentication:

- Users sign in through the Manus OAuth portal
- Session managed with JWT cookies
- Role-based access control (RBAC) at the API level
- Protected procedures automatically inject user context

### User Roles

- **job_seeker** - Can create resumes, apply to jobs, save searches
- **recruiter** - Can post jobs, manage companies, review applications
- **admin** - Full access to moderate content and manage users

## 🎨 UI/UX Features

- **Ocean-inspired color palette** - Blues, turquoise, and sun yellow
- **Responsive design** - Mobile-first approach
- **Modern typography** - Inter for body, Poppins for headings
- **Smooth animations** - Tailwind CSS transitions
- **Toast notifications** - User feedback with Sonner
- **Loading states** - Skeleton screens and spinners
- **Empty states** - Helpful messages when no data

## 🚢 Deployment

### Environment Variables for Production

Ensure these are set in your production environment:

```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=<strong-random-secret>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=<your-admin-openid>
NODE_ENV=production
```

### Build for Production

```bash
pnpm build
```

This creates optimized builds in:
- `client/dist/` - Frontend static files
- `server/` - Backend (no build needed, runs with Node.js)

### Running in Production

```bash
# Start the production server
NODE_ENV=production node server/_core/index.js
```

Or use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server/_core/index.js --name watersports-job-board
pm2 save
pm2 startup
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if MySQL is running
# Mac
brew services list | grep mysql

# Linux
sudo systemctl status mysql

# Test connection
mysql -u jobboard_user -p -h localhost watersports_job_board
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Database Schema Out of Sync

```bash
# Reset database (WARNING: This will delete all data)
pnpm db:push --force

# Or manually drop and recreate
mysql -u root -p
DROP DATABASE watersports_job_board;
CREATE DATABASE watersports_job_board;
EXIT;
pnpm db:push
```

## 📝 Development Workflow

1. **Create a new feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Update schema in `drizzle/schema.ts` if needed
   - Add database helpers in `server/db.ts`
   - Create tRPC procedures in `server/routers.ts`
   - Build UI components in `client/src/pages/`

3. **Run migrations**
   ```bash
   pnpm db:push
   ```

4. **Test your changes**
   ```bash
   pnpm dev
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review the troubleshooting section

## 🎯 Roadmap

- [ ] Complete recruiter dashboard
- [ ] Complete job seeker dashboard
- [ ] Complete admin panel
- [ ] Add social sharing (Facebook, LinkedIn, WhatsApp, Telegram, Instagram)
- [ ] Implement premium features and payment integration
- [ ] Add email notifications
- [ ] Implement advanced search with filters
- [ ] Add resume parsing
- [ ] Mobile app (React Native)

---

Built with ❤️ for the watersports community
