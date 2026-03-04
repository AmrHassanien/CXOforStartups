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

export default function AdminJobEditor() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams();
  const jobId = params.id ? parseInt(params.id) : undefined;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [department, setDepartment] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [benefits, setBenefits] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [active, setActive] = useState(true);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const existingJob = trpc.careers.getJobBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug && user?.role === 'admin' }
  );

  const createJob = trpc.careers.createJob.useMutation({
    onSuccess: () => {
      toast.success("Job posting created successfully");
      navigate("/admin");
    },
    onError: (error) => toast.error(error.message || "Failed to create job posting"),
  });

  const updateJob = trpc.careers.updateJob.useMutation({
    onSuccess: () => {
      toast.success("Job posting updated successfully");
      navigate("/admin");
    },
    onError: (error) => toast.error(error.message || "Failed to update job posting"),
  });

  useEffect(() => {
    if (existingJob.data) {
      setTitle(existingJob.data.title);
      setSlug(existingJob.data.slug);
      setDepartment(existingJob.data.department || "");
      setJobLocation(existingJob.data.location || "");
      setEmploymentType(existingJob.data.employmentType || "");
      setDescription(existingJob.data.description);
      setRequirements(existingJob.data.requirements || "");
      setResponsibilities(existingJob.data.responsibilities || "");
      setBenefits(existingJob.data.benefits || "");
      setSalaryRange(existingJob.data.salaryRange || "");
      setActive(existingJob.data.active);
      setFeaturedImagePreview(existingJob.data.featuredImage || "");
    }
  }, [existingJob.data]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setFeaturedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!featuredImageFile) return featuredImagePreview || null;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", featuredImageFile);
      
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
    
    if (!title || !slug || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const featuredImageUrl = await uploadImage();

    const jobData = {
      title,
      slug,
      department,
      location: jobLocation,
      employmentType,
      description,
      requirements,
      responsibilities,
      benefits,
      salaryRange,
      active,
      ...(featuredImageUrl && { featuredImage: featuredImageUrl }),
    };

    if (jobId) {
      updateJob.mutate({ id: jobId, ...jobData });
    } else {
      createJob.mutate(jobData);
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
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{jobId ? "Edit Job Posting" : "Create New Job Posting"}</CardTitle>
            <CardDescription>
              Fill in the details below to {jobId ? "update" : "create"} your job posting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Senior Startup Consultant"
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g., Consulting"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobLocation">Location</Label>
                  <Input
                    id="jobLocation"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g., Remote, Dubai, etc."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Input
                    id="employmentType"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    placeholder="e.g., Full-time, Part-time, Contract"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryRange">Salary Range</Label>
                  <Input
                    id="salaryRange"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image (for social media preview)</Label>
                <div className="space-y-4">
                  {featuredImagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={featuredImagePreview}
                        alt="Featured preview"
                        className="max-w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setFeaturedImageFile(null);
                          setFeaturedImagePreview("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      id="featuredImage"
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
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the role and what you're looking for"
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="List the required skills and qualifications"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="Describe the day-to-day responsibilities"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="List the benefits and perks"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={active}
                  onCheckedChange={setActive}
                />
                <Label htmlFor="active">Active (visible on careers page)</Label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createJob.isPending || updateJob.isPending || uploading}
                >
                  {uploading ? "Uploading..." : jobId ? "Update Job" : "Create Job"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin")}
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
