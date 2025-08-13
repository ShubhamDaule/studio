
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/lib/types";
import { Sparkles, Bot, Loader2, type LucideIcon, RefreshCcw, BrainCircuit, icons } from "lucide-react";
import { FinancialCoach } from "../../characters/financial-coach";
import { getAIInsights } from "@/lib/actions";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useTiers } from "@/hooks/use-tiers";

interface FinancialCoachCardProps {
  transactions: Transaction[];
}

interface Insight {
    title: string;
    description: string;
    icon: keyof typeof icons;
}

const InsightItem = ({ insight }: { insight: Insight }) => {
    const IconComponent = (insight.icon && icons[insight.icon]) ? icons[insight.icon] as LucideIcon : Bot;
    return (
        <Card className="bg-background/70 backdrop-blur-sm flex flex-col h-full">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
                <IconComponent className="w-8 h-8 text-primary" />
                <CardTitle className="leading-tight">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{insight.description}</p>
            </CardContent>
        </Card>
    )
}

export function FinancialCoachCard({ transactions }: FinancialCoachCardProps) {
  const { toast } = useToast();
  const { consumeTokens, tokenBalance } = useTiers();
  const [insights, setInsights] = React.useState<Insight[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGenerateInsights = async () => {
    if (tokenBalance < 1) {
        toast({
            variant: "destructive",
            title: "Insufficient Tokens",
            description: "You need at least 1 token to use the Financial Coach.",
        });
        return;
    }

    setIsLoading(true);
    setInsights(null);

    const result = await getAIInsights(transactions);

    if (result.success && result.insights && result.usage) {
      if (consumeTokens(result.usage.totalTokens)) {
        setInsights(result.insights.insights);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Insight Generation Failed",
        description: result.error || "An unknown error occurred.",
      });
    }
    setIsLoading(false);
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden card-interactive group">
      <CardHeader className="z-10">
        <div className="flex items-center gap-3">
            <div className="w-20 h-20">
                <FinancialCoach />
            </div>
            <div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Financial Coach</CardTitle>
                <CardDescription>
                Get personalized advice on how to improve your financial habits.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center text-center">
        {isLoading ? (
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        ) : insights && insights.length > 0 ? (
            <Carousel className="w-full max-w-sm" opts={{loop: true, align: "start"}}>
                <CarouselContent className="-ml-2">
                    {insights.map((insight, index) => (
                        <CarouselItem key={index} className="pl-2 md:basis-1/2 lg:basis-full">
                            <div className="p-1 h-full">
                                <InsightItem insight={insight} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {insights.length > 1 && (
                    <>
                        <CarouselPrevious className="-left-4" />
                        <CarouselNext className="-right-4" />
                    </>
                )}
            </Carousel>
        ) : (
             <div className="flex flex-col items-center gap-2">
                <Bot className="w-10 h-10 text-primary" />
                <p className="font-semibold">Ready for your check-in?</p>
                <p className="text-sm text-muted-foreground max-w-xs">Click the button below to get personalized advice from your coach.</p>
            </div>
        )}
      </CardContent>
       <CardFooter className="z-10">
        <Button
          onClick={handleGenerateInsights}
          disabled={isLoading || transactions.length === 0}
          className="w-full"
        >
          {isLoading ? (
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : insights ? (
            <RefreshCcw className="mr-2 h-4 w-4" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Generating Advice..." : insights ? "Try Again (1 Token)" : "Ask Your Coach (1 Token)"}
        </Button>
      </CardFooter>
    </Card>
  );
}
