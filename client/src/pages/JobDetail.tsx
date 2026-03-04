import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Briefcase, MapPin, Clock, Upload } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { Streamdown } from "streamdown";
import { useState } from "react";
import { toast } from "sonner";
import OpenGraphTags from "@/components/OpenGraphTags";


export default function JobDetail() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const job = trpc.careers.getJobBySlug.useQuery({ slug: params.slug || "" });
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [applicationForm, setApplicationForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    linkedinUrl: "",
    portfolioUrl: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitApplication = trpc.careers.submitApplication.useMutation({
    onSuccess: () => {
      toast.success("Application submitted successfully! We'll be in touch soon.");
      setApplicationForm({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
        linkedinUrl: "",
        portfolioUrl: "",
      });
      setResumeFile(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit application. Please try again.");
      setIsSubmitting(false);
    },
  });

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (16MB limit)
      if (file.size > 16 * 1024 * 1024) {
        toast.error("Resume file must be less than 16MB");
        return;
      }
      // Check file type
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Resume must be a PDF or Word document");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    if (!job.data) return;

    setIsSubmitting(true);

    try {
      // Upload resume to S3
      const fileBuffer = await resumeFile.arrayBuffer();
      const randomSuffix = Math.random().toString(36).substring(7);
      const fileKey = `resumes/${job.data.id}-${randomSuffix}-${resumeFile.name}`;
      
      const { storagePut } = await import("../../../server/storage");
      const { url } = await storagePut(fileKey, new Uint8Array(fileBuffer), resumeFile.type);

      // Submit application
      await submitApplication.mutateAsync({
        jobId: job.data.id,
        ...applicationForm,
        resumeUrl: url,
        resumeKey: fileKey,
      });

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to upload resume. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (job.isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (job.error || !job.data) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container py-20">
          <Card className="max-w-2xl mx-auto p-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Position Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This position doesn't exist or is no longer available.
            </p>
            <Button asChild>
              <Link href="/careers">
                View All Positions
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const { title, department, location, employmentType, description, requirements, responsibilities, benefits, salaryRange, featuredImage } = job.data;
  const jobDescription = `${title} position at CXO for Startups. ${department ? `Department: ${department}.` : ''} ${location ? `Location: ${location}.` : ''}`;

  return (
    <div className="flex flex-col min-h-screen">
      <OpenGraphTags
        title={title}
        description={jobDescription}
        image={featuredImage || undefined}
        url={currentUrl}
        type="website"
      />
      {/* Back Button */}
      <div className="border-b">
        <div className="container py-4">
          <Button variant="ghost" asChild>
            <Link href="/careers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Link>
          </Button>
        </div>
      </div>

      {/* Job Details */}
      <div className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="mb-6 text-foreground">{title}</h1>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                {department && (
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {department}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {location}
                  </span>
                )}
                {employmentType && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {employmentType}
                  </span>
                )}
              </div>

              {salaryRange && (
                <Badge variant="secondary" className="text-base px-4 py-2">
                  {salaryRange}
                </Badge>
              )}
            </div>

            {/* Job Content */}
            <div className="space-y-8 mb-12">
              {description && (
                <Card>
                  <CardHeader>
                    <CardTitle>About the Role</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                    <Streamdown>{description}</Streamdown>
                  </CardContent>
                </Card>
              )}

              {responsibilities && (
                <Card>
                  <CardHeader>
                    <CardTitle>Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                    <Streamdown>{responsibilities}</Streamdown>
                  </CardContent>
                </Card>
              )}

              {requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                    <Streamdown>{requirements}</Streamdown>
                  </CardContent>
                </Card>
              )}

              {benefits && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                    <Streamdown>{benefits}</Streamdown>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Position</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={applicationForm.fullName}
                        onChange={(e) =>
                          setApplicationForm({ ...applicationForm, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={applicationForm.email}
                        onChange={(e) =>
                          setApplicationForm({ ...applicationForm, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={applicationForm.phone}
                      onChange={(e) =>
                        setApplicationForm({ ...applicationForm, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume *</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeChange}
                        required
                      />
                      {resumeFile && (
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          {resumeFile.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      PDF or Word document, max 16MB
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={applicationForm.linkedinUrl}
                      onChange={(e) =>
                        setApplicationForm({ ...applicationForm, linkedinUrl: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Portfolio/Website</Label>
                    <Input
                      id="portfolioUrl"
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={applicationForm.portfolioUrl}
                      onChange={(e) =>
                        setApplicationForm({ ...applicationForm, portfolioUrl: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      rows={6}
                      placeholder="Tell us why you're interested in this position..."
                      value={applicationForm.coverLetter}
                      onChange={(e) =>
                        setApplicationForm({ ...applicationForm, coverLetter: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
