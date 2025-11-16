# Installation Guide - Watersports Job Board

Complete step-by-step installation guide for Mac and Linux systems.

## Table of Contents
- [System Requirements](#system-requirements)
- [Tech Stack Overview](#tech-stack-overview)
- [Mac Installation](#mac-installation)
- [Linux Installation](#linux-installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## System Requirements

- **OS**: macOS 10.15+ or Linux (Ubuntu 20.04+, Debian 11+, Fedora 35+)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 2GB free space
- **Internet**: Required for package downloads

---

## Tech Stack Overview

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 6.x | Build Tool & Dev Server |
| Tailwind CSS | 4.x | Styling Framework |
| tRPC | 11.x | Type-safe API Client |
| React Query | 5.x | Data Fetching & Caching |
| Wouter | 3.x | Routing |
| shadcn/ui | Latest | Component Library |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 22.x | JavaScript Runtime |
| Express | 4.x | Web Framework |
| tRPC | 11.x | Type-safe API Server |
| Drizzle ORM | Latest | Database ORM |
| MySQL | 8.0+ | Database |
| Zod | 3.x | Schema Validation |
| Superjson | 2.x | Serialization |

### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| pnpm | 9.x | Package Manager |
| TypeScript | 5.x | Language |
| ESLint | 9.x | Code Linting |

---

## Mac Installation

### Step 1: Install Homebrew (if not installed)

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Verify installation
brew --version
```

### Step 2: Install Node.js 22

```bash
# Install Node.js 22
brew install node@22

# Link it (if needed)
brew link node@22

# Verify installation
node --version   # Should show v22.x.x
npm --version    # Should show 10.x.x or higher
```

### Step 3: Install pnpm

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version   # Should show 9.x.x or higher
```

### Step 4: Install Git

```bash
# Install Git
brew install git

# Verify installation
git --version

# Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 5: Install MySQL

```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Verify MySQL is running
brew services list | grep mysql

# Secure MySQL installation (recommended)
mysql_secure_installation
```

**MySQL Secure Installation Prompts:**
- Set root password: **Yes** (choose a strong password)
- Remove anonymous users: **Yes**
- Disallow root login remotely: **Yes**
- Remove test database: **Yes**
- Reload privilege tables: **Yes**

---

## Linux Installation

### Ubuntu/Debian

#### Step 1: Update System

```bash
# Update package list
sudo apt-get update
sudo apt-get upgrade -y
```

#### Step 2: Install Node.js 22

```bash
# Install Node.js using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version   # Should show v22.x.x
npm --version
```

**Alternative: Using nvm (recommended for development)**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load nvm
source ~/.bashrc  # or source ~/.zshrc for zsh

# Install Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

# Verify
node --version
```

#### Step 3: Install pnpm

```bash
# Install pnpm
npm install -g pnpm

# Verify
pnpm --version
```

#### Step 4: Install Git

```bash
# Install Git
sudo apt-get install -y git

# Verify
git --version

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### Step 5: Install MySQL

```bash
# Install MySQL Server
sudo apt-get install -y mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Check status
sudo systemctl status mysql

# Secure installation
sudo mysql_secure_installation
```

### Fedora/RHEL/CentOS

#### Step 1: Update System

```bash
sudo dnf update -y
```

#### Step 2: Install Node.js 22

```bash
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install -y nodejs

# Verify
node --version
npm --version
```

#### Step 3: Install pnpm

```bash
npm install -g pnpm
pnpm --version
```

#### Step 4: Install Git

```bash
sudo dnf install -y git
git --version
```

#### Step 5: Install MySQL

```bash
# Install MySQL Server
sudo dnf install -y mysql-server

# Start and enable service
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Get temporary root password
sudo grep 'temporary password' /var/log/mysqld.log

# Secure installation
sudo mysql_secure_installation
```

---

## Database Setup

### Step 1: Login to MySQL

```bash
# Login as root
mysql -u root -p
# Enter the password you set during mysql_secure_installation
```

### Step 2: Create Database and User

```sql
-- Create the database
CREATE DATABASE watersports_job_board CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create a dedicated user (recommended for security)
CREATE USER 'jobboard_user'@'localhost' IDENTIFIED BY 'YourSecurePassword123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON watersports_job_board.* TO 'jobboard_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify database was created
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

### Step 3: Test Database Connection

```bash
# Test connection with new user
mysql -u jobboard_user -p watersports_job_board

# If successful, you'll see the MySQL prompt
# Exit with: EXIT;
```

---

## Clone and Setup Project

### Step 1: Clone Repository

```bash
# Clone from GitHub
git clone https://github.com/chickenloopdeveloper/watersports-job-board.git

# Navigate to project directory
cd watersports-job-board

# Verify you're in the right directory
ls -la
# You should see: package.json, client/, server/, drizzle/, etc.
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (frontend + backend)
pnpm install

# This will take 2-5 minutes depending on your internet speed
```

**What gets installed:**
- React and React DOM
- TypeScript and type definitions
- Vite build tool
- Express web server
- tRPC for API communication
- Drizzle ORM for database
- Tailwind CSS and UI components
- All other dependencies (~200+ packages)

### Step 3: Configure Environment

The project uses environment variables managed by the Manus platform. For local development, you need to set up the database connection:

**Note:** This project is designed to run on the Manus platform which provides automatic environment configuration. For local development, you'll need to manually configure some variables.

Create a `.env` file in the project root:

```bash
# Create .env file
touch .env
```

Edit `.env` with your preferred text editor:

```bash
# Using nano
nano .env

# Or using vim
vim .env

# Or using VS Code
code .env
```

Add the following configuration:

```env
# Database Connection
DATABASE_URL=mysql://jobboard_user:YourSecurePassword123!@localhost:3306/watersports_job_board

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# OAuth (for local development, these can be placeholder values)
OAUTH_SERVER_URL=http://localhost:3000
VITE_OAUTH_PORTAL_URL=http://localhost:5173

# App Configuration
VITE_APP_TITLE=Watersports Job Board
VITE_APP_LOGO=/logo.png

# Owner Configuration (will be set after first login)
OWNER_OPEN_ID=local-admin
OWNER_NAME=Local Admin
```

**Important:** Replace `YourSecurePassword123!` with the actual password you set for the MySQL user.

### Step 4: Run Database Migrations

```bash
# Generate and apply migrations
pnpm db:push
```

**Expected output:**
```
Reading schema files...
8 tables
applications 9 columns 0 indexes 0 fks
companies 13 columns 0 indexes 0 fks
jobs 17 columns 0 indexes 0 fks
resumes 18 columns 0 indexes 0 fks
savedCandidates 5 columns 0 indexes 0 fks
savedJobs 4 columns 0 indexes 0 fks
savedSearches 5 columns 0 indexes 0 fks
users 9 columns 0 indexes 0 fks
✓ Your SQL migration file → drizzle/xxxx_migration.sql
✓ migrations applied successfully!
```

### Step 5: Verify Database Tables

```bash
# Login to MySQL
mysql -u jobboard_user -p watersports_job_board

# Show tables
SHOW TABLES;

# You should see 8 tables:
# - applications
# - companies
# - jobs
# - resumes
# - savedCandidates
# - savedJobs
# - savedSearches
# - users

# Exit
EXIT;
```

---

## Running the Application

### Development Mode (Recommended for Local Development)

```bash
# Start both frontend and backend
pnpm dev
```

**This will start:**
- **Backend API**: http://localhost:3000 (Express + tRPC)
- **Frontend**: http://localhost:5173 (Vite dev server)

**Expected output:**
```
> watersports-job-board@1.0.0 dev
> concurrently "pnpm dev:server" "pnpm dev:client"

[server] Server running on http://localhost:3000/
[client] VITE v6.x.x ready in 1234 ms
[client] ➜  Local:   http://localhost:5173/
[client] ➜  Network: use --host to expose
```

### Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the Watersports Job Board landing page with:
- Ocean-themed blue color scheme
- Navigation bar
- Hero section with search
- Features section
- Footer

### Alternative: Run Separately

If you want to run frontend and backend separately:

```bash
# Terminal 1 - Backend
pnpm dev:server

# Terminal 2 - Frontend  
pnpm dev:client
```

---

## Verification

### 1. Check Backend API

```bash
# Test if backend is running
curl http://localhost:3000/api/trpc/auth.me

# Expected response (when not logged in):
# {"result":{"data":null}}
```

### 2. Check Frontend

Open http://localhost:5173 in your browser and verify:
- ✅ Page loads without errors
- ✅ Ocean blue theme is visible
- ✅ Navigation bar appears
- ✅ Search bar is functional
- ✅ "Browse Jobs" link works

### 3. Check Database Connection

```bash
# View logs for any database errors
# If you see this, database is connected:
# [Database] Connected successfully
```

### 4. Test Navigation

Click through the application:
- Home page → `/`
- Browse Jobs → `/jobs`
- Click on a job → `/jobs/:id`

---

## Troubleshooting

### Issue: Port 3000 Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 pnpm dev:server
```

### Issue: Port 5173 Already in Use

```bash
# Find and kill process
lsof -i :5173
kill -9 <PID>
```

### Issue: MySQL Connection Refused

```bash
# Check if MySQL is running
# Mac:
brew services list | grep mysql
brew services start mysql

# Linux:
sudo systemctl status mysql
sudo systemctl start mysql

# Test connection
mysql -u jobboard_user -p
```

### Issue: "Cannot find module" Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Database Migration Fails

```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test database connection
mysql -u jobboard_user -p watersports_job_board

# Force migration (WARNING: drops all data)
pnpm db:push --force
```

### Issue: TypeScript Errors

```bash
# Run type check
pnpm type-check

# If errors persist, restart TypeScript server
# In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Issue: Blank Page or White Screen

1. Check browser console (F12) for errors
2. Verify backend is running: `curl http://localhost:3000`
3. Check if .env file exists and has correct values
4. Clear browser cache and reload

### Issue: "EADDRINUSE" Error

```bash
# Kill all node processes
pkill -f node

# Or restart your computer
```

---

## Next Steps

After successful installation:

1. **Explore the Application**
   - Browse the landing page
   - View job listings
   - Check out the job detail pages

2. **Development Workflow**
   - Make changes to files in `client/src/` for frontend
   - Make changes to files in `server/` for backend
   - Changes will hot-reload automatically

3. **Database Management**
   ```bash
   # Open Drizzle Studio (visual database editor)
   pnpm db:studio
   # Opens at http://localhost:4983
   ```

4. **Add Sample Data**
   - Create companies through the API
   - Add job postings
   - Create test user accounts

5. **Continue Development**
   - Build the recruiter dashboard
   - Build the job seeker dashboard
   - Build the admin panel
   - Add social sharing features

---

## Additional Resources

- **Project README**: See `README.md` for project overview
- **Database Schema**: See `drizzle/schema.ts` for table definitions
- **API Routes**: See `server/routers.ts` for all API endpoints
- **Frontend Pages**: See `client/src/pages/` for page components

---

## Getting Help

If you encounter issues not covered here:

1. Check the main `README.md` file
2. Review error messages carefully
3. Search for the error message online
4. Check if MySQL and Node.js are running
5. Verify all environment variables are set correctly

---

**Installation complete!** 🎉 You're ready to start developing the Watersports Job Board.
