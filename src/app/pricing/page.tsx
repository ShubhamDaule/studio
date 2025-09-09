
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useTiers } from "@/hooks/use-tiers";
import { Logo } from "@/components/layout/logo";

// Defines the available subscription plans and their features.
const plans = [
  {
    name: "Free",
    price: 0,
    period: "one-time",
    tokens: 10,
    highlight: false,
    features: [
      "10 tokens included (one-time)",
      "Upload up to 3 files at once",
      "Basic charts & analytics",
      "Standard transaction categorization",
    ],
  },
  {
    name: "Pro",
    price: 5,
    period: "month",
    tokens: 20,
    highlight: true,
    features: [
      "20 tokens renewed monthly",
      "Unlimited file uploads",
      "AI-powered Insights & Anomaly Detection",
      "Advanced Budgeting tools",
      "Email support",
    ],
  },
  {
    name: "Premium",
    price: 10,
    period: "month",
    tokens: 45,
    highlight: false,
    features: [
      "All Pro features",
      "45 tokens renewed monthly",
      "Store transactions permanently",
      "Export data to CSV",
      "Priority support",
    ],
  },
] as const;


/**
 * Renders the pricing page, allowing users to view and select a subscription plan.
 */
export default function Pricing() {
  const router = useRouter();
  const { setTier } = useTiers();

  // Effect to set the document title when the component mounts.
  useEffect(() => {
    document.title = "Pricing – Free, Pro, Premium | MySpendWise";
  }, []);

  /**
   * Handles the selection of a pricing plan.
   * Updates the user's tier status and redirects them to the signup page.
   * @param {object} plan - The selected plan object.
   */
  const choosePlan = (plan: (typeof plans)[number]) => {
    setTier(plan.name);
    router.push("/auth?mode=signup");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button asChild variant="link" className="text-muted-foreground">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
            <Button asChild size="sm" className="btn-gradient-base btn-hover-fade"><Link href="/auth">Sign in</Link></Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" variant="outline">Simple, transparent pricing</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Choose the plan that <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">fits you</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Start free and upgrade anytime. Monthly token allowances included with every plan.
            </p>
          </div>
        </section>

        {/* Pricing Plans section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {plans.map((plan) => (
                <Card key={plan.name} className={`flex flex-col h-full border ${plan.highlight ? "ring-2 ring-primary shadow-glow" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      {plan.highlight && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Most popular</Badge>
                      )}
                    </div>
                    <CardDescription>
                      <span className="text-4xl font-bold">{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
                      {plan.price !== 0 && <span className="text-muted-foreground">/ {plan.period}</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col space-y-6">
                    <ul className="space-y-3 pt-2 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Button onClick={() => choosePlan(plan)} className="w-full h-11 btn-gradient-base btn-hover-fade mt-auto">
                      {plan.name === "Free" ? "Start for free" : `Choose ${plan.name}`} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-6 text-center sm:text-left">
              Prices in USD. You can change or cancel your plan anytime.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
