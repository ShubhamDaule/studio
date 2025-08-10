
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
import { Sparkles, Bot } from "lucide-react";
import { FinancialCoach } from "../../characters/financial-coach";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialCoachCardProps {
  transactions: Transaction[];
}

export function FinancialCoachCard({ transactions }: FinancialCoachCardProps) {
  const { toast } = useToast();
  
  const handleDisabledClick = () => {
    toast({
        variant: "destructive",
        title: "Feature Disabled",
        description: "The AI features have been disabled.",
    });
  }
  
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
        <div className="flex flex-col items-center gap-2">
            <Bot className="w-10 h-10 text-primary" />
            <p className="font-semibold">This feature is disabled</p>
            <p className="text-sm text-muted-foreground max-w-xs">The AI flows have been removed from the application.</p>
        </div>
      </CardContent>
       <CardFooter className="z-10">
        <Button
          onClick={handleDisabledClick}
          disabled={true}
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Ask Your Coach
        </Button>
      </CardFooter>
    </Card>
  );
}
