import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  getBlogPosts, 
  getBlogPostBySlug,
  getPublishedBlogPosts,
  getRecentPublishedPosts
} from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  blog: router({
    getRecent: publicProcedure
      .input(z.object({ limit: z.number().default(3) }))
      .query(async ({ input }) => {
        return await getRecentPublishedPosts(input.limit);
      }),

    getAll: publicProcedure
      .input(z.object({ 
        tag: z.string().optional(),
        published: z.boolean().optional()
      }))
      .query(async ({ input, ctx }) => {
        if (input.published === false && ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return input.published === false 
          ? await getBlogPosts(input.tag)
          : await getPublishedBlogPosts(input.tag);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input, ctx }) => {
        const post = await getBlogPostBySlug(input.slug);
        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog post not found' });
        }
        if (!post.published && ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return post;
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        coverImage: z.string().optional(),
        tags: z.string(),
        published: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return await createBlogPost({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.published ? new Date() : undefined,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        content: z.string().min(1).optional(),
        coverImage: z.string().optional(),
        tags: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return await updateBlogPost(input.id, input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return await deleteBlogPost(input.id);
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        company: z.string().optional(),
        serviceInterest: z.string().optional(),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const { createContactInquiry } = await import("./db");
        await createContactInquiry(input);
        return { success: true };
      }),
  }),

  careers: router({
    getActiveJobs: publicProcedure.query(async () => {
      const { getActiveJobPostings } = await import("./db");
      return await getActiveJobPostings();
    }),

    getAllJobs: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      const { getAllJobPostings } = await import("./db");
      return await getAllJobPostings();
    }),

    getJobBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const { getJobPostingBySlug } = await import("./db");
        const job = await getJobPostingBySlug(input.slug);
        if (!job) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Job posting not found' });
        }
        if (!job.active) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'This position is no longer active' });
        }
        return job;
      }),

    createJob: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        department: z.string().optional(),
        location: z.string().optional(),
        employmentType: z.string().optional(),
        description: z.string().min(1),
        requirements: z.string().optional(),
        responsibilities: z.string().optional(),
        benefits: z.string().optional(),
        salaryRange: z.string().optional(),
        featuredImage: z.string().optional(),
        active: z.boolean().default(true),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const { createJobPosting } = await import("./db");
        return await createJobPosting(input);
      }),

    updateJob: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        department: z.string().optional(),
        location: z.string().optional(),
        employmentType: z.string().optional(),
        description: z.string().min(1).optional(),
        requirements: z.string().optional(),
        responsibilities: z.string().optional(),
        benefits: z.string().optional(),
        salaryRange: z.string().optional(),
        featuredImage: z.string().optional(),
        active: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const { updateJobPosting } = await import("./db");
        return await updateJobPosting(input.id, input);
      }),

    deleteJob: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const { deleteJobPosting } = await import("./db");
        return await deleteJobPosting(input.id);
      }),

    submitApplication: publicProcedure
      .input(z.object({
        jobId: z.number(),
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        coverLetter: z.string().optional(),
        resumeUrl: z.string().min(1),
        resumeKey: z.string().min(1),
        linkedinUrl: z.string().optional(),
        portfolioUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createJobApplication } = await import("./db");
        await createJobApplication(input);
        return { success: true };
      }),

    getApplications: protectedProcedure
      .input(z.object({ jobId: z.number().optional() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const { getJobApplications } = await import("./db");
        return await getJobApplications(input.jobId);
      }),

    updateApplicationStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "reviewing", "shortlisted", "rejected", "hired"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const { updateJobApplicationStatus } = await import("./db");
        return await updateJobApplicationStatus(input.id, input.status, input.notes);
      }),
  }),

  admin: router({
    getContactInquiries: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      const { getContactInquiries } = await import("./db");
      return await getContactInquiries();
    }),

    updateContactInquiryStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "closed"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const { updateContactInquiryStatus } = await import("./db");
        return await updateContactInquiryStatus(input.id, input.status);
      }),
  }),
});

export type AppRouter = typeof appRouter;
