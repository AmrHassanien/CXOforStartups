import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enum types
// ---------------------------------------------------------------------------
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const applicationStatusEnum = pgEnum("application_status", [
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
]);
export const contactStatusEnum = pgEnum("contact_status", [
  "new",
  "contacted",
  "closed",
]);

// ---------------------------------------------------------------------------
// Users table
// ---------------------------------------------------------------------------
/**
 * Core user table for the admin dashboard.
 * openId is kept for schema compatibility; new logins use username/password.
 */
export const users = pgTable("users", {
  /** Surrogate primary key. Auto-incremented. Use for relations. */
  id: serial("id").primaryKey(),

  /**
   * Legacy OAuth identifier field — kept for backward compat with existing data.
   * For new username/password admin accounts, this can hold the username.
   */
  openId: varchar("openId", { length: 64 }).notNull().unique(),

  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ---------------------------------------------------------------------------
// Blog posts table
// ---------------------------------------------------------------------------
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: varchar("coverImage", { length: 512 }),
  tags: text("tags").notNull(), // Stored as comma-separated values
  published: boolean("published").default(false).notNull(),
  authorId: integer("authorId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ---------------------------------------------------------------------------
// Job postings table
// ---------------------------------------------------------------------------
export const jobPostings = pgTable("job_postings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  department: varchar("department", { length: 100 }),
  location: varchar("location", { length: 255 }),
  employmentType: varchar("employmentType", { length: 50 }),
  description: text("description").notNull(),
  requirements: text("requirements"),
  responsibilities: text("responsibilities"),
  benefits: text("benefits"),
  salaryRange: varchar("salaryRange", { length: 100 }),
  featuredImage: varchar("featuredImage", { length: 512 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = typeof jobPostings.$inferInsert;

// ---------------------------------------------------------------------------
// Job applications table
// ---------------------------------------------------------------------------
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("jobId").notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  coverLetter: text("coverLetter"),
  resumeUrl: varchar("resumeUrl", { length: 512 }).notNull(),
  resumeKey: varchar("resumeKey", { length: 512 }).notNull(),
  linkedinUrl: varchar("linkedinUrl", { length: 512 }),
  portfolioUrl: varchar("portfolioUrl", { length: 512 }),
  status: applicationStatusEnum("status").default("new").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;

// ---------------------------------------------------------------------------
// Contact inquiries table
// ---------------------------------------------------------------------------
export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }),
  serviceInterest: varchar("serviceInterest", { length: 100 }),
  message: text("message").notNull(),
  status: contactStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = typeof contactInquiries.$inferInsert;
