import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { FileText, Briefcase, Mail, Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const blogPosts = trpc.blog.getAll.useQuery({ published: undefined });
  const jobs = trpc.careers.getAllJobs.useQuery(undefined, { enabled: user?.role === 'admin' });
  const applications = trpc.careers.getApplications.useQuery({}, { enabled: user?.role === 'admin' });
  const inquiries = trpc.admin.getContactInquiries.useQuery(undefined, { enabled: user?.role === 'admin' });

  const deleteBlog = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted");
      blogPosts.refetch();
    },
    onError: () => toast.error("Failed to delete blog post"),
  });

  const deleteJob = trpc.careers.deleteJob.useMutation({
    onSuccess: () => {
      toast.success("Job posting deleted");
      jobs.refetch();
    },
    onError: () => toast.error("Failed to delete job posting"),
  });

  const updateApplicationStatus = trpc.careers.updateApplicationStatus.useMutation({
    onSuccess: () => {
      toast.success("Application status updated");
      applications.refetch();
    },
    onError: () => toast.error("Failed to update status"),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please log in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">
                <a>Go Home</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your website content and applications</p>
        </div>

        <Tabs defaultValue="blog" className="space-y-6">
          <TabsList>
            <TabsTrigger value="blog">
              <FileText className="h-4 w-4 mr-2" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              Job Postings
            </TabsTrigger>
            <TabsTrigger value="applications">
              <Briefcase className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="inquiries">
              <Mail className="h-4 w-4 mr-2" />
              Contact Inquiries
            </TabsTrigger>
          </TabsList>

          {/* Blog Posts Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Blog Posts</CardTitle>
                    <CardDescription>Manage your blog content</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/blog/new">
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {blogPosts.isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : blogPosts.data && blogPosts.data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts.data.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/blog/${post.slug}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/blog/${post.slug}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this post?")) {
                                    deleteBlog.mutate({ id: post.id });
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No blog posts yet. Create your first post!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Postings Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Job Postings</CardTitle>
                    <CardDescription>Manage career opportunities</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/jobs/new">
                      <Plus className="h-4 w-4 mr-2" />
                      New Job
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {jobs.isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : jobs.data && jobs.data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.data.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.department || "-"}</TableCell>
                          <TableCell>
                            <Badge variant={job.active ? "default" : "secondary"}>
                              {job.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(job.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/careers/${job.slug}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/jobs/${job.slug}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this job?")) {
                                    deleteJob.mutate({ id: job.id });
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No job postings yet. Create your first posting!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>Review and manage candidate applications</CardDescription>
              </CardHeader>
              <CardContent>
                {applications.isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : applications.data && applications.data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Job ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.data.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.fullName}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.jobId}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                app.status === "new"
                                  ? "default"
                                  : app.status === "hired"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {app.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                                View Resume
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No applications yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Inquiries Tab */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Contact Inquiries</CardTitle>
                <CardDescription>Manage contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {inquiries.isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : inquiries.data && inquiries.data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.data.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="font-medium">{inquiry.name}</TableCell>
                          <TableCell>{inquiry.email}</TableCell>
                          <TableCell>{inquiry.serviceInterest || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{inquiry.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No inquiries yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
