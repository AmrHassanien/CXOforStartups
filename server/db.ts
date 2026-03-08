import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { InsertUser, users, blogPosts, InsertBlogPost, contactInquiries, InsertContactInquiry, jobPostings, InsertJobPosting, jobApplications, InsertJobApplication } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // Use PostgreSQL's ON CONFLICT DO UPDATE (upsert)
    // Supports updating username and passwordHash as well.
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
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

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}


// TODO: add feature queries here as your schema grows.

// Blog post functions
export async function createBlogPost(post: Omit<InsertBlogPost, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // PostgreSQL: use .returning() to get the inserted row
  const [createdPost] = await db.insert(blogPosts).values(post).returning();
  return createdPost;
}

export async function updateBlogPost(id: number, updates: Partial<Omit<InsertBlogPost, "id" | "authorId" | "createdAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, unknown> = { ...updates };
  if (updates.published === true) {
    updateData.publishedAt = new Date();
  }

  await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));
  return { success: true };
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return { success: true };
}

export async function getBlogPosts(tag?: string) {
  const db = await getDb();
  if (!db) return [];

  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));

  if (tag) {
    return posts.filter(post =>
      post.tags.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase())
    );
  }

  return posts;
}

export async function getPublishedBlogPosts(tag?: string) {
  const db = await getDb();
  if (!db) return [];

  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt));

  if (tag) {
    return posts.filter(post =>
      post.tags.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase())
    );
  }

  return posts;
}

export async function getRecentPublishedPosts(limit: number = 3) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Contact inquiry functions
export async function createContactInquiry(inquiry: Omit<InsertContactInquiry, "id" | "createdAt" | "updatedAt" | "status">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(contactInquiries).values(inquiry).returning();
  return result;
}

export async function getContactInquiries() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
}

export async function updateContactInquiryStatus(id: number, status: "new" | "contacted" | "closed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(contactInquiries).set({ status }).where(eq(contactInquiries.id, id));
  return { success: true };
}

// Job posting functions
export async function createJobPosting(job: Omit<InsertJobPosting, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [createdJob] = await db.insert(jobPostings).values(job).returning();
  return createdJob;
}

export async function updateJobPosting(id: number, updates: Partial<Omit<InsertJobPosting, "id" | "createdAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(jobPostings).set(updates).where(eq(jobPostings.id, id));
  return { success: true };
}

export async function deleteJobPosting(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(jobPostings).where(eq(jobPostings.id, id));
  return { success: true };
}

export async function getActiveJobPostings() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(jobPostings)
    .where(eq(jobPostings.active, true))
    .orderBy(desc(jobPostings.createdAt));
}

export async function getAllJobPostings() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(jobPostings).orderBy(desc(jobPostings.createdAt));
}

export async function getJobPostingBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(jobPostings).where(eq(jobPostings.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Job application functions
export async function createJobApplication(application: Omit<InsertJobApplication, "id" | "createdAt" | "updatedAt" | "status" | "notes">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(jobApplications).values(application).returning();
  return result;
}

export async function getJobApplications(jobId?: number) {
  const db = await getDb();
  if (!db) return [];

  if (jobId) {
    return await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.jobId, jobId))
      .orderBy(desc(jobApplications.createdAt));
  }

  return await db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
}

export async function updateJobApplicationStatus(
  id: number,
  status: "new" | "reviewing" | "shortlisted" | "rejected" | "hired",
  notes?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, unknown> = { status };
  if (notes !== undefined) {
    updateData.notes = notes;
  }

  await db.update(jobApplications).set(updateData).where(eq(jobApplications.id, id));
  return { success: true };
}
