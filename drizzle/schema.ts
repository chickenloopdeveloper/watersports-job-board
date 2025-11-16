import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with job board specific roles and fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["job_seeker", "recruiter", "admin"]).default("job_seeker").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Company profiles created by recruiters
 */
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  recruiterId: int("recruiterId").notNull(), // Foreign key to users table
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  website: varchar("website", { length: 500 }),
  logoUrl: varchar("logoUrl", { length: 1000 }),
  bannerUrl: varchar("bannerUrl", { length: 1000 }),
  location: varchar("location", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  companySize: varchar("companySize", { length: 50 }),
  isPremium: boolean("isPremium").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

/**
 * Job postings created by recruiters
 */
export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(), // Foreign key to companies table
  recruiterId: int("recruiterId").notNull(), // Foreign key to users table
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }),
  jobType: mysqlEnum("jobType", ["full_time", "part_time", "contract", "seasonal", "internship"]).notNull(),
  experienceLevel: mysqlEnum("experienceLevel", ["entry", "intermediate", "senior", "expert"]),
  salaryMin: int("salaryMin"),
  salaryMax: int("salaryMax"),
  salaryCurrency: varchar("salaryCurrency", { length: 10 }).default("USD"),
  skills: text("skills"), // JSON array of skills
  status: mysqlEnum("status", ["draft", "pending_approval", "active", "inactive", "rejected"]).default("pending_approval").notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

/**
 * Resume/profiles created by job seekers
 */
export const resumes = mysqlTable("resumes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(), // Foreign key to users table
  headline: varchar("headline", { length: 255 }),
  summary: text("summary"),
  experience: text("experience"), // JSON array of experience objects
  education: text("education"), // JSON array of education objects
  skills: text("skills"), // JSON array of skills
  certifications: text("certifications"), // JSON array of certifications
  location: varchar("location", { length: 255 }),
  phoneNumber: varchar("phoneNumber", { length: 50 }),
  linkedinUrl: varchar("linkedinUrl", { length: 500 }),
  portfolioUrl: varchar("portfolioUrl", { length: 500 }),
  photoUrl: varchar("photoUrl", { length: 1000 }),
  visibility: mysqlEnum("visibility", ["public", "private", "recruiters_only"]).default("public").notNull(),
  status: mysqlEnum("status", ["draft", "pending_approval", "active", "rejected"]).default("pending_approval").notNull(),
  isPremium: boolean("isPremium").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = typeof resumes.$inferInsert;

/**
 * Job applications submitted by job seekers
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(), // Foreign key to jobs table
  jobSeekerId: int("jobSeekerId").notNull(), // Foreign key to users table
  resumeId: int("resumeId").notNull(), // Foreign key to resumes table
  coverLetter: text("coverLetter"),
  status: mysqlEnum("status", ["submitted", "reviewed", "shortlisted", "rejected", "accepted"]).default("submitted").notNull(),
  notes: text("notes"), // Recruiter notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

/**
 * Saved jobs by job seekers
 */
export const savedJobs = mysqlTable("savedJobs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Foreign key to users table
  jobId: int("jobId").notNull(), // Foreign key to jobs table
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedJob = typeof savedJobs.$inferSelect;
export type InsertSavedJob = typeof savedJobs.$inferInsert;

/**
 * Saved job searches by job seekers
 */
export const savedSearches = mysqlTable("savedSearches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Foreign key to users table
  name: varchar("name", { length: 255 }).notNull(),
  searchParams: text("searchParams").notNull(), // JSON object with search criteria
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedSearch = typeof savedSearches.$inferSelect;
export type InsertSavedSearch = typeof savedSearches.$inferInsert;

/**
 * Saved candidates by recruiters
 */
export const savedCandidates = mysqlTable("savedCandidates", {
  id: int("id").autoincrement().primaryKey(),
  recruiterId: int("recruiterId").notNull(), // Foreign key to users table
  candidateId: int("candidateId").notNull(), // Foreign key to users table (job seeker)
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedCandidate = typeof savedCandidates.$inferSelect;
export type InsertSavedCandidate = typeof savedCandidates.$inferInsert;
