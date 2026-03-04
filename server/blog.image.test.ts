import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("blog.createPost with cover image", () => {
  it("creates a blog post with cover image URL", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.create({
      title: "Test Post with Image",
      slug: `test-post-image-${Date.now()}`,
      content: "This is a test post with a cover image.",
      excerpt: "Test excerpt",
      tags: "test,image",
      published: true,
      coverImage: "https://example.com/test-image.jpg",
    });

    expect(result).toBeDefined();
    expect(result.coverImage).toBe("https://example.com/test-image.jpg");
  });
});

describe("careers.createJob with featured image", () => {
  it("creates a job posting with featured image URL", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.careers.createJob({
      title: "Test Job with Image",
      slug: `test-job-image-${Date.now()}`,
      description: "This is a test job posting with a featured image.",
      department: "Engineering",
      location: "Remote",
      employmentType: "Full-time",
      active: true,
      featuredImage: "https://example.com/test-job-image.jpg",
    });

    expect(result).toBeDefined();
    expect(result.featuredImage).toBe("https://example.com/test-job-image.jpg");
  });
});
