import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Target, TrendingUp, Users, Briefcase } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    serviceInterest: "",
    message: "",
  });

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you! We'll be in touch soon.");
      setContactForm({
        name: "",
        email: "",
        company: "",
        serviceInterest: "",
        message: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit. Please try again.");
    },
  });

  const recentPosts = trpc.blog.getRecent.useQuery({ limit: 3 });

  const services = [
    {
      icon: Target,
      title: "Investor Readiness",
      description: "Prepare your startup for fundraising with comprehensive data room creation and investor-ready documentation.",
      href: "/services/investor-readiness",
    },
    {
      icon: TrendingUp,
      title: "Investment Analysis",
      description: "Evaluate tech startup opportunities with detailed risk assessment and potential analysis for informed investment decisions.",
      href: "/services/investment-analysis",
    },
    {
      icon: Users,
      title: "Founder Coaching",
      description: "One-on-one mentorship and strategic guidance to help founders navigate challenges and scale their ventures.",
      href: "/services/coaching",
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate(contactForm);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background"></div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-foreground">
              Strategic Consulting for Tech Startups & Investors
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Empowering founders to achieve investor readiness and helping investors make informed decisions in the dynamic tech startup ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#services">
                  Explore Services <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#contact">Get in Touch</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-foreground">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive consulting services tailored for tech startups and investors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild className="w-full">
                      <Link href={service.href}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-20">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="mb-4 text-foreground">Latest Insights</h2>
              <p className="text-lg text-muted-foreground">
                Expert perspectives on startups and investment
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>

          {recentPosts.isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : recentPosts.data && recentPosts.data.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {recentPosts.data.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                      {post.coverImage && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {post.tags.split(",").slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-accent/20 text-accent-foreground rounded"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </CardHeader>
                    </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No blog posts yet. Check back soon!
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-6 opacity-90" />
            <h2 className="mb-4 text-primary-foreground">Join Our Team</h2>
            <p className="text-lg mb-8 opacity-90">
              We're looking for talented individuals to help shape the future of startup consulting.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/careers">
                View Open Positions
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-foreground">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                Ready to take your startup to the next level? Let's talk.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        required
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={contactForm.company}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, company: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service Interest</Label>
                    <Select
                      value={contactForm.serviceInterest}
                      onValueChange={(value) =>
                        setContactForm({ ...contactForm, serviceInterest: value })
                      }
                    >
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investor-readiness">Investor Readiness</SelectItem>
                        <SelectItem value="investment-analysis">Investment Analysis</SelectItem>
                        <SelectItem value="coaching">Founder Coaching</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, message: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={submitContact.isPending}
                  >
                    {submitContact.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
