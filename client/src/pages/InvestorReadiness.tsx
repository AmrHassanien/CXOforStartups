import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileText, Database, PresentationIcon, Shield, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function InvestorReadiness() {
  const features = [
    {
      icon: Database,
      title: "Data Room Setup",
      description: "Comprehensive organization of all critical documents investors need to review",
    },
    {
      icon: FileText,
      title: "Financial Documentation",
      description: "Preparation of financial statements, projections, and cap table documentation",
    },
    {
      icon: PresentationIcon,
      title: "Pitch Deck Refinement",
      description: "Strategic guidance on creating compelling investor presentations",
    },
    {
      icon: Shield,
      title: "Legal Compliance",
      description: "Ensuring all legal documents and compliance requirements are in order",
    },
    {
      icon: TrendingUp,
      title: "Market Analysis",
      description: "Comprehensive market research and competitive landscape documentation",
    },
    {
      icon: CheckCircle2,
      title: "Due Diligence Prep",
      description: "Anticipating and preparing for investor due diligence questions",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-investor-readiness.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-foreground">Investor Readiness</h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Prepare your startup for successful fundraising with comprehensive data room creation and investor-ready documentation. We help founders present their best case to potential investors.
            </p>
            <Button size="lg" asChild>
              <Link href="/#contact">
                <a>Start Your Preparation</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-foreground">What We Provide</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive approach to preparing your startup for investor scrutiny
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-12 text-center text-foreground">Our Process</h2>
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Initial Assessment",
                  description: "We evaluate your current documentation and identify gaps that need to be addressed before approaching investors.",
                },
                {
                  step: "02",
                  title: "Document Preparation",
                  description: "Work with your team to gather, organize, and refine all necessary documentation including financials, legal documents, and market research.",
                },
                {
                  step: "03",
                  title: "Data Room Setup",
                  description: "Create a professional, organized virtual data room that makes it easy for investors to conduct due diligence.",
                },
                {
                  step: "04",
                  title: "Final Review",
                  description: "Comprehensive review to ensure everything is investor-ready and anticipate potential questions or concerns.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="py-12 text-center">
              <h2 className="mb-4 text-primary-foreground">Ready to Raise Capital?</h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Let's work together to ensure your startup is fully prepared to impress investors and secure the funding you need.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/#contact">
                  <a>Get Started Today</a>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
