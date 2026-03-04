import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Search, Shield, Target, Users, Zap } from "lucide-react";
import { Link } from "wouter";

export default function InvestmentAnalysis() {
  const features = [
    {
      icon: Search,
      title: "Market Opportunity",
      description: "Deep dive into market size, growth potential, and competitive positioning",
    },
    {
      icon: Users,
      title: "Team Assessment",
      description: "Evaluation of founding team capabilities, experience, and execution track record",
    },
    {
      icon: BarChart3,
      title: "Financial Analysis",
      description: "Comprehensive review of financial models, unit economics, and growth projections",
    },
    {
      icon: Zap,
      title: "Technology Evaluation",
      description: "Assessment of technical architecture, scalability, and competitive advantages",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Identification of key risks and potential mitigation strategies",
    },
    {
      icon: Target,
      title: "Investment Thesis",
      description: "Clear articulation of investment rationale and expected returns",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-foreground">Startup Investment Analysis</h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Make informed investment decisions with comprehensive analysis of tech startup opportunities. We help investors understand both the potential and risks of early-stage ventures.
            </p>
            <Button size="lg" asChild>
              <Link href="/#contact">
                <a>Request Analysis</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-foreground">Comprehensive Analysis</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We evaluate every critical aspect of a startup investment opportunity
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

      {/* What You Get */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-12 text-center text-foreground">What You Receive</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Executive summary with key findings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Market analysis and competitive landscape</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Financial model review and projections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Risk matrix with mitigation strategies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Strategic Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Investment recommendation (proceed/pass/monitor)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Suggested valuation range and terms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Key due diligence questions to ask</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Post-investment value-add opportunities</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-12 text-center text-foreground">Analysis Process</h2>
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Information Gathering",
                  description: "Collect all available materials including pitch deck, financials, and product documentation.",
                },
                {
                  step: "02",
                  title: "Deep Dive Analysis",
                  description: "Conduct thorough analysis of market, team, technology, and business model.",
                },
                {
                  step: "03",
                  title: "Expert Consultation",
                  description: "Consult with industry experts and conduct reference checks as needed.",
                },
                {
                  step: "04",
                  title: "Report Delivery",
                  description: "Deliver comprehensive written report with findings and recommendations.",
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
              <h2 className="mb-4 text-primary-foreground">Evaluate Your Next Investment</h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Get the insights you need to make confident investment decisions in tech startups.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/#contact">
                  <a>Request Analysis</a>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
