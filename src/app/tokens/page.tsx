
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
    name: "50 Tokens",
    price: 15,
    description: "Perfect for occasional use",
    features: ["Tokens never expire", "Use with any plan", "Instant activation"],
    highlight: false,
    saveAmount: null,
  },
  {
    name: "100 Tokens",
    price: 25,
    description: "Most popular add-on",
    features: ["Tokens never expire", "Use with any plan", "Instant activation"],
    highlight: true,
    saveAmount: 5,
  },
  {
    name: "250 Tokens",
    price: 50,
    description: "Best value for power users",
    features: ["Tokens never expire", "Use with any plan", "Instant activation"],
    highlight: false,
    saveAmount: 15,
  },
];

export default function TokensPage() {
    const { toast } = useToast();

    const handlePurchase = (packName: string) => {
        toast({
            title: "Purchase Successful!",
            description: `You have successfully purchased the ${packName} pack.`,
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {tokenPacks.map((pack) => (
                        <Card key={pack.name} className={cn(
                            "flex flex-col h-full", 
                            pack.highlight && "ring-2 ring-primary shadow-lg"
                        )}>
                            <CardHeader className="text-center">
                                {pack.saveAmount && (
                                    <div className="flex justify-center">
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                            Save ${pack.saveAmount}
                                        </Badge>
                                    </div>
                                )}
                                <CardTitle className="text-2xl pt-2">{pack.name}</CardTitle>
                                <p className="text-4xl font-bold">${pack.price}<span className="text-sm font-normal text-muted-foreground ml-1">one-time</span></p>
                                <CardDescription>{pack.description}</CardDescription>
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
                                    className={cn("w-full h-11", !pack.highlight && "btn-outline-primary")}
                                    variant={pack.highlight ? "default" : "outline"}
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
