import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

// Role-based procedure middleware
const recruiterProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "recruiter" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Recruiter access required" });
  }
  return next({ ctx });
});

const jobSeekerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "job_seeker" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Job seeker access required" });
  }
  return next({ ctx });
});

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    updateRole: protectedProcedure
      .input(z.object({ role: z.enum(["job_seeker", "recruiter"]) }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserRole(ctx.user.id, input.role);
        return { success: true };
      }),
  }),

  // ============ COMPANY ROUTES ============
  company: router({
    create: recruiterProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        website: z.string().optional(),
        logoUrl: z.string().optional(),
        bannerUrl: z.string().optional(),
        location: z.string().optional(),
        industry: z.string().optional(),
        companySize: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createCompany({ ...input, recruiterId: ctx.user.id });
        return { success: true };
      }),
    
    update: recruiterProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        website: z.string().optional(),
        logoUrl: z.string().optional(),
        bannerUrl: z.string().optional(),
        location: z.string().optional(),
        industry: z.string().optional(),
        companySize: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const company = await db.getCompanyById(input.id);
        if (!company || (company.recruiterId !== ctx.user.id && ctx.user.role !== "admin")) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        await db.updateCompany(id, data);
        return { success: true };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCompanyById(input.id);
      }),
    
    getMyCompanies: recruiterProcedure.query(async ({ ctx }) => {
      return await db.getCompaniesByRecruiter(ctx.user.id);
    }),
    
    getAll: publicProcedure.query(async () => {
      return await db.getAllCompanies();
    }),
  }),

  // ============ JOB ROUTES ============
  job: router({
    create: recruiterProcedure
      .input(z.object({
        companyId: z.number(),
        title: z.string(),
        description: z.string(),
        location: z.string().optional(),
        jobType: z.enum(["full_time", "part_time", "contract", "seasonal", "internship"]),
        experienceLevel: z.enum(["entry", "intermediate", "senior", "expert"]).optional(),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
        salaryCurrency: z.string().optional(),
        skills: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const company = await db.getCompanyById(input.companyId);
        if (!company || (company.recruiterId !== ctx.user.id && ctx.user.role !== "admin")) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.createJob({ ...input, recruiterId: ctx.user.id, status: "pending_approval" });
        return { success: true };
      }),
    
    update: recruiterProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        jobType: z.enum(["full_time", "part_time", "contract", "seasonal", "internship"]).optional(),
        experienceLevel: z.enum(["entry", "intermediate", "senior", "expert"]).optional(),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
        salaryCurrency: z.string().optional(),
        skills: z.string().optional(),
        status: z.enum(["draft", "pending_approval", "active", "inactive"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const job = await db.getJobById(input.id);
        if (!job || (job.recruiterId !== ctx.user.id && ctx.user.role !== "admin")) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        await db.updateJob(id, data);
        return { success: true };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getJobById(input.id);
      }),
    
    getMyJobs: recruiterProcedure.query(async ({ ctx }) => {
      return await db.getJobsByRecruiter(ctx.user.id);
    }),
    
    getActive: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        location: z.string().optional(),
        jobType: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getActiveJobs(input);
      }),
    
    getAll: adminProcedure.query(async () => {
      return await db.getAllJobs();
    }),
  }),

  // ============ RESUME ROUTES ============
  resume: router({
    create: jobSeekerProcedure
      .input(z.object({
        headline: z.string().optional(),
        summary: z.string().optional(),
        experience: z.string().optional(),
        education: z.string().optional(),
        skills: z.string().optional(),
        certifications: z.string().optional(),
        location: z.string().optional(),
        phoneNumber: z.string().optional(),
        linkedinUrl: z.string().optional(),
        portfolioUrl: z.string().optional(),
        photoUrl: z.string().optional(),
        visibility: z.enum(["public", "private", "recruiters_only"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getResumeByUserId(ctx.user.id);
        if (existing) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Resume already exists" });
        }
        await db.createResume({ ...input, userId: ctx.user.id, status: "pending_approval" });
        return { success: true };
      }),
    
    update: jobSeekerProcedure
      .input(z.object({
        id: z.number(),
        headline: z.string().optional(),
        summary: z.string().optional(),
        experience: z.string().optional(),
        education: z.string().optional(),
        skills: z.string().optional(),
        certifications: z.string().optional(),
        location: z.string().optional(),
        phoneNumber: z.string().optional(),
        linkedinUrl: z.string().optional(),
        portfolioUrl: z.string().optional(),
        photoUrl: z.string().optional(),
        visibility: z.enum(["public", "private", "recruiters_only"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const resume = await db.getResumeById(input.id);
        if (!resume || (resume.userId !== ctx.user.id && ctx.user.role !== "admin")) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        await db.updateResume(id, data);
        return { success: true };
      }),
    
    getMine: jobSeekerProcedure.query(async ({ ctx }) => {
      return await db.getResumeByUserId(ctx.user.id);
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const resume = await db.getResumeById(input.id);
        if (!resume || resume.visibility === "private") {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return resume;
      }),
    
    getPublic: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        location: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getPublicResumes(input);
      }),
    
    getAll: adminProcedure.query(async () => {
      return await db.getAllResumes();
    }),
  }),

  // ============ APPLICATION ROUTES ============
  application: router({
    create: jobSeekerProcedure
      .input(z.object({
        jobId: z.number(),
        coverLetter: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const resume = await db.getResumeByUserId(ctx.user.id);
        if (!resume) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Please create a resume first" });
        }
        
        const existing = await db.checkExistingApplication(input.jobId, ctx.user.id);
        if (existing) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Already applied to this job" });
        }
        
        await db.createApplication({
          jobId: input.jobId,
          jobSeekerId: ctx.user.id,
          resumeId: resume.id,
          coverLetter: input.coverLetter,
          status: "submitted",
        });
        return { success: true };
      }),
    
    updateStatus: recruiterProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["submitted", "reviewed", "shortlisted", "rejected", "accepted"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const application = await db.getApplicationById(input.id);
        if (!application) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        
        const job = await db.getJobById(application.jobId);
        if (!job || (job.recruiterId !== ctx.user.id && ctx.user.role !== "admin")) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        
        const { id, ...data } = input;
        await db.updateApplication(id, data);
        return { success: true };
      }),
    
    getMyApplications: jobSeekerProcedure.query(async ({ ctx }) => {
      return await db.getApplicationsByJobSeeker(ctx.user.id);
    }),
    
    getByJob: recruiterProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ ctx, input }) => {
        const job = await db.getJobById(input.jobId);
        if (!job || (job.recruiterId !== ctx.user.id && ctx.user.role !== "admin")) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await db.getApplicationsByJob(input.jobId);
      }),
  }),

  // ============ SAVED JOBS ============
  savedJob: router({
    save: jobSeekerProcedure
      .input(z.object({ jobId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.saveJob(ctx.user.id, input.jobId);
        return { success: true };
      }),
    
    unsave: jobSeekerProcedure
      .input(z.object({ jobId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.unsaveJob(ctx.user.id, input.jobId);
        return { success: true };
      }),
    
    getMySaved: jobSeekerProcedure.query(async ({ ctx }) => {
      return await db.getSavedJobsByUser(ctx.user.id);
    }),
    
    checkSaved: jobSeekerProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.checkJobSaved(ctx.user.id, input.jobId);
      }),
  }),

  // ============ SAVED SEARCHES ============
  savedSearch: router({
    create: jobSeekerProcedure
      .input(z.object({
        name: z.string(),
        searchParams: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createSavedSearch({ ...input, userId: ctx.user.id });
        return { success: true };
      }),
    
    getMySaved: jobSeekerProcedure.query(async ({ ctx }) => {
      return await db.getSavedSearchesByUser(ctx.user.id);
    }),
    
    delete: jobSeekerProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteSavedSearch(input.id);
        return { success: true };
      }),
  }),

  // ============ SAVED CANDIDATES ============
  savedCandidate: router({
    save: recruiterProcedure
      .input(z.object({
        candidateId: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.saveCandidate({ ...input, recruiterId: ctx.user.id });
        return { success: true };
      }),
    
    unsave: recruiterProcedure
      .input(z.object({ candidateId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.unsaveCandidate(ctx.user.id, input.candidateId);
        return { success: true };
      }),
    
    getMySaved: recruiterProcedure.query(async ({ ctx }) => {
      return await db.getSavedCandidatesByRecruiter(ctx.user.id);
    }),
    
    checkSaved: recruiterProcedure
      .input(z.object({ candidateId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.checkCandidateSaved(ctx.user.id, input.candidateId);
      }),
  }),

  // ============ ADMIN ROUTES ============
  admin: router({
    getUsers: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
    
    updateUserRole: adminProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(["job_seeker", "recruiter", "admin"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateUserRole(input.userId, input.role);
        return { success: true };
      }),
    
    approveJob: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateJob(input.id, { status: "active" });
        return { success: true };
      }),
    
    rejectJob: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateJob(input.id, { status: "rejected" });
        return { success: true };
      }),
    
    approveResume: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateResume(input.id, { status: "active" });
        return { success: true };
      }),
    
    rejectResume: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateResume(input.id, { status: "rejected" });
        return { success: true };
      }),
    
    updateJob: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["draft", "pending_approval", "active", "inactive", "rejected"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateJob(id, data);
        return { success: true };
      }),
    
    updateResume: adminProcedure
      .input(z.object({
        id: z.number(),
        headline: z.string().optional(),
        summary: z.string().optional(),
        status: z.enum(["draft", "pending_approval", "active", "rejected"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateResume(id, data);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
