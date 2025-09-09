
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Shield, Zap, ArrowLeft } from "lucide-react";
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
      "No AI Assistant or Budgeting",
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
      "AI Insights & Budgeting included",
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
      "Store transactions (2 tokens/file)",
      "Priority support",
    ],
  },
] as const;

const tokenPacks = [
  {
    name: "50 Tokens",
    price: 15,
    description: "Perfect for occasional use",
    save: null,
    features: ["Tokens never expire", "Use with any plan", "Instant activation"],
  },
  {
    name: "100 Tokens",
    price: 25,
    description: "Most popular add-on",
    save: 5,
    features: ["Tokens never expire", "Use with any plan", "Instant activation"],
  },
  {
    name: "250 Tokens",
    price: 50,
    description: "Best value for power users",
    save: 25,
    features: ["Tokens never expire", "Use with any plan", "Instant activation"],
  },
];

/**
 * Renders the pricing page, allowing users to view and select a subscription plan.
 */
export default function Pricing() {
  const router = useRouter();
  const { setIsPro, setIsPremium, setTokenBalance, tokenBalance } = useTiers();

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
    if (plan.name === "Free") {
      setIsPremium(false);
      setIsPro(false);
    } else if (plan.name === "Pro") {
      setIsPremium(false);
      setIsPro(true);
    } else {
      // Premium
      setIsPremium(true);
    }
    router.push("/auth?mode=signup");
  };

  const handlePurchaseTokens = (tokens: number) => {
    setTokenBalance(current => current + tokens);
  }

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

        {/* Pricing plans section */}
        <section className="py-12 md:py-16">
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
        
        {/* Token packs section */}
        <section className="py-12 md:py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Zap className="w-7 h-7 text-primary" />
                    </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Need more tokens?</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
                    Purchase additional tokens that never expire. Perfect for handling seasonal spikes or large projects.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start max-w-5xl mx-auto">
                    {tokenPacks.map((pack) => (
                        <Card key={pack.name} className="flex flex-col h-full text-left relative">
                            {pack.save && (
                                <Badge className="absolute -top-3 right-4 bg-primary/10 text-primary border-primary/20">Save ${pack.save}</Badge>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">{pack.name}</CardTitle>
                                <CardDescription>
                                    <span className="text-4xl font-bold text-foreground">${pack.price}</span>
                                    <span className="text-muted-foreground"> one-time</span>
                                </CardDescription>
                                <p className="text-sm text-muted-foreground pt-2">{pack.description}</p>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col space-y-6">
                                <ul className="space-y-3 pt-2 flex-1">
                                    {pack.features.map((f) => (
                                        <li key={f} className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button onClick={() => handlePurchaseTokens(parseInt(pack.name))} variant="outline" className="w-full h-11 btn-outline-primary mt-auto">
                                   Purchase Tokens
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
