import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";
import { Calendar, Tag } from "lucide-react";

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const posts = trpc.blog.getAll.useQuery({ tag: selectedTag, published: true });

  // Extract all unique tags from posts
  const allTags = posts.data
    ? Array.from(
        new Set(
          posts.data.flatMap((post) =>
            post.tags.split(",").map((tag) => tag.trim())
          )
        )
      ).sort()
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-foreground">Blog</h1>
            <p className="text-xl text-muted-foreground">
              Insights, strategies, and perspectives on startups, investment, and entrepreneurship
            </p>
          </div>
        </div>
      </section>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <section className="py-8 border-b bg-muted/20">
          <div className="container">
            <div className="flex items-center gap-3 flex-wrap">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filter by tag:</span>
              <Button
                variant={selectedTag === undefined ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(undefined)}
              >
                All Posts
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container">
          {posts.isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : posts.data && posts.data.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.data.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50">
                      {post.coverImage && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Draft"}
                          </span>
                        </div>
                        <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                        {post.excerpt && (
                          <CardDescription className="line-clamp-3">
                            {post.excerpt}
                          </CardDescription>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags
                            .split(",")
                            .slice(0, 3)
                            .map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag.trim()}
                              </Badge>
                            ))}
                        </div>
                      </CardHeader>
                    </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground mb-4">
                  {selectedTag
                    ? `No posts found with tag "${selectedTag}"`
                    : "No blog posts yet. Check back soon!"}
                </p>
                {selectedTag && (
                  <Button onClick={() => setSelectedTag(undefined)}>View All Posts</Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
