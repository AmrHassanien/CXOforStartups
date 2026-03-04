import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, GraduationCap, Briefcase, Rocket, Users, Award } from "lucide-react";

export default function About() {
  const highlights = [
    {
      icon: GraduationCap,
      title: "Education",
      items: [
        "Bachelor's degree in Computer Science (2005)",
        "MBA in Finance (2015)",
      ],
    },
    {
      icon: Briefcase,
      title: "Digital Media Leadership",
      items: [
        "Played a key role at Dubai Media Inc., leading the digital transformation and positioning the company for online recognition, including mentions by Forbes Middle East",
        "Spearheaded the development and growth of several flagship media projects such as Dubai Sports, Al Bayan, and Emirates 247",
      ],
    },
    {
      icon: Rocket,
      title: "Entrepreneurship in Blockchain",
      items: [
        "Founded a digital marketing venture (2016–2019) utilizing Distributed Ledger Technology (DLT), becoming an early mover in blockchain-based marketing platforms",
      ],
    },
    {
      icon: Award,
      title: "Strategic Digital Advisor",
      items: [
        "Advised CEOs and founders across various industries—including smart homes, restaurant chains, marketing agencies, and travel startups—on digital strategy, go-to-market planning, and business development",
      ],
    },
    {
      icon: Users,
      title: "Global Startup Involvement",
      items: [
        "Collaborated with U.S.-based startups in cybersecurity and music AI, providing guidance on product development and leading engineering teams",
      ],
    },

    {
      icon: Users,
      title: "Founder and Startup Mentorship",
      items: [
        "Advised over 30 founders across diverse industries and nationalities, covering business networking platforms, SaaS content platforms, e-commerce ventures, crypto price monitoring tools, PropTech solutions, and AI startup mentoring",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Strategic Consultant & Advisor</Badge>
              <h1 className="mb-6 text-foreground">Amr M. Hassanein</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Empowering tech startups and investors with over two decades of experience spanning digital transformation, blockchain innovation, and C-level leadership across multiple industries.
              </p>
              <Button size="lg" asChild>
                <a
                  href="https://linkedin.com/in/amr-m-hassanein"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Linkedin className="h-5 w-5" />
                  Connect on LinkedIn
                </a>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5">
                <img
                  src="/amr-hassanein.png"
                  alt="Amr M. Hassanein"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Highlights */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="mb-4 text-foreground">Career Highlights</h2>
            <p className="text-lg text-muted-foreground">
              A proven track record of driving digital innovation, strategic growth, and successful fundraising across startups and established enterprises.
            </p>
          </div>

          <div className="grid gap-8 max-w-5xl mx-auto">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-3 text-foreground">
                          {highlight.title}
                        </h3>
                        <ul className="space-y-2">
                          {highlight.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="text-muted-foreground flex gap-2"
                            >
                              <span className="text-primary mt-1.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container">
          <Card className="max-w-3xl mx-auto border-2">
            <CardContent className="pt-12 pb-12 text-center">
              <h2 className="mb-4 text-foreground">Ready to Transform Your Startup?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're preparing for fundraising, evaluating investment opportunities, or seeking strategic guidance, let's discuss how I can help you achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/#contact">Get in Touch</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="https://calendar.app.google/f4VWftTsCvFY7wRG8" target="_blank" rel="noopener noreferrer">
                    Book a Consultation
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
