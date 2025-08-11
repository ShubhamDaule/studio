
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
import { Sparkles, Loader2, BrainCircuit } from "lucide-react";
import { AskAiCharacter } from "../../characters/ask-ai-character";
import { getAiQueryResponse } from "@/lib/actions";
import { DynamicChart } from "../charts/dynamic-chart";

interface AskAiCardProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function AskAiCard({ transactions, budgets }: AskAiCardProps) {
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<QueryResult | null>(null);
  
  const handleQuery = async () => {
    setIsLoading(true);
    setResult(null);

    const response = await getAiQueryResponse(query, transactions, budgets);
    
    if (response.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      });
    } else if (response.result) {
      setResult(response.result);
    }
    
    setIsLoading(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleQuery();
    }
  };

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
        <div className="flex flex-col items-center gap-2">
            <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., How much did I spend on groceries in October? or Show a pie chart of my spending."
                className="bg-background"
                disabled={isLoading}
            />
             <div className="w-full min-h-[10rem] p-4 text-sm rounded-lg bg-background/50 border border-border text-left overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <BrainCircuit className="h-8 w-8 mb-2 animate-pulse" />
                        <p>Thinking...</p>
                    </div>
                ) : result ? (
                    <div>
                        <p className="whitespace-pre-wrap">{result.answer}</p>
                        {result.chartData && (
                            <DynamicChart chartData={result.chartData} />
                        )}
                    </div>
                ) : null}
            </div>
        </div>
      </CardContent>
       <CardFooter className="z-10">
        <Button
          onClick={handleQuery}
          disabled={isLoading || !query || transactions.length === 0}
          className="w-full"
        >
          {isLoading ? (
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ): (
             <Sparkles className="mr-2 h-4 w-4" />
          )}
         {isLoading ? "Thinking..." : "Ask AI"}
        </Button>
      </CardFooter>
    </Card>
  );
}
