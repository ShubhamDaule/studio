
"use client";

import * as React from "react";
import type { Transaction, Budget } from "@/lib/types";
import { AnomaliesCard } from "@/components/dashboard/cards/anomalies-card";
import { FinancialCoachCard } from "@/components/dashboard/cards/financial-coach-card";
import { AskAiCard } from "../cards/ask-ai-card";
import { Upload } from "lucide-react";


type InsightsTabProps = {
    allTransactions: Transaction[];
    budgets: Budget[];
    isMockData: boolean;
};

export function InsightsTab({ allTransactions, budgets, isMockData }: InsightsTabProps) {
    const spendingTransactions = React.useMemo(() => 
        allTransactions.filter(t => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment"),
    [allTransactions]);

    if (isMockData) {
        return (
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8 rounded-lg">
                    <Upload className="w-16 h-16 text-primary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Unlock AI Insights</h3>
                    <p className="text-muted-foreground max-w-md">
                        The AI Coach, Anomaly Detective, and Ask AI features are disabled while using mock data. Upload your own statements to get personalized analysis.
                    </p>
                </div>
                <FinancialCoachCard transactions={spendingTransactions} />
                <AnomaliesCard transactions={spendingTransactions} />
                <AskAiCard transactions={allTransactions} budgets={budgets} />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
            <FinancialCoachCard transactions={spendingTransactions} />
            <AnomaliesCard transactions={spendingTransactions} />
            <AskAiCard transactions={allTransactions} budgets={budgets} />
        </div>
    );
}
