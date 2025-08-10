
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
import { Sparkles, Bot, Loader2 } from "lucide-react";
import { FinancialCoach } from "../../characters/financial-coach";
import { Skeleton } from "@/components/ui/skeleton";
import { getAIInsights } from "@/lib/actions";

interface FinancialCoachCardProps {
  transactions: Transaction[];
}

export function FinancialCoachCard({ transactions }: FinancialCoachCardProps) {
  const { toast } = useToast();
  const [insights, setInsights] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);

    const result = await getAIInsights(transactions);

    if (result.success && result.insights) {
      setInsights(result.insights);
      toast({
        title: "Advice Generated!",
        description: "Your financial coach has new tips for you.",
      });
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
    <Card className="h-full flex flex-col overflow-hidden bg-muted/20 card-interactive group">
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
          <div className="space-y-3 w-full">
            <Skeleton className="h-5 w-4/5 mx-auto" />
            <Skeleton className="h-5 w-full mx-auto" />
            <Skeleton className="h-5 w-3/4 mx-auto" />
          </div>
        ) : insights ? (
            <div className="p-4 text-sm rounded-lg bg-background/50 border border-border text-left overflow-y-auto max-h-60 w-full">
                <p className="whitespace-pre-wrap">{insights}</p>
            </div>
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
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Generating Advice..." : "Ask Your Coach"}
        </Button>
      </CardFooter>
    </Card>
  );
}
