
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Shield, Zap } from "lucide-react";
import { useTiers } from "@/hooks/use-tiers";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "month",
    tokens: 5,
    tokenPrice: 0.5,
    highlight: false,
    features: [
      "Upload statements",
      "Basic charts",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: 5,
    period: "month",
    tokens: 20,
    tokenPrice: 0.35,
    highlight: true,
    features: [
      "All Free features",
      "Advanced insights",
      "Email support",
    ],
  },
  {
    name: "Premium",
    price: 10,
    period: "month",
    tokens: 45,
    tokenPrice: undefined,
    highlight: false,
    features: [
      "All Pro features",
      "Priority support",
      "Early access to new tools",
    ],
  },
] as const;

export default function Pricing() {
  const router = useRouter();
  const { setIsPro, setIsPremium } = useTiers();

  useEffect(() => {
    document.title = "Pricing – Free, Pro, Premium | SpendWise";
  }, []);

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
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-smooth">← Back to Home</Link>
          <Link href="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
        </div>
      </header>

      <main>
        {/* Hero */}
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

        {/* Plans */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {plans.map((plan) => (
                <Card key={plan.name} className={`border ${plan.highlight ? "ring-2 ring-primary shadow-glow" : ""}`}>
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
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <p className="text-sm text-muted-foreground">{plan.tokens} tokens/month included</p>
                    </div>
                    {typeof plan.tokenPrice === "number" && (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-accent" />
                        <p className="text-sm text-muted-foreground">Additional tokens {Math.round(plan.tokenPrice * 100)}¢ each</p>
                      </div>
                    )}

                    <ul className="space-y-3 pt-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Button onClick={() => choosePlan(plan)} className="w-full h-11 bg-gradient-to-r from-primary to-accent text-white border-0 hover:opacity-90">
                      {plan.name === "Free" ? "Start for free" : `Choose ${plan.name}`} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Prices in USD. You can change or cancel your plan anytime.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
