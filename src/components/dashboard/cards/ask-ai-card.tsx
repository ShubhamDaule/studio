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
import { Sparkles } from "lucide-react";
import { AskAiCharacter } from "../../characters/ask-ai-character";

interface AskAiCardProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function AskAiCard({ transactions, budgets }: AskAiCardProps) {
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  
  const handleDisabledClick = () => {
    toast({
        variant: "destructive",
        title: "Feature Disabled",
        description: "The AI features have been disabled.",
    });
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
        <div className="flex flex-col items-center gap-2">
            <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., How much did I spend on groceries in October?"
                className="bg-background"
                disabled={true}
            />
        </div>
      </CardContent>
       <CardFooter className="z-10">
        <Button
          onClick={handleDisabledClick}
          disabled={true}
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Ask AI
        </Button>
      </CardFooter>
    </Card>
  );
}
