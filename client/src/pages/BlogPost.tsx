import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { Streamdown } from "streamdown";
import OpenGraphTags from "@/components/OpenGraphTags";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const post = trpc.blog.getBySlug.useQuery({ slug: params.slug || "" });

  if (post.isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (post.error || !post.data) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container py-20">
          <Card className="max-w-2xl mx-auto p-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Post Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const { title, content, coverImage, tags, publishedAt, excerpt } = post.data;
  const tagArray = tags ? tags.split(',').map(t => t.trim()) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <OpenGraphTags
        title={title}
        description={excerpt || `Read ${title} on CXO for Startups`}
        image={coverImage || undefined}
        url={currentUrl}
        type="article"
        publishedTime={publishedAt ? new Date(publishedAt).toISOString() : undefined}
        tags={tagArray}
        author="Amr M. Hassanein"
      />
      {/* Back Button */}
      <div className="border-b">
        <div className="container py-4">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Article */}
      <article className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <h1 className="mb-6 text-foreground">{title}</h1>
              
              <div className="flex items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {publishedAt
                      ? new Date(publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Draft"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.split(",").map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </header>

            {/* Cover Image */}
            {coverImage && (
              <div className="mb-12 rounded-lg overflow-hidden">
                <img
                  src={coverImage}
                  alt={title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <Streamdown>{content}</Streamdown>
            </div>
          </div>
        </div>
      </article>

      {/* Related CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-4">Ready to Work Together?</h3>
            <p className="text-muted-foreground mb-6">
              Let's discuss how we can help your startup succeed
            </p>
            <Button size="lg" asChild>
              <Link href="/#contact">
                <a>Get in Touch</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
