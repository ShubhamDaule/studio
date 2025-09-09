
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const tokenPacks = [
  {
    name: "Starter Pack",
    tokens: 10,
    price: 3.5,
    description: "$0.35 per token",
    features: ["Tokens never expire", "Instant activation"],
    highlight: false,
    saveAmount: null,
  },
  {
    name: "Booster Pack",
    tokens: 25,
    price: 8.5,
    description: "$0.34 per token",
    features: ["Tokens never expire", "Instant activation"],
    highlight: false,
    saveAmount: 0.25,
  },
  {
    name: "Power Pack",
    tokens: 50,
    price: 15.5,
    description: "$0.31 per token",
    features: ["Tokens never expire", "Instant activation"],
    highlight: false,
    saveAmount: 2.0,
  },
  {
    name: "Ultimate Bundle",
    tokens: 100,
    price: 28.0,
    description: "$0.28 per token",
    features: ["Tokens never expire", "Instant activation"],
    highlight: true,
    saveAmount: 7.0,
  },
];

export default function TokensPage() {
    const { toast } = useToast();

    const handlePurchase = (packName: string) => {
        toast({
            title: "Purchase Successful!",
            description: `You have successfully purchased the ${packName}.`,
        });
    }

  return (
    <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
            <Button asChild variant="link" className="mb-8 -ml-4">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>

            <section className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-6">
                    <Zap className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Need more tokens?
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Purchase additional tokens that never expire. Perfect for handling seasonal
                    spikes or large projects.
                </p>
            </section>

            <section className="mt-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
                    {tokenPacks.map((pack) => (
                        <Card key={pack.name} className={cn(
                            "flex flex-col h-full", 
                            pack.highlight && "ring-2 ring-primary shadow-lg"
                        )}>
                            <CardHeader className="text-center">
                                {pack.highlight && (
                                    <div className="flex justify-center">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                            Best Value
                                        </Badge>
                                    </div>
                                )}
                                <CardTitle className="text-2xl pt-2">{pack.name}</CardTitle>
                                <p className="text-4xl font-bold">${pack.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span className="text-sm font-normal text-muted-foreground ml-1">one-time</span></p>
                                <CardDescription>{pack.tokens} Tokens &bull; {pack.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col space-y-4">
                                <ul className="space-y-3 pt-2 flex-1">
                                    {pack.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={() => handlePurchase(pack.name)}
                                    className={cn(
                                        "w-full h-11",
                                        pack.highlight ? "btn-gradient-base btn-hover-fade" : "btn-outline-primary"
                                     )}
                                >
                                  Purchase Tokens
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    </div>
  );
}
