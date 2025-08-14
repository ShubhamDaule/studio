
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
    const spendingTransactions = React.useMemo(() => {
        if (!allTransactions) return [];
        return allTransactions.filter(t => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment")
    }, [allTransactions]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
            <FinancialCoachCard transactions={spendingTransactions} />
            <AnomaliesCard transactions={spendingTransactions} />
            <AskAiCard transactions={allTransactions} budgets={budgets} />
        </div>
    );
}
