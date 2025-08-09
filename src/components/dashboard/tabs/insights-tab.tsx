
"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { AnomaliesCard } from "@/components/cards/anomalies-card";
import { TipsPanel } from "@/components/cards/tips-panel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AskAiCharacter } from "@/components/dashboard/ask-ai-character";
import type { Transaction } from "@/lib/types";


const PremiumUpgradeCard = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="h-full flex flex-col overflow-hidden bg-muted/20 col-span-1 lg:col-span-2 cursor-help border-dashed border-primary/50">
             <CardContent className="flex-1 flex flex-col justify-center items-center text-center p-6">
                <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-4">
                    <div className="w-20 h-20 flex-shrink-0">
                        <AskAiCharacter />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold">Unlock Ask AI</h3>
                        <p className="text-muted-foreground">
                            Upgrade to Premium to ask questions, generate simple graphs, and get instant insights into your finances.
                        </p>
                        <p className="text-xs text-muted-foreground pt-2">Hover to learn more</p>
                    </div>
                </div>
              </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="p-0 max-w-sm" side="top" align="center">
          <PremiumFeaturesTooltipContent />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

const PremiumFeaturesTooltipContent = () => (
    <div className="space-y-3 p-2">
        <p className="text-center font-bold text-lg text-primary">Unlock Premium Features!</p>
        <p className="text-center text-sm">Includes all Pro features, plus:</p>
        <ul className="list-none space-y-2 text-sm text-foreground">
            <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>**Ask AI**: Get instant answers to your financial questions by chatting with our advanced AI assistant.</span>
            </li>
        </ul>
        <p className="text-center text-xs text-muted-foreground pt-2">Enable "Premium Mode" at the top right to try it out.</p>
    </div>
);

type InsightsTabProps = {
    allTransactions: Transaction[];
};

export function InsightsTab({ allTransactions }: InsightsTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <AnomaliesCard transactions={allTransactions} />
            <TipsPanel transactions={allTransactions} />
            <PremiumUpgradeCard />
        </div>
    );
}
