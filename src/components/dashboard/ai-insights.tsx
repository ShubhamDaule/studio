
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/lib/types";
import { Sparkles, Bot } from 'lucide-react';
import { getAIInsights } from "@/lib/actions";

type AIInsightsProps = {
  data: Transaction[];
};

export default function AIInsights({ data }: AIInsightsProps) {
  const [insights, setInsights] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);
    const result = await getAIInsights(data);
    if (result.success && result.insights) {
      setInsights(result.insights);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "An unknown error occurred.",
      });
    }
    setIsLoading(false);
  };
  
  return (
    <Card className="flex flex-col h-full card-interactive group overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
          <Sparkles className="w-5 h-5" />
          AI Smart Insights
        </CardTitle>
        <CardDescription>
          Get personalized insights to optimize your spending.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        )}
        {!isLoading && insights && (
            <div className="p-4 text-sm rounded-lg bg-accent/10 border border-accent/20">
                <p className="whitespace-pre-wrap">{insights}</p>
            </div>
        )}
        {!isLoading && !insights && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
            <Bot className="w-12 h-12 mb-4 text-primary/50" />
            <p>Click the button to generate your personalized financial advice.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateInsights} disabled={isLoading || data.length === 0} className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? 'Generating...' : 'Generate Insights'}
        </Button>
      </CardFooter>
    </Card>
  );
}
