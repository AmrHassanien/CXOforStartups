import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getLoginUrl } from "@/const";

export default function AdminBlogEditor() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const postId = params.id ? parseInt(params.id) : undefined;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const existingPost = trpc.blog.getBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug && user?.role === 'admin' }
  );

  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      setLocation("/admin");
    },
    onError: (error) => toast.error(error.message || "Failed to create blog post"),
  });

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully");
      setLocation("/admin");
    },
    onError: (error) => toast.error(error.message || "Failed to update blog post"),
  });

  useEffect(() => {
    if (existingPost.data) {
      setTitle(existingPost.data.title);
      setSlug(existingPost.data.slug);
      setExcerpt(existingPost.data.excerpt || "");
      setContent(existingPost.data.content);
      setTags(existingPost.data.tags);
      setPublished(existingPost.data.published);
      setCoverImagePreview(existingPost.data.coverImage || "");
    }
  }, [existingPost.data]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!coverImageFile) return coverImagePreview || null;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", coverImageFile);
      
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug || !content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const coverImageUrl = await uploadImage();

    const postData = {
      title,
      slug,
      excerpt,
      content,
      tags,
      published,
      ...(coverImageUrl && { coverImage: coverImageUrl }),
    };

    if (postId) {
      updatePost.mutate({ id: postId, ...postData });
    } else {
      createPost.mutate(postData);
    }
  };

  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/admin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{postId ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
            <CardDescription>
              Fill in the details below to {postId ? "update" : "create"} your blog post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-friendly-slug"
                    required
                  />
                  <Button type="button" variant="outline" onClick={generateSlug}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image (for social media preview)</Label>
                <div className="space-y-4">
                  {coverImagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="max-w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setCoverImageFile(null);
                          setCoverImagePreview("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="max-w-xs"
                    />
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recommended: 1200x630px (max 5MB)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short summary for previews"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content here (supports markdown)"
                  rows={15}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="startup, fundraising, investor-readiness (comma-separated)"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createPost.isPending || updatePost.isPending || uploading}
                >
                  {uploading ? "Uploading..." : postId ? "Update Post" : "Create Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
