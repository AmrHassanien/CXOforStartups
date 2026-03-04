import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";

export default function Careers() {
  const jobs = trpc.careers.getActiveJobs.useQuery();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-foreground">Join Our Team</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Help shape the future of startup consulting. We're looking for talented individuals passionate about helping founders and investors succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-center mb-12 text-foreground">Why Work With Us</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Impactful Work</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Work directly with innovative startups and help shape the future of technology and business.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Growth Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Continuous learning, professional development, and career advancement in a dynamic environment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Flexible Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Remote-friendly work environment with flexible hours and a focus on work-life balance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-center mb-12 text-foreground">Open Positions</h2>

          {jobs.isLoading ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : jobs.data && jobs.data.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {jobs.data.map((job) => (
                <Link key={job.id} href={`/careers/${job.slug}`}>
                  <Card className="hover:shadow-lg transition-all hover:border-primary/50">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                            <CardDescription className="flex flex-wrap gap-4 text-base">
                              {job.department && (
                                <span className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4" />
                                  {job.department}
                                </span>
                              )}
                              {job.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {job.location}
                                </span>
                              )}
                              {job.employmentType && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {job.employmentType}
                                </span>
                              )}
                            </CardDescription>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                        </div>
                      </CardHeader>
                      {(job.description || job.salaryRange) && (
                        <CardContent>
                          {job.description && (
                            <p className="text-muted-foreground line-clamp-2 mb-3">
                              {job.description.substring(0, 200)}...
                            </p>
                          )}
                          {job.salaryRange && (
                            <Badge variant="secondary">{job.salaryRange}</Badge>
                          )}
                        </CardContent>
                      )}
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-16 text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Open Positions</h3>
                <p className="text-muted-foreground mb-6">
                  We don't have any open positions at the moment, but we're always interested in hearing from talented individuals.
                </p>
                <Button asChild>
                  <Link href="/#contact">
                    Get in Touch
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
