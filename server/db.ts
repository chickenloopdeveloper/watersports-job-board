import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  applications, 
  companies, 
  InsertApplication, 
  InsertCompany, 
  InsertJob, 
  InsertResume, 
  InsertSavedCandidate, 
  InsertSavedJob, 
  InsertSavedSearch, 
  InsertUser, 
  jobs, 
  resumes, 
  savedCandidates, 
  savedJobs, 
  savedSearches, 
  users 
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER MANAGEMENT ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(userId: number, role: "job_seeker" | "recruiter" | "admin") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

// ============ COMPANY MANAGEMENT ============

export async function createCompany(company: InsertCompany) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(companies).values(company);
  return result;
}

export async function getCompanyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCompaniesByRecruiter(recruiterId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(companies).where(eq(companies.recruiterId, recruiterId));
}

export async function updateCompany(id: number, data: Partial<InsertCompany>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(companies).set(data).where(eq(companies.id, id));
}

export async function getAllCompanies() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(companies).orderBy(desc(companies.createdAt));
}

// ============ JOB MANAGEMENT ============

export async function createJob(job: InsertJob) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(jobs).values(job);
  return result;
}

export async function getJobById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getJobsByRecruiter(recruiterId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(jobs).where(eq(jobs.recruiterId, recruiterId)).orderBy(desc(jobs.createdAt));
}

export async function getJobsByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(jobs).where(eq(jobs.companyId, companyId)).orderBy(desc(jobs.createdAt));
}

export async function updateJob(id: number, data: Partial<InsertJob>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(jobs).set(data).where(eq(jobs.id, id));
}

export async function getActiveJobs(filters?: { search?: string; location?: string; jobType?: string }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions: any[] = [eq(jobs.status, "active")];
  
  if (filters?.search) {
    conditions.push(
      or(
        like(jobs.title, `%${filters.search}%`),
        like(jobs.description, `%${filters.search}%`)
      )
    );
  }
  
  if (filters?.location) {
    conditions.push(like(jobs.location, `%${filters.location}%`));
  }
  
  if (filters?.jobType) {
    conditions.push(eq(jobs.jobType, filters.jobType as any));
  }
  
  return await db.select().from(jobs).where(and(...conditions)).orderBy(desc(jobs.isFeatured), desc(jobs.createdAt));
}

export async function getAllJobs() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
}

// ============ RESUME MANAGEMENT ============

export async function createResume(resume: InsertResume) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(resumes).values(resume);
  return result;
}

export async function getResumeByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(resumes).where(eq(resumes.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getResumeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(resumes).where(eq(resumes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateResume(id: number, data: Partial<InsertResume>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(resumes).set(data).where(eq(resumes.id, id));
}

export async function getPublicResumes(filters?: { search?: string; location?: string }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions: any[] = [
    eq(resumes.status, "active"),
    or(eq(resumes.visibility, "public"), eq(resumes.visibility, "recruiters_only"))
  ];
  
  if (filters?.search) {
    conditions.push(
      or(
        like(resumes.headline, `%${filters.search}%`),
        like(resumes.summary, `%${filters.search}%`),
        like(resumes.skills, `%${filters.search}%`)
      )
    );
  }
  
  if (filters?.location) {
    conditions.push(like(resumes.location, `%${filters.location}%`));
  }
  
  return await db.select().from(resumes).where(and(...conditions)).orderBy(desc(resumes.isPremium), desc(resumes.updatedAt));
}

export async function getAllResumes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(resumes).orderBy(desc(resumes.createdAt));
}

// ============ APPLICATION MANAGEMENT ============

export async function createApplication(application: InsertApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(applications).values(application);
  return result;
}

export async function getApplicationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getApplicationsByJobSeeker(jobSeekerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(applications).where(eq(applications.jobSeekerId, jobSeekerId)).orderBy(desc(applications.createdAt));
}

export async function getApplicationsByJob(jobId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(applications).where(eq(applications.jobId, jobId)).orderBy(desc(applications.createdAt));
}

export async function updateApplication(id: number, data: Partial<InsertApplication>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(applications).set(data).where(eq(applications.id, id));
}

export async function checkExistingApplication(jobId: number, jobSeekerId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(applications)
    .where(and(eq(applications.jobId, jobId), eq(applications.jobSeekerId, jobSeekerId)))
    .limit(1);
  return result.length > 0;
}

// ============ SAVED JOBS ============

export async function saveJob(userId: number, jobId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(savedJobs).values({ userId, jobId });
}

export async function unsaveJob(userId: number, jobId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(savedJobs).where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
}

export async function getSavedJobsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(savedJobs).where(eq(savedJobs.userId, userId)).orderBy(desc(savedJobs.createdAt));
}

export async function checkJobSaved(userId: number, jobId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(savedJobs)
    .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)))
    .limit(1);
  return result.length > 0;
}

// ============ SAVED SEARCHES ============

export async function createSavedSearch(search: InsertSavedSearch) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(savedSearches).values(search);
}

export async function getSavedSearchesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(savedSearches).where(eq(savedSearches.userId, userId)).orderBy(desc(savedSearches.createdAt));
}

export async function deleteSavedSearch(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(savedSearches).where(eq(savedSearches.id, id));
}

// ============ SAVED CANDIDATES ============

export async function saveCandidate(candidate: InsertSavedCandidate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(savedCandidates).values(candidate);
}

export async function unsaveCandidate(recruiterId: number, candidateId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(savedCandidates).where(
    and(eq(savedCandidates.recruiterId, recruiterId), eq(savedCandidates.candidateId, candidateId))
  );
}

export async function getSavedCandidatesByRecruiter(recruiterId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(savedCandidates).where(eq(savedCandidates.recruiterId, recruiterId)).orderBy(desc(savedCandidates.createdAt));
}

export async function checkCandidateSaved(recruiterId: number, candidateId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(savedCandidates)
    .where(and(eq(savedCandidates.recruiterId, recruiterId), eq(savedCandidates.candidateId, candidateId)))
    .limit(1);
  return result.length > 0;
}
