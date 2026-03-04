import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Lightbulb, MessageCircle, Rocket, Target, TrendingUp } from "lucide-react";

export default function Coaching() {
  const benefits = [
    {
      icon: Target,
      title: "Strategic Planning",
      description: "Develop clear roadmaps for product development, market entry, and scaling",
    },
    {
      icon: TrendingUp,
      title: "Growth Strategies",
      description: "Learn proven tactics for customer acquisition and revenue growth",
    },
    {
      icon: Lightbulb,
      title: "Problem Solving",
      description: "Navigate challenges with experienced guidance and fresh perspectives",
    },
    {
      icon: Rocket,
      title: "Fundraising Guidance",
      description: "Master the art of pitching and building relationships with investors",
    },
    {
      icon: MessageCircle,
      title: "Leadership Development",
      description: "Build the skills needed to lead and inspire your growing team",
    },
    {
      icon: Calendar,
      title: "Ongoing Support",
      description: "Regular sessions to maintain momentum and accountability",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-fractional-cxo.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-foreground">Founder Coaching & Mentorship</h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              One-on-one mentorship and strategic guidance to help founders navigate challenges, make better decisions, and scale their ventures successfully.
            </p>
            <Button size="lg" asChild>
              <a
                href="https://calendar.app.google/f4VWftTsCvFY7wRG8"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book a Session
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-foreground">What You'll Gain</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Personalized guidance tailored to your unique challenges and goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-12 text-center text-foreground">Who This Is For</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>First-Time Founders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Navigate the startup journey with confidence. Learn from someone who has been there and avoid common pitfalls.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scaling Startups</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Transition from early traction to sustainable growth. Build systems and processes that scale.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fundraising Founders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Prepare for and execute successful fundraising rounds. Build relationships with the right investors.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Approach */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-12 text-center text-foreground">My Approach</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Personalized Sessions</h3>
                  <p className="text-muted-foreground">
                    Every founder and startup is unique. Our sessions are tailored to your specific challenges, goals, and stage of growth. No generic advice—just practical guidance for your situation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Action-Oriented</h3>
                  <p className="text-muted-foreground">
                    We focus on actionable insights and concrete next steps. Each session ends with clear takeaways and a plan for implementation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Long-Term Partnership</h3>
                  <p className="text-muted-foreground">
                    Building a successful startup takes time. I'm here for the long haul, providing ongoing support as you navigate different stages of growth.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-6 opacity-90" />
              <h2 className="mb-4 text-primary-foreground">Ready to Get Started?</h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Book your first coaching session and let's discuss how I can help you achieve your goals.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <a
                  href="https://calendar.app.google/f4VWftTsCvFY7wRG8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Your Session
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
