
"use client";

import * as React from "react";
import { AnomaliesCard } from "@/components/dashboard/cards/anomalies-card";
import { FinancialCoachCard } from "@/components/dashboard/cards/financial-coach-card";
import { AskAiCard } from "@/components/dashboard/cards/ask-ai-card";
import { useDashboardContext } from "@/context/dashboard-context";


export function InsightsTab() {
    const { allTransactions, activeBudgets } = useDashboardContext();
    const spendingTransactions = React.useMemo(() => 
        allTransactions.filter(t => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment"),
    [allTransactions]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
            <FinancialCoachCard transactions={spendingTransactions} />
            <AnomaliesCard transactions={spendingTransactions} />
            <AskAiCard transactions={allTransactions} budgets={activeBudgets} />
        </div>
    );
}
