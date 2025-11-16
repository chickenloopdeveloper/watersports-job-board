# Watersports Job Board - Project TODO

## Database Schema & Setup
- [x] Design and implement database schema for users, companies, jobs, resumes, applications
- [x] Add user roles (job_seeker, recruiter, admin) to users table
- [x] Create companies table with profile information
- [x] Create jobs table with posting details and status
- [x] Create resumes table for job seeker profiles
- [x] Create applications table to track job applications
- [x] Create favorites tables (saved jobs, saved candidates, saved searches)
- [x] Push database schema to production

## Backend API - Authentication & Roles
- [x] Extend user model with role-based access control
- [x] Create protected procedures for each user role
- [x] Implement recruiter-specific procedures
- [x] Implement job seeker-specific procedures
- [x] Implement admin-specific procedures

## Backend API - Recruiter Features
- [x] Company profile creation and editing
- [x] Job posting creation, editing, and deactivation
- [x] View applications for posted jobs
- [x] Manage application pipeline (review, shortlist, reject)
- [x] Save job seekers to favorites
- [x] Recruiter dashboard data endpoint

## Backend API - Job Seeker Features
- [x] Resume/profile creation and editing
- [x] Job application submission
- [x] Save jobs to favorites
- [x] Save job searches
- [x] Profile visibility settings
- [x] Job seeker dashboard data endpoint

## Backend API - Admin Features
- [x] User management (list, edit, delete users)
- [x] Job approval/rejection workflow
- [x] Resume approval/rejection workflow
- [x] Edit job postings
- [x] Edit resumes
- [ ] Analytics data endpoints
- [ ] Content moderation tools

## Backend API - Public Features
- [x] Public job listings with search and filters
- [x] Public company profiles
- [x] Public resume listings (based on visibility settings)
- [ ] Job detail pages
- [ ] Company detail pages

## Frontend - Landing Page & Public Views
- [x] Design modern landing page with watersports theme
- [x] Public job listings page with search and filters
- [x] Job detail page with apply button
- [ ] Company profile public view
- [ ] Public resume listings (for recruiters to browse)
- [x] Navigation structure for all user types

## Frontend - Authentication
- [ ] Login/register flow for all user types
- [ ] Role selection during registration
- [ ] Social login integration (optional)
- [ ] Protected route handling

## Frontend - Recruiter Dashboard
- [ ] Recruiter dashboard overview
- [ ] Company profile creation/editing form
- [ ] Job posting form (create/edit)
- [ ] Job listings management (active/inactive)
- [ ] Applications inbox and pipeline management
- [ ] Saved candidates list
- [ ] Profile settings

## Frontend - Job Seeker Dashboard
- [ ] Job seeker dashboard overview
- [ ] Resume/profile creation and editing form
- [ ] Saved jobs list
- [ ] Saved searches list
- [ ] Application history and status tracking
- [ ] Profile visibility controls
- [ ] Profile settings

## Frontend - Admin Panel
- [ ] Admin dashboard with analytics
- [ ] User management interface
- [ ] Job moderation queue (approve/reject/edit)
- [ ] Resume moderation queue (approve/reject/edit)
- [ ] Content management tools
- [ ] Analytics and reporting views

## Social Sharing Features
- [ ] Generate shareable URLs for jobs
- [ ] Generate shareable URLs for company profiles
- [ ] Generate shareable URLs for resumes
- [ ] Instagram sharing (deep-link)
- [ ] Facebook sharing integration
- [ ] LinkedIn sharing integration
- [ ] WhatsApp sharing integration
- [ ] Telegram sharing integration

## Premium Features & Monetization
- [ ] Define premium feature tiers
- [ ] Featured job postings (highlighted in listings)
- [ ] Company profile enhancements (logo, banner, etc.)
- [ ] Resume visibility boost
- [ ] Premium job seeker profiles
- [ ] Payment integration preparation
- [ ] Ad placement zones (lightweight, non-intrusive)

## Polish & Testing
- [ ] Responsive design for all pages
- [ ] Loading states and error handling
- [ ] Empty states for all lists
- [ ] Form validation and user feedback
- [ ] Email notifications setup (optional)
- [ ] SEO optimization for public pages
- [ ] Cross-browser testing
- [ ] Final QA and bug fixes
