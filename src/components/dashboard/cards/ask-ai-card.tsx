
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Transaction, QueryResult, Budget } from "@/lib/types";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { getAiQueryResponse } from "@/lib/actions";
import { DynamicChart } from "@/components/dashboard/charts/dynamic-chart";
import { AskAiCharacter } from "../../characters/ask-ai-character";

interface AskAiCardProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function AskAiCard({ transactions, budgets }: AskAiCardProps) {
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [result, setResult] = React.useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Clear results when transactions change
    setResult(null);
  }, [transactions]);
  
  const handleSubmit = async () => {
    setIsLoading(true);
    setResult(null);

    const res = await getAiQueryResponse(query, transactions, budgets);

    if (res.error || !res.result) {
      toast({
        title: "Query Failed",
        description: res.error || "An unknown error occurred.",
        variant: "destructive",
      });
    } else {
      setResult(res.result);
    }
    setIsLoading(false);
  };
  
  const handleReset = () => {
    setResult(null);
    setQuery("");
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-muted/20 col-span-1 lg:col-span-2 card-interactive group">
      <CardHeader className="z-10">
        <div className="flex items-center gap-3">
            <div className="w-20 h-20 flex items-center justify-center">
                <AskAiCharacter />
          </div>
            <div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Ask AI</CardTitle>
                <CardDescription>
                Ask questions about your finances in plain English.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center text-center">
        {isLoading ? (
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        ) : result ? (
          <div className="text-left text-sm space-y-2">
            <p><span className="font-bold">Q:</span> {query}</p>
            <p><span className="font-bold text-primary">A:</span> {result.answer}</p>
            {result.chartData && <DynamicChart chartData={result.chartData} />}
          </div>
        ) : (
             <div className="flex flex-col items-center gap-2">
                <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., How much did I spend on groceries in October?"
                    className="bg-background"
                />
            </div>
        )}
      </CardContent>
       <CardFooter className="z-10">
        <Button
          onClick={result ? handleReset : handleSubmit}
          disabled={isLoading || transactions.length === 0 || (!result && !query)}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : result ? (
             <RefreshCw className="mr-2 h-4 w-4" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Thinking..." : result ? "Ask Again" : "Ask AI"}
        </Button>
      </CardFooter>
    </Card>
  );
}
